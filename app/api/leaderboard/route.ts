import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

const CLAIM_ADDRESS = "0x2E9e441983448B923cC859867252237494daDe23";
const ZERO = "0x0000000000000000000000000000000000000000";

function getSupabase() {
  return createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!,
    { auth: { persistSession: false } }
  );
}

function isFiltered(address: string) {
  const lc = address.toLowerCase();
  return lc === CLAIM_ADDRESS.toLowerCase() || lc === ZERO;
}

async function getAllHolders() {
  const { data, error } = await getSupabase()
    .from("tampiyo_balances")
    .select("address, balance")
    .gt("balance", 0)
    .order("balance", { ascending: false })
    .limit(500);

  if (error) throw error;
  return (data ?? []).filter((r) => !isFiltered(r.address));
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get("address");

  try {
    const all = await getAllHolders();

    if (address) {
      const idx = all.findIndex(
        (r) => r.address.toLowerCase() === address.toLowerCase()
      );
      if (idx === -1) return NextResponse.json({ holder: null });
      return NextResponse.json({
        holder: { ...all[idx], rank: idx + 1 },
      });
    }

    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") ?? "25")));
    const offset = (page - 1) * limit;

    const holders = all.slice(offset, offset + limit).map((h, i) => ({
      ...h,
      rank: offset + i + 1,
    }));

    return NextResponse.json({
      holders,
      total: all.length,
      page,
      limit,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
