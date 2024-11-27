'use client';

import { selectCustomerSchemaType } from '@/zod-schemas/customer';
import {
  insertTicketSchema,
  type insertTicketSchemaType,
  type selectTicketSchemaType
} from '@/zod-schemas/ticket';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { CheckboxWithLabel } from '@/components/inputs/CheckboxWithLabel';
import { InputWithLabel } from '@/components/inputs/InputWithLabel';
import { SelectWithLabel } from '@/components/inputs/SelectWithLabel';
import { TextAreaWithLabel } from '@/components/inputs/TextAreaWithLabel';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';

type Props = {
  customer: selectCustomerSchemaType;
  ticket?: selectTicketSchemaType;
  techs?: { id: string; description: string }[];
  isEditable?: boolean;
};

export default function TicketForm({
  customer,
  ticket,
  techs,
  isEditable = true
}: Props) {
  const isManager = Array.isArray(techs);

  const defaultValues: insertTicketSchemaType = {
    id: ticket?.id ?? '(New)',
    customerId: ticket?.customerId ?? customer.id,
    title: ticket?.title ?? '',
    description: ticket?.description ?? '',
    completed: ticket?.completed ?? false,
    tech: ticket?.tech ?? 'new-ticket@example.com'
  };

  const form = useForm<insertTicketSchemaType>({
    mode: 'onBlur',
    resolver: zodResolver(insertTicketSchema),
    defaultValues
  });

  async function submitForm(data: insertTicketSchemaType) {
    console.log(data);
  }

  return (
    <div className='flex flex-col gap-1 sm:px-8'>
      <div>
        <h2 className='text-2xl font-bold'>
          {ticket?.id && isEditable
            ? `Edit Ticket # ${ticket.id}`
            : ticket?.id
              ? `View Ticket # ${ticket.id}`
              : 'New Ticket Form'}
        </h2>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(submitForm)}
          className='flex flex-col gap-4 md:flex-row md:gap-8'
        >
          <div className='flex w-full max-w-xs flex-col gap-4'>
            <InputWithLabel<insertTicketSchemaType>
              fieldTitle='Title'
              nameInSchema='title'
              disabled={!isEditable}
            />

            {isManager ? (
              <SelectWithLabel<insertTicketSchemaType>
                fieldTitle='Tech ID'
                nameInSchema='tech'
                data={[
                  {
                    id: 'new-ticket@example.com',
                    description: 'new-ticket@example.com'
                  },
                  ...techs
                ]}
              />
            ) : (
              <InputWithLabel<insertTicketSchemaType>
                fieldTitle='Tech'
                nameInSchema='tech'
                disabled={true}
              />
            )}

            {ticket?.id ? (
              <CheckboxWithLabel<insertTicketSchemaType>
                fieldTitle='Completed'
                nameInSchema='completed'
                message='Yes'
                disabled={!isEditable}
              />
            ) : null}

            <div className='mt-4 space-y-2'>
              <h3 className='text-lg font-bold'>Customer Info</h3>
              <hr className='w-4/5' />
              <p>
                {customer.firstName} {customer.lastName}
              </p>
              <p>{customer.address1}</p>
              {customer.address2 ? <p>{customer.address2}</p> : null}
              <p>
                {customer.city}, {customer.state} {customer.zip}
              </p>
              <hr className='w-4/5' />
              <p>{customer.email}</p>
              <p>Phone: {customer.phone}</p>
            </div>
          </div>

          <div className='flex w-full max-w-xs flex-col gap-4'>
            <TextAreaWithLabel<insertTicketSchemaType>
              fieldTitle='Description'
              nameInSchema='description'
              disabled={!isEditable}
              className='h-96'
            />
            {isEditable ? (
              <div className='flex gap-2'>
                <Button
                  type='submit'
                  className='w-3/4'
                  variant='default'
                  title='Save'
                >
                  Save
                </Button>

                <Button
                  type='button'
                  variant='destructive'
                  title='Reset'
                  onClick={() => form.reset(defaultValues)}
                >
                  Reset
                </Button>
              </div>
            ) : null}
          </div>
        </form>
      </Form>
    </div>
  );
}
