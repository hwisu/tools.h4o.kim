let generatedPassword = '';

// Character sets
const charSets = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
  spaces: ' ',
  similar: '0Ol1I'
};

// Common words for passphrase generation
const commonWords = [
  'apple', 'beach', 'chair', 'dance', 'eagle', 'flame', 'grape', 'house', 'island', 'jungle',
  'knife', 'lemon', 'mouse', 'night', 'ocean', 'piano', 'queen', 'river', 'stone', 'tiger',
  'uncle', 'voice', 'water', 'youth', 'zebra', 'bread', 'cloud', 'dream', 'earth', 'field',
  'glass', 'heart', 'image', 'light', 'magic', 'north', 'paper', 'quiet', 'smile', 'table',
  'urban', 'value', 'world', 'young', 'brave', 'clean', 'fresh', 'green', 'happy', 'lucky',
  'peace', 'quick', 'smart', 'sweet', 'trust', 'unity', 'vital', 'warm', 'bright', 'calm',
  'deep', 'easy', 'fair', 'good', 'high', 'kind', 'long', 'nice', 'open', 'pure',
  'rich', 'safe', 'true', 'wise', 'bold', 'cool', 'fast', 'free', 'glad', 'hope',
  'jazz', 'keen', 'live', 'mild', 'neat', 'oval', 'pink', 'rare', 'soft', 'tall'
];

// Initialize
document.addEventListener('DOMContentLoaded', function() {
  const lengthSlider = document.getElementById('length');
  const lengthValue = document.getElementById('lengthValue');
  const wordCountSlider = document.getElementById('wordCount');
  const wordCountValue = document.getElementById('wordCountValue');
  const passwordTypeRadios = document.querySelectorAll('input[name="passwordType"]');

  lengthSlider.addEventListener('input', function() {
    lengthValue.textContent = this.value;
  });

  wordCountSlider.addEventListener('input', function() {
    wordCountValue.textContent = this.value;
  });

  // Handle password type switching
  passwordTypeRadios.forEach(radio => {
    radio.addEventListener('change', function() {
      const randomOptions = document.getElementById('randomOptions');
      const passphraseOptions = document.getElementById('passphraseOptions');

      if (this.value === 'passphrase') {
        randomOptions.style.display = 'none';
        passphraseOptions.style.display = 'block';
      } else {
        randomOptions.style.display = 'block';
        passphraseOptions.style.display = 'none';
      }

      // Regenerate password when type changes
      generate();
    });
  });

  // Generate initial password
  generate();
});

function generate() {
  const passwordType = document.querySelector('input[name="passwordType"]:checked').value;

  if (passwordType === 'passphrase') {
    generatePassphrase();
  } else {
    generateRandomPassword();
  }
}

function generateRandomPassword() {
  const length = parseInt(document.getElementById('length').value);
  const includeUppercase = document.getElementById('uppercase').checked;
  const includeLowercase = document.getElementById('lowercase').checked;
  const includeNumbers = document.getElementById('numbers').checked;
  const includeSymbols = document.getElementById('symbols').checked;
  const includeSpaces = document.getElementById('spaces').checked;
  const excludeSimilar = document.getElementById('excludeSimilar').checked;

  // Build character set
  let charset = '';
  if (includeUppercase) charset += charSets.uppercase;
  if (includeLowercase) charset += charSets.lowercase;
  if (includeNumbers) charset += charSets.numbers;
  if (includeSymbols) charset += charSets.symbols;
  if (includeSpaces) charset += charSets.spaces;

  if (!charset) {
    alert('Please select at least one character type');
    return;
  }

  // Remove similar characters if requested
  if (excludeSimilar) {
    for (let char of charSets.similar) {
      charset = charset.replace(new RegExp(char, 'g'), '');
    }
  }

  // Generate password
  generatedPassword = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    generatedPassword += charset[randomIndex];
  }

  displayPassword();
}

function generatePassphrase() {
  const wordCount = parseInt(document.getElementById('wordCount').value);
  const capitalizeWords = document.getElementById('capitalizeWords').checked;
  const addNumbers = document.getElementById('addNumbers').checked;
  const addSymbols = document.getElementById('addSymbols').checked;
  const separator = document.getElementById('separator').value;

  // Select random words
  const selectedWords = [];
  for (let i = 0; i < wordCount; i++) {
    const randomIndex = Math.floor(Math.random() * commonWords.length);
    let word = commonWords[randomIndex];

    if (capitalizeWords) {
      word = word.charAt(0).toUpperCase() + word.slice(1);
    }

    selectedWords.push(word);
  }

  // Join words with separator
  generatedPassword = selectedWords.join(separator);

  // Add numbers if requested
  if (addNumbers) {
    const randomNumber = Math.floor(Math.random() * 9999) + 1;
    generatedPassword += randomNumber;
  }

  // Add symbols if requested
  if (addSymbols) {
    const symbols = '!@#$%^&*';
    const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
    generatedPassword += randomSymbol;
  }

  displayPassword();
}

function displayPassword() {
  // Display password
  const outputDiv = document.getElementById('passwordOutput');
  outputDiv.textContent = generatedPassword;
  outputDiv.style.display = 'block';

  // Enable copy button
  document.getElementById('copyBtn').disabled = false;

  // Calculate and display strength
  calculateStrength(generatedPassword);
}

function copyPassword() {
  if (!generatedPassword) return;

  navigator.clipboard.writeText(generatedPassword).then(() => {
    const copyBtn = document.getElementById('copyBtn');
    const originalText = copyBtn.textContent;
    copyBtn.textContent = 'Copied!';
    copyBtn.style.background = '#28a745';

    setTimeout(() => {
      copyBtn.textContent = originalText;
      copyBtn.style.background = '';
    }, 2000);
  }).catch(err => {
    console.error('Failed to copy: ', err);
    alert('Failed to copy to clipboard');
  });
}

function calculateStrength(password) {
  const strengthMeter = document.getElementById('strengthMeter');
  const strengthFill = document.getElementById('strengthFill');
  const strengthText = document.getElementById('strengthText');
  const strengthDetails = document.getElementById('strengthDetails');

  let score = 0;
  let feedback = [];
  let entropy = 0;

  // NIST 2024 기준: 길이가 가장 중요한 요소
  const length = password.length;

  // 길이 기반 점수 (NIST 권장: 최소 15자, 이상적으로는 20자 이상)
  if (length >= 8) score += 1;
  if (length >= 12) score += 2;
  if (length >= 15) score += 3; // NIST 2024 권장 최소 길이
  if (length >= 20) score += 2; // 추가 보너스
  if (length >= 25) score += 1; // 최고 길이 보너스

  // 엔트로피 계산 (문자 집합 크기 기반)
  let charsetSize = 0;
  let hasLower = /[a-z]/.test(password);
  let hasUpper = /[A-Z]/.test(password);
  let hasNumbers = /[0-9]/.test(password);
  let hasSymbols = /[^a-zA-Z0-9]/.test(password);
  let hasSpaces = /\s/.test(password);

  if (hasLower) charsetSize += 26;
  if (hasUpper) charsetSize += 26;
  if (hasNumbers) charsetSize += 10;
  if (hasSymbols) charsetSize += 32; // 일반적인 특수문자 수
  if (hasSpaces) charsetSize += 1;

  // 엔트로피 = log2(charsetSize^length)
  if (charsetSize > 0) {
    entropy = length * Math.log2(charsetSize);
  }

  // 엔트로피 기반 점수 (NIST 권장: 최소 112비트)
  if (entropy >= 50) score += 1;
  if (entropy >= 80) score += 1;
  if (entropy >= 112) score += 2; // NIST 2024 권장 최소 엔트로피
  if (entropy >= 150) score += 1;

  // 패턴 감지 및 감점
  let patternPenalty = 0;

  // 반복 패턴 감지
  const repeatingPattern = /(.{2,})\1{2,}/.test(password);
  if (repeatingPattern) {
    patternPenalty += 2;
    feedback.push('Repeating patterns detected');
  }

  // 순차적 문자 감지 (abc, 123 등)
  const sequential = /(abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz|012|123|234|345|456|567|678|789)/i.test(password);
  if (sequential) {
    patternPenalty += 1;
    feedback.push('Sequential characters detected');
  }

  // 키보드 패턴 감지
  const keyboardPattern = /(qwer|asdf|zxcv|qaz|wsx|edc|rfv|tgb|yhn|ujm|ik|ol|p)/i.test(password);
  if (keyboardPattern) {
    patternPenalty += 1;
    feedback.push('Keyboard patterns detected');
  }

  // 일반적인 약한 패스워드 패턴
  const commonWeak = /(password|123456|qwerty|admin|login|welcome|letmein|monkey|dragon|master)/i.test(password);
  if (commonWeak) {
    patternPenalty += 3;
    feedback.push('Common weak password patterns detected');
  }

  // 패턴 감점 적용
  score = Math.max(0, score - patternPenalty);

  // 다양성 보너스 (하지만 길이만큼 중요하지 않음)
  let diversityBonus = 0;
  if (hasLower && hasUpper) diversityBonus += 0.5;
  if ((hasLower || hasUpper) && hasNumbers) diversityBonus += 0.5;
  if ((hasLower || hasUpper || hasNumbers) && hasSymbols) diversityBonus += 0.5;
  if (hasSpaces) diversityBonus += 0.5; // NIST는 공백 사용을 권장

  score += diversityBonus;

  // 최종 강도 결정 (NIST 2024 기준 반영)
  let strength, color, percentage;

  if (score < 3 || length < 8) {
    strength = 'Very Weak';
    color = 'strength-weak';
    percentage = 15;
    feedback.unshift('Very weak: Use at least 8 characters');
  } else if (score < 5 || length < 12) {
    strength = 'Weak';
    color = 'strength-weak';
    percentage = 30;
    feedback.unshift('Weak: 12+ characters recommended');
  } else if (score < 7 || length < 15) {
    strength = 'Fair';
    color = 'strength-fair';
    percentage = 50;
    feedback.unshift('Fair: Consider NIST recommended minimum of 15+ characters');
  } else if (score < 9 || entropy < 112) {
    strength = 'Good';
    color = 'strength-good';
    percentage = 75;
    feedback.unshift('Good: Meets security standards');
  } else {
    strength = 'Excellent';
    color = 'strength-strong';
    percentage = 100;
    feedback.unshift('Excellent: Very strong password');
  }

  // 추가 권장사항
  if (length < 15) {
    feedback.push('NIST 2024 recommendation: Use 15+ characters');
  }
  if (length >= 15 && length < 20) {
    feedback.push('Consider 20+ characters for stronger security');
  }

  // Check if this is a passphrase (contains spaces or common separators)
  const isPassphrase = /[\s\-_\.]/.test(password) && password.length > 10;

  if (!isPassphrase && !hasSpaces && length >= 15) {
    feedback.push('Consider using a passphrase with spaces for better memorability');
  }

  if (entropy < 112) {
    feedback.push('Use more character types to increase entropy');
  }

  // Passphrase-specific recommendations
  if (isPassphrase) {
    feedback.push('Good choice using a passphrase format!');
    if (!/\d/.test(password)) {
      feedback.push('Consider adding numbers for extra security');
    }
  }

  // UI update
  strengthFill.className = `strength-fill ${color}`;
  strengthFill.style.width = `${percentage}%`;
  strengthText.innerHTML = `Strength: ${strength} <small>(Entropy: ${Math.round(entropy)} bits)</small>`;
  strengthDetails.innerHTML = feedback.map(f => `• ${f}`).join('<br>');

  strengthMeter.style.display = 'block';
}
