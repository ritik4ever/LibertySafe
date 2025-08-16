// Switch to the libertysafe database
db = db.getSiblingDB('libertysafe');

// Create collections with proper indexes
db.createCollection('users');
db.createCollection('documents');
db.createCollection('likes');

// Create indexes for better performance
db.users.createIndex({ "address": 1 }, { unique: true });
db.users.createIndex({ "username": 1 });
db.users.createIndex({ "joinedAt": -1 });

db.documents.createIndex({ "title": "text", "description": "text", "tags": "text" });
db.documents.createIndex({ "category": 1, "createdAt": -1 });
db.documents.createIndex({ "authorAddress": 1, "createdAt": -1 });
db.documents.createIndex({ "fileHash": 1 }, { unique: true });
db.documents.createIndex({ "tags": 1 });
db.documents.createIndex({ "ordinalsId": 1 });

db.likes.createIndex({ "user": 1, "document": 1 }, { unique: true });

// Insert sample data
db.users.insertOne({
    address: "bc1qexample123...",
    username: "demo_user",
    bio: "Demo user for LibertySafe",
    joinedAt: new Date(),
    isVerified: false,
    preferences: {
        defaultEncryption: true,
        publicProfile: true,
        emailNotifications: false
    }
});

print("✅ LibertySafe database initialized successfully!");