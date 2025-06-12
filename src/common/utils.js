/**
 * Common utility functions
 */

// Enhanced clipboard copy functionality with better error handling
async function copyToClipboard(text, onSuccess, onError) {
  try {
    await navigator.clipboard.writeText(text);
    if (onSuccess) onSuccess();
  } catch (err) {
    console.error('Clipboard API failed, trying fallback: ', err);

    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);

    try {
      textArea.focus();
      textArea.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);

      if (successful && onSuccess) {
        onSuccess();
      } else if (onError) {
        onError(new Error('Copy command failed'));
      }
    } catch (fallbackErr) {
      document.body.removeChild(textArea);
      if (onError) onError(fallbackErr);
    }
  }
}

// Show temporary notification
function showNotification(element, message, type = 'success', duration = 2000) {
  const originalText = element.textContent;
  const originalClass = element.className;

  element.textContent = message;
  element.classList.add(`notification-${type}`);

  setTimeout(() => {
    element.textContent = originalText;
    element.className = originalClass;
  }, duration);
}

// Generic error handler
function handleError(error, userMessage = 'An error occurred') {
  console.error('Error:', error);

  // Show user-friendly error message
  const errorDiv = document.getElementById('error-message') || createErrorElement();
  errorDiv.textContent = userMessage;
  errorDiv.style.display = 'block';

  // Auto-hide after 5 seconds
  setTimeout(() => {
    errorDiv.style.display = 'none';
  }, 5000);
}

// Create error display element if it doesn't exist
function createErrorElement() {
  const errorDiv = document.createElement('div');
  errorDiv.id = 'error-message';
  errorDiv.className = 'error-notification';
  errorDiv.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: var(--error-bg, #fff5f5);
    color: var(--error-text, #d33);
    border: 1px solid var(--error-border, #d33);
    padding: 1rem;
    border-radius: 4px;
    box-shadow: var(--shadow, 0 2px 8px rgba(0,0,0,0.1));
    z-index: 10000;
    display: none;
    max-width: 300px;
  `;
  document.body.appendChild(errorDiv);
  return errorDiv;
}

// Debounce function for performance optimization
function debounce(func, wait, immediate) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func(...args);
  };
}

// Format file size in human readable format
function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Validate email format
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

// Export functions for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    copyToClipboard,
    showNotification,
    handleError,
    createErrorElement,
    debounce,
    formatFileSize,
    isValidEmail,
    escapeHtml
  };
}
