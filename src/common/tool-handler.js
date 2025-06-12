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
    title: 'Text Counter',
    description: 'Count characters, words, lines',
    category: 'text',
    keywords: 'text counter character word line count'
  },
  'url-encoder': {
    html: urlEncoderHtml,
    title: 'URL Encoder/Decoder',
    description: 'Encode and decode URLs',
    category: 'text',
    keywords: 'url encoder decoder encode decode uri'
  },
  'json-formatter': {
    html: jsonFormatterHtml,
    title: 'JSON Formatter',
    description: 'Format and validate JSON',
    category: 'developer',
    keywords: 'json formatter pretty print validate minify'
  },
  'base-converter': {
    html: baseConverterHtml,
    title: 'Base Converter',
    description: 'Convert Base64, Hex, Binary, Decimal',
    category: 'developer',
    keywords: 'base64 base converter hex binary decimal encode decode'
  },
  'qr-generator': {
    html: qrGeneratorHtml,
    title: 'QR Code Generator',
    description: 'Generate QR codes',
    category: 'utility',
    keywords: 'qr code generator qrcode'
  },
  'sql-formatter': {
    html: sqlFormatterHtml,
    title: 'SQL Formatter',
    description: 'Format SQL queries',
    category: 'developer',
    keywords: 'sql formatter prettify query'
  },
  'text-diff': {
    html: textDiffHtml,
    title: 'Text Diff',
    description: 'Compare text differences',
    category: 'text',
    keywords: 'text diff compare difference'
  },
  'timezone-converter': {
    html: timezoneConverterHtml,
    title: 'Universal Time Converter',
    description: 'Convert timezones and timestamps',
    category: 'utility',
    keywords: 'timezone converter time zone timestamp unix universal'
  },
  'image-converter': {
    html: imageConverterHtml,
    title: 'Image Format Converter',
    description: 'Convert image formats',
    category: 'utility',
    keywords: 'image converter format'
  },
  'hash-generator': {
    html: hashGeneratorHtml,
    title: 'Hash Generator',
    description: 'Generate MD5, SHA1, SHA256 hashes',
    category: 'developer',
    keywords: 'hash generator md5 sha1 sha256'
  },
  'password-generator': {
    html: passwordGeneratorHtml,
    title: 'Password Generator',
    description: 'Generate secure passwords',
    category: 'utility',
    keywords: 'password generator secure'
  },
  'unit-converter': {
    html: unitConverterHtml,
    title: 'Unit Converter',
    description: 'Convert units of measurement',
    category: 'utility',
    keywords: 'unit converter measurement length weight temperature'
  },
  'cron-builder': {
    html: cronBuilderHtml,
    title: 'Cron Builder',
    description: 'Build cron expressions',
    category: 'utility',
    keywords: 'cron expression builder scheduler'
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
      description: config.description,
      keywords: config.keywords,
      category: config.category,
      path: `/${shortUrl || name}`, // Preferred (short if available)
      shortPath: shortUrl ? `/${shortUrl}` : null,
      fullPath: `/${name}`
    };
  });
}
