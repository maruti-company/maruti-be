const AWS = require('aws-sdk');
const { IMAGE_CONFIG, FILE_CONFIG } = require('../utils/constants');

// Configure AWS
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();

/**
 * Upload a file to S3 (supports images and PDFs)
 * @param {Buffer} fileBuffer - The file buffer
 * @param {string} fileName - The original file name
 * @param {string} mimeType - The MIME type of the file
 * @param {string} quotationId - The quotation ID for folder structure
 * @returns {Promise<string>} - S3 path of the uploaded file
 */
const uploadFile = async (fileBuffer, fileName, mimeType, quotationId) => {
  try {
    // Validate file size
    if (fileBuffer.length > FILE_CONFIG.MAX_FILE_SIZE_BYTES) {
      throw new Error(`File size exceeds maximum limit of ${FILE_CONFIG.MAX_FILE_SIZE_MB}MB`);
    }

    // Validate MIME type
    if (!FILE_CONFIG.ALLOWED_MIME_TYPES.includes(mimeType)) {
      throw new Error(
        `Invalid file type. Only ${FILE_CONFIG.ALLOWED_MIME_TYPES.join(', ')} are allowed`
      );
    }

    // Generate unique filename
    const timestamp = Date.now();
    const fileExtension = fileName.split('.').pop();
    const uniqueFileName = `quotations/${quotationId}/${timestamp}-${Math.random().toString(36).substring(2)}.${fileExtension}`;

    const uploadParams = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: uniqueFileName,
      Body: fileBuffer,
      ContentType: mimeType,
      ACL: 'public-read',
    };

    const result = await s3.upload(uploadParams).promise();

    // Return only the path, not the full URL
    return uniqueFileName;
  } catch (error) {
    console.error('S3 upload error:', error);
    throw new Error(`Failed to upload file: ${error.message}`);
  }
};

/**
 * Upload an image to S3 (legacy function for backward compatibility)
 * @param {Buffer} fileBuffer - The file buffer
 * @param {string} fileName - The original file name
 * @param {string} mimeType - The MIME type of the file
 * @param {string} quotationId - The quotation ID for folder structure
 * @returns {Promise<string>} - S3 path of the uploaded file
 */
const uploadImage = async (fileBuffer, fileName, mimeType, quotationId) => {
  try {
    // Validate file size
    if (fileBuffer.length > IMAGE_CONFIG.MAX_FILE_SIZE_BYTES) {
      throw new Error(`File size exceeds maximum limit of ${IMAGE_CONFIG.MAX_FILE_SIZE_MB}MB`);
    }

    // Validate MIME type for images only
    if (!IMAGE_CONFIG.ALLOWED_MIME_TYPES.includes(mimeType)) {
      throw new Error(
        `Invalid file type. Only ${IMAGE_CONFIG.ALLOWED_MIME_TYPES.join(', ')} are allowed`
      );
    }

    // Generate unique filename
    const timestamp = Date.now();
    const fileExtension = fileName.split('.').pop();
    const uniqueFileName = `quotations/${quotationId}/items/${timestamp}-${Math.random().toString(36).substring(2)}.${fileExtension}`;

    const uploadParams = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: uniqueFileName,
      Body: fileBuffer,
      ContentType: mimeType,
      ACL: 'public-read',
    };

    const result = await s3.upload(uploadParams).promise();

    // Return only the path, not the full URL
    return uniqueFileName;
  } catch (error) {
    console.error('S3 upload error:', error);
    throw new Error(`Failed to upload image: ${error.message}`);
  }
};

/**
 * Upload multiple images to S3
 * @param {Array} files - Array of file objects with buffer, name, and mimetype
 * @returns {Promise<Array<string>>} - Array of S3 paths
 */
const uploadMultipleImages = async (files, quotationId) => {
  try {
    const uploadPromises = files.map(file =>
      uploadImage(file.buffer, file.originalname, file.mimetype, quotationId)
    );

    const uploadedPaths = await Promise.all(uploadPromises);
    return uploadedPaths;
  } catch (error) {
    console.error('Multiple S3 upload error:', error);
    throw error;
  }
};

/**
 * Delete an image from S3
 * @param {string} imagePath - The S3 path of the image
 * @returns {Promise<void>}
 */
const deleteImage = async imagePath => {
  try {
    const deleteParams = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: imagePath,
    };

    await s3.deleteObject(deleteParams).promise();
  } catch (error) {
    console.error('S3 delete error:', error);
    // Don't throw error for delete failures as it's not critical
  }
};

/**
 * Delete multiple images from S3
 * @param {Array<string>} imagePaths - Array of S3 paths
 * @returns {Promise<void>}
 */
const deleteMultipleImages = async imagePaths => {
  try {
    if (!imagePaths || imagePaths.length === 0) return;

    const deletePromises = imagePaths.map(path => deleteImage(path));
    await Promise.allSettled(deletePromises); // Use allSettled to handle individual failures
  } catch (error) {
    console.error('Multiple S3 delete error:', error);
    // Don't throw error for delete failures as it's not critical
  }
};

/**
 * Get the full S3 URL for an image path
 * @param {string} imagePath - The S3 path
 * @returns {string} - The full S3 URL
 */
const getImageUrl = imagePath => {
  if (!imagePath) return null;
  return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${imagePath}`;
};

/**
 * Validate image file
 * @param {Object} file - The file object
 * @returns {boolean} - Whether the file is valid
 */
const validateImageFile = file => {
  if (!file) return false;

  // Check file size
  if (file.size > IMAGE_CONFIG.MAX_FILE_SIZE_BYTES) {
    return false;
  }

  // Check MIME type
  if (!IMAGE_CONFIG.ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    return false;
  }

  return true;
};

module.exports = {
  uploadFile,
  uploadImage,
  uploadMultipleImages,
  deleteImage,
  deleteMultipleImages,
  getImageUrl,
  validateImageFile,
};
