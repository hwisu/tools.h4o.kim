import { commonStyles } from '../common/styles.js';

export function handleUrlEncoder() {
  const html = `
    <!DOCTYPE html>
    <html lang="ko">
    <head>
      <title>URL Encoder/Decoder</title>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style>${commonStyles}</style>
    </head>
    <body>
      <div class="header">
        <a href="/" class="back-link">← Back</a>
        <h1>URL Encoder/Decoder</h1>
        <p>Safely encode and decode URLs</p>
      </div>

      <div class="tool-container">
        <div class="input-group">
          <label for="input">Input text</label>
          <textarea id="input" placeholder="Enter URL or text here..." rows="4" autofocus></textarea>
        </div>
        <button onclick="encode()">Encode</button>
        <button onclick="decode()">Decode</button>
        <button onclick="clear()">Clear</button>
        <div id="result" class="result" style="display:none;"></div>
      </div>

      <script>
        const input = document.getElementById('input');
        const result = document.getElementById('result');

        function encode() {
          try {
            const encoded = encodeURIComponent(input.value);
            showResult(encoded);
          } catch (e) {
            showError('Encoding failed: ' + e.message);
          }
        }

        function decode() {
          try {
            const decoded = decodeURIComponent(input.value);
            showResult(decoded);
          } catch (e) {
            showError('Decoding failed: ' + e.message);
          }
        }

        function clear() {
          input.value = '';
          result.style.display = 'none';
        }

        function showResult(text) {
          result.innerHTML = 'Result:<br>' + text;
          result.className = 'result';
          result.style.display = 'block';
        }

        function showError(text) {
          result.innerHTML = text;
          result.className = 'result error';
          result.style.display = 'block';
        }
      </script>
    </body>
    </html>
  `;

  return new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  });
}
