import { http } from 'wagmi';
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { activeChain } from './chains';

export const wagmiConfig = getDefaultConfig({
  appName: 'Tampiyo',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
  chains: [activeChain],
  transports: {
    [activeChain.id]: http(activeChain.rpcUrls.default.http[0]),
  },
  ssr: true,
});
