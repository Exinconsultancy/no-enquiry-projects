
import { Buffer } from 'buffer';

// Secure password hashing using PBKDF2 (Web Crypto API compatible)
export async function hashPassword(password: string, salt?: Uint8Array): Promise<{ hash: string; salt: string }> {
  const encoder = new TextEncoder();
  const passwordBuffer = encoder.encode(password);
  
  // Generate a random salt if not provided
  const saltBuffer = salt || crypto.getRandomValues(new Uint8Array(16));
  
  // Import the password as a key
  const key = await crypto.subtle.importKey(
    'raw',
    passwordBuffer,
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  );
  
  // Derive bits using PBKDF2
  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: saltBuffer,
      iterations: 100000, // High iteration count for security
      hash: 'SHA-256'
    },
    key,
    256 // 32 bytes = 256 bits
  );
  
  // Convert to hex strings
  const hashArray = Array.from(new Uint8Array(derivedBits));
  const saltArray = Array.from(new Uint8Array(saltBuffer));
  
  return {
    hash: hashArray.map(b => b.toString(16).padStart(2, '0')).join(''),
    salt: saltArray.map(b => b.toString(16).padStart(2, '0')).join('')
  };
}

export async function verifyPassword(password: string, storedHash: string, storedSalt: string): Promise<boolean> {
  try {
    // Convert hex salt back to Uint8Array
    const saltBytes = new Uint8Array(
      storedSalt.match(/.{1,2}/g)?.map(byte => parseInt(byte, 16)) || []
    );
    
    const { hash } = await hashPassword(password, saltBytes);
    return hash === storedHash;
  } catch (error) {
    console.error('Password verification failed:', error);
    return false;
  }
}
