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
      </style>
    </head>
    <body>
      <div class="header">
        <a href="/" class="back-link">← Back</a>
        <h1>Image Converter</h1>
        <p>Convert image format and resize images</p>
      </div>

      <div class="tool-container">
        <div class="upload-area" id="uploadArea">
          <div>Click to select an image or drag & drop</div>
          <input type="file" id="fileInput" accept="image/*" style="display: none;">
        </div>

        <div id="controls" class="hidden">
          <div class="controls">
            <div class="input-group">
              <label for="outputFormat">Output Format</label>
              <select id="outputFormat">
                <option value="png">PNG</option>
                <option value="jpeg">JPEG</option>
                <option value="webp">WebP</option>
              </select>
            </div>

            <div class="input-group">
              <label for="quality">Quality: <span id="qualityValue">90</span>%</label>
              <input type="range" id="quality" min="10" max="100" value="90">
            </div>
          </div>

          <div class="size-controls">
            <h3>Resize Options</h3>
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
            <div>
              <label>
                <input type="checkbox" id="maintainAspect" checked> Maintain aspect ratio
              </label>
            </div>
          </div>

          <button onclick="convert()">Convert</button>
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
        const quality = document.getElementById('quality');
        const qualityValue = document.getElementById('qualityValue');
        const width = document.getElementById('width');
        const height = document.getElementById('height');
        const maintainAspect = document.getElementById('maintainAspect');
        const downloadBtn = document.getElementById('downloadBtn');

        let originalFile = null;
        let convertedBlob = null;

        // 업로드 영역 이벤트
        uploadArea.addEventListener('click', () => fileInput.click());
        uploadArea.addEventListener('dragover', handleDragOver);
        uploadArea.addEventListener('drop', handleDrop);
        fileInput.addEventListener('change', handleFileSelect);

        // 품질 슬라이더
        quality.addEventListener('input', function() {
          qualityValue.textContent = this.value;
        });

        // 종횡비 유지
        width.addEventListener('input', function() {
          if (maintainAspect.checked && originalFile) {
            const aspectRatio = originalImage.naturalHeight / originalImage.naturalWidth;
            height.value = Math.round(this.value * aspectRatio);
          }
        });

        height.addEventListener('input', function() {
          if (maintainAspect.checked && originalFile) {
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
              originalInfo.innerHTML =
                'Size: ' + this.naturalWidth + 'x' + this.naturalHeight + '<br>' +
                'File size: ' + fileSize + ' KB<br>' +
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

        function convert() {
          if (!originalFile) return;

          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');

          const targetWidth = parseInt(width.value) || originalImage.naturalWidth;
          const targetHeight = parseInt(height.value) || originalImage.naturalHeight;

          canvas.width = targetWidth;
          canvas.height = targetHeight;

          // 이미지 그리기
          ctx.drawImage(originalImage, 0, 0, targetWidth, targetHeight);

          // 변환
          const qualityNum = quality.value / 100;
          const mimeType = 'image/' + outputFormat.value;

          canvas.toBlob(function(blob) {
            if (!blob) {
              alert('Conversion failed');
              return;
            }

            convertedBlob = blob;
            const url = URL.createObjectURL(blob);
            convertedImage.src = url;

            const fileSize = (blob.size / 1024).toFixed(1);
            const originalSize = (originalFile.size / 1024).toFixed(1);
            const reduction = ((1 - blob.size / originalFile.size) * 100).toFixed(1);

            convertedInfo.innerHTML =
              'Size: ' + targetWidth + 'x' + targetHeight + '<br>' +
              'File size: ' + fileSize + ' KB<br>' +
              'Format: ' + mimeType + '<br>' +
              'Reduction: ' + reduction + '%';

            downloadBtn.disabled = false;

          }, mimeType, qualityNum);
        }

        function download() {
          if (!convertedBlob) return;

          const link = document.createElement('a');
          link.href = URL.createObjectURL(convertedBlob);

          const extension = outputFormat.value === 'jpeg' ? 'jpg' : outputFormat.value;
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
          fileInput.value = '';
        }
      </script>
    </body>
    </html>
  `;

  return new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  });
}
