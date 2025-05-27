import { commonStyles } from '../common/styles.js';

export function handleTextDiff() {
  const html = `
    <!DOCTYPE html>
    <html lang="ko">
    <head>
      <title>Text Diff</title>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style>
        ${commonStyles}
        .diff-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin: 1rem 0;
        }
        @media (max-width: 800px) {
          .diff-container {
            grid-template-columns: 1fr;
          }
        }
        .diff-output {
          background: #f5f5f5;
          padding: 1rem;
          font-family: 'Monaco', 'Menlo', monospace;
          font-size: 0.85rem;
          line-height: 1.4;
          white-space: pre-wrap;
          border: 1px solid #ddd;
          max-height: 400px;
          overflow-y: auto;
        }
        .added {
          background-color: #d4edda;
          color: #155724;
        }
        .removed {
          background-color: #f8d7da;
          color: #721c24;
        }
        .unchanged {
          color: #666;
        }
        .line-number {
          color: #999;
          margin-right: 1rem;
          user-select: none;
        }
        .stats {
          margin: 1rem 0;
          padding: 1rem;
          background: #f9f9f9;
          border: 1px solid #ddd;
        }
        .controls {
          margin: 1rem 0;
        }
        .control-group {
          margin-bottom: 0.5rem;
        }
        .control-group label {
          display: inline;
          margin-right: 1rem;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <a href="/" class="back-link">← Back</a>
        <h1>Text Diff</h1>
        <p>Compare two text strings and highlight differences</p>
      </div>

      <div class="tool-container">
        <div class="diff-container">
          <div class="input-group">
            <label for="text1">Original Text</label>
            <textarea id="text1" placeholder="Enter original text here..." rows="10" autofocus></textarea>
          </div>
          <div class="input-group">
            <label for="text2">Modified Text</label>
            <textarea id="text2" placeholder="Enter modified text here..." rows="10"></textarea>
          </div>
        </div>

        <div class="controls">
          <div class="control-group">
            <label>
              <input type="checkbox" id="ignoreWhitespace"> Ignore whitespace
            </label>
          </div>
          <div class="control-group">
            <label>
              <input type="checkbox" id="ignoreCase"> Ignore case
            </label>
          </div>
          <button onclick="compare()">Compare</button>
          <button onclick="clear()">Clear</button>
        </div>

        <div id="stats" class="stats" style="display:none;"></div>
        <div id="result" class="result" style="display:none;"></div>
      </div>

      <script>
        const text1 = document.getElementById('text1');
        const text2 = document.getElementById('text2');
        const ignoreWhitespace = document.getElementById('ignoreWhitespace');
        const ignoreCase = document.getElementById('ignoreCase');
        const stats = document.getElementById('stats');
        const result = document.getElementById('result');

        // 간단한 diff 알고리즘 (Longest Common Subsequence 기반)
        function computeDiff(str1, str2, options = {}) {
          let lines1 = str1.split('\\n');
          let lines2 = str2.split('\\n');

          if (options.ignoreWhitespace) {
            lines1 = lines1.map(line => line.trim());
            lines2 = lines2.map(line => line.trim());
          }

          if (options.ignoreCase) {
            lines1 = lines1.map(line => line.toLowerCase());
            lines2 = lines2.map(line => line.toLowerCase());
          }

          const diff = [];
          const m = lines1.length;
          const n = lines2.length;

          // LCS 테이블 구성
          const lcs = Array(m + 1).fill().map(() => Array(n + 1).fill(0));

          for (let i = 1; i <= m; i++) {
            for (let j = 1; j <= n; j++) {
              if (lines1[i - 1] === lines2[j - 1]) {
                lcs[i][j] = lcs[i - 1][j - 1] + 1;
              } else {
                lcs[i][j] = Math.max(lcs[i - 1][j], lcs[i][j - 1]);
              }
            }
          }

          // 백트래킹으로 diff 구성
          let i = m, j = n;
          const originalLines1 = str1.split('\\n');
          const originalLines2 = str2.split('\\n');

          while (i > 0 || j > 0) {
            if (i > 0 && j > 0 && lines1[i - 1] === lines2[j - 1]) {
              diff.unshift({
                type: 'unchanged',
                line1: i,
                line2: j,
                content: originalLines1[i - 1]
              });
              i--;
              j--;
            } else if (j > 0 && (i === 0 || lcs[i][j - 1] >= lcs[i - 1][j])) {
              diff.unshift({
                type: 'added',
                line1: null,
                line2: j,
                content: originalLines2[j - 1]
              });
              j--;
            } else if (i > 0) {
              diff.unshift({
                type: 'removed',
                line1: i,
                line2: null,
                content: originalLines1[i - 1]
              });
              i--;
            }
          }

          return diff;
        }

        function compare() {
          const str1 = text1.value;
          const str2 = text2.value;

          if (!str1 && !str2) {
            showError('Please enter text in both fields');
            return;
          }

          const options = {
            ignoreWhitespace: ignoreWhitespace.checked,
            ignoreCase: ignoreCase.checked
          };

          try {
            const diff = computeDiff(str1, str2, options);

            // 통계 계산
            const added = diff.filter(d => d.type === 'added').length;
            const removed = diff.filter(d => d.type === 'removed').length;
            const unchanged = diff.filter(d => d.type === 'unchanged').length;
            const total = diff.length;

            // 통계 표시
            const statsText =
              'Lines added: ' + added + ' | ' +
              'Lines removed: ' + removed + ' | ' +
              'Lines unchanged: ' + unchanged + ' | ' +
              'Total lines: ' + total;

            stats.innerHTML = statsText;
            stats.style.display = 'block';

            // diff 결과 표시
            let diffHtml = '';
            diff.forEach(item => {
              const lineNum1 = item.line1 ? item.line1.toString().padStart(3, ' ') : '   ';
              const lineNum2 = item.line2 ? item.line2.toString().padStart(3, ' ') : '   ';
              const content = escapeHtml(item.content);

              if (item.type === 'added') {
                diffHtml += '<div class="added">+ <span class="line-number">' + lineNum2 + '</span>' + content + '</div>';
              } else if (item.type === 'removed') {
                diffHtml += '<div class="removed">- <span class="line-number">' + lineNum1 + '</span>' + content + '</div>';
              } else {
                diffHtml += '<div class="unchanged">  <span class="line-number">' + lineNum1 + '</span>' + content + '</div>';
              }
            });

            result.innerHTML = '<div class="diff-output">' + diffHtml + '</div>';
            result.style.display = 'block';
            result.className = 'result';

          } catch (e) {
            showError('Error comparing texts: ' + e.message);
          }
        }

        function escapeHtml(text) {
          const div = document.createElement('div');
          div.textContent = text;
          return div.innerHTML;
        }

        function clear() {
          text1.value = '';
          text2.value = '';
          stats.style.display = 'none';
          result.style.display = 'none';
        }

        function showError(text) {
          result.innerHTML = text;
          result.className = 'result error';
          result.style.display = 'block';
          stats.style.display = 'none';
        }

        // 실시간 비교 (debounced)
        let timeout;
        function debouncedCompare() {
          clearTimeout(timeout);
          timeout = setTimeout(() => {
            if (text1.value && text2.value) {
              compare();
            }
          }, 500);
        }

        text1.addEventListener('input', debouncedCompare);
        text2.addEventListener('input', debouncedCompare);
      </script>
    </body>
    </html>
  `;

  return new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  });
}
