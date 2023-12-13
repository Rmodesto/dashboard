'use server';

import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const FormSchema = z.object({
    id: z.string(),
    customerId: z.string({
        //serverside validation
        invalid_type_error: 'Please select a customer.',
    }),
    amount: z.coerce.number()
    .gt(0, { message: 'Please enter an amount greater than $0.' }),
    status: z.enum(['pending', 'paid'], {
        invalid_type_error: 'Please select an invoice status.',
    }),
    date: z.string(),
  });
// Use Zod to update the expected types
const UpdateInvoice = FormSchema.omit({ id: true, date: true });  
const CreateInvoice = FormSchema.omit({ id: true, date: true });
// This is temporary until @types/react-dom is updated
export type State = {
    errors?: {
      customerId?: string[];
      amount?: string[];
      status?: string[];
    };
    message?: string | null;
  };
   
  export async function createInvoice(prevState: State, formData: FormData) {
     // Validate form fields using Zod
     const validatedFields = CreateInvoice.safeParse({

      customerId: formData.get('customerId'),
      amount: formData.get('amount'),
      status: formData.get('status'),
    });

    
    // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Invoice.',
    };
  }
 
    
    // Prepare data for insertion into the database
    const { customerId, amount, status } = validatedFields.data;
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

//Extracting the data from formData.
//Validating the types with Zod.
//Converting the amount to cents.
//Passing the variables to your SQL query.
//Calling revalidatePath to clear the client cache and make a new server request.
//Calling redirect to redirect the user to the invoice's page.
export async function updateInvoice(id: string, formData: FormData) {
    throw new Error('Failed to Delete Invoice');

    
    const { customerId, amount, status } = UpdateInvoice.parse({
      customerId: formData.get('customerId'),
      amount: formData.get('amount'),
      status: formData.get('status'),
    });
   
    const amountInCents = amount * 100;

//Error handling
   try {
    await sql`
      UPDATE invoices
      SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
      WHERE id = ${id}
    `;
   } catch (error) {
    return { 
        message: 'Database Error: Failed to Create Invoice.',
    }
}


    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
}

  export async function deleteInvoice(id: string) {
    throw new Error('Failed to Delete Invoice');

    try {
    await sql`DELETE FROM invoices WHERE id = ${id}`;
    revalidatePath('/dashboard/invoices');
    return {message : 'Invoice Deleted'};
  } catch (error) {
    return { 
        message: 'Database Error: Failed to Delete Invoice.'};
    }
}