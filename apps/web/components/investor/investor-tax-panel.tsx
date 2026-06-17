'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { Investor } from '@/lib/config-api';

interface Props {
  rows: Investor[];
}

const W9_LABEL: Record<string, string> = {
  SUBMITTED: 'Submitted',
  PENDING: 'Pending',
  NOT_REQUIRED: 'Not Required',
  EXPIRED: 'Expired',
};
const W8_LABEL: Record<string, string> = {
  W8BEN_SUBMITTED: 'W-8BEN Submitted',
  W8BENE_SUBMITTED: 'W-8BEN-E Submitted',
  PENDING: 'Pending',
  NOT_REQUIRED: 'Not Required',
  EXPIRED: 'Expired',
};
const FATCA_LABEL: Record<string, string> = {
  US_PERSON: 'US Person',
  NON_US_INDIVIDUAL: 'Non-US Individual',
  PFFI: 'Participating FFI',
  NPFFI: 'Non-Participating FFI',
  EXEMPT: 'Exempt',
};

export function InvestorTaxPanel({ rows }: Props) {
  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Investor ID</TableHead>
              <TableHead>Full Legal Name</TableHead>
              <TableHead>TIN / SSN / EIN</TableHead>
              <TableHead>W-9 Status</TableHead>
              <TableHead>W-8BEN / W-8BEN-E</TableHead>
              <TableHead>FATCA Classification</TableHead>
              <TableHead>Backup Withholding</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="py-10 text-center text-muted-foreground">
                  No tax information yet.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((r) => (
                <motion.tr
                  key={r.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-b hover:bg-muted/50"
                >
                  <TableCell className="font-mono text-xs">{r.investorId}</TableCell>
                  <TableCell className="font-medium">{r.fullName}</TableCell>
                  <TableCell className="font-mono text-xs">{maskTin(r.tax?.tinSsnEin)}</TableCell>
                  <TableCell>{r.tax?.w9Status ? <Badge variant="secondary">{W9_LABEL[r.tax.w9Status]}</Badge> : '—'}</TableCell>
                  <TableCell>{r.tax?.w8Status ? <Badge variant="secondary">{W8_LABEL[r.tax.w8Status]}</Badge> : '—'}</TableCell>
                  <TableCell>{r.tax?.fatca ? <Badge>{FATCA_LABEL[r.tax.fatca]}</Badge> : '—'}</TableCell>
                  <TableCell>
                    <Badge variant={r.tax?.backupWithholding ? 'destructive' : 'secondary'}>
                      {r.tax?.backupWithholding ? 'Yes' : 'No'}
                    </Badge>
                  </TableCell>
                </motion.tr>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function maskTin(s?: string | null) {
  if (!s) return '—';
  if (s.length <= 4) return '••••';
  return '••-•••' + s.slice(-4);
}
