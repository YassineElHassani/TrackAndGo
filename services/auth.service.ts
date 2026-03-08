import type { AuthSession, Driver, LoginCredentials } from '@/types';
import { get, post } from './api';

// ─── Types ────────────────────────────────────────────────────────────────────
interface DriverRecord extends Driver {
  password: string;
}

// ─── Auth Service ─────────────────────────────────────────────────────────────

/**
 * Authenticates a driver against the mock JSON-Server.
 * JSON-Server doesn't support real auth, so we fetch the matching driver
 * and validate the password client-side (acceptable for a mock/dev scenario).
 */
export async function login(credentials: LoginCredentials): Promise<AuthSession> {
  const { email, password } = credentials;

  if (!email.trim() || !password.trim()) {
    throw new Error('Email and password are required.');
  }

  const drivers = await get<DriverRecord[]>(`/drivers?email=${encodeURIComponent(email)}`);

  if (drivers.length === 0) {
    throw new Error('No account found with this email.');
  }

  const driver = drivers[0];

  if (driver.password !== password) {
    throw new Error('Incorrect password.');
  }

  // Strip password before storing in session
  const { password: _omit, ...driverPublic } = driver;

  const session: AuthSession = {
    driver: driverPublic,
    // In a real app this token would come from the server
    token: `mock-token-${driver.id}-${Date.now()}`,
  };

  return session;
}

/**
 * Returns the current driver's profile by ID.
 */
export async function getDriverById(id: string): Promise<Driver> {
  return get<Driver>(`/drivers/${id}`);
}

/**
 * Registers a new driver account.
 */
export async function register(
  name: string,
  email: string,
  password: string,
): Promise<AuthSession> {
  if (!name.trim() || !email.trim() || !password.trim()) {
    throw new Error('All fields are required.');
  }

  // Check for duplicate email
  const existing = await get<DriverRecord[]>(`/drivers?email=${encodeURIComponent(email)}`);
  if (existing.length > 0) {
    throw new Error('An account with this email already exists.');
  }

  const newDriver = await post<DriverRecord>('/drivers', {
    name,
    email,
    password,
  });

  const { password: _omit, ...driverPublic } = newDriver;

  return {
    driver: driverPublic,
    token: `mock-token-${newDriver.id}-${Date.now()}`,
  };
}
