import CustomerForm from '@/app/(rs)/customers/form/CustomerForm';
import * as Sentry from '@sentry/nextjs';

import BackButton from '@/components/BackButton';

import { getCustomer } from '@/server/lib/getCustomer';

export async function generateMetadata({
  searchParams
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { customerId } = await searchParams;

  if (!customerId) return { title: 'New Customer' };
  return { title: `Edit Customer #${customerId}` };
}

export default async function CustomerFormPage({
  searchParams
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  try {
    const { customerId } = await searchParams;

    // Edit customer form
    if (customerId) {
      const customer = await getCustomer(parseInt(customerId));

      if (!customer) {
        return (
          <>
            <h2 className='mb-2 text-2xl'>
              Customer ID #{customerId} not found
            </h2>
            <BackButton
              title='Go Back'
              variant='default'
            />
          </>
        );
      }
      // Put customer form
      return <CustomerForm customer={customer} />;
    }
    // New customer form
    return <CustomerForm />;
  } catch (e) {
    if (e instanceof Error) {
      Sentry.captureException(e);
      throw e;
    }
  }
}
