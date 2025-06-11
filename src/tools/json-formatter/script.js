const input = document.getElementById('input');
const output = document.getElementById('output');

// Real-time formatting
input.addEventListener('input', function() {
  if (this.value.trim()) {
    try {
      const parsed = JSON.parse(this.value);
      output.value = JSON.stringify(parsed, null, 2);
    } catch (e) {
      // Don't show errors in real-time
    }
  } else {
    output.value = '';
  }
});

function format() {
  if (!input.value.trim()) {
    output.value = 'Please enter JSON to format';
    return;
  }

  try {
    const parsed = JSON.parse(input.value);
    output.value = JSON.stringify(parsed, null, 2);
  } catch (error) {
    output.value = `❌ Invalid JSON!\n\nError: ${error.message}`;
  }
}

function minify() {
  if (!input.value.trim()) {
    output.value = 'Please enter JSON to minify';
    return;
  }

  try {
    const parsed = JSON.parse(input.value);
    output.value = JSON.stringify(parsed);
  } catch (error) {
    output.value = `❌ Invalid JSON!\n\nError: ${error.message}`;
  }
}

function validate() {
  if (!input.value.trim()) {
    output.value = 'Please enter JSON to validate';
    return;
  }

  try {
    JSON.parse(input.value);
    output.value = '✅ Valid JSON!';
  } catch (error) {
    output.value = `❌ Invalid JSON!\n\nError: ${error.message}`;
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
window.validate = validate;
window.swap = swap;
window.clear = clear;
