import Link from './link';
import Latex from 'react-latex-next';
import 'katex/dist/katex.min.css';
import { InferenceExplanationType } from '@/lib/inferences';

export default function MethodDescriptions() {
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

export const INFERENCE_TITLES: Record<InferenceExplanationType, string> = {
  megatron: 'Megatron-LM equation',
};
export const INFERENCE_IDS: Record<InferenceExplanationType, string> = {
  megatron: 'megatron',
};
