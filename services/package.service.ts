import type { Incident, Package, PackageStatus } from '@/types';
import { get, patch, post } from './api';

// ─── Package Service ──────────────────────────────────────────────────────────

/** Fetch all packages for a specific driver's route on a given date. */
export async function getPackagesByRoute(routeId: string): Promise<Package[]> {
  return get<Package[]>(`/packages?routeId=${encodeURIComponent(routeId)}`);
}

/** Fetch all packages (useful for the dashboard). */
export async function getAllPackages(): Promise<Package[]> {
  return get<Package[]>('/packages');
}

/** Fetch a single package by ID. */
export async function getPackageById(id: string): Promise<Package> {
  return get<Package>(`/packages/${id}`);
}

/** Update the status of a package and attach optional proof data. */
export async function updatePackageStatus(
  id: string,
  status: PackageStatus,
  patch_data?: Partial<Pick<Package, 'deliveredAt' | 'proofPhotoUri' | 'proofCoordinates'>>,
): Promise<Package> {
  return patch<Package>(`/packages/${id}`, { status, ...patch_data });
}

// ─── Incident Service ─────────────────────────────────────────────────────────

/** Report an incident for a package. */
export async function reportIncident(incident: Omit<Incident, 'id'>): Promise<Incident> {
  return post<Incident>('/incidents', incident);
}

/** Fetch all incidents for a specific package. */
export async function getIncidentsByPackage(packageId: string): Promise<Incident[]> {
  return get<Incident[]>(`/incidents?packageId=${encodeURIComponent(packageId)}`);
}
