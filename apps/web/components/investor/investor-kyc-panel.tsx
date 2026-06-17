'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { Investor } from '@/lib/config-api';

interface Props {
  rows: Investor[];
}

export function InvestorKycPanel({ rows }: Props) {
  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Investor ID</TableHead>
              <TableHead>Full Legal Name</TableHead>
              <TableHead>Primary Address</TableHead>
              <TableHead>Mailing Address</TableHead>
              <TableHead>City / State / ZIP</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>Citizenship</TableHead>
              <TableHead>Tax Residency</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="py-10 text-center text-muted-foreground">
                  No KYC data. Add an investor and fill the KYC tab.
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
                  <TableCell>{r.kyc?.primaryAddress ?? '—'}</TableCell>
                  <TableCell>{r.kyc?.mailingAddress ?? '—'}</TableCell>
                  <TableCell>{r.kyc?.cityStateZip ?? '—'}</TableCell>
                  <TableCell>
                    {r.kyc?.country ? <Badge variant="secondary">{r.kyc.country}</Badge> : '—'}
                  </TableCell>
                  <TableCell>{r.kyc?.citizenship ?? '—'}</TableCell>
                  <TableCell>{r.kyc?.taxResidency ?? '—'}</TableCell>
                </motion.tr>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
