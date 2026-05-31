// Configuration & Users API helpers
import { api } from './api';

// ─── Funds ───────────────────────────────
export interface Fund {
  id: string;
  amcName: string;
  fundName: string;
  reportingCurrency: string;
  rankingMethod: 'FIFO' | 'LIFO' | 'MFIFO';
  createdAt: string;
}
export const fundsApi = {
  list: () => api<Fund[]>('/api/configuration/funds'),
  create: (body: Omit<Fund, 'id' | 'createdAt'>) =>
    api<Fund>('/api/configuration/funds', { method: 'POST', body: JSON.stringify(body) }),
  remove: (id: string) =>
    api<{ success: true }>(`/api/configuration/funds/${id}`, { method: 'DELETE' }),
};

// ─── Custodians ──────────────────────────
export interface Custodian {
  id: string;
  fundId?: string | null;
  fundName: string;
  custodianName: string;
  accountNumber: string;
  reportingCurrency: string;
  apiKey?: string | null;
  secretKey?: string | null;
  passphrase?: string | null;
}
export const custodiansApi = {
  list: () => api<Custodian[]>('/api/configuration/custodians'),
  create: (body: Omit<Custodian, 'id'>) =>
    api<Custodian>('/api/configuration/custodians', { method: 'POST', body: JSON.stringify(body) }),
  remove: (id: string) =>
    api<{ success: true }>(`/api/configuration/custodians/${id}`, { method: 'DELETE' }),
};

// ─── Asset Classes ───────────────────────
export type PrimaryAssetClass =
  | 'EQUITIES'
  | 'FUTURES'
  | 'OPTIONS'
  | 'CRYPTOCURRENCIES'
  | 'FIXED_INCOME';

export interface AssetClass {
  id: string;
  primary: PrimaryAssetClass;
  secondary: string;
  valuationSource: string;
}
export const assetClassesApi = {
  list: () => api<AssetClass[]>('/api/configuration/asset-classes'),
  create: (body: Omit<AssetClass, 'id'>) =>
    api<AssetClass>('/api/configuration/asset-classes', { method: 'POST', body: JSON.stringify(body) }),
  remove: (id: string) =>
    api<{ success: true }>(`/api/configuration/asset-classes/${id}`, { method: 'DELETE' }),
};

// ─── Pre Defines ─────────────────────────
export interface PreDefine {
  id: string;
  category: string;
  code: string;
  label: string;
  description?: string | null;
}
export const preDefinesApi = {
  list: () => api<PreDefine[]>('/api/configuration/pre-defines'),
  create: (body: Omit<PreDefine, 'id'>) =>
    api<PreDefine>('/api/configuration/pre-defines', { method: 'POST', body: JSON.stringify(body) }),
  remove: (id: string) =>
    api<{ success: true }>(`/api/configuration/pre-defines/${id}`, { method: 'DELETE' }),
};

// ─── Chart of Accounts ───────────────────
export type AccountType = 'ASSET' | 'LIABILITY' | 'EQUITY' | 'REVENUE' | 'EXPENSE';
export interface ChartOfAccount {
  id: string;
  code: string;
  name: string;
  type: AccountType;
  parentCode?: string | null;
  currency: string;
  description?: string | null;
}
export const chartOfAccountsApi = {
  list: () => api<ChartOfAccount[]>('/api/configuration/chart-of-accounts'),
  create: (body: Omit<ChartOfAccount, 'id'>) =>
    api<ChartOfAccount>('/api/configuration/chart-of-accounts', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  remove: (id: string) =>
    api<{ success: true }>(`/api/configuration/chart-of-accounts/${id}`, { method: 'DELETE' }),
};

// ─── Users (extended for Configuration → User Management) ────────────
export interface ManagedUser {
  id: string;
  email: string;
  username: string | null;
  fullName: string | null;
  employeeId: string | null;
  status: 'ACTIVE' | 'INACTIVE' | 'LOCKED';
  modules: string[];
  isActive: boolean;
  createdBy: string | null;
  createdAt: string;
  roles: { role: { id: string; name: string } }[];
  fundAllocations: { fund: { id: string; fundName: string; amcName: string } }[];
}

export interface CreateUserPayload {
  email?: string;
  username?: string;
  fullName?: string;
  employeeId?: string;
  password?: string;
  roleName?: string;
  status?: 'ACTIVE' | 'INACTIVE' | 'LOCKED';
  modules?: string[];
  fundIds?: string[];
}

export const usersApi = {
  list: () => api<ManagedUser[]>('/api/users'),
  create: (body: CreateUserPayload) =>
    api<ManagedUser>('/api/users', { method: 'POST', body: JSON.stringify(body) }),
  remove: (id: string) => api<{ success: true }>(`/api/users/${id}`, { method: 'DELETE' }),
};
