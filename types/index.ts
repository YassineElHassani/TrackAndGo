// ─── Package ────────────────────────────────────────────────────────────────

export type PackageStatus = 'pending' | 'delivered' | 'failed';

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface Package {
  id: string;
  trackingNumber: string;
  barcode: string;
  recipientName: string;
  recipientPhone?: string;
  address: string;
  city: string;
  coordinates: Coordinates;
  status: PackageStatus;
  deliveryInstructions?: string;
  scheduledTime: string;       // ISO 8601
  deliveredAt?: string;        // ISO 8601, set when status → delivered
  proofPhotoUri?: string;
  proofCoordinates?: Coordinates;
  weight?: number;             // kg
}

// ─── Incident ────────────────────────────────────────────────────────────────

export type IncidentType = 'absent' | 'damaged' | 'refused' | 'other';

export interface Incident {
  id: string;
  packageId: string;
  type: IncidentType;
  comment: string;
  photoUri?: string;
  coordinates?: Coordinates;
  timestamp: string;           // ISO 8601
}

// ─── Driver ──────────────────────────────────────────────────────────────────

export interface Driver {
  id: string;
  name: string;
  email: string;
  phone?: string;
  vehiclePlate?: string;
}

// ─── Route ───────────────────────────────────────────────────────────────────

export interface DeliveryRoute {
  id: string;
  driverId: string;
  date: string;                // ISO 8601 date only (YYYY-MM-DD)
  packages: Package[];
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthSession {
  driver: Driver;
  token: string;
}