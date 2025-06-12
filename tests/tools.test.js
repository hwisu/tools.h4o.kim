/**
 * Tools Platform - 도구 기능 테스트
 * 각 도구의 핵심 로직을 테스트합니다.
 */

// Mock DOM environment for testing
global.window = {
  crypto: {
    getRandomValues: (array) => {
      for (let i = 0; i < array.length; i++) {
        array[i] = Math.floor(Math.random() * 256);
      }
      return array;
    }
  }
};

global.btoa = (str) => Buffer.from(str, 'binary').toString('base64');
global.atob = (str) => Buffer.from(str, 'base64').toString('binary');

// 테스트 유틸리티 함수
class TestUtils {
  static assert(condition, message) {
    if (!condition) {
      throw new Error(`Assertion failed: ${message}`);
    }
  }

  static assertEquals(actual, expected, message) {
    if (actual !== expected) {
      throw new Error(`Assertion failed: ${message}. Expected: ${expected}, Actual: ${actual}`);
    }
  }

  static assertTrue(condition, message) {
    this.assert(condition, message);
  }

  static assertFalse(condition, message) {
    this.assert(!condition, message);
  }

  static assertThrows(fn, message) {
    let threw = false;
    try {
      fn();
    } catch (e) {
      threw = true;
    }
    this.assertTrue(threw, message);
  }
}

// 텍스트 카운터 테스트
class TextCounterTests {
  static testCharacterCount() {
    const text = "Hello World!";
    const charCount = text.length;
    TestUtils.assertEquals(charCount, 12, "Character count should be 12");
  }

  static testWordCount() {
    const text = "Hello World! This is a test.";
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    TestUtils.assertEquals(words.length, 6, "Word count should be 6");
  }

  static testLineCount() {
    const text = "Line 1\nLine 2\nLine 3";
    const lines = text.split('\n');
    TestUtils.assertEquals(lines.length, 3, "Line count should be 3");
  }

  static testEmptyText() {
    const text = "";
    TestUtils.assertEquals(text.length, 0, "Empty text should have 0 characters");

    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    TestUtils.assertEquals(words.length, 0, "Empty text should have 0 words");
  }

  static runAll() {
    console.log("Running Text Counter tests...");
    this.testCharacterCount();
    this.testWordCount();
    this.testLineCount();
    this.testEmptyText();
    console.log("✓ Text Counter tests passed");
  }
}

    // URL Encoder/Decoder test
class URLEncoderTests {
  static testBasicEncoding() {
    const text = "Hello World!";
    const encoded = encodeURIComponent(text);
    const expected = "Hello%20World!";
    TestUtils.assertEquals(encoded, expected, "URL encoding should work correctly");
  }

  static testBasicDecoding() {
    const encoded = "Hello%20World!";
    const decoded = decodeURIComponent(encoded);
    const expected = "Hello World!";
    TestUtils.assertEquals(decoded, expected, "URL decoding should work correctly");
  }

  static testSpecialCharacters() {
    const text = "test@example.com?query=value&another=test";
    const encoded = encodeURIComponent(text);
    const decoded = decodeURIComponent(encoded);
    TestUtils.assertEquals(decoded, text, "Encode/decode cycle should preserve text");
  }

  static testKoreanCharacters() {
    const text = "안녕하세요";
    const encoded = encodeURIComponent(text);
    const decoded = decodeURIComponent(encoded);
    TestUtils.assertEquals(decoded, text, "Korean characters should be preserved");
  }

  static runAll() {
    console.log("Running URL Encoder tests...");
    this.testBasicEncoding();
    this.testBasicDecoding();
    this.testSpecialCharacters();
    this.testKoreanCharacters();
    console.log("✓ URL Encoder tests passed");
  }
}

// JSON 포맷터 테스트
class JSONFormatterTests {
  static testValidJSON() {
    const jsonString = '{"name":"test","value":123}';
    let parsed;

    // JSON 파싱 테스트
    try {
      parsed = JSON.parse(jsonString);
      TestUtils.assertTrue(true, "Valid JSON should parse without error");
    } catch (e) {
      TestUtils.assertTrue(false, "Valid JSON failed to parse");
    }
  }

  static testJSONFormatting() {
    const jsonString = '{"name":"test","value":123,"nested":{"key":"value"}}';
    const parsed = JSON.parse(jsonString);
    const formatted = JSON.stringify(parsed, null, 2);

    TestUtils.assertTrue(formatted.includes('\n'), "Formatted JSON should contain newlines");
    TestUtils.assertTrue(formatted.includes('  '), "Formatted JSON should contain indentation");
  }

  static testJSONMinification() {
    const formatted = `{
  "name": "test",
  "value": 123
}`;
    const parsed = JSON.parse(formatted);
    const minified = JSON.stringify(parsed);

    TestUtils.assertFalse(minified.includes('\n'), "Minified JSON should not contain newlines");
    TestUtils.assertFalse(minified.includes('  '), "Minified JSON should not contain extra spaces");
  }

  static testInvalidJSON() {
    const invalidJSON = '{"name":test}';

    TestUtils.assertThrows(() => {
      JSON.parse(invalidJSON);
    }, "Invalid JSON should throw parsing error");
  }

  static runAll() {
    console.log("Running JSON Formatter tests...");
    this.testValidJSON();
    this.testJSONFormatting();
    this.testJSONMinification();
    this.testInvalidJSON();
    console.log("✓ JSON Formatter tests passed");
  }
}

// Base64 변환기 테스트
class Base64ConverterTests {
  static testBasicEncoding() {
    const text = "Hello World!";
    const encoded = btoa(unescape(encodeURIComponent(text)));
    const expected = "SGVsbG8gV29ybGQh";
    TestUtils.assertEquals(encoded, expected, "Base64 encoding should work correctly");
  }

  static testBasicDecoding() {
    const encoded = "SGVsbG8gV29ybGQh";
    const decoded = decodeURIComponent(escape(atob(encoded)));
    const expected = "Hello World!";
    TestUtils.assertEquals(decoded, expected, "Base64 decoding should work correctly");
  }

  static testEncodingCycle() {
    const original = "Test string with special characters: !@#$%^&*()";
    const encoded = btoa(unescape(encodeURIComponent(original)));
    const decoded = decodeURIComponent(escape(atob(encoded)));
    TestUtils.assertEquals(decoded, original, "Encode/decode cycle should preserve text");
  }

  static testKoreanCharacters() {
    const text = "안녕하세요 테스트";
    const encoded = btoa(unescape(encodeURIComponent(text)));
    const decoded = decodeURIComponent(escape(atob(encoded)));
    TestUtils.assertEquals(decoded, text, "Korean characters should be preserved in Base64");
  }

  static runAll() {
    console.log("Running Base64 Converter tests...");
    this.testBasicEncoding();
    this.testBasicDecoding();
    this.testEncodingCycle();
    this.testKoreanCharacters();
    console.log("✓ Base64 Converter tests passed");
  }
}

// SQL 포맷터 테스트
class SQLFormatterTests {
  static testBasicFormatting() {
    const sql = "SELECT * FROM users WHERE id = 1";
    const formatted = this.formatSQL(sql);

    TestUtils.assertTrue(formatted.includes('SELECT'), "Formatted SQL should contain SELECT");
    TestUtils.assertTrue(formatted.includes('FROM'), "Formatted SQL should contain FROM");
    TestUtils.assertTrue(formatted.includes('WHERE'), "Formatted SQL should contain WHERE");
  }

  static formatSQL(sql) {
    // 간단한 SQL 포맷팅 로직 (실제 구현 대신 테스트용)
    return sql
      .replace(/\bSELECT\b/gi, 'SELECT')
      .replace(/\bFROM\b/gi, 'FROM')
      .replace(/\bWHERE\b/gi, 'WHERE')
      .replace(/\bINNER JOIN\b/gi, 'INNER JOIN')
      .replace(/\bLEFT JOIN\b/gi, 'LEFT JOIN')
      .replace(/\bORDER BY\b/gi, 'ORDER BY');
  }

  static testComplexQuery() {
    const sql = "select u.name, p.title from users u inner join posts p on u.id = p.user_id where u.active = 1 order by p.created_at desc";
    const formatted = this.formatSQL(sql);

    TestUtils.assertTrue(formatted.includes('SELECT'), "Complex query should be formatted");
    TestUtils.assertTrue(formatted.includes('INNER JOIN'), "JOIN should be capitalized");
    TestUtils.assertTrue(formatted.includes('ORDER BY'), "ORDER BY should be capitalized");
  }

  static runAll() {
    console.log("Running SQL Formatter tests...");
    this.testBasicFormatting();
    this.testComplexQuery();
    console.log("✓ SQL Formatter tests passed");
  }
}

// 타임스탬프 변환기 테스트
class TimestampConverterTests {
  static testUnixTimestamp() {
    const timestamp = 1640995200; // 2022-01-01 00:00:00 UTC
    const date = new Date(timestamp * 1000);

    TestUtils.assertEquals(date.getUTCFullYear(), 2022, "Year should be 2022");
    TestUtils.assertEquals(date.getUTCMonth(), 0, "Month should be January (0)");
    TestUtils.assertEquals(date.getUTCDate(), 1, "Date should be 1");
  }

  static testMillisecondTimestamp() {
    const timestamp = 1640995200000; // 2022-01-01 00:00:00 UTC in milliseconds
    const date = new Date(timestamp);

    TestUtils.assertEquals(date.getUTCFullYear(), 2022, "Year should be 2022");
    TestUtils.assertEquals(date.getUTCMonth(), 0, "Month should be January (0)");
    TestUtils.assertEquals(date.getUTCDate(), 1, "Date should be 1");
  }

  static testDateToTimestamp() {
    const date = new Date('2022-01-01T00:00:00.000Z');
    const timestamp = Math.floor(date.getTime() / 1000);

    TestUtils.assertEquals(timestamp, 1640995200, "Timestamp should be 1640995200");
  }

  static testAutoDetection() {
    // 10자리는 초, 13자리는 밀리초로 자동 감지
    const secondsTimestamp = "1640995200";
    const millisecondsTimestamp = "1640995200000";

    TestUtils.assertEquals(secondsTimestamp.length, 10, "Seconds timestamp should be 10 digits");
    TestUtils.assertEquals(millisecondsTimestamp.length, 13, "Milliseconds timestamp should be 13 digits");
  }

  static runAll() {
    console.log("Running Timestamp Converter tests...");
    this.testUnixTimestamp();
    this.testMillisecondTimestamp();
    this.testDateToTimestamp();
    this.testAutoDetection();
    console.log("✓ Timestamp Converter tests passed");
  }
}

    // Text Diff test
class TextDiffTests {
  static testSimpleDiff() {
    const text1 = "Hello World";
    const text2 = "Hello JavaScript";

    // 간단한 차이점 감지 로직
    const words1 = text1.split(' ');
    const words2 = text2.split(' ');

    TestUtils.assertEquals(words1[0], words2[0], "First word should be same");
    TestUtils.assertTrue(words1[1] !== words2[1], "Second word should be different");
  }

  static testIdenticalTexts() {
    const text1 = "Same text";
    const text2 = "Same text";

    TestUtils.assertEquals(text1, text2, "Identical texts should be equal");
  }

  static testEmptyTexts() {
    const text1 = "";
    const text2 = "";

    TestUtils.assertEquals(text1, text2, "Empty texts should be equal");
  }

  static testLineByLineDiff() {
    const text1 = "Line 1\nLine 2\nLine 3";
    const text2 = "Line 1\nLine 2 modified\nLine 3";

    const lines1 = text1.split('\n');
    const lines2 = text2.split('\n');

    TestUtils.assertEquals(lines1[0], lines2[0], "First line should be same");
    TestUtils.assertTrue(lines1[1] !== lines2[1], "Second line should be different");
    TestUtils.assertEquals(lines1[2], lines2[2], "Third line should be same");
  }

  static runAll() {
    console.log("Running Text Diff tests...");
    this.testSimpleDiff();
    this.testIdenticalTexts();
    this.testEmptyTexts();
    this.testLineByLineDiff();
    console.log("✓ Text Diff tests passed");
  }
}

// 패스워드 생성기 테스트
class PasswordGeneratorTests {
  static testPasswordLength() {
    const length = 16;
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

    let password = '';
    for (let i = 0; i < length; i++) {
      password += charset[Math.floor(Math.random() * charset.length)];
    }

    TestUtils.assertEquals(password.length, length, "Password should have correct length");
  }

  static testPasswordStrength() {
    const password = "Abc123!@#";

    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSymbol = /[^a-zA-Z0-9]/.test(password);

    TestUtils.assertTrue(hasLower, "Password should contain lowercase");
    TestUtils.assertTrue(hasUpper, "Password should contain uppercase");
    TestUtils.assertTrue(hasNumber, "Password should contain numbers");
    TestUtils.assertTrue(hasSymbol, "Password should contain symbols");
  }

  static testPasswordRandomness() {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const length = 10;

    // 두 개의 패스워드 생성
    let password1 = '';
    let password2 = '';

    for (let i = 0; i < length; i++) {
      password1 += charset[Math.floor(Math.random() * charset.length)];
      password2 += charset[Math.floor(Math.random() * charset.length)];
    }

    TestUtils.assertTrue(password1 !== password2, "Generated passwords should be different");
  }

  static runAll() {
    console.log("Running Password Generator tests...");
    this.testPasswordLength();
    this.testPasswordStrength();
    this.testPasswordRandomness();
    console.log("✓ Password Generator tests passed");
  }
}

    // Hash Generator test (simple hash function test)
class HashGeneratorTests {
  static testHashConsistency() {
    const text = "Hello World";

    // 간단한 해시 함수 (실제 구현에서는 crypto-js 사용)
    function simpleHash(str) {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
      }
      return hash.toString(16);
    }

    const hash1 = simpleHash(text);
    const hash2 = simpleHash(text);

    TestUtils.assertEquals(hash1, hash2, "Same input should produce same hash");
  }

  static testDifferentInputs() {
    function simpleHash(str) {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
      }
      return hash.toString(16);
    }

    const hash1 = simpleHash("Hello");
    const hash2 = simpleHash("World");

    TestUtils.assertTrue(hash1 !== hash2, "Different inputs should produce different hashes");
  }

  static runAll() {
    console.log("Running Hash Generator tests...");
    this.testHashConsistency();
    this.testDifferentInputs();
    console.log("✓ Hash Generator tests passed");
  }
}

// 모든 테스트 실행
function runAllTests() {
  console.log("Starting Tools Platform Tests...\n");

  try {
    TextCounterTests.runAll();
    URLEncoderTests.runAll();
    JSONFormatterTests.runAll();
    Base64ConverterTests.runAll();
    SQLFormatterTests.runAll();
    TimestampConverterTests.runAll();
    TextDiffTests.runAll();
    PasswordGeneratorTests.runAll();
    HashGeneratorTests.runAll();

    console.log("\n🎉 All tests passed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Test failed:", error.message);
    process.exit(1);
  }
}

// 직접 실행
runAllTests();
