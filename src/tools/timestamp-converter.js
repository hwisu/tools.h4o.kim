import { commonStyles } from '../common/styles.js';

export function handleTimestampConverter() {
  const html = `
    <!DOCTYPE html>
    <html lang="ko">
    <head>
      <title>Timestamp Converter</title>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style>
        ${commonStyles}
        .timestamp-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          margin: 2rem 0;
        }
        @media (max-width: 600px) {
          .timestamp-grid {
            grid-template-columns: 1fr;
          }
        }
        .section {
          padding: 1rem 0;
          border-top: 1px solid #eee;
        }
        .current-time {
          background: #f9f9f9;
          padding: 1rem;
          border: 1px solid #ddd;
          margin: 1rem 0;
        }
        .time-display {
          font-family: 'Monaco', 'Menlo', monospace;
          font-size: 1.1rem;
          font-weight: bold;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <a href="/" class="back-link">← Back</a>
        <h1>Timestamp Converter</h1>
        <p>Convert between Unix timestamps and human-readable dates</p>
      </div>

      <div class="tool-container">
        <div class="current-time">
          <strong>Current Time:</strong><br>
          <div class="time-display" id="currentTime"></div>
          <div class="time-display" id="currentTimestamp"></div>
        </div>

        <div class="timestamp-grid">
          <div class="section">
            <h3>Timestamp to Date</h3>
            <div class="input-group">
              <label for="timestampInput">Unix Timestamp</label>
              <input type="text" id="timestampInput" placeholder="1703980800" autofocus>
            </div>
            <button onclick="convertToDate()">Convert to Date</button>
            <div id="dateResult" class="result" style="display:none;"></div>
          </div>

          <div class="section">
            <h3>Date to Timestamp</h3>
            <div class="input-group">
              <label for="dateInput">Date/Time</label>
              <input type="datetime-local" id="dateInput">
            </div>
            <button onclick="convertToTimestamp()">Convert to Timestamp</button>
            <div id="timestampResult" class="result" style="display:none;"></div>
          </div>
        </div>

        <div class="section">
          <h3>Batch Conversion</h3>
          <div class="input-group">
            <label for="batchInput">Multiple Timestamps (one per line)</label>
            <textarea id="batchInput" placeholder="1703980800&#10;1704067200&#10;1704153600" rows="4"></textarea>
          </div>
          <button onclick="batchConvert()">Batch Convert</button>
          <div id="batchResult" class="result" style="display:none;"></div>
        </div>
      </div>

      <script>
        const timestampInput = document.getElementById('timestampInput');
        const dateInput = document.getElementById('dateInput');
        const batchInput = document.getElementById('batchInput');
        const dateResult = document.getElementById('dateResult');
        const timestampResult = document.getElementById('timestampResult');
        const batchResult = document.getElementById('batchResult');
        const currentTime = document.getElementById('currentTime');
        const currentTimestamp = document.getElementById('currentTimestamp');

        function updateCurrentTime() {
          const now = new Date();
          currentTime.textContent = now.toLocaleString();
          currentTimestamp.textContent = Math.floor(now.getTime() / 1000);
        }

        function convertToDate() {
          const timestamp = timestampInput.value.trim();
          if (!timestamp) {
            showError(dateResult, 'Please enter a timestamp');
            return;
          }

          try {
            let ts = parseInt(timestamp);

            // 자동으로 밀리초/초 감지
            if (ts.toString().length === 10) {
              ts *= 1000; // 초를 밀리초로 변환
            } else if (ts.toString().length !== 13) {
              throw new Error('Invalid timestamp format');
            }

            const date = new Date(ts);
            if (isNaN(date.getTime())) {
              throw new Error('Invalid timestamp');
            }

            const result =
              'Local Time: ' + date.toLocaleString() + '\\n' +
              'UTC Time: ' + date.toUTCString() + '\\n' +
              'ISO String: ' + date.toISOString();

            showResult(dateResult, result);
          } catch (e) {
            showError(dateResult, 'Error: ' + e.message);
          }
        }

        function convertToTimestamp() {
          const dateValue = dateInput.value;
          if (!dateValue) {
            showError(timestampResult, 'Please select a date and time');
            return;
          }

          try {
            const date = new Date(dateValue);
            if (isNaN(date.getTime())) {
              throw new Error('Invalid date');
            }

            const timestamp = Math.floor(date.getTime() / 1000);
            const timestampMs = date.getTime();

            const result =
              'Unix Timestamp (seconds): ' + timestamp + '\\n' +
              'Unix Timestamp (milliseconds): ' + timestampMs;

            showResult(timestampResult, result);
          } catch (e) {
            showError(timestampResult, 'Error: ' + e.message);
          }
        }

        function batchConvert() {
          const timestamps = batchInput.value.trim().split('\\n').filter(line => line.trim());
          if (timestamps.length === 0) {
            showError(batchResult, 'Please enter timestamps');
            return;
          }

          try {
            let result = '';
            timestamps.forEach((timestamp, index) => {
              try {
                let ts = parseInt(timestamp.trim());
                if (ts.toString().length === 10) {
                  ts *= 1000;
                }

                const date = new Date(ts);
                if (isNaN(date.getTime())) {
                  throw new Error('Invalid timestamp');
                }

                result += (index + 1) + '. ' + timestamp.trim() + ' → ' + date.toLocaleString() + '\\n';
              } catch (e) {
                result += (index + 1) + '. ' + timestamp.trim() + ' → Error: ' + e.message + '\\n';
              }
            });

            showResult(batchResult, result);
          } catch (e) {
            showError(batchResult, 'Error: ' + e.message);
          }
        }

        function showResult(element, text) {
          element.innerHTML = text.replace(/\\n/g, '<br>');
          element.className = 'result';
          element.style.display = 'block';
        }

        function showError(element, text) {
          element.innerHTML = text;
          element.className = 'result error';
          element.style.display = 'block';
        }

        // 현재 시간을 실시간으로 업데이트
        updateCurrentTime();
        setInterval(updateCurrentTime, 1000);

        // 현재 시간을 dateInput에 설정
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        dateInput.value = now.toISOString().slice(0, 16);
      </script>
    </body>
    </html>
  `;

  return new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  });
}
