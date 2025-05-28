function encode() {
  const input = document.getElementById('input').value;
  const output = document.getElementById('output');

  try {
    output.value = encodeURI(input);
  } catch (error) {
    output.value = 'Error: ' + error.message;
  }
}

function decode() {
  const input = document.getElementById('input').value;
  const output = document.getElementById('output');

  try {
    output.value = decodeURI(input);
  } catch (error) {
    output.value = 'Error: ' + error.message;
  }
}

function encodeComponent() {
  const input = document.getElementById('input').value;
  const output = document.getElementById('output');

  try {
    output.value = encodeURIComponent(input);
  } catch (error) {
    output.value = 'Error: ' + error.message;
  }
}

function decodeComponent() {
  const input = document.getElementById('input').value;
  const output = document.getElementById('output');

  try {
    output.value = decodeURIComponent(input);
  } catch (error) {
    output.value = 'Error: ' + error.message;
  }
}

function swap() {
  const input = document.getElementById('input');
  const output = document.getElementById('output');

  const temp = input.value;
  input.value = output.value;
  output.value = temp;
}

function clear() {
  document.getElementById('input').value = '';
  document.getElementById('output').value = '';
  document.getElementById('input').focus();
}

// Auto-encode on input change
document.getElementById('input').addEventListener('input', function() {
  if (this.value.trim()) {
    encode();
  } else {
    document.getElementById('output').value = '';
  }
});
