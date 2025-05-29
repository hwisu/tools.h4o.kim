/**
 * 이모지 기반 아이콘 생성기
 * Canvas API를 사용하여 PWA 아이콘과 파비콘을 동적으로 생성
 */

class IconGenerator {
  constructor() {
    this.emoji = '🛠️'; // 기본 이모지 (도구)
    this.backgroundColor = '#333333';
    this.cache = new Map();
  }

  /**
   * 지정된 크기의 아이콘을 생성합니다
   * @param {number} size - 아이콘 크기 (픽셀)
   * @param {string} emoji - 사용할 이모지 (선택사항)
   * @param {string} bgColor - 배경색 (선택사항)
   * @returns {string} Base64 데이터 URL
   */
  generateIcon(size, emoji = this.emoji, bgColor = this.backgroundColor) {
    const cacheKey = `${size}-${emoji}-${bgColor}`;

    // 캐시된 아이콘이 있으면 반환
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = size;
    canvas.height = size;

    // 배경 그리기
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, size, size);

    // 둥근 모서리 (PWA 스타일)
    const radius = size * 0.2; // 20% 둥근 모서리
    ctx.globalCompositeOperation = 'destination-in';
    ctx.beginPath();
    ctx.roundRect(0, 0, size, size, radius);
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over';

    // 이모지 그리기
    const fontSize = size * 0.6; // 아이콘 크기의 60%
    ctx.font = `${fontSize}px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // 이모지를 중앙에 배치
    ctx.fillText(emoji, size / 2, size / 2);

    const dataUrl = canvas.toDataURL('image/png');

    // 캐시에 저장
    this.cache.set(cacheKey, dataUrl);

    return dataUrl;
  }

  /**
   * SVG 기반 아이콘 생성 (더 작은 파일 크기)
   * @param {number} size - 아이콘 크기
   * @param {string} emoji - 사용할 이모지
   * @param {string} bgColor - 배경색
   * @returns {string} Base64 인코딩된 SVG 데이터 URL
   */
  generateSVGIcon(size, emoji = this.emoji, bgColor = this.backgroundColor) {
    const cacheKey = `svg-${size}-${emoji}-${bgColor}`;

    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    const radius = size * 0.2;
    const fontSize = size * 0.6;

    const svg = `
      <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
        <rect width="${size}" height="${size}" rx="${radius}" fill="${bgColor}"/>
        <text x="${size/2}" y="${size/2}" font-family="Apple Color Emoji, Segoe UI Emoji, Noto Color Emoji, sans-serif"
              font-size="${fontSize}" text-anchor="middle" dominant-baseline="central">${emoji}</text>
      </svg>
    `;

    const dataUrl = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;

    this.cache.set(cacheKey, dataUrl);

    return dataUrl;
  }

  /**
   * PWA에 필요한 모든 아이콘 크기를 생성합니다
   * @param {string} emoji - 사용할 이모지
   * @returns {Object} 아이콘 정보 객체
   */
  generatePWAIcons(emoji = this.emoji) {
    const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
    const icons = [];

    sizes.forEach(size => {
      const icon = {
        src: this.generateSVGIcon(size, emoji),
        sizes: `${size}x${size}`,
        type: 'image/svg+xml',
        purpose: 'any maskable'
      };
      icons.push(icon);
    });

    return icons;
  }

  /**
   * 파비콘 생성 (여러 크기)
   * @param {string} emoji - 사용할 이모지
   * @returns {Object} 파비콘 정보
   */
  generateFavicons(emoji = this.emoji) {
    return {
      ico: this.generateIcon(32, emoji), // 기본 파비콘
      svg: this.generateSVGIcon(32, emoji), // SVG 파비콘
      apple: this.generateIcon(180, emoji), // Apple Touch Icon
      manifest: this.generateIcon(192, emoji) // 매니페스트용
    };
  }

  /**
   * 도구별 맞춤 이모지 반환
   * @param {string} toolName - 도구 이름
   * @returns {string} 해당 도구의 이모지
   */
  getToolEmoji(toolName) {
    const toolEmojis = {
      'json': '📋',
      'json-formatter': '📋',
      'text-counter': '🔢',
      'tcount': '🔢',
      'url-encoder': '🔗',
      'url': '🔗',
      'text-diff': '📝',
      'diff': '📝',
      'base64-converter': '🔐',
      'base64': '🔐',
      'sql-formatter': '🗃️',
      'sql': '🗃️',
      'hash-generator': '#️⃣',
      'hash': '#️⃣',
      'qr-generator': '📱',
      'qr': '📱',
      'timezone-converter': '🌍',
      'tz': '🌍',
      'image-converter': '🖼️',
      'image': '🖼️',
      'password-generator': '🔑',
      'pwd': '🔑',
      'unit-converter': '📏',
      'unit': '📏',
      'cron-builder': '⏰',
      'cron': '⏰',
      'icon-generator': '🎨',
      'icons': '🎨'
    };

    return toolEmojis[toolName] || this.emoji;
  }

  /**
   * 실시간으로 아이콘을 생성하고 DOM에 적용
   * @param {string} toolName - 도구 이름 (선택사항)
   */
  applyDynamicIcons(toolName = null) {
    const emoji = toolName ? this.getToolEmoji(toolName) : this.emoji;

    // 파비콘 업데이트
    this.updateFavicon(emoji);

    // Apple Touch Icon 업데이트
    this.updateAppleTouchIcon(emoji);

    // 매니페스트 아이콘 업데이트 (동적으로는 어려우므로 로그만)
    console.log(`PWA: Generated icons for ${toolName || 'home'} with emoji ${emoji}`);
  }

  /**
   * 파비콘 동적 업데이트
   * @param {string} emoji - 사용할 이모지
   */
  updateFavicon(emoji) {
    // 기존 파비콘 제거
    const existingFavicon = document.querySelector('link[rel="icon"]');
    if (existingFavicon) {
      existingFavicon.remove();
    }

    // 새 파비콘 생성 및 적용
    const favicon = document.createElement('link');
    favicon.rel = 'icon';
    favicon.type = 'image/svg+xml';
    favicon.href = this.generateSVGIcon(32, emoji);

    document.head.appendChild(favicon);
  }

  /**
   * Apple Touch Icon 동적 업데이트
   * @param {string} emoji - 사용할 이모지
   */
  updateAppleTouchIcon(emoji) {
    // 기존 Apple Touch Icon 제거
    const existingAppleIcon = document.querySelector('link[rel="apple-touch-icon"]');
    if (existingAppleIcon) {
      existingAppleIcon.remove();
    }

    // 새 Apple Touch Icon 생성 및 적용
    const appleIcon = document.createElement('link');
    appleIcon.rel = 'apple-touch-icon';
    appleIcon.href = this.generateIcon(180, emoji);

    document.head.appendChild(appleIcon);
  }

  /**
   * 캐시 클리어
   */
  clearCache() {
    this.cache.clear();
  }

  /**
   * 아이콘 다운로드 기능
   * @param {number} size - 아이콘 크기
   * @param {string} emoji - 이모지
   * @param {string} filename - 파일명
   */
  downloadIcon(size, emoji = this.emoji, filename = `icon-${size}x${size}.png`) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = size;
    canvas.height = size;

    // 고품질 렌더링 설정
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // 배경 그리기
    ctx.fillStyle = this.backgroundColor;
    ctx.fillRect(0, 0, size, size);

    // 둥근 모서리
    const radius = size * 0.2;
    ctx.globalCompositeOperation = 'destination-in';
    ctx.beginPath();
    ctx.roundRect(0, 0, size, size, radius);
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over';

    // 이모지 그리기
    const fontSize = size * 0.6;
    ctx.font = `${fontSize}px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(emoji, size / 2, size / 2);

    // 다운로드
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 'image/png');
  }
}

// 전역 아이콘 생성기 인스턴스
const iconGenerator = new IconGenerator();

// Canvas roundRect polyfill (구형 브라우저 지원)
if (!CanvasRenderingContext2D.prototype.roundRect) {
  CanvasRenderingContext2D.prototype.roundRect = function(x, y, width, height, radius) {
    this.beginPath();
    this.moveTo(x + radius, y);
    this.lineTo(x + width - radius, y);
    this.quadraticCurveTo(x + width, y, x + width, y + radius);
    this.lineTo(x + width, y + height - radius);
    this.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    this.lineTo(x + radius, y + height);
    this.quadraticCurveTo(x, y + height, x, y + height - radius);
    this.lineTo(x, y + radius);
    this.quadraticCurveTo(x, y, x + radius, y);
    this.closePath();
  };
}

export { IconGenerator, iconGenerator };
