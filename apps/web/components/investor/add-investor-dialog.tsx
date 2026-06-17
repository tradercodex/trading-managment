'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  investorsApi,
  type CreateInvestorPayload,
  type InvestorEntityType,
  type FormStatus,
  type W8Status,
  type FatcaClassification,
} from '@/lib/config-api';

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onCreated: () => void;
}

const ENTITY_TYPES: { value: InvestorEntityType; label: string }[] = [
  { value: 'INDIVIDUAL', label: 'Individual' },
  { value: 'LLC', label: 'LLC' },
  { value: 'CORPORATION', label: 'Corporation' },
  { value: 'TRUST', label: 'Trust' },
  { value: 'PARTNERSHIP', label: 'Partnership' },
];

const W9: { value: FormStatus; label: string }[] = [
  { value: 'SUBMITTED', label: 'Submitted' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'NOT_REQUIRED', label: 'Not Required' },
  { value: 'EXPIRED', label: 'Expired' },
];

const W8: { value: W8Status; label: string }[] = [
  { value: 'W8BEN_SUBMITTED', label: 'W-8BEN Submitted' },
  { value: 'W8BENE_SUBMITTED', label: 'W-8BEN-E Submitted' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'NOT_REQUIRED', label: 'Not Required' },
  { value: 'EXPIRED', label: 'Expired' },
];

const FATCA: { value: FatcaClassification; label: string }[] = [
  { value: 'US_PERSON', label: 'US Person' },
  { value: 'NON_US_INDIVIDUAL', label: 'Non-US Individual' },
  { value: 'PFFI', label: 'Participating FFI' },
  { value: 'NPFFI', label: 'Non-Participating FFI' },
  { value: 'EXEMPT', label: 'Exempt' },
];

const emptyForm = (): CreateInvestorPayload => ({
  fullName: '',
  dateOfBirth: '',
  entityType: 'INDIVIDUAL',
  ssnTin: '',
  email: '',
  phone: '',
  kyc: {
    primaryAddress: '',
    mailingAddress: '',
    cityStateZip: '',
    country: '',
    citizenship: '',
    taxResidency: '',
  },
  tax: {
    tinSsnEin: '',
    backupWithholding: false,
  },
});

export function AddInvestorDialog({ open, onOpenChange, onCreated }: Props) {
  const [tab, setTab] = useState<'basic' | 'kyc' | 'tax'>('basic');
  const [form, setForm] = useState<CreateInvestorPayload>(emptyForm());
  const [showSsn, setShowSsn] = useState(false);
  const [showTin, setShowTin] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const reset = () => {
    setTab('basic');
    setForm(emptyForm());
    setError(null);
    setShowSsn(false);
    setShowTin(false);
  };

  const handleOpen = (v: boolean) => {
    if (!v) reset();
    onOpenChange(v);
  };

  const submit = async () => {
    setError(null);
    if (!form.fullName.trim()) return setError('Full legal name is required.');
    if (!form.email.trim()) return setError('Email is required.');
    if (!form.entityType) return setError('Entity type is required.');

    setSubmitting(true);
    try {
      // Strip empty optional fields to keep DTO validation happy
      const payload: CreateInvestorPayload = {
        ...form,
        dateOfBirth: form.dateOfBirth || undefined,
        ssnTin: form.ssnTin || undefined,
        phone: form.phone || undefined,
        kyc: anyKycField(form.kyc) ? form.kyc : undefined,
        tax: anyTaxField(form.tax) ? form.tax : undefined,
      };
      await investorsApi.create(payload);
      handleOpen(false);
      onCreated();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Add Investor</DialogTitle>
          <p className="text-xs text-muted-foreground">
            Fields marked <span className="text-rose-500">*</span> are mandatory · Investor ID is auto-generated.
          </p>
        </DialogHeader>

        <Tabs value={tab} onValueChange={(v) => setTab(v as 'basic' | 'kyc' | 'tax')}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="kyc">KYC Requirements</TabsTrigger>
            <TabsTrigger value="tax">Tax Information</TabsTrigger>
          </TabsList>

          {/* ── Basic ── */}
          <TabsContent value="basic" className="grid grid-cols-2 gap-3 pt-4">
            <Field label="Full Legal Name" required>
              <Input
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                placeholder="e.g. John William Doe"
              />
            </Field>
            <Field label="Date of Birth">
              <Input
                type="date"
                value={form.dateOfBirth ?? ''}
                onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })}
              />
            </Field>
            <Field label="Entity Type" required>
              <Select
                value={form.entityType}
                onValueChange={(v) => setForm({ ...form, entityType: v as InvestorEntityType })}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {ENTITY_TYPES.map((t) => (
                    <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="SSN / TIN" hint="(individual taxpayer ID)">
              <SecretInput
                value={form.ssnTin ?? ''}
                show={showSsn}
                onToggle={() => setShowSsn((s) => !s)}
                onChange={(v) => setForm({ ...form, ssnTin: v })}
                placeholder="e.g. XXX-XX-XXXX"
              />
            </Field>
            <Field label="Email" required>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="e.g. john.doe@email.com"
              />
            </Field>
            <Field label="Phone">
              <Input
                value={form.phone ?? ''}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="e.g. +1 (555) 000-1234"
              />
            </Field>
          </TabsContent>

          {/* ── KYC ── */}
          <TabsContent value="kyc" className="grid grid-cols-2 gap-3 pt-4">
            <Field label="Primary Residential Address" required hint="(No P.O. Box)" full>
              <Input
                value={form.kyc?.primaryAddress ?? ''}
                onChange={(e) => setKyc('primaryAddress', e.target.value)}
                placeholder="e.g. 123 Main Street, Apt 4B"
              />
            </Field>
            <Field label="Mailing Address" hint="(if different)" full>
              <Input
                value={form.kyc?.mailingAddress ?? ''}
                onChange={(e) => setKyc('mailingAddress', e.target.value)}
              />
            </Field>
            <Field label="City / State / ZIP">
              <Input
                value={form.kyc?.cityStateZip ?? ''}
                onChange={(e) => setKyc('cityStateZip', e.target.value)}
                placeholder="e.g. New York, NY 10001"
              />
            </Field>
            <Field label="Country">
              <Input
                value={form.kyc?.country ?? ''}
                onChange={(e) => setKyc('country', e.target.value)}
                placeholder="e.g. United States"
              />
            </Field>
            <Field label="Citizenship">
              <Input
                value={form.kyc?.citizenship ?? ''}
                onChange={(e) => setKyc('citizenship', e.target.value)}
                placeholder="e.g. US Citizen"
              />
            </Field>
            <Field label="Tax Residency" hint="(can be multiple)">
              <Input
                value={form.kyc?.taxResidency ?? ''}
                onChange={(e) => setKyc('taxResidency', e.target.value)}
                placeholder="e.g. USA, UK"
              />
            </Field>
          </TabsContent>

          {/* ── Tax ── */}
          <TabsContent value="tax" className="grid grid-cols-2 gap-3 pt-4">
            <Field label="TIN / SSN / EIN">
              <SecretInput
                value={form.tax?.tinSsnEin ?? ''}
                show={showTin}
                onToggle={() => setShowTin((s) => !s)}
                onChange={(v) => setTax('tinSsnEin', v)}
                placeholder="e.g. 12-3456789"
              />
            </Field>
            <Field label="W-9 Form Status" hint="(for US persons)">
              <Select
                value={form.tax?.w9Status ?? ''}
                onValueChange={(v) => setTax('w9Status', v as FormStatus)}
              >
                <SelectTrigger><SelectValue placeholder="— Select —" /></SelectTrigger>
                <SelectContent>
                  {W9.map((o) => (
                    <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="W-8BEN / W-8BEN-E" hint="(for non-US investors)">
              <Select
                value={form.tax?.w8Status ?? ''}
                onValueChange={(v) => setTax('w8Status', v as W8Status)}
              >
                <SelectTrigger><SelectValue placeholder="— Select —" /></SelectTrigger>
                <SelectContent>
                  {W8.map((o) => (
                    <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="FATCA Classification">
              <Select
                value={form.tax?.fatca ?? ''}
                onValueChange={(v) => setTax('fatca', v as FatcaClassification)}
              >
                <SelectTrigger><SelectValue placeholder="— Select —" /></SelectTrigger>
                <SelectContent>
                  {FATCA.map((o) => (
                    <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Backup Withholding">
              <Select
                value={form.tax?.backupWithholding ? 'YES' : 'NO'}
                onValueChange={(v) => setTax('backupWithholding', v === 'YES')}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="NO">No</SelectItem>
                  <SelectItem value="YES">Yes</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </TabsContent>
        </Tabs>

        {error && (
          <div className="rounded-md border border-destructive/30 bg-destructive/10 p-2 text-sm text-destructive">
            {error}
          </div>
        )}

        <DialogFooter className="flex items-center justify-between gap-2 sm:justify-between">
          <div className="flex gap-2">
            {tab !== 'basic' && (
              <Button
                variant="outline"
                onClick={() => setTab(tab === 'tax' ? 'kyc' : 'basic')}
              >
                ← Previous
              </Button>
            )}
            {tab !== 'tax' && (
              <Button
                onClick={() => setTab(tab === 'basic' ? 'kyc' : 'tax')}
                className="bg-gradient-to-r from-sky-500 to-fuchsia-500 text-white"
              >
                Next →
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => handleOpen(false)}>Cancel</Button>
            {tab === 'tax' && (
              <Button onClick={submit} disabled={submitting}>
                {submitting ? 'Adding…' : 'Add Investor'}
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  function setKyc<K extends keyof NonNullable<CreateInvestorPayload['kyc']>>(key: K, value: NonNullable<CreateInvestorPayload['kyc']>[K]) {
    setForm((f) => ({ ...f, kyc: { ...(f.kyc as NonNullable<CreateInvestorPayload['kyc']>), [key]: value } }));
  }
  function setTax<K extends keyof NonNullable<CreateInvestorPayload['tax']>>(key: K, value: NonNullable<CreateInvestorPayload['tax']>[K]) {
    setForm((f) => ({ ...f, tax: { ...(f.tax as NonNullable<CreateInvestorPayload['tax']>), [key]: value } }));
  }
}

function anyKycField(k?: CreateInvestorPayload['kyc']) {
  if (!k) return false;
  return Object.values(k).some((v) => v && String(v).trim().length > 0);
}
function anyTaxField(t?: CreateInvestorPayload['tax']) {
  if (!t) return false;
  const { backupWithholding, ...rest } = t;
  if (Object.values(rest).some((v) => v && String(v).trim().length > 0)) return true;
  return !!backupWithholding;
}

function Field({
  label,
  children,
  required,
  hint,
  full,
}: {
  label: string;
  children: React.ReactNode;
  required?: boolean;
  hint?: string;
  full?: boolean;
}) {
  return (
    <div className={`space-y-1.5 ${full ? 'col-span-2' : ''}`}>
      <Label className="text-xs">
        {label}
        {required && <span className="ml-0.5 text-rose-500">*</span>}
        {hint && <span className="ml-1 text-[10px] font-normal text-muted-foreground">{hint}</span>}
      </Label>
      {children}
    </div>
  );
}

function SecretInput({
  value,
  show,
  onToggle,
  onChange,
  placeholder,
}: {
  value: string;
  show: boolean;
  onToggle: () => void;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="relative">
      <Input
        type={show ? 'text' : 'password'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete="off"
        className="pr-9 font-mono"
      />
      <button
        type="button"
        onClick={onToggle}
        className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        tabIndex={-1}
      >
        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
}
