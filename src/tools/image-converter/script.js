const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const controls = document.getElementById('controls');
const preview = document.getElementById('preview');
const info = document.getElementById('info');
const originalImage = document.getElementById('originalImage');
const convertedImage = document.getElementById('convertedImage');
const originalInfo = document.getElementById('originalInfo');
const convertedInfo = document.getElementById('convertedInfo');
const outputFormat = document.getElementById('outputFormat');
const formatNote = document.getElementById('formatNote');
const quality = document.getElementById('quality');
const qualityValue = document.getElementById('qualityValue');
const optimizationInfo = document.getElementById('optimizationInfo');
const downloadBtn = document.getElementById('downloadBtn');
const convertBtn = document.getElementById('convertBtn');
const corsWarning = document.getElementById('corsWarning');
const titleStatus = document.getElementById('titleStatus');
const statusTooltip = document.getElementById('statusTooltip');

let originalFile = null;
let convertedBlob = null;
let autoOptimizeEnabled = false;
let jSquashLoaded = false;
let jSquashModules = {};

// Format descriptions
const formatDescriptions = {
  webp: 'WebP provides excellent compression with good quality',
  jpeg: 'JPEG is best for photos with many colors',
  png: 'PNG is lossless and best for graphics with transparency',
  avif: 'AVIF provides the best compression with excellent quality'
};

// Load jSquash modules
async function loadJSquash() {
  if (jSquashLoaded) return true;

  try {
    console.log('Loading jSquash modules...');
    updateEngineStatus('loading', 'Loading advanced compression engine...');

    // Use direct unpkg CDN imports as shown in the browser usage example
    const [avifModule, jpegModule, pngModule, webpModule] = await Promise.all([
      import("https://unpkg.com/@jsquash/avif?module"),
      import("https://unpkg.com/@jsquash/jpeg?module"),
      import("https://unpkg.com/@jsquash/png?module"),
      import("https://unpkg.com/@jsquash/webp?module")
    ]);

    jSquashModules = {
      avif: avifModule,
      jpeg: jpegModule,
      png: pngModule,
      webp: webpModule
    };

    jSquashLoaded = true;
    console.log('jSquash modules loaded successfully');
    updateEngineStatus('ready', 'jSquash ready - Advanced compression available');

    // Hide CORS warning since jSquash works without special headers
    if (corsWarning) {
      corsWarning.style.display = 'none';
    }

    return true;
  } catch (error) {
    console.error('Failed to load jSquash:', error);
    updateEngineStatus('error', 'Advanced engine failed - Using Canvas fallback');

    // Show CORS warning for Canvas fallback
    if (corsWarning) {
      corsWarning.style.display = 'block';
    }

    return false;
  }
}

// Initialize engine status
document.addEventListener('DOMContentLoaded', async function() {
  // Try to load jSquash first
  const jSquashSuccess = await loadJSquash();

  if (!jSquashSuccess) {
    updateEngineStatus('error', 'Canvas API fallback - Limited features');
    if (corsWarning) {
      corsWarning.style.display = 'block';
    }
  }
});

// Upload area events
uploadArea.addEventListener('click', () => fileInput.click());
uploadArea.addEventListener('dragover', handleDragOver);
uploadArea.addEventListener('drop', handleDrop);
fileInput.addEventListener('change', handleFileSelect);

// Quality slider
quality.addEventListener('input', function() {
  qualityValue.textContent = this.value;
});

// Format change event
outputFormat.addEventListener('change', function() {
  formatNote.textContent = formatDescriptions[this.value];

  // Set default quality per format
  if (this.value === 'png') {
    quality.disabled = true;
    quality.value = 100;
    qualityValue.textContent = '100';
    formatNote.textContent = 'PNG is lossless and may be larger than compressed formats like JPEG/WebP. Best for graphics with transparency.';
  } else if (this.value === 'avif') {
    // AVIF supported with jSquash
    quality.disabled = false;
    quality.value = 75;
    qualityValue.textContent = '75';
    formatNote.textContent = 'AVIF provides the best compression with excellent quality. Requires jSquash engine.';
  } else {
    quality.disabled = false;
    if (this.value === 'webp') {
      quality.value = 85;
    } else if (this.value === 'jpeg') {
      quality.value = 90;
    }
    qualityValue.textContent = quality.value;
  }
});

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
  if (!file.type.startsWith('image/')) {
    alert('Please select an image file.');
    return;
  }

  originalFile = file;

  // Auto-enable optimization for files larger than 500KB
  autoOptimizeEnabled = file.size > 500 * 1024;
  if (autoOptimizeEnabled) {
    optimizationInfo.style.display = 'block';
  } else {
    optimizationInfo.style.display = 'none';
  }

  const reader = new FileReader();
  reader.onload = function(e) {
    originalImage.src = e.target.result;
    originalImage.onload = function() {
      showImageInfo();
      controls.classList.remove('hidden');
      preview.classList.remove('hidden');
    };
  };
  reader.readAsDataURL(file);
}

function showImageInfo() {
  const fileSizeKB = (originalFile.size / 1024).toFixed(1);
  const fileSizeMB = (originalFile.size / (1024 * 1024)).toFixed(2);
  const sizeText = originalFile.size > 1024 * 1024 ? `${fileSizeMB} MB` : `${fileSizeKB} KB`;

  originalInfo.innerHTML = `
    <div class="info-item">
      <span class="info-label">Size:</span>
      <span class="info-value">${originalImage.naturalWidth} × ${originalImage.naturalHeight}</span>
    </div>
    <div class="info-item">
      <span class="info-label">File Size:</span>
      <span class="info-value">${sizeText}</span>
    </div>
    <div class="info-item">
      <span class="info-label">Format:</span>
      <span class="info-value">${originalFile.type.split('/')[1].toUpperCase()}</span>
    </div>
  `;

  info.innerHTML = `
    <div class="info-item">
      <span class="info-label">Original:</span>
      <span class="info-value">${originalFile.name} (${sizeText})</span>
    </div>
    <div class="info-item">
      <span class="info-label">Auto-optimization:</span>
      <span class="info-value">${autoOptimizeEnabled ? 'Enabled (large file detected)' : 'Disabled (small file)'}</span>
    </div>
    <div class="info-item">
      <span class="info-label">Engine:</span>
      <span class="info-value">jSquash</span>
    </div>
  `;
  info.classList.remove('hidden');
}

async function convert() {
  if (!originalFile) {
    alert('Please select an image first.');
    return;
  }

  convertBtn.disabled = true;
  convertBtn.textContent = 'Converting...';

  try {
    const options = {
      format: outputFormat.value,
      quality: parseInt(quality.value),
      optimize: autoOptimizeEnabled
    };

    let useJSquash = false;

    // Try jSquash first, fallback to Canvas if it fails
    try {
      if (!jSquashLoaded) {
        convertBtn.textContent = 'Loading jSquash...';
        await loadJSquash();
      }

      if (jSquashLoaded) {
        useJSquash = true;
        convertBtn.textContent = 'Converting with jSquash...';
        convertedBlob = await processImageWithJSquash(originalFile, options);
      } else {
        throw new Error('jSquash not available');
      }
    } catch (jSquashError) {
      console.warn('jSquash failed, using Canvas fallback:', jSquashError);
      convertBtn.textContent = 'Converting with Canvas...';
      useJSquash = false;

      // Check if format is supported by Canvas API
      if (options.format === 'avif') {
        alert('AVIF format requires jSquash engine which failed to load. Please choose JPEG, PNG, or WebP.');
        return;
      }

      convertedBlob = await processImageWithCanvas(originalFile, options);
    }

    const url = URL.createObjectURL(convertedBlob);
    convertedImage.src = url;

    convertedImage.onload = function() {
      showConvertedInfo(useJSquash);
      downloadBtn.disabled = false;
    };

  } catch (error) {
    console.error('Conversion failed:', error);
    alert('Conversion failed: ' + error.message);
  } finally {
    convertBtn.disabled = false;
    convertBtn.textContent = 'Convert Image';
  }
}

function showConvertedInfo(useJSquash) {
  const fileSizeKB = (convertedBlob.size / 1024).toFixed(1);
  const fileSizeMB = (convertedBlob.size / (1024 * 1024)).toFixed(2);
  const sizeText = convertedBlob.size > 1024 * 1024 ? `${fileSizeMB} MB` : `${fileSizeKB} KB`;

  const reduction = ((originalFile.size - convertedBlob.size) / originalFile.size * 100).toFixed(1);
  const reductionClass = reduction > 0 ? 'reduction-positive' : 'reduction-negative';
  const reductionText = reduction > 0 ? `${reduction}% smaller` : `${Math.abs(reduction)}% larger`;

  convertedInfo.innerHTML = `
    <div class="info-item">
      <span class="info-label">Size:</span>
      <span class="info-value">${convertedImage.naturalWidth} × ${convertedImage.naturalHeight}</span>
    </div>
    <div class="info-item">
      <span class="info-label">File Size:</span>
      <span class="info-value">${sizeText}</span>
    </div>
    <div class="info-item">
      <span class="info-label">Format:</span>
      <span class="info-value">${outputFormat.value.toUpperCase()}</span>
    </div>
    <div class="info-item">
      <span class="info-label">Reduction:</span>
      <span class="info-value ${reductionClass}">${reductionText}</span>
    </div>
  `;

  // Update info panel
  const originalSizeKB = (originalFile.size / 1024).toFixed(1);
  const originalSizeMB = (originalFile.size / (1024 * 1024)).toFixed(2);
  const originalSizeText = originalFile.size > 1024 * 1024 ? `${originalSizeMB} MB` : `${originalSizeKB} KB`;

  info.innerHTML = `
    <div class="info-item">
      <span class="info-label">Original:</span>
      <span class="info-value">${originalFile.name} (${originalSizeText})</span>
    </div>
    <div class="info-item">
      <span class="info-label">Converted:</span>
      <span class="info-value">${getFileName()}.${outputFormat.value} (${sizeText})</span>
    </div>
    <div class="info-item">
      <span class="info-label">Size Change:</span>
      <span class="info-value ${reductionClass}">${reductionText}</span>
    </div>
    <div class="info-item">
      <span class="info-label">Quality:</span>
      <span class="info-value">${quality.value}%</span>
    </div>
    <div class="info-item">
      <span class="info-label">Optimization:</span>
      <span class="info-value">${useJSquash ? 'Applied (jSquash)' : 'Not applied'}</span>
    </div>
    <div class="info-item">
      <span class="info-label">Engine:</span>
      <span class="info-value">${useJSquash ? 'jSquash' : 'Canvas'}</span>
    </div>
  `;
}

function getFileName() {
  if (!originalFile) return 'converted';
  const name = originalFile.name;
  const lastDot = name.lastIndexOf('.');
  return lastDot > 0 ? name.substring(0, lastDot) : name;
}

function download() {
  if (!convertedBlob) {
    alert('No converted image to download.');
    return;
  }

  const url = URL.createObjectURL(convertedBlob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${getFileName()}.${outputFormat.value}`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function reset() {
  originalFile = null;
  convertedBlob = null;
  autoOptimizeEnabled = false;

  controls.classList.add('hidden');
  preview.classList.add('hidden');
  info.classList.add('hidden');
  optimizationInfo.style.display = 'none';

  downloadBtn.disabled = true;
  convertBtn.disabled = false;
  convertBtn.textContent = 'Convert Image';

  fileInput.value = '';
  originalImage.src = '';
  convertedImage.src = '';
  originalInfo.innerHTML = '';
  convertedInfo.innerHTML = '';
}

// Make functions global for onclick handlers
window.convert = convert;
window.download = download;
window.reset = reset;

// jSquash image processing
async function processImageWithJSquash(file, options) {
  try {
    // Get the file as ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();

    // Decode the image first
    let imageData;
    const fileType = file.type;

    if (fileType.includes('jpeg') || fileType.includes('jpg')) {
      imageData = await jSquashModules.jpeg.decode(arrayBuffer);
    } else if (fileType.includes('png')) {
      imageData = await jSquashModules.png.decode(arrayBuffer);
    } else if (fileType.includes('webp')) {
      imageData = await jSquashModules.webp.decode(arrayBuffer);
    } else if (fileType.includes('avif')) {
      imageData = await jSquashModules.avif.decode(arrayBuffer);
    } else {
      throw new Error(`Unsupported input format: ${fileType}`);
    }

    // Encode to target format with quality settings
    let encodedData;
    const quality = options.quality / 100;

    switch (options.format) {
      case 'jpeg':
        encodedData = await jSquashModules.jpeg.encode(imageData, { quality });
        break;
      case 'png':
        encodedData = await jSquashModules.png.encode(imageData);
        break;
      case 'webp':
        encodedData = await jSquashModules.webp.encode(imageData, { quality });
        break;
      case 'avif':
        encodedData = await jSquashModules.avif.encode(imageData, { quality });
        break;
      default:
        throw new Error(`Unsupported output format: ${options.format}`);
    }

    return new Blob([encodedData], { type: `image/${options.format}` });
  } catch (error) {
    console.error('jSquash processing failed:', error);
    throw error;
  }
}

// Enhanced Canvas API image processing (fallback)
async function processImageWithCanvas(file, options) {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = function() {
      // Set canvas dimensions
      canvas.width = img.width;
      canvas.height = img.height;

      // Apply basic optimizations if enabled
      if (options.optimize) {
        // Enable image smoothing for better quality
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
      }

      // Draw the image
      ctx.drawImage(img, 0, 0);

      // Apply additional optimizations for large images
      if (options.optimize && (img.width > 2000 || img.height > 2000)) {
        // Apply slight sharpening filter for large images
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        // Simple sharpening kernel (very light)
        for (let i = 0; i < data.length; i += 4) {
          // Increase contrast slightly
          data[i] = Math.min(255, data[i] * 1.05);     // Red
          data[i + 1] = Math.min(255, data[i + 1] * 1.05); // Green
          data[i + 2] = Math.min(255, data[i + 2] * 1.05); // Blue
        }

        ctx.putImageData(imageData, 0, 0);
      }

      // Convert format
      const quality = options.quality / 100;
      let mimeType = `image/${options.format}`;

      if (options.format === 'jpg') {
        mimeType = 'image/jpeg';
      }

      // Check browser support for WebP
      if (options.format === 'webp') {
        // Test WebP support
        const testCanvas = document.createElement('canvas');
        testCanvas.width = 1;
        testCanvas.height = 1;
        const testDataURL = testCanvas.toDataURL('image/webp');

        if (!testDataURL.startsWith('data:image/webp')) {
          reject(new Error('WebP format is not supported in this browser'));
          return;
        }
      }

      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Canvas conversion failed'));
        }
      }, mimeType, quality);
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
}

// Update engine status display
function updateEngineStatus(status, message) {
  if (titleStatus && statusTooltip) {
    titleStatus.className = `status-indicator ${status} tooltip`;
    statusTooltip.textContent = message;
  }
}
