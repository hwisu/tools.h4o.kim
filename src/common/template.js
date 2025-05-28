import { commonStyles } from './styles.js';
import { getToolScript } from './script-bundle.js';

/**
 * HTML 템플릿에 공통 스타일과 스크립트를 주입합니다
 * @param {string} htmlTemplate - 플레이스홀더가 포함된 HTML 템플릿
 * @param {string} toolName - 도구 이름 (스크립트 주입용)
 * @returns {string} 처리된 HTML
 */
export function processTemplate(htmlTemplate, toolName) {
  let processedHtml = htmlTemplate;

  // 스타일 주입
  processedHtml = processedHtml.replace('/* {{COMMON_STYLES}} */', commonStyles);

  // 스크립트 주입 - <script src="./script.js"></script>를 실제 스크립트로 교체
  const toolScript = getToolScript(toolName);
  if (toolScript) {
    processedHtml = processedHtml.replace(
      /<script src="\.\/script\.js"><\/script>/g,
      `<script>${toolScript}</script>`
    );
  }

  return processedHtml;
}

/**
 * HTML 파일을 읽어서 스타일과 스크립트를 주입하고 Response를 반환합니다
 * @param {string} htmlContent - HTML 파일 내용
 * @param {string} toolName - 도구 이름
 * @returns {Response} 처리된 HTML Response
 */
export function createHtmlResponse(htmlContent, toolName) {
  const processedHtml = processTemplate(htmlContent, toolName);
  return new Response(processedHtml, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  });
}

/**
 * 레거시 지원: 스타일만 주입 (하위 호환성)
 * @param {string} htmlTemplate - {{COMMON_STYLES}} 플레이스홀더가 포함된 HTML 템플릿
 * @returns {string} 스타일이 주입된 HTML
 */
export function injectStyles(htmlTemplate) {
  return htmlTemplate.replace('{{COMMON_STYLES}}', commonStyles);
}
