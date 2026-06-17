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

// ═══════════════════════════════════════════════════════════════
// INVESTOR API
// ═══════════════════════════════════════════════════════════════
export type InvestorEntityType = 'INDIVIDUAL' | 'LLC' | 'CORPORATION' | 'TRUST' | 'PARTNERSHIP';
export type FormStatus = 'SUBMITTED' | 'PENDING' | 'NOT_REQUIRED' | 'EXPIRED';
export type W8Status =
  | 'W8BEN_SUBMITTED'
  | 'W8BENE_SUBMITTED'
  | 'PENDING'
  | 'NOT_REQUIRED'
  | 'EXPIRED';
export type FatcaClassification =
  | 'US_PERSON'
  | 'NON_US_INDIVIDUAL'
  | 'PFFI'
  | 'NPFFI'
  | 'EXEMPT';

export interface InvestorKyc {
  primaryAddress: string;
  mailingAddress?: string | null;
  cityStateZip: string;
  country: string;
  citizenship: string;
  taxResidency?: string | null;
}

export interface InvestorTax {
  tinSsnEin?: string | null;
  w9Status?: FormStatus | null;
  w8Status?: W8Status | null;
  fatca?: FatcaClassification | null;
  backupWithholding?: boolean;
}

export interface Investor {
  id: string;
  investorId: string;
  fullName: string;
  dateOfBirth?: string | null;
  entityType: InvestorEntityType;
  ssnTin?: string | null;
  email: string;
  phone?: string | null;
  kyc: InvestorKyc | null;
  tax: InvestorTax | null;
  createdAt: string;
}

export interface CreateInvestorPayload {
  fullName: string;
  dateOfBirth?: string;
  entityType: InvestorEntityType;
  ssnTin?: string;
  email: string;
  phone?: string;
  kyc?: InvestorKyc;
  tax?: InvestorTax;
}

export const investorsApi = {
  list: (search?: string) =>
    api<Investor[]>(`/api/investors${search ? `?search=${encodeURIComponent(search)}` : ''}`),
  create: (body: CreateInvestorPayload) =>
    api<Investor>('/api/investors', { method: 'POST', body: JSON.stringify(body) }),
  update: (id: string, body: Partial<CreateInvestorPayload>) =>
    api<Investor>(`/api/investors/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  remove: (id: string) =>
    api<{ success: true }>(`/api/investors/${id}`, { method: 'DELETE' }),
};

// ═══════════════════════════════════════════════════════════════
// VALUATION API — Securities Master, Market Prices, Exchange Rates
// ═══════════════════════════════════════════════════════════════
export type SecurityType = 'EQUITY' | 'FUTURE' | 'OPTION' | 'CRYPTO' | 'BOND' | 'CASH' | 'OTHER';

export interface Security {
  id: string;
  smId: string;
  type: SecurityType;
  ticker: string;
  name: string;
  assetClass: string;
  exchange?: string | null;
  currency: string;
  multiplier: string | number;
  valuationSource?: string | null;
  valuationSourceId?: string | null;
}

export interface MarketPrice {
  id: string;
  securityId?: string | null;
  ticker: string;
  name: string;
  assetClass: string;
  currency: string;
  price: string | number;
  priceDate: string;
  source?: string | null;
  sourceId?: string | null;
}

export interface ExchangeRate {
  id: string;
  currency: string;
  symbol?: string | null;
  rate: string | number;
  rateDate: string;
  source?: string | null;
  sourceId?: string | null;
}

export const securitiesApi = {
  list: () => api<Security[]>('/api/valuation/securities'),
  create: (body: Omit<Security, 'id' | 'smId'>) =>
    api<Security>('/api/valuation/securities', { method: 'POST', body: JSON.stringify(body) }),
  remove: (id: string) =>
    api<{ success: true }>(`/api/valuation/securities/${id}`, { method: 'DELETE' }),
};

export const marketPricesApi = {
  list: () => api<MarketPrice[]>('/api/valuation/market-prices'),
  create: (body: Omit<MarketPrice, 'id' | 'securityId'>) =>
    api<MarketPrice>('/api/valuation/market-prices', { method: 'POST', body: JSON.stringify(body) }),
  remove: (id: string) =>
    api<{ success: true }>(`/api/valuation/market-prices/${id}`, { method: 'DELETE' }),
};

export const exchangeRatesApi = {
  list: () => api<ExchangeRate[]>('/api/valuation/exchange-rates'),
  create: (body: Omit<ExchangeRate, 'id'>) =>
    api<ExchangeRate>('/api/valuation/exchange-rates', { method: 'POST', body: JSON.stringify(body) }),
  remove: (id: string) =>
    api<{ success: true }>(`/api/valuation/exchange-rates/${id}`, { method: 'DELETE' }),
};
