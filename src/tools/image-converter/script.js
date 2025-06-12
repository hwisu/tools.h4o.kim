let originalFile = null;
let convertedBlob = null;
let jSquashModules = {};

// Get DOM elements
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const controls = document.getElementById('controls');
const outputFormat = document.getElementById('outputFormat');
const convertBtn = document.getElementById('convertBtn');
const downloadBtn = document.getElementById('downloadBtn');
const status = document.getElementById('status');
const formatNote = document.getElementById('formatNote');

// Initialize
document.addEventListener('DOMContentLoaded', function() {
  loadJSquash();

  // Event listeners
  uploadArea.addEventListener('click', () => fileInput.click());
  uploadArea.addEventListener('dragover', handleDragOver);
  uploadArea.addEventListener('drop', handleDrop);
  fileInput.addEventListener('change', handleFileSelect);
  outputFormat.addEventListener('change', updateFormatNote);
  convertBtn.addEventListener('click', convert);
  downloadBtn.addEventListener('click', download);
});

// Format descriptions
const formatDescriptions = {
  webp: 'WebP provides excellent quality and compression',
  jpeg: 'JPEG is suitable for photos',
  png: 'PNG supports lossless compression with transparency'
};

// Load jSquash modules
async function loadJSquash() {
  try {
    const [jpegModule, pngModule, webpModule] = await Promise.all([
      import("https://unpkg.com/@jsquash/jpeg?module"),
      import("https://unpkg.com/@jsquash/png?module"),
      import("https://unpkg.com/@jsquash/webp?module")
    ]);

    jSquashModules = {
      jpeg: jpegModule,
      png: pngModule,
      webp: webpModule
    };
    return true;
  } catch (error) {
    console.error('Failed to load jSquash:', error);
    return false;
  }
}

function handleDragOver(e) {
  e.preventDefault();
  uploadArea.classList.add('dragover');
}

function handleDrop(e) {
  e.preventDefault();
  uploadArea.classList.remove('dragover');
  const files = e.dataTransfer.files;
  if (files.length > 0) {
    handleFile(files[0]);
  }
}

function handleFileSelect(e) {
  if (e.target.files.length > 0) {
    handleFile(e.target.files[0]);
  }
}

function handleFile(file) {
  originalFile = file;
  controls.classList.remove('hidden');
  showStatus(`File selected: ${file.name}`, 'info');
}

function updateFormatNote() {
  formatNote.textContent = formatDescriptions[outputFormat.value];
}

async function convert() {
  if (!originalFile) {
    showStatus('Please select an image first.', 'error');
    return;
  }

  const format = outputFormat.value;

  convertBtn.disabled = true;
  convertBtn.textContent = 'Converting...';
  showStatus('Converting image...', 'info');

  try {
    // Always try canvas method first for better compatibility
    convertedBlob = await processImageWithCanvas(originalFile, { format, quality: 95 });

    // Validate the conversion result
    if (!convertedBlob || !(convertedBlob instanceof Blob) || convertedBlob.size === 0) {
      throw new Error('Conversion produced invalid result');
    }

    showStatus('Conversion completed!', 'success');
    downloadBtn.disabled = false;

  } catch (error) {
    console.error('Conversion failed:', error);
    showStatus('Conversion failed: ' + error.message, 'error');
    convertedBlob = null;
    downloadBtn.disabled = true;
  } finally {
    convertBtn.disabled = false;
    convertBtn.textContent = 'Convert Format';
  }
}

function showStatus(message, type) {
  status.textContent = message;
  status.className = `status status-${type}`;
  status.classList.remove('hidden');
}

function getFileName() {
  const baseName = originalFile.name.replace(/\.[^/.]+$/, "");
  const extension = outputFormat.value === 'jpeg' ? 'jpg' : outputFormat.value;
  return `${baseName}.${extension}`;
}

function download() {
  if (!convertedBlob) {
    showStatus('No converted image available for download', 'error');
    return;
  }

  try {
    // Validate blob before creating URL
    if (!(convertedBlob instanceof Blob) || convertedBlob.size === 0) {
      showStatus('Invalid image data for download', 'error');
      return;
    }

    const url = URL.createObjectURL(convertedBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = getFileName();
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showStatus('Download started successfully', 'success');
  } catch (error) {
    console.error('Download failed:', error);
    showStatus('Download failed: ' + error.message, 'error');
  }
}

function reset() {
  originalFile = null;
  convertedBlob = null;
  controls.classList.add('hidden');
  status.classList.add('hidden');
  downloadBtn.disabled = true;
  convertBtn.disabled = false;
  convertBtn.textContent = 'Convert Format';
  fileInput.value = '';
}

async function processImageWithJSquash(file, options) {
  const imageData = await createImageBitmap(file);
  const canvas = new OffscreenCanvas(imageData.width, imageData.height);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(imageData, 0, 0);

  const imageBuffer = ctx.getImageData(0, 0, imageData.width, imageData.height);

  const module = jSquashModules[options.format];
  if (!module) {
    throw new Error(`Unsupported format: ${options.format}`);
  }

  const encodedData = await module.encode(imageBuffer, { quality: options.quality / 100 });

  // Ensure we return a valid Blob
  if (encodedData instanceof Uint8Array) {
    const mimeType = options.format === 'jpeg' ? 'image/jpeg' :
                    options.format === 'png' ? 'image/png' :
                    'image/webp';
    return new Blob([encodedData], { type: mimeType });
  }

  return encodedData;
}

async function processImageWithCanvas(file, options) {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = function() {
      try {
        canvas.width = img.width;
        canvas.height = img.height;

        // Clear canvas and draw image
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);

        const mimeType = options.format === 'jpeg' ? 'image/jpeg' :
                        options.format === 'png' ? 'image/png' :
                        'image/webp';

        // Convert with quality setting
        canvas.toBlob((blob) => {
          if (blob && blob.size > 0) {
            resolve(blob);
          } else {
            reject(new Error('Failed to create blob from canvas'));
          }
        }, mimeType, options.quality / 100);

      } catch (error) {
        reject(new Error('Failed to process image: ' + error.message));
      }
    };

    img.onerror = () => reject(new Error('Failed to load image file'));

    // Create object URL and clean up
    const objectUrl = URL.createObjectURL(file);
    img.src = objectUrl;

    // Clean up object URL after image loads or fails
    img.addEventListener('load', () => URL.revokeObjectURL(objectUrl));
    img.addEventListener('error', () => URL.revokeObjectURL(objectUrl));
  });
}
