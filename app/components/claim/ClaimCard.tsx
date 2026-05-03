'use client';
import { useEffect, useState } from 'react';
import {
  useAccount,
  usePublicClient,
  useReadContract,
  useWriteContract,
} from 'wagmi';
import { useQueryClient } from '@tanstack/react-query';
import { formatUnits, maxUint256 } from 'viem';
import { tampiyoClaimAbi } from '@/app/lib/abi/tampiyoClaim';
import { erc20Abi } from '@/app/lib/abi/erc20';
import { activeAddresses } from '@/app/lib/addresses';
import { activeChain } from '@/app/lib/chains';
import { formatCountdown, formatDuration } from '@/app/lib/format';
import { useEnsureTempo } from '../ChainGuard';
import type { CategoryId, CategoryLabel } from './categories';

export function ClaimCard({
  categoryId,
  label,
}: {
  categoryId: CategoryId;
  label: CategoryLabel;
}) {
  const { address, isConnected } = useAccount();
  const { ensure, isWrongChain } = useEnsureTempo();
  const queryClient = useQueryClient();
  const publicClient = usePublicClient({ chainId: activeChain.id });
  const { writeContractAsync, isPending: isWritePending } = useWriteContract();
  const [step, setStep] = useState<'idle' | 'approve' | 'claim'>('idle');
  const [isConfirming, setIsConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [now, setNow] = useState(() => Math.floor(Date.now() / 1000));

  useEffect(() => {
    const id = setInterval(() => setNow(Math.floor(Date.now() / 1000)), 1000);
    return () => clearInterval(id);
  }, []);

  const claimAddr = activeAddresses.claim;
  const feeTokenAddr = activeAddresses.feeToken;
  const tampiyoAddr = activeAddresses.tampiyo;

  const { data: catData } = useReadContract({
    address: claimAddr,
    abi: tampiyoClaimAbi,
    functionName: 'getCategory',
    args: [categoryId],
  });

  const { data: lastClaim, queryKey: lastClaimKey } = useReadContract({
    address: claimAddr,
    abi: tampiyoClaimAbi,
    functionName: 'lastClaimAt',
    args: address ? [address, categoryId] : undefined,
    query: { enabled: !!address },
  });

  const { data: allowance, queryKey: allowanceKey } = useReadContract({
    address: feeTokenAddr,
    abi: erc20Abi,
    functionName: 'allowance',
    args: address ? [address, claimAddr] : undefined,
    query: { enabled: !!address },
  });

  const { data: feeBal, queryKey: feeBalKey } = useReadContract({
    address: feeTokenAddr,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  const { data: poolBal, queryKey: poolKey } = useReadContract({
    address: tampiyoAddr,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: [claimAddr],
  });

  const { data: feeTokenSymbol } = useReadContract({
    address: feeTokenAddr,
    abi: erc20Abi,
    functionName: 'symbol',
  });

  const amountStr = catData?.amount !== undefined ? formatUnits(catData.amount, 18) : 'Loading…';
  const cooldownSec = catData?.cooldown !== undefined ? Number(catData.cooldown) : 0;
  const feeStr = catData?.fee !== undefined ? formatUnits(catData.fee, 18) : '0';
  const enabled = catData?.enabled ?? false;

  const lastTs = lastClaim !== undefined ? Number(lastClaim) : 0;
  const nextClaimAt = lastTs > 0 ? lastTs + cooldownSec : 0;
  const cooldownActive = nextClaimAt > now;

  const needsApproval =
    allowance !== undefined && catData?.fee !== undefined && allowance < catData.fee;
  const poolEmpty =
    poolBal !== undefined && catData?.amount !== undefined && poolBal < catData.amount;
  const insufficientFee =
    feeBal !== undefined && catData?.fee !== undefined && feeBal < catData.fee;

  async function handleClick() {
    try {
      setError(null);
      await ensure();
      if (!publicClient) throw new Error('Tempo RPC client unavailable.');

      if (needsApproval) {
        setStep('approve');
        const approvalHash = await writeContractAsync({
          address: feeTokenAddr,
          abi: erc20Abi,
          functionName: 'approve',
          args: [claimAddr, maxUint256],
        });
        setIsConfirming(true);
        await publicClient.waitForTransactionReceipt({ hash: approvalHash });
        await queryClient.invalidateQueries({ queryKey: allowanceKey });
      }

      setStep('claim');
      const claimHash = await writeContractAsync({
        address: claimAddr,
        abi: tampiyoClaimAbi,
        functionName: 'claim',
        args: [categoryId],
      });
      setIsConfirming(true);
      await publicClient.waitForTransactionReceipt({ hash: claimHash });
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: lastClaimKey }),
        queryClient.invalidateQueries({ queryKey: feeBalKey }),
        queryClient.invalidateQueries({ queryKey: poolKey }),
        queryClient.invalidateQueries({ queryKey: allowanceKey }),
      ]);
      setStep('idle');
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      if (/user rejected/i.test(msg)) setError('Transaction rejected.');
      else if (/CooldownActive/.test(msg)) setError('Cooldown still active.');
      else if (/InsufficientPool/.test(msg)) setError('Pool empty. Try later.');
      else if (/ContractPaused/.test(msg)) setError('Claims paused.');
      else if (/CategoryDisabled/.test(msg)) setError('Tier disabled.');
      else setError(msg.slice(0, 140));
      setStep('idle');
    } finally {
      setIsConfirming(false);
    }
  }

  let btnLabel: string;
  let disabled = false;
  if (!isConnected) {
    btnLabel = 'Connect Wallet';
    disabled = true;
  } else if (isWrongChain) {
    btnLabel = 'Switch to Tempo';
  } else if (!enabled) {
    btnLabel = 'Tier Disabled';
    disabled = true;
  } else if (poolEmpty) {
    btnLabel = 'Pool Empty';
    disabled = true;
  } else if (cooldownActive) {
    btnLabel = `Available in ${formatCountdown(nextClaimAt - now)}`;
    disabled = true;
  } else if (insufficientFee) {
    btnLabel = `Need ${feeStr} ${feeTokenSymbol ?? ''}`.trim();
    disabled = true;
  } else if (isWritePending || isConfirming) {
    btnLabel = step === 'approve' ? 'Approving…' : 'Confirming…';
    disabled = true;
  } else if (needsApproval) {
    btnLabel = `Approve ${feeTokenSymbol ?? 'Token'}`;
  } else {
    btnLabel = `Claim ${amountStr} TAMPIYO`;
  }

  return (
    <div className="claim-tier-card">
      <div className="claim-tier-header">
        <span className="claim-tier-label">{label}</span>
        <span className="claim-tier-amount">
          {amountStr} <sup>TAMPIYO</sup>
        </span>
      </div>
      <dl className="claim-tier-meta">
        <div>
          <dt>Cooldown</dt>
          <dd>{cooldownSec > 0 ? formatDuration(cooldownSec) : '—'}</dd>
        </div>
        <div>
          <dt>Fee</dt>
          <dd>
            {feeStr} {feeTokenSymbol ?? ''}
          </dd>
        </div>
      </dl>
      {error && (
        <div className="claim-tier-error" role="status" aria-live="polite">
          {error}
        </div>
      )}
      <button
        className="claim-btn"
        onClick={handleClick}
        disabled={disabled}
        aria-busy={isWritePending || isConfirming}
      >
        {btnLabel}
      </button>
    </div>
  );
}
