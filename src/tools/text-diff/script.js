const text1 = document.getElementById('text1');
const text2 = document.getElementById('text2');
const compareBtn = document.getElementById('compareBtn');
const result = document.getElementById('result');
const modeButtons = document.querySelectorAll('.mode-btn');

let currentMode = 'words';

// Initialize
document.addEventListener('DOMContentLoaded', function() {
  // Add event listeners
  text1.addEventListener('input', checkInputs);
  text2.addEventListener('input', checkInputs);

  // Mode selection
  modeButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      modeButtons.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      currentMode = this.dataset.mode;

      if (text1.value && text2.value) {
        compare();
      }
    });
  });

  checkInputs();
});

function checkInputs() {
  const hasInput = text1.value.trim() || text2.value.trim();
  compareBtn.disabled = !hasInput;
}

function compare() {
  if (!text1.value && !text2.value) {
    result.style.display = 'none';
    return;
  }

  try {
    let diff;

    switch (currentMode) {
      case 'chars':
        diff = basicDiff(text1.value, text2.value);
        break;
      case 'words':
        diff = basicDiff(text1.value, text2.value, /\s+/);
        break;
      case 'lines':
        diff = basicDiff(text1.value, text2.value, '\n');
        break;
    }

    // Generate diff HTML
    let diffHtml = '';
    diff.forEach(item => {
      const content = escapeHtml(item.value);

      if (item.added) {
        diffHtml += `<span class="added">${content}</span>`;
      } else if (item.removed) {
        diffHtml += `<span class="removed">${content}</span>`;
      } else {
        diffHtml += `<span class="unchanged">${content}</span>`;
      }
    });

    result.innerHTML = `<div class="diff-output ${currentMode}-diff">${diffHtml}</div>`;
    result.style.display = 'block';

  } catch (e) {
    result.innerHTML = `<div style="color: #dc3545;">Error comparing texts: ${e.message}</div>`;
    result.style.display = 'block';
  }
}

// Simple diff implementation
function basicDiff(str1, str2, separator) {
  const arr1 = separator ? str1.split(separator) : str1.split('');
  const arr2 = separator ? str2.split(separator) : str2.split('');
  const result = [];

  let i = 0, j = 0;
  while (i < arr1.length || j < arr2.length) {
    if (i >= arr1.length) {
      result.push({ added: true, value: arr2[j] });
      j++;
    } else if (j >= arr2.length) {
      result.push({ removed: true, value: arr1[i] });
      i++;
    } else if (arr1[i] === arr2[j]) {
      result.push({ value: arr1[i] });
      i++;
      j++;
    } else {
      // Simple approach: mark as removed then added
      result.push({ removed: true, value: arr1[i] });
      result.push({ added: true, value: arr2[j] });
      i++;
      j++;
    }
  }

  return result;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function clear() {
  text1.value = '';
  text2.value = '';
  result.style.display = 'none';
  checkInputs();
}

// Make functions global for onclick handlers
window.compare = compare;
window.clear = clear;
