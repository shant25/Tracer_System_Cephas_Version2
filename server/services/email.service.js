/**
 * Email service for Tracer App
 */
const nodemailer = require('nodemailer');
const config = require('../config/env');
const logger = require('../utils/logger');

// Create mail transporter
let transporter;

// Initialize transporter based on environment
if (config.NODE_ENV === 'production') {
  // Production email configuration
  transporter = nodemailer.createTransport({
    service: config.EMAIL_SERVICE,
    auth: {
      user: config.EMAIL_USER,
      pass: config.EMAIL_PASSWORD
    }
  });
} else {
  // Development email configuration using Ethereal
  const createDevTransporter = async () => {
    try {
      // Generate test SMTP service account
      const testAccount = await nodemailer.createTestAccount();
      
      // Create reusable transporter
      return nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: testAccount.user,
          pass: testAccount.pass
        }
      });
    } catch (error) {
      logger.error('Failed to create dev email transporter', error);
      // Fallback to null transporter
      return {
        sendMail: async (options) => {
          logger.info('Email sending is disabled. Would have sent:', options);
          return { messageId: 'test-id' };
        }
      };
    }
  };
  
  createDevTransporter()
    .then(devTransporter => {
      transporter = devTransporter;
    })
    .catch(error => {
      logger.error('Error creating email transporter', error);
    });
}

/**
 * Send email
 * @param {Object} options - Email options
 * @returns {Promise} Email send result
 */
const sendEmail = async (options) => {
  try {
    const mailOptions = {
      from: `Tracer App <${config.EMAIL_USER || 'noreply@tracerapp.com'}>`,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html
    };
    
    const info = await transporter.sendMail(mailOptions);
    
    // Log email preview URL in development
    if (config.NODE_ENV !== 'production' && info.messageId) {
      logger.info(`Email preview URL: ${nodemailer.getTestMessageUrl(info)}`);
    }
    
    return info;
  } catch (error) {
    logger.error('Error sending email:', error);
    throw error;
  }
};

/**
 * Send welcome email
 * @param {Object} user - User object
 * @returns {Promise} Email send result
 */
const sendWelcomeEmail = async (user) => {
  return sendEmail({
    to: user.email,
    subject: 'Welcome to Tracer App!',
    text: `Hi ${user.firstName},\n\nWelcome to Tracer App! We're excited to have you on board.\n\nYou can now log in to your account at ${config.APP_URL} and start tracking your projects and tasks.\n\nIf you have any questions, please don't hesitate to contact our support team.\n\nBest regards,\nThe Tracer App Team`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Welcome to Tracer App!</h2>
        <p>Hi ${user.firstName},</p>
        <p>Welcome to Tracer App! We're excited to have you on board.</p>
        <p>You can now log in to your account at <a href="${config.APP_URL}">${config.APP_URL}</a> and start tracking your projects and tasks.</p>
        <p>If you have any questions, please don't hesitate to contact our support team.</p>
        <p>Best regards,<br>The Tracer App Team</p>
      </div>
    `
  });
};

/**
 * Send password reset email
 * @param {Object} user - User object
 * @param {String} resetUrl - Password reset URL
 * @returns {Promise} Email send result
 */
const sendPasswordResetEmail = async (user, resetUrl) => {
  return sendEmail({
    to: user.email,
    subject: 'Password Reset Request',
    text: `Hi ${user.firstName},\n\nYou requested a password reset for your Tracer App account. Please use the following link to reset your password:\n\n${resetUrl}\n\nThis link will expire in 10 minutes.\n\nIf you didn't request this, please ignore this email and your password will remain unchanged.\n\nBest regards,\nThe Tracer App Team`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Password Reset Request</h2>
        <p>Hi ${user.firstName},</p>
        <p>You requested a password reset for your Tracer App account. Please click the button below to reset your password:</p>
        <p style="text-align: center;">
          <a href="${resetUrl}" style="display: inline-block; background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">Reset Password</a>
        </p>
        <p>This link will expire in 10 minutes.</p>
        <p>If you didn't request this, please ignore this email and your password will remain unchanged.</p>
        <p>Best regards,<br>The Tracer App Team</p>
      </div>
    `
  });
};

/**
 * Send password changed email
 * @param {Object} user - User object
 * @returns {Promise} Email send result
 */
const sendPasswordChangedEmail = async (user) => {
  return sendEmail({
    to: user.email,
    subject: 'Password Changed Successfully',
    text: `Hi ${user.firstName},\n\nThis is a confirmation that the password for your Tracer App account has been changed.\n\nIf you did not make this change, please contact our support team immediately.\n\nBest regards,\nThe Tracer App Team`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Password Changed Successfully</h2>
        <p>Hi ${user.firstName},</p>
        <p>This is a confirmation that the password for your Tracer App account has been changed.</p>
        <p>If you did not make this change, please contact our support team immediately.</p>
        <p>Best regards,<br>The Tracer App Team</p>
      </div>
    `
  });
};

/**
 * Send project invitation email
 * @param {Object} user - User object
 * @param {Object} project - Project object
 * @param {String} role - User role in project
 * @param {Object} inviter - User who sent the invitation
 * @returns {Promise} Email send result
 */
const sendProjectInvitationEmail = async (user, project, role, inviter) => {
  const projectUrl = `${config.APP_URL}/projects/${project._id}`;
  
  return sendEmail({
    to: user.email,
    subject: `You've been invited to ${project.name}`,
    text: `Hi ${user.firstName},\n\n${inviter.firstName} ${inviter.lastName} has invited you to join the project "${project.name}" as a ${role}.\n\nYou can access the project by visiting: ${projectUrl}\n\nBest regards,\nThe Tracer App Team`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Project Invitation</h2>
        <p>Hi ${user.firstName},</p>
        <p><strong>${inviter.firstName} ${inviter.lastName}</strong> has invited you to join the project "<strong>${project.name}</strong>" as a <strong>${role}</strong>.</p>
        <p style="text-align: center;">
          <a href="${projectUrl}" style="display: inline-block; background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">View Project</a>
        </p>
        <p>Best regards,<br>The Tracer App Team</p>
      </div>
    `
  });
};

/**
 * Send task assignment email
 * @param {Object} user - User object
 * @param {Object} task - Task object
 * @param {Object} project - Project object
 * @param {Object} assigner - User who assigned the task
 * @returns {Promise} Email send result
 */
const sendTaskAssignmentEmail = async (user, task, project, assigner) => {
  const taskUrl = `${config.APP_URL}/projects/${project._id}/tasks/${task._id}`;
  
  return sendEmail({
    to: user.email,
    subject: `Task Assigned: ${task.title}`,
    text: `Hi ${user.firstName},\n\n${assigner.firstName} ${assigner.lastName} has assigned you a task in the project "${project.name}".\n\nTask: ${task.title}\n\nPriority: ${task.priority}\nDue Date: ${task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'Not set'}\n\nYou can view the task details by visiting: ${taskUrl}\n\nBest regards,\nThe Tracer App Team`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Task Assigned</h2>
        <p>Hi ${user.firstName},</p>
        <p><strong>${assigner.firstName} ${assigner.lastName}</strong> has assigned you a task in the project "<strong>${project.name}</strong>".</p>
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 4px; margin: 15px 0;">
          <h3 style="margin-top: 0;">${task.title}</h3>
          <p>${task.description || 'No description provided.'}</p>
          <p>
            <strong>Priority:</strong> ${task.priority}<br>
            <strong>Due Date:</strong> ${task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'Not set'}
          </p>
        </div>
        <p style="text-align: center;">
          <a href="${taskUrl}" style="display: inline-block; background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">View Task</a>
        </p>
        <p>Best regards,<br>The Tracer App Team</p>
      </div>
    `
  });
};

module.exports = {
  sendEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendPasswordChangedEmail,
  sendProjectInvitationEmail,
  sendTaskAssignmentEmail
};