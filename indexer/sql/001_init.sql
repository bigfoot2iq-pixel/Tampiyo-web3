create table if not exists tampiyo_balances (
  address text primary key,
  balance numeric(78,0) not null default 0,
  updated_block bigint not null,
  updated_at timestamptz default now()
);

create index if not exists tampiyo_balances_balance_desc
  on tampiyo_balances (balance desc)
  where balance > 0;

create table if not exists tampiyo_indexer_state (
  contract text primary key,
  chain_id int not null,
  last_block bigint not null,
  updated_at timestamptz default now()
);

-- RLS: anon read, service_role write
alter table tampiyo_balances enable row level security;
alter table tampiyo_indexer_state enable row level security;

create policy "tampiyo_balances anon read"
  on tampiyo_balances for select
  to anon, authenticated
  using (true);

create policy "tampiyo_indexer_state anon read"
  on tampiyo_indexer_state for select
  to anon, authenticated
  using (true);

-- service_role bypasses RLS by default; no explicit write policy needed.

-- Atomic delta upsert RPC for indexer
create or replace function tampiyo_apply_delta(
  p_address text,
  p_delta numeric,
  p_block bigint
) returns void
language plpgsql
security definer
as $$
begin
  insert into tampiyo_balances (address, balance, updated_block)
  values (p_address, p_delta, p_block)
  on conflict (address) do update
    set balance = tampiyo_balances.balance + excluded.balance,
        updated_block = greatest(tampiyo_balances.updated_block, excluded.updated_block),
        updated_at = now();
end;
$$;

revoke all on function tampiyo_apply_delta(text, numeric, bigint) from public, anon, authenticated;
grant execute on function tampiyo_apply_delta(text, numeric, bigint) to service_role;
