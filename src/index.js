/**
 * Tools Platform - 유용한 웹 도구 모음
 * 모든 처리는 클라이언트 사이드에서 수행 (Workers 무료 티어 CPU 제한 고려)
 */

// 통합 도구 핸들러 임포트
import { handleTool } from './common/tool-handler.js';
import { commonStyles } from './common/styles.js';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // CORS 헤더 설정
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    // OPTIONS 요청 처리 (CORS preflight)
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: corsHeaders,
      });
    }

    try {
      // PWA 관련 파일 라우팅
      if (url.pathname === '/manifest.json') {
        return handleManifest();
      }

      if (url.pathname === '/sw.js') {
        return handleServiceWorker();
      }

      // 라우팅 - 동적 도구 처리
      if (url.pathname === '/') {
        return handleHome();
      }

      if (url.pathname === '/api/status') {
        return handleStatus();
      }

      // 도구 라우팅 - /tools/{tool-name} 패턴
      const toolMatch = url.pathname.match(/^\/([a-z0-9-]+)$/);
      if (toolMatch) {
        const toolName = toolMatch[1];
        console.log('toolName', toolName);
        return handleTool(toolName);
      }

      // 404 처리
      return new Response('Not Found', {
        status: 404,
        headers: corsHeaders
      });
    } catch (error) {
      return new Response('Internal Server Error', {
        status: 500,
        headers: corsHeaders
      });
    }
  },
};

/**
 * 메인 홈페이지
 */
function handleHome() {
  const html = `
    <!DOCTYPE html>
    <html lang="ko">
    <head>
      <title>tools.h4o.kim</title>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">

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

      <!-- Apple Touch Icons -->
      <link rel="apple-touch-icon" href="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgwIiBoZWlnaHQ9IjE4MCIgdmlld0JveD0iMCAwIDE4MCAxODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxODAiIGhlaWdodD0iMTgwIiByeD0iMzYiIGZpbGw9IiMzMzMzMzMiLz4KPHRleHQgeD0iOTAiIHk9IjkwIiBmb250LWZhbWlseT0iQXBwbGUgQ29sb3IgRW1vamksIFNlZ29lIFVJIEVtb2ppLCBOb3RvIENvbG9yIEVtb2ppLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEwOCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9ImNlbnRyYWwiPvCfm6Dwn4+3PC90ZXh0Pgo8L3N2Zz4K">

      <!-- Favicon -->
      <link rel="icon" type="image/svg+xml" href="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiByeD0iNiIgZmlsbD0iIzMzMzMzMyIvPgo8dGV4dCB4PSIxNiIgeT0iMTYiIGZvbnQtZmFtaWx5PSJBcHBsZSBDb2xvciBFbW9qaSwgU2Vnb2UgVUkgRW1vamksIE5vdG8gQ29sb3IgRW1vamksIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJjZW50cmFsIj7wn5ug8J+PtzwvdGV4dD4KPC9zdmc+Cg==">

      <style>
        ${commonStyles}
        .search-container {
          margin-bottom: 2rem;
        }
        .search-input {
          width: 100%;
          padding: 0.75rem;
          font-size: 1rem;
          border: 1px solid #ccc;
          border-radius: 3px;
          font-family: inherit;
        }
        .search-input:focus {
          outline: none;
          border-color: #666;
          box-shadow: 0 0 3px rgba(0,0,0,0.1);
        }
        .category {
          margin-bottom: 2rem;
        }
        .category-title {
          font-size: 1.3rem;
          font-weight: normal;
          margin-bottom: 1rem;
          color: #333;
          border-bottom: 1px solid #ddd;
          padding-bottom: 0.5rem;
        }
        .tool-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .tool-item {
          margin-bottom: 0.5rem;
          padding-left: 1rem;
        }
        .tool-item::before {
          content: "- ";
          margin-left: -1rem;
          color: #666;
        }
        .tool-link {
          color: #333;
          text-decoration: none;
          font-weight: 500;
        }
        .tool-link:hover {
          text-decoration: underline;
        }
        .tool-description {
          color: #666;
          font-weight: normal;
        }
        .hidden {
          display: none;
        }

        /* PWA 상태 표시 */
        .pwa-status {
          position: fixed;
          bottom: 20px;
          left: 20px;
          background: rgba(0,0,0,0.8);
          color: white;
          padding: 8px 12px;
          border-radius: 20px;
          font-size: 12px;
          z-index: 1000;
          display: none;
        }
        .pwa-status.online { background: rgba(76, 175, 80, 0.9); }
        .pwa-status.offline { background: rgba(244, 67, 54, 0.9); }

        /* 개별 페이지 저장 버튼 */
        .save-page-btn {
          position: fixed;
          top: 20px;
          right: 20px;
          background: #333;
          color: white;
          border: none;
          padding: 8px 12px;
          border-radius: 20px;
          font-size: 12px;
          cursor: pointer;
          z-index: 1000;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        }
        .save-page-btn:hover {
          background: #555;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>tools.h4o.kim</h1>
        <p>Miscellaneous web tools for daily use</p>
      </div>

      <!-- 개별 페이지 저장 버튼 -->
      <button id="savePageBtn" class="save-page-btn" title="Install this page as PWA">📱 Install</button>

      <div class="search-container">
        <input type="text" id="searchInput" class="search-input" placeholder="Search tools..." autofocus>
      </div>

      <div class="category" data-category="text">
        <h2 class="category-title">Text Tools</h2>
        <ul class="tool-list">
          <li class="tool-item" data-keywords="text counter character word line count">
            <a href="/tcount" class="tool-link">Text Counter</a>
            <span class="tool-description"> : Count characters, words, and lines in real-time</span>
          </li>
          <li class="tool-item" data-keywords="url encoder decoder encode decode uri">
            <a href="/url" class="tool-link">URL Encoder/Decoder</a>
            <span class="tool-description"> : Safely encode and decode URLs</span>
          </li>
          <li class="tool-item" data-keywords="text diff compare difference">
            <a href="/diff" class="tool-link">Text Diff</a>
            <span class="tool-description"> : Compare two text strings and highlight differences</span>
          </li>
        </ul>
      </div>

      <div class="category" data-category="developer">
        <h2 class="category-title">Developer Tools</h2>
        <ul class="tool-list">
          <li class="tool-item" data-keywords="json formatter pretty print validate minify">
            <a href="/json" class="tool-link">JSON Formatter</a>
            <span class="tool-description"> : Format, validate, and minify JSON</span>
          </li>
          <li class="tool-item" data-keywords="base64 encoder decoder encode decode">
            <a href="/base64" class="tool-link">Base64 Converter</a>
            <span class="tool-description"> : Encode and decode Base64 strings</span>
          </li>
          <li class="tool-item" data-keywords="sql formatter prettify query">
            <a href="/sql" class="tool-link">SQL Formatter</a>
            <span class="tool-description"> : Format and prettify SQL queries</span>
          </li>

          <li class="tool-item" data-keywords="hash generator md5 sha1 sha256">
            <a href="/hash" class="tool-link">Hash Generator</a>
            <span class="tool-description"> : Generate MD5, SHA1, SHA256 hashes from text or files</span>
          </li>
        </ul>
      </div>

      <div class="category" data-category="utility">
        <h2 class="category-title">Utility Tools</h2>
        <ul class="tool-list">
          <li class="tool-item" data-keywords="qr code generator qrcode">
            <a href="/qr" class="tool-link">QR Code Generator</a>
            <span class="tool-description"> : Generate QR codes from text or URLs</span>
          </li>
          <li class="tool-item" data-keywords="timezone converter time zone timestamp unix universal">
            <a href="/tz" class="tool-link">Universal Time Converter</a>
            <span class="tool-description"> : Convert between timezones, timestamps, and various time formats</span>
          </li>
          <li class="tool-item" data-keywords="image converter format resize">
            <a href="/image" class="tool-link">Image Converter</a>
            <span class="tool-description"> : Convert image format and resize images</span>
          </li>
          <li class="tool-item" data-keywords="password generator secure">
            <a href="/pwd" class="tool-link">Password Generator</a>
            <span class="tool-description"> : Generate secure passwords with customizable options</span>
          </li>
          <li class="tool-item" data-keywords="unit converter measurement length weight temperature">
            <a href="/unit" class="tool-link">Unit Converter</a>
            <span class="tool-description"> : Convert between different units of measurement</span>
          </li>
          <li class="tool-item" data-keywords="cron expression builder scheduler">
            <a href="/cron" class="tool-link">Cron Builder</a>
            <span class="tool-description"> : Build and validate cron expressions with visual interface</span>
          </li>
        </ul>
      </div>

      <!-- PWA 상태 표시 -->
      <div id="pwaStatus" class="pwa-status"></div>

      <script>
        // 아이콘 생성기 임포트 (인라인)
        ${getIconGeneratorScript()}

        // PWA 기능 초기화
        class SimplePWAManager {
          constructor() {
            this.iconGenerator = new IconGenerator();
            this.init();
          }

          async init() {
            await this.registerServiceWorker();
            this.setupInstallPrompt();
            this.setupOnlineStatus();
            this.setupPageSave();
            this.applyDynamicIcons();
          }

          applyDynamicIcons() {
            // 홈페이지용 동적 아이콘 적용
            this.iconGenerator.applyDynamicIcons();
          }

          async registerServiceWorker() {
            if ('serviceWorker' in navigator) {
              try {
                const registration = await navigator.serviceWorker.register('/sw.js');
                console.log('PWA: Service worker registered');

                registration.addEventListener('updatefound', () => {
                  const newWorker = registration.installing;
                  newWorker.addEventListener('statechange', () => {
                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                      this.showUpdateNotification();
                    }
                  });
                });
              } catch (error) {
                console.error('PWA: Service worker registration failed:', error);
              }
            }
          }

          setupPageSave() {
            const saveBtn = document.getElementById('savePageBtn');
            saveBtn.addEventListener('click', () => {
              this.saveCurrentPage();
            });
          }

          saveCurrentPage() {
            // 현재 페이지를 개별 PWA로 저장하는 기능
            if ('serviceWorker' in navigator) {
              // 브라우저의 설치 프롬프트 트리거
              if (this.deferredPrompt) {
                this.deferredPrompt.prompt();
              } else {
                this.showManualInstallInstructions();
              }
            } else {
              this.showNotification('이 브라우저는 PWA를 지원하지 않습니다', 'error');
            }
          }

          showManualInstallInstructions() {
            const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
            const isAndroid = /Android/.test(navigator.userAgent);

            let instructions = '';
            if (isIOS) {
              instructions = '📱 Safari에서: 공유 버튼 → "홈 화면에 추가"를 선택하세요';
            } else if (isAndroid) {
              instructions = '📱 Chrome에서: 메뉴(⋮) → "홈 화면에 추가"를 선택하세요';
            } else {
              instructions = '💻 브라우저 주소창 옆의 설치 아이콘을 클릭하거나 메뉴에서 "앱 설치"를 선택하세요';
            }

            this.showNotification(instructions, 'info', 8000);
          }

          setupInstallPrompt() {
            let deferredPrompt;

            window.addEventListener('beforeinstallprompt', (e) => {
              e.preventDefault();
              deferredPrompt = e;
              this.deferredPrompt = deferredPrompt;
              this.showInstallButton(deferredPrompt);
            });

            window.addEventListener('appinstalled', () => {
              this.hideInstallButton();
              this.showNotification('앱이 설치되었습니다! 🎉', 'success');
            });
          }

          setupOnlineStatus() {
            const statusEl = document.getElementById('pwaStatus');

            const updateStatus = () => {
              if (navigator.onLine) {
                statusEl.textContent = '🟢 온라인';
                statusEl.className = 'pwa-status online';
              } else {
                statusEl.textContent = '🔴 오프라인';
                statusEl.className = 'pwa-status offline';
              }
              statusEl.style.display = 'block';

              setTimeout(() => {
                if (navigator.onLine) {
                  statusEl.style.display = 'none';
                }
              }, 3000);
            };

            window.addEventListener('online', updateStatus);
            window.addEventListener('offline', updateStatus);
          }

          showInstallButton(deferredPrompt) {
            if (document.getElementById('installBtn')) return;

            const button = document.createElement('button');
            button.id = 'installBtn';
            button.innerHTML = '📱 앱 설치';
            button.style.cssText = \`
              position: fixed;
              bottom: 20px;
              right: 20px;
              background: #333;
              color: white;
              border: none;
              padding: 12px 16px;
              border-radius: 25px;
              font-size: 14px;
              cursor: pointer;
              box-shadow: 0 4px 12px rgba(0,0,0,0.3);
              z-index: 1000;
            \`;

            button.onclick = async () => {
              if (deferredPrompt) {
                deferredPrompt.prompt();
                const { outcome } = await deferredPrompt.userChoice;
                console.log('Install prompt result:', outcome);
                deferredPrompt = null;
              }
            };

            document.body.appendChild(button);
          }

          hideInstallButton() {
            const button = document.getElementById('installBtn');
            if (button) button.remove();
          }

          showUpdateNotification() {
            const notification = document.createElement('div');
            notification.innerHTML = \`
              <div style="margin-bottom: 8px;">새 버전이 사용 가능합니다</div>
              <button onclick="window.location.reload()" style="
                background: white;
                color: #2196F3;
                border: none;
                padding: 4px 8px;
                border-radius: 3px;
                font-size: 12px;
                cursor: pointer;
              ">업데이트</button>
            \`;

            notification.style.cssText = \`
              position: fixed;
              top: 20px;
              right: 20px;
              background: #2196F3;
              color: white;
              padding: 12px 16px;
              border-radius: 4px;
              font-size: 14px;
              z-index: 1001;
              max-width: 300px;
              box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            \`;

            document.body.appendChild(notification);
          }

          showNotification(message, type = 'info', duration = 5000) {
            const notification = document.createElement('div');
            notification.textContent = message;
            notification.style.cssText = \`
              position: fixed;
              top: 20px;
              right: 20px;
              background: \${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
              color: white;
              padding: 12px 16px;
              border-radius: 4px;
              font-size: 14px;
              z-index: 1001;
              max-width: 300px;
              box-shadow: 0 4px 12px rgba(0,0,0,0.3);
              line-height: 1.4;
            \`;

            document.body.appendChild(notification);

            setTimeout(() => {
              notification.remove();
            }, duration);
          }
        }

        // PWA 매니저 초기화
        new SimplePWAManager();

        // 검색 기능
        const searchInput = document.getElementById('searchInput');
        const toolItems = document.querySelectorAll('.tool-item');
        const categories = document.querySelectorAll('.category');

        searchInput.addEventListener('input', function() {
          const query = this.value.toLowerCase();

          if (!query) {
            // 검색어가 없으면 모든 항목 표시
            toolItems.forEach(item => item.classList.remove('hidden'));
            categories.forEach(category => category.classList.remove('hidden'));
            return;
          }

          let hasVisibleItems = {};

          toolItems.forEach(item => {
            const keywords = item.dataset.keywords || '';
            const text = item.textContent.toLowerCase();
            const matches = keywords.includes(query) || text.includes(query);

            item.classList.toggle('hidden', !matches);

            // 카테고리별 가시성 추적
            const category = item.closest('.category');
            const categoryName = category.dataset.category;
            if (matches) {
              hasVisibleItems[categoryName] = true;
            }
          });

          // 빈 카테고리 숨기기
          categories.forEach(category => {
            const categoryName = category.dataset.category;
            category.classList.toggle('hidden', !hasVisibleItems[categoryName]);
          });
        });
      </script>
    </body>
    </html>
  `;

  return new Response(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=300'
    }
  });
}

/**
 * 상태 확인 API
 */
function handleStatus() {
  return Response.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    tools: 12
  });
}

/**
 * PWA Manifest 파일 제공
 */
function handleManifest() {
  const manifest = {
    "name": "tools.h4o.kim",
    "short_name": "tools",
    "description": "Miscellaneous web tools for daily use - JSON formatter, text counter, image converter, and more",
    "start_url": "/",
    "display": "standalone",
    "background_color": "#ffffff",
    "theme_color": "#333333",
    "orientation": "portrait-primary",
    "scope": "/",
    "lang": "ko",
    "categories": ["productivity", "utilities", "developer"],
    "icons": [
      {
        "src": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzIiIGhlaWdodD0iNzIiIHZpZXdCb3g9IjAgMCA3MiA3MiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjcyIiBoZWlnaHQ9IjcyIiByeD0iMTQiIGZpbGw9IiMzMzMzMzMiLz4KPHRleHQgeD0iMzYiIHk9IjM2IiBmb250LWZhbWlseT0iQXBwbGUgQ29sb3IgRW1vamksIFNlZ29lIFVJIEVtb2ppLCBOb3RvIENvbG9yIEVtb2ppLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjQzIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkb21pbmFudC1iYXNlbGluZT0iY2VudHJhbCI+8J+boPCfj7c8L3RleHQ+Cjwvc3ZnPgo=",
        "sizes": "72x72",
        "type": "image/svg+xml",
        "purpose": "any maskable"
      },
      {
        "src": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTkyIiBoZWlnaHQ9IjE5MiIgdmlld0JveD0iMCAwIDE5MiAxOTIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxOTIiIGhlaWdodD0iMTkyIiByeD0iMzgiIGZpbGw9IiMzMzMzMzMiLz4KPHRleHQgeD0iOTYiIHk9Ijk2IiBmb250LWZhbWlseT0iQXBwbGUgQ29sb3IgRW1vamksIFNlZ29lIFVJIEVtb2ppLCBOb3RvIENvbG9yIEVtb2ppLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjExNSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9ImNlbnRyYWwiPvCfm6Dwn4+3PC90ZXh0Pgo8L3N2Zz4K",
        "sizes": "192x192",
        "type": "image/svg+xml",
        "purpose": "any maskable"
      },
      {
        "src": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgdmlld0JveD0iMCAwIDUxMiA1MTIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI1MTIiIGhlaWdodD0iNTEyIiByeD0iMTAyIiBmaWxsPSIjMzMzMzMzIi8+Cjx0ZXh0IHg9IjI1NiIgeT0iMjU2IiBmb250LWZhbWlseT0iQXBwbGUgQ29sb3IgRW1vamksIFNlZ29lIFVJIEVtb2ppLCBOb3RvIENvbG9yIEVtb2ppLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjMwNyIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9ImNlbnRyYWwiPvCfm6Dwn4+3PC90ZXh0Pgo8L3N2Zz4K",
        "sizes": "512x512",
        "type": "image/svg+xml",
        "purpose": "any maskable"
      }
    ],
    "shortcuts": [
      {
        "name": "JSON Formatter",
        "short_name": "JSON",
        "description": "Format and validate JSON",
        "url": "/json",
        "icons": [
          {
            "src": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOTYiIGhlaWdodD0iOTYiIHZpZXdCb3g9IjAgMCA5NiA5NiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9Ijk2IiBoZWlnaHQ9Ijk2IiByeD0iMTkiIGZpbGw9IiMzMzMzMzMiLz4KPHRleHQgeD0iNDgiIHk9IjQ4IiBmb250LWZhbWlseT0iQXBwbGUgQ29sb3IgRW1vamksIFNlZ29lIFVJIEVtb2ppLCBOb3RvIENvbG9yIEVtb2ppLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjU4IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkb21pbmFudC1iYXNlbGluZT0iY2VudHJhbCI+8J+RizwvdGV4dD4KPC9zdmc+Cg==",
            "sizes": "96x96",
            "type": "image/svg+xml"
          }
        ]
      },
      {
        "name": "Text Counter",
        "short_name": "Counter",
        "description": "Count characters and words",
        "url": "/tcount",
        "icons": [
          {
            "src": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOTYiIGhlaWdodD0iOTYiIHZpZXdCb3g9IjAgMCA5NiA5NiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9Ijk2IiBoZWlnaHQ9Ijk2IiByeD0iMTkiIGZpbGw9IiMzMzMzMzMiLz4KPHRleHQgeD0iNDgiIHk9IjQ4IiBmb250LWZhbWlseT0iQXBwbGUgQ29sb3IgRW1vamksIFNlZ29lIFVJIEVtb2ppLCBOb3RvIENvbG9yIEVtb2ppLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjU4IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkb21pbmFudC1iYXNlbGluZT0iY2VudHJhbCI+8J+UojwvdGV4dD4KPC9zdmc+Cg==",
            "sizes": "96x96",
            "type": "image/svg+xml"
          }
        ]
      },
      {
        "name": "Image Converter",
        "short_name": "Image",
        "description": "Convert image formats",
        "url": "/image",
        "icons": [
          {
            "src": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOTYiIGhlaWdodD0iOTYiIHZpZXdCb3g9IjAgMCA5NiA5NiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9Ijk2IiBoZWlnaHQ9Ijk2IiByeD0iMTkiIGZpbGw9IiMzMzMzMzMiLz4KPHRleHQgeD0iNDgiIHk9IjQ4IiBmb250LWZhbWlseT0iQXBwbGUgQ29sb3IgRW1vamksIFNlZ29lIFVJIEVtb2ppLCBOb3RvIENvbG9yIEVtb2ppLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjU4IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkb21pbmFudC1iYXNlbGluZT0iY2VudHJhbCI+8J+WvO+4jzwvdGV4dD4KPC9zdmc+Cg==",
            "sizes": "96x96",
            "type": "image/svg+xml"
          }
        ]
      },
      {
        "name": "QR Generator",
        "short_name": "QR",
        "description": "Generate QR codes",
        "url": "/qr",
        "icons": [
          {
            "src": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOTYiIGhlaWdodD0iOTYiIHZpZXdCb3g9IjAgMCA5NiA5NiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9Ijk2IiBoZWlnaHQ9Ijk2IiByeD0iMTkiIGZpbGw9IiMzMzMzMzMiLz4KPHRleHQgeD0iNDgiIHk9IjQ4IiBmb250LWZhbWlseT0iQXBwbGUgQ29sb3IgRW1vamksIFNlZ29lIFVJIEVtb2ppLCBOb3RvIENvbG9yIEVtb2ppLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjU4IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkb21pbmFudC1iYXNlbGluZT0iY2VudHJhbCI+8J+TsTwvdGV4dD4KPC9zdmc+Cg==",
            "sizes": "96x96",
            "type": "image/svg+xml"
          }
        ]
      }
    ],
    "related_applications": [],
    "prefer_related_applications": false
  };

  return new Response(JSON.stringify(manifest, null, 2), {
    headers: {
      'Content-Type': 'application/manifest+json',
      'Cache-Control': 'public, max-age=86400'
    }
  });
}

/**
 * Service Worker 파일 제공
 */
async function handleServiceWorker() {
  // Service Worker 코드를 여기에 인라인으로 포함
  const swCode = `
// Service Worker for Tools Platform PWA
const CACHE_NAME = 'tools-platform-v1.0.0';
const STATIC_CACHE_NAME = 'tools-static-v1.0.0';

// 캐시할 정적 리소스들
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  // 각 도구 페이지들
  '/json', '/tcount', '/url', '/diff', '/base64', '/sql', '/hash',
  '/qr', '/tz', '/image', '/pwd', '/cron', '/unit'
];

// CDN 리소스들 (캐시하되 네트워크 우선)
const CDN_RESOURCES = [
  'https://cdn.jsdelivr.net',
  'https://unpkg.com',
  'https://cdnjs.cloudflare.com'
];

// 설치 이벤트 - 정적 리소스 캐시
self.addEventListener('install', event => {
  console.log('Service Worker: Installing...');

  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('Service Worker: Static assets cached');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('Service Worker: Failed to cache static assets', error);
      })
  );
});

// 활성화 이벤트 - 오래된 캐시 정리
self.addEventListener('activate', event => {
  console.log('Service Worker: Activating...');

  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE_NAME && cacheName !== STATIC_CACHE_NAME) {
              console.log('Service Worker: Deleting old cache', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Activated');
        return self.clients.claim();
      })
  );
});

// Fetch 이벤트 - 네트워크 요청 인터셉트
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  if (url.origin !== location.origin) {
    if (CDN_RESOURCES.some(cdn => url.href.startsWith(cdn))) {
      event.respondWith(handleCDNRequest(request));
    }
    return;
  }

  if (request.method !== 'GET') {
    return;
  }

  event.respondWith(handleRequest(request));
});

// 메인 요청 처리
async function handleRequest(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      console.log('Service Worker: Serving from cache', request.url);
      updateCache(request);
      return cachedResponse;
    }

    console.log('Service Worker: Fetching from network', request.url);
    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;

  } catch (error) {
    console.error('Service Worker: Network error', error);

    const fallbackResponse = await caches.match('/');
    if (fallbackResponse) {
      return fallbackResponse;
    }

    return new Response(
      '<!DOCTYPE html><html><head><title>오프라인</title></head><body><h1>오프라인 모드</h1><p>인터넷 연결을 확인해주세요.</p></body></html>',
      { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
    );
  }
}

// CDN 리소스 처리
async function handleCDNRequest(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
      return networkResponse;
    }
    throw new Error('Network response not ok');
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    throw error;
  }
}

// 백그라운드 캐시 업데이트
async function updateCache(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      await cache.put(request, networkResponse);
    }
  } catch (error) {
    // 백그라운드 업데이트 실패는 무시
  }
}

console.log('Service Worker: Loaded');
`;

  return new Response(swCode, {
    headers: {
      'Content-Type': 'application/javascript',
      'Cache-Control': 'public, max-age=0' // Service Worker는 캐시하지 않음
    }
  });
}

/**
 * 아이콘 생성기 스크립트를 인라인으로 반환
 */
function getIconGeneratorScript() {
  return `
    class IconGenerator {
      constructor() {
        this.emoji = '🛠️'; // 기본 이모지 (도구)
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
          'json': '📋',
          'tcount': '🔢',
          'url': '🔗',
          'diff': '📝',
          'base64': '🔐',
          'sql': '🗃️',
          'hash': '#️⃣',
          'qr': '📱',
          'tz': '🌍',
          'image': '🖼️',
          'pwd': '🔑',
          'unit': '📏',
          'cron': '⏰',
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
        if (existingFavicon) {
          existingFavicon.remove();
        }

        const favicon = document.createElement('link');
        favicon.rel = 'icon';
        favicon.type = 'image/svg+xml';
        favicon.href = this.generateSVGIcon(32, emoji);

        document.head.appendChild(favicon);
      }

      updateAppleTouchIcon(emoji) {
        const existingAppleIcon = document.querySelector('link[rel="apple-touch-icon"]');
        if (existingAppleIcon) {
          existingAppleIcon.remove();
        }

        const appleIcon = document.createElement('link');
        appleIcon.rel = 'apple-touch-icon';
        appleIcon.href = this.generateSVGIcon(180, emoji);

        document.head.appendChild(appleIcon);
      }
    }
  `;
}
