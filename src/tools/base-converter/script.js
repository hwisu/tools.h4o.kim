const input = document.getElementById('input');
const output = document.getElementById('output');
const formatInfo = document.getElementById('format-info');
const encodeBtn = document.getElementById('encodeBtn');
const decodeBtn = document.getElementById('decodeBtn');
const tabButtons = document.querySelectorAll('.tab-button');

let currentType = 'base64';

// Format information for each conversion type
const formatInfos = {
  base64: 'Base64 encoding converts binary data to ASCII text using 64 printable characters (A-Z, a-z, 0-9, +, /)',
  hex: 'Hexadecimal uses base-16 notation with digits 0-9 and letters A-F to represent binary data',
  binary: 'Binary representation uses only 0s and 1s to show the actual bit pattern of data',
  decimal: 'Decimal converts each character to its ASCII/Unicode decimal value (0-255 for ASCII)'
};

// Initialize the converter
function init() {
  updateFormatInfo();
  updateButtonLabels();

  // Add tab click handlers
  tabButtons.forEach(button => {
    button.addEventListener('click', () => switchTab(button.dataset.type));
  });

  // Add input event listener for real-time conversion
  input.addEventListener('input', () => {
    if (input.value.trim()) {
      encode();
    } else {
      output.value = '';
    }
  });

  // Add keyboard shortcuts
  document.addEventListener('keydown', handleKeyboardShortcuts);
}

// Switch between conversion types
function switchTab(type) {
  currentType = type;

  // Update active tab
  tabButtons.forEach(btn => btn.classList.remove('active'));
  document.querySelector(`[data-type="${type}"]`).classList.add('active');

  updateFormatInfo();
  updateButtonLabels();

  // Clear output and re-convert if there's input
  output.value = '';
  if (input.value.trim()) {
    encode();
  }
}

// Update format information display
function updateFormatInfo() {
  formatInfo.textContent = formatInfos[currentType];
}

// Update button labels based on current type
function updateButtonLabels() {
  const labels = {
    base64: { encode: 'Encode to Base64', decode: 'Decode from Base64' },
    hex: { encode: 'Text to Hex', decode: 'Hex to Text' },
    binary: { encode: 'Text to Binary', decode: 'Binary to Text' },
    decimal: { encode: 'Text to Decimal', decode: 'Decimal to Text' }
  };

  encodeBtn.textContent = labels[currentType].encode;
  decodeBtn.textContent = labels[currentType].decode;
}

// Main encode function
function encode() {
  try {
    const text = input.value;
    if (!text) {
      output.value = '';
      return;
    }

    let result = '';

    switch (currentType) {
      case 'base64':
        result = btoa(unescape(encodeURIComponent(text)));
        break;
      case 'hex':
        result = Array.from(new TextEncoder().encode(text))
          .map(byte => byte.toString(16).padStart(2, '0'))
          .join(' ');
        break;
      case 'binary':
        result = Array.from(new TextEncoder().encode(text))
          .map(byte => byte.toString(2).padStart(8, '0'))
          .join(' ');
        break;
      case 'decimal':
        result = Array.from(text)
          .map(char => char.charCodeAt(0))
          .join(' ');
        break;
    }

    output.value = result;
  } catch (e) {
    output.value = 'Error: ' + e.message;
  }
}

// Main decode function
function decode() {
  try {
    const text = input.value.trim();
    if (!text) {
      output.value = '';
      return;
    }

    let result = '';

    switch (currentType) {
      case 'base64':
        result = decodeURIComponent(escape(atob(text)));
        break;
      case 'hex':
        const hexBytes = text.split(/\s+/).filter(h => h);
        const hexArray = hexBytes.map(hex => parseInt(hex, 16));
        result = new TextDecoder().decode(new Uint8Array(hexArray));
        break;
      case 'binary':
        const binBytes = text.split(/\s+/).filter(b => b);
        const binArray = binBytes.map(bin => parseInt(bin, 2));
        result = new TextDecoder().decode(new Uint8Array(binArray));
        break;
      case 'decimal':
        const decValues = text.split(/\s+/).filter(d => d).map(d => parseInt(d, 10));
        result = String.fromCharCode(...decValues);
        break;
    }

    output.value = result;
  } catch (e) {
    output.value = 'Error: Invalid ' + currentType + ' format';
  }
}

// Copy functions
function copyInput() {
  copyToClipboard(input.value, 'Input copied!');
}

function copyOutput() {
  copyToClipboard(output.value, 'Output copied!');
}

function copyToClipboard(text, message) {
  if (!text) return;

  navigator.clipboard.writeText(text).then(() => {
    showCopySuccess(message);
  }).catch(() => {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    showCopySuccess(message);
  });
}

function showCopySuccess(message) {
  // Create temporary notification
  const notification = document.createElement('div');
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #28a745;
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 3px;
    z-index: 1000;
    font-size: 0.9rem;
  `;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 2000);
}

// Utility functions
function clear() {
  input.value = '';
  output.value = '';
  input.focus();
}

function swap() {
  const temp = input.value;
  input.value = output.value;
  output.value = temp;

  // Re-convert after swap
  if (input.value.trim()) {
    encode();
  }
}

// Keyboard shortcuts handler
function handleKeyboardShortcuts(e) {
  // Ctrl+Enter: Convert (encode)
  if (e.ctrlKey && e.key === 'Enter') {
    e.preventDefault();
    encode();
  }

  // Ctrl+S: Swap
  if (e.ctrlKey && e.key === 's') {
    e.preventDefault();
    swap();
  }

  // Ctrl+L: Clear
  if (e.ctrlKey && e.key === 'l') {
    e.preventDefault();
    clear();
  }

  // Ctrl+Shift+C: Copy input
  if (e.ctrlKey && e.shiftKey && e.key === 'C') {
    e.preventDefault();
    copyInput();
  }

  // Ctrl+Shift+V: Copy output
  if (e.ctrlKey && e.shiftKey && e.key === 'V') {
    e.preventDefault();
    copyOutput();
  }

  // Ctrl+1-4: Switch tabs
  if (e.ctrlKey && e.key >= '1' && e.key <= '4') {
    e.preventDefault();
    const types = ['base64', 'hex', 'binary', 'decimal'];
    const index = parseInt(e.key) - 1;
    if (types[index]) {
      switchTab(types[index]);
    }
  }
}

// Make functions global for onclick handlers
window.encode = encode;
window.decode = decode;
window.clear = clear;
window.swap = swap;
window.copyInput = copyInput;
window.copyOutput = copyOutput;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
