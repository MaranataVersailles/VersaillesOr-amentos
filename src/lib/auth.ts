/**
 * Utilitários de autenticação.
 * Usa SHA-256 via Web Crypto API (compatível com Edge e Node).
 */

const AUTH_SALT = "versailles-orcamentos-2024";

/**
 * Gera um hash SHA-256 da senha + salt.
 * Usado para armazenar um token seguro no cookie ao invés da senha em texto puro.
 */
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + AUTH_SALT);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Verifica se o token do cookie é válido comparando com o hash da senha correta.
 */
export async function verifyToken(token: string): Promise<boolean> {
  const correctPassword = process.env.APP_PASSWORD;
  if (!correctPassword || !token) return false;

  const expectedHash = await hashPassword(correctPassword);
  return token === expectedHash;
}
