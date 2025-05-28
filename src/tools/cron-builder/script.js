const cronExpression = document.getElementById('cronExpression');
const cronDescription = document.getElementById('cronDescription');
const nextRuns = document.getElementById('nextRuns');

// Field elements
const fields = {
  minute: {
    type: document.getElementById('minuteType'),
    value: document.getElementById('minuteValue'),
    interval: document.getElementById('minuteInterval'),
    range: document.getElementById('minuteRange')
  },
  hour: {
    type: document.getElementById('hourType'),
    value: document.getElementById('hourValue'),
    interval: document.getElementById('hourInterval'),
    range: document.getElementById('hourRange')
  },
  day: {
    type: document.getElementById('dayType'),
    value: document.getElementById('dayValue'),
    interval: document.getElementById('dayInterval'),
    range: document.getElementById('dayRange')
  },
  month: {
    type: document.getElementById('monthType'),
    value: document.getElementById('monthValue'),
    range: document.getElementById('monthRange')
  },
  weekday: {
    type: document.getElementById('weekdayType'),
    value: document.getElementById('weekdayValue'),
    range: document.getElementById('weekdayRange')
  }
};

// Initialize
function init() {
  setupEventListeners();
  updateCronExpression();
}

function setupEventListeners() {
  // Add change listeners to all field types
  Object.keys(fields).forEach(fieldName => {
    const field = fields[fieldName];

    field.type.addEventListener('change', () => {
      showHideInputs(fieldName);
      updateCronExpression();
    });

    // Add listeners to value inputs
    if (field.value) {
      field.value.addEventListener('input', updateCronExpression);
      field.value.addEventListener('change', updateCronExpression);
    }
    if (field.interval) {
      field.interval.addEventListener('input', updateCronExpression);
    }
    if (field.range) {
      field.range.addEventListener('input', updateCronExpression);
    }
  });
}

function showHideInputs(fieldName) {
  const field = fields[fieldName];
  const type = field.type.value;

  // Hide all inputs first
  if (field.value) field.value.style.display = 'none';
  if (field.interval) field.interval.style.display = 'none';
  if (field.range) field.range.style.display = 'none';

  // Show relevant input based on type
  switch (type) {
    case 'specific':
      if (field.value) field.value.style.display = 'block';
      break;
    case 'interval':
      if (field.interval) field.interval.style.display = 'block';
      break;
    case 'range':
      if (field.range) field.range.style.display = 'block';
      break;
  }
}

function updateCronExpression() {
  const parts = [];

  // Build each part of the cron expression
  parts.push(buildCronPart('minute'));
  parts.push(buildCronPart('hour'));
  parts.push(buildCronPart('day'));
  parts.push(buildCronPart('month'));
  parts.push(buildCronPart('weekday'));

  const expression = parts.join(' ');
  cronExpression.textContent = expression;

  updateDescription(expression);
  updateNextRuns(expression);
}

function buildCronPart(fieldName) {
  const field = fields[fieldName];
  const type = field.type.value;

  switch (type) {
    case '*':
      return '*';
    case 'specific':
      const value = field.value ? field.value.value : '';
      return value || '*';
    case 'interval':
      const interval = field.interval ? field.interval.value : '';
      return interval ? `*/${interval}` : '*';
    case 'range':
      const range = field.range ? field.range.value : '';
      return range || '*';
    default:
      return '*';
  }
}

function updateDescription(expression) {
  const description = describeCronExpression(expression);
  cronDescription.textContent = description;
}

function describeCronExpression(expression) {
  const parts = expression.split(' ');
  if (parts.length !== 5) return 'Invalid cron expression';

  const [minute, hour, day, month, weekday] = parts;

  let description = 'Runs ';

  // Frequency description
  if (minute === '*' && hour === '*' && day === '*' && month === '*' && weekday === '*') {
    return 'Runs every minute';
  }

  // Time description
  if (minute !== '*' || hour !== '*') {
    if (hour === '*') {
      if (minute.includes('/')) {
        const interval = minute.split('/')[1];
        description += `every ${interval} minutes`;
      } else if (minute.includes('-')) {
        description += `every minute from ${minute}`;
      } else {
        description += `at minute ${minute} of every hour`;
      }
    } else {
      const hourDesc = hour === '*' ? 'every hour' :
                     hour.includes('/') ? `every ${hour.split('/')[1]} hours` :
                     hour.includes('-') ? `between hours ${hour}` :
                     `at ${hour}:${minute === '*' ? '00' : minute.padStart(2, '0')}`;

      if (minute === '*') {
        description += `every minute of ${hourDesc}`;
      } else {
        description += hourDesc;
      }
    }
  }

  // Day/weekday description
  if (day !== '*' || weekday !== '*') {
    if (weekday !== '*') {
      const weekdayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      if (weekday.includes('-')) {
        const [start, end] = weekday.split('-');
        description += ` on ${weekdayNames[start]} through ${weekdayNames[end]}`;
      } else {
        description += ` on ${weekdayNames[weekday] || 'weekday ' + weekday}`;
      }
    } else if (day !== '*') {
      if (day.includes('/')) {
        description += ` every ${day.split('/')[1]} days`;
      } else if (day.includes('-')) {
        description += ` on days ${day} of the month`;
      } else {
        description += ` on day ${day} of the month`;
      }
    }
  }

  // Month description
  if (month !== '*') {
    const monthNames = ['', 'January', 'February', 'March', 'April', 'May', 'June',
                       'July', 'August', 'September', 'October', 'November', 'December'];
    if (month.includes('-')) {
      const [start, end] = month.split('-');
      description += ` in ${monthNames[start]} through ${monthNames[end]}`;
    } else {
      description += ` in ${monthNames[month] || 'month ' + month}`;
    }
  }

  return description;
}

function updateNextRuns(expression) {
  try {
    const nextExecutions = calculateNextRuns(expression, 5);
    let html = '';

    nextExecutions.forEach((date, index) => {
      html += `<div class="next-run-item">${index + 1}. ${date.toLocaleString()}</div>`;
    });

    nextRuns.innerHTML = html;
  } catch (error) {
    nextRuns.innerHTML = '<div class="next-run-item">Unable to calculate next runs</div>';
  }
}

function calculateNextRuns(expression, count) {
  const parts = expression.split(' ');
  if (parts.length !== 5) return [];

  const [minutePart, hourPart, dayPart, monthPart, weekdayPart] = parts;
  const results = [];
  const now = new Date();
  let current = new Date(now.getTime() + 60000); // Start from next minute

  let attempts = 0;
  const maxAttempts = 10000; // Prevent infinite loops

  while (results.length < count && attempts < maxAttempts) {
    attempts++;

    if (matchesCronExpression(current, minutePart, hourPart, dayPart, monthPart, weekdayPart)) {
      results.push(new Date(current));
    }

    // Move to next minute
    current.setMinutes(current.getMinutes() + 1);
  }

  return results;
}

function matchesCronExpression(date, minutePart, hourPart, dayPart, monthPart, weekdayPart) {
  const minute = date.getMinutes();
  const hour = date.getHours();
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const weekday = date.getDay();

  return matchesCronPart(minute, minutePart, 0, 59) &&
         matchesCronPart(hour, hourPart, 0, 23) &&
         matchesCronPart(day, dayPart, 1, 31) &&
         matchesCronPart(month, monthPart, 1, 12) &&
         matchesCronPart(weekday, weekdayPart, 0, 6);
}

function matchesCronPart(value, cronPart, min, max) {
  if (cronPart === '*') return true;

  if (cronPart.includes('/')) {
    const [base, interval] = cronPart.split('/');
    const step = parseInt(interval);
    if (base === '*') {
      return value % step === 0;
    } else {
      const start = parseInt(base);
      return value >= start && (value - start) % step === 0;
    }
  }

  if (cronPart.includes('-')) {
    const [start, end] = cronPart.split('-').map(Number);
    return value >= start && value <= end;
  }

  if (cronPart.includes(',')) {
    const values = cronPart.split(',').map(Number);
    return values.includes(value);
  }

  return value === parseInt(cronPart);
}

function loadPreset(expression) {
  const parts = expression.split(' ');
  if (parts.length !== 5) return;

  const [minute, hour, day, month, weekday] = parts;

  // Reset all fields
  Object.keys(fields).forEach(fieldName => {
    fields[fieldName].type.value = '*';
    showHideInputs(fieldName);
  });

  // Set minute
  setFieldFromCronPart('minute', minute);
  setFieldFromCronPart('hour', hour);
  setFieldFromCronPart('day', day);
  setFieldFromCronPart('month', month);
  setFieldFromCronPart('weekday', weekday);

  updateCronExpression();
}

function setFieldFromCronPart(fieldName, cronPart) {
  const field = fields[fieldName];

  if (cronPart === '*') {
    field.type.value = '*';
  } else if (cronPart.includes('/')) {
    field.type.value = 'interval';
    const interval = cronPart.split('/')[1];
    if (field.interval) field.interval.value = interval;
  } else if (cronPart.includes('-')) {
    field.type.value = 'range';
    if (field.range) field.range.value = cronPart;
  } else {
    field.type.value = 'specific';
    if (field.value) field.value.value = cronPart;
  }

  showHideInputs(fieldName);
}

function copyExpression() {
  const expression = cronExpression.textContent;
  navigator.clipboard.writeText(expression).then(() => {
    // Visual feedback
    const originalText = cronExpression.textContent;
    cronExpression.textContent = 'Copied!';
    setTimeout(() => {
      cronExpression.textContent = originalText;
    }, 1000);
  }).catch(err => {
    console.error('Failed to copy: ', err);
  });
}

function clear() {
  // Reset all fields to default
  Object.keys(fields).forEach(fieldName => {
    fields[fieldName].type.value = '*';
    if (fields[fieldName].value) fields[fieldName].value.value = '';
    if (fields[fieldName].interval) fields[fieldName].interval.value = '';
    if (fields[fieldName].range) fields[fieldName].range.value = '';
    showHideInputs(fieldName);
  });

  updateCronExpression();
}

// Make functions global for onclick handlers
window.loadPreset = loadPreset;
window.copyExpression = copyExpression;
window.clear = clear;

// Initialize when page loads
init();
