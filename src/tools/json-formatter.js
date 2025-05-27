import { commonStyles } from '../common/styles.js';

export function handleJsonFormatter() {
  const html = `
    <!DOCTYPE html>
    <html lang="ko">
    <head>
      <title>JSON Formatter</title>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style>
        ${commonStyles}
        .json-output {
          background: #f5f5f5;
          padding: 1rem;
          font-family: 'Monaco', 'Menlo', monospace;
          white-space: pre-wrap;
          overflow-x: auto;
          border: 1px solid #ddd;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <a href="/" class="back-link">← Back</a>
        <h1>JSON Formatter</h1>
        <p>Format, validate, and minify JSON</p>
      </div>

      <div class="tool-container">
        <div class="input-group">
          <label for="input">JSON input</label>
          <textarea id="input" placeholder='{"key": "value"}' rows="6" autofocus></textarea>
        </div>
        <button onclick="format()">Format</button>
        <button onclick="minify()">Minify</button>
        <button onclick="validate()">Validate</button>
        <button onclick="clear()">Clear</button>
        <div id="result" class="result" style="display:none;"></div>
      </div>

      <script>
        const input = document.getElementById('input');
        const result = document.getElementById('result');

        function format() {
          try {
            const obj = JSON.parse(input.value);
            const formatted = JSON.stringify(obj, null, 2);
            showResult('<div class="json-output">' + formatted + '</div>');
          } catch (e) {
            showError('JSON parsing error: ' + e.message);
          }
        }

        function minify() {
          try {
            const obj = JSON.parse(input.value);
            const minified = JSON.stringify(obj);
            showResult('<div class="json-output">' + minified + '</div>');
          } catch (e) {
            showError('JSON parsing error: ' + e.message);
          }
        }

        function validate() {
          try {
            JSON.parse(input.value);
            showResult('Valid JSON');
          } catch (e) {
            showError('Invalid JSON: ' + e.message);
          }
        }

        function clear() {
          input.value = '';
          result.style.display = 'none';
        }

        function showResult(html) {
          result.innerHTML = html;
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
