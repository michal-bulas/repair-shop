import TicketForm from '@/app/(rs)/tickets/form/TicketForm';
import * as Sentry from '@sentry/nextjs';

import BackButton from '@/components/BackButton';

import { getCustomer } from '@/server/lib/getCustomer';
import { getTicket } from '@/server/lib/getTicket';

export default async function TicketFormPage({
  searchParams
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  try {
    const { customerId, ticketId } = await searchParams;

    if (!customerId && !ticketId) {
      return (
        <>
          <h2 className='mb-2 text-2xl'>
            Ticket ID or Customer ID required to load ticket form
          </h2>
          <BackButton
            title='Go Back'
            variant='default'
          />
        </>
      );
    }

    // New ticket form
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

      if (!customer.active) {
        return (
          <>
            <h2 className='mb-2 text-2xl'>
              Customer ID #{customerId} is not active.
            </h2>
            <BackButton
              title='Go Back'
              variant='default'
            />
          </>
        );
      }

      // Return ticket form
      return <TicketForm customer={customer} />;
    }

    // Edit ticket form
    if (ticketId) {
      const ticket = await getTicket(parseInt(ticketId));

      if (!ticket) {
        return (
          <>
            <h2 className='mb-2 text-2xl'>Ticket ID #{ticketId} not found</h2>
            <BackButton
              title='Go Back'
              variant='default'
            />
          </>
        );
      }

      const customer = await getCustomer(ticket.customerId);

      // Return ticket form
      return (
        <TicketForm
          customer={customer}
          ticket={ticket}
        />
      );
    }
  } catch (e) {
    if (e instanceof Error) {
      Sentry.captureException(e);
      throw e;
    }
  }
}
