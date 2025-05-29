import { defineConfig } from 'vite';
import { resolve } from 'path';
import { readFile } from 'fs/promises';

// 더 이상 개별 도구 파일들이 없으므로 이 함수는 불필요
// 모든 도구는 통합 핸들러를 통해 처리됨

// Script 파일을 문자열로 변환하는 플러그인
function scriptImportPlugin() {
  return {
    name: 'script-import',
    async resolveId(id) {
      if (id.endsWith('?script')) {
        return id;
      }
    },
    async load(id) {
      if (id.endsWith('?script')) {
        const filePath = id.replace('?script', '');
        try {
          const content = await readFile(filePath, 'utf-8');
          return `export default ${JSON.stringify(content)};`;
        } catch (error) {
          console.error(`Failed to load script file: ${filePath}`, error);
          return `export default '';`;
        }
      }
    }
  };
}

// CSS, HTML, JS 파일을 문자열로 변환하는 플러그인
function inlineImportPlugin() {
  return {
    name: 'inline-import',
    async resolveId(id) {
      if (id.endsWith('?inline') || id.endsWith('?raw')) {
        return id;
      }
    },
    async load(id) {
      if (id.endsWith('?inline') || id.endsWith('?raw')) {
        const filePath = id.replace(/\?(inline|raw)$/, '');
        try {
          const content = await readFile(filePath, 'utf-8');
          return `export default ${JSON.stringify(content)};`;
        } catch (error) {
          console.error(`Failed to load file: ${filePath}`, error);
          return `export default '';`;
        }
      }
    }
  };
}

// Cloudflare Workers용 플러그인
function cloudflareWorkersPlugin() {
  return {
    name: 'cloudflare-workers',
    config(config, { command }) {
      // 개발 모드에서는 소스맵 활성화
      if (command === 'serve') {
        config.build = config.build || {};
        config.build.sourcemap = true;
      }
    },
    resolveId(id) {
      // Block Node.js built-in modules
      if (builtinModules.includes(id)) {
        throw new Error(`Node.js built-in module "${id}" is not available in Cloudflare Workers`);
      }
    }
  };
}

export default defineConfig(({ command, mode }) => {
  const isProduction = mode === 'production';

  return {
    // 진입점 설정
    build: {
      // 라이브러리 모드로 빌드 (웹앱이 아닌 Workers용)
      lib: {
        entry: resolve('src/index.js'), // 단일 진입점
        formats: ['es'], // ES modules만 사용
        fileName: () => 'index.js'
      },

      // 출력 디렉토리
      outDir: 'dist',

      // 빌드 최적화
      minify: false,
      sourcemap: true,

      // Rollup 옵션
      rollupOptions: {
        // External dependencies (if needed)
        external: [],

        output: {
          // ES modules 형식으로 출력
          format: 'es',

          // 청크 분할 비활성화 (Workers는 단일 파일 선호)
          manualChunks: undefined,

          // 배너 추가
          banner: '// Built with Vite for Cloudflare Workers',
        }
      },

      // Workers 환경 최적화
      target: 'es2022',

      // 빌드 정리
      emptyOutDir: true,
    },

    // 개발 서버 설정 (필요시)
    server: {
      port: 3000,
      open: false, // Workers don't run directly in browser
    },

    // 환경 변수 정의
    define: {
      'process.env.NODE_ENV': JSON.stringify(mode),
      'process.env.BUILD_TIME': JSON.stringify(new Date().toISOString()),
    },

    // 플러그인
    plugins: [
      scriptImportPlugin(),
      inlineImportPlugin(),
      cloudflareWorkersPlugin(),
    ],

    // 해결 옵션
    resolve: {
      alias: {
        '@': resolve('src'),
        '@tools': resolve('src/tools'),
        '@common': resolve('src/common'),
      }
    },

    // 최적화 옵션
    optimizeDeps: {
      // Workers 환경에서는 사전 번들링 비활성화
      noDiscovery: true,
      include: [],
      exclude: [
        "@jsquash/avif",
        "@jsquash/jpeg",
        "@jsquash/png",
        "@jsquash/webp"
      ]
    },

    // CSS 설정 (Workers에서 CSS 사용시)
    css: {
      // CSS를 JS에 인라인으로 포함
      modules: false,
    },

    // 로깅
    logLevel: command === 'build' ? 'info' : 'error',
  };
});
