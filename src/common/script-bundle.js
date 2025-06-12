// Import all tool scripts as modules
import textCounterScript from '../tools/text-counter/script.js?raw';
import urlEncoderScript from '../tools/url-encoder/script.js?raw';
import jsonFormatterScript from '../tools/json-formatter/script.js?raw';
import baseConverterScript from '../tools/base-converter/script.js?raw';
import qrGeneratorScript from '../tools/qr-generator/script.js?raw';
import sqlFormatterScript from '../tools/sql-formatter/script.js?raw';

import textDiffScript from '../tools/text-diff/script.js?raw';
import timezoneConverterScript from '../tools/timezone-converter/script.js?raw';
import imageConverterScript from '../tools/image-converter/script.js?raw';
import hashGeneratorScript from '../tools/hash-generator/script.js?raw';
import passwordGeneratorScript from '../tools/password-generator/script.js?raw';
import unitConverterScript from '../tools/unit-converter/script.js?raw';
import cronBuilderScript from '../tools/cron-builder/script.js?raw';

// Tool-specific script map
const TOOL_SCRIPTS = {
  'text-counter': textCounterScript,
  'url-encoder': urlEncoderScript,
  'json-formatter': jsonFormatterScript,
  'base-converter': baseConverterScript,
  'qr-generator': qrGeneratorScript,
  'sql-formatter': sqlFormatterScript,

  'text-diff': textDiffScript,
  'timezone-converter': timezoneConverterScript,
  'image-converter': imageConverterScript,
  'hash-generator': hashGeneratorScript,
  'password-generator': passwordGeneratorScript,
  'unit-converter': unitConverterScript,
  'cron-builder': cronBuilderScript
};

/**
 * Return script for a specific tool
 * @param {string} toolName - Tool name
 * @returns {string} Script content
 */
export function getToolScript(toolName) {
  return TOOL_SCRIPTS[toolName] || '';
}

/**
 * Return all scripts as a single bundle
 * @returns {string} Bundled script
 */
export function getAllScripts() {
  return Object.values(TOOL_SCRIPTS).join('\n\n');
}
