const fs = require('fs');
const path = require('path');
const readline = require('readline');
const mongoose = require('mongoose');

// Read .env.local to find DATABASE connection string
const envPath = path.join(__dirname, '..', '.env.local');
let mongoUri = '';

try {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const match = envContent.match(/DATABASE=(.+)/);
  if (match && match[1]) {
    mongoUri = match[1].trim();
  }
} catch (err) {
  console.error('Error reading .env.local:', err.message);
  process.exit(1);
}

if (!mongoUri) {
  console.error('Could not find DATABASE variable in .env.local');
  process.exit(1);
}

// Define User Schema (Simplified version of app/_models/userModel.js for this script)
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ['user', 'guide', 'admin'], default: 'user' },
}, { strict: false }); // strict: false allows us to not define every field

const User = mongoose.model('User', userSchema);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const connectDB = async () => {
    try {
        await mongoose.connect(mongoUri);
        console.log('Connected to MongoDB.');
    } catch (err) {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    }
};

const updateRole = async () => {
  await connectDB();

  rl.question('Enter the email of the user to promote to ADMIN: ', async (email) => {
    try {
      if (!email) {
        console.log('Email is required.');
        process.exit(0);
      }

      email = email.trim().toLowerCase();
      
      const user = await User.findOne({ email });

      if (!user) {
        console.log(`User with email ${email} not found.`);
        process.exit(0);
      }

      console.log(`Found user: ${user.email} (Current Role: ${user.role})`);

      if (user.role === 'admin') {
          console.log('User is already an admin.');
          process.exit(0);
      }

      user.role = 'admin';
      await user.save();

      console.log(`Successfully updated role for ${email} to 'admin'.`);
    } catch (error) {
      console.error('Error updating user:', error);
    } finally {
      await mongoose.disconnect();
      rl.close();
      process.exit(0);
    }
  });
};

updateRole();
