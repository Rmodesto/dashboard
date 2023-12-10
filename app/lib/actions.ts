'use server';

import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const FormSchema = z.object({
    id: z.string(),
    customerId: z.string(),
    amount: z.coerce.number(),
    status: z.enum(['pending', 'paid']),
    date: z.string(),
  });

const CreateInvoice = FormSchema.omit({ id: true, date: true });
 
export async function createInvoice(formData: FormData) {
    
    const { customerId, amount, status } = CreateInvoice.parse({
      customerId: formData.get('customerId'),
      amount: formData.get('amount'),
      status: formData.get('status'),
    });
    //storing values in cents
    const amountInCents = amount * 100;

    //Creating new dates
    //date format : "YYYY-MM-DD"
    const date = new Date().toISOString().split('T')[0];

    // Inserting the data into your database
    await sql`
    INSERT INTO invoices (customer_id, amount, status, date)
    VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
  `;
  //revalidatePath function from Next.js
  //path will be revalidated 
  //fresh data will be fetched from the server
  revalidatePath('/dashboard/invoices');

  //redirect the user to the dashboard/invoices page
  redirect('/dashboard/invoices');
}