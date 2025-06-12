const input = document.getElementById('input');
const output = document.getElementById('output');
let sqlFormatter = null;

// Load SQL Formatter library
async function loadSQLFormatter() {
  try {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/sql-formatter@15.6.2/dist/sql-formatter.min.js';
    script.onload = () => {
      sqlFormatter = window.sqlFormatter;
      if (input.value.trim()) {
        format();
      }
    };
    script.onerror = () => {
      sqlFormatter = createBasicFormatter();
    };
    document.head.appendChild(script);
  } catch (error) {
    console.error('Failed to load SQL formatter:', error);
    sqlFormatter = createBasicFormatter();
  }
}

// Basic fallback formatter
function createBasicFormatter() {
  return {
    format: function(sql) {
      return sql
        .replace(/\s+/g, ' ')
        .replace(/\s*,\s*/g, ',\n  ')
        .replace(/\s*(SELECT|FROM|WHERE|JOIN|ORDER BY|GROUP BY|HAVING|INSERT|UPDATE|DELETE)\s+/gi, '\n$1\n  ')
        .replace(/^\s+|\s+$/g, '')
        .trim();
    }
  };
}

// Initialize
loadSQLFormatter();

// Real-time formatting
input.addEventListener('input', function() {
  if (this.value.trim() && sqlFormatter) {
    format();
  } else {
    output.value = '';
  }
});

function format() {
  if (!input.value.trim()) {
    output.value = '';
    return;
  }

  if (!sqlFormatter) {
    output.value = 'Loading SQL formatter...';
    return;
  }

  try {
    const formatted = sqlFormatter.format(input.value, {
      language: 'sql',
      keywordCase: 'upper',
      tabWidth: 2,
      linesBetweenQueries: 1
    });
    output.value = formatted;
  } catch (error) {
    output.value = `❌ SQL Format Error!\n\nError: ${error.message}`;
  }
}

function minify() {
  if (!input.value.trim()) {
    output.value = '';
    return;
  }

  try {
    const minified = input.value
      .replace(/\s+/g, ' ')
      .replace(/\s*([(),;])\s*/g, '$1')
      .trim();
    output.value = minified;
  } catch (error) {
    output.value = `❌ SQL Minify Error!\n\nError: ${error.message}`;
  }
}

function swap() {
  const temp = input.value;
  input.value = output.value;
  output.value = temp;
}

function clear() {
  input.value = '';
  output.value = '';
  input.focus();
}

// Make functions global for onclick handlers
window.format = format;
window.minify = minify;
window.swap = swap;
window.clear = clear;
