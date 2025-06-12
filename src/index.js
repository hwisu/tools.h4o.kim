/**
 * Tools Platform - Collection of useful web tools
 * All processing is performed client-side (considering Workers free tier CPU limitations)
 */

// Import unified tool handler
import { handleTool, getAvailableTools } from './common/tool-handler.js';
import { createHtmlResponse } from './common/template.js';
import homeHtml from './pages/home.html?inline';
import { APP_CONFIG } from './config.js';
import { withCors, jsonResponse } from './common/response.js';
import { getServiceWorkerCode } from './common/sw-template.js';

// Output version information to console (for debugging)
console.log(`App starting - Version: ${APP_CONFIG.version}, Build time: ${APP_CONFIG.buildTime}`);

const ROUTES = {
  '/': () => handleHome(),
  '/api/status': () => handleStatus(),
  '/api/tools': () => handleTools(),
  '/manifest.json': () => handleManifest(),
  '/sw.js': () => handleServiceWorker()
};

export default {
  async fetch(request) {
    const { pathname } = new URL(request.url);

    // Preflight
    if (request.method === 'OPTIONS') {
      return withCors(null, 204);
    }

    try {
      // Exact path routing
      const exact = ROUTES[pathname];
      if (exact) return exact(request);

      // Tool dynamic routing /{tool-name}
      const match = pathname.match(/^\/([a-z0-9-]+)$/);
      if (match) return handleTool(match[1]);

      return withCors('Not Found', 404);
    } catch (err) {
      console.error('Unhandled error', err);
      return withCors('Internal Server Error', 500);
    }
  },
};

/**
 * Main homepage
 */
function handleHome() {
  return createHtmlResponse(homeHtml, 'home');
}

/**
 * Status check API
 */
function handleStatus() {
  const contentHash = btoa(APP_CONFIG.version + APP_CONFIG.buildTime + (APP_CONFIG.gitHash || '')).slice(0, 8);
  return jsonResponse({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    tools: getAvailableTools().length,
    version: APP_CONFIG.version,
    lastUpdated: APP_CONFIG.buildTime,
    buildTime: APP_CONFIG.buildTime,
    gitHash: APP_CONFIG.gitHash,
    contentHash
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

  return jsonResponse(manifest, 200, { 'Cache-Control': 'public, max-age=3600' });
}

/**
 * Service Worker handling
 */
function handleServiceWorker() {
  return withCors(getServiceWorkerCode(APP_CONFIG.version), 200, {
    'Content-Type': 'application/javascript',
    'Cache-Control': 'public, max-age=3600'
  });
}

function handleTools() {
  return jsonResponse(getAvailableTools());
}






