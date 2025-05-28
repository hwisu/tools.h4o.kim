const input = document.getElementById('input');
const output = document.getElementById('output');

function encode() {
  try {
    const text = input.value;
    if (!text) {
      output.value = '';
      return;
    }
    output.value = btoa(unescape(encodeURIComponent(text)));
  } catch (e) {
    alert('Encoding error: ' + e.message);
  }
}

function decode() {
  try {
    const text = input.value;
    if (!text) {
      output.value = '';
      return;
    }
    output.value = decodeURIComponent(escape(atob(text)));
  } catch (e) {
    alert('Decoding error: Invalid Base64 string');
  }
}

function clear() {
  input.value = '';
  output.value = '';
}

function swap() {
  const temp = input.value;
  input.value = output.value;
  output.value = temp;
}

// Make functions global for onclick handlers
window.encode = encode;
window.decode = decode;
window.clear = clear;
window.swap = swap;
