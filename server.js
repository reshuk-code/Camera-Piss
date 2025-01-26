import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.config.js";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url"; // Fix for __dirname in ES modules
import fs from "fs";

dotenv.config();
connectDB();

const app = express();

// Fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set the view engine to EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, "public")));

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "uploads")); // Directory to save uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Save files with a timestamp
  },
});
const upload = multer({ storage });

// Create the uploads directory if it doesn't exist
if (!fs.existsSync(path.join(__dirname, "uploads"))) {
  fs.mkdirSync(path.join(__dirname, "uploads"));
}

// Routes
app.get("/", (req, res) => {
  res.render("index"); // Render the upload form
});

// Upload photo route
app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }
  res.send(`File uploaded successfully: <a href="/uploads/${req.file.filename}">${req.file.filename}</a>`);
});

// Serve uploaded files statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Route to show all uploaded photos
app.get("/victims-photo", (req, res) => {
  const uploadDir = path.join(__dirname, "uploads");

  // Read all files in the 'uploads' directory
  fs.readdir(uploadDir, (err, files) => {
    if (err) {
      return res.status(500).send("Unable to scan files");
    }
    
    // Filter out files that are not images (optional)
    const images = files.filter(file => /\.(jpg|jpeg|png|gif|bmp)$/i.test(file));
    
    // Render the 'victims-photo' view, passing the images list
    res.render("victims-photo", { images });
  });
});

// Start the server
app.listen(process.env.PORT || 2000, () => {
  console.log(`Server is running on port ${process.env.PORT || 2000}`);
});
