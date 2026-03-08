import type { Incident, Package, PackageStatus } from '@/types';
import React, { createContext, useCallback, useContext, useReducer } from 'react';

// ─── State Shape ──────────────────────────────────────────────────────────────
interface RouteState {
  packages: Package[];
  incidents: Incident[];
  isLoading: boolean;
  error: string | null;
}

const initialState: RouteState = {
  packages: [],
  incidents: [],
  isLoading: false,
  error: null,
};

// ─── Actions ─────────────────────────────────────────────────────────────────
type RouteAction =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: Package[] }
  | { type: 'FETCH_ERROR'; payload: string }
  | { type: 'UPDATE_PACKAGE_STATUS'; payload: { id: string; status: PackageStatus; data?: Partial<Package> } }
  | { type: 'ADD_INCIDENT'; payload: Incident };

// ─── Reducer ──────────────────────────────────────────────────────────────────
function routeReducer(state: RouteState, action: RouteAction): RouteState {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, isLoading: true, error: null };

    case 'FETCH_SUCCESS':
      return { ...state, isLoading: false, packages: action.payload };

    case 'FETCH_ERROR':
      return { ...state, isLoading: false, error: action.payload };

    case 'UPDATE_PACKAGE_STATUS':
      return {
        ...state,
        packages: state.packages.map((pkg) =>
          pkg.id === action.payload.id
            ? { ...pkg, status: action.payload.status, ...action.payload.data }
            : pkg,
        ),
      };

    case 'ADD_INCIDENT':
      return { ...state, incidents: [...state.incidents, action.payload] };

    default:
      return state;
  }
}

// ─── Context Shape ────────────────────────────────────────────────────────────
interface RouteContextValue extends RouteState {
  loadPackages: (packages: Package[]) => void;
  setLoading: () => void;
  setError: (message: string) => void;
  updatePackageStatus: (
    id: string,
    status: PackageStatus,
    extra?: Partial<Package>,
  ) => void;
  addIncident: (incident: Incident) => void;
  pendingCount: number;
  deliveredCount: number;
}

// ─── Context ──────────────────────────────────────────────────────────────────
const RouteContext = createContext<RouteContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────
export function RouteProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(routeReducer, initialState);

  const loadPackages = useCallback((packages: Package[]) => {
    dispatch({ type: 'FETCH_SUCCESS', payload: packages });
  }, []);

  const setLoading = useCallback(() => {
    dispatch({ type: 'FETCH_START' });
  }, []);

  const setError = useCallback((message: string) => {
    dispatch({ type: 'FETCH_ERROR', payload: message });
  }, []);

  const updatePackageStatus = useCallback(
    (id: string, status: PackageStatus, extra?: Partial<Package>) => {
      dispatch({ type: 'UPDATE_PACKAGE_STATUS', payload: { id, status, data: extra } });
    },
    [],
  );

  const addIncident = useCallback((incident: Incident) => {
    dispatch({ type: 'ADD_INCIDENT', payload: incident });
  }, []);

  const pendingCount = state.packages.filter((p) => p.status === 'pending').length;
  const deliveredCount = state.packages.filter((p) => p.status === 'delivered').length;

  return (
    <RouteContext.Provider
      value={{
        ...state,
        loadPackages,
        setLoading,
        setError,
        updatePackageStatus,
        addIncident,
        pendingCount,
        deliveredCount,
      }}
    >
      {children}
    </RouteContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useRoute(): RouteContextValue {
  const ctx = useContext(RouteContext);
  if (!ctx) throw new Error('useRoute must be used within RouteProvider');
  return ctx;
}
