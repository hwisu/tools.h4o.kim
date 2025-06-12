const fromTime = document.getElementById('fromTime');
const fromSeconds = document.getElementById('fromSeconds');
const fromMilliseconds = document.getElementById('fromMilliseconds');
const fromTimezone = document.getElementById('fromTimezone');
const toTimezone = document.getElementById('toTimezone');
const timezoneResult = document.getElementById('timezoneResult');
const timestampInput = document.getElementById('timestampInput');
const timestampResult = document.getElementById('timestampResult');
const dateInput = document.getElementById('dateInput');
const dateSeconds = document.getElementById('dateSeconds');
const dateMilliseconds = document.getElementById('dateMilliseconds');
const dateResult = document.getElementById('dateResult');
const copyList = document.getElementById('copyList');
const copyListBody = document.getElementById('copyListBody');

// Tab switching
function switchTab(tabName) {
  // Hide all tabs
  document.querySelectorAll('.tab-content').forEach(tab => {
    tab.classList.remove('active');
  });
  document.querySelectorAll('.tab-button').forEach(btn => {
    btn.classList.remove('active');
  });

  // Show selected tab
  document.getElementById(tabName + '-tab').classList.add('active');
  event.target.classList.add('active');

  // Hide copy list when switching tabs
  copyList.style.display = 'none';
}

// Enhanced time parsing with seconds and milliseconds
function parseTimeWithPrecision(datetimeValue, seconds = 0, milliseconds = 0) {
  if (!datetimeValue) return null;

  const date = new Date(datetimeValue);
  if (seconds) date.setSeconds(parseInt(seconds) || 0);
  if (milliseconds) date.setMilliseconds(parseInt(milliseconds) || 0);

  return date;
}

// Set current time with full precision
function setCurrentTime() {
  const now = new Date();

  // Set datetime-local input (without seconds)
  const localDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);
  fromTime.value = localDateTime;

  // Set seconds and milliseconds
  fromSeconds.value = now.getSeconds();
  fromMilliseconds.value = now.getMilliseconds();

  convertTimezone();
}

// Timezone conversion
function convertTimezone() {
  if (!fromTime.value) {
    timezoneResult.innerHTML = '<div style="color: #dc3545; text-align: center; padding: 2rem;">Please select a date and time</div>';
    return;
  }

  try {
    const inputDate = parseTimeWithPrecision(fromTime.value, fromSeconds.value, fromMilliseconds.value);
    if (!inputDate) throw new Error('Invalid date');

    // Convert to target timezone
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
    const milliseconds = inputDate.getMilliseconds().toString().padStart(3, '0');

    // 12-hour format
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

    // Get timezone name
    const timezoneName = toTimezone.options[toTimezone.selectedIndex].text;

    timezoneResult.innerHTML = `
      <div class="result-item">
        <span class="result-label">24-hour:</span>
        <span class="result-value">${convertedTime}.${milliseconds}</span>
        <button class="copy-btn" onclick="copyToClipboard('${convertedTime}.${milliseconds}', this)">Copy</button>
      </div>
      <div class="result-item">
        <span class="result-label">12-hour:</span>
        <span class="result-value">${displayTime}</span>
        <button class="copy-btn" onclick="copyToClipboard('${displayTime}', this)">Copy</button>
      </div>
      <div class="result-item">
        <span class="result-label">Timezone:</span>
        <span class="result-value">${timezoneName}</span>
      </div>
    `;

    // Show all formats
    showAllFormats(inputDate, toTimezone.value);

  } catch (e) {
    timezoneResult.innerHTML = '<div style="color: #dc3545; text-align: center; padding: 2rem;">Conversion error: ' + e.message + '</div>';
  }
}

// Timestamp to date conversion
function timestampToDate() {
  const timestamp = timestampInput.value.trim();

  if (!timestamp) {
    alert('Please enter a timestamp');
    return;
  }

  try {
    let ts = parseInt(timestamp);
    if (ts.toString().length === 10) {
      ts = ts * 1000; // Convert seconds to milliseconds
    }

    const date = new Date(ts);
    if (isNaN(date.getTime())) {
      throw new Error('Invalid timestamp');
    }

    timestampResult.innerHTML = `
      <div class="result-item">
        <span class="result-label">Local:</span>
        <span class="result-value">${date.toLocaleString()}</span>
        <button class="copy-btn" onclick="copyToClipboard('${date.toLocaleString()}', this)">Copy</button>
      </div>
      <div class="result-item">
        <span class="result-label">UTC:</span>
        <span class="result-value">${date.toUTCString()}</span>
        <button class="copy-btn" onclick="copyToClipboard('${date.toUTCString()}', this)">Copy</button>
      </div>
      <div class="result-item">
        <span class="result-label">ISO:</span>
        <span class="result-value">${date.toISOString()}</span>
        <button class="copy-btn" onclick="copyToClipboard('${date.toISOString()}', this)">Copy</button>
      </div>
    `;
    timestampResult.style.display = 'block';

    showAllFormats(date);

  } catch (error) {
    alert('Invalid timestamp: ' + error.message);
  }
}

// Date to timestamp conversion
function dateToTimestamp() {
  if (!dateInput.value) {
    alert('Please select a date and time');
    return;
  }

  try {
    const date = parseTimeWithPrecision(dateInput.value, dateSeconds.value, dateMilliseconds.value);
    if (!date) throw new Error('Invalid date');

    const timestampSeconds = Math.floor(date.getTime() / 1000);
    const timestampMilliseconds = date.getTime();

    dateResult.innerHTML = `
      <div class="result-item">
        <span class="result-label">Seconds:</span>
        <span class="result-value">${timestampSeconds}</span>
        <button class="copy-btn" onclick="copyToClipboard('${timestampSeconds}', this)">Copy</button>
      </div>
      <div class="result-item">
        <span class="result-label">Milliseconds:</span>
        <span class="result-value">${timestampMilliseconds}</span>
        <button class="copy-btn" onclick="copyToClipboard('${timestampMilliseconds}', this)">Copy</button>
      </div>
      <div class="result-item">
        <span class="result-label">ISO:</span>
        <span class="result-value">${date.toISOString()}</span>
        <button class="copy-btn" onclick="copyToClipboard('${date.toISOString()}', this)">Copy</button>
      </div>
    `;
    dateResult.style.display = 'block';

    showAllFormats(date);

  } catch (error) {
    alert('Invalid date: ' + error.message);
  }
}

// Use current timestamp
function useCurrentTimestamp() {
  const now = Math.floor(Date.now() / 1000);
  timestampInput.value = now;
  timestampToDate();
}

// Use current date
function useCurrentDate() {
  const now = new Date();
  const localDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);
  dateInput.value = localDateTime;
  dateSeconds.value = now.getSeconds();
  dateMilliseconds.value = now.getMilliseconds();
  dateToTimestamp();
}

// Show all formats in copy list
function showAllFormats(date, timezone = null) {
  const formats = generateAllFormats(date, timezone);

  let html = '';
  formats.forEach(format => {
    const escapedValue = format.value.toString().replace(/'/g, "\\'");
    html += `
      <tr>
        <td>${format.name}</td>
        <td>${format.value}</td>
        <td><button class="copy-btn" onclick="copyToClipboard('${escapedValue}', this)">Copy</button></td>
      </tr>
    `;
  });

  copyListBody.innerHTML = html;
  copyList.style.display = 'block';
}

// Generate essential formats only
function generateAllFormats(date, timezone = null) {
  const formats = [
    { name: 'Unix Timestamp (seconds)', value: Math.floor(date.getTime() / 1000) },
    { name: 'Unix Timestamp (milliseconds)', value: date.getTime() },
    { name: 'ISO 8601 UTC', value: date.toISOString() },
    { name: 'UTC String', value: date.toUTCString() },
    { name: 'Local String', value: date.toLocaleString() },
    { name: 'Date Only (YYYY-MM-DD)', value: date.toISOString().split('T')[0] },
    { name: 'Time Only (HH:MM:SS)', value: date.toTimeString().split(' ')[0] }
  ];

  // Add timezone-specific formats if timezone is provided
  if (timezone) {
    const tzFormatter = new Intl.DateTimeFormat('sv-SE', {
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });

    const tzTime = tzFormatter.format(date);
    const milliseconds = date.getMilliseconds().toString().padStart(3, '0');

    formats.unshift(
      { name: `${timezone} Time`, value: `${tzTime}.${milliseconds}` },
      { name: `${timezone} Date`, value: tzTime.split(' ')[0] },
      { name: `${timezone} Time Only`, value: tzTime.split(' ')[1] + `.${milliseconds}` }
    );

    // Generate ISO 8601 with timezone offset
    const offsetString = getTimezoneOffset(date, timezone);
    const isoWithTz = `${tzTime.replace(' ', 'T')}${offsetString}`;
    formats.unshift({ name: 'ISO 8601 with Timezone', value: isoWithTz });
  }

  return formats;
}

// Get timezone offset string
function getTimezoneOffset(date, timezone) {
  const utcDate = new Date(date.toLocaleString("sv-SE", { timeZone: "UTC" }));
  const tzDate = new Date(date.toLocaleString("sv-SE", { timeZone: timezone }));
  const offset = (tzDate.getTime() - utcDate.getTime()) / (1000 * 60); // offset in minutes

  const offsetHours = Math.floor(Math.abs(offset) / 60);
  const offsetMinutes = Math.abs(offset) % 60;
  const offsetSign = offset >= 0 ? '+' : '-';

  return offsetSign + offsetHours.toString().padStart(2, '0') + ':' + offsetMinutes.toString().padStart(2, '0');
}

// Copy to clipboard
function copyToClipboard(text, button) {
  navigator.clipboard.writeText(text.toString()).then(() => {
    const originalText = button.textContent;
    button.textContent = 'Copied!';
    button.classList.add('copy-success');

    setTimeout(() => {
      button.textContent = originalText;
      button.classList.remove('copy-success');
    }, 2000);
  }).catch(err => {
    console.error('Failed to copy: ', err);
    alert('Failed to copy to clipboard');
  });
}

// Legacy function names for compatibility
function convert() {
  convertTimezone();
}

// Functions for the current time display interface
function updateTimes() {
  const timezone1 = document.getElementById('timezone1');
  const timezone2 = document.getElementById('timezone2');

  if (!timezone1 || !timezone2) return;

  const now = new Date();

  const formatter1 = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone1.value,
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });

  const formatter2 = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone2.value,
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });

  const time1 = formatter1.format(now);
  const time2 = formatter2.format(now);

  const timezone1Name = timezone1.options[timezone1.selectedIndex].text;
  const timezone2Name = timezone2.options[timezone2.selectedIndex].text;

  const resultDiv = document.getElementById('timeResults');
  if (resultDiv) {
    resultDiv.innerHTML = `
      <div class="result-item">
        <span class="result-label">${timezone1Name}:</span>
        <span class="result-value">${time1}</span>
      </div>
      <div class="result-item">
        <span class="result-label">${timezone2Name}:</span>
        <span class="result-value">${time2}</span>
      </div>
      <div class="result-item">
        <span class="result-label">Updated:</span>
        <span class="result-value">${new Date().toLocaleString()}</span>
      </div>
    `;
  }
}

function convertSpecificTime() {
  const specificTime = document.getElementById('specificTime');
  if (!specificTime || !specificTime.value) {
    alert('Please select a date and time');
    return;
  }

  const inputDate = new Date(specificTime.value);
  const timezones = ['Asia/Seoul', 'America/New_York', 'Europe/London', 'Asia/Tokyo', 'America/Los_Angeles', 'UTC'];

  let resultsHTML = '';
  timezones.forEach(tz => {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: tz,
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });

    const formattedTime = formatter.format(inputDate);
    resultsHTML += `
      <div class="result-item">
        <span class="result-label">${tz}:</span>
        <span class="result-value">${formattedTime}</span>
      </div>
    `;
  });

  const resultDiv = document.getElementById('conversionResults');
  if (resultDiv) {
    resultDiv.innerHTML = resultsHTML;
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
  setCurrentTime();

  // Initialize current time display
  updateTimes();

  // Auto-convert on input change
  if (fromTime) fromTime.addEventListener('change', convertTimezone);
  if (fromSeconds) fromSeconds.addEventListener('input', convertTimezone);
  if (fromMilliseconds) fromMilliseconds.addEventListener('input', convertTimezone);
  if (fromTimezone) fromTimezone.addEventListener('change', convertTimezone);
  if (toTimezone) toTimezone.addEventListener('change', convertTimezone);
});
