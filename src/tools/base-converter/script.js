const input = document.getElementById('input');
const output = document.getElementById('output');

// Initialize
input.addEventListener('input', function() {
  if (this.value.trim()) {
    encode();
  } else {
    output.value = '';
  }
});

function encode() {
  try {
    const text = input.value;
    if (!text) {
      output.value = '';
      return;
    }
    output.value = btoa(unescape(encodeURIComponent(text)));
  } catch (e) {
    output.value = '❌ 인코딩 오류: ' + e.message;
  }
}

function decode() {
  try {
    const text = input.value.trim();
    if (!text) {
      output.value = '';
      return;
    }
    output.value = decodeURIComponent(escape(atob(text)));
  } catch (e) {
    output.value = '❌ 잘못된 Base64 형식입니다';
  }
}

function clear() {
  input.value = '';
  output.value = '';
  input.focus();
}

function swap() {
  const temp = input.value;
  input.value = output.value;
  output.value = temp;

  if (input.value.trim()) {
    encode();
  }
}

// Make functions global for onclick handlers
window.encode = encode;
window.decode = decode;
window.clear = clear;
window.swap = swap;
