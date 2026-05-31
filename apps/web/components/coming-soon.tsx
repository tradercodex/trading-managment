'use client';

import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export function ComingSoon({ title, blurb }: { title: string; blurb: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card>
        <CardContent className="flex flex-col items-center justify-center gap-3 py-16 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-fuchsia-500 text-white shadow">
            <Sparkles className="h-5 w-5" />
          </div>
          <h2 className="text-xl font-semibold">{title}</h2>
          <p className="max-w-md text-sm text-muted-foreground">{blurb}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
