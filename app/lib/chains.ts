import { defineChain } from 'viem';

export const tempoMainnet = defineChain({
  id: 4217,
  name: 'Tempo',
  nativeCurrency: { name: 'USD', symbol: 'USD', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://rpc.tempo.xyz'], webSocket: ['wss://rpc.tempo.xyz'] },
  },
  blockExplorers: {
    default: { name: 'Tempo Explorer', url: 'https://explore.tempo.xyz' },
  },
});

export const tempoTestnet = defineChain({
  id: 42431,
  name: 'Tempo Moderato',
  nativeCurrency: { name: 'USD', symbol: 'USD', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://rpc.moderato.tempo.xyz'], webSocket: ['wss://rpc.moderato.tempo.xyz'] },
  },
  blockExplorers: {
    default: { name: 'Tempo Moderato Explorer', url: 'https://explore.testnet.tempo.xyz' },
  },
  testnet: true,
});
