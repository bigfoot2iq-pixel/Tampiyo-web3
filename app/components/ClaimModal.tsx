"use client";

import Image from "next/image";
import { useState, useEffect, useRef, useCallback } from "react";

export default function ClaimModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [wallet, setWallet] = useState("");
  const [txHash, setTxHash] = useState("");
  const modalRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  // Store trigger element when opening
  useEffect(() => {
    if (open) {
      triggerRef.current = document.activeElement as HTMLElement;
      // Focus first input in modal
      setTimeout(() => {
        modalRef.current?.querySelector("input")?.focus();
      }, 100);
    }
  }, [open]);

  // Trap focus
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab") return;

      const modal = modalRef.current;
      if (!modal) return;

      const focusable = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      ) as NodeListOf<HTMLElement>;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    },
    [open, onClose]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Reset on close
  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setStep(1);
        setWallet("");
        setTxHash("");
        triggerRef.current?.focus();
      }, 300);
    }
  }, [open]);

  function isValidAddress(addr: string) {
    return /^0x[0-9a-fA-F]{40}$/.test(addr.trim());
  }

  function goToStep2() {
    if (!wallet.trim()) {
      alert("Please enter your wallet address.");
      return;
    }
    if (!isValidAddress(wallet)) {
      alert("Please enter a valid Tempo wallet address.");
      return;
    }
    setStep(2);
  }

  function goBackToStep1() {
    setStep(1);
  }

  function confirmClaim() {
    setStep(3);
    const hash =
      "0x" +
      Array.from({ length: 64 }, () =>
        Math.floor(Math.random() * 16).toString(16)
      ).join("");
    setTxHash(hash);
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center"
      style={{
        background: "rgba(20,19,15,0.85)",
        backdropFilter: "blur(8px)",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Claim $TAMPIYO tokens"
    >
      <div
        ref={modalRef}
        className="relative bg-paper border border-ink/15 w-full max-w-md mx-4 p-10"
        style={{
          boxShadow: "6px 6px 0 var(--color-ink)",
        }}
      >
        {/* Ink stamp header */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-ink" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center border border-ink/20 text-ink-soft hover:text-ink hover:border-ink transition-colors bg-transparent"
          aria-label="Close modal"
        >
          ✕
        </button>

        {/* Step 1: Enter wallet */}
        {step === 1 && (
          <div className="flex flex-col items-center gap-6">
            <Image
              src="/panda/king.png"
              alt=""
              width={96}
              height={96}
              className="w-24 h-24 object-contain"
              style={{
                animation: "float 4s ease-in-out infinite",
              }}
            />
            <h2 className="font-display font-bold text-ink text-3xl text-center leading-tight">
              Claim{" "}
              <span className="font-marker text-gold" style={{ fontSize: "0.85em" }}>
                $TAMPIYO
              </span>
            </h2>
            <p className="font-body text-sm text-smoke text-center leading-relaxed">
              Enter your Tempo wallet address to claim your $TAMPIYO allocation.
            </p>

            {/* Progress bar */}
            <div className="flex gap-1.5 w-full">
              <div className="flex-1 h-1 bg-ink" />
              <div className="flex-1 h-1 bg-bone" />
              <div className="flex-1 h-1 bg-bone" />
            </div>

            <div className="w-full">
              <label
                htmlFor="modal-wallet"
                className="block text-xs text-smoke uppercase tracking-widest mb-3"
              >
                Your Tempo Wallet Address
              </label>
              <input
                id="modal-wallet"
                type="text"
                value={wallet}
                onChange={(e) => setWallet(e.target.value)}
                placeholder="0x1234...abcd…"
                autoComplete="off"
                className="w-full bg-paper-2 border border-ink/15 px-4 py-3 font-mono text-ink text-sm placeholder:text-bone focus:border-ink transition-colors"
              />
            </div>

            <button className="btn-ink btn-ink-gold w-full py-4" onClick={goToStep2}>
              Continue &rarr;
            </button>
          </div>
        )}

        {/* Step 2: Verify */}
        {step === 2 && (
          <div className="flex flex-col gap-6">
            <h2 className="font-display font-bold text-ink text-2xl text-center">
              Verify Your Claim
            </h2>
            <p className="font-body text-sm text-smoke text-center">
              Claiming address:
            </p>

            {/* Progress bar */}
            <div className="flex gap-1.5 w-full">
              <div className="flex-1 h-1 bg-ink-soft" />
              <div className="flex-1 h-1 bg-ink" />
              <div className="flex-1 h-1 bg-bone" />
            </div>

            {/* Summary card */}
            <div className="bg-paper-2 border border-ink/10 p-5 space-y-4">
              <div className="flex justify-between items-start">
                <span className="text-xs text-smoke uppercase tracking-wider">
                  Wallet
                </span>
                <code className="font-mono text-xs text-ink-soft break-all text-right max-w-[200px]">
                  {wallet}
                </code>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-smoke uppercase tracking-wider">
                  You will receive
                </span>
                <span className="font-display font-bold text-gold text-lg">
                  10,000 $TAMPIYO
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-smoke uppercase tracking-wider">
                  Gas fee (est.)
                </span>
                <span className="font-body text-sm text-ink-soft">
                  Paid in supported USD stables
                </span>
              </div>
            </div>

            <button className="btn-ink btn-ink-gold w-full py-4" onClick={confirmClaim}>
              Confirm &amp; Claim
            </button>
            <button className="btn-paper w-full py-3" onClick={goBackToStep1}>
              Go Back
            </button>
          </div>
        )}

        {/* Step 3: Success */}
        {step === 3 && (
          <div className="flex flex-col items-center gap-6 text-center">
            <Image
              src="/panda/king.png"
              alt=""
              width={96}
              height={96}
              className="w-24 h-24 object-contain"
            />
            <div
              className="w-16 h-16 flex items-center justify-center border-2 border-success text-success text-2xl"
              style={{ borderRadius: "50%" }}
            >
              ✓
            </div>
            <h2 className="font-display font-bold text-success text-2xl">
              Claim Submitted!
            </h2>
            <p className="font-body text-sm text-smoke leading-relaxed">
              Your 10,000 $TAMPIYO will arrive within 24 hours. The panda
              approves.
            </p>
            <code className="font-mono text-xs text-smoke bg-paper-2 px-4 py-3 break-all w-full text-center">
              Claim ID: {txHash}
            </code>
            <button
              className="btn-ink w-full py-4"
              style={{ background: "var(--color-success)" }}
              onClick={onClose}
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
