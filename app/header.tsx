import Link from './link';

export default function Header({ children }: { children: React.ReactNode }) {
  return (
    <div className='flex flex-col'>
      <div className='flex flex-row justify-between items-center flex-shrink border-2 bg-blue-200 px-4 py-1'>
        <span className='text-2xl font-medium'>Scaling calculator</span>
        <span>
          Made by <Link href='https://mishajw.com'>mishajw</Link>.{' '}
          <Link href='https://github.com/mishajw/scaling'>Source</Link>.
        </span>
      </div>
      <div className='flex-grow'>{children}</div>
    </div>
  );
}
