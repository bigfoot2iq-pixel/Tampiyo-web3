import { activeChain, tempoMainnet, tempoTestnet } from './chains';

export const addresses = {
  [tempoMainnet.id]: {
    tampiyo: (process.env.NEXT_PUBLIC_TAMPIYO_ADDRESS || '0x0000000000000000000000000000000000000000') as `0x${string}`,
    claim: (process.env.NEXT_PUBLIC_CLAIM_ADDRESS || '0x0000000000000000000000000000000000000000') as `0x${string}`,
    feeToken: (process.env.NEXT_PUBLIC_FEE_TOKEN_ADDRESS || '0x0000000000000000000000000000000000000000') as `0x${string}`,
  },
  [tempoTestnet.id]: {
    tampiyo: '0x47CAD479B1D525E88Cf69f0a0b05BFD1747E92f2' as `0x${string}`,
    claim: '0x2E9e441983448B923cC859867252237494daDe23' as `0x${string}`,
    feeToken: '0x20c0000000000000000000000000000000000000' as `0x${string}`,
  },
} as const;

export const activeAddresses = addresses[activeChain.id];
