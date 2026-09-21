import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const SECRET = process.env.JWT_SECRET!;
const COOKIE = 'hk_admin_session';

export function signAdminToken(): string {
  return jwt.sign({ admin: true }, SECRET, { expiresIn: '7d' });
}

export function verifyAdminToken(token: string): boolean {
  try {
    const payload = jwt.verify(token, SECRET) as { admin?: boolean };
    return payload.admin === true;
  } catch {
    return false;
  }
}

export async function getAdminSession(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE)?.value;
  if (!token) return false;
  return verifyAdminToken(token);
}

export async function setAdminSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  });
}

export async function clearAdminSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE);
}
