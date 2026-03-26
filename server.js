const dotenv = require('dotenv');
dotenv.config(); // This loads your .env variables

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware to handle JSON data
app.use(express.json());
app.use(cors());

// 1. DATABASE CONNECTION
// This uses the link from your .env file
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ Success: Connected to MongoDB Atlas!"))
  .catch(err => console.log("❌ DB Connection Error:", err));

// 2. DATA STRUCTURE (Schema)
const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  isCompleted: { type: Boolean, default: false }
});

const Task = mongoose.model('Task', taskSchema);

// 3. API ROUTES (To create and see tasks)
app.get('/', (req, res) => {
  res.send("Task Manager API is Running...");
});

// Route to get all tasks
app.get('/tasks', async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

// Route to add a new task
app.post('/tasks', async (req, res) => {
  try {
    const newTask = new Task(req.body);
    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 4. SERVER START
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});