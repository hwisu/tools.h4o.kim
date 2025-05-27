import { commonStyles } from '../common/styles.js';

export function handleHashGenerator() {
  const html = `
    <!DOCTYPE html>
    <html lang="ko">
    <head>
      <title>Hash Generator</title>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style>
        ${commonStyles}
        .hash-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 1rem;
          margin: 2rem 0;
        }
        @media (max-width: 800px) {
          .hash-grid {
            grid-template-columns: 1fr;
          }
        }
        .hash-result {
          background: #f5f5f5;
          padding: 1rem;
          border: 1px solid #ddd;
          border-radius: 3px;
        }
        .hash-type {
          font-weight: bold;
          margin-bottom: 0.5rem;
          color: #333;
        }
        .hash-value {
          font-family: 'Monaco', 'Menlo', monospace;
          font-size: 0.8rem;
          word-break: break-all;
          background: #fff;
          padding: 0.5rem;
          border: 1px solid #ccc;
          border-radius: 2px;
          cursor: pointer;
          user-select: all;
        }
        .hash-value:hover {
          background: #f0f0f0;
        }
        .file-input-area {
          border: 2px dashed #ccc;
          border-radius: 5px;
          padding: 2rem;
          text-align: center;
          margin: 1rem 0;
          cursor: pointer;
        }
        .file-input-area:hover, .file-input-area.dragover {
          border-color: #666;
        }
        .tab-container {
          margin: 1rem 0;
        }
        .tabs {
          display: flex;
          border-bottom: 1px solid #ddd;
          margin-bottom: 1rem;
        }
        .tab {
          padding: 0.5rem 1rem;
          cursor: pointer;
          border: none;
          background: #f5f5f5;
          margin-right: 1px;
        }
        .tab.active {
          background: #fff;
          border-bottom: 2px solid #333;
        }
        .tab-content {
          display: none;
        }
        .tab-content.active {
          display: block;
        }
        .status {
          margin: 1rem 0;
          padding: 0.5rem;
          background: #e8f5e8;
          border: 1px solid #4caf50;
          border-radius: 3px;
          display: none;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <a href="/" class="back-link">← Back</a>
        <h1>Hash Generator</h1>
        <p>Generate MD5, SHA1, SHA256 hashes from text or files</p>
      </div>

      <div class="tool-container">
        <div class="tab-container">
          <div class="tabs">
            <button class="tab active" onclick="switchTab('text')">Text Input</button>
            <button class="tab" onclick="switchTab('file')">File Input</button>
          </div>

          <div id="textTab" class="tab-content active">
            <div class="input-group">
              <label for="textInput">Text to hash</label>
              <textarea id="textInput" placeholder="Enter text to generate hashes..." rows="6" autofocus></textarea>
            </div>
            <button onclick="generateTextHashes()">Generate Hashes</button>
          </div>

          <div id="fileTab" class="tab-content">
            <div class="file-input-area" id="fileInputArea">
              <div>Click to select a file or drag & drop</div>
              <input type="file" id="fileInput" style="display: none;">
            </div>
            <button onclick="generateFileHashes()" id="generateFileBtn" disabled>Generate File Hashes</button>
          </div>
        </div>

        <div class="status" id="status"></div>

        <div class="hash-grid" id="results" style="display: none;">
          <div class="hash-result">
            <div class="hash-type">MD5</div>
            <div class="hash-value" id="md5Result" onclick="copyToClipboard('md5Result')" title="Click to copy">-</div>
          </div>
          <div class="hash-result">
            <div class="hash-type">SHA1</div>
            <div class="hash-value" id="sha1Result" onclick="copyToClipboard('sha1Result')" title="Click to copy">-</div>
          </div>
          <div class="hash-result">
            <div class="hash-type">SHA256</div>
            <div class="hash-value" id="sha256Result" onclick="copyToClipboard('sha256Result')" title="Click to copy">-</div>
          </div>
        </div>

        <button onclick="clear()" style="margin-top: 1rem;">Clear</button>
      </div>

      <!-- Crypto-js 라이브러리 로드 -->
      <script src="https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js"></script>
      <script>
        const textInput = document.getElementById('textInput');
        const fileInput = document.getElementById('fileInput');
        const fileInputArea = document.getElementById('fileInputArea');
        const generateFileBtn = document.getElementById('generateFileBtn');
        const results = document.getElementById('results');
        const status = document.getElementById('status');
        const md5Result = document.getElementById('md5Result');
        const sha1Result = document.getElementById('sha1Result');
        const sha256Result = document.getElementById('sha256Result');

        let selectedFile = null;

        // 파일 입력 이벤트
        fileInputArea.addEventListener('click', () => fileInput.click());
        fileInputArea.addEventListener('dragover', handleDragOver);
        fileInputArea.addEventListener('drop', handleDrop);
        fileInput.addEventListener('change', handleFileSelect);

        // 실시간 텍스트 해시 생성
        textInput.addEventListener('input', function() {
          if (this.value.trim()) {
            generateTextHashes();
          }
        });

        function switchTab(tabName) {
          // 탭 버튼 활성화
          document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
          event.target.classList.add('active');

          // 탭 내용 표시
          document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
          });
          document.getElementById(tabName + 'Tab').classList.add('active');

          // 결과 초기화
          if (tabName === 'text') {
            if (textInput.value.trim()) {
              generateTextHashes();
            }
          }
        }

        function handleDragOver(e) {
          e.preventDefault();
          fileInputArea.classList.add('dragover');
        }

        function handleDrop(e) {
          e.preventDefault();
          fileInputArea.classList.remove('dragover');
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
          selectedFile = file;
          const fileSize = (file.size / 1024).toFixed(1);
          fileInputArea.innerHTML =
            '<strong>' + file.name + '</strong><br>' +
            'Size: ' + fileSize + ' KB<br>' +
            'Type: ' + file.type;
          generateFileBtn.disabled = false;
        }

        function generateTextHashes() {
          const text = textInput.value;
          if (!text.trim()) {
            results.style.display = 'none';
            return;
          }

          try {
            const md5 = CryptoJS.MD5(text).toString();
            const sha1 = CryptoJS.SHA1(text).toString();
            const sha256 = CryptoJS.SHA256(text).toString();

            md5Result.textContent = md5;
            sha1Result.textContent = sha1;
            sha256Result.textContent = sha256;

            results.style.display = 'grid';
            showStatus('Hashes generated successfully');

          } catch (e) {
            showStatus('Error generating hashes: ' + e.message, 'error');
          }
        }

        function generateFileHashes() {
          if (!selectedFile) return;

          showStatus('Reading file and generating hashes...', 'info');

          const reader = new FileReader();
          reader.onload = function(e) {
            try {
              const wordArray = CryptoJS.lib.WordArray.create(e.target.result);

              const md5 = CryptoJS.MD5(wordArray).toString();
              const sha1 = CryptoJS.SHA1(wordArray).toString();
              const sha256 = CryptoJS.SHA256(wordArray).toString();

              md5Result.textContent = md5;
              sha1Result.textContent = sha1;
              sha256Result.textContent = sha256;

              results.style.display = 'grid';
              showStatus('File hashes generated successfully');

            } catch (e) {
              showStatus('Error generating file hashes: ' + e.message, 'error');
            }
          };

          reader.onerror = function() {
            showStatus('Error reading file', 'error');
          };

          reader.readAsArrayBuffer(selectedFile);
        }

        function copyToClipboard(elementId) {
          const element = document.getElementById(elementId);
          const text = element.textContent;

          if (text === '-') return;

          navigator.clipboard.writeText(text).then(() => {
            showStatus('Hash copied to clipboard');
          }).catch(() => {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            showStatus('Hash copied to clipboard');
          });
        }

        function showStatus(message, type = 'success') {
          status.textContent = message;
          status.className = 'status';
          if (type === 'error') {
            status.style.background = '#ffebee';
            status.style.borderColor = '#f44336';
            status.style.color = '#c62828';
          } else if (type === 'info') {
            status.style.background = '#e3f2fd';
            status.style.borderColor = '#2196f3';
            status.style.color = '#1565c0';
          } else {
            status.style.background = '#e8f5e8';
            status.style.borderColor = '#4caf50';
            status.style.color = '#2e7d32';
          }
          status.style.display = 'block';

          setTimeout(() => {
            status.style.display = 'none';
          }, 3000);
        }

        function clear() {
          textInput.value = '';
          selectedFile = null;
          generateFileBtn.disabled = true;
          fileInputArea.innerHTML = '<div>Click to select a file or drag & drop</div>';
          results.style.display = 'none';
          status.style.display = 'none';
          md5Result.textContent = '-';
          sha1Result.textContent = '-';
          sha256Result.textContent = '-';
        }
      </script>
    </body>
    </html>
  `;

  return new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  });
}
