'use client';
import { ConnectButton as RKConnectButton } from '@rainbow-me/rainbowkit';

export function ConnectButton({ compact = false }: { compact?: boolean }) {
  return (
    <RKConnectButton.Custom>
      {({
        account,
        chain,
        mounted,
        authenticationStatus,
        openAccountModal,
        openChainModal,
        openConnectModal,
      }) => {
        const ready = mounted && authenticationStatus !== 'loading';
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === 'authenticated');

        if (!ready) {
          return (
            <span
              className={`wallet-button wallet-button-placeholder${compact ? ' wallet-button-compact' : ''}`}
              aria-hidden="true"
            />
          );
        }

        if (!connected) {
          return (
            <button
              type="button"
              className={`wallet-button wallet-button-connect${compact ? ' wallet-button-compact' : ''}`}
              onClick={openConnectModal}
            >
              {compact ? 'Connect' : 'Connect Wallet'}
            </button>
          );
        }

        if (chain.unsupported) {
          return (
            <button
              type="button"
              className={`wallet-button wallet-button-error${compact ? ' wallet-button-compact' : ''}`}
              onClick={openChainModal}
            >
              Wrong Network
            </button>
          );
        }

        if (compact) {
          return (
            <button
              type="button"
              className="wallet-button wallet-button-account wallet-button-compact"
              onClick={openAccountModal}
              aria-label={`Open account menu for ${account.displayName}`}
            >
              <span className="wallet-account-name">{account.displayName}</span>
            </button>
          );
        }

        return (
          <div className="wallet-button-group">
            <button
              type="button"
              className="wallet-button wallet-button-chain"
              onClick={openChainModal}
              aria-label={`Switch network. Current network: ${chain.name ?? 'Unknown'}`}
            >
              {chain.hasIcon && chain.iconUrl && (
                <span
                  className="wallet-chain-icon"
                  style={{
                    backgroundColor: chain.iconBackground,
                    backgroundImage: `url(${chain.iconUrl})`,
                  }}
                  aria-hidden="true"
                />
              )}
              <span className="wallet-chain-name">{chain.name ?? 'Network'}</span>
            </button>

            <button
              type="button"
              className="wallet-button wallet-button-account"
              onClick={openAccountModal}
              aria-label={`Open account menu for ${account.displayName}`}
            >
              <span className="wallet-account-name">{account.displayName}</span>
            </button>
          </div>
        );
      }}
    </RKConnectButton.Custom>
  );
}
