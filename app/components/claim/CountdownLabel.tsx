'use client';
import { useState, useEffect } from 'react';
import { formatCountdown } from '@/app/lib/format';

export function CountdownLabel({ nextClaimAt, onExpire }: { nextClaimAt: number; onExpire?: () => void }) {
  const [now, setNow] = useState(() => Math.floor(Date.now() / 1000));

  useEffect(() => {
    const id = setInterval(() => setNow(Math.floor(Date.now() / 1000)), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (nextClaimAt && now >= nextClaimAt) onExpire?.();
  }, [now, nextClaimAt, onExpire]);

  if (!nextClaimAt || now >= nextClaimAt) return null;
  return <span>Available in {formatCountdown(nextClaimAt - now)}</span>;
}
