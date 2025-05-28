const input = document.getElementById('input');
const fileInput = document.getElementById('fileInput');
const hashResults = document.getElementById('hashResults');
let CryptoJS = null;

// Load CryptoJS library
async function loadCryptoJS() {
  try {
    // Try multiple CDN sources for better reliability
    const cdnSources = [
      'https://cdn.jsdelivr.net/npm/crypto-js@4.2.0/crypto-js.min.js',
      'https://unpkg.com/crypto-js@4.2.0/crypto-js.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.2.0/crypto-js.min.js'
    ];

    for (const cdnUrl of cdnSources) {
      try {
        await loadScriptFromCDN(cdnUrl);
        if (window.CryptoJS) {
          CryptoJS = window.CryptoJS;
          break;
        }
      } catch (error) {
        console.warn(`Failed to load CryptoJS from ${cdnUrl}:`, error);
        continue;
      }
    }

    if (!CryptoJS) {
      throw new Error('All CDN sources failed');
    }

    // Auto-generate if there's content
    if (input.value.trim()) {
      generateHashes();
    }
  } catch (error) {
    console.error('Failed to load CryptoJS:', error);
    CryptoJS = createBasicCrypto();
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

// Basic fallback using Web Crypto API
function createBasicCrypto() {
  return {
    MD5: (text) => ({ toString: () => 'MD5 not available in fallback mode' }),
    SHA1: (text) => ({ toString: () => webCryptoHash('SHA-1', text) }),
    SHA256: (text) => ({ toString: () => webCryptoHash('SHA-256', text) }),
    SHA512: (text) => ({ toString: () => webCryptoHash('SHA-512', text) }),
    RIPEMD160: (text) => ({ toString: () => 'RIPEMD160 not available in fallback mode' })
  };
}

// Web Crypto API fallback
async function webCryptoHash(algorithm, text) {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest(algorithm, data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } catch (error) {
    return `Error: ${error.message}`;
  }
}

// Initialize
loadCryptoJS();

// Hash algorithms to generate
const hashAlgorithms = [
  { name: 'MD5', func: 'MD5', description: 'Message Digest 5 (128-bit)' },
  { name: 'SHA-1', func: 'SHA1', description: 'Secure Hash Algorithm 1 (160-bit)' },
  { name: 'SHA-256', func: 'SHA256', description: 'Secure Hash Algorithm 256 (256-bit)' },
  { name: 'SHA-512', func: 'SHA512', description: 'Secure Hash Algorithm 512 (512-bit)' },
  { name: 'SHA-224', func: 'SHA224', description: 'Secure Hash Algorithm 224 (224-bit)' },
  { name: 'SHA-384', func: 'SHA384', description: 'Secure Hash Algorithm 384 (384-bit)' },
  { name: 'SHA3-256', func: 'SHA3', description: 'SHA-3 256-bit' },
  { name: 'SHA3-512', func: 'SHA3', description: 'SHA-3 512-bit' },
  { name: 'RIPEMD-160', func: 'RIPEMD160', description: 'RACE Integrity Primitives Evaluation (160-bit)' }
];

function generateHashes() {
  const text = input.value.trim();
  if (!text) {
    hashResults.innerHTML = '<div class="result error">Please enter text to hash</div>';
    hashResults.style.display = 'block';
    return;
  }

  if (!CryptoJS) {
    hashResults.innerHTML = '<div class="result error">Crypto library not loaded. Please wait or refresh the page.</div>';
    hashResults.style.display = 'block';
    return;
  }

  let resultsHtml = '';

  hashAlgorithms.forEach(algorithm => {
    try {
      let hash;

      // Handle different CryptoJS function calls
      if (algorithm.func === 'SHA3' && algorithm.name === 'SHA3-256') {
        hash = CryptoJS.SHA3(text, { outputLength: 256 });
      } else if (algorithm.func === 'SHA3' && algorithm.name === 'SHA3-512') {
        hash = CryptoJS.SHA3(text, { outputLength: 512 });
      } else if (CryptoJS[algorithm.func]) {
        hash = CryptoJS[algorithm.func](text);
      } else {
        // Fallback for unsupported algorithms
        hash = { toString: () => 'Not supported in current library version' };
      }

      const hashValue = hash.toString();

      resultsHtml += `
        <div class="hash-item">
          <div class="hash-label">
            ${algorithm.name}
            <span style="font-weight: normal; color: #666; font-size: 0.85em;">(${algorithm.description})</span>
          </div>
          <div class="hash-value" id="hash-${algorithm.name.replace(/[^a-zA-Z0-9]/g, '')}">${hashValue}</div>
          <button class="copy-btn" onclick="copyHash('hash-${algorithm.name.replace(/[^a-zA-Z0-9]/g, '')}', this)">Copy</button>
        </div>
      `;
    } catch (error) {
      resultsHtml += `
        <div class="hash-item">
          <div class="hash-label">${algorithm.name}</div>
          <div class="hash-value">Error: ${error.message}</div>
        </div>
      `;
    }
  });

  hashResults.innerHTML = resultsHtml;
  hashResults.style.display = 'block';
}

function copyHash(elementId, button) {
  const hashElement = document.getElementById(elementId);
  const hashValue = hashElement.textContent;

  navigator.clipboard.writeText(hashValue).then(() => {
    const originalText = button.textContent;
    button.textContent = 'Copied!';
    button.classList.add('copy-success');

    setTimeout(() => {
      button.textContent = originalText;
      button.classList.remove('copy-success');
    }, 2000);
  }).catch(err => {
    console.error('Failed to copy: ', err);
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = hashValue;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);

    button.textContent = 'Copied!';
    setTimeout(() => {
      button.textContent = 'Copy';
    }, 2000);
  });
}

// File input handling
fileInput.addEventListener('change', function(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    input.value = e.target.result;
    generateHashes();
  };
  reader.readAsText(file);
});

function clear() {
  input.value = '';
  fileInput.value = '';
  hashResults.style.display = 'none';
}

// Real-time hashing (debounced)
let timeout;
input.addEventListener('input', function() {
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    if (this.value.trim() && CryptoJS) {
      generateHashes();
    } else {
      hashResults.style.display = 'none';
    }
  }, 500);
});

// Make functions global for onclick handlers
window.generateHashes = generateHashes;
window.copyHash = copyHash;
window.clear = clear;
