import { commonStyles } from '../common/styles.js';

export function handleQrGenerator() {
  const html = `
    <!DOCTYPE html>
    <html lang="ko">
    <head>
      <title>QR Code Generator</title>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style>
        ${commonStyles}
        #qrcode {
          text-align: center;
          margin: 2rem 0;
          padding: 1rem 0;
          border-top: 1px solid #eee;
        }
        .size-controls {
          margin: 1rem 0;
        }
        .size-controls label {
          display: block;
          margin-bottom: 0.5rem;
        }
        .size-controls input[type="range"] {
          width: 100%;
          margin-top: 0.5rem;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <a href="/" class="back-link">← Back</a>
        <h1>QR Code Generator</h1>
        <p>Generate QR codes from text or URLs</p>
      </div>

      <div class="tool-container">
        <div class="input-group">
          <label for="input">Text or URL</label>
          <textarea id="input" placeholder="Enter text or URL to convert..." rows="3" autofocus></textarea>
        </div>

        <div class="size-controls">
          <label for="size">Size: <span id="sizeValue">200</span>px</label>
          <input type="range" id="size" min="100" max="400" value="200">
        </div>

        <button onclick="generate()">Generate</button>
        <button onclick="download()">Download</button>
        <button onclick="clear()">Clear</button>

        <div id="qrcode"></div>
      </div>

      <script src="https://cdn.jsdelivr.net/npm/qrcode@1.5.3/build/qrcode.min.js"></script>
      <script>
        const input = document.getElementById('input');
        const sizeSlider = document.getElementById('size');
        const sizeValue = document.getElementById('sizeValue');
        const qrcodeDiv = document.getElementById('qrcode');
        let currentCanvas = null;

        sizeSlider.addEventListener('input', function() {
          sizeValue.textContent = this.value;
          if (input.value) generate();
        });

        function generate() {
          if (!input.value.trim()) {
            alert('Please enter text or URL.');
            return;
          }

          qrcodeDiv.innerHTML = '';

          QRCode.toCanvas(input.value, {
            width: parseInt(sizeSlider.value),
            margin: 2,
            color: {
              dark: '#000000',
              light: '#FFFFFF'
            }
          }, function (error, canvas) {
            if (error) {
              qrcodeDiv.innerHTML = '<div class="result error">QR code generation failed: ' + error + '</div>';
            } else {
              qrcodeDiv.appendChild(canvas);
              currentCanvas = canvas;
            }
          });
        }

        function download() {
          if (!currentCanvas) {
            alert('Please generate a QR code first.');
            return;
          }

          const link = document.createElement('a');
          link.download = 'qrcode.png';
          link.href = currentCanvas.toDataURL();
          link.click();
        }

        function clear() {
          input.value = '';
          qrcodeDiv.innerHTML = '';
          currentCanvas = null;
        }

        input.addEventListener('input', function() {
          if (this.value.trim()) {
            generate();
          }
        });
      </script>
    </body>
    </html>
  `;

  return new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  });
}
