const text = document.getElementById('text');
const chars = document.getElementById('chars');
const charsNoSpaces = document.getElementById('chars-no-spaces');
const words = document.getElementById('words');
const lines = document.getElementById('lines');

function update() {
  const val = text.value;
  chars.textContent = val.length;
  charsNoSpaces.textContent = val.replace(/\s/g, '').length;
  words.textContent = val.trim() ? val.trim().split(/\s+/).length : 0;
  lines.textContent = val ? val.split('\n').length : 0;
}

text.addEventListener('input', update);
update();
