/**
 * 공통 스타일 - 타이포그래피 중심의 종이같은 디자인
 */
export const commonStyles = `
* { box-sizing: border-box; }
body {
  font-family: 'Georgia', 'Times New Roman', serif;
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  line-height: 1.7;
  background: #fefefe;
  color: #333;
}
.header {
  margin-bottom: 3rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #ddd;
}
.back-link {
  display: inline-block;
  margin-bottom: 1rem;
  color: #666;
  text-decoration: none;
  font-size: 0.9rem;
}
.back-link:hover { text-decoration: underline; }
.tool-container {
  margin-bottom: 2rem;
  padding: 2rem 0;
  border-bottom: 1px solid #eee;
}
.input-group {
  margin-bottom: 1.5rem;
}
label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: normal;
  color: #444;
  font-size: 1rem;
}
textarea, input[type="text"], input[type="datetime-local"], input[type="range"], select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 3px;
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 0.9rem;
  background: #fff;
}
textarea:focus, input:focus, select:focus {
  outline: none;
  border-color: #666;
  box-shadow: 0 0 3px rgba(0,0,0,0.1);
}
button {
  background: #333;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-size: 0.9rem;
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
  font-family: inherit;
  border-radius: 3px;
}
button:hover { background: #555; }
button:disabled {
  background: #ccc;
  cursor: not-allowed;
}
.result {
  background: #f9f9f9;
  padding: 1rem;
  margin-top: 1rem;
  border-left: 3px solid #333;
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 0.9rem;
}
.error {
  background: #fff5f5;
  border-left-color: #d33;
  color: #d33;
}
.hidden {
  display: none;
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
