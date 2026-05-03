'use client';
import Image from 'next/image';
import { useAccount } from 'wagmi';
import { ClaimCard } from './ClaimCard';
import { CATEGORIES } from './categories';
import { useEnsureTempo } from '../ChainGuard';
import { ConnectButton } from '../ConnectButton';

export default function ClaimSection() {
  const { isConnected } = useAccount();
  const { isWrongChain, ensure, isPending } = useEnsureTempo();

  return (
    <section id="claim" className="claim-section">
      <div className="claim-inner">
        <div className="claim-character">
          <Image
            src="/panda/samurai.png"
            alt="Tampiyo Samurai"
            width={420}
            height={420}
            className="claim-img"
            sizes="(max-width: 900px) 80vw, 340px"
          />
          <div className="claim-badge">TEMPO CLAIM</div>
        </div>

        <div className="claim-copy">
          <div className="section-eyebrow">Airdrop</div>
          <h2 className="claim-title">
            Claim Your <em>Tempo</em>
            <br />
            $TAMPIYO Now
          </h2>
          <p className="claim-desc">
            Connect your wallet, switch to Tempo Mainnet, and claim your tier.
            Fees are paid in supported stablecoins because Tempo has no native gas token.
          </p>

          <div className="claim-proof-row" aria-label="Claim requirements">
            <span>Tempo Mainnet</span>
            <span>Chain ID 4217</span>
            <span>USD Fee Token</span>
          </div>

          {!isConnected && (
            <div className="claim-cta-banner">
              <span>Wallet not connected.</span>
              <ConnectButton />
            </div>
          )}

          {isConnected && isWrongChain && (
            <div className="claim-warn-banner">
              <span>Wrong network. Tampiyo lives on Tempo Mainnet.</span>
              <button
                type="button"
                className="claim-warn-btn"
                onClick={() => ensure().catch(() => {})}
                disabled={isPending}
              >
                {isPending ? 'Switching…' : 'Switch to Tempo'}
              </button>
            </div>
          )}

          <div className="claim-tier-grid">
            {CATEGORIES.map((c) => (
              <ClaimCard key={c.id} categoryId={c.id} label={c.label} />
            ))}
          </div>

          <div className="claim-note">
            One approval per fee token. Claims are gated by per-tier cooldowns and paid
            through Tempo&apos;s stablecoin fee model.
          </div>
        </div>
      </div>
    </section>
  );
}
