import { http, createConfig } from 'wagmi';
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { tempoMainnet } from './chains';

export const wagmiConfig = getDefaultConfig({
  appName: 'Tampiyo',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
  chains: [tempoMainnet],
  transports: {
    [tempoMainnet.id]: http('https://rpc.tempo.xyz'),
  },
  ssr: true,
});
