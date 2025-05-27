# Tools

> Cloudflare Workers를 활용한 빌드 및 배포 도구 모음

## 🚀 빠른 시작

### 1. 의존성 설치

```bash
npm install
```

### 2. 로컬 개발 서버 실행

```bash
npm run dev
```

### 3. 배포

#### 로컬에서 배포

```bash
# Cloudflare 계정 로그인
wrangler login

# 프로덕션 배포
npm run deploy
```

#### GitHub Actions를 통한 자동 배포

1. GitHub Secrets 설정 ([상세 가이드](docs/github-actions-setup.md))
   - `CLOUDFLARE_API_TOKEN`
   - `CLOUDFLARE_ACCOUNT_ID`
2. main 브랜치에 push하면 자동 배포

## 📂 프로젝트 구조

```
tools/
├── .github/
│   └── workflows/        # GitHub Actions 워크플로우
│       ├── ci.yml        # CI (테스트, 린팅)
│       ├── deploy.yml    # 배포 (main 브랜치)
│       └── preview.yml   # Preview 배포 (PR)
├── docs/
│   └── github-actions-setup.md  # Actions 설정 가이드
├── src/
│   └── index.js          # 메인 Workers 스크립트
├── package.json          # 프로젝트 설정
├── wrangler.toml         # Cloudflare Workers 설정
└── README.md            # 이 파일
```

## 🛠️ 사용 가능한 스크립트

- `npm run build` - 프로덕션 빌드 (Vite 사용)
- `npm run build:dev` - 개발용 빌드 (소스맵 포함)
- `npm run build:watch` - 개발용 빌드 (파일 변경 감지)
- `npm run dev` - Wrangler 개발 서버 시작 ⭐ **주요 개발 명령어**
- `npm run serve` - Wrangler 로컬 서버 (인터넷 연결 불필요)
- `npm run deploy` - 프로덕션에 배포
- `npm run test` - 전체 테스트 실행
- `npm run lint` - 코드 스타일 검사
- `npm run publish` - 배포 (deploy와 동일)

## 📦 빌드 시스템

이 프로젝트는 **Vite**를 사용하여 함수 파일들을 효율적으로 관리합니다.

### Vite의 장점

- **⚡ 빠른 개발**: ES modules 기반 즉시 시작
- **🔥 HMR**: 빠른 핫 모듈 교체
- **📦 최적화**: Rollup 기반 프로덕션 빌드
- **🌳 Tree shaking**: 사용되지 않는 코드 자동 제거
- **📊 번들 분석**: 빌드 결과 시각화

### 빌드 기능

- **ES Modules**: 현대적인 JavaScript 모듈 시스템
- **Tree shaking**: 사용되지 않는 코드 제거
- **압축**: 프로덕션 빌드에서 자동 압축
- **소스맵**: 개발 환경에서 디버깅 지원
- **개별 빌드**: 각 도구를 별도 파일로도 빌드 가능

### 빌드 출력

```
dist/
├── index.js          # 메인 번들 파일
└── tools/            # 개별 도구 파일들
    ├── timezone-converter.js
    ├── qr-generator.js
    ├── hash-generator.js
    └── ...
```

### 개발 워크플로우

```bash
# 주요 개발 서버 (권장) - 인터넷 연결 필요
npm run dev

# 로컬 개발 서버 - 인터넷 연결 불필요
npm run serve

# 빌드 감시 모드 (백그라운드에서 실행)
npm run build:watch

# 프로덕션 빌드 및 테스트
npm run build
npm test

# 배포
npm run deploy
```

## 🤖 GitHub Actions 워크플로우

### 자동 배포

- **트리거**: main 브랜치 push
- **환경**: production
- **기능**: 자동 빌드 및 배포

### CI/CD Pipeline

- **트리거**: push, pull request
- **기능**: 테스트, 린팅, 보안 검사

### Preview 배포

- **트리거**: Pull Request 생성/업데이트
- **환경**: staging
- **기능**: PR 댓글에 preview URL 자동 추가

## 📡 API 엔드포인트

### GET /

웹 인터페이스 메인 페이지

### GET /api/status

서비스 상태 확인

```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T12:00:00.000Z",
  "environment": "development",
  "version": "1.0.0",
  "uptime": 1705320000
}
```

### GET /api/tools

사용 가능한 도구 목록

```json
{
  "tools": [
    {
      "name": "Cloudflare Workers",
      "description": "Edge computing platform",
      "status": "active"
    }
  ],
  "count": 4,
  "timestamp": "2024-01-15T12:00:00.000Z"
}
```

## ⚙️ 환경 설정

### wrangler.toml

Cloudflare Workers 관련 설정은 `wrangler.toml` 파일에서 관리됩니다.

주요 설정:

- `name`: Workers 이름
- `main`: 진입점 파일
- `compatibility_date`: 호환성 날짜
- `env`: 환경별 설정 (production, staging)

### 환경 변수

```toml
[vars]
ENVIRONMENT = "development"
```

### KV 네임스페이스 (선택사항)

```toml
[[kv_namespaces]]
binding = "MY_KV_NAMESPACE"
id = "your-kv-namespace-id"
```

### R2 버킷 (선택사항)

```toml
[[r2_buckets]]
binding = "MY_BUCKET"
bucket_name = "your-bucket-name"
```

## 🔧 개발 가이드

### 로컬 개발

```bash
# 개발 서버 시작 (핫 리로드 포함)
wrangler dev

# 특정 포트로 시작
wrangler dev --port 8080

# 로컬 모드 (인터넷 연결 없이)
wrangler dev --local
```

### 배포

```bash
# 기본 환경에 배포
wrangler deploy

# 특정 환경에 배포
wrangler deploy --env production
wrangler deploy --env staging
```

### 로그 확인

```bash
# 실시간 로그
wrangler tail

# 특정 환경 로그
wrangler tail --env production
```

## 🏗️ 확장 기능

### KV Storage 사용

```javascript
// KV에 데이터 저장
await env.MY_KV_NAMESPACE.put("key", "value");

// KV에서 데이터 조회
const value = await env.MY_KV_NAMESPACE.get("key");
```

### R2 Storage 사용

```javascript
// R2에 파일 업로드
await env.MY_BUCKET.put("file.txt", "content");

// R2에서 파일 다운로드
const object = await env.MY_BUCKET.get("file.txt");
```

### Durable Objects 사용

```javascript
// Durable Object 인스턴스 생성
const id = env.MY_DURABLE_OBJECT.idFromName("unique-name");
const stub = env.MY_DURABLE_OBJECT.get(id);
```

## 📝 참고 자료

- [Cloudflare Workers 문서](https://developers.cloudflare.com/workers/)
- [Wrangler CLI 문서](https://developers.cloudflare.com/workers/wrangler/)
- [Workers Runtime API](https://developers.cloudflare.com/workers/runtime-apis/)

## 📄 라이선스

MIT License
