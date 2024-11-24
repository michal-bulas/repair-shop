export default async function RSTemplate({
  children
}: {
  children: React.ReactNode;
}) {
  return <div className='animate-appear'> {children}</div>;
}
