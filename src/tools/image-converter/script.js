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
  webp: 'WebP는 우수한 품질과 압축률을 제공합니다',
  jpeg: 'JPEG는 사진에 적합한 포맷입니다',
  png: 'PNG는 무손실 압축으로 투명도를 지원합니다'
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
  showStatus(`파일 선택됨: ${file.name}`, 'info');
}

function updateFormatNote() {
  formatNote.textContent = formatDescriptions[outputFormat.value];
}

async function convert() {
  if (!originalFile) {
    alert('이미지를 먼저 선택해주세요.');
    return;
  }

  const format = outputFormat.value;

  convertBtn.disabled = true;
  convertBtn.textContent = '변환 중...';
  showStatus('이미지 변환 중...', 'info');

  try {
    // Try jSquash first for better quality
    try {
      convertedBlob = await processImageWithJSquash(originalFile, { format, quality: 95 });
    } catch (jSquashError) {
      convertedBlob = await processImageWithCanvas(originalFile, { format, quality: 95 });
    }

    showStatus('변환 완료!', 'success');
    downloadBtn.disabled = false;

  } catch (error) {
    console.error('Conversion failed:', error);
    showStatus('변환 실패: ' + error.message, 'error');
  } finally {
    convertBtn.disabled = false;
    convertBtn.textContent = '포맷 변환';
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
  if (!convertedBlob) return;

  const url = URL.createObjectURL(convertedBlob);
  const a = document.createElement('a');
  a.href = url;
  a.download = getFileName();
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function reset() {
  originalFile = null;
  convertedBlob = null;
  controls.classList.add('hidden');
  status.classList.add('hidden');
  downloadBtn.disabled = true;
  convertBtn.disabled = false;
  convertBtn.textContent = '포맷 변환';
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

  return await module.encode(imageBuffer, { quality: options.quality / 100 });
}

async function processImageWithCanvas(file, options) {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = function() {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const mimeType = options.format === 'jpeg' ? 'image/jpeg' :
                      options.format === 'png' ? 'image/png' :
                      'image/webp';

      canvas.toBlob(resolve, mimeType, options.quality / 100);
    };

    img.onerror = () => reject(new Error('이미지 로드 실패'));
    img.src = URL.createObjectURL(file);
  });
}
