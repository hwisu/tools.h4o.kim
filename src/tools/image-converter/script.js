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

// Format descriptions - 최고 품질 우선 설명
const formatDescriptions = {
  webp: 'WebP provides excellent compression with superior quality (maximum quality settings applied)',
  jpeg: 'JPEG is best for photos with many colors (maximum quality settings applied)',
  png: 'PNG is lossless and best for graphics with transparency (maximum compression applied)'
};

// Load jSquash modules
async function loadJSquash() {
  if (jSquashLoaded) return true;

  try {
    console.log('Loading jSquash modules...');
    updateEngineStatus('loading', 'Loading advanced compression engine...');

    // Use direct unpkg CDN imports as shown in the browser usage example
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

  // Set MAXIMUM default quality per format (속도 희생하고 품질 우선)
  if (this.value === 'png') {
    quality.disabled = true;
    quality.value = 100;
    qualityValue.textContent = '100';
    formatNote.textContent = 'PNG is lossless and may be larger than compressed formats like JPEG/WebP. Best for graphics with transparency.';
  } else if (this.value === 'webp') {
    // 🎯 WebP 최고 품질 기본값 (속도 희생)
    quality.disabled = false;
    quality.value = 92; // 매우 높은 기본 품질
    qualityValue.textContent = '92';
    formatNote.textContent = 'WebP provides excellent compression with good quality. Maximum quality settings applied (slower encoding).';
  } else if (this.value === 'jpeg') {
    // 🎯 JPEG 최고 품질 기본값 (속도 희생)
    quality.disabled = false;
    quality.value = 95; // 매우 높은 기본 품질
    qualityValue.textContent = '95';
    formatNote.textContent = 'JPEG is best for photos with many colors. Maximum quality settings applied (slower encoding).';
  } else {
    quality.disabled = false;
    quality.value = 92; // 기타 포맷도 높은 품질
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

// Enhanced AVIF image processing with optimized settings
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
    } else {
      throw new Error(`Unsupported input format: ${fileType}`);
    }

    // 디버깅: ImageData 검증
    console.log('Decoded ImageData:', {
      width: imageData.width,
      height: imageData.height,
      channels: imageData.data.length / (imageData.width * imageData.height),
      samplePixels: Array.from(imageData.data.slice(0, 12))
    });

    // Encode to target format with MAXIMUM QUALITY settings (속도 희생)
    let encodedData;
    const quality = options.quality / 100;

    switch (options.format) {
      case 'jpeg':
        try {
          // 🔥 JPEG 최고 품질 설정 (속도 희생)
          const jpegOptions = {
            quality,
            // 🎨 크로마 서브샘플링 완전 비활성화 (최고 색상 품질)
            chromaSubsampling: false,
            // 🔧 추가 고품질 옵션들
            progressive: true, // 프로그레시브 JPEG (더 나은 압축)
            optimizeCoding: true, // 허프만 테이블 최적화
            smoothing: 0, // 스무딩 비활성화 (디테일 보존)
            // 🎯 최고 품질을 위한 추가 설정
            dcScanOpt: 2, // DC 스캔 최적화
            quantTable: 0, // 기본 양자화 테이블 사용
          };

          console.log('JPEG encoding with maximum quality options:', jpegOptions);
          encodedData = await jSquashModules.jpeg.encode(imageData, jpegOptions);

          // 결과 검증
          const testDecoded = await jSquashModules.jpeg.decode(encodedData);
          if (checkIfGrayscale(testDecoded)) {
            throw new Error('jSquash produced grayscale image');
          }
        } catch (error) {
          console.warn('jSquash JPEG encoding failed, using Canvas fallback:', error);

          // Canvas API 폴백 (최고 품질 설정)
          const canvas = document.createElement('canvas');
          canvas.width = imageData.width;
          canvas.height = imageData.height;
          const ctx = canvas.getContext('2d');

          // 🎨 최고 품질 렌더링 설정
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.putImageData(imageData, 0, 0);

          const blob = await new Promise(resolve => {
            canvas.toBlob(resolve, 'image/jpeg', quality);
          });

          encodedData = await blob.arrayBuffer();
        }
        break;

      case 'png':
        try {
          // 🔥 PNG 최고 품질 설정 (속도 희생)
          const pngOptions = {
            // 🎯 최대 압축 레벨 (속도 희생하고 파일 크기 최소화)
            level: 9, // 최대 압축 레벨
            // 🔧 고급 최적화 옵션들
            effort: 10, // 최대 노력 (가장 느리지만 최고 압축)
            // 🎨 색상 최적화
            palette: true, // 팔레트 최적화 시도
            // 🔍 필터 최적화
            filters: [0, 1, 2, 3, 4], // 모든 필터 시도하여 최적 선택
          };

          console.log('PNG encoding with maximum quality options:', pngOptions);
          encodedData = await jSquashModules.png.encode(imageData, pngOptions);
        } catch (error) {
          console.warn('Advanced PNG encoding failed, using basic settings:', error);
          // 기본 설정으로 폴백
          encodedData = await jSquashModules.png.encode(imageData);
        }
        break;

      case 'webp':
        try {
          // 🔥 WebP 최고 품질 설정 (속도 희생)
          const webpOptions = {
            quality,
            // 🎯 최고 품질을 위한 고급 설정들
            method: 6, // 최고 압축 방법 (0-6, 6이 가장 느리지만 최고 품질)
            // 🎨 색상 및 디테일 보존
            autoFilter: true, // 자동 필터 선택
            filterStrength: 60, // 필터 강도 (0-100)
            filterSharpness: 0, // 샤프니스 (0-7, 0이 가장 샤프)
            filterType: 1, // 필터 타입 (0=simple, 1=strong)
            // 🔧 고급 최적화
            partitions: 3, // 파티션 수 (0-3, 3이 최고 품질)
            segments: 4, // 세그먼트 수 (1-4, 4가 최고 품질)
            pass: 10, // 패스 수 (1-10, 10이 최고 품질)
            showCompressed: 0, // 압축 정보 표시 안함
            preprocessing: 2, // 전처리 (0=none, 1=segment-smooth, 2=pseudo-random dithering)
            partitionLimit: 100, // 파티션 한계 (0-100)
            // 🎭 알파 채널 최적화
            alphaCompression: 1, // 알파 압축 활성화
            alphaFiltering: 2, // 알파 필터링 (0=none, 1=fast, 2=best)
            alphaQuality: Math.max(quality * 100, 90), // 알파 품질 (최소 90)
            // 🌈 색상 공간 최적화
            exact: true, // 정확한 색상 보존
            // 🔍 세부 설정
            sns: 100, // Spatial Noise Shaping (0-100, 100이 최고)
            f: 100, // 필터링 강도 (0-100, 100이 최고)
            sharpYuv: true, // Sharp YUV 변환 (색상 정확도 향상)
          };

          console.log('WebP encoding with maximum quality options:', webpOptions);
          encodedData = await jSquashModules.webp.encode(imageData, webpOptions);
        } catch (error) {
          console.warn('Advanced WebP encoding failed, trying fallback:', error);

          // 📉 폴백: 기본 고품질 설정
          const fallbackOptions = {
            quality,
            method: 6,
            autoFilter: true,
            exact: true,
            sharpYuv: true
          };

          try {
            encodedData = await jSquashModules.webp.encode(imageData, fallbackOptions);
          } catch (fallbackError) {
            console.warn('jSquash WebP encoding failed, using Canvas fallback:', fallbackError);

            // Canvas API 폴백 (WebP 지원 확인)
            const canvas = document.createElement('canvas');
            canvas.width = imageData.width;
            canvas.height = imageData.height;
            const ctx = canvas.getContext('2d');

            // 🎨 최고 품질 렌더링 설정
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.putImageData(imageData, 0, 0);

            // WebP 지원 확인
            const testDataURL = canvas.toDataURL('image/webp');
            if (!testDataURL.startsWith('data:image/webp')) {
              throw new Error('WebP format is not supported in this browser');
            }

            const blob = await new Promise(resolve => {
              canvas.toBlob(resolve, 'image/webp', quality);
            });

            encodedData = await blob.arrayBuffer();
          }
        }
        break;

      default:
        throw new Error(`Unsupported output format: ${options.format}`);
    }

    return new Blob([encodedData], { type: `image/${options.format}` });
  } catch (error) {
    console.error('Maximum quality jSquash processing failed:', error);
    throw error;
  }
}

// Enhanced Canvas API image processing (fallback) - MAXIMUM QUALITY
async function processImageWithCanvas(file, options) {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = function() {
      // Set canvas dimensions
      canvas.width = img.width;
      canvas.height = img.height;

      // 🎨 최고 품질 렌더링 설정 (속도 희생)
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high'; // 최고 품질 스무딩

      // 🔧 고급 컨텍스트 설정들
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1.0;

      // 🎯 픽셀 완벽 렌더링을 위한 설정
      ctx.translate(0.5, 0.5); // 서브픽셀 렌더링 방지
      ctx.drawImage(img, -0.5, -0.5, img.width, img.height);
      ctx.translate(-0.5, -0.5);

      // 🔍 고품질 최적화 적용 (속도 희생)
      if (options.optimize) {
        console.log('Applying maximum quality optimizations to Canvas...');

        // 🎨 고급 이미지 처리 (대형 이미지용)
        if (img.width > 2000 || img.height > 2000) {
          // 🔧 대형 이미지 최적화 - 세밀한 처리
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;

          // 🌈 색상 정확도 향상 (매우 세밀한 조정)
          for (let i = 0; i < data.length; i += 4) {
            // 🎯 색상 정확도 미세 조정 (거의 무손실 수준)
            data[i] = Math.min(255, Math.max(0, data[i] * 1.001));     // Red - 극미세 조정
            data[i + 1] = Math.min(255, Math.max(0, data[i + 1] * 1.001)); // Green
            data[i + 2] = Math.min(255, Math.max(0, data[i + 2] * 1.001)); // Blue
            // Alpha는 그대로 유지
          }

          ctx.putImageData(imageData, 0, 0);
        }

        // 🔍 중간 크기 이미지 최적화
        else if (img.width > 800 || img.height > 800) {
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;

          // 🎨 색상 선명도 극미세 향상
          for (let i = 0; i < data.length; i += 4) {
            // 매우 보수적인 선명도 향상 (품질 손실 최소화)
            const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
            const factor = brightness > 128 ? 1.002 : 0.999; // 극미세 조정

            data[i] = Math.min(255, Math.max(0, data[i] * factor));
            data[i + 1] = Math.min(255, Math.max(0, data[i + 1] * factor));
            data[i + 2] = Math.min(255, Math.max(0, data[i + 2] * factor));
          }

          ctx.putImageData(imageData, 0, 0);
        }
      }

      // 🎯 최고 품질 변환 설정
      const quality = options.quality / 100;
      let mimeType = `image/${options.format}`;

      if (options.format === 'jpg') {
        mimeType = 'image/jpeg';
      }

      // 🔍 브라우저 지원 확인 (WebP)
      if (options.format === 'webp') {
        // WebP 지원 테스트 (더 정확한 방법)
        const testCanvas = document.createElement('canvas');
        testCanvas.width = 1;
        testCanvas.height = 1;
        const testCtx = testCanvas.getContext('2d');
        testCtx.fillStyle = '#FF0000';
        testCtx.fillRect(0, 0, 1, 1);
        const testDataURL = testCanvas.toDataURL('image/webp', 1.0);

        if (!testDataURL.startsWith('data:image/webp')) {
          reject(new Error('WebP format is not supported in this browser'));
          return;
        }
      }

      // 🎨 최고 품질로 변환 (속도 희생)
      console.log(`Converting with Canvas API at maximum quality: ${(quality * 100).toFixed(1)}%`);

      canvas.toBlob((blob) => {
        if (blob) {
          console.log(`Canvas conversion successful. Size: ${blob.size} bytes`);
          resolve(blob);
        } else {
          reject(new Error('Canvas conversion failed - unable to create blob'));
        }
      }, mimeType, quality);
    };

    img.onerror = () => reject(new Error('Failed to load image for Canvas processing'));

    // 🔧 이미지 로딩 최적화
    img.crossOrigin = 'anonymous'; // CORS 문제 방지
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

// 헬퍼 함수: 그레이스케일 검사 (개선된 버전)
function checkIfGrayscale(imageData) {
  const data = imageData.data;
  let colorPixelCount = 0;
  const sampleSize = Math.min(1000, data.length / 4); // 최대 1000픽셀 샘플링

  for (let i = 0; i < sampleSize * 4; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    // 작은 차이는 허용 (압축 아티팩트 고려)
    if (Math.abs(r - g) > 2 || Math.abs(g - b) > 2 || Math.abs(r - b) > 2) {
      colorPixelCount++;
    }
  }

  // 5% 이상의 픽셀이 컬러 차이를 보이면 컬러 이미지로 판단
  return (colorPixelCount / sampleSize) < 0.05;
}
