import Image from 'next/image';

export const metadata = {
  title: 'Page not Found'
};

export default function NotFound() {
  return (
    <div className='w-full px-2'>
      <div className='mx-auto flex flex-col items-center justify-center gap-4 py-4'>
        <h2 className='text-2xl'>Page Not Found</h2>
        <Image
          alt='Page Not Found'
          src='/images/not-found-1024x1024.png'
          width={300}
          height={300}
          sizes='300px'
          priority={true}
          className='m-0 rounded-xl'
        />
      </div>
    </div>
  );
}
