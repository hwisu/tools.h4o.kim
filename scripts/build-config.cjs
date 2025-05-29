#!/usr/bin/env node

/**
 * 빌드 시 설정 파일 생성 스크립트
 * package.json의 버전과 현재 시간을 사용해 config.js 파일을 생성합니다.
 */

const fs = require('fs');
const path = require('path');

// package.json에서 버전 읽기
const packageJsonPath = path.join(__dirname, '..', 'package.json');
let version = '1.0.0';

try {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  version = packageJson.version || '1.0.0';
} catch (error) {
  console.warn('Warning: Could not read package.json, using default version');
}

// 현재 시간을 빌드 시간으로 사용
const buildTime = new Date().toISOString();

// Git 커밋 해시 가져오기 (선택사항)
let gitHash = '';
try {
  const { execSync } = require('child_process');
  gitHash = execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim();
} catch (error) {
  console.warn('Warning: Could not get git hash');
}

// 설정 객체 생성
const config = {
  version: version,
  buildTime: buildTime,
  gitHash: gitHash,
  name: 'tools.h4o.kim',
  description: 'Miscellaneous web tools for daily use - JSON formatter, text counter, image converter, and more'
};

// config.js 파일 내용 생성
const configFileContent = `// 이 파일은 빌드 시 자동 생성됩니다.
// 수동으로 편집하지 마세요.
// Generated at: ${buildTime}

export const APP_CONFIG = ${JSON.stringify(config, null, 2)};
`;

// src/config.js 파일에 쓰기
const configFilePath = path.join(__dirname, '..', 'src', 'config.js');
fs.writeFileSync(configFilePath, configFileContent, 'utf8');

console.log(`✅ Config file generated successfully!`);
console.log(`   Version: ${version}`);
console.log(`   Build time: ${buildTime}`);
if (gitHash) {
  console.log(`   Git hash: ${gitHash}`);
}
console.log(`   File: ${configFilePath}`);
