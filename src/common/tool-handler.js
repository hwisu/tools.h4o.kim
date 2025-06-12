import { createHtmlResponse } from './template.js';

// Statically import all HTML files at build time
import textCounterHtml from '../tools/text-counter/index.html?inline';
import urlEncoderHtml from '../tools/url-encoder/index.html?inline';
import jsonFormatterHtml from '../tools/json-formatter/index.html?inline';
import baseConverterHtml from '../tools/base-converter/index.html?inline';
import qrGeneratorHtml from '../tools/qr-generator/index.html?inline';
import sqlFormatterHtml from '../tools/sql-formatter/index.html?inline';
import textDiffHtml from '../tools/text-diff/index.html?inline';
import timezoneConverterHtml from '../tools/timezone-converter/index.html?inline';
import imageConverterHtml from '../tools/image-converter/index.html?inline';
import hashGeneratorHtml from '../tools/hash-generator/index.html?inline';
import passwordGeneratorHtml from '../tools/password-generator/index.html?inline';
import unitConverterHtml from '../tools/unit-converter/index.html?inline';
import cronBuilderHtml from '../tools/cron-builder/index.html?inline';

// URL shortening mapping - Map short URLs to actual tool names
const URL_MAPPING = {
  'base64': 'base-converter',
  'base': 'base-converter',
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

// Tool configuration map - HTML content included at build time
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
  'base-converter': {
    html: baseConverterHtml,
    title: 'Base Converter'
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

// Force reference to ensure all HTML files are included in bundle
const ALL_HTML_IMPORTS = {
  textCounterHtml,
  urlEncoderHtml,
  jsonFormatterHtml,
  baseConverterHtml,
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

// For import verification in dev mode (prevent tree-shaking)
if (typeof window !== 'undefined' && window.location?.hostname === 'localhost') {
  console.log('Loaded HTML imports:', Object.keys(ALL_HTML_IMPORTS).length);
}

/**
 * Unified handler that returns statically bundled HTML
 * @param {string} toolName - Tool name (e.g., 'text-counter' or 'tcount')
 * @returns {Response} Processed HTML Response
 */
export function handleTool(toolName) {
  console.log('handleTool called with:', toolName);

  // Check URL mapping - Convert short URL to actual tool name if needed
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
 * Return list of all available tools (including short URLs)
 * @returns {Array} Array of tool configurations
 */
export function getAvailableTools() {
  return Object.entries(TOOLS_CONFIG).map(([name, config]) => {
    // Find short URL
    const shortUrl = Object.keys(URL_MAPPING).find(key => URL_MAPPING[key] === name);
    return {
      name,
      title: config.title,
      path: `/${shortUrl || name}`, // Use short URL if available, otherwise original name
      shortPath: shortUrl ? `/${shortUrl}` : null,
      fullPath: `/${name}`
    };
  });
}
