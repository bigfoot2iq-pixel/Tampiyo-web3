'use client';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider, lightTheme, type Theme } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import { wagmiConfig } from '@/app/lib/wagmi';

const queryClient = new QueryClient();
const baseRainbowTheme = lightTheme({
  accentColor: '#C8961F',
  accentColorForeground: '#14130F',
  borderRadius: 'small',
  fontStack: 'system',
  overlayBlur: 'small',
});

const tampiyoRainbowTheme = {
  ...baseRainbowTheme,
  colors: {
    ...baseRainbowTheme.colors,
    accentColor: '#C8961F',
    accentColorForeground: '#14130F',
    actionButtonBorder: 'rgba(20, 19, 15, 0.16)',
    actionButtonBorderMobile: 'rgba(20, 19, 15, 0.18)',
    actionButtonSecondaryBackground: '#E4DDCB',
    closeButton: '#14130F',
    closeButtonBackground: 'rgba(20, 19, 15, 0.08)',
    connectButtonBackground: '#EFE9DC',
    connectButtonBackgroundError: '#A03B2C',
    connectButtonInnerBackground:
      'linear-gradient(180deg, rgba(200, 150, 31, 0.18), rgba(20, 19, 15, 0.06))',
    connectButtonText: '#14130F',
    connectButtonTextError: '#EFE9DC',
    connectionIndicator: '#4F7A3A',
    downloadBottomCardBackground:
      'linear-gradient(135deg, rgba(200, 150, 31, 0.14), transparent 54%), #EFE9DC',
    downloadTopCardBackground:
      'linear-gradient(135deg, rgba(20, 19, 15, 0.08), transparent 58%), #E4DDCB',
    error: '#A03B2C',
    generalBorder: 'rgba(20, 19, 15, 0.18)',
    generalBorderDim: 'rgba(20, 19, 15, 0.08)',
    menuItemBackground: 'rgba(200, 150, 31, 0.12)',
    modalBackdrop: 'rgba(20, 19, 15, 0.56)',
    modalBackground: '#EFE9DC',
    modalBorder: '#14130F',
    modalText: '#14130F',
    modalTextDim: 'rgba(20, 19, 15, 0.38)',
    modalTextSecondary: '#7A766C',
    profileAction: '#E4DDCB',
    profileActionHover: 'rgba(200, 150, 31, 0.16)',
    profileForeground: '#E4DDCB',
    selectedOptionBorder: '#C8961F',
    standby: '#C8961F',
  },
  fonts: {
    body: 'var(--font-inter-tight), -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  radii: {
    ...baseRainbowTheme.radii,
    actionButton: '0px',
    connectButton: '0px',
    menuButton: '0px',
    modal: '8px',
    modalMobile: '8px',
  },
  shadows: {
    connectButton: '3px 3px 0 #14130F',
    dialog: '8px 8px 0 #14130F',
    profileDetailsAction: '2px 2px 0 rgba(20, 19, 15, 0.35)',
    selectedOption: '3px 3px 0 #8E6A14',
    selectedWallet: '3px 3px 0 #14130F',
    walletLogo: '2px 2px 0 rgba(20, 19, 15, 0.45)',
  },
} satisfies Theme;

export function Web3Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={tampiyoRainbowTheme}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
