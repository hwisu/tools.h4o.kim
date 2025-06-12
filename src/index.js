/**
 * Tools Platform - Collection of useful web tools
 * All processing is performed client-side (considering Workers free tier CPU limitations)
 */

// Import unified tool handler
import { handleTool } from './common/tool-handler.js';
import { commonStyles } from './common/styles.js';
import { APP_CONFIG } from './config.js';

// Output version information to console (for debugging)
console.log(`App starting - Version: ${APP_CONFIG.version}, Build time: ${APP_CONFIG.buildTime}`);

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // CORS headers setup
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    // Handle OPTIONS requests (CORS preflight)
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: corsHeaders,
      });
    }

    try {
      // Routing - Dynamic tool handling
      if (url.pathname === '/') {
        return handleHome();
      }

      if (url.pathname === '/api/status') {
        return handleStatus();
      }

      // PWA file handling
      if (url.pathname === '/manifest.json') {
        return handleManifest();
      }

      if (url.pathname === '/sw.js') {
        return handleServiceWorker();
      }

      // Tool routing - /tools/{tool-name} pattern
      const toolMatch = url.pathname.match(/^\/([a-z0-9-]+)$/);
      if (toolMatch) {
        const toolName = toolMatch[1];
        console.log('toolName', toolName);
        return handleTool(toolName);
      }

      // 404 handling
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
 * Main homepage
 */
function handleHome() {
  const html = `
    <!DOCTYPE html>
    <html lang="en">
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
          border: 1px solid var(--border-medium);
          font-family: 'Courier New', monospace;
          background: var(--bg-secondary);
          color: var(--text-primary);
        }
        .search-input:focus {
          outline: none;
          border-color: var(--accent-color);
          box-shadow: inset 0 1px 2px rgba(0,0,0,0.1);
          background: var(--bg-primary);
        }
        .search-hints {
          margin-top: 0.5rem;
          text-align: center;
          color: var(--text-muted);
          font-size: 0.85rem;
        }
        .search-hints strong {
          color: var(--text-secondary);
        }
        .search-hints kbd {
          background: var(--bg-tertiary);
          border: 1px solid var(--border-medium);
          padding: 0.1rem 0.3rem;
          font-family: 'Courier New', monospace;
          font-size: 0.8rem;
          color: var(--text-primary);
        }
        .category {
          margin-bottom: 2rem;
        }
        .category-title {
          font-size: 1.3rem;
          font-weight: normal;
          margin-bottom: 1rem;
          color: var(--text-primary);
          border-bottom: 1px solid var(--border-medium);
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
          position: relative;
          transition: all 0.2s ease;
        }
        .tool-item::before {
          content: "- ";
          margin-left: -1rem;
          color: var(--text-muted);
          font-family: 'Courier New', monospace;
          transition: all 0.2s ease;
        }
        .tool-link {
          color: var(--text-primary);
          text-decoration: none;
          font-weight: 500;
          position: relative;
          transition: all 0.2s ease;
        }
        .tool-link:hover {
          text-decoration: underline;
        }
        .tool-description {
          color: var(--text-muted);
          font-weight: normal;
        }
        .hidden {
          display: none;
        }

        /* Terminal-style keyboard navigation selection */
        .tool-item.selected::before {
          content: "+ ";
          color: var(--accent-color);
          font-weight: bold;
          animation: blink 1.5s infinite;
        }
        .tool-item.selected .tool-link {
          color: var(--accent-color);
          text-decoration: underline;
          text-decoration-color: var(--accent-color);
          text-decoration-thickness: 2px;
          text-underline-offset: 2px;
        }
        .tool-item.selected .tool-description {
          color: var(--text-secondary);
        }

        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0.3; }
        }
      </style>
    </head>
    <body>
      <button class="theme-toggle" onclick="toggleTheme()" title="Toggle dark mode">
        <svg class="theme-icon" viewBox="0 0 24 24">
          <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z"/>
        </svg>
      </button>

      <div class="header">
        <h1>tools.h4o.kim</h1>
        <p>Miscellaneous web tools for daily use</p>
      </div>

      <div class="search-container">
        <input type="text" id="searchInput" class="search-input" placeholder="Search tools..." autofocus>
        <div class="search-hints">
          <small>💡 <kbd>↑↓</kbd> Navigate • <kbd>Enter</kbd> Select • <kbd>Esc</kbd> Clear</small>
        </div>
      </div>

      <div class="category" data-category="text">
        <h2 class="category-title">Text Tools</h2>
        <ul class="tool-list">
          <li class="tool-item" data-keywords="text counter character word line count">
            <a href="/tcount" class="tool-link">Text Counter</a>
            <span class="tool-description"> : Count characters, words, lines</span>
          </li>
          <li class="tool-item" data-keywords="url encoder decoder encode decode uri">
            <a href="/url" class="tool-link">URL Encoder/Decoder</a>
            <span class="tool-description"> : Encode and decode URLs</span>
          </li>
          <li class="tool-item" data-keywords="text diff compare difference">
            <a href="/diff" class="tool-link">Text Diff</a>
            <span class="tool-description"> : Compare text differences</span>
          </li>
        </ul>
      </div>

      <div class="category" data-category="developer">
        <h2 class="category-title">Developer Tools</h2>
        <ul class="tool-list">
          <li class="tool-item" data-keywords="json formatter pretty print validate minify">
            <a href="/json" class="tool-link">JSON Formatter</a>
            <span class="tool-description"> : Format and validate JSON</span>
          </li>
          <li class="tool-item" data-keywords="base64 base converter hex binary decimal encode decode">
            <a href="/base64" class="tool-link">Base Converter</a>
            <span class="tool-description"> : Convert Base64, Hex, Binary, Decimal</span>
          </li>
          <li class="tool-item" data-keywords="sql formatter prettify query">
            <a href="/sql" class="tool-link">SQL Formatter</a>
            <span class="tool-description"> : Format SQL queries</span>
          </li>

          <li class="tool-item" data-keywords="hash generator md5 sha1 sha256">
            <a href="/hash" class="tool-link">Hash Generator</a>
            <span class="tool-description"> : Generate MD5, SHA1, SHA256 hashes</span>
          </li>
        </ul>
      </div>

      <div class="category" data-category="utility">
        <h2 class="category-title">Utility Tools</h2>
        <ul class="tool-list">
          <li class="tool-item" data-keywords="qr code generator qrcode">
            <a href="/qr" class="tool-link">QR Code Generator</a>
            <span class="tool-description"> : Generate QR codes</span>
          </li>
          <li class="tool-item" data-keywords="timezone converter time zone timestamp unix universal">
            <a href="/tz" class="tool-link">Universal Time Converter</a>
            <span class="tool-description"> : Convert timezones and timestamps</span>
          </li>
          <li class="tool-item" data-keywords="image converter format">
            <a href="/image" class="tool-link">Image Format Converter</a>
            <span class="tool-description"> : Convert image formats</span>
          </li>
          <li class="tool-item" data-keywords="password generator secure">
            <a href="/pwd" class="tool-link">Password Generator</a>
            <span class="tool-description"> : Generate secure passwords</span>
          </li>
          <li class="tool-item" data-keywords="unit converter measurement length weight temperature">
            <a href="/unit" class="tool-link">Unit Converter</a>
            <span class="tool-description"> : Convert units of measurement</span>
          </li>
          <li class="tool-item" data-keywords="cron expression builder scheduler">
            <a href="/cron" class="tool-link">Cron Builder</a>
            <span class="tool-description"> : Build cron expressions</span>
          </li>
        </ul>
      </div>

      <script>
        // Theme toggle functionality
        function toggleTheme() {
          const currentTheme = document.documentElement.getAttribute('data-theme');
          const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

          document.documentElement.setAttribute('data-theme', newTheme);
          localStorage.setItem('theme', newTheme);

          updateThemeIcon(newTheme);
        }

        // Update theme icon
        function updateThemeIcon(theme) {
          const toggle = document.querySelector('.theme-toggle svg');
          if (theme === 'dark') {
            // Moon icon
            toggle.innerHTML = '<path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/>';
          } else {
            // Sun icon
            toggle.innerHTML = '<path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z"/>';
          }
        }

        // Initialize theme
        function initTheme() {
          const savedTheme = localStorage.getItem('theme') || 'light';
          document.documentElement.setAttribute('data-theme', savedTheme);
          updateThemeIcon(savedTheme);
        }

        // Initialize theme on page load
        initTheme();

        // Search functionality with keyboard navigation
        const searchInput = document.getElementById('searchInput');
        const toolItems = document.querySelectorAll('.tool-item');
        const categories = document.querySelectorAll('.category');
        let selectedIndex = -1;
        let visibleItems = [];

        function updateVisibleItems() {
          visibleItems = Array.from(toolItems).filter(item => !item.classList.contains('hidden'));
        }

        function clearSelection() {
          toolItems.forEach(item => item.classList.remove('selected'));
          selectedIndex = -1;
        }

        function selectItem(index) {
          clearSelection();
          if (index >= 0 && index < visibleItems.length) {
            selectedIndex = index;
            visibleItems[index].classList.add('selected');
            visibleItems[index].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
        }

        function navigateToSelected() {
          if (selectedIndex >= 0 && selectedIndex < visibleItems.length) {
            const link = visibleItems[selectedIndex].querySelector('.tool-link');
            if (link) {
              window.location.href = link.href;
            }
          }
        }

        // Search input event listener
        searchInput.addEventListener('input', function() {
          const query = this.value.toLowerCase();
          clearSelection();

          if (!query) {
            // If no search term, show all items
            toolItems.forEach(item => item.classList.remove('hidden'));
            categories.forEach(category => category.classList.remove('hidden'));
            updateVisibleItems();
            return;
          }

          let hasVisibleItems = {};

          toolItems.forEach(item => {
            const keywords = item.dataset.keywords || '';
            const text = item.textContent.toLowerCase();
            const matches = keywords.includes(query) || text.includes(query);

            item.classList.toggle('hidden', !matches);

            // Track visibility by category
            const category = item.closest('.category');
            const categoryName = category.dataset.category;
            if (matches) {
              hasVisibleItems[categoryName] = true;
            }
          });

          // Hide empty categories
          categories.forEach(category => {
            const categoryName = category.dataset.category;
            category.classList.toggle('hidden', !hasVisibleItems[categoryName]);
          });

          updateVisibleItems();

          // Auto-select first result if there are results
          if (visibleItems.length > 0) {
            selectItem(0);
          }
        });

        // Keyboard navigation
        searchInput.addEventListener('keydown', function(e) {
          if (visibleItems.length === 0) return;

          switch (e.key) {
            case 'ArrowDown':
              e.preventDefault();
              const nextIndex = selectedIndex < visibleItems.length - 1 ? selectedIndex + 1 : 0;
              selectItem(nextIndex);
              break;

            case 'ArrowUp':
              e.preventDefault();
              const prevIndex = selectedIndex > 0 ? selectedIndex - 1 : visibleItems.length - 1;
              selectItem(prevIndex);
              break;

            case 'Enter':
              e.preventDefault();
              if (selectedIndex >= 0) {
                navigateToSelected();
              } else if (visibleItems.length > 0) {
                // If no item selected but there are results, select first one
                selectItem(0);
                navigateToSelected();
              }
              break;

            case 'Escape':
              e.preventDefault();
              clearSelection();
              this.blur();
              break;
          }
        });

        // Initialize visible items
        updateVisibleItems();
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
 * Status check API
 */
function handleStatus() {
  // Simple content hash generation (should ideally be generated at build time)
  const contentHash = btoa(APP_CONFIG.version + APP_CONFIG.buildTime + (APP_CONFIG.gitHash || '')).slice(0, 8);

  return Response.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    tools: 12,
    version: APP_CONFIG.version,
    lastUpdated: APP_CONFIG.buildTime,
    buildTime: APP_CONFIG.buildTime,
    gitHash: APP_CONFIG.gitHash,
    contentHash: contentHash // For content change detection
  });
}

/**
 * PWA Manifest handling
 */
function handleManifest() {
  const manifest = {
    name: "tools.h4o.kim",
    short_name: "Tools",
    description: "Miscellaneous web tools for daily use",
    start_url: "/",
    display: "standalone",
    theme_color: "#333333",
    background_color: "#ffffff",
    orientation: "portrait-primary",
    icons: [
      {
        src: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTkyIiBoZWlnaHQ9IjE5MiIgdmlld0JveD0iMCAwIDE5MiAxOTIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjE5MiIgaGVpZ2h0PSIxOTIiIHJ4PSIzOCIgZmlsbD0iIzMzMzMzMyIvPjx0ZXh0IHg9Ijk2IiB5PSI5NiIgZm9udC1mYW1pbHk9IkFwcGxlIENvbG9yIEVtb2ppLCBTZWdvZSBVSSBFbW9qaSwgTm90byBDb2xvciBFbW9qaSwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxMTQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJjZW50cmFsIj7wn5ug8J+PtzwvdGV4dD48L3N2Zz4K",
        sizes: "192x192",
        type: "image/svg+xml"
      },
      {
        src: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgdmlld0JveD0iMCAwIDUxMiA1MTIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjUxMiIgaGVpZ2h0PSI1MTIiIHJ4PSIxMDIiIGZpbGw9IiMzMzMzMzMiLz48dGV4dCB4PSIyNTYiIHk9IjI1NiIgZm9udC1mYW1pbHk9IkFwcGxlIENvbG9yIEVtb2ppLCBTZWdvZSBVSSBFbW9qaSwgTm90byBDb2xvciBFbW9qaSwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIzMDYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJjZW50cmFsIj7wn5ug8J+PtzwvdGV4dD48L3N2Zz4K",
        sizes: "512x512",
        type: "image/svg+xml"
      }
    ],
    categories: ["utilities", "productivity"]
  };

  return Response.json(manifest, {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600'
    }
  });
}

/**
 * Service Worker handling
 */
function handleServiceWorker() {
  const serviceWorkerCode = `
// Service Worker for tools.h4o.kim
const CACHE_NAME = 'tools-v${APP_CONFIG.version}';
const urlsToCache = [
  '/',
  '/manifest.json'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      }
    )
  );
});
`;

  return new Response(serviceWorkerCode, {
    headers: {
      'Content-Type': 'application/javascript',
      'Cache-Control': 'public, max-age=3600'
    }
  });
}






