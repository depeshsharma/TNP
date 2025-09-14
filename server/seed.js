const mongoose = require('mongoose');
const Post = require('./models/Post');
const User = require('./models/User');
require('dotenv').config({ path: './config.env' });

const samplePosts = [
  {
    title: "Software Engineer Position at TechCorp",
    content: "<p>We are looking for a talented Software Engineer to join our team. This is a full-time position with great benefits and growth opportunities.</p><p><strong>Requirements:</strong></p><ul><li>Bachelor's degree in Computer Science or related field</li><li>3+ years of experience in software development</li><li>Proficiency in JavaScript, React, and Node.js</li><li>Strong problem-solving skills</li></ul><p>If you're interested, please apply through our careers page.</p>",
    category: "job",
    tags: ["software", "engineering", "full-time", "javascript"],
    author: "HR Team",
    featured: true,
    views: 150,
    likes: 23
  },
  {
    title: "Summer Internship Program 2024",
    content: "<p>Join our 8-week summer internship program designed for students to gain real-world experience in software development.</p><p><strong>Program Highlights:</strong></p><ul><li>Mentorship from senior developers</li><li>Hands-on project experience</li><li>Networking opportunities</li><li>Potential for full-time offers</li></ul><p>Applications are now open! Deadline: March 15, 2024</p>",
    category: "internship",
    tags: ["internship", "summer", "2024", "students"],
    author: "Recruitment Team",
    featured: true,
    views: 89,
    likes: 15
  },
  {
    title: "React.js Training Workshop",
    content: "<p>Join our comprehensive React.js training workshop designed for beginners and intermediate developers.</p><p><strong>What you'll learn:</strong></p><ul><li>React fundamentals and components</li><li>State management with hooks</li><li>Routing and navigation</li><li>API integration</li><li>Best practices and patterns</li></ul><p>Date: March 20-22, 2024<br>Location: Computer Lab 3<br>Registration required</p>",
    category: "training",
    tags: ["react", "training", "workshop", "frontend"],
    author: "Training Department",
    featured: false,
    views: 67,
    likes: 12
  },
  {
    title: "Placement Drive - Amazon",
    content: "<p>Amazon is conducting a placement drive for Software Development Engineer positions.</p><p><strong>Eligibility Criteria:</strong></p><ul><li>B.Tech in CSE/IT or related branches</li><li>Minimum 7.0 CGPA</li><li>Strong coding skills</li><li>Good communication skills</li></ul><p><strong>Process:</strong></p><ol><li>Online Assessment</li><li>Technical Interview</li><li>HR Interview</li></ol><p>Date: March 25, 2024<br>Time: 9:00 AM<br>Venue: Main Auditorium</p>",
    category: "placement",
    tags: ["amazon", "placement", "sde", "2024"],
    author: "Placement Cell",
    featured: true,
    views: 234,
    likes: 45
  },
  {
    title: "Important: Resume Submission Deadline",
    content: "<p>This is a reminder that the deadline for resume submission for the upcoming placement season is approaching.</p><p><strong>Deadline:</strong> March 10, 2024</p><p><strong>Instructions:</strong></p><ul><li>Submit your resume in PDF format only</li><li>File name should be: YourName_RollNumber.pdf</li><li>Email to: placements@university.edu</li><li>Subject: Resume Submission - [Your Name]</li></ul><p>Late submissions will not be accepted. Please ensure your resume is updated and error-free.</p>",
    category: "announcement",
    tags: ["deadline", "resume", "placement", "important"],
    author: "Placement Office",
    featured: false,
    views: 156,
    likes: 8
  },
  {
    title: "Tips for Technical Interviews",
    content: "<p>Here are some valuable tips to help you succeed in technical interviews:</p><p><strong>Preparation:</strong></p><ul><li>Practice coding problems daily</li><li>Review data structures and algorithms</li><li>Prepare for system design questions</li><li>Mock interviews with peers</li></ul><p><strong>During the Interview:</strong></p><ul><li>Think out loud</li><li>Ask clarifying questions</li><li>Start with a brute force approach</li><li>Optimize step by step</li></ul><p><strong>Common Topics:</strong></p><ul><li>Arrays and Strings</li><li>Linked Lists</li><li>Trees and Graphs</li><li>Dynamic Programming</li></ul>",
    category: "general",
    tags: ["interview", "tips", "preparation", "coding"],
    author: "Career Guidance Team",
    featured: false,
    views: 98,
    likes: 19
  }
];

const sampleUsers = [
  {
    name: "John Doe",
    email: "john@example.com",
    password: "password123",
    department: "Computer Science",
    year: "4th",
    role: "admin"
  },
  {
    name: "Jane Smith",
    email: "jane@example.com",
    password: "password123",
    department: "Information Technology",
    year: "3rd",
    role: "user"
  },
  {
    name: "Mike Johnson",
    email: "mike@example.com",
    password: "password123",
    department: "Electronics",
    year: "2nd",
    role: "user"
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/tnp-website');
    console.log('Connected to MongoDB');

    // Clear existing data
    await Post.deleteMany({});
    await User.deleteMany({});
    console.log('Cleared existing data');

    // Create sample users
    const users = await User.insertMany(sampleUsers);
    console.log(`Created ${users.length} users`);

    // Create sample posts
    const posts = await Post.insertMany(samplePosts);
    console.log(`Created ${posts.length} posts`);

    console.log('Database seeded successfully!');
    console.log('\nSample login credentials:');
    console.log('Admin: john@example.com / password123');
    console.log('User: jane@example.com / password123');
    console.log('User: mike@example.com / password123');

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

// Run the seed function
seedDatabase();
