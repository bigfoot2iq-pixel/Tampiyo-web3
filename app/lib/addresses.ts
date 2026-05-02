import { tempoMainnet, tempoTestnet } from './chains';

export const addresses = {
  [tempoMainnet.id]: {
    tampiyo: (process.env.NEXT_PUBLIC_TAMPIYO_ADDRESS || '0x...') as `0x${string}`,
    claim: (process.env.NEXT_PUBLIC_CLAIM_ADDRESS || '0x...') as `0x${string}`,
    feeToken: (process.env.NEXT_PUBLIC_FEE_TOKEN_ADDRESS || '0x...') as `0x${string}`,
  },
  [tempoTestnet.id]: {
    tampiyo: '0x...' as `0x${string}`,
    claim: '0x...' as `0x${string}`,
    feeToken: '0x...' as `0x${string}`,
  },
} as const;
