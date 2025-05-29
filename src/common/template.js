import { commonStyles } from './styles.js';
import { getToolScript } from './script-bundle.js';

/**
 * HTML 템플릿에 공통 스타일과 스크립트를 주입합니다
 * @param {string} htmlTemplate - 플레이스홀더가 포함된 HTML 템플릿
 * @param {string} toolName - 도구 이름 (스크립트 주입용)
 * @returns {string} 처리된 HTML
 */
export function processTemplate(htmlTemplate, toolName) {
  let processedHtml = htmlTemplate;

  // PWA Meta Tags injection - add to <head> tag
  const pwaMetaTags = `
    <!-- PWA Meta Tags -->
    <meta name="theme-color" content="#333333">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="default">
    <meta name="apple-mobile-web-app-title" content="tools.h4o.kim">
    <meta name="application-name" content="tools.h4o.kim">
    <meta name="msapplication-TileColor" content="#333333">
    <meta name="msapplication-config" content="none">

    <!-- PWA Manifest -->
    <link rel="manifest" href="/manifest.json">

    <!-- Dynamic Icons (will be replaced by JavaScript) -->
    <link rel="apple-touch-icon" href="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgwIiBoZWlnaHQ9IjE4MCIgdmlld0JveD0iMCAwIDE4MCAxODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxODAiIGhlaWdodD0iMTgwIiByeD0iMzYiIGZpbGw9IiMzMzMzMzMiLz4KPHRleHQgeD0iOTAiIHk9IjkwIiBmb250LWZhbWlseT0iQXBwbGUgQ29sb3IgRW1vamksIFNlZ29lIFVJIEVtb2ppLCBOb3RvIENvbG9yIEVtb2ppLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEwOCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9ImNlbnRyYWwiPvCfm6Dwn4+3PC90ZXh0Pgo8L3N2Zz4K">

    <!-- Favicon (will be replaced by JavaScript) -->
    <link rel="icon" type="image/svg+xml" href="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiByeD0iNiIgZmlsbD0iIzMzMzMzMyIvPgo8dGV4dCB4PSIxNiIgeT0iMTYiIGZvbnQtZmFtaWx5PSJBcHBsZSBDb2xvciBFbW9qaSwgU2Vnb2UgVUkgRW1vamksIE5vdG8gQ29sb3IgRW1vamksIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJjZW50cmFsIj7wn5ug8J+PtzwvdGV4dD4KPC9zdmc+Cg==">
  `;

  // <head> tag after PWA Meta Tags
  processedHtml = processedHtml.replace(
    /<head>/i,
    `<head>${pwaMetaTags}`
  );

  // Style injection
  processedHtml = processedHtml.replace('/* {{COMMON_STYLES}} */', commonStyles);

  // PWA basic script addition
  const pwaScript = `
    // Icon generator class
    class IconGenerator {
      constructor() {
        this.emoji = '🛠️';
        this.backgroundColor = '#333333';
        this.cache = new Map();
      }

      generateSVGIcon(size, emoji = this.emoji, bgColor = this.backgroundColor) {
        const cacheKey = \`svg-\${size}-\${emoji}-\${bgColor}\`;

        if (this.cache.has(cacheKey)) {
          return this.cache.get(cacheKey);
        }

        const radius = size * 0.2;
        const fontSize = size * 0.6;

        const svg = \`
          <svg width="\${size}" height="\${size}" viewBox="0 0 \${size} \${size}" xmlns="http://www.w3.org/2000/svg">
            <rect width="\${size}" height="\${size}" rx="\${radius}" fill="\${bgColor}"/>
            <text x="\${size/2}" y="\${size/2}" font-family="Apple Color Emoji, Segoe UI Emoji, Noto Color Emoji, sans-serif"
                  font-size="\${fontSize}" text-anchor="middle" dominant-baseline="central">\${emoji}</text>
          </svg>
        \`;

        const dataUrl = \`data:image/svg+xml;base64,\${btoa(unescape(encodeURIComponent(svg)))}\`;

        this.cache.set(cacheKey, dataUrl);
        return dataUrl;
      }

      getToolEmoji(toolName) {
        const toolEmojis = {
          'json': '📋', 'tcount': '🔢', 'url': '🔗', 'diff': '📝',
          'base64': '🔐', 'sql': '🗃️', 'hash': '#️⃣', 'qr': '📱',
          'tz': '🌍', 'image': '🖼️', 'pwd': '🔑', 'unit': '📏', 'cron': '⏰'
        };
        return toolEmojis[toolName] || this.emoji;
      }

      applyDynamicIcons(toolName = null) {
        const emoji = toolName ? this.getToolEmoji(toolName) : this.emoji;
        this.updateFavicon(emoji);
        this.updateAppleTouchIcon(emoji);
        console.log(\`PWA: Generated icons for \${toolName || 'home'} with emoji \${emoji}\`);
      }

      updateFavicon(emoji) {
        const existingFavicon = document.querySelector('link[rel="icon"]');
        if (existingFavicon) existingFavicon.remove();

        const favicon = document.createElement('link');
        favicon.rel = 'icon';
        favicon.type = 'image/svg+xml';
        favicon.href = this.generateSVGIcon(32, emoji);
        document.head.appendChild(favicon);
      }

      updateAppleTouchIcon(emoji) {
        const existingAppleIcon = document.querySelector('link[rel="apple-touch-icon"]');
        if (existingAppleIcon) existingAppleIcon.remove();

        const appleIcon = document.createElement('link');
        appleIcon.rel = 'apple-touch-icon';
        appleIcon.href = this.generateSVGIcon(180, emoji);
        document.head.appendChild(appleIcon);
      }
    }

    // PWA basic functionality
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', async () => {
        try {
          const registration = await navigator.serviceWorker.register('/sw.js');
          console.log('PWA: Service worker registered for ${toolName}');

          // Update check
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New version notification
                const notification = document.createElement('div');
                notification.innerHTML = \`
                  <div style="margin-bottom: 8px;">New version is available</div>
                  <button onclick="window.location.reload()" style="
                    background: white; color: #2196F3; border: none;
                    padding: 4px 8px; border-radius: 3px; font-size: 12px; cursor: pointer;
                  ">Update</button>
                \`;
                notification.style.cssText = \`
                  position: fixed; top: 20px; right: 20px; background: #2196F3; color: white;
                  padding: 12px 16px; border-radius: 4px; font-size: 14px; z-index: 1001;
                  max-width: 300px; box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                \`;
                document.body.appendChild(notification);
              }
            });
          });
        } catch (error) {
          console.error('PWA: Service worker registration failed:', error);
        }
      });
    }

    // Icon generator initialization and application
    const iconGenerator = new IconGenerator();
    iconGenerator.applyDynamicIcons('${toolName}');

    // Add individual page save button
    function addSavePageButton() {
      // Don't add if button already exists
      if (document.getElementById('savePageBtn')) return;

      const saveBtn = document.createElement('button');
      saveBtn.id = 'savePageBtn';
      saveBtn.innerHTML = '📱 Install';
      saveBtn.title = 'Install this page as PWA';
      saveBtn.style.cssText = \`
        position: fixed; top: 20px; right: 20px; background: #333; color: white;
        border: none; padding: 8px 12px; border-radius: 20px; font-size: 12px;
        cursor: pointer; z-index: 1000; box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      \`;
      saveBtn.addEventListener('mouseover', () => saveBtn.style.background = '#555');
      saveBtn.addEventListener('mouseout', () => saveBtn.style.background = '#333');

      saveBtn.addEventListener('click', () => {
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        const isAndroid = /Android/.test(navigator.userAgent);

        let instructions = '';
        if (isIOS) {
          instructions = '📱 Safari: Tap Share button → Select "Add to Home Screen"';
        } else if (isAndroid) {
          instructions = '📱 Chrome: Tap Menu (⋮) → Select "Add to Home Screen"';
        } else {
          instructions = '💻 Click the install icon next to the address bar or select "Install App" from the menu';
        }

        showNotification(instructions, 'info', 8000);
      });

      document.body.appendChild(saveBtn);
    }

    // Notification display function
    function showNotification(message, type = 'info', duration = 5000) {
      const notification = document.createElement('div');
      notification.textContent = message;
      notification.style.cssText = \`
        position: fixed; top: 20px; right: 20px;
        background: \${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white; padding: 12px 16px; border-radius: 4px; font-size: 14px;
        z-index: 1001; max-width: 300px; box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        line-height: 1.4;
      \`;

      document.body.appendChild(notification);
      setTimeout(() => notification.remove(), duration);
    }

    // Online/offline status display
    let statusTimeout;
    const showNetworkStatus = (isOnline) => {
      clearTimeout(statusTimeout);

      let statusEl = document.getElementById('networkStatus');
      if (!statusEl) {
        statusEl = document.createElement('div');
        statusEl.id = 'networkStatus';
        statusEl.style.cssText = \`
          position: fixed; bottom: 20px; left: 20px; padding: 8px 12px;
          border-radius: 20px; font-size: 12px; z-index: 1000;
          transition: all 0.3s ease;
        \`;
        document.body.appendChild(statusEl);
      }

      if (isOnline) {
        statusEl.textContent = '🟢 Online';
        statusEl.style.background = 'rgba(76, 175, 80, 0.9)';
        statusEl.style.color = 'white';
        statusEl.style.display = 'block';

        statusTimeout = setTimeout(() => {
          statusEl.style.display = 'none';
        }, 3000);
      } else {
        statusEl.textContent = '🔴 Offline';
        statusEl.style.background = 'rgba(244, 67, 54, 0.9)';
        statusEl.style.color = 'white';
        statusEl.style.display = 'block';
      }
    };

    window.addEventListener('online', () => showNetworkStatus(true));
    window.addEventListener('offline', () => showNetworkStatus(false));

    // DOM load after save button addition
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', addSavePageButton);
    } else {
      addSavePageButton();
    }
  `;

  // Script injection - replace <script src="./script.js"></script> with actual script
  const toolScript = getToolScript(toolName);
  if (toolScript) {
    processedHtml = processedHtml.replace(
      /<script src="\.\/script\.js"><\/script>/g,
      `<script>${pwaScript}</script><script>${toolScript}</script>`
    );
  } else {
    // PWA script addition even if tool script is missing
    processedHtml = processedHtml.replace(
      /<\/body>/i,
      `<script>${pwaScript}</script></body>`
    );
  }

  return processedHtml;
}

/**
 * HTML 파일을 읽어서 스타일과 스크립트를 주입하고 Response를 반환합니다
 * @param {string} htmlContent - HTML 파일 내용
 * @param {string} toolName - 도구 이름
 * @returns {Response} 처리된 HTML Response
 */
export function createHtmlResponse(htmlContent, toolName) {
  const processedHtml = processTemplate(htmlContent, toolName);
  return new Response(processedHtml, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  });
}

/**
 * Legacy support: inject styles only (backward compatibility)
 * @param {string} htmlTemplate - {{COMMON_STYLES}} 플레이스홀더가 포함된 HTML 템플릿
 * @returns {string} 스타일이 주입된 HTML
 */
export function injectStyles(htmlTemplate) {
  return htmlTemplate.replace('{{COMMON_STYLES}}', commonStyles);
}
