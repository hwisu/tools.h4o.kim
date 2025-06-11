/**
 * 공통 스타일 - 신문지 스타일 정돈된 격자 레이아웃 + 다크모드
 */
export const commonStyles = `
:root {
  --bg-primary: #ffffff;
  --bg-secondary: #f8f9fa;
  --bg-tertiary: #e9ecef;
  --text-primary: #212529;
  --text-secondary: #495057;
  --text-muted: #6c757d;
  --border-light: #dee2e6;
  --border-medium: #ced4da;
  --border-dark: #adb5bd;
  --accent-color: #212529;
  --accent-hover: #495057;
  --success-bg: #f8f9fa;
  --success-border: #28a745;
  --success-text: #155724;
  --error-bg: #f8f9fa;
  --error-border: #dc3545;
  --error-text: #721c24;
  --warning-bg: #f8f9fa;
  --warning-border: #ffc107;
  --warning-text: #856404;
  --shadow: 0 1px 3px rgba(0,0,0,0.1);
}

[data-theme="dark"] {
  --bg-primary: #1a1a1a;
  --bg-secondary: #2d2d2d;
  --bg-tertiary: #404040;
  --text-primary: #e9ecef;
  --text-secondary: #ced4da;
  --text-muted: #adb5bd;
  --border-light: #495057;
  --border-medium: #6c757d;
  --border-dark: #adb5bd;
  --accent-color: #e9ecef;
  --accent-hover: #ced4da;
  --success-bg: #1e3a2e;
  --success-border: #28a745;
  --success-text: #75b798;
  --error-bg: #3a1e1e;
  --error-border: #dc3545;
  --error-text: #f1919e;
  --warning-bg: #3a351e;
  --warning-border: #ffc107;
  --warning-text: #ffd43b;
  --shadow: 0 1px 3px rgba(0,0,0,0.3);
}

/* Theme toggle */
.theme-toggle {
  position: fixed;
  top: 1rem;
  right: 1rem;
  background: var(--bg-primary);
  color: var(--text-primary);
  border: 1px solid var(--border-medium);
  border-radius: 50%;
  width: 2.5rem;
  height: 2.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  box-shadow: var(--shadow);
  transition: all 0.2s ease;
  padding: 0;
}

.theme-toggle:hover {
  background: var(--bg-tertiary);
  transform: scale(1.05);
}

.theme-toggle svg {
  width: 1.2rem;
  height: 1.2rem;
  fill: var(--text-primary);
  transition: all 0.2s ease;
}

.theme-toggle:hover svg {
  transform: rotate(20deg);
}

/* Reset and base styles */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Times New Roman', 'Georgia', serif;
  font-size: 16px;
  line-height: 1.6;
  color: var(--text-primary);
  background: var(--bg-primary);
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  text-rendering: optimizeLegibility;
}

/* Typography - 신문지 스타일 */
h1, h2, h3, h4, h5, h6 {
  font-family: 'Times New Roman', serif;
  font-weight: bold;
  color: var(--text-primary);
  margin-bottom: 1rem;
  line-height: 1.2;
}

h1 {
  font-size: 2.5rem;
  border-bottom: 3px solid var(--accent-color);
  padding-bottom: 0.5rem;
  margin-bottom: 1.5rem;
}

h2 {
  font-size: 1.75rem;
  border-bottom: 1px solid var(--border-medium);
  padding-bottom: 0.25rem;
}

h3 { font-size: 1.25rem; }
h4 { font-size: 1.125rem; }

p {
  margin-bottom: 1rem;
  text-align: justify;
}

/* Header - 신문 헤더 스타일 */
.header {
  border-bottom: 3px double var(--border-dark);
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  text-align: center;
}

.header h1 {
  font-size: 3rem;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.5rem;
  border: none;
}

.header p {
  font-style: italic;
  font-size: 1.1rem;
  color: var(--text-secondary);
  margin: 0;
  text-align: center;
}

.back-link {
  position: absolute;
  top: 2rem;
  left: 2rem;
  color: var(--text-muted);
  text-decoration: none;
  font-size: 0.9rem;
  font-family: system-ui, -apple-system, sans-serif;
  padding: 0.25rem 0.5rem;
  border: 1px solid var(--border-light);
  border-radius: 3px;
}

.back-link:hover {
  color: var(--accent-color);
  border-color: var(--border-medium);
}

/* Container - 신문 컬럼 레이아웃 */
.tool-container {
  display: grid;
  gap: 2rem;
  margin-bottom: 2rem;
}

/* Form elements - 깔끔한 격자 */
.input-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.025em;
  font-family: system-ui, -apple-system, sans-serif;
}

textarea,
input[type="text"],
input[type="number"],
input[type="email"],
input[type="url"],
select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-medium);
  background: var(--bg-primary);
  color: var(--text-primary);
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  border-radius: 0;
}

textarea:focus,
input:focus,
select:focus {
  outline: none;
  border-color: var(--accent-color);
  box-shadow: inset 0 1px 2px rgba(0,0,0,0.1);
}

/* Buttons - 신문 스타일 */
button {
  background: var(--accent-color);
  color: var(--bg-primary);
  border: 1px solid var(--accent-color);
  padding: 0.75rem 1.5rem;
  font-family: system-ui, -apple-system, sans-serif;
  font-size: 0.9rem;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.025em;
  cursor: pointer;
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
  border-radius: 0;
  transition: all 0.2s ease;
}

button:hover {
  background: var(--accent-hover);
  border-color: var(--accent-hover);
}

button:disabled {
  background: var(--bg-tertiary);
  color: var(--text-muted);
  border-color: var(--border-light);
  cursor: not-allowed;
}

/* Tabs - 신문 섹션 탭 */
.tabs, .category-tabs {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1px;
  margin-bottom: 2rem;
  border: 1px solid var(--border-medium);
}

.tab-btn {
  background: var(--bg-secondary);
  color: var(--text-secondary);
  border: none;
  padding: 0.75rem;
  font-size: 0.8rem;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.025em;
  cursor: pointer;
  margin: 0;
  border-radius: 0;
  border-right: 1px solid var(--border-light);
}

.tab-btn:last-child {
  border-right: none;
}

.tab-btn:hover {
  background: var(--bg-tertiary);
  color: var(--text-primary);
}

.tab-btn.active {
  background: var(--accent-color);
  color: var(--bg-primary);
}

/* Cards and content areas - 신문 기사 박스 */
.card, .result {
  background: var(--bg-primary);
  border: 1px solid var(--border-medium);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: var(--shadow);
}

.result {
  border-left: 4px solid var(--accent-color);
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
}

.error {
  border-left-color: var(--error-border);
  background: var(--error-bg);
  color: var(--error-text);
}

.success {
  border-left-color: var(--success-border);
  background: var(--success-bg);
  color: var(--success-text);
}

.warning {
  border-left-color: var(--warning-border);
  background: var(--warning-bg);
  color: var(--warning-text);
}

/* Grid layouts - 신문 컬럼 */
.two-column {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.three-column {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.four-column {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}

/* Responsive breakpoints */
@media (max-width: 768px) {
  body {
    padding: 1rem;
    font-size: 15px;
  }

  .header h1 {
    font-size: 2rem;
  }

  .two-column,
  .three-column,
  .four-column {
    grid-template-columns: 1fr;
  }

  .tabs, .category-tabs {
    grid-template-columns: repeat(2, 1fr);
  }

  .back-link {
    position: static;
    display: inline-block;
    margin-bottom: 1rem;
  }
}

@media (max-width: 480px) {
  .tabs, .category-tabs {
    grid-template-columns: 1fr;
  }

  .tab-btn {
    border-right: none;
    border-bottom: 1px solid var(--border-light);
  }

  .tab-btn:last-child {
    border-bottom: none;
  }
}

/* Utility classes */
.hidden { display: none; }
.text-center { text-align: center; }
.text-left { text-align: left; }
.text-right { text-align: right; }
.font-mono { font-family: 'Courier New', monospace; }
.font-sans { font-family: system-ui, -apple-system, sans-serif; }
.border-top { border-top: 1px solid var(--border-medium); }
.border-bottom { border-bottom: 1px solid var(--border-medium); }
.mt-1 { margin-top: 1rem; }
.mb-1 { margin-bottom: 1rem; }
.p-1 { padding: 1rem; }

/* Print styles */
@media print {
  body {
    background: white;
    color: black;
    max-width: none;
  }

  .theme-toggle {
    display: none;
  }

  .header {
    border-bottom: 3pt double black;
  }
}

/* 엔진 상태 표시 */
.engine-status {
  padding: 0.5rem;
  margin: 1rem 0;
  border-radius: 3px;
  font-size: 0.9rem;
}
.engine-loading {
  background: #fff3cd;
  color: #856404;
  border: 1px solid #ffeaa7;
}
.engine-ready {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}
.engine-error {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

/* 제목 상태 표시 */
.title-with-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.title-with-status h1 {
  margin: 0;
}

.status-indicator {
  display: inline-block;
  width: 1.2rem;
  height: 1.2rem;
  border-radius: 50%;
  position: relative;
  cursor: help;
}

.status-indicator.loading {
  background: #ffc107;
  animation: pulse 1.5s infinite;
}

.status-indicator.ready {
  background: #28a745;
  color: white;
  text-align: center;
  line-height: 1.2rem;
  font-size: 0.8rem;
  font-weight: bold;
}

.status-indicator.ready::after {
  content: "✓";
}

.status-indicator.error {
  background: #dc3545;
  color: white;
  text-align: center;
  line-height: 1.2rem;
  font-size: 0.8rem;
  font-weight: bold;
}

.status-indicator.error::after {
  content: "✗";
}

@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
}

/* 툴팁 */
.tooltip {
  position: relative;
}

.tooltip .tooltip-text {
  visibility: hidden;
  width: 200px;
  background-color: #333;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 8px 12px;
  position: absolute;
  z-index: 1000;
  bottom: 125%;
  left: 50%;
  margin-left: -100px;
  font-size: 0.85rem;
  font-weight: normal;
  line-height: 1.4;
  opacity: 0;
  transition: opacity 0.3s;
}

.tooltip .tooltip-text::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 50%;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: #333 transparent transparent transparent;
}

.tooltip:hover .tooltip-text {
  visibility: visible;
  opacity: 1;
}

/* 프로그레스 바 */
.progress-bar {
  width: 100%;
  height: 10px;
  background: #f0f0f0;
  border-radius: 5px;
  overflow: hidden;
  margin: 1rem 0;
}
.progress-fill {
  height: 100%;
  background: #007bff;
  transition: width 0.3s ease;
}

/* 체크박스와 라디오 버튼 스타일 */
input[type="checkbox"], input[type="radio"] {
  width: auto;
  margin-right: 0.5rem;
}

/* 색상 입력 */
input[type="color"] {
  width: 60px;
  height: 40px;
  padding: 0;
  border: 1px solid #ccc;
  border-radius: 3px;
  cursor: pointer;
}

/* 파일 업로드 영역 */
.upload-area {
  border: 2px dashed #ccc;
  border-radius: 5px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: border-color 0.3s ease;
}
.upload-area:hover, .upload-area.dragover {
  border-color: #666;
  background: #f9f9f9;
}

/* 모드 버튼 */
.mode-btn {
  background: #f8f9fa;
  color: #333;
  border: 1px solid #ddd;
  margin-right: 0.25rem;
}
.mode-btn.active {
  background: #333;
  color: white;
}
.mode-btn:hover {
  background: #e9ecef;
}
.mode-btn.active:hover {
  background: #555;
}

/* 컨트롤 그룹 */
.control-group {
  margin-bottom: 1rem;
}
.controls {
  display: flex;
  gap: 0.5rem;
  margin: 1rem 0;
  flex-wrap: wrap;
}

/* 반응형 그리드 */
.converter-grid:not(.timezone-converter-grid), .formatter-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin: 1rem 0;
}
@media (max-width: 800px) {
  .converter-grid:not(.timezone-converter-grid), .formatter-grid {
    grid-template-columns: 1fr;
  }
}

/* 옵션 스타일 */
.options {
  margin: 1rem 0;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 3px;
  background: #f8f8f8;
}
.options h3 {
  margin: 0 0 1rem 0;
  font-size: 1rem;
}
.option-group {
  margin-bottom: 1rem;
}
.option-group label {
  display: block;
  margin-bottom: 0.5rem;
}

/* 해시 결과 스타일 */
.hash-results {
  margin: 1rem 0;
}
.hash-item {
  margin: 1rem 0;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 3px;
  background: #f9f9f9;
}
.hash-label {
  font-weight: bold;
  margin-bottom: 0.5rem;
}
.hash-value {
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 0.9rem;
  word-break: break-all;
  background: white;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 3px;
}

/* 복사 버튼 */
.copy-btn {
  background: #007bff;
  color: white;
  border: none;
  padding: 0.25rem 0.5rem;
  border-radius: 3px;
  cursor: pointer;
  font-size: 0.8rem;
  margin-left: 0.5rem;
}
.copy-btn:hover {
  background: #0056b3;
}
.copy-success {
  background: #28a745 !important;
}

/* 비밀번호 출력 */
.password-output {
  background: #f9f9f9;
  padding: 1rem;
  border: 1px solid #ddd;
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 1.2rem;
  word-break: break-all;
  margin: 1rem 0;
  border-radius: 3px;
}

/* 강도 측정기 */
.strength-meter {
  margin: 1rem 0;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 3px;
}
.strength-bar {
  height: 10px;
  background: #ddd;
  border-radius: 5px;
  overflow: hidden;
  margin: 0.5rem 0;
}
.strength-fill {
  height: 100%;
  transition: width 0.3s ease;
}
.strength-weak { background: #dc3545; }
.strength-fair { background: #ffc107; }
.strength-good { background: #28a745; }
.strength-strong { background: #007bff; }

/* 타임스탬프 결과 */
.timestamp-result {
  background: #f9f9f9;
  padding: 1rem;
  border: 1px solid #ddd;
  margin: 1rem 0;
  font-family: 'Monaco', 'Menlo', monospace;
  border-radius: 3px;
}

/* 포맷 테이블 */
.formats-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 0.9rem;
}
.formats-table th,
.formats-table td {
  padding: 0.5rem;
  text-align: left;
  border-bottom: 1px solid #ddd;
}
.formats-table th {
  background: #f5f5f5;
  font-weight: bold;
}

/* 텍스트 diff 스타일 */
.diff-output {
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 0.9rem;
  white-space: pre-wrap;
  word-break: break-word;
}
.added {
  background: #d4edda;
  color: #155724;
}
.removed {
  background: #f8d7da;
  color: #721c24;
}
.unchanged {
  color: #333;
}
.line-number {
  color: #666;
  margin-right: 1rem;
  user-select: none;
}

/* 통계 표시 */
.stats {
  background: #e9ecef;
  padding: 0.5rem 1rem;
  margin: 1rem 0;
  border-radius: 3px;
  font-size: 0.9rem;
}

/* 유사도 점수 */
.similarity-score {
  background: #d1ecf1;
  color: #0c5460;
  padding: 0.5rem 1rem;
  margin: 1rem 0;
  border-radius: 3px;
  font-weight: bold;
}
`;
