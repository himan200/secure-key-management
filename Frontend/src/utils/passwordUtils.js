import { getAuthToken } from '../api';

// Generate encryption key from auth token
async function getEncryptionKey() {
  const authToken = getAuthToken();
  if (!authToken) throw new Error('No authentication token found');
  
  const encoder = new TextEncoder();
  const tokenBuffer = encoder.encode(authToken);
  
  // Use SHA-256 to derive a consistent key from the auth token
  const hashBuffer = await crypto.subtle.digest('SHA-256', tokenBuffer);
  return crypto.subtle.importKey(
    'raw',
    hashBuffer,
    { name: 'AES-GCM' },
    false,
    ['encrypt', 'decrypt']
  );
}

// Encrypt password before storage/transmission
export async function encryptPassword(password) {
  try {
    const key = await getEncryptionKey();
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    
    const encrypted = await crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv: iv
      },
      key,
      data
    );
    
    return {
      iv: Array.from(iv).join(','),
      data: Array.from(new Uint8Array(encrypted)).join(',')
    };
  } catch (err) {
    console.error('Encryption failed:', err);
    throw new Error('Failed to encrypt password');
  }
}

// Decrypt password for display/use
export async function decryptPassword(encryptedData) {
  try {
    if (!encryptedData?.iv || !encryptedData?.data) {
      throw new Error('Invalid encrypted data format');
    }
    
    const key = await getEncryptionKey();
    const iv = new Uint8Array(encryptedData.iv.split(',').map(Number));
    const data = new Uint8Array(encryptedData.data.split(',').map(Number));
    
    const decrypted = await crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: iv
      },
      key,
      data
    );
    
    return new TextDecoder().decode(decrypted);
  } catch (err) {
    console.error('Decryption failed:', err);
    throw new Error('Failed to decrypt password');
  }
}

// Dictionary of common words for passphrase generation
const WORDS = [
  'apple', 'banana', 'carrot', 'dog', 'elephant', 'flower', 'giraffe', 'house',
  'island', 'jungle', 'kangaroo', 'lion', 'mountain', 'notebook', 'ocean',
  'penguin', 'queen', 'river', 'sunshine', 'tiger', 'umbrella', 'violin',
  'waterfall', 'xylophone', 'yoga', 'zebra'
];

// Generate a secure passphrase
export function generatePassphrase(options = {}) {
  const {
    words = 4,
    separator = '-',
    includeNumber = true
  } = options;

  // Select random words
  const selected = [];
  for (let i = 0; i < words; i++) {
    const randomIndex = crypto.getRandomValues(new Uint8Array(1))[0] % WORDS.length;
    selected.push(WORDS[randomIndex]);
  }

  // Add random number if requested
  if (includeNumber) {
    const randomNum = crypto.getRandomValues(new Uint8Array(1))[0] % 100;
    selected.push(randomNum.toString());
  }

  return selected.join(separator);
}

// Calculate password strength (0-100)
export function calculatePasswordStrength(password) {
  if (!password) return 0;
  
  let strength = 0;
  const length = password.length;
  
  // Length contributes up to 50 points
  strength += Math.min(50, length * 2);
  
  // Character variety contributes up to 50 points
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSymbol = /[^a-zA-Z0-9]/.test(password);
  
  const varietyScore = [hasLower, hasUpper, hasNumber, hasSymbol]
    .filter(Boolean).length * 12.5;
  strength += varietyScore;
  
  // Deduct points for common patterns
  const commonPatterns = [
    '123', 'abc', 'qwerty', 'password', 'admin'
  ];
  
  if (commonPatterns.some(p => password.toLowerCase().includes(p))) {
    strength = Math.max(0, strength - 20);
  }
  
  return Math.min(100, Math.round(strength));
}

// Secure clipboard handling
export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    setTimeout(async () => {
      try {
        await navigator.clipboard.writeText('');
      } catch (clearErr) {
        console.error('Failed to clear clipboard:', clearErr);
      }
    }, 10000); // Clear clipboard after 10 seconds
    return true;
  } catch (err) {
    console.error('Clipboard write failed:', err);
    return false;
  }
}
