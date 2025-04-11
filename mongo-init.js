// Initialize MongoDB with default admin user and initial database setup
db = db.getSiblingDB('tracer_app');

// Create admin user if not exists
if (db.getUser('admin') == null) {
  db.createUser({
    user: 'admin',
    pwd: 'admin_password',
    roles: [
      { role: 'readWrite', db: 'tracer_app' },
      { role: 'dbAdmin', db: 'tracer_app' }
    ]
  });
}

// Create collections
db.createCollection('users');
db.createCollection('projects');
db.createCollection('tasks');

// Create indexes
db.users.createIndex({ "email": 1 }, { unique: true });
db.projects.createIndex({ "name": 1 });
db.projects.createIndex({ "owner": 1 });
db.projects.createIndex({ "members": 1 });
db.tasks.createIndex({ "project": 1 });
db.tasks.createIndex({ "assignedTo": 1 });
db.tasks.createIndex({ "status": 1 });
db.tasks.createIndex({ "priority": 1 });

// Insert default admin user
const adminExists = db.users.findOne({ email: "admin@tracer-app.com" });
if (!adminExists) {
  db.users.insertOne({
    name: "Admin User",
    email: "admin@tracer-app.com",
    password: "$2a$10$ySGlDhg1G7DQZ.k95z5CG.M3VgKb/tvAr6XyQGCjkn2kxwZ.BG2iK", // hashed 'admin123'
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date()
  });
}