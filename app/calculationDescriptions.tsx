import Link from './link';
import Latex from 'react-latex-next';
import 'katex/dist/katex.min.css';
import { CalculationType } from '@/lib/calculations/types';
import { Asset } from 'next/font/google';

export default function CalculationDescriptions() {
  return (
    <div>
      <div className='text-xl'>Methods</div>
      <div className='text-lg mt-2' id='megatron'>
        Megatron-LM equation
      </div>
      <div>
        The&nbsp;
        <Link href='https://arxiv.org/abs/1909.08053'>Megatron-LM</Link>
        &nbsp;paper outlines a simple equation for calculating the number of
        FLOPs:
        <br />
        <Latex>
          {'$$\\text{FLOPs} = \\text{\\#tokens} * \\text{\\#params} * 6$$'}
        </Latex>
      </div>
    </div>
  );
}

export function CalculationLink({ type }: { type: CalculationType }) {
  // let id: string;
  // switch (type) {
  //   case 'megatron':
  //     id = 'megatron';
  //   default:
  //     assertNever(type);
  // }

  const id = {
    megatron: 'megatron',
  }[type];
  const title = {
    megatron: 'Megatron-LM equation',
  }[type];

  return (
    <Link href={'#' + id} target='_self'>
      {title}
    </Link>
  );
}
