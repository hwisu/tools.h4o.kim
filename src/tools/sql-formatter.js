import { commonStyles } from '../common/styles.js';

export function handleSqlFormatter() {
  const html = `
    <!DOCTYPE html>
    <html lang="ko">
    <head>
      <title>SQL Formatter</title>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style>
        ${commonStyles}
        .sql-output {
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
        <h1>SQL Formatter</h1>
        <p>Format and prettify SQL queries</p>
      </div>

      <div class="tool-container">
        <div class="input-group">
          <label for="input">SQL input</label>
          <textarea id="input" placeholder="SELECT * FROM users WHERE id=1;" rows="8" autofocus></textarea>
        </div>
        <button onclick="format()">Format</button>
        <button onclick="minify()">Minify</button>
        <button onclick="clear()">Clear</button>
        <div id="result" class="result" style="display:none;"></div>
      </div>

      <script>
        const input = document.getElementById('input');
        const result = document.getElementById('result');

        const SQL_KEYWORDS = [
          'SELECT', 'FROM', 'WHERE', 'JOIN', 'INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'FULL JOIN',
          'ORDER BY', 'GROUP BY', 'HAVING', 'INSERT', 'UPDATE', 'DELETE', 'CREATE', 'DROP',
          'ALTER', 'INDEX', 'TABLE', 'DATABASE', 'AS', 'AND', 'OR', 'NOT', 'IN', 'EXISTS',
          'BETWEEN', 'LIKE', 'IS', 'NULL', 'DISTINCT', 'COUNT', 'SUM', 'AVG', 'MIN', 'MAX',
          'UNION', 'CASE', 'WHEN', 'THEN', 'ELSE', 'END', 'IF', 'WITH'
        ];

        function format() {
          try {
            let sql = input.value.trim();
            if (!sql) {
              showError('Please enter SQL query');
              return;
            }

            // 기본 포맷팅
            sql = sql.replace(/;\\s*$/, ';'); // 마지막 세미콜론 정리

            // 키워드들을 대문자로 변환
            SQL_KEYWORDS.forEach(keyword => {
              const regex = new RegExp('\\\\b' + keyword.replace(/\\s+/g, '\\\\s+') + '\\\\b', 'gi');
              sql = sql.replace(regex, keyword);
            });

            // 줄바꿈 추가
            sql = sql.replace(/\\bSELECT\\b/gi, 'SELECT')
                     .replace(/\\bFROM\\b/gi, '\\nFROM')
                     .replace(/\\bWHERE\\b/gi, '\\nWHERE')
                     .replace(/\\bAND\\b/gi, '\\n  AND')
                     .replace(/\\bOR\\b/gi, '\\n  OR')
                     .replace(/\\bORDER BY\\b/gi, '\\nORDER BY')
                     .replace(/\\bGROUP BY\\b/gi, '\\nGROUP BY')
                     .replace(/\\bHAVING\\b/gi, '\\nHAVING')
                     .replace(/\\bJOIN\\b/gi, '\\nJOIN')
                     .replace(/\\bINNER JOIN\\b/gi, '\\nINNER JOIN')
                     .replace(/\\bLEFT JOIN\\b/gi, '\\nLEFT JOIN')
                     .replace(/\\bRIGHT JOIN\\b/gi, '\\nRIGHT JOIN')
                     .replace(/\\bUNION\\b/gi, '\\nUNION');

            // 들여쓰기 정리
            const lines = sql.split('\\n');
            const formatted = lines.map(line => {
              line = line.trim();
              if (line.startsWith('AND') || line.startsWith('OR')) {
                return '  ' + line;
              }
              return line;
            }).join('\\n');

            showResult('<div class="sql-output">' + formatted + '</div>');
          } catch (e) {
            showError('Formatting error: ' + e.message);
          }
        }

        function minify() {
          try {
            let sql = input.value.trim();
            if (!sql) {
              showError('Please enter SQL query');
              return;
            }

            // 공백 제거 및 압축
            sql = sql.replace(/\\s+/g, ' ')
                     .replace(/\\s*,\\s*/g, ',')
                     .replace(/\\s*\\(\\s*/g, '(')
                     .replace(/\\s*\\)\\s*/g, ')')
                     .replace(/\\s*=\\s*/g, '=')
                     .replace(/\\s*;\\s*/g, ';')
                     .trim();

            showResult('<div class="sql-output">' + sql + '</div>');
          } catch (e) {
            showError('Minification error: ' + e.message);
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
