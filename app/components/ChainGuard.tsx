'use client';
import { useAccount, useChainId, useSwitchChain } from 'wagmi';
import { tempoMainnet } from '@/app/lib/chains';

export function useEnsureTempo() {
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChainAsync, isPending } = useSwitchChain();
  const target = tempoMainnet.id;

  async function ensure() {
    if (!isConnected) throw new Error('Connect wallet first');
    if (chainId !== target) await switchChainAsync({ chainId: target });
  }
  return { ensure, isWrongChain: isConnected && chainId !== target, isPending };
}
