const input = document.getElementById('input');
const output = document.getElementById('output');
const languageSelect = document.getElementById('language');
const keywordCaseSelect = document.getElementById('keywordCase');
const indentSizeInput = document.getElementById('indentSize');
const indentSizeValue = document.getElementById('indentSizeValue');
const linesBetweenQueriesInput = document.getElementById('linesBetweenQueries');
const linesBetweenQueriesValue = document.getElementById('linesBetweenQueriesValue');
let sqlFormatter = null;

// Load SQL Formatter library
async function loadSQLFormatter() {
  try {
    // Try multiple CDN sources for better reliability
    const cdnSources = [
      'https://cdn.jsdelivr.net/npm/sql-formatter@15.6.2/dist/sql-formatter.min.js',
      'https://unpkg.com/sql-formatter@15.6.2/dist/sql-formatter.min.js'
    ];

    for (const cdnUrl of cdnSources) {
      try {
        await loadScriptFromCDN(cdnUrl);
        if (window.sqlFormatter) {
          sqlFormatter = window.sqlFormatter;
          break;
        }
      } catch (error) {
        console.warn(`Failed to load SQL formatter from ${cdnUrl}:`, error);
        continue;
      }
    }

    if (!sqlFormatter) {
      throw new Error('All CDN sources failed');
    }

    // Auto-format if there's content
    if (input.value.trim()) {
      format();
    }
  } catch (error) {
    console.error('Failed to load SQL formatter:', error);
    sqlFormatter = createBasicFormatter();
  }
}

// Load script from CDN using script tag
function loadScriptFromCDN(url) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = url;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

// Basic fallback formatter
function createBasicFormatter() {
  return {
    format: function(sql, options = {}) {
      // Very basic SQL formatting
      return sql
        .replace(/\s+/g, ' ')
        .replace(/\s*,\s*/g, ',\n  ')
        .replace(/\s*(SELECT|FROM|WHERE|JOIN|ORDER BY|GROUP BY|HAVING)\s+/gi, '\n$1\n  ')
        .replace(/^\s+|\s+$/g, '')
        .trim();
    }
  };
}

// Initialize
loadSQLFormatter();

// Update slider values
indentSizeInput.addEventListener('input', function() {
  indentSizeValue.textContent = this.value;
  if (input.value.trim()) format();
});

linesBetweenQueriesInput.addEventListener('input', function() {
  linesBetweenQueriesValue.textContent = this.value;
  if (input.value.trim()) format();
});

// Auto-format on language or case change
[languageSelect, keywordCaseSelect].forEach(element => {
  element.addEventListener('change', function() {
    if (input.value.trim()) format();
  });
});

function format() {
  if (!input.value.trim()) {
    output.value = '';
    return;
  }

  if (!sqlFormatter) {
    output.value = 'SQL formatter not loaded. Please wait or refresh the page.';
    return;
  }

  try {
    const options = {
      language: languageSelect.value,
      keywordCase: keywordCaseSelect.value,
      tabWidth: parseInt(indentSizeInput.value),
      linesBetweenQueries: parseInt(linesBetweenQueriesInput.value)
    };

    const formatted = sqlFormatter.format(input.value, options);
    output.value = formatted;
  } catch (error) {
    output.value = `Error formatting SQL: ${error.message}`;
    console.error('SQL formatting error:', error);
  }
}

function minify() {
  if (!input.value.trim()) {
    output.value = '';
    return;
  }

  try {
    // Simple minification - remove extra whitespace and line breaks
    const minified = input.value
      .replace(/\s+/g, ' ')
      .replace(/\s*([(),;])\s*/g, '$1')
      .trim();

    output.value = minified;
  } catch (error) {
    output.value = `Error minifying SQL: ${error.message}`;
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
}

// Real-time formatting (debounced)
let timeout;
input.addEventListener('input', function() {
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    if (this.value.trim() && sqlFormatter) {
      format();
    } else {
      output.value = '';
    }
  }, 500);
});

// Make functions global for onclick handlers
window.format = format;
window.minify = minify;
window.swap = swap;
window.clear = clear;
