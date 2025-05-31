// middleware/uploadMiddleware.js
import multer from 'multer';
import { bucket } from '../config/cloudStorage.js';
import path from 'path';

// Configure multer for memory storage
const storage = multer.memoryStorage();

// File filter for images only
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

// Multer configuration
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// Function to upload file to Google Cloud Storage
const uploadToGCS = (file, folder = 'avatars') => {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('No file provided'));
      return;
    }

    // Generate unique filename
    const fileName = `${folder}/${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
    
    const fileUpload = bucket.file(fileName);
    
    const stream = fileUpload.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
      resumable: false,
    });

    stream.on('error', (err) => {
      reject(err);
    });

    stream.on('finish', async () => {
      try {
        // Make the file public
        await fileUpload.makePublic();
        
        // Get the public URL
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
        resolve(publicUrl);
      } catch (error) {
        reject(error);
      }
    });

    stream.end(file.buffer);
  });
};

// Function to delete file from GCS
const deleteFromGCS = async (fileUrl) => {
  try {
    if (!fileUrl) return;
    const urlParts = fileUrl.split('/');
    const fileName = urlParts.slice(-2).join('/'); // Get 'avatars/filename.jpg'
    
    const file = bucket.file(fileName);
    await file.delete();
    console.log(`File ${fileName} deleted successfully`);
  } catch (error) {
    console.error('Error deleting file from GCS:', error);
  }
};

export { upload, uploadToGCS, deleteFromGCS };