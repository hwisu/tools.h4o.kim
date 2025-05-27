import { defineConfig } from 'vite';
import { resolve } from 'path';
import { readdir } from 'fs/promises';

// 함수 파일들을 자동으로 찾기
async function getToolEntries() {
  const toolsDir = 'src/tools';
  try {
    const files = await readdir(toolsDir);
    const entries = {};

    files
      .filter(file => file.endsWith('.js'))
      .forEach(file => {
        const name = file.replace('.js', '');
        entries[`tools/${name}`] = resolve(toolsDir, file);
      });

    return entries;
  } catch (error) {
    console.log('No tools directory found, skipping individual tool builds');
    return {};
  }
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
      // Node.js built-in 모듈 차단
      if (id.startsWith('node:') || ['fs', 'path', 'os', 'crypto'].includes(id)) {
        throw new Error(`Node.js built-in module "${id}" is not available in Cloudflare Workers`);
      }
    }
  };
}

export default defineConfig(async ({ command, mode }) => {
  const isProduction = mode === 'production';
  const toolEntries = await getToolEntries();

  return {
    // 진입점 설정
    build: {
      // 라이브러리 모드로 빌드 (웹앱이 아닌 Workers용)
      lib: {
        entry: {
          index: resolve('src/index.js'),
          ...toolEntries
        },
        formats: ['es'], // ES modules만 사용
        fileName: (format, entryName) => {
          return `${entryName}.js`;
        }
      },

      // 출력 디렉토리
      outDir: 'dist',

      // 빌드 최적화
      minify: isProduction,
      sourcemap: !isProduction,

      // Rollup 옵션
      rollupOptions: {
        // 외부 의존성 (필요한 경우)
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
      open: false, // Workers는 브라우저에서 직접 실행되지 않음
    },

    // 환경 변수 정의
    define: {
      'process.env.NODE_ENV': JSON.stringify(mode),
      'process.env.BUILD_TIME': JSON.stringify(new Date().toISOString()),
    },

    // 플러그인
    plugins: [
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
