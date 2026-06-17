'use client';

import { motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { investorsApi, type Investor } from '@/lib/config-api';

interface Props {
  rows: Investor[];
  canWrite: boolean;
  onChange: () => void;
}

export function InvestorBasicPanel({ rows, canWrite, onChange }: Props) {
  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Investor ID / Client ID</TableHead>
              <TableHead>Full Legal Name</TableHead>
              <TableHead>Date of Birth</TableHead>
              <TableHead>Entity Type</TableHead>
              <TableHead>SSN / TIN</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="py-10 text-center text-muted-foreground">
                  No investors added. Click <strong>Add Investor</strong> to get started.
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
                  <TableCell>
                    {r.dateOfBirth ? new Date(r.dateOfBirth).toLocaleDateString() : '—'}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{r.entityType}</Badge>
                  </TableCell>
                  <TableCell className="font-mono text-xs">{maskSecret(r.ssnTin)}</TableCell>
                  <TableCell>{r.email}</TableCell>
                  <TableCell>{r.phone ?? '—'}</TableCell>
                  <TableCell className="text-center">
                    {canWrite && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => investorsApi.remove(r.id).then(onChange)}
                      >
                        <Trash2 className="h-4 w-4 text-rose-500" />
                      </Button>
                    )}
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

function maskSecret(s?: string | null) {
  if (!s) return '—';
  if (s.length <= 4) return '••••';
  return '•••-••-' + s.slice(-4);
}
