const cronExpression = document.getElementById('cronExpression');
const cronDescription = document.getElementById('cronDescription');
const nextRuns = document.getElementById('nextRuns');

// Field elements
const fields = {
  minute: {
    select: document.getElementById('minute'),
    custom: document.getElementById('minuteCustom')
  },
  hour: {
    select: document.getElementById('hour'),
    custom: document.getElementById('hourCustom')
  },
  day: {
    select: document.getElementById('day'),
    custom: document.getElementById('dayCustom')
  },
  month: {
    select: document.getElementById('month'),
    custom: document.getElementById('monthCustom')
  },
  weekday: {
    select: document.getElementById('weekday'),
    custom: document.getElementById('weekdayCustom')
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

    if (field.select) {
      field.select.addEventListener('change', updateCronExpression);
    }
    if (field.custom) {
      field.custom.addEventListener('input', updateCronExpression);
      field.custom.addEventListener('change', updateCronExpression);
    }
  });
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
  if (cronExpression) {
    cronExpression.textContent = expression;
  }

  updateDescription(expression);
  updateNextRuns(expression);
}

function buildCronPart(fieldName) {
  const field = fields[fieldName];
  if (!field || !field.select) return '*';

  const selectValue = field.select.value;
  const customValue = field.custom ? field.custom.value.trim() : '';

  // If custom input has value, use it
  if (customValue) {
    return customValue;
  }

  // Otherwise use select value
  return selectValue || '*';
}

function updateDescription(expression) {
  const description = describeCronExpression(expression);
  if (cronDescription) {
    cronDescription.textContent = description;
  }
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
    const nextTimes = calculateNextRuns(expression, 10);
    if (nextRuns) {
      nextRuns.innerHTML = nextTimes.map(time =>
        `<div class="next-run-item">${time}</div>`
      ).join('');
    }
  } catch (error) {
    if (nextRuns) {
      nextRuns.innerHTML = '<div class="next-run-item">Error calculating next runs</div>';
    }
  }
}

function calculateNextRuns(expression, count) {
  const parts = expression.split(' ');
  if (parts.length !== 5) return [];

  const runs = [];
  const now = new Date();
  let currentTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes() + 1, 0, 0);

  let attempts = 0;
  const maxAttempts = 10000; // Prevent infinite loops

  while (runs.length < count && attempts < maxAttempts) {
    attempts++;

    if (matchesCronExpression(currentTime, ...parts)) {
      runs.push(currentTime.toLocaleString());
    }

    // Increment by 1 minute
    currentTime = new Date(currentTime.getTime() + 60000);
  }

  return runs;
}

function matchesCronExpression(date, minutePart, hourPart, dayPart, monthPart, weekdayPart) {
  const minute = date.getMinutes();
  const hour = date.getHours();
  const day = date.getDate();
  const month = date.getMonth() + 1; // getMonth() is 0-based
  const weekday = date.getDay(); // 0 = Sunday

  return (
    matchesCronPart(minute, minutePart, 0, 59) &&
    matchesCronPart(hour, hourPart, 0, 23) &&
    matchesCronPart(day, dayPart, 1, 31) &&
    matchesCronPart(month, monthPart, 1, 12) &&
    matchesCronPart(weekday, weekdayPart, 0, 6)
  );
}

function matchesCronPart(value, cronPart, min, max) {
  if (cronPart === '*') return true;

  // Handle specific values
  if (!isNaN(parseInt(cronPart))) {
    return value === parseInt(cronPart);
  }

  // Handle ranges (e.g., "1-5")
  if (cronPart.includes('-')) {
    const [start, end] = cronPart.split('-').map(x => parseInt(x));
    return value >= start && value <= end;
  }

  // Handle intervals (e.g., "*/5")
  if (cronPart.includes('/')) {
    const [base, interval] = cronPart.split('/');
    const intervalNum = parseInt(interval);
    if (base === '*') {
      return value % intervalNum === 0;
    }
  }

  // Handle lists (e.g., "1,3,5")
  if (cronPart.includes(',')) {
    const values = cronPart.split(',').map(x => parseInt(x));
    return values.includes(value);
  }

  return false;
}

// Load preset function - this was missing and causing the setPreset error
function loadPreset(expression) {
  const parts = expression.split(' ');
  if (parts.length !== 5) return;

  const [minute, hour, day, month, weekday] = parts;

  setFieldFromCronPart('minute', minute);
  setFieldFromCronPart('hour', hour);
  setFieldFromCronPart('day', day);
  setFieldFromCronPart('month', month);
  setFieldFromCronPart('weekday', weekday);

  updateCronExpression();
}

function setFieldFromCronPart(fieldName, cronPart) {
  const field = fields[fieldName];
  if (!field || !field.select) return;

  // Check if the cronPart matches any of the select options
  const options = Array.from(field.select.options);
  const matchingOption = options.find(option => option.value === cronPart);

  if (matchingOption) {
    field.select.value = cronPart;
    if (field.custom) {
      field.custom.value = '';
    }
  } else {
    // If no matching option, use custom input
    field.select.value = '*';
    if (field.custom) {
      field.custom.value = cronPart;
    }
  }
}

function copyExpression() {
  if (!cronExpression) return;

  const expression = cronExpression.textContent;
  navigator.clipboard.writeText(expression).then(() => {
    // Show temporary feedback
    const originalText = cronExpression.textContent;
    cronExpression.textContent = 'Copied!';
    setTimeout(() => {
      cronExpression.textContent = originalText;
    }, 1000);
  }).catch(() => {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = expression;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
  });
}

function clear() {
  Object.keys(fields).forEach(fieldName => {
    const field = fields[fieldName];
    if (field.select) {
      field.select.value = '*';
    }
    if (field.custom) {
      field.custom.value = '';
    }
  });
  updateCronExpression();
}

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Export for global access
window.updateCronExpression = updateCronExpression;
window.loadPreset = loadPreset;

init();
