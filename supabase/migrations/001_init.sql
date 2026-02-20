create table leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  email text,
  service text not null,  -- 'Teeth Whitening','Invisalign','Implants','Emergency','Cleaning','Veneers'
  city text not null,
  state text not null,
  status text not null default 'new', -- 'new','contacted','appointment','closed','lost'
  revenue numeric default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable realtime
alter publication supabase_realtime add table leads;

-- Index for dashboard queries
create index leads_status_idx on leads(status);
create index leads_created_idx on leads(created_at desc);
