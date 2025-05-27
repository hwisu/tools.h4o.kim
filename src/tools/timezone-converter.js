import { commonStyles } from '../common/styles.js';

export function handleTimezoneConverter() {
  const html = `
    <!DOCTYPE html>
    <html lang="ko">
    <head>
      <title>Timezone Converter</title>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style>
        ${commonStyles}
        .timezone-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          margin: 2rem 0;
        }
        @media (max-width: 700px) {
          .timezone-grid {
            grid-template-columns: 1fr;
          }
        }
        .timezone-result {
          background: #f9f9f9;
          padding: 1rem;
          border: 1px solid #ddd;
          margin: 1rem 0;
        }
        .world-clocks {
          margin-top: 2rem;
          border-top: 1px solid #eee;
          padding-top: 2rem;
        }
        .clock-item {
          display: flex;
          justify-content: space-between;
          padding: 0.5rem 0;
          border-bottom: 1px solid #f0f0f0;
        }
        .clock-timezone {
          font-weight: bold;
        }
        .clock-time {
          font-family: 'Monaco', 'Menlo', monospace;
        }
        select {
          width: 100%;
          padding: 0.5rem;
          font-family: inherit;
          border: 1px solid #ccc;
          border-radius: 3px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <a href="/" class="back-link">← Back</a>
        <h1>Timezone Converter</h1>
        <p>Convert time between different timezones</p>
      </div>

      <div class="tool-container">
        <div class="timezone-grid">
          <div>
            <h3>From</h3>
            <div class="input-group">
              <label for="fromTime">Date & Time</label>
              <input type="datetime-local" id="fromTime">
            </div>
            <div class="input-group">
              <label for="fromTimezone">Timezone</label>
              <select id="fromTimezone">
                <option value="UTC">UTC</option>
                <option value="America/New_York">New York (EST/EDT)</option>
                <option value="America/Los_Angeles">Los Angeles (PST/PDT)</option>
                <option value="America/Chicago">Chicago (CST/CDT)</option>
                <option value="Europe/London">London (GMT/BST)</option>
                <option value="Europe/Paris">Paris (CET/CEST)</option>
                <option value="Europe/Berlin">Berlin (CET/CEST)</option>
                <option value="Asia/Tokyo">Tokyo (JST)</option>
                <option value="Asia/Seoul" selected>Seoul (KST)</option>
                <option value="Asia/Shanghai">Shanghai (CST)</option>
                <option value="Asia/Dubai">Dubai (GST)</option>
                <option value="Australia/Sydney">Sydney (AEDT/AEST)</option>
                <option value="Pacific/Auckland">Auckland (NZDT/NZST)</option>
              </select>
            </div>
          </div>

          <div>
            <h3>To</h3>
            <div class="input-group">
              <label for="toTimezone">Timezone</label>
              <select id="toTimezone">
                <option value="UTC" selected>UTC</option>
                <option value="America/New_York">New York (EST/EDT)</option>
                <option value="America/Los_Angeles">Los Angeles (PST/PDT)</option>
                <option value="America/Chicago">Chicago (CST/CDT)</option>
                <option value="Europe/London">London (GMT/BST)</option>
                <option value="Europe/Paris">Paris (CET/CEST)</option>
                <option value="Europe/Berlin">Berlin (CET/CEST)</option>
                <option value="Asia/Tokyo">Tokyo (JST)</option>
                <option value="Asia/Seoul">Seoul (KST)</option>
                <option value="Asia/Shanghai">Shanghai (CST)</option>
                <option value="Asia/Dubai">Dubai (GST)</option>
                <option value="Australia/Sydney">Sydney (AEDT/AEST)</option>
                <option value="Pacific/Auckland">Auckland (NZDT/NZST)</option>
              </select>
            </div>
            <div class="timezone-result" id="result">
              <div>Converted time will appear here</div>
            </div>
          </div>
        </div>

        <button onclick="convert()">Convert</button>
        <button onclick="setCurrentTime()">Use Current Time</button>

        <div class="world-clocks">
          <h3>World Clocks</h3>
          <div id="worldClocks"></div>
        </div>
      </div>

      <script>
        const fromTime = document.getElementById('fromTime');
        const fromTimezone = document.getElementById('fromTimezone');
        const toTimezone = document.getElementById('toTimezone');
        const result = document.getElementById('result');
        const worldClocks = document.getElementById('worldClocks');

        // 현재 시간으로 초기화
        function setCurrentTime() {
          const now = new Date();
          now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
          fromTime.value = now.toISOString().slice(0, 16);
          convert();
        }

        function convert() {
          if (!fromTime.value) {
            result.innerHTML = '<div class="error">Please select a date and time</div>';
            return;
          }

          try {
            const inputDate = new Date(fromTime.value);

            // 입력된 시간을 선택된 타임존의 시간으로 해석
            const formatter = new Intl.DateTimeFormat('en-CA', {
              timeZone: fromTimezone.value,
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: false
            });

            // 대상 타임존으로 변환
            const targetFormatter = new Intl.DateTimeFormat('sv-SE', {
              timeZone: toTimezone.value,
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: false
            });

            const convertedTime = targetFormatter.format(inputDate);

            // 12시간 형식도 표시
            const displayFormatter = new Intl.DateTimeFormat('en-US', {
              timeZone: toTimezone.value,
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: true
            });

            const displayTime = displayFormatter.format(inputDate);

            result.innerHTML =
              '<div><strong>24-hour:</strong> ' + convertedTime + '</div>' +
              '<div><strong>12-hour:</strong> ' + displayTime + '</div>';

          } catch (e) {
            result.innerHTML = '<div class="error">Conversion error: ' + e.message + '</div>';
          }
        }

        function updateWorldClocks() {
          const timezones = [
            'UTC',
            'America/New_York',
            'America/Los_Angeles',
            'Europe/London',
            'Asia/Tokyo',
            'Asia/Seoul',
            'Australia/Sydney'
          ];

          const now = new Date();
          let html = '';

          timezones.forEach(tz => {
            const formatter = new Intl.DateTimeFormat('en-US', {
              timeZone: tz,
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: false
            });

            const timeString = formatter.format(now);
            const cityName = tz.split('/')[1] || tz;

            html += '<div class="clock-item">' +
                   '<span class="clock-timezone">' + cityName.replace('_', ' ') + '</span>' +
                   '<span class="clock-time">' + timeString + '</span>' +
                   '</div>';
          });

          worldClocks.innerHTML = html;
        }

        // 이벤트 리스너
        fromTime.addEventListener('change', convert);
        fromTimezone.addEventListener('change', convert);
        toTimezone.addEventListener('change', convert);

        // 초기화
        setCurrentTime();
        updateWorldClocks();
        setInterval(updateWorldClocks, 1000);
      </script>
    </body>
    </html>
  `;

  return new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  });
}
