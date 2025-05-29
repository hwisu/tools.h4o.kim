/**
 * Emoji-based icon generator
 * Dynamically generates PWA icons and favicons using Canvas API
 */

class IconGenerator {
  constructor() {
    this.emoji = '🛠️'; // Default emoji (tools)
    this.backgroundColor = '#333333';
    this.cache = new Map();
  }

  /**
   * Generate icon of specified size
   * @param {number} size - Icon size (pixels)
   * @param {string} emoji - Emoji to use (optional)
   * @param {string} bgColor - Background color (optional)
   * @returns {string} Base64 data URL
   */
  generateIcon(size, emoji = this.emoji, bgColor = this.backgroundColor) {
    const cacheKey = `${size}-${emoji}-${bgColor}`;

    // Return cached icon if available
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = size;
    canvas.height = size;

    // Draw background
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, size, size);

    // Rounded corners (PWA style)
    const radius = size * 0.2; // 20% rounded corners
    ctx.globalCompositeOperation = 'destination-in';
    ctx.beginPath();
    ctx.roundRect(0, 0, size, size, radius);
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over';

    // Draw emoji
    const fontSize = size * 0.6; // 60% of icon size
    ctx.font = `${fontSize}px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Center the emoji
    ctx.fillText(emoji, size / 2, size / 2);

    const dataUrl = canvas.toDataURL('image/png');

    // Save to cache
    this.cache.set(cacheKey, dataUrl);

    return dataUrl;
  }

  /**
   * SVG-based icon generation (smaller file size)
   * @param {number} size - Icon size
   * @param {string} emoji - Emoji to use
   * @param {string} bgColor - Background color
   * @returns {string} Base64 encoded SVG data URL
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
   * Generate all icon sizes needed for PWA
   * @param {string} emoji - Emoji to use
   * @returns {Object} Icon information object
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
   * Generate favicons (multiple sizes)
   * @param {string} emoji - Emoji to use
   * @returns {Object} Favicon information
   */
  generateFavicons(emoji = this.emoji) {
    return {
      ico: this.generateIcon(32, emoji), // Default favicon
      svg: this.generateSVGIcon(32, emoji), // SVG favicon
      apple: this.generateIcon(180, emoji), // Apple Touch Icon
      manifest: this.generateIcon(192, emoji) // For manifest
    };
  }

  /**
   * Return custom emoji for each tool
   * @param {string} toolName - Tool name
   * @returns {string} Emoji for the tool
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
    };

    return toolEmojis[toolName] || this.emoji;
  }

  /**
   * Generate and apply icons to DOM in real-time
   * @param {string} toolName - Tool name (optional)
   */
  applyDynamicIcons(toolName = null) {
    const emoji = toolName ? this.getToolEmoji(toolName) : this.emoji;

    // Update favicon
    this.updateFavicon(emoji);

    // Update Apple Touch Icon
    this.updateAppleTouchIcon(emoji);

    // Update manifest icons (difficult to do dynamically, so just log)
    console.log(`PWA: Generated icons for ${toolName || 'home'} with emoji ${emoji}`);
  }

  /**
   * Dynamic favicon update
   * @param {string} emoji - Emoji to use
   */
  updateFavicon(emoji) {
    // Remove existing favicon
    const existingFavicon = document.querySelector('link[rel="icon"]');
    if (existingFavicon) {
      existingFavicon.remove();
    }

    // Generate and apply new favicon
    const favicon = document.createElement('link');
    favicon.rel = 'icon';
    favicon.type = 'image/svg+xml';
    favicon.href = this.generateSVGIcon(32, emoji);

    document.head.appendChild(favicon);
  }

  /**
   * Apple Touch Icon dynamic update
   * @param {string} emoji - Emoji to use
   */
  updateAppleTouchIcon(emoji) {
    // Remove existing Apple Touch Icon
    const existingAppleIcon = document.querySelector('link[rel="apple-touch-icon"]');
    if (existingAppleIcon) {
      existingAppleIcon.remove();
    }

    // Generate and apply new Apple Touch Icon
    const appleIcon = document.createElement('link');
    appleIcon.rel = 'apple-touch-icon';
    appleIcon.href = this.generateIcon(180, emoji);

    document.head.appendChild(appleIcon);
  }

  /**
   * Clear cache
   */
  clearCache() {
    this.cache.clear();
  }

  /**
   * Icon download feature
   * @param {number} size - Icon size
   * @param {string} emoji - Emoji
   * @param {string} filename - File name
   */
  downloadIcon(size, emoji = this.emoji, filename = `icon-${size}x${size}.png`) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = size;
    canvas.height = size;

    // High quality rendering settings
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Draw background
    ctx.fillStyle = this.backgroundColor;
    ctx.fillRect(0, 0, size, size);

    // Rounded corners
    const radius = size * 0.2;
    ctx.globalCompositeOperation = 'destination-in';
    ctx.beginPath();
    ctx.roundRect(0, 0, size, size, radius);
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over';

    // Draw emoji
    const fontSize = size * 0.6;
    ctx.font = `${fontSize}px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(emoji, size / 2, size / 2);

    // Download
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

// Global icon generator instance
const iconGenerator = new IconGenerator();

// Canvas roundRect polyfill (old browser support)
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
