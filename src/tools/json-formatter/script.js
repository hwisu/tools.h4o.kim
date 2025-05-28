const input = document.getElementById('input');
const output = document.getElementById('output');
const indentSizeInput = document.getElementById('indentSize');
const indentSizeValue = document.getElementById('indentSizeValue');
const sortKeysCheckbox = document.getElementById('sortKeys');
const trailingCommaCheckbox = document.getElementById('trailingComma');
let prettier = null;
let prettierPlugins = null;

// Load Prettier library
async function loadPrettier() {
  try {
    // Try multiple CDN sources for better reliability
    const cdnSources = [
      {
        prettier: 'https://cdn.jsdelivr.net/npm/prettier@3.1.1/standalone.js',
        parser: 'https://cdn.jsdelivr.net/npm/prettier@3.1.1/plugins/babel.js'
      },
      {
        prettier: 'https://unpkg.com/prettier@3.1.1/standalone.js',
        parser: 'https://unpkg.com/prettier@3.1.1/plugins/babel.js'
      }
    ];

    for (const cdnSet of cdnSources) {
      try {
        await loadScriptFromCDN(cdnSet.prettier);
        await loadScriptFromCDN(cdnSet.parser);

        if (window.prettier && window.prettierPlugins) {
          prettier = window.prettier;
          prettierPlugins = window.prettierPlugins;
          break;
        }
      } catch (error) {
        console.warn(`Failed to load Prettier from CDN set:`, error);
        continue;
      }
    }

    if (!prettier) {
      throw new Error('All CDN sources failed');
    }

    // Auto-format if there's content
    if (input.value.trim()) {
      format();
    }
  } catch (error) {
    console.error('Failed to load Prettier:', error);
    prettier = createBasicFormatter();
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
    format: function(source, options = {}) {
      try {
        const parsed = JSON.parse(source);
        const indent = options.tabWidth || 2;
        return JSON.stringify(parsed, null, indent);
      } catch (error) {
        throw new Error(`JSON Parse Error: ${error.message}`);
      }
    }
  };
}

// Initialize
loadPrettier();

// Update slider value
indentSizeInput.addEventListener('input', function() {
  indentSizeValue.textContent = this.value;
  if (input.value.trim()) format();
});

// Auto-format on option changes
[sortKeysCheckbox, trailingCommaCheckbox].forEach(element => {
  element.addEventListener('change', function() {
    if (input.value.trim()) format();
  });
});

function format() {
  if (!input.value.trim()) {
    output.value = '';
    return;
  }

  try {
    let jsonData;

    // First, parse the JSON to validate it
    try {
      jsonData = JSON.parse(input.value);
    } catch (parseError) {
      output.value = `JSON Parse Error: ${parseError.message}`;
      return;
    }

    // Sort keys if requested
    if (sortKeysCheckbox.checked) {
      jsonData = sortObjectKeys(jsonData);
    }

    let formatted;

    if (prettier && prettierPlugins) {
      // Use Prettier for advanced formatting
      const options = {
        parser: 'json',
        plugins: prettierPlugins,
        tabWidth: parseInt(indentSizeInput.value),
        trailingComma: trailingCommaCheckbox.checked ? 'all' : 'none',
        printWidth: 80,
        semi: false
      };

      formatted = prettier.format(JSON.stringify(jsonData), options);
    } else {
      // Fallback to basic formatting
      const indent = parseInt(indentSizeInput.value);
      formatted = JSON.stringify(jsonData, null, indent);
    }

    output.value = formatted;
  } catch (error) {
    output.value = `Formatting Error: ${error.message}`;
    console.error('JSON formatting error:', error);
  }
}

function minify() {
  if (!input.value.trim()) {
    output.value = '';
    return;
  }

  try {
    const parsed = JSON.parse(input.value);
    const minified = JSON.stringify(parsed);
    output.value = minified;
  } catch (error) {
    output.value = `JSON Parse Error: ${error.message}`;
  }
}

function validate() {
  if (!input.value.trim()) {
    output.value = 'Please enter JSON to validate';
    return;
  }

  try {
    const parsed = JSON.parse(input.value);
    const stats = getJsonStats(parsed);

    output.value = `✅ Valid JSON!\n\nStatistics:\n${stats}`;
  } catch (error) {
    const errorInfo = getDetailedError(error, input.value);
    output.value = `❌ Invalid JSON!\n\n${errorInfo}`;
  }
}

function getJsonStats(obj) {
  const stats = {
    type: Array.isArray(obj) ? 'Array' : typeof obj,
    size: JSON.stringify(obj).length,
    keys: 0,
    depth: 0
  };

  if (typeof obj === 'object' && obj !== null) {
    if (Array.isArray(obj)) {
      stats.keys = obj.length;
      stats.depth = getMaxDepth(obj);
    } else {
      stats.keys = Object.keys(obj).length;
      stats.depth = getMaxDepth(obj);
    }
  }

  return `Type: ${stats.type}\nSize: ${stats.size} characters\nKeys/Items: ${stats.keys}\nMax Depth: ${stats.depth}`;
}

function getMaxDepth(obj, depth = 0) {
  if (typeof obj !== 'object' || obj === null) {
    return depth;
  }

  let maxDepth = depth;
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const currentDepth = getMaxDepth(obj[key], depth + 1);
      maxDepth = Math.max(maxDepth, currentDepth);
    }
  }

  return maxDepth;
}

function getDetailedError(error, jsonString) {
  let errorInfo = `Error: ${error.message}\n\n`;

  // Try to extract line and column information
  const match = error.message.match(/position (\d+)/);
  if (match) {
    const position = parseInt(match[1]);
    const lines = jsonString.substring(0, position).split('\n');
    const lineNumber = lines.length;
    const columnNumber = lines[lines.length - 1].length + 1;

    errorInfo += `Location: Line ${lineNumber}, Column ${columnNumber}\n`;

    // Show context around the error
    const allLines = jsonString.split('\n');
    const start = Math.max(0, lineNumber - 3);
    const end = Math.min(allLines.length, lineNumber + 2);

    errorInfo += '\nContext:\n';
    for (let i = start; i < end; i++) {
      const marker = i === lineNumber - 1 ? '>>> ' : '    ';
      errorInfo += `${marker}${i + 1}: ${allLines[i]}\n`;
    }
  }

  return errorInfo;
}

function sortObjectKeys(obj) {
  if (Array.isArray(obj)) {
    return obj.map(item => sortObjectKeys(item));
  } else if (typeof obj === 'object' && obj !== null) {
    const sorted = {};
    Object.keys(obj).sort().forEach(key => {
      sorted[key] = sortObjectKeys(obj[key]);
    });
    return sorted;
  }
  return obj;
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
    if (this.value.trim()) {
      format();
    } else {
      output.value = '';
    }
  }, 500);
});

// Make functions global for onclick handlers
window.format = format;
window.minify = minify;
window.validate = validate;
window.swap = swap;
window.clear = clear;
