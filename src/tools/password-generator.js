import { commonStyles } from '../common/styles.js';

export function handlePasswordGenerator() {
  const html = `
    <!DOCTYPE html>
    <html lang="ko">
    <head>
      <title>Password Generator</title>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style>
        ${commonStyles}
        .password-result {
          background: #f5f5f5;
          padding: 1rem;
          border: 1px solid #ddd;
          border-radius: 3px;
          margin: 1rem 0;
          font-family: 'Monaco', 'Menlo', monospace;
          font-size: 1.1rem;
          word-break: break-all;
          cursor: pointer;
          user-select: all;
        }
        .password-result:hover {
          background: #f0f0f0;
        }
        .controls-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin: 1rem 0;
        }
        @media (max-width: 600px) {
          .controls-grid {
            grid-template-columns: 1fr;
          }
        }
        .strength-meter {
          margin: 1rem 0;
          padding: 1rem;
          border: 1px solid #ddd;
          border-radius: 3px;
          background: #f9f9f9;
        }
        .strength-bar {
          width: 100%;
          height: 10px;
          background: #e0e0e0;
          border-radius: 5px;
          margin: 0.5rem 0;
          overflow: hidden;
        }
        .strength-fill {
          height: 100%;
          transition: all 0.3s ease;
        }
        .strength-weak { background: #f44336; }
        .strength-fair { background: #ff9800; }
        .strength-good { background: #2196f3; }
        .strength-strong { background: #4caf50; }
        .preset-buttons {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 0.5rem;
          margin: 1rem 0;
        }
        .preset-btn {
          background: #f5f5f5;
          border: 1px solid #ccc;
          padding: 0.5rem;
          cursor: pointer;
          font-size: 0.9rem;
        }
        .preset-btn:hover {
          background: #e0e0e0;
        }
        .batch-passwords {
          max-height: 300px;
          overflow-y: auto;
          border: 1px solid #ddd;
          margin: 1rem 0;
        }
        .batch-password-item {
          padding: 0.5rem;
          border-bottom: 1px solid #f0f0f0;
          font-family: 'Monaco', 'Menlo', monospace;
          cursor: pointer;
          user-select: all;
        }
        .batch-password-item:hover {
          background: #f5f5f5;
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
        <h1>Password Generator</h1>
        <p>Generate secure passwords with customizable options</p>
      </div>

      <div class="tool-container">
        <div class="controls-grid">
          <div class="input-group">
            <label for="length">Password Length: <span id="lengthValue">16</span></label>
            <input type="range" id="length" min="4" max="64" value="16">
          </div>
          <div class="input-group">
            <label for="count">Number of Passwords: <span id="countValue">1</span></label>
            <input type="range" id="count" min="1" max="20" value="1">
          </div>
        </div>

        <div class="preset-buttons">
          <button class="preset-btn" onclick="setPreset('simple')">Simple (a-z, A-Z, 0-9)</button>
          <button class="preset-btn" onclick="setPreset('complex')">Complex (+ symbols)</button>
          <button class="preset-btn" onclick="setPreset('alphanumeric')">Alphanumeric only</button>
          <button class="preset-btn" onclick="setPreset('memorable')">Memorable</button>
        </div>

        <div class="input-group">
          <h3>Character Sets</h3>
          <div>
            <label>
              <input type="checkbox" id="lowercase" checked> Lowercase (a-z)
            </label>
          </div>
          <div>
            <label>
              <input type="checkbox" id="uppercase" checked> Uppercase (A-Z)
            </label>
          </div>
          <div>
            <label>
              <input type="checkbox" id="numbers" checked> Numbers (0-9)
            </label>
          </div>
          <div>
            <label>
              <input type="checkbox" id="symbols" checked> Symbols (!@#$%^&*)
            </label>
          </div>
          <div>
            <label>
              <input type="checkbox" id="ambiguous"> Include ambiguous characters (0O1l)
            </label>
          </div>
        </div>

        <button onclick="generatePasswords()">Generate Password(s)</button>
        <button onclick="copyAll()" id="copyAllBtn" style="display: none;">Copy All</button>

        <div class="status" id="status"></div>

        <div id="singleResult" style="display: none;">
          <div class="password-result" id="passwordResult" onclick="copyToClipboard('passwordResult')" title="Click to copy"></div>

          <div class="strength-meter">
            <div><strong>Password Strength:</strong> <span id="strengthText">-</span></div>
            <div class="strength-bar">
              <div class="strength-fill" id="strengthFill" style="width: 0%;"></div>
            </div>
            <div id="strengthDetails"></div>
          </div>
        </div>

        <div id="batchResult" style="display: none;">
          <h3>Generated Passwords</h3>
          <div class="batch-passwords" id="batchPasswords"></div>
        </div>
      </div>

      <script>
        const lengthSlider = document.getElementById('length');
        const countSlider = document.getElementById('count');
        const lengthValue = document.getElementById('lengthValue');
        const countValue = document.getElementById('countValue');
        const lowercase = document.getElementById('lowercase');
        const uppercase = document.getElementById('uppercase');
        const numbers = document.getElementById('numbers');
        const symbols = document.getElementById('symbols');
        const ambiguous = document.getElementById('ambiguous');
        const passwordResult = document.getElementById('passwordResult');
        const singleResult = document.getElementById('singleResult');
        const batchResult = document.getElementById('batchResult');
        const batchPasswords = document.getElementById('batchPasswords');
        const copyAllBtn = document.getElementById('copyAllBtn');
        const status = document.getElementById('status');

        // 슬라이더 이벤트
        lengthSlider.addEventListener('input', function() {
          lengthValue.textContent = this.value;
        });

        countSlider.addEventListener('input', function() {
          countValue.textContent = this.value;
        });

        function setPreset(type) {
          switch(type) {
            case 'simple':
              lowercase.checked = true;
              uppercase.checked = true;
              numbers.checked = true;
              symbols.checked = false;
              ambiguous.checked = false;
              break;
            case 'complex':
              lowercase.checked = true;
              uppercase.checked = true;
              numbers.checked = true;
              symbols.checked = true;
              ambiguous.checked = false;
              break;
            case 'alphanumeric':
              lowercase.checked = true;
              uppercase.checked = true;
              numbers.checked = true;
              symbols.checked = false;
              ambiguous.checked = false;
              break;
            case 'memorable':
              lowercase.checked = true;
              uppercase.checked = true;
              numbers.checked = true;
              symbols.checked = false;
              ambiguous.checked = false;
              lengthSlider.value = 12;
              lengthValue.textContent = 12;
              break;
          }
        }

        function generatePassword() {
          let charset = '';

          if (lowercase.checked) charset += 'abcdefghijklmnopqrstuvwxyz';
          if (uppercase.checked) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
          if (numbers.checked) charset += '0123456789';
          if (symbols.checked) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';

          if (!ambiguous.checked) {
            charset = charset.replace(/[0O1l]/g, '');
          }

          if (!charset) {
            showStatus('Please select at least one character set', 'error');
            return '';
          }

          const length = parseInt(lengthSlider.value);
          let password = '';

          // Crypto API 사용 (보안성 향상)
          if (window.crypto && window.crypto.getRandomValues) {
            const array = new Uint8Array(length);
            window.crypto.getRandomValues(array);

            for (let i = 0; i < length; i++) {
              password += charset[array[i] % charset.length];
            }
          } else {
            // Fallback
            for (let i = 0; i < length; i++) {
              password += charset[Math.floor(Math.random() * charset.length)];
            }
          }

          return password;
        }

        function calculateStrength(password) {
          let score = 0;
          let details = [];

          // 길이 점수
          if (password.length >= 12) {
            score += 25;
            details.push('Good length (12+ chars)');
          } else if (password.length >= 8) {
            score += 15;
            details.push('Fair length (8+ chars)');
          } else {
            details.push('Short length (< 8 chars)');
          }

          // 문자 다양성
          if (/[a-z]/.test(password)) {
            score += 15;
            details.push('Contains lowercase');
          }
          if (/[A-Z]/.test(password)) {
            score += 15;
            details.push('Contains uppercase');
          }
          if (/[0-9]/.test(password)) {
            score += 15;
            details.push('Contains numbers');
          }
          if (/[^a-zA-Z0-9]/.test(password)) {
            score += 25;
            details.push('Contains symbols');
          }

          // 반복 패턴 체크
          if (!/(..).*\\1/.test(password)) {
            score += 5;
            details.push('No obvious patterns');
          }

          let strength, className;
          if (score >= 80) {
            strength = 'Very Strong';
            className = 'strength-strong';
          } else if (score >= 60) {
            strength = 'Strong';
            className = 'strength-good';
          } else if (score >= 40) {
            strength = 'Fair';
            className = 'strength-fair';
          } else {
            strength = 'Weak';
            className = 'strength-weak';
          }

          return { score, strength, className, details };
        }

        function generatePasswords() {
          const count = parseInt(countSlider.value);

          if (count === 1) {
            const password = generatePassword();
            if (!password) return;

            passwordResult.textContent = password;
            singleResult.style.display = 'block';
            batchResult.style.display = 'none';
            copyAllBtn.style.display = 'none';

            // 강도 계산
            const strength = calculateStrength(password);
            document.getElementById('strengthText').textContent = strength.strength;
            document.getElementById('strengthFill').className = 'strength-fill ' + strength.className;
            document.getElementById('strengthFill').style.width = strength.score + '%';
            document.getElementById('strengthDetails').innerHTML = '• ' + strength.details.join('<br>• ');

          } else {
            const passwords = [];
            for (let i = 0; i < count; i++) {
              const password = generatePassword();
              if (password) passwords.push(password);
            }

            if (passwords.length === 0) return;

            let html = '';
            passwords.forEach((password, index) => {
              html += '<div class="batch-password-item" onclick="copyPassword(this)" title="Click to copy">' +
                     (index + 1) + '. ' + password + '</div>';
            });

            batchPasswords.innerHTML = html;
            singleResult.style.display = 'none';
            batchResult.style.display = 'block';
            copyAllBtn.style.display = 'inline-block';
          }

          showStatus('Password(s) generated successfully');
        }

        function copyPassword(element) {
          const password = element.textContent.substring(3); // "1. " 제거
          copyText(password);
        }

        function copyToClipboard(elementId) {
          const text = document.getElementById(elementId).textContent;
          copyText(text);
        }

        function copyAll() {
          const passwords = [];
          document.querySelectorAll('.batch-password-item').forEach(item => {
            passwords.push(item.textContent.substring(3));
          });
          copyText(passwords.join('\\n'));
        }

        function copyText(text) {
          navigator.clipboard.writeText(text).then(() => {
            showStatus('Copied to clipboard');
          }).catch(() => {
            // Fallback
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            showStatus('Copied to clipboard');
          });
        }

        function showStatus(message, type = 'success') {
          status.textContent = message;
          status.className = 'status';
          if (type === 'error') {
            status.style.background = '#ffebee';
            status.style.borderColor = '#f44336';
            status.style.color = '#c62828';
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

        // 초기 패스워드 생성
        generatePasswords();
      </script>
    </body>
    </html>
  `;

  return new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  });
}
