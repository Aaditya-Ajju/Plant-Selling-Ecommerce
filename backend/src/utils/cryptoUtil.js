require('dotenv').config(); // Load .env variables
const crypto = require('crypto');

// Load the 32-byte secret key from environment variable
const SECRET_KEY = Buffer.from(process.env.SECRET_KEY, 'hex'); // Convert hex to Buffer

// Validate key length
if (SECRET_KEY.length !== 32) {
    throw new Error(`Invalid SECRET_KEY length. Expected 32 bytes (64 hex characters), got ${SECRET_KEY.length} bytes`);
}

const IV_LENGTH = 16; // AES block size

/**
 * Encrypt a message.
 * @param {string} message - The plaintext message to encrypt.
 * @returns {Object} An object containing the encrypted message and the IV used.
 */
function encryptMessage(message) {
    try {
        const iv = crypto.randomBytes(IV_LENGTH); // Generate a random IV
        const cipher = crypto.createCipheriv('aes-256-cbc', SECRET_KEY, iv);

        let encrypted = cipher.update(message, 'utf8', 'hex');
        encrypted += cipher.final('hex');

        return {
            encryptedMessage: encrypted,
            iv: iv.toString('hex') // Store IV as hex for easier usage
        };
    } catch (error) {
        console.error('Encryption error:', error);
        throw new Error('Failed to encrypt message');
    }
}

/**
 * Decrypt a message.
 * @param {string} encryptedMessage - The encrypted message (in hex).
 * @param {string} ivHex - The initialization vector (in hex).
 * @returns {string} The decrypted plaintext message.
 */
function decryptMessage(encryptedMessage, ivHex) {
    try {
        const iv = Buffer.from(ivHex, 'hex'); // Convert IV back to a buffer
        const decipher = crypto.createDecipheriv('aes-256-cbc', SECRET_KEY, iv);

        let decrypted = decipher.update(encryptedMessage, 'hex', 'utf8');
        decrypted += decipher.final('utf8');

        return decrypted;
    } catch (error) {
        console.error('Decryption error:', error);
        throw new Error('Failed to decrypt message');
    }
}

// Export the functions
module.exports = {
    encryptMessage,
    decryptMessage
};
