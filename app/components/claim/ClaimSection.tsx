'use client';
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
          <img
            src="/panda/samurai.png"
            alt="Tampiyo Samurai"
            className="claim-img"
          />
          <div className="claim-badge">FREE CLAIM</div>
        </div>

        <div className="claim-copy">
          <div className="section-eyebrow">Airdrop</div>
          <h2 className="claim-title">
            Claim Your <em>Free</em>
            <br />
            $TMPY Now
          </h2>
          <p className="claim-desc">
            Connect your wallet, switch to Tempo, claim your tier. The panda doesn&apos;t forget his
            loyal followers.
          </p>

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
            One approval per fee token (unlimited). Claims gated by per-tier cooldown. Fees paid in
            stablecoin — Tempo has no native gas token.
          </div>
        </div>
      </div>
    </section>
  );
}
