import { commonStyles } from '../common/styles.js';

export function handleTextCounter() {
  const html = `
    <!DOCTYPE html>
    <html lang="ko">
    <head>
      <title>Text Counter</title>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style>
        ${commonStyles}
        .stats {
          margin-top: 2rem;
          padding: 1rem 0;
          border-top: 1px solid #eee;
        }
        .stat-line {
          margin-bottom: 0.5rem;
          font-family: 'Monaco', 'Menlo', monospace;
          font-size: 0.9rem;
        }
        .stat-label {
          color: #666;
          display: inline-block;
          width: 120px;
        }
        .stat-number {
          font-weight: bold;
          color: #333;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <a href="/" class="back-link">← Back</a>
        <h1>Text Counter</h1>
        <p>Count characters, words, and lines in real-time</p>
      </div>

      <div class="tool-container">
        <label for="text">Text input</label>
        <textarea id="text" placeholder="Enter your text here..." rows="12" autofocus></textarea>

        <div class="stats">
          <div class="stat-line">
            <span class="stat-label">Characters:</span>
            <span class="stat-number" id="chars">0</span>
          </div>
          <div class="stat-line">
            <span class="stat-label">No spaces:</span>
            <span class="stat-number" id="charsNoSpace">0</span>
          </div>
          <div class="stat-line">
            <span class="stat-label">Words:</span>
            <span class="stat-number" id="words">0</span>
          </div>
          <div class="stat-line">
            <span class="stat-label">Lines:</span>
            <span class="stat-number" id="lines">0</span>
          </div>
        </div>
      </div>

      <script>
        const text = document.getElementById('text');
        const chars = document.getElementById('chars');
        const charsNoSpace = document.getElementById('charsNoSpace');
        const words = document.getElementById('words');
        const lines = document.getElementById('lines');

        function update() {
          const val = text.value;
          chars.textContent = val.length;
          charsNoSpace.textContent = val.replace(/\\s/g, '').length;
          words.textContent = val.trim() ? val.trim().split(/\\s+/).length : 0;
          lines.textContent = val ? val.split('\\n').length : 0;
        }

        text.addEventListener('input', update);
        update();
      </script>
    </body>
    </html>
  `;

  return new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  });
}
