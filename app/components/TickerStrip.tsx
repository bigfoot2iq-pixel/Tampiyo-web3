const tickerData = [
  { label: "$TMPY", value: "ERC-20 Token" },
  { label: "SUPPLY", value: "1,000,000,000" },
  { label: "TAX", value: "0%" },
  { label: "AIRDROP", value: "Tiered claim" },
  { label: "CHAIN", value: "Tempo Mainnet" },
  { label: "CHAIN ID", value: "4217" },
  { label: "GAS", value: "USD stablecoin fees" },
  { label: "STATUS", value: "Claim Open" },
  { label: "NATIVE TOKEN", value: "None" },
];

export default function TickerStrip() {
  return (
    <div className="bg-paper-2 border-y border-ink/10 py-3 overflow-hidden relative">
      <div
        className="flex whitespace-nowrap"
        style={{ animation: "marquee 30s linear infinite" }}
      >
        {[...tickerData, ...tickerData].map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-4 px-10 font-mono text-xs text-smoke flex-shrink-0"
          >
            <span className="w-1.5 h-1.5 bg-ink/40 rounded-full" aria-hidden="true" />
            <strong className="text-ink">{item.label}</strong>
            <span>{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
