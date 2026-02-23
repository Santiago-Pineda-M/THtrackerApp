/**
 * INFRASTRUCTURE LAYER - Secure Storage Adapter
 * ─────────────────────────────────────────────────────────────────────────────
 * Implementación de IStorage con cifrado AES-GCM usando la Web Crypto API
 * nativa del navegador. SIN dependencias externas.
 *
 * Características:
 *  - Cifrado simétrico AES-GCM 256-bit (estándar de la industria).
 *  - IV (vector de inicialización) aleatorio por cada escritura → dos llamadas
 *    con el mismo valor producen ciphertext diferente, lo que resiste ataques
 *    de texto plano conocido (chosen-plaintext attack).
 *  - La clave de cifrado se deriva de una passphrase usando PBKDF2 con salt
 *    único por instalación, almacenado en localStorage como dato no sensible.
 *  - Los valores se almacenan Base64 en localStorage para compatibilidad.
 *  - API asíncrona (todas las operaciones retornan Promise).
 *
 * ADVERTENCIA DE SEGURIDAD:
 *  Este adaptador protege contra inspección manual del localStorage y usuarios
 *  no técnicos, pero NO ofrece seguridad absoluta en contextos donde el
 *  atacante tiene acceso completo al proceso del navegador (XSS, extensiones
 *  maliciosas). Para tokens OAuth considera además HttpOnly cookies en la API.
 *
 * Uso recomendado: JWT tokens, refresh tokens, datos personales del usuario.
 */

const ALGORITHM = 'AES-GCM';
const KEY_LENGTH = 256;
const PBKDF2_ITERATIONS = 100_000;
const SALT_KEY = '__sec_salt__';

// ─── Utilidades de encoding ───────────────────────────────────────────────────

function encodeText(text: string): Uint8Array {
    return new TextEncoder().encode(text);
}

function decodeText(buffer: ArrayBuffer): string {
    return new TextDecoder().decode(buffer);
}

function bufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    bytes.forEach((b) => (binary += String.fromCharCode(b)));
    return btoa(binary);
}

function base64ToBuffer(base64: string): ArrayBuffer {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
}

// ─── Gestión del salt ─────────────────────────────────────────────────────────

/**
 * Obtiene o crea un salt aleatorio para esta instalación.
 * El salt es público (no sensible), solo sirve para que la derivación de clave
 * sea única por dispositivo/perfil de Chrome.
 */
function getOrCreateSalt(): Uint8Array {
    const stored = localStorage.getItem(SALT_KEY);
    if (stored) {
        return new Uint8Array(Array.from(atob(stored), (c) => c.charCodeAt(0)));
    }
    const salt = crypto.getRandomValues(new Uint8Array(16));
    localStorage.setItem(SALT_KEY, btoa(String.fromCharCode(...salt)));
    return salt;
}

// ─── Derivación de clave ──────────────────────────────────────────────────────

/**
 * Deriva una CryptoKey AES-GCM a partir de una passphrase usando PBKDF2.
 */
async function deriveKey(passphrase: string, salt: Uint8Array): Promise<CryptoKey> {
    const keyMaterial = await crypto.subtle.importKey(
        'raw',
        encodeText(passphrase) as BufferSource,
        { name: 'PBKDF2' },
        false,
        ['deriveKey'],
    );

    return crypto.subtle.deriveKey(
        {
            name: 'PBKDF2',
            salt: salt as BufferSource,
            iterations: PBKDF2_ITERATIONS,
            hash: 'SHA-256',
        },
        keyMaterial,
        { name: ALGORITHM, length: KEY_LENGTH },
        false,
        ['encrypt', 'decrypt'],
    );
}

// ─── Formato en disco ─────────────────────────────────────────────────────────
// Los datos se almacenan como: "<iv_base64>.<ciphertext_base64>"

const SEPARATOR = '.';

function pack(iv: ArrayBuffer, ciphertext: ArrayBuffer): string {
    return `${bufferToBase64(iv)}${SEPARATOR}${bufferToBase64(ciphertext)}`;
}

function unpack(packed: string): { iv: ArrayBuffer; ciphertext: ArrayBuffer } | null {
    const parts = packed.split(SEPARATOR);
    if (parts.length !== 2) return null;
    return {
        iv: base64ToBuffer(parts[0]),
        ciphertext: base64ToBuffer(parts[1]),
    };
}

// ─── Clase principal ──────────────────────────────────────────────────────────

/**
 * Adaptador de almacenamiento seguro con cifrado AES-GCM.
 *
 * @example
 *   const secureStorage = new SecureStorageAdapter('mi-passphrase-secreta');
 *   await secureStorage.set('accessToken', token);
 *   const token = await secureStorage.get<string>('accessToken');
 */
export class SecureStorageAdapter {
    private readonly prefix: string;
    private readonly passphrase: string;
    private keyCache: CryptoKey | null = null;

    /**
     * @param passphrase Frase secreta para derivar la clave de cifrado.
     *                   Recomendado: leer desde una variable de entorno en build
     *                   (`import.meta.env.VITE_STORAGE_SECRET`).
     * @param prefix     Prefijo para las claves en localStorage. Default: 'sec'.
     */
    constructor(passphrase: string, prefix = 'sec') {
        if (!passphrase || passphrase.trim() === '') {
            throw new Error('[SecureStorageAdapter] La passphrase no puede estar vacía.');
        }
        this.passphrase = passphrase;
        this.prefix = prefix;
    }

    // ─── Helpers privados ─────────────────────────────────────────────────────

    private buildKey(key: string): string {
        return `${this.prefix}:${key}`;
    }

    /** Devuelve la CryptoKey, derivándola la primera vez (lazy + cached). */
    private async getCryptoKey(): Promise<CryptoKey> {
        if (this.keyCache) return this.keyCache;
        const salt = getOrCreateSalt();
        this.keyCache = await deriveKey(this.passphrase, salt);
        return this.keyCache;
    }

    // ─── API pública ──────────────────────────────────────────────────────────

    /**
     * Descifra y retorna el valor asociado a la clave.
     * @returns El valor tipado `T`, o `null` si no existe o el descifrado falla.
     */
    async get<T>(key: string): Promise<T | null> {
        try {
            const raw = localStorage.getItem(this.buildKey(key));
            if (raw === null) return null;

            const unpacked = unpack(raw);
            if (!unpacked) return null;

            const cryptoKey = await this.getCryptoKey();
            const decryptedBuffer = await crypto.subtle.decrypt(
                { name: ALGORITHM, iv: unpacked.iv as BufferSource },
                cryptoKey,
                unpacked.ciphertext as BufferSource,
            );

            return JSON.parse(decodeText(decryptedBuffer)) as T;
        } catch {
            console.warn(`[SecureStorageAdapter] No se pudo descifrar la clave "${key}". El dato puede estar corrupto o la passphrase cambió.`);
            return null;
        }
    }

    /**
     * Cifra el valor y lo persiste en localStorage.
     */
    async set<T>(key: string, value: T): Promise<void> {
        try {
            const cryptoKey = await this.getCryptoKey();
            const iv = crypto.getRandomValues(new Uint8Array(12)); // 96-bit IV recomendado para AES-GCM
            const encoded = encodeText(JSON.stringify(value));

            const ciphertext = await crypto.subtle.encrypt(
                { name: ALGORITHM, iv: iv as BufferSource },
                cryptoKey,
                encoded as BufferSource,
            );

            localStorage.setItem(this.buildKey(key), pack(iv.buffer, ciphertext));
        } catch (error) {
            console.error(`[SecureStorageAdapter] Error al cifrar la clave "${key}":`, error);
        }
    }

    /**
     * Elimina la entrada cifrada asociada a la clave.
     */
    remove(key: string): void {
        localStorage.removeItem(this.buildKey(key));
    }

    /**
     * Elimina TODAS las entradas cifradas con el prefijo de esta instancia.
     */
    clear(): void {
        const keysToRemove: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
            const rawKey = localStorage.key(i);
            if (rawKey?.startsWith(`${this.prefix}:`)) {
                keysToRemove.push(rawKey);
            }
        }
        keysToRemove.forEach((k) => localStorage.removeItem(k));
    }
}
