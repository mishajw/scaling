import Link from './link';
import Latex from 'react-latex-next';
import 'katex/dist/katex.min.css';
import { CalculationType } from '@/lib/calculations/types';
import { Asset } from 'next/font/google';

const OAI_SCALING = 'https://TODO';

export default function CalculationDescriptions() {
  return (
    <div>
      <div className='text-xl'>Methods</div>
      <div className='text-lg mt-2' id='flops'>
        FLOPs
      </div>
      <div>
        <div className='my-2'>
          OpenAI's <Link href={OAI_SCALING}>scaling laws paper</Link> simplifies
          the calculation of FLOPs to be dependent on only the number of tokens
          trained on and number of parameters in the model:
        </div>
        <Latex>
          {'$$\\text{FLOPs} = \\text{\\#tokens} * \\text{\\#params} * 6$$'}
        </Latex>
        <div className='my-2'>
          For a full explanation see Section 2.1 in the paper. Simply put: in
          the forward pass, for every parameter in the model we do a single
          multiply-add operation. And then the backward pass is twice as
          expensive, so we end up doing{' '}
          <Latex>{'$3 * 2 * \\text{\\#params}$'}</Latex> calculations per token.
        </div>
        <div className='my-2'>
          This ignores simple sub-leading terms such as activation function
          FLOPs and layer norm, but also surprisingly ignores the calculation of
          the attention mask. This is because the mask takes up a small percent
          of the total FLOPs when
          <Latex>{'$d_{model} \\gg d_{ctx}/12$'}</Latex>.
        </div>
      </div>
    </div>
  );
}

export function CalculationLink({ type }: { type: CalculationType }) {
  const id = {
    flops: 'flops',
  }[type];
  const title = {
    flops: 'FLOPs',
  }[type];
  return (
    <Link href={'#' + id} target='_self'>
      {title}
    </Link>
  );
}
