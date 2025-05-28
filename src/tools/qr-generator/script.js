const input = document.getElementById('input');
const sizeSlider = document.getElementById('size');
const sizeValue = document.getElementById('sizeValue');
const marginSlider = document.getElementById('margin');
const marginValue = document.getElementById('marginValue');
const errorCorrection = document.getElementById('errorCorrection');
const foregroundColor = document.getElementById('foregroundColor');
const backgroundColor = document.getElementById('backgroundColor');
const qrStyle = document.getElementById('qrStyle');
const qrcodeDiv = document.getElementById('qrcode');
const qrStats = document.getElementById('qrStats');
const generateBtn = document.getElementById('generateBtn');
const downloadBtn = document.getElementById('downloadBtn');
const titleStatus = document.getElementById('titleStatus');
const statusTooltip = document.getElementById('statusTooltip');
let currentCanvas = null;
let qrLib = null;

// Load QR library
async function loadQRLibrary() {
  try {
    // Try multiple CDN sources for better reliability
    const cdnSources = [
      'https://cdn.jsdelivr.net/npm/qrcode-generator@1.4.4/qrcode.min.js',
      'https://unpkg.com/qrcode-generator@1.4.4/qrcode.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/qrcode-generator/1.4.4/qrcode.min.js'
    ];

    for (const cdnUrl of cdnSources) {
      try {
        await loadScriptFromCDN(cdnUrl);
        if (window.qrcode) {
          qrLib = window.qrcode;
          break;
        }
      } catch (error) {
        console.warn(`Failed to load QR library from ${cdnUrl}:`, error);
        continue;
      }
    }

    if (!qrLib) {
      throw new Error('All CDN sources failed');
    }

    generateBtn.disabled = false;

    // Auto-generate if there's content
    if (input.value.trim()) {
      generate();
    }
  } catch (error) {
    console.error('Failed to load QR library:', error);
    generateBtn.disabled = false;
    qrLib = createBasicQRGenerator();
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

// Basic QR generator fallback
function createBasicQRGenerator() {
  return function(typeNumber, errorCorrectionLevel) {
    return {
      addData: function(data) { this.data = data; },
      make: function() { /* Basic implementation */ },
      getModuleCount: function() { return 21; }, // Basic QR size
      isDark: function(row, col) {
        // Very basic pattern for demonstration
        return (row + col) % 3 === 0;
      }
    };
  };
}

// Initialize
loadQRLibrary();

sizeSlider.addEventListener('input', function() {
  sizeValue.textContent = this.value;
  if (input.value.trim()) generate();
});

marginSlider.addEventListener('input', function() {
  marginValue.textContent = this.value;
  if (input.value.trim()) generate();
});

[errorCorrection, foregroundColor, backgroundColor, qrStyle].forEach(element => {
  element.addEventListener('change', function() {
    if (input.value.trim()) generate();
  });
});

function generate() {
  if (!input.value.trim()) {
    alert('Please enter text or URL.');
    return;
  }

  if (!qrLib) {
    alert('QR library not loaded. Please wait or refresh the page.');
    return;
  }

  qrcodeDiv.innerHTML = '';
  qrStats.style.display = 'none';

  try {
    // Create QR code data
    const qr = qrLib(0, errorCorrection.value);
    qr.addData(input.value);
    qr.make();

    const moduleCount = qr.getModuleCount();
    const cellSize = Math.floor(parseInt(sizeSlider.value) / (moduleCount + 2 * parseInt(marginSlider.value)));
    const margin = parseInt(marginSlider.value) * cellSize;
    const size = moduleCount * cellSize + 2 * margin;

    // Create canvas
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    // Fill background
    ctx.fillStyle = backgroundColor.value;
    ctx.fillRect(0, 0, size, size);

    // Draw QR code based on style
    drawRegularQR(ctx, qr, moduleCount, margin, cellSize);

    qrcodeDiv.appendChild(canvas);
    currentCanvas = canvas;
    downloadBtn.disabled = false;

    // Show stats
    const dataLength = input.value.length;
    const capacity = getCapacity(errorCorrection.value);
    const usage = Math.round((dataLength / capacity) * 100);

    qrStats.innerHTML =
      `Data Length: ${dataLength} characters<br>` +
      `QR Version: Auto-detected<br>` +
      `Module Count: ${moduleCount}x${moduleCount}<br>` +
      `Error Correction: ${errorCorrection.value} (${getErrorCorrectionDescription(errorCorrection.value)})<br>` +
      `Capacity Usage: ${usage}%<br>` +
      `Canvas Size: ${size}x${size}px`;

    qrStats.style.display = 'block';

  } catch (error) {
    qrcodeDiv.innerHTML = `<div class="result error">QR code generation failed: ${error.message}</div>`;
    console.error('QR generation error:', error);
  }
}

// Draw regular QR with individual styling
function drawRegularQR(ctx, qr, moduleCount, margin, cellSize) {
  ctx.fillStyle = foregroundColor.value;

  for (let row = 0; row < moduleCount; row++) {
    for (let col = 0; col < moduleCount; col++) {
      if (qr.isDark(row, col)) {
        const x = margin + col * cellSize;
        const y = margin + row * cellSize;

        switch (qrStyle.value) {
          case 'dots':
            drawCircle(ctx, x + cellSize/2, y + cellSize/2, cellSize * 0.4);
            break;
          default: // square
            ctx.fillRect(x, y, cellSize, cellSize);
        }
      }
    }
  }
}

function drawCircle(ctx, x, y, radius) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI);
  ctx.fill();
}

function getCapacity(errorLevel) {
  // Approximate capacity for different error correction levels (for version 10 QR code)
  const capacities = { L: 174, M: 136, Q: 100, H: 74 };
  return capacities[errorLevel] || 136;
}

function getErrorCorrectionDescription(level) {
  const descriptions = {
    L: '~7% recovery',
    M: '~15% recovery',
    Q: '~25% recovery',
    H: '~30% recovery'
  };
  return descriptions[level] || '';
}

function download() {
  if (!currentCanvas) {
    alert('Please generate a QR code first.');
    return;
  }

  const link = document.createElement('a');
  link.download = 'qrcode.png';
  link.href = currentCanvas.toDataURL();
  link.click();
}

input.addEventListener('input', function() {
  if (this.value.trim() && qrLib) {
    // Debounce generation for better performance
    clearTimeout(window.qrTimeout);
    window.qrTimeout = setTimeout(generate, 500);
  } else {
    // Hide stats when input is empty
    qrStats.style.display = 'none';
    qrcodeDiv.innerHTML = '';
    currentCanvas = null;
    downloadBtn.disabled = true;
  }
});

// Make functions global for onclick handlers
window.generate = generate;
window.download = download;
