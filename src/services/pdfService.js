const { jsPDF } = require('jspdf');
const fs = require('fs');
const path = require('path');
const { uploadFile, deleteImage, getImageUrl } = require('./s3Service');
const https = require('https');

/**
 * PDF Generation Service for Quotations
 * Uses jsPDF for creating professional PDF documents
 */

/**
 * Download image from S3 URL and convert to base64
 * @param {string} imagePath - S3 path of the image
 * @returns {Promise<{base64: string, width: number, height: number}>} - Base64 encoded image with dimensions
 */
const downloadImageAsBase64 = async imagePath => {
  return new Promise((resolve, reject) => {
    const imageUrl = getImageUrl(imagePath);

    https
      .get(imageUrl, response => {
        if (response.statusCode !== 200) {
          reject(new Error(`Failed to download image: ${response.statusCode}`));
          return;
        }

        const chunks = [];
        response.on('data', chunk => chunks.push(chunk));
        response.on('end', () => {
          const buffer = Buffer.concat(chunks);
          const base64 = buffer.toString('base64');
          const mimeType = response.headers['content-type'] || 'image/jpeg';
          const dataUrl = `data:${mimeType};base64,${base64}`;

          // Get image dimensions using a simple approach
          // For JPEG/PNG, we can read the header to get dimensions
          let width = 800; // Default width
          let height = 600; // Default height

          try {
            // Simple dimension detection for common formats
            if (mimeType.includes('jpeg') || mimeType.includes('jpg')) {
              // For JPEG, read dimensions from header
              if (buffer.length > 20) {
                let i = 2;
                while (i < buffer.length - 2) {
                  if (buffer[i] === 0xff && buffer[i + 1] === 0xc0) {
                    height = (buffer[i + 5] << 8) | buffer[i + 6];
                    width = (buffer[i + 7] << 8) | buffer[i + 8];
                    break;
                  }
                  i++;
                }
              }
            } else if (mimeType.includes('png')) {
              // For PNG, read dimensions from header
              if (buffer.length > 24) {
                width = (buffer[16] << 24) | (buffer[17] << 16) | (buffer[18] << 8) | buffer[19];
                height = (buffer[20] << 24) | (buffer[21] << 16) | (buffer[22] << 8) | buffer[23];
              }
            }
          } catch (error) {
            console.warn('Could not detect image dimensions, using defaults:', error.message);
          }

          resolve({ base64: dataUrl, width, height });
        });
      })
      .on('error', error => {
        console.error('Error downloading image:', error);
        reject(error);
      });
  });
};

/**
 * Calculate optimal image dimensions for PDF
 * @param {number} originalWidth - Original image width
 * @param {number} originalHeight - Original image height
 * @param {number} maxWidth - Maximum allowed width
 * @param {number} maxHeight - Maximum allowed height
 * @returns {Object} - Calculated width and height
 */
const calculateOptimalDimensions = (originalWidth, originalHeight, maxWidth, maxHeight) => {
  // Create a smaller square format
  const squareSize = 50; // Reduced from 80mm to 50mm for smaller images

  // Calculate aspect ratio
  const aspectRatio = originalWidth / originalHeight;

  let width, height;

  if (aspectRatio > 1) {
    // Landscape image - fit to square height
    height = squareSize;
    width = squareSize * aspectRatio;

    // If width exceeds square size, scale down proportionally
    if (width > squareSize) {
      width = squareSize;
      height = squareSize / aspectRatio;
    }
  } else {
    // Portrait or square image - fit to square width
    width = squareSize;
    height = squareSize / aspectRatio;

    // If height exceeds square size, scale down proportionally
    if (height > squareSize) {
      height = squareSize;
      width = squareSize * aspectRatio;
    }
  }

  return { width, height };
};

/**
 * Add images to PDF with proper sizing and layout
 * @param {Object} doc - jsPDF document instance
 * @param {Array} images - Array of image paths
 * @param {number} startY - Starting Y position
 * @param {number} margin - Page margin
 * @param {number} pageWidth - Page width
 * @returns {number} - New Y position after adding images
 */
const addImagesToPDF = async (doc, images, startY, margin, pageWidth) => {
  if (!images || images.length === 0) return startY;

  const squareSize = 50; // Reduced from 80mm to 50mm
  const imagesPerRow = 3; // Increased to 3 images per row since they're smaller
  const imageSpacing = 8; // Reduced spacing since images are smaller
  const rowSpacing = 10; // Reduced row spacing
  let currentY = startY;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(100, 100, 100);
  doc.text('Images:', margin, currentY);
  currentY += 15; // Reduced space after label

  // Calculate available width for images
  const availableWidth = pageWidth - margin * 2;
  const totalImageWidth = squareSize * imagesPerRow + imageSpacing * (imagesPerRow - 1);
  const startX = margin + (availableWidth - totalImageWidth) / 2; // Center the images

  // Calculate how many rows we'll need
  const totalRows = Math.ceil(images.length / imagesPerRow);
  const totalHeightNeeded = totalRows * (squareSize + rowSpacing) - rowSpacing;

  // Check if we need a new page for the entire image section
  if (currentY + totalHeightNeeded > doc.internal.pageSize.getHeight() - margin - 30) {
    doc.addPage();
    currentY = margin;
  }

  for (let i = 0; i < images.length; i++) {
    try {
      const imagePath = images[i];
      const {
        base64: base64Image,
        width: originalWidth,
        height: originalHeight,
      } = await downloadImageAsBase64(imagePath);

      // Calculate optimal dimensions (will be close to square)
      const { width: imgWidth, height: imgHeight } = calculateOptimalDimensions(
        originalWidth,
        originalHeight,
        squareSize,
        squareSize
      );

      // Calculate position for this image
      const row = Math.floor(i / imagesPerRow);
      const col = i % imagesPerRow;
      const x = startX + col * (squareSize + imageSpacing);
      const y = currentY + row * (squareSize + rowSpacing);

      // Add image to PDF
      doc.addImage(base64Image, 'JPEG', x, y, imgWidth, imgHeight);
    } catch (error) {
      console.error('Error processing image:', error);
      // Add placeholder text for failed image
      doc.setFontSize(8);
      doc.setFont('helvetica', 'italic');
      doc.setTextColor(150, 150, 150);
      doc.text(`Image ${i + 1}: Failed to load`, margin, currentY);
      currentY += 15; // Reduced space for failed image
    }
  }

  // Calculate final Y position
  const finalY = currentY + totalRows * (squareSize + rowSpacing) - rowSpacing;

  return finalY;
};

/**
 * Generate PDF for a quotation
 * @param {Object} quotation - Quotation data with items and customer
 * @param {string} quotationId - Quotation ID for file naming
 * @returns {Promise<Buffer>} - PDF buffer
 */
const generateQuotationPDF = async (quotation, quotationId) => {
  try {
    // Create new PDF document
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - margin * 2;

    let yPosition = margin;
    const lineHeight = 7;
    const sectionGap = 15;

    // Set font styles
    const titleFontSize = 24;
    const subtitleFontSize = 16;
    const normalFontSize = 12;
    const smallFontSize = 10;

    // Header Section
    doc.setFontSize(titleFontSize);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(44, 62, 80); // Dark blue-gray
    doc.text('MARUTI LAMINATES', pageWidth / 2, yPosition, { align: 'center' });

    yPosition += lineHeight + 5;

    doc.setFontSize(smallFontSize);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text('Professional Laminates & Interior Solutions', pageWidth / 2, yPosition, {
      align: 'center',
    });

    yPosition += lineHeight + 5;

    // Contact Information - Fixed formatting
    doc.setFontSize(smallFontSize);
    doc.text('Phone: +91 1234567890', pageWidth / 2, yPosition, {
      align: 'center',
    });
    yPosition += lineHeight;
    doc.text('Email: info@marutilaminates.com', pageWidth / 2, yPosition, {
      align: 'center',
    });
    yPosition += lineHeight;
    doc.text('Address: 123 Main Street, City, State - 123456', pageWidth / 2, yPosition, {
      align: 'center',
    });

    yPosition += lineHeight * 2 + sectionGap;

    // Quotation Details Section
    doc.setFontSize(subtitleFontSize);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(44, 62, 80);
    doc.text('QUOTATION DETAILS', margin, yPosition);

    yPosition += lineHeight + 5;

    // Quotation info table
    const quotationInfo = [
      ['Quotation ID:', quotation.id],
      ['Quotation Date:', new Date(quotation.quotation_date).toLocaleDateString('en-IN')],
      ['Customer Name:', quotation.customer?.name || 'N/A'],
      ['Customer Mobile:', quotation.customer?.mobile_no || 'N/A'],
    ];

    if (quotation.last_shared_date) {
      quotationInfo.push([
        'Last Shared:',
        new Date(quotation.last_shared_date).toLocaleDateString('en-IN'),
      ]);
    }

    doc.setFontSize(normalFontSize);
    doc.setFont('helvetica', 'normal');

    quotationInfo.forEach(([label, value]) => {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(44, 62, 80);
      doc.text(label, margin, yPosition);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(50, 50, 50);
      doc.text(value, margin + 50, yPosition);

      yPosition += lineHeight;
    });

    yPosition += sectionGap;

    // Items Section
    if (quotation.items && quotation.items.length > 0) {
      doc.setFontSize(subtitleFontSize);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(44, 62, 80);
      doc.text('ITEMS DETAILS', margin, yPosition);

      yPosition += lineHeight + 5;

      // Check if we need a new page for items
      const itemsPerPage = Math.floor((pageHeight - yPosition - margin) / (lineHeight * 8));
      let currentItem = 0;

      while (currentItem < quotation.items.length) {
        // Check if we need a new page
        if (yPosition > pageHeight - 100) {
          doc.addPage();
          yPosition = margin;
        }

        const item = quotation.items[currentItem];

        // Item header
        doc.setFontSize(normalFontSize);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(52, 73, 94);
        doc.text(`Item ${currentItem + 1}: ${item.product?.name || 'Product'}`, margin, yPosition);

        yPosition += lineHeight;

        // Item details
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(smallFontSize);
        doc.setTextColor(50, 50, 50);

        const itemDetails = [
          ['Product:', item.product?.name || 'N/A'],
          ['Description:', item.description || 'N/A'],
          ['Rate:', parseFloat(item.rate).toFixed(2)],
          ['Unit:', item.unit || 'N/A'],
        ];

        if (item.discount && item.discount > 0) {
          itemDetails.push([
            'Discount:',
            `${parseFloat(item.discount).toFixed(2)} ${item.discount_type || 'PERCENTAGE'}`,
          ]);
        }

        if (item.location?.name) {
          itemDetails.push(['Location:', item.location.name]);
        }

        itemDetails.forEach(([label, value]) => {
          doc.setFont('helvetica', 'bold');
          doc.text(label, margin + 5, yPosition);

          doc.setFont('helvetica', 'normal');
          doc.text(value, margin + 35, yPosition);

          yPosition += lineHeight;
        });

        // Add images if available
        if (item.images && item.images.length > 0) {
          yPosition = await addImagesToPDF(doc, item.images, yPosition, margin, pageWidth);
        }

        yPosition += sectionGap;
        currentItem++;
      }
    } else {
      doc.setFontSize(normalFontSize);
      doc.setFont('helvetica', 'italic');
      doc.setTextColor(100, 100, 100);
      doc.text('No items added to this quotation yet.', margin, yPosition);
      yPosition += lineHeight + sectionGap;
    }

    // Footer Section
    yPosition = pageHeight - 40;

    // Add a line
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 10;

    doc.setFontSize(smallFontSize);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text('Thank you for choosing Maruti Laminates!', pageWidth / 2, yPosition, {
      align: 'center',
    });

    yPosition += lineHeight;
    doc.text('For any queries, please contact us at +91 1234567890', pageWidth / 2, yPosition, {
      align: 'center',
    });

    yPosition += lineHeight;
    doc.text(`Generated on: ${new Date().toLocaleString('en-IN')}`, pageWidth / 2, yPosition, {
      align: 'center',
    });

    // Return PDF as buffer
    return doc.output('arraybuffer');
  } catch (error) {
    console.error('PDF generation error:', error);
    throw new Error(`Failed to generate PDF: ${error.message}`);
  }
};

/**
 * Generate PDF and upload to S3
 * @param {Object} quotation - Quotation data
 * @param {string} quotationId - Quotation ID
 * @returns {Promise<string>} - S3 path of uploaded PDF
 */
const generateAndUploadQuotationPDF = async (quotation, quotationId) => {
  try {
    // Generate PDF buffer
    const pdfBuffer = await generateQuotationPDF(quotation, quotationId);

    // Convert ArrayBuffer to Buffer
    const buffer = Buffer.from(pdfBuffer);

    // Generate filename
    const timestamp = Date.now();
    const fileName = `quotation-${quotationId}-${timestamp}.pdf`;
    const s3Path = `quotations/${quotationId}/${fileName}`;

    // Upload to S3
    const uploadedPath = await uploadFile(buffer, fileName, 'application/pdf', quotationId);

    return uploadedPath;
  } catch (error) {
    console.error('PDF generation and upload error:', error);
    throw new Error(`Failed to generate and upload PDF: ${error.message}`);
  }
};

/**
 * Delete PDF from S3
 * @param {string} pdfPath - S3 path of the PDF
 * @returns {Promise<void>}
 */
const deleteQuotationPDF = async pdfPath => {
  try {
    await deleteImage(pdfPath);
  } catch (error) {
    console.error('PDF deletion error:', error);
    // Don't throw error as PDF deletion is not critical
  }
};

/**
 * Get PDF URL from S3 path
 * @param {string} pdfPath - S3 path of the PDF
 * @returns {string} - Full URL of the PDF
 */
const getQuotationPDFUrl = pdfPath => {
  return getImageUrl(pdfPath);
};

module.exports = {
  generateQuotationPDF,
  generateAndUploadQuotationPDF,
  deleteQuotationPDF,
  getQuotationPDFUrl,
};
