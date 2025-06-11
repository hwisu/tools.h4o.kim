const input = document.getElementById('input');
const hashResults = document.getElementById('hashResults');
let CryptoJS = null;

// Load CryptoJS library
async function loadCryptoJS() {
  try {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/crypto-js@4.2.0/crypto-js.min.js';
    script.onload = () => {
      CryptoJS = window.CryptoJS;
      if (input.value.trim()) {
        generateHashes();
      }
    };
    document.head.appendChild(script);
  } catch (error) {
    console.error('Failed to load CryptoJS:', error);
  }
}

// Initialize
loadCryptoJS();

// Real-time hashing
input.addEventListener('input', function() {
  if (this.value.trim() && CryptoJS) {
    generateHashes();
  } else {
    hashResults.style.display = 'none';
  }
});

// Hash algorithms to generate (simplified list)
const hashAlgorithms = [
  { name: 'MD5', func: 'MD5' },
  { name: 'SHA-1', func: 'SHA1' },
  { name: 'SHA-256', func: 'SHA256' },
  { name: 'SHA-512', func: 'SHA512' }
];

function generateHashes() {
  const text = input.value.trim();
  if (!text) {
    hashResults.style.display = 'none';
    return;
  }

  if (!CryptoJS) {
    hashResults.innerHTML = '<div style="color: #dc3545;">Loading crypto library...</div>';
    hashResults.style.display = 'block';
    return;
  }

  let resultsHtml = '';

  hashAlgorithms.forEach(algorithm => {
    try {
      const hash = CryptoJS[algorithm.func](text);
      const hashValue = hash.toString();

      resultsHtml += `
        <div class="hash-item">
          <div class="hash-label">${algorithm.name}</div>
          <div class="hash-value" onclick="copyHash('${hashValue}')">${hashValue}</div>
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

function copyHash(hashValue) {
  navigator.clipboard.writeText(hashValue).then(() => {
    // Simple notification
    const notification = document.createElement('div');
    notification.textContent = 'Hash copied to clipboard!';
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #28a745;
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 3px;
      z-index: 1000;
    `;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 2000);
  });
}

function clear() {
  input.value = '';
  hashResults.style.display = 'none';
  input.focus();
}

// Make functions global for onclick handlers
window.generateHashes = generateHashes;
window.clear = clear;
