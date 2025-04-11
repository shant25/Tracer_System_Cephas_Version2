/**
 * Task-related selectors for accessing the tasks state
 */
import { createSelector } from 'reselect';

// Basic selectors
export const getTasksState = (state) => state.tasks;
export const getTasksList = (state) => state.tasks.items || [];
export const getTasksLoading = (state) => state.tasks.loading;
export const getTasksError = (state) => state.tasks.error;
export const getTotalTasksCount = (state) => state.tasks.totalCount || 0;

// Get task by ID
export const getTaskById = (state, taskId) => {
  const tasks = getTasksList(state);
  return tasks.find(task => task.id.toString() === taskId.toString()) || null;
};

// Get tasks by status
export const getTasksByStatus = createSelector(
  [getTasksList, (_, status) => status],
  (tasks, status) => {
    if (!status) return tasks;
    if (Array.isArray(status)) {
      return tasks.filter(task => status.includes(task.status));
    }
    return tasks.filter(task => task.status === status);
  }
);

// Get tasks by priority
export const getTasksByPriority = createSelector(
  [getTasksList, (_, priority) => priority],
  (tasks, priority) => {
    if (!priority) return tasks;
    if (Array.isArray(priority)) {
      return tasks.filter(task => priority.includes(task.priority));
    }
    return tasks.filter(task => task.priority === priority);
  }
);

// Get tasks by assignee
export const getTasksByAssignee = createSelector(
  [getTasksList, (_, assigneeId) => assigneeId],
  (tasks, assigneeId) => {
    if (!assigneeId) return tasks;
    return tasks.filter(task => 
      task.assigneeId && 
      task.assigneeId.toString() === assigneeId.toString()
    );
  }
);

// Get tasks by project
export const getTasksByProject = createSelector(
  [getTasksList, (_, projectId) => projectId],
  (tasks, projectId) => {
    if (!projectId) return tasks;
    return tasks.filter(task => 
      task.projectId && 
      task.projectId.toString() === projectId.toString()
    );
  }
);

// Get tasks by due date range
export const getTasksByDueDate = createSelector(
  [getTasksList, (_, startDate, endDate) => ({ startDate, endDate })],
  (tasks, { startDate, endDate }) => {
    return tasks.filter(task => {
      if (!task.dueDate) return false;
      
      const taskDueDate = new Date(task.dueDate);
      
      if (startDate && endDate) {
        return taskDueDate >= new Date(startDate) && taskDueDate <= new Date(endDate);
      } else if (startDate) {
        return taskDueDate >= new Date(startDate);
      } else if (endDate) {
        return taskDueDate <= new Date(endDate);
      }
      
      return true;
    });
  }
);

// Get overdue tasks
export const getOverdueTasks = createSelector(
  [getTasksList],
  (tasks) => {
    const now = new Date();
    return tasks.filter(task => 
      task.dueDate && 
      new Date(task.dueDate) < now && 
      task.status !== 'COMPLETED' &&
      task.status !== 'CANCELLED'
    );
  }
);

// Get upcoming tasks due today
export const getTasksDueToday = createSelector(
  [getTasksList],
  (tasks) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    return tasks.filter(task => {
      if (!task.dueDate) return false;
      
      const dueDate = new Date(task.dueDate);
      dueDate.setHours(0, 0, 0, 0);
      
      return dueDate.getTime() === today.getTime() && 
             task.status !== 'COMPLETED' && 
             task.status !== 'CANCELLED';
    });
  }
);

// Get upcoming tasks due this week
export const getTasksDueThisWeek = createSelector(
  [getTasksList],
  (tasks) => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay()); // Sunday
    startOfWeek.setHours(0, 0, 0, 0);
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Saturday
    endOfWeek.setHours(23, 59, 59, 999);
    
    return tasks.filter(task => {
      if (!task.dueDate) return false;
      
      const dueDate = new Date(task.dueDate);
      
      return dueDate >= startOfWeek && 
             dueDate <= endOfWeek && 
             task.status !== 'COMPLETED' && 
             task.status !== 'CANCELLED';
    });
  }
);

// Get task status counts
export const getTaskStatusCounts = createSelector(
  [getTasksList],
  (tasks) => {
    const counts = {
      total: tasks.length,
      todo: 0,
      inProgress: 0,
      completed: 0,
      cancelled: 0
    };
    
    tasks.forEach(task => {
      if (task.status === 'TODO') {
        counts.todo++;
      } else if (task.status === 'IN_PROGRESS') {
        counts.inProgress++;
      } else if (task.status === 'COMPLETED') {
        counts.completed++;
      } else if (task.status === 'CANCELLED') {
        counts.cancelled++;
      }
    });
    
    return counts;
  }
);

// Get task priority counts
export const getTaskPriorityCounts = createSelector(
  [getTasksList],
  (tasks) => {
    const counts = {
      total: tasks.length,
      high: 0,
      medium: 0,
      low: 0
    };
    
    tasks.forEach(task => {
      if (task.priority === 'HIGH') {
        counts.high++;
      } else if (task.priority === 'MEDIUM') {
        counts.medium++;
      } else if (task.priority === 'LOW') {
        counts.low++;
      }
    });
    
    return counts;
  }
);

// Get unassigned tasks
export const getUnassignedTasks = createSelector(
  [getTasksList],
  (tasks) => {
    return tasks.filter(task => 
      !task.assigneeId || 
      task.assigneeId === null || 
      task.assigneeId === ''
    );
  }
);

// Search tasks
export const searchTasks = createSelector(
  [getTasksList, (_, query) => query],
  (tasks, query) => {
    if (!query) return tasks;
    
    const searchTerm = query.toLowerCase();
    return tasks.filter(task => 
      (task.title && task.title.toLowerCase().includes(searchTerm)) ||
      (task.description && task.description.toLowerCase().includes(searchTerm))
    );
  }
);

// Get assignee workload
export const getAssigneeWorkload = createSelector(
  [getTasksList],
  (tasks) => {
    const workload = {};
    
    tasks.forEach(task => {
      if (task.assigneeId && task.status !== 'COMPLETED' && task.status !== 'CANCELLED') {
        const assigneeId = task.assigneeId.toString();
        
        if (!workload[assigneeId]) {
          workload[assigneeId] = {
            total: 0,
            high: 0,
            medium: 0,
            low: 0
          };
        }
        
        workload[assigneeId].total++;
        
        if (task.priority === 'HIGH') {
          workload[assigneeId].high++;
        } else if (task.priority === 'MEDIUM') {
          workload[assigneeId].medium++;
        } else if (task.priority === 'LOW') {
          workload[assigneeId].low++;
        }
      }
    });
    
    return workload;
  }
);

export default {
  getTasksState,
  getTasksList,
  getTasksLoading,
  getTasksError,
  getTotalTasksCount,
  getTaskById,
  getTasksByStatus,
  getTasksByPriority,
  getTasksByAssignee,
  getTasksByProject,
  getTasksByDueDate,
  getOverdueTasks,
  getTasksDueToday,
  getTasksDueThisWeek,
  getTaskStatusCounts,
  getTaskPriorityCounts,
  getUnassignedTasks,
  searchTasks,
  getAssigneeWorkload
};