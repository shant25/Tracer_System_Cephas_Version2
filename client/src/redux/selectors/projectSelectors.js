/**
 * Project-related selectors for accessing the projects state
 */
import { createSelector } from 'reselect';
import { getTasksList } from './taskSelectors';

// Basic selectors
export const getProjectsState = (state) => state.projects;
export const getProjectsList = (state) => state.projects.items || [];
export const getProjectsLoading = (state) => state.projects.loading;
export const getProjectsError = (state) => state.projects.error;
export const getTotalProjectsCount = (state) => state.projects.totalCount || 0;

// Get project by ID
export const getProjectById = (state, projectId) => {
  const projects = getProjectsList(state);
  return projects.find(project => project.id.toString() === projectId.toString()) || null;
};

// Get projects by status
export const getProjectsByStatus = createSelector(
  [getProjectsList, (_, status) => status],
  (projects, status) => {
    if (!status) return projects;
    if (Array.isArray(status)) {
      return projects.filter(project => status.includes(project.status));
    }
    return projects.filter(project => project.status === status);
  }
);

// Get projects by client
export const getProjectsByClient = createSelector(
  [getProjectsList, (_, clientId) => clientId],
  (projects, clientId) => {
    if (!clientId) return projects;
    return projects.filter(project => 
      project.clientId && 
      project.clientId.toString() === clientId.toString()
    );
  }
);

// Get projects by manager
export const getProjectsByManager = createSelector(
  [getProjectsList, (_, managerId) => managerId],
  (projects, managerId) => {
    if (!managerId) return projects;
    return projects.filter(project => 
      project.managerId && 
      project.managerId.toString() === managerId.toString()
    );
  }
);

// Get active projects
export const getActiveProjects = createSelector(
  [getProjectsList],
  (projects) => {
    return projects.filter(project => 
      project.status === 'ACTIVE' || 
      project.status === 'IN_PROGRESS'
    );
  }
);

// Get completed projects
export const getCompletedProjects = createSelector(
  [getProjectsList],
  (projects) => {
    return projects.filter(project => project.status === 'COMPLETED');
  }
);

// Get project with tasks
export const getProjectWithTasks = createSelector(
  [getProjectById, getTasksList],
  (project, tasks) => {
    if (!project) return null;
    
    const projectTasks = tasks.filter(task => 
      task.projectId && 
      task.projectId.toString() === project.id.toString()
    );
    
    return {
      ...project,
      tasks: projectTasks,
      taskStats: {
        total: projectTasks.length,
        completed: projectTasks.filter(task => task.status === 'COMPLETED').length,
        inProgress: projectTasks.filter(task => task.status === 'IN_PROGRESS').length,
        todo: projectTasks.filter(task => task.status === 'TODO').length,
        cancelled: projectTasks.filter(task => task.status === 'CANCELLED').length
      }
    };
  }
);

// Get project completion percentage
export const getProjectCompletion = createSelector(
  [getProjectWithTasks],
  (projectWithTasks) => {
    if (!projectWithTasks || !projectWithTasks.tasks.length) return 0;
    
    const { completed, total } = projectWithTasks.taskStats;
    return Math.round((completed / total) * 100);
  }
);

// Get projects sorted by priority
export const getProjectsByPriority = createSelector(
  [getProjectsList],
  (projects) => {
    return [...projects].sort((a, b) => {
      const priorityOrder = { HIGH: 0, MEDIUM: 1, LOW: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  }
);

// Get recent projects
export const getRecentProjects = createSelector(
  [getProjectsList],
  (projects) => {
    return [...projects]
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      .slice(0, 5);
  }
);

// Get projects stats summary
export const getProjectsStats = createSelector(
  [getProjectsList],
  (projects) => {
    return {
      total: projects.length,
      active: projects.filter(p => p.status === 'ACTIVE' || p.status === 'IN_PROGRESS').length,
      completed: projects.filter(p => p.status === 'COMPLETED').length,
      cancelled: projects.filter(p => p.status === 'CANCELLED').length,
      onHold: projects.filter(p => p.status === 'ON_HOLD').length,
      byPriority: {
        high: projects.filter(p => p.priority === 'HIGH').length,
        medium: projects.filter(p => p.priority === 'MEDIUM').length,
        low: projects.filter(p => p.priority === 'LOW').length
      }
    };
  }
);

// Get projects by search term
export const searchProjects = createSelector(
  [getProjectsList, (_, searchTerm) => searchTerm],
  (projects, searchTerm) => {
    if (!searchTerm) return projects;
    
    const search = searchTerm.toLowerCase();
    return projects.filter(project => 
      (project.name && project.name.toLowerCase().includes(search)) ||
      (project.description && project.description.toLowerCase().includes(search)) ||
      (project.clientName && project.clientName.toLowerCase().includes(search)) ||
      (project.managerName && project.managerName.toLowerCase().includes(search))
    );
  }
);

// Get projects with budget information
export const getProjectsWithBudget = createSelector(
  [getProjectsList],
  (projects) => {
    return projects.map(project => {
      if (!project.budget) return project;
      
      const spent = project.expenses ? project.expenses.reduce((sum, exp) => sum + exp.amount, 0) : 0;
      const budgetLeft = project.budget - spent;
      const budgetPercentUsed = project.budget > 0 ? Math.round((spent / project.budget) * 100) : 0;
      
      return {
        ...project,
        budgetInfo: {
          total: project.budget,
          spent,
          remaining: budgetLeft,
          percentUsed: budgetPercentUsed,
          overBudget: budgetLeft < 0
        }
      };
    });
  }
);

// Get projects by date range
export const getProjectsByDateRange = createSelector(
  [getProjectsList, (_, startDate, endDate) => ({ startDate, endDate })],
  (projects, { startDate, endDate }) => {
    if (!startDate && !endDate) return projects;
    
    return projects.filter(project => {
      const projectDate = new Date(project.startDate);
      
      if (startDate && endDate) {
        return projectDate >= new Date(startDate) && projectDate <= new Date(endDate);
      } else if (startDate) {
        return projectDate >= new Date(startDate);
      } else if (endDate) {
        return projectDate <= new Date(endDate);
      }
      
      return true;
    });
  }
);

// Get upcoming deadline projects
export const getUpcomingDeadlineProjects = createSelector(
  [getProjectsList],
  (projects) => {
    const now = new Date();
    const twoWeeksFromNow = new Date();
    twoWeeksFromNow.setDate(now.getDate() + 14);
    
    return projects
      .filter(project => {
        if (!project.dueDate || project.status === 'COMPLETED' || project.status === 'CANCELLED') return false;
        
        const dueDate = new Date(project.dueDate);
        return dueDate > now && dueDate <= twoWeeksFromNow;
      })
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  }
);

// Get overdue projects
export const getOverdueProjects = createSelector(
  [getProjectsList],
  (projects) => {
    const now = new Date();
    
    return projects
      .filter(project => {
        if (!project.dueDate || project.status === 'COMPLETED' || project.status === 'CANCELLED') return false;
        
        const dueDate = new Date(project.dueDate);
        return dueDate < now;
      })
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  }
);

export default {
  getProjectsState,
  getProjectsList,
  getProjectsLoading,
  getProjectsError,
  getTotalProjectsCount,
  getProjectById,
  getProjectsByStatus,
  getProjectsByClient,
  getProjectsByManager,
  getActiveProjects,
  getCompletedProjects,
  getProjectWithTasks,
  getProjectCompletion,
  getProjectsByPriority,
  getRecentProjects,
  getProjectsStats,
  searchProjects,
  getProjectsWithBudget,
  getProjectsByDateRange,
  getUpcomingDeadlineProjects,
  getOverdueProjects
};