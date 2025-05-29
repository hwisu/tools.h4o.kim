/**
 * Icon Generator Tool
 * 이모지 기반 아이콘 생성 및 다운로드 도구
 */

class IconGeneratorTool {
  constructor() {
    this.currentEmoji = '🛠️';
    this.currentBgColor = '#333333';
    this.currentName = 'my-icon';
    this.currentFormat = 'png';
    this.cache = new Map();

    this.init();
  }

  init() {
    this.setupEmojiPicker();
    this.setupColorControls();
    this.setupEventListeners();
    this.updatePreview();
  }

  setupEmojiPicker() {
    const emojiPicker = document.getElementById('emojiPicker');

    // 카테고리별 이모지 모음
    const emojiCategories = {
      tools: ['🛠️', '🔧', '🔨', '⚙️', '🔩', '⚡', '🔌', '💡', '🔍', '📐'],
      tech: ['💻', '📱', '⌨️', '🖥️', '🖨️', '📡', '🔋', '💾', '💿', '📀'],
      symbols: ['⭐', '❤️', '🔥', '💎', '🎯', '🚀', '⚡', '🌟', '💫', '✨'],
      shapes: ['🔴', '🟠', '🟡', '🟢', '🔵', '🟣', '⚫', '⚪', '🟤', '🔶'],
      office: ['📋', '📊', '📈', '📉', '📝', '📄', '📃', '📑', '🗂️', '📁'],
      communication: ['📧', '📨', '📩', '📤', '📥', '📮', '📪', '📫', '📬', '📭'],
      security: ['🔐', '🔒', '🔓', '🔑', '🛡️', '🔏', '🔐', '🗝️', '🔒', '🔓'],
      media: ['🎵', '🎶', '🎤', '🎧', '📷', '📸', '🎥', '📹', '🎬', '🎭'],
      games: ['🎮', '🕹️', '🎯', '🎲', '🃏', '🎰', '🎳', '⚽', '🏀', '🎾'],
      food: ['🍎', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐', '🍈', '🍒']
    };

    // 모든 이모지를 하나의 배열로 합치기
    const allEmojis = Object.values(emojiCategories).flat();

    allEmojis.forEach(emoji => {
      const button = document.createElement('button');
      button.className = 'emoji-btn';
      button.textContent = emoji;
      button.title = emoji;
      button.onclick = () => this.selectEmoji(emoji, button);
      emojiPicker.appendChild(button);
    });

    // 기본 이모지 선택
    const defaultBtn = emojiPicker.querySelector(`button[title="${this.currentEmoji}"]`);
    if (defaultBtn) {
      defaultBtn.classList.add('selected');
    }
  }

  setupColorControls() {
    const bgColor = document.getElementById('bgColor');
    const bgColorText = document.getElementById('bgColorText');
    const presetColors = document.querySelectorAll('.preset-color');

    // 색상 입력 동기화
    bgColor.addEventListener('input', (e) => {
      this.currentBgColor = e.target.value;
      bgColorText.value = e.target.value;
      this.updatePreview();
    });

    bgColorText.addEventListener('input', (e) => {
      const color = e.target.value.toLowerCase();
      if (color === 'transparent') {
        this.currentBgColor = 'transparent';
        bgColor.style.display = 'none'; // 투명일 때는 color picker 숨김
        this.updatePreview();
      } else if (/^#[0-9A-F]{6}$/i.test(color)) {
        this.currentBgColor = color;
        bgColor.value = color;
        bgColor.style.display = 'block';
        this.updatePreview();
      }
    });

    // 프리셋 색상 클릭
    presetColors.forEach(preset => {
      preset.addEventListener('click', () => {
        const color = preset.dataset.color;
        this.currentBgColor = color;

        if (color === 'transparent') {
          bgColorText.value = 'transparent';
          bgColor.style.display = 'none';
        } else {
          bgColor.value = color;
          bgColorText.value = color;
          bgColor.style.display = 'block';
        }

        this.updatePreview();
      });
    });
  }

  setupEventListeners() {
    const emojiInput = document.getElementById('emojiInput');
    const iconName = document.getElementById('iconName');
    const format = document.getElementById('format');

    emojiInput.addEventListener('input', (e) => {
      const value = e.target.value;
      // 이모지 추출 (유니코드 이모지 패턴)
      const emojiMatch = value.match(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F900}-\u{1F9FF}]|[\u{1F018}-\u{1F270}]/gu);

      if (emojiMatch && emojiMatch.length > 0) {
        this.currentEmoji = emojiMatch[0]; // 첫 번째 이모지 사용
        e.target.value = this.currentEmoji; // 입력 필드를 정리
      } else if (value.length > 0) {
        this.currentEmoji = value.charAt(0); // 첫 번째 문자 사용
      } else {
        this.currentEmoji = '🛠️'; // 기본값
      }

      this.updateEmojiSelection();
      this.updatePreview();
    });

    iconName.addEventListener('input', (e) => {
      this.currentName = e.target.value || 'my-icon';
    });

    format.addEventListener('change', (e) => {
      this.currentFormat = e.target.value;
      this.updatePreview(); // 포맷 변경 시 프리뷰 업데이트
    });
  }

  selectEmoji(emoji, button) {
    // 이전 선택 해제
    document.querySelectorAll('.emoji-btn.selected').forEach(btn => {
      btn.classList.remove('selected');
    });

    // 새 선택
    button.classList.add('selected');
    this.currentEmoji = emoji;
    document.getElementById('emojiInput').value = emoji;
    this.updatePreview();
  }

  updateEmojiSelection() {
    // 이모지 입력에 따라 선택 상태 업데이트
    document.querySelectorAll('.emoji-btn.selected').forEach(btn => {
      btn.classList.remove('selected');
    });

    const matchingBtn = document.querySelector(`.emoji-btn[title="${this.currentEmoji}"]`);
    if (matchingBtn) {
      matchingBtn.classList.add('selected');
    }
  }

  updatePreview() {
    const previewGrid = document.getElementById('previewGrid');
    const sizes = [32, 72, 96, 128, 144, 152, 180, 192];

    previewGrid.innerHTML = '';

    sizes.forEach(size => {
      const preview = document.createElement('div');
      preview.className = 'icon-preview';
      preview.style.width = `${Math.min(size, 100)}px`;
      preview.style.height = `${Math.min(size, 100)}px`;

      // 투명 배경일 때 체크무늬 배경 추가
      if (this.currentBgColor === 'transparent') {
        preview.classList.add('preview-transparent');
      }

      const img = document.createElement('img');
      img.src = this.generateIcon(size);
      img.alt = `${size}x${size} icon preview`;
      img.style.width = '100%';
      img.style.height = '100%';

      preview.appendChild(img);

      const label = document.createElement('div');
      label.textContent = `${size}x${size}`;
      label.style.fontSize = '0.8rem';
      label.style.color = '#666';
      label.style.marginTop = '0.25rem';
      label.style.textAlign = 'center';

      const container = document.createElement('div');
      container.style.textAlign = 'center';
      container.appendChild(preview);
      container.appendChild(label);

      previewGrid.appendChild(container);
    });
  }

  generateIcon(size) {
    const cacheKey = `${size}-${this.currentEmoji}-${this.currentBgColor}`;

    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    if (this.currentFormat === 'svg') {
      return this.generateSVGIcon(size);
    } else {
      return this.generateCanvasIcon(size);
    }
  }

  generateSVGIcon(size) {
    const radius = size * 0.2;
    const fontSize = size * 0.6;

    const fillAttribute = this.currentBgColor === 'transparent' ? 'fill="none"' : `fill="${this.currentBgColor}"`;

    const svg = `
      <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
        <rect width="${size}" height="${size}" rx="${radius}" ${fillAttribute}/>
        <text x="${size/2}" y="${size/2}" font-family="Apple Color Emoji, Segoe UI Emoji, Noto Color Emoji, sans-serif"
              font-size="${fontSize}" text-anchor="middle" dominant-baseline="central">${this.currentEmoji}</text>
      </svg>
    `;

    const dataUrl = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;

    const cacheKey = `${size}-${this.currentEmoji}-${this.currentBgColor}`;
    this.cache.set(cacheKey, dataUrl);

    return dataUrl;
  }

  generateCanvasIcon(size) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = size;
    canvas.height = size;

    // 고품질 렌더링 설정
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // 투명 배경이 아닐 때만 배경 그리기
    if (this.currentBgColor !== 'transparent') {
      ctx.fillStyle = this.currentBgColor;
      ctx.fillRect(0, 0, size, size);

      // 둥근 모서리
      const radius = size * 0.2;
      ctx.globalCompositeOperation = 'destination-in';
      ctx.beginPath();
      this.roundRect(ctx, 0, 0, size, size, radius);
      ctx.fill();
      ctx.globalCompositeOperation = 'source-over';
    }

    // 이모지 그리기
    const fontSize = size * 0.6;
    ctx.font = `${fontSize}px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(this.currentEmoji, size / 2, size / 2);

    const dataUrl = canvas.toDataURL('image/png');

    const cacheKey = `${size}-${this.currentEmoji}-${this.currentBgColor}`;
    this.cache.set(cacheKey, dataUrl);

    return dataUrl;
  }

  roundRect(ctx, x, y, width, height, radius) {
    if (ctx.roundRect) {
      ctx.roundRect(x, y, width, height, radius);
    } else {
      // Polyfill for older browsers
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + width - radius, y);
      ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
      ctx.lineTo(x + width, y + height - radius);
      ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
      ctx.lineTo(x + radius, y + height);
      ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
      ctx.lineTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
      ctx.closePath();
    }
  }

  downloadIcon(size) {
    const format = this.currentFormat;
    const filename = `${this.currentName}-${size}x${size}.${format}`;

    if (format === 'svg') {
      this.downloadSVG(size, filename);
    } else {
      this.downloadPNG(size, filename);
    }
  }

  downloadSVG(size, filename) {
    const radius = size * 0.2;
    const fontSize = size * 0.6;

    const fillAttribute = this.currentBgColor === 'transparent' ? 'fill="none"' : `fill="${this.currentBgColor}"`;

    const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" rx="${radius}" ${fillAttribute}/>
  <text x="${size/2}" y="${size/2}" font-family="Apple Color Emoji, Segoe UI Emoji, Noto Color Emoji, sans-serif"
        font-size="${fontSize}" text-anchor="middle" dominant-baseline="central">${this.currentEmoji}</text>
</svg>`;

    const blob = new Blob([svg], { type: 'image/svg+xml' });
    this.downloadBlob(blob, filename);
  }

  downloadPNG(size, filename) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = size;
    canvas.height = size;

    // 고품질 렌더링
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // 투명 배경이 아닐 때만 배경 그리기
    if (this.currentBgColor !== 'transparent') {
      ctx.fillStyle = this.currentBgColor;
      ctx.fillRect(0, 0, size, size);

      // 둥근 모서리
      const radius = size * 0.2;
      ctx.globalCompositeOperation = 'destination-in';
      ctx.beginPath();
      this.roundRect(ctx, 0, 0, size, size, radius);
      ctx.fill();
      ctx.globalCompositeOperation = 'source-over';
    }

    // 이모지
    const fontSize = size * 0.6;
    ctx.font = `${fontSize}px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(this.currentEmoji, size / 2, size / 2);

    canvas.toBlob((blob) => {
      this.downloadBlob(blob, filename);
    }, 'image/png');
  }

  downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  async downloadAllSizes() {
    // JSZip 라이브러리가 없으므로 간단한 대안 제공
    const sizes = [32, 72, 96, 128, 144, 152, 180, 192, 384, 512];

    // 순차적으로 다운로드 (ZIP 대신)
    for (let i = 0; i < sizes.length; i++) {
      setTimeout(() => {
        this.downloadIcon(sizes[i]);
      }, i * 500); // 500ms 간격으로 다운로드
    }

    // 사용자에게 알림
    this.showNotification('모든 크기의 아이콘이 순차적으로 다운로드됩니다.', 'info');
  }

  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#007bff'};
      color: white;
      padding: 12px 16px;
      border-radius: 4px;
      font-size: 14px;
      z-index: 1001;
      max-width: 300px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, 3000);
  }
}

// 전역 함수들 (HTML에서 호출)
let iconGenerator;

function downloadIcon(size) {
  iconGenerator.downloadIcon(size);
}

function downloadAllSizes() {
  iconGenerator.downloadAllSizes();
}

// 초기화
document.addEventListener('DOMContentLoaded', () => {
  iconGenerator = new IconGeneratorTool();
});
