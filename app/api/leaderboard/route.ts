import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// TODO: wire LeaderboardPreview.tsx to this route — component contract: { holders: { address, balance }[] }

// force-dynamic: Supabase URL absent at build time; live leaderboard data is always request-scoped.
// revalidate = 60 from PLAN.md omitted — ISR pre-renders at build time which fails without env vars.
export const dynamic = "force-dynamic";

const CLAIM_ADDRESS = "0x2E9e441983448B923cC859867252237494daDe23".toLowerCase();
const ZERO = "0x0000000000000000000000000000000000000000";

// Lazy-init: env vars absent at build time; defer until first request.
function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } }
  );
}

export async function GET() {
  const { data, error } = await getSupabase()
    .from("tampiyo_balances")
    .select("address, balance")
    .gt("balance", 0)
    .order("balance", { ascending: false })
    .limit(100);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const filtered = (data ?? []).filter(
    (r) => r.address.toLowerCase() !== CLAIM_ADDRESS && r.address.toLowerCase() !== ZERO
  );

  return NextResponse.json({ holders: filtered });
}
