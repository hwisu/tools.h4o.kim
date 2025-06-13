/**
 * Common styles - Clean newspaper-style grid layout + dark mode
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

  /* 통일된 폰트 정의 */
  --font-body: 'Times New Roman', 'Georgia', serif;
  --font-code: 'Monaco', 'Menlo', 'Courier New', monospace;
  --font-ui: system-ui, -apple-system, sans-serif;
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
  font-family: var(--font-body);
  font-size: 16px;
  line-height: 1.6;
  color: var(--text-primary);
  background: var(--bg-primary);
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  text-rendering: optimizeLegibility;
}

/* Typography - Newspaper style */
h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-body);
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

/* Header - Newspaper header style */
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
  font-family: var(--font-ui);
  padding: 0.25rem 0.5rem;
  border: 1px solid var(--border-light);
  border-radius: 3px;
}

.back-link:hover {
  color: var(--accent-color);
  border-color: var(--border-medium);
}

/* Container - Newspaper column layout */
.tool-container {
  display: grid;
  gap: 2rem;
  margin-bottom: 2rem;
}

/* Form elements - Clean grid */
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
  font-family: var(--font-ui);
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
  font-family: var(--font-code);
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

/* Buttons - Newspaper style */
button {
  background: var(--accent-color);
  color: var(--bg-primary);
  border: 1px solid var(--accent-color);
  padding: 0.75rem 1.5rem;
  font-family: var(--font-ui);
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

/* Notification styles */
.notification-success {
  background: var(--success-bg) !important;
  color: var(--success-text) !important;
  border-color: var(--success-border) !important;
}

.notification-error {
  background: var(--error-bg) !important;
  color: var(--error-text) !important;
  border-color: var(--error-border) !important;
}

.notification-warning {
  background: var(--warning-bg) !important;
  color: var(--warning-text) !important;
  border-color: var(--warning-border) !important;
}

/* Mobile responsive improvements */
@media (max-width: 768px) {
  body {
    padding: 0.75rem;
    font-size: 14px;
  }

  .container {
    max-width: 100%;
    padding: 0.75rem;
  }

  .header {
    padding: 1rem 0;
    margin-bottom: 1rem;
  }

  .header h1 {
    font-size: 1.8rem;
    margin-bottom: 0.5rem;
  }

  .header p {
    font-size: 0.9rem;
  }

  .tool-description {
    font-size: 0.8rem;
  }

  .tool-item {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: 0.25rem;
    padding: 0.75rem;
  }

  .tool-link {
    flex-shrink: 0;
    font-size: 0.9rem;
  }

  .tool-description {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /* Input elements mobile improvements */
  input, textarea, select {
    font-size: 16px; /* Prevent zoom on iOS */
    padding: 0.75rem;
  }

  button {
    padding: 0.75rem 1rem;
    font-size: 0.9rem;
    min-height: 44px; /* Touch target size */
  }

  .controls {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .controls button {
    flex: 1;
    min-width: 120px;
  }
}

/* Tabs - Newspaper section tabs */
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

/* Cards and content areas - Newspaper article boxes */
.card, .result {
  background: var(--bg-primary);
  border: 1px solid var(--border-medium);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: var(--shadow);
}

.result {
  border-left: 4px solid var(--accent-color);
  font-family: var(--font-code);
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

/* Grid layouts - Newspaper columns */
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
  body {
    padding: 0.5rem;
    font-size: 13px;
  }

  .container {
    padding: 0.5rem;
  }

  .header h1 {
    font-size: 1.5rem;
  }

  .tabs, .category-tabs {
    grid-template-columns: 1fr;
  }

  .tab-btn {
    border-right: none;
    border-bottom: 1px solid var(--border-light);
    padding: 0.6rem;
    font-size: 0.75rem;
  }

  .tab-btn:last-child {
    border-bottom: none;
  }

  .tool-item {
    padding: 0.5rem;
  }

  .tool-link {
    font-size: 0.85rem;
  }

  .input-group {
    margin-bottom: 1rem;
  }

  .input-group label {
    font-size: 0.9rem;
    margin-bottom: 0.25rem;
  }

  input, textarea, select {
    padding: 0.6rem;
  }

  .controls button {
    min-width: 100px;
    padding: 0.6rem 0.8rem;
  }
}

/* Utility classes */
.text-center { text-align: center; }
.text-left { text-align: left; }
.text-right { text-align: right; }
.text-muted { color: var(--text-muted); }
.text-bold { font-weight: bold; }
.hidden { display: none; }
.visible { display: block; }

/* Code blocks */
pre, code {
  font-family: var(--font-code);
  background: var(--bg-secondary);
  border: 1px solid var(--border-light);
  padding: 0.5rem;
  border-radius: 3px;
}

pre {
  overflow-x: auto;
  white-space: pre-wrap;
  word-wrap: break-word;
}

/* Loading states */
.loading {
  opacity: 0.6;
  pointer-events: none;
}

.spinner {
  display: inline-block;
  width: 1rem;
  height: 1rem;
  border: 2px solid var(--border-light);
  border-radius: 50%;
  border-top-color: var(--accent-color);
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

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

/* Engine status display */
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

/* Title status display */
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

/* Tooltip */
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

/* Progress bar */
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

/* Checkbox and radio button styles */
input[type="checkbox"], input[type="radio"] {
  width: auto;
  margin-right: 0.5rem;
}

/* Color input */
input[type="color"] {
  width: 60px;
  height: 40px;
  padding: 0;
  border: 1px solid #ccc;
  border-radius: 3px;
  cursor: pointer;
}

/* File upload area */
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

/* Mode buttons */
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

/* Control groups */
.control-group {
  margin-bottom: 1rem;
}
.controls {
  display: flex;
  gap: 0.5rem;
  margin: 1rem 0;
  flex-wrap: wrap;
}

/* Responsive grid */
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

/* Option styles */
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

/* Hash result styles */
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

/* Copy button */
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

/* Password output */
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

/* Strength meter */
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

/* Timestamp results */
.timestamp-result {
  background: #f9f9f9;
  padding: 1rem;
  border: 1px solid #ddd;
  margin: 1rem 0;
  font-family: 'Monaco', 'Menlo', monospace;
  border-radius: 3px;
}

/* Format table */
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

/* Text diff styles */
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

/* Statistics display */
.stats {
  background: #e9ecef;
  padding: 0.5rem 1rem;
  margin: 1rem 0;
  border-radius: 3px;
  font-size: 0.9rem;
}

/* Similarity score */
.similarity-score {
  background: #d1ecf1;
  color: #0c5460;
  padding: 0.5rem 1rem;
  margin: 1rem 0;
  border-radius: 3px;
  font-weight: bold;
}
`;
