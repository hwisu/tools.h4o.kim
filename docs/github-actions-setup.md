# GitHub Actions 설정 가이드

## 🔑 필수 Secrets 설정

GitHub 리포지토리에서 다음 Secrets를 설정해야 합니다:

### 1. Repository Secrets 추가

1. GitHub 리포지토리로 이동
2. **Settings** > **Secrets and variables** > **Actions** 클릭
3. **New repository secret** 클릭하여 다음 secrets 추가:

#### `CLOUDFLARE_API_TOKEN`

- **값**: Cloudflare API Token
- **생성 방법**:
  1. [Cloudflare Dashboard](https://dash.cloudflare.com/profile/api-tokens) 접속
  2. **Create Token** 클릭
  3. **Custom Token** 선택
  4. 권한 설정:
     - `Zone:Zone:Read`
     - `Zone:Zone Settings:Edit`
     - `Account:Cloudflare Workers:Edit`
  5. **Account Resources**: Include - All accounts
  6. **Zone Resources**: Include - All zones
  7. **Continue to summary** → **Create Token**

#### `CLOUDFLARE_ACCOUNT_ID`

- **값**: Cloudflare Account ID
- **확인 방법**:
  1. Cloudflare Dashboard 우측 사이드바에서 확인
  2. 또는 `wrangler whoami` 명령어로 확인

## 🚀 배포 워크플로우

### 자동 배포 (main 브랜치)

```bash
git push origin main
```

- main 브랜치에 push하면 자동으로 production 환경에 배포됩니다.

### 수동 배포

1. GitHub 리포지토리의 **Actions** 탭으로 이동
2. **Deploy to Cloudflare Workers** 워크플로우 선택
3. **Run workflow** 클릭
4. 원하는 환경(production/staging) 선택
5. **Run workflow** 클릭

### Preview 배포 (Pull Request)

```bash
git checkout -b feature/new-feature
git push origin feature/new-feature
# GitHub에서 Pull Request 생성
```

- PR 생성 시 자동으로 staging 환경에 preview 배포됩니다.
- PR 댓글에 preview URL이 자동으로 추가됩니다.

## 📋 워크플로우 설명

### 1. CI (`ci.yml`)

- **트리거**: push (main, develop), pull_request (main)
- **기능**:
  - 코드 품질 검사 (linting)
  - 테스트 실행
  - Wrangler 설정 검증
  - 보안 감사 (security audit)

### 2. Deploy (`deploy.yml`)

- **트리거**: push (main), manual dispatch
- **기능**:
  - 의존성 설치
  - 테스트 실행
  - Cloudflare Workers 배포
  - 배포 정보 출력

### 3. Preview (`preview.yml`)

- **트리거**: pull_request (main)
- **기능**:
  - staging 환경에 preview 배포
  - PR에 preview URL 댓글 자동 추가
  - PR 업데이트 시 자동 재배포

## ⚙️ 워크플로우 커스터마이징

### Node.js 버전 변경

```yaml
- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    node-version: "20" # 원하는 버전으로 변경
    cache: "npm"
```

### 테스트 스크립트 추가

`package.json`에 테스트 스크립트를 추가:

```json
{
  "scripts": {
    "test": "echo 'Running tests...' && exit 0",
    "lint": "echo 'Running linter...' && exit 0"
  }
}
```

### 환경별 Secrets 설정

```yaml
- name: Deploy with environment secrets
  uses: cloudflare/wrangler-action@v3
  with:
    apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
    accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
    command: deploy --env production
    secrets: |
      DATABASE_URL
      API_KEY
  env:
    DATABASE_URL: ${{ secrets.DATABASE_URL }}
    API_KEY: ${{ secrets.API_KEY }}
```

## 🔍 트러블슈팅

### "No account id found" 오류

- `CLOUDFLARE_ACCOUNT_ID` secret이 설정되어 있는지 확인
- 또는 `wrangler.toml`에 `account_id` 직접 추가:

```toml
account_id = "your-account-id"
```

### API Token 권한 오류

- API Token이 올바른 권한을 가지고 있는지 확인
- Account와 Zone 리소스가 모두 포함되어 있는지 확인

### 배포 실패

1. 로컬에서 `wrangler deploy` 테스트
2. `wrangler validate` 명령어로 설정 검증
3. Actions 로그에서 자세한 오류 메시지 확인

## 📊 배포 모니터링

### 배포 상태 확인

- GitHub Actions 탭에서 워크플로우 실행 상태 확인
- Cloudflare Dashboard에서 Workers 배포 상태 확인

### 로그 확인

```bash
# 로컬에서 실시간 로그 확인
wrangler tail

# 특정 환경 로그
wrangler tail --env production
```

## 🎯 Best Practices

1. **브랜치 보호 규칙 설정**:
   - main 브랜치에 직접 push 금지
   - PR review 필수 설정
   - Status checks 통과 후 merge

2. **환경별 설정 분리**:
   - production/staging 환경 분리
   - 환경별 다른 설정 사용

3. **Secrets 관리**:
   - 민감한 정보는 반드시 GitHub Secrets 사용
   - 정기적으로 API Token 갱신

4. **배포 확인**:
   - 배포 후 Health Check 수행
   - 모니터링 설정으로 배포 상태 추적
