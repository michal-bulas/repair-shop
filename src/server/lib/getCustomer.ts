import { eq } from 'drizzle-orm';

import { db } from '@/server/db';
import { customers } from '@/server/db/schema';

export async function getCustomer(id: number) {
  const customer = await db
    .select()
    .from(customers)
    .where(eq(customers.id, id));

  return customer[0];
}
