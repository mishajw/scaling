export default function Link({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a href={href} target='_blank' className='text-blue-500 underline'>
      {children}
    </a>
  );
}
