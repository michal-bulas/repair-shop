import TicketForm from '@/app/(rs)/tickets/form/TicketForm';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { Users, init as kindeInit } from '@kinde/management-api-js';
import * as Sentry from '@sentry/nextjs';

import BackButton from '@/components/BackButton';

import { getCustomer } from '@/server/lib/getCustomer';
import { getTicket } from '@/server/lib/getTicket';

export async function generateMetadata({
  searchParams
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { customerId, ticketId } = await searchParams;

  if (!customerId && !ticketId)
    return { title: 'Missing Ticket ID or Customer ID' };

  if (customerId) return { title: `New Ticket for Customer #${customerId}` };

  if (ticketId) return { title: `Edit Ticket #${customerId}` };
}

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
    const { getPermission, getUser } = getKindeServerSession();

    const [managerPermission, user] = await Promise.all([
      getPermission('manager'),
      getUser()
    ]);

    const isManager = managerPermission?.isGranted;

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
      if (isManager) {
        kindeInit();
        const { users } = await Users.getUsers();
        const techs = users
          ? users.map((user) => ({ id: user.email!, description: user.email! }))
          : [];

        return (
          <TicketForm
            customer={customer}
            techs={techs}
          />
        );
      }

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
      if (isManager) {
        kindeInit();
        const { users } = await Users.getUsers();
        const techs = users
          ? users.map((user) => ({ id: user.email!, description: user.email! }))
          : [];

        return (
          <TicketForm
            customer={customer}
            ticket={ticket}
            techs={techs}
          />
        );
      }

      const isEditable =
        user.email?.toLowerCase() === ticket.tech.toLowerCase();
      return (
        <TicketForm
          customer={customer}
          ticket={ticket}
          isEditable={isEditable}
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
