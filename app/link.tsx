export default function Link({
  href,
  children,
  target,
}: {
  href: string;
  children: React.ReactNode;
  target?: string;
}) {
  return (
    <a
      href={href}
      target={target ?? '_blank'}
      className='text-blue-500 underline'
    >
      {children}
    </a>
  );
}
