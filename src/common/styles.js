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
  textarea, input[type="text"] {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ccc;
    border-radius: 3px;
    font-family: 'Monaco', 'Menlo', monospace;
    font-size: 0.9rem;
    background: #fff;
  }
  textarea:focus, input[type="text"]:focus {
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
  }
  button:hover { background: #555; }
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
`;
