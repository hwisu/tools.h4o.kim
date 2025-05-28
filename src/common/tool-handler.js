import { createHtmlResponse } from './template.js';

// 빌드 시점에 모든 HTML 파일을 정적으로 import
import textCounterHtml from '../tools/text-counter/index.html?inline';
import urlEncoderHtml from '../tools/url-encoder/index.html?inline';
import jsonFormatterHtml from '../tools/json-formatter/index.html?inline';
import base64ConverterHtml from '../tools/base64-converter/index.html?inline';
import qrGeneratorHtml from '../tools/qr-generator/index.html?inline';
import sqlFormatterHtml from '../tools/sql-formatter/index.html?inline';
import textDiffHtml from '../tools/text-diff/index.html?inline';
import timezoneConverterHtml from '../tools/timezone-converter/index.html?inline';
import imageConverterHtml from '../tools/image-converter/index.html?inline';
import hashGeneratorHtml from '../tools/hash-generator/index.html?inline';
import passwordGeneratorHtml from '../tools/password-generator/index.html?inline';
import unitConverterHtml from '../tools/unit-converter/index.html?inline';
import cronBuilderHtml from '../tools/cron-builder/index.html?inline';

// URL 단축 매핑 - 짧은 URL을 실제 도구 이름으로 매핑
const URL_MAPPING = {
  'base64': 'base64-converter',
  'cron': 'cron-builder',
  'hash': 'hash-generator',
  'image': 'image-converter',
  'json': 'json-formatter',
  'pwd': 'password-generator',
  'qr': 'qr-generator',
  'sql': 'sql-formatter',
  'tcount': 'text-counter',
  'diff': 'text-diff',
  'tz': 'timezone-converter',
  'unit': 'unit-converter',
  'url': 'url-encoder'
};

// 도구 설정 맵 - 빌드 시점에 HTML 내용이 포함됨
const TOOLS_CONFIG = {
  'text-counter': {
    html: textCounterHtml,
    title: 'Text Counter'
  },
  'url-encoder': {
    html: urlEncoderHtml,
    title: 'URL Encoder'
  },
  'json-formatter': {
    html: jsonFormatterHtml,
    title: 'JSON Formatter'
  },
  'base64-converter': {
    html: base64ConverterHtml,
    title: 'Base64 Converter'
  },
  'qr-generator': {
    html: qrGeneratorHtml,
    title: 'QR Generator'
  },
  'sql-formatter': {
    html: sqlFormatterHtml,
    title: 'SQL Formatter'
  },
  'text-diff': {
    html: textDiffHtml,
    title: 'Text Diff'
  },
  'timezone-converter': {
    html: timezoneConverterHtml,
    title: 'Universal Time Converter'
  },
  'image-converter': {
    html: imageConverterHtml,
    title: 'Image Converter'
  },
  'hash-generator': {
    html: hashGeneratorHtml,
    title: 'Hash Generator'
  },
  'password-generator': {
    html: passwordGeneratorHtml,
    title: 'Password Generator'
  },
  'unit-converter': {
    html: unitConverterHtml,
    title: 'Unit Converter'
  },
  'cron-builder': {
    html: cronBuilderHtml,
    title: 'Cron Builder'
  }
};

// 모든 HTML 파일이 번들에 포함되도록 강제로 참조
const ALL_HTML_IMPORTS = {
  textCounterHtml,
  urlEncoderHtml,
  jsonFormatterHtml,
  base64ConverterHtml,
  qrGeneratorHtml,
  sqlFormatterHtml,
  textDiffHtml,
  timezoneConverterHtml,
  imageConverterHtml,
  hashGeneratorHtml,
  passwordGeneratorHtml,
  unitConverterHtml,
  cronBuilderHtml
};

// 개발 모드에서 import 확인용 (tree-shaking 방지)
if (typeof window !== 'undefined' && window.location?.hostname === 'localhost') {
  console.log('Loaded HTML imports:', Object.keys(ALL_HTML_IMPORTS).length);
}

/**
 * 정적으로 번들된 HTML을 반환하는 통합 핸들러
 * @param {string} toolName - 도구 이름 (예: 'text-counter' 또는 'tcount')
 * @returns {Response} 처리된 HTML Response
 */
export function handleTool(toolName) {
  console.log('handleTool called with:', toolName);

  // URL 매핑 확인 - 짧은 URL이면 실제 도구 이름으로 변환
  const actualToolName = URL_MAPPING[toolName] || toolName;
  console.log('Mapped tool name:', actualToolName);
  console.log('Available tools:', Object.keys(TOOLS_CONFIG));

  const config = TOOLS_CONFIG[actualToolName];
  console.log('Config found:', !!config);

  if (!config) {
    console.log('Tool not found:', toolName, '->', actualToolName);
    return new Response('Tool not found', { status: 404 });
  }

  console.log('Returning HTML for:', actualToolName);
  return createHtmlResponse(config.html, actualToolName);
}

/**
 * 사용 가능한 모든 도구 목록 반환 (단축 URL 포함)
 * @returns {Array} 도구 설정 배열
 */
export function getAvailableTools() {
  return Object.entries(TOOLS_CONFIG).map(([name, config]) => {
    // 단축 URL 찾기
    const shortUrl = Object.keys(URL_MAPPING).find(key => URL_MAPPING[key] === name);
    return {
      name,
      title: config.title,
      path: `/${shortUrl || name}`, // 단축 URL이 있으면 사용, 없으면 원래 이름
      shortPath: shortUrl ? `/${shortUrl}` : null,
      fullPath: `/${name}`
    };
  });
}
