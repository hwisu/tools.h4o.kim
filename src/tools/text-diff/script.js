const text1 = document.getElementById('text1');
const text2 = document.getElementById('text2');
const ignoreWhitespace = document.getElementById('ignoreWhitespace');
const ignoreCase = document.getElementById('ignoreCase');
const showLineNumbers = document.getElementById('showLineNumbers');
const stats = document.getElementById('stats');
const result = document.getElementById('result');
const similarityScore = document.getElementById('similarityScore');
const compareBtn = document.getElementById('compareBtn');
const modeButtons = document.querySelectorAll('.mode-btn');
const titleStatus = document.getElementById('titleStatus');
const statusTooltip = document.getElementById('statusTooltip');

let currentMode = 'words';
let diffLib = null;

// Load diff library
async function loadDiffLibrary() {
  try {
    // Try multiple CDN sources for better reliability
    const cdnSources = [
      'https://cdn.jsdelivr.net/npm/diff@5.1.0/dist/diff.min.js',
      'https://unpkg.com/diff@5.1.0/dist/diff.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/jsdiff/5.1.0/diff.min.js'
    ];

    for (const cdnUrl of cdnSources) {
      try {
        // Load as script tag for better browser compatibility
        await loadScriptFromCDN(cdnUrl);
        if (window.Diff) {
          diffLib = window.Diff;
          break;
        }
      } catch (error) {
        console.warn(`Failed to load from ${cdnUrl}:`, error);
        continue;
      }
    }

    if (!diffLib) {
      throw new Error('All CDN sources failed');
    }

    compareBtn.disabled = false;

    // Auto-compare if there's content
    if (text1.value.trim() && text2.value.trim()) {
      compare();
    }
  } catch (error) {
    console.error('Failed to load diff library:', error);
    // Enable with basic diff
    compareBtn.disabled = false;
    diffLib = createBasicDiff();
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

// Basic fallback diff implementation
function createBasicDiff() {
  return {
    diffChars: (str1, str2) => basicDiff(str1, str2, ''),
    diffWords: (str1, str2) => basicDiff(str1, str2, /\s+/),
    diffWordsWithSpace: (str1, str2) => basicDiff(str1, str2, /(\s+)/),
    diffLines: (str1, str2) => basicDiff(str1, str2, /\n/),
    diffTrimmedLines: (str1, str2) => basicDiff(str1.trim(), str2.trim(), /\n/),
    diffSentences: (str1, str2) => basicDiff(str1, str2, /[.!?]+\s*/)
  };
}

// Simple diff implementation as fallback
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

// Initialize
loadDiffLibrary();

// Mode button handling
modeButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    modeButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentMode = btn.dataset.mode;

    // Show/hide line numbers option based on mode
    const lineNumberControl = showLineNumbers.closest('.control-group');
    lineNumberControl.style.display = currentMode === 'lines' ? 'block' : 'none';

    if (text1.value.trim() && text2.value.trim() && diffLib) {
      compare();
    }
  });
});

function compare() {
  const str1 = text1.value;
  const str2 = text2.value;

  if (!str1 && !str2) {
    showError('Please enter text in both fields');
    return;
  }

  if (!diffLib) {
    showError('Diff library not loaded. Please wait or refresh the page.');
    return;
  }

  try {
    let diff;
    let processedStr1 = str1;
    let processedStr2 = str2;

    // Apply preprocessing options
    if (ignoreCase.checked) {
      processedStr1 = str1.toLowerCase();
      processedStr2 = str2.toLowerCase();
    }

    // Select diff function based on mode
    switch (currentMode) {
      case 'chars':
        diff = diffLib.diffChars(processedStr1, processedStr2);
        break;
      case 'words':
        if (ignoreWhitespace.checked) {
          diff = diffLib.diffWords(processedStr1, processedStr2);
        } else {
          diff = diffLib.diffWordsWithSpace(processedStr1, processedStr2);
        }
        break;
      case 'lines':
        if (ignoreWhitespace.checked) {
          diff = diffLib.diffTrimmedLines(processedStr1, processedStr2);
        } else {
          diff = diffLib.diffLines(processedStr1, processedStr2);
        }
        break;
      case 'sentences':
        diff = diffLib.diffSentences(processedStr1, processedStr2);
        break;
      default:
        diff = diffLib.diffWords(processedStr1, processedStr2);
    }

    // Calculate statistics
    const added = diff.filter(d => d.added).length;
    const removed = diff.filter(d => d.removed).length;
    const unchanged = diff.filter(d => !d.added && !d.removed).length;
    const total = diff.length;

    // Calculate similarity score
    const totalChars1 = str1.length;
    const totalChars2 = str2.length;
    const addedChars = diff.filter(d => d.added).reduce((sum, d) => sum + d.value.length, 0);
    const removedChars = diff.filter(d => d.removed).reduce((sum, d) => sum + d.value.length, 0);
    const similarity = Math.round((1 - (addedChars + removedChars) / Math.max(totalChars1, totalChars2)) * 100);

    // Display similarity score
    const similarityText = `Similarity: ${similarity}% | Changes: ${added + removed} ${currentMode}`;
    similarityScore.innerHTML = similarityText;
    similarityScore.style.display = 'block';

    // Display statistics
    const statsText =
      `Mode: ${currentMode.charAt(0).toUpperCase() + currentMode.slice(1)} level | ` +
      `Added: ${added} | ` +
      `Removed: ${removed} | ` +
      `Unchanged: ${unchanged} | ` +
      `Total: ${total}`;

    stats.innerHTML = statsText;
    stats.style.display = 'block';

    // Generate diff HTML
    let diffHtml = '';
    let lineNumber1 = 1;
    let lineNumber2 = 1;

    diff.forEach((item, index) => {
      const content = escapeHtml(item.value);
      let displayContent = content;

      // Handle line numbers for line mode
      if (currentMode === 'lines' && showLineNumbers.checked) {
        const spaceChar = ' ';
        if (item.added) {
          const lineNum = lineNumber2.toString().padStart(3, spaceChar);
          displayContent = `<span class="line-number">+${lineNum}</span>${content}`;
          lineNumber2 += (item.value.match(/\n/g) || []).length;
        } else if (item.removed) {
          const lineNum = lineNumber1.toString().padStart(3, spaceChar);
          displayContent = `<span class="line-number">-${lineNum}</span>${content}`;
          lineNumber1 += (item.value.match(/\n/g) || []).length;
        } else {
          const lineNum = lineNumber1.toString().padStart(3, spaceChar);
          displayContent = `<span class="line-number"> ${lineNum}</span>${content}`;
          lineNumber1 += (item.value.match(/\n/g) || []).length;
          lineNumber2 += (item.value.match(/\n/g) || []).length;
        }
      }

      if (item.added) {
        diffHtml += `<span class="added">${displayContent}</span>`;
      } else if (item.removed) {
        diffHtml += `<span class="removed">${displayContent}</span>`;
      } else {
        diffHtml += `<span class="unchanged">${displayContent}</span>`;
      }
    });

    const resultHtml = `<div class="diff-output ${currentMode}-diff">${diffHtml}</div>`;
    result.innerHTML = resultHtml;
    result.className = 'result';
    result.style.display = 'block';

  } catch (e) {
    showError('Error comparing texts: ' + e.message);
  }
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function clear() {
  text1.value = '';
  text2.value = '';
  stats.style.display = 'none';
  result.style.display = 'none';
  similarityScore.style.display = 'none';
}

function showError(text) {
  result.innerHTML = text;
  result.className = 'result error';
  result.style.display = 'block';
  stats.style.display = 'none';
  similarityScore.style.display = 'none';
}

// Real-time comparison (debounced)
let timeout;
function debouncedCompare() {
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    if (text1.value && text2.value && diffLib) {
      compare();
    }
  }, 500);
}

text1.addEventListener('input', debouncedCompare);
text2.addEventListener('input', debouncedCompare);
[ignoreWhitespace, ignoreCase, showLineNumbers].forEach(element => {
  element.addEventListener('change', () => {
    if (text1.value && text2.value && diffLib) {
      compare();
    }
  });
});

// Make function global for onclick handler
window.compare = compare;
window.clear = clear;
