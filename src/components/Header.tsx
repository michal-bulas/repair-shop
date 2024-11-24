import Link from 'next/link';

import { LogoutLink } from '@kinde-oss/kinde-auth-nextjs/components';
import { FileIcon, HomeIcon, LogOutIcon, UsersRound } from 'lucide-react';

import { ModeToggle } from '@/components/ModeToggle';
import NavButton from '@/components/NavButton';
import { Button } from '@/components/ui/button';

const Header = () => {
  return (
    <header className='animate-slide sticky top-0 z-20 h-12 border-b bg-background p-2'>
      <div className='flex h-8 w-full items-center justify-between'>
        <div className='flex items-center gap-2'>
          <NavButton
            href='/home'
            label='Home'
            icon={HomeIcon}
          />
          <Link
            href='/home'
            className='ml-0 flex items-center justify-center gap-2'
            title='Home'
          >
            <h1 className='m-0 mt-1 hidden text-xl font-bold sm:block'>
              Computer Repair Shop
            </h1>
          </Link>
        </div>
        <div className='flex items-center'>
          <NavButton
            href='/tickets'
            label='Tickets'
            icon={FileIcon}
          />

          <NavButton
            href='/customers'
            label='Customers'
            icon={UsersRound}
          />

          <ModeToggle />

          <Button
            variant='ghost'
            size='icon'
            aria-label='Logout'
            title='Logout'
            className='rounded-full'
            asChild
          >
            <LogoutLink>
              <LogOutIcon />
            </LogoutLink>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
