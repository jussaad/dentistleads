import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

const firstNames = ['James', 'Mary', 'Robert', 'Patricia', 'John', 'Jennifer', 'Michael', 'Linda', 'David', 'Elizabeth', 'William', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica', 'Thomas', 'Sarah', 'Christopher', 'Karen'];
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin'];

const cities = [
  { city: 'New York', state: 'NY' },
  { city: 'Los Angeles', state: 'CA' },
  { city: 'Chicago', state: 'IL' },
  { city: 'Houston', state: 'TX' },
  { city: 'Phoenix', state: 'AZ' },
  { city: 'Philadelphia', state: 'PA' },
  { city: 'San Antonio', state: 'TX' },
  { city: 'San Diego', state: 'CA' },
  { city: 'Dallas', state: 'TX' },
  { city: 'San Jose', state: 'CA' },
  { city: 'Austin', state: 'TX' },
  { city: 'Jacksonville', state: 'FL' },
  { city: 'Fort Worth', state: 'TX' },
  { city: 'Columbus', state: 'OH' },
  { city: 'Charlotte', state: 'NC' },
];

const services = [
  { name: 'Cleaning', weight: 0.30 },
  { name: 'Teeth Whitening', weight: 0.20 },
  { name: 'Invisalign', weight: 0.18 },
  { name: 'Implants', weight: 0.12 },
  { name: 'Emergency', weight: 0.10 },
  { name: 'Veneers', weight: 0.10 },
];

const statuses = [
  { status: 'new', count: 89 },
  { status: 'contacted', count: 67 },
  { status: 'appointment', count: 18 },
  { status: 'closed', count: 52 },
  { status: 'lost', count: 21 },
];

const getRandomItem = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const getRandomWeightedItem = (items: { name: string; weight: number }[]) => {
  const random = Math.random();
  let cumulativeWeight = 0;
  for (const item of items) {
    cumulativeWeight += item.weight;
    if (random < cumulativeWeight) return item.name;
  }
  return items[items.length - 1].name;
};

const generatePhone = () => {
  const area = Math.floor(Math.random() * 900) + 100;
  const prefix = Math.floor(Math.random() * 900) + 100;
  const line = Math.floor(Math.random() * 9000) + 1000;
  return `(${area}) ${prefix}-${line}`;
};

async function seed() {
  console.log('Seeding 247 leads...');

  const totalClosedRevenue = 47240;
  const closedCount = 52;
  const minRevenue = 650;
  const maxRevenue = 4200;

  // Simple distribution logic for revenue to hit exact target
  let remainingRevenue = totalClosedRevenue;
  const closedRevenues: number[] = [];
  for (let i = 0; i < closedCount - 1; i++) {
    const avgRemaining = remainingRevenue / (closedCount - i);
    // Stay within bounds and leave room for others
    const amount = Math.floor(Math.random() * (Math.min(maxRevenue, avgRemaining * 1.5) - minRevenue) + minRevenue);
    closedRevenues.push(amount);
    remainingRevenue -= amount;
  }
  closedRevenues.push(remainingRevenue); // Last one takes the remainder

  const leads = [];
  let closedIdx = 0;

  for (const statusObj of statuses) {
    for (let i = 0; i < statusObj.count; i++) {
      const cityData = getRandomItem(cities);
      const name = `${getRandomItem(firstNames)} ${getRandomItem(lastNames)}`;
      const service = getRandomWeightedItem(services);
      
      let revenue = 0;
      if (statusObj.status === 'closed') {
        revenue = closedRevenues[closedIdx++];
      }

      const createdAt = new Date();
      createdAt.setDate(createdAt.getDate() - Math.floor(Math.random() * 30));
      // Weight towards recent
      if (Math.random() > 0.5) {
         createdAt.setDate(createdAt.getDate() + Math.floor(Math.random() * 15));
      }

      leads.push({
        name,
        phone: generatePhone(),
        email: `${name.toLowerCase().replace(' ', '.')}@example.com`,
        service,
        city: cityData.city,
        state: cityData.state,
        status: statusObj.status,
        revenue,
        created_at: createdAt.toISOString(),
      });
    }
  }

  const { error } = await supabase.from('leads').insert(leads);

  if (error) {
    console.error('Error seeding leads:', error);
  } else {
    console.log('Successfully seeded 247 leads.');
  }
}

seed();
