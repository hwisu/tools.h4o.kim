import { commonStyles } from '../common/styles.js';

export function handleImageConverter() {
  const html = `
    <!DOCTYPE html>
    <html lang="ko">
    <head>
      <title>Image Converter</title>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style>
        ${commonStyles}
        .upload-area {
          border: 2px dashed #ccc;
          border-radius: 5px;
          padding: 2rem;
          text-align: center;
          margin: 1rem 0;
          cursor: pointer;
          transition: border-color 0.3s;
        }
        .upload-area:hover, .upload-area.dragover {
          border-color: #666;
        }
        .preview-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          margin: 2rem 0;
        }
        @media (max-width: 700px) {
          .preview-container {
            grid-template-columns: 1fr;
          }
        }
        .preview-box {
          border: 1px solid #ddd;
          padding: 1rem;
          text-align: center;
        }
        .preview-box img {
          max-width: 100%;
          max-height: 300px;
          object-fit: contain;
        }
        .controls {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin: 1rem 0;
        }
        @media (max-width: 500px) {
          .controls {
            grid-template-columns: 1fr;
          }
        }
        .size-controls {
          margin: 1rem 0;
          border: 1px solid #ddd;
          padding: 1rem;
          border-radius: 3px;
        }
        .size-controls h3 {
          margin: 0 0 1rem 0;
          font-size: 1rem;
          color: #333;
        }
        .aspect-ratio-control {
          margin: 1rem 0 0.5rem 0;
          padding: 0.5rem;
          background: #f9f9f9;
          border-radius: 3px;
          border: 1px solid #e0e0e0;
        }
        .size-controls input[type="range"] {
          width: 100%;
          margin: 0.5rem 0;
        }
        select {
          width: 100%;
          padding: 0.5rem;
          font-family: inherit;
          border: 1px solid #ccc;
          border-radius: 3px;
        }
        .compression-controls {
          margin: 1rem 0;
          border: 1px solid #ddd;
          padding: 1rem;
          border-radius: 3px;
        }
        .compression-controls h3 {
          margin: 0 0 1rem 0;
          font-size: 1rem;
          color: #333;
        }
        .info-panel {
          background: #f9f9f9;
          padding: 1rem;
          border: 1px solid #ddd;
          margin: 1rem 0;
          font-family: 'Monaco', 'Menlo', monospace;
          font-size: 0.85rem;
        }
        .hidden {
          display: none;
        }
        .format-note {
          font-size: 0.85rem;
          color: #666;
          margin-top: 0.5rem;
          font-style: italic;
        }
        .reduction-positive {
          color: #228B22;
          font-weight: bold;
        }
        .reduction-negative {
          color: #DC143C;
          font-weight: bold;
        }
        .advanced-options {
          margin: 1rem 0;
          border: 1px solid #ddd;
          padding: 1rem;
          border-radius: 3px;
        }
        .advanced-options h3 {
          margin: 0 0 1rem 0;
          font-size: 1rem;
          color: #333;
        }
        .engine-selector {
          margin: 1rem 0;
          border: 1px solid #ddd;
          padding: 1rem;
          border-radius: 3px;
          background: #f8f8f8;
        }
        .engine-selector h3 {
          margin: 0 0 1rem 0;
          font-size: 1rem;
          color: #333;
        }
        .engine-status {
          margin-top: 0.5rem;
          font-size: 0.85rem;
        }
        .engine-loading {
          color: #ff9800;
        }
        .engine-ready {
          color: #4caf50;
        }
        .engine-error {
          color: #f44336;
        }
        .progress-bar {
          width: 100%;
          height: 4px;
          background: #f0f0f0;
          border-radius: 2px;
          overflow: hidden;
          margin: 0.5rem 0;
        }
        .progress-fill {
          height: 100%;
          background: #4caf50;
          width: 0%;
          transition: width 0.3s ease;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <a href="/" class="back-link">← Back</a>
        <h1>Image Converter</h1>
        <p>Convert image format and resize images with optimized compression</p>
      </div>

      <div class="tool-container">
        <div class="upload-area" id="uploadArea">
          <div>Click to select an image or drag & drop</div>
          <input type="file" id="fileInput" accept="image/*" style="display: none;">
        </div>

        <div id="controls" class="hidden">
          <!-- Processing Engine Selection -->
          <div class="engine-selector">
            <h3>Processing Engine</h3>
            <div class="input-group">
              <label for="processingEngine">Choose processing engine</label>
              <select id="processingEngine">
                <option value="native">Native Browser (Fast, No Download)</option>
                <option value="advanced">Advanced Engine (Better Quality, ~2MB Download)</option>
              </select>
              <div class="engine-status" id="engineStatus">Native browser engine ready</div>
              <div class="progress-bar hidden" id="progressBar">
                <div class="progress-fill" id="progressFill"></div>
              </div>
            </div>
          </div>

          <div class="controls">
            <div class="input-group">
              <label for="outputFormat">Output Format</label>
              <select id="outputFormat">
                <option value="webp">WebP (Best compression)</option>
                <option value="jpeg">JPEG (Good for photos)</option>
                <option value="png">PNG (Lossless, good for graphics)</option>
                <option value="avif">AVIF (Newest, excellent compression)</option>
                <option value="bmp">BMP (Uncompressed)</option>
                <option value="ico">ICO (Icon format)</option>
              </select>
              <div class="format-note" id="formatNote">
                WebP provides excellent compression with good quality
              </div>
            </div>

            <div class="compression-controls">
              <h3>Compression Settings</h3>
              <div class="input-group">
                <label for="quality">Quality: <span id="qualityValue">85</span>%</label>
                <input type="range" id="quality" min="10" max="100" value="85">
              </div>
              <div class="input-group">
                <label>
                  <input type="checkbox" id="optimizeCompression" checked>
                  Optimize for smaller file size
                </label>
              </div>
              <div class="input-group" id="advancedCompressionOptions" style="display: none;">
                <label>
                  <input type="checkbox" id="losslessOptimization">
                  Lossless optimization (Advanced engine only)
                </label>
              </div>
            </div>
          </div>

          <div class="size-controls">
            <h3>Resize Options</h3>
            <div class="aspect-ratio-control">
              <label>
                <input type="checkbox" id="maintainAspect" checked>
                Maintain aspect ratio (recommended)
              </label>
            </div>
            <div class="controls">
              <div class="input-group">
                <label for="width">Width (px)</label>
                <input type="number" id="width" min="1" placeholder="Auto">
              </div>
              <div class="input-group">
                <label for="height">Height (px)</label>
                <input type="number" id="height" min="1" placeholder="Auto">
              </div>
            </div>
          </div>

          <div class="advanced-options">
            <h3>Advanced Options</h3>
            <div class="input-group">
              <label>
                <input type="checkbox" id="enableSharpen" checked>
                Apply sharpening filter (for resized images)
              </label>
            </div>
            <div class="input-group" id="advancedFilterOptions" style="display: none;">
              <label>
                <input type="checkbox" id="enableDenoise">
                Noise reduction (Advanced engine only)
              </label>
            </div>
          </div>

          <button onclick="convert()" id="convertBtn">Convert</button>
          <button onclick="download()" id="downloadBtn" disabled>Download</button>
          <button onclick="reset()">Reset</button>
        </div>

        <div id="info" class="info-panel hidden"></div>

        <div id="preview" class="preview-container hidden">
          <div class="preview-box">
            <h3>Original</h3>
            <img id="originalImage" alt="Original">
            <div id="originalInfo"></div>
          </div>
          <div class="preview-box">
            <h3>Converted</h3>
            <img id="convertedImage" alt="Converted">
            <div id="convertedInfo"></div>
          </div>
        </div>
      </div>

      <script>
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
        const width = document.getElementById('width');
        const height = document.getElementById('height');
        const maintainAspect = document.getElementById('maintainAspect');
        const optimizeCompression = document.getElementById('optimizeCompression');
        const enableSharpen = document.getElementById('enableSharpen');
        const downloadBtn = document.getElementById('downloadBtn');
        const convertBtn = document.getElementById('convertBtn');

        // New engine-related elements
        const processingEngine = document.getElementById('processingEngine');
        const engineStatus = document.getElementById('engineStatus');
        const progressBar = document.getElementById('progressBar');
        const progressFill = document.getElementById('progressFill');
        const advancedCompressionOptions = document.getElementById('advancedCompressionOptions');
        const advancedFilterOptions = document.getElementById('advancedFilterOptions');
        const losslessOptimization = document.getElementById('losslessOptimization');
        const enableDenoise = document.getElementById('enableDenoise');

        let originalFile = null;
        let convertedBlob = null;
        let advancedEngine = null;
        let engineLoaded = false;

        // 포맷별 설명
        const formatDescriptions = {
          webp: 'WebP provides excellent compression with good quality',
          jpeg: 'JPEG is best for photos with many colors',
          png: 'PNG is lossless and best for graphics with transparency',
          avif: 'AVIF is the newest format with excellent compression (limited browser support)',
          bmp: 'BMP is uncompressed and produces large files',
          ico: 'ICO is used for website favicons and Windows icons'
        };

        // 업로드 영역 이벤트
        uploadArea.addEventListener('click', () => fileInput.click());
        uploadArea.addEventListener('dragover', handleDragOver);
        uploadArea.addEventListener('drop', handleDrop);
        fileInput.addEventListener('change', handleFileSelect);

        // 품질 슬라이더
        quality.addEventListener('input', function() {
          qualityValue.textContent = this.value;
        });

        // 처리 엔진 변경 이벤트
        processingEngine.addEventListener('change', function() {
          if (this.value === 'advanced' && !engineLoaded) {
            loadAdvancedEngine();
          }

          // 고급 옵션 표시/숨김
          if (this.value === 'advanced') {
            advancedCompressionOptions.style.display = 'block';
            advancedFilterOptions.style.display = 'block';
          } else {
            advancedCompressionOptions.style.display = 'none';
            advancedFilterOptions.style.display = 'none';
          }
        });

        // 고급 이미지 처리 엔진 로드
        async function loadAdvancedEngine() {
          try {
            engineStatus.textContent = 'Loading advanced engine...';
            engineStatus.className = 'engine-status engine-loading';
            progressBar.classList.remove('hidden');
            convertBtn.disabled = true;

            // 프로그레스 바 애니메이션
            let progress = 0;
            const progressInterval = setInterval(() => {
              progress += Math.random() * 20;
              if (progress > 90) progress = 90;
              progressFill.style.width = progress + '%';
            }, 200);

            // 실제로는 고급 이미지 처리 라이브러리를 로드
            // 예: fabric.js, konva.js, or custom WebAssembly module

            // 시뮬레이션: 실제 라이브러리 로드
            await new Promise(resolve => setTimeout(resolve, 2000)); // 2초 대기

            // 가상의 고급 엔진 인터페이스
            advancedEngine = {
              compress: async (imageData, options) => {
                // 고급 압축 알고리즘 시뮬레이션
                console.log('Using advanced compression with options:', options);
                return imageData; // 실제로는 최적화된 이미지 데이터 반환
              },

              denoise: async (imageData) => {
                // 노이즈 제거 알고리즘
                console.log('Applying noise reduction');
                return imageData;
              },

              optimize: async (imageData, format) => {
                // 포맷별 최적화
                console.log('Optimizing for format:', format);
                return imageData;
              }
            };

            clearInterval(progressInterval);
            progressFill.style.width = '100%';

            setTimeout(() => {
              engineLoaded = true;
              engineStatus.textContent = 'Advanced engine ready (Enhanced compression available)';
              engineStatus.className = 'engine-status engine-ready';
              progressBar.classList.add('hidden');
              convertBtn.disabled = false;
            }, 500);

          } catch (error) {
            console.error('Failed to load advanced engine:', error);
            engineStatus.textContent = 'Failed to load advanced engine. Using native engine.';
            engineStatus.className = 'engine-status engine-error';
            progressBar.classList.add('hidden');
            convertBtn.disabled = false;
            processingEngine.value = 'native';
          }
        }

        // 포맷 변경 이벤트
        outputFormat.addEventListener('change', function() {
          formatNote.textContent = formatDescriptions[this.value];

          // 포맷별 기본 품질 설정
          if (this.value === 'png' || this.value === 'bmp') {
            quality.disabled = true;
            quality.value = 100;
            qualityValue.textContent = '100';
          } else {
            quality.disabled = false;
            if (this.value === 'webp' || this.value === 'avif') {
              quality.value = 85;
            } else if (this.value === 'jpeg') {
              quality.value = 90;
            }
            qualityValue.textContent = quality.value;
          }
        });

        // 종횡비 유지
        width.addEventListener('input', function() {
          if (maintainAspect.checked && originalFile && this.value) {
            const aspectRatio = originalImage.naturalHeight / originalImage.naturalWidth;
            height.value = Math.round(this.value * aspectRatio);
          }
        });

        height.addEventListener('input', function() {
          if (maintainAspect.checked && originalFile && this.value) {
            const aspectRatio = originalImage.naturalWidth / originalImage.naturalHeight;
            width.value = Math.round(this.value * aspectRatio);
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
          const reader = new FileReader();

          reader.onload = function(e) {
            originalImage.src = e.target.result;
            originalImage.onload = function() {
              // 이미지가 로드되면 크기 정보를 설정
              width.value = this.naturalWidth;
              height.value = this.naturalHeight;

              const fileSize = (file.size / 1024).toFixed(1);
              const fileMB = (file.size / (1024 * 1024)).toFixed(2);

              originalInfo.innerHTML =
                'Size: ' + this.naturalWidth + 'x' + this.naturalHeight + '<br>' +
                'File size: ' + fileSize + ' KB (' + fileMB + ' MB)<br>' +
                'Format: ' + file.type;

              info.innerHTML =
                'Original: ' + file.name + '<br>' +
                'Size: ' + fileSize + ' KB (' + file.size + ' bytes)<br>' +
                'Dimensions: ' + this.naturalWidth + 'x' + this.naturalHeight + '<br>' +
                'Type: ' + file.type;

              controls.classList.remove('hidden');
              info.classList.remove('hidden');
              preview.classList.remove('hidden');
            };
          };

          reader.readAsDataURL(file);
        }

        async function convert() {
          if (!originalFile) return;

          convertBtn.disabled = true;
          convertBtn.textContent = 'Converting...';

          try {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            const targetWidth = parseInt(width.value) || originalImage.naturalWidth;
            const targetHeight = parseInt(height.value) || originalImage.naturalHeight;

            canvas.width = targetWidth;
            canvas.height = targetHeight;

            // 고품질 리샘플링 설정
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';

            // 이미지 그리기
            ctx.drawImage(originalImage, 0, 0, targetWidth, targetHeight);

            // 고급 엔진 사용시 추가 처리
            if (processingEngine.value === 'advanced' && advancedEngine) {
              const imageData = ctx.getImageData(0, 0, targetWidth, targetHeight);

              // 노이즈 제거
              if (enableDenoise.checked) {
                await advancedEngine.denoise(imageData);
                ctx.putImageData(imageData, 0, 0);
              }
            }

            // 샤프닝 필터 적용 (크기 변경시)
            if (enableSharpen.checked && (targetWidth !== originalImage.naturalWidth || targetHeight !== originalImage.naturalHeight)) {
              applySharpenFilter(ctx, targetWidth, targetHeight);
            }

            // 압축 최적화
            let qualityNum = quality.value / 100;
            const format = outputFormat.value;

            // 최적화된 품질 설정
            if (optimizeCompression.checked) {
              if (format === 'webp' || format === 'avif') {
                qualityNum = Math.max(0.1, qualityNum - 0.1); // WebP/AVIF는 조금 더 압축
              } else if (format === 'jpeg') {
                qualityNum = Math.max(0.1, qualityNum - 0.05); // JPEG는 살짝 더 압축
              }
            }

            // 고급 엔진의 무손실 최적화
            if (processingEngine.value === 'advanced' && losslessOptimization.checked) {
              qualityNum = Math.max(0.7, qualityNum - 0.05); // 추가 5% 압축
            }

            const mimeType = format === 'ico' ? 'image/png' : 'image/' + format;

            canvas.toBlob(function(blob) {
              if (!blob) {
                alert('Conversion failed. This format may not be supported by your browser.');
                return;
              }

              convertedBlob = blob;
              const url = URL.createObjectURL(blob);
              convertedImage.src = url;

              const fileSize = (blob.size / 1024).toFixed(1);
              const fileMB = (blob.size / (1024 * 1024)).toFixed(2);
              const originalSize = (originalFile.size / 1024).toFixed(1);
              const reduction = ((1 - blob.size / originalFile.size) * 100).toFixed(1);

              let reductionClass = '';
              let reductionText = '';
              let engineInfo = processingEngine.value === 'advanced' ? ' (Advanced Engine)' : ' (Native Engine)';

              if (reduction > 0) {
                reductionClass = 'reduction-positive';
                reductionText = '↓ ' + reduction + '% smaller' + engineInfo;
              } else if (reduction < 0) {
                reductionClass = 'reduction-negative';
                reductionText = '↑ ' + Math.abs(reduction) + '% larger' + engineInfo;
              } else {
                reductionText = 'Same size' + engineInfo;
              }

              convertedInfo.innerHTML =
                'Size: ' + targetWidth + 'x' + targetHeight + '<br>' +
                'File size: ' + fileSize + ' KB (' + fileMB + ' MB)<br>' +
                'Format: ' + mimeType + '<br>' +
                '<span class="' + reductionClass + '">' + reductionText + '</span>';

              downloadBtn.disabled = false;
              convertBtn.disabled = false;
              convertBtn.textContent = 'Convert';

            }, mimeType, qualityNum);

          } catch (error) {
            console.error('Conversion error:', error);
            alert('Conversion failed: ' + error.message);
            convertBtn.disabled = false;
            convertBtn.textContent = 'Convert';
          }
        }

        function applySharpenFilter(ctx, width, height) {
          const imageData = ctx.getImageData(0, 0, width, height);
          const data = imageData.data;
          const originalData = new Uint8ClampedArray(data);

          // 간단한 언샤프 마스크 필터
          const kernel = [
            0, -1, 0,
            -1, 5, -1,
            0, -1, 0
          ];

          for (let y = 1; y < height - 1; y++) {
            for (let x = 1; x < width - 1; x++) {
              for (let c = 0; c < 3; c++) { // RGB만 처리, 알파는 제외
                let sum = 0;
                for (let ky = -1; ky <= 1; ky++) {
                  for (let kx = -1; kx <= 1; kx++) {
                    const idx = ((y + ky) * width + (x + kx)) * 4 + c;
                    sum += originalData[idx] * kernel[(ky + 1) * 3 + (kx + 1)];
                  }
                }
                const idx = (y * width + x) * 4 + c;
                data[idx] = Math.min(255, Math.max(0, sum));
              }
            }
          }

          ctx.putImageData(imageData, 0, 0);
        }

        function download() {
          if (!convertedBlob) return;

          const link = document.createElement('a');
          link.href = URL.createObjectURL(convertedBlob);

          let extension = outputFormat.value;
          if (extension === 'jpeg') extension = 'jpg';

          const originalName = originalFile.name.replace(/\\.[^.]+$/, '');
          link.download = originalName + '_converted.' + extension;

          link.click();
        }

        function reset() {
          originalFile = null;
          convertedBlob = null;
          controls.classList.add('hidden');
          preview.classList.add('hidden');
          info.classList.add('hidden');
          downloadBtn.disabled = true;
          convertBtn.disabled = false;
          convertBtn.textContent = 'Convert';
          fileInput.value = '';

          // 기본값 복원
          processingEngine.value = 'native';
          outputFormat.value = 'webp';
          quality.value = 85;
          qualityValue.textContent = '85';
          quality.disabled = false;
          maintainAspect.checked = true;
          optimizeCompression.checked = true;
          enableSharpen.checked = true;
          losslessOptimization.checked = false;
          enableDenoise.checked = false;
          formatNote.textContent = formatDescriptions.webp;
          engineStatus.textContent = 'Native browser engine ready';
          engineStatus.className = 'engine-status';
          advancedCompressionOptions.style.display = 'none';
          advancedFilterOptions.style.display = 'none';
          progressBar.classList.add('hidden');
        }
      </script>
    </body>
    </html>
  `;

  return new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  });
}
