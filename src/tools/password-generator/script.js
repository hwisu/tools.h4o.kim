let currentPassword = '';

// Character sets
const charSets = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
  similar: '0Ol1I'
};

// Initialize
document.addEventListener('DOMContentLoaded', function() {
  const lengthSlider = document.getElementById('lengthSlider');
  const lengthValue = document.getElementById('lengthValue');
  const includeNumbers = document.getElementById('includeNumbers');
  const includeSymbols = document.getElementById('includeSymbols');
  const excludeSimilar = document.getElementById('excludeSimilar');

  // Update length value display
  lengthSlider.addEventListener('input', function() {
    lengthValue.textContent = this.value;
    generatePassword();
  });

  // Auto-generate when options change
  includeNumbers.addEventListener('change', generatePassword);
  includeSymbols.addEventListener('change', generatePassword);
  excludeSimilar.addEventListener('change', generatePassword);

  // Generate initial password
  generatePassword();
});

function generatePassword() {
  const length = parseInt(document.getElementById('lengthSlider').value);
  const includeNumbers = document.getElementById('includeNumbers').checked;
  const includeSymbols = document.getElementById('includeSymbols').checked;
  const excludeSimilar = document.getElementById('excludeSimilar').checked;

  // Always include uppercase and lowercase
  let charset = charSets.uppercase + charSets.lowercase;

  if (includeNumbers) charset += charSets.numbers;
  if (includeSymbols) charset += charSets.symbols;

  // Remove similar characters if requested
  if (excludeSimilar) {
    for (let char of charSets.similar) {
      charset = charset.replace(new RegExp(char, 'g'), '');
    }
  }

  // Generate password
  currentPassword = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    currentPassword += charset[randomIndex];
  }

  displayPassword();
  calculateStrength();
}

function displayPassword() {
  const passwordDisplay = document.getElementById('passwordDisplay');
  passwordDisplay.textContent = currentPassword;
  passwordDisplay.classList.remove('copied');
}

function copyPassword() {
  if (!currentPassword) {
    generatePassword();
    return;
  }

  const passwordDisplay = document.getElementById('passwordDisplay');

  // 공통 utils.js의 copyToClipboard 함수 사용
  copyToClipboard(
    currentPassword,
    () => {
      // 성공 시
      passwordDisplay.classList.add('copied');
      setTimeout(() => {
        passwordDisplay.classList.remove('copied');
      }, 2000);
    },
    (error) => {
      // 실패 시
      handleError(error, 'Failed to copy password');
    }
  );
}

function calculateStrength() {
  const strengthMeter = document.getElementById('strengthMeter');
  const strengthFill = document.getElementById('strengthFill');
  const strengthLabel = document.getElementById('strengthLabel');
  const strengthScore = document.getElementById('strengthScore');
  const strengthTips = document.getElementById('strengthTips');

  let score = 0;
  let tips = [];
  let entropy = 0;

  const length = currentPassword.length;

  // Length scoring (most important factor)
  if (length >= 8) score += 1;
  if (length >= 12) score += 2;
  if (length >= 16) score += 2;
  if (length >= 20) score += 1;

  // Character variety
  let charsetSize = 0;
  let hasLower = /[a-z]/.test(currentPassword);
  let hasUpper = /[A-Z]/.test(currentPassword);
  let hasNumbers = /[0-9]/.test(currentPassword);
  let hasSymbols = /[^a-zA-Z0-9]/.test(currentPassword);

  if (hasLower) charsetSize += 26;
  if (hasUpper) charsetSize += 26;
  if (hasNumbers) charsetSize += 10;
  if (hasSymbols) charsetSize += 32;

  // Entropy calculation
  if (charsetSize > 0) {
    entropy = length * Math.log2(charsetSize);
  }

  // Entropy scoring
  if (entropy >= 50) score += 1;
  if (entropy >= 80) score += 1;
  if (entropy >= 112) score += 2;

  // Pattern detection (penalties)
  const repeating = /(.{2,})\1{2,}/.test(currentPassword);
  if (repeating) {
    score -= 2;
    tips.push('Avoid repeating patterns');
  }

  const sequential = /(abc|bcd|cde|123|234|345)/i.test(currentPassword);
  if (sequential) {
    score -= 1;
    tips.push('Avoid sequential characters');
  }

  // Ensure minimum score
  score = Math.max(0, score);

  // Determine strength level
  let strength, className, percentage;

  if (score < 3 || length < 8) {
    strength = 'Weak';
    className = 'strength-weak';
    percentage = 25;
    tips.unshift('Use at least 8 characters');
  } else if (score < 5 || length < 12) {
    strength = 'Fair';
    className = 'strength-fair';
    percentage = 50;
    tips.unshift('Consider 12+ characters');
  } else if (score < 7 || entropy < 80) {
    strength = 'Good';
    className = 'strength-good';
    percentage = 75;
    tips.unshift('Good password strength');
  } else {
    strength = 'Strong';
    className = 'strength-strong';
    percentage = 100;
    tips.unshift('Excellent password strength');
  }

  // Add recommendations
  if (length < 16) {
    tips.push('16+ characters recommended');
  }
  if (!hasNumbers) {
    tips.push('Include numbers for better security');
  }
  if (!hasSymbols) {
    tips.push('Include symbols for maximum security');
  }

  // Update UI
  strengthFill.className = `strength-fill ${className}`;
  strengthFill.style.width = `${percentage}%`;
  strengthLabel.textContent = `Password Strength: ${strength}`;
  strengthScore.textContent = `${Math.round(entropy)} bits entropy`;
  strengthTips.innerHTML = tips.slice(0, 3).map(tip => `• ${tip}`).join('<br>');

  strengthMeter.style.display = 'block';
}

// Make functions global
window.generatePassword = generatePassword;
window.copyPassword = copyPassword;
