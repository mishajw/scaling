export default function Header({ children }: { children: React.ReactNode }) {
  return (
    <div className='flex flex-col'>
      <div className='flex-shrink border-2 bg-blue-200 px-4 py-1'>
        <span className="text-2xl font-medium">Scaling calculator</span>
      </div>
      <div className='flex-grow'>{children}</div>
    </div>
  );
}
