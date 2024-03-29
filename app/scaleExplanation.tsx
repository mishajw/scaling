import { SI_SYMBOLS } from '@/lib/numberFormat';

export default function ScaleExplanation() {
  const powers = SI_SYMBOLS.map((symbol, i) => ({
    symbol,
    power: i * 3,
  })).filter(({ symbol }) => symbol !== '');
  return (
    <div className='flex justify-center text-sm text-gray-600 italic mt-10'>
      {powers.map(({ symbol, power }, i) => (
        <span key={symbol}>
          {symbol}=10<sup>{power}</sup>
          {i < SI_SYMBOLS.length - 1 && <>&nbsp;</>}
        </span>
      ))}
    </div>
  );
}
