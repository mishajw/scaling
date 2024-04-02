import Link from './link';
import Latex from 'react-latex-next';
import 'katex/dist/katex.min.css';
import { CalculationType } from '@/lib/calculations/types';

const OAI_SCALING = 'https://arxiv.org/abs/2001.08361';
const CHINCHILLA_SCALING = 'https://arxiv.org/abd/2203.15556';

export default function CalculationDescriptions() {
  return (
    <div>
      <div className='text-xl'>Methods</div>
      <CalculationTitle type='flops'>FLOPs</CalculationTitle>
      <div>
        <div className='my-2'>
          OpenAI&apos;s <Link href={OAI_SCALING}>scaling laws paper</Link>{' '}
          simplifies the calculation of FLOPs to be dependent on only the number
          of tokens trained on and number of parameters in the model:
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
          of the total FLOPs when <Latex>{'$d_{model} \\gg d_{ctx}/12$'}</Latex>
          .
        </div>
      </div>
      <CalculationTitle type='chinchilla-loss'>
        Loss scaling law
      </CalculationTitle>
      <div>
        <div className='my-2'>
          DeepMind&apos;s{' '}
          <Link href={CHINCHILLA_SCALING}>Chinchilla scaling laws paper</Link>{' '}
          fits a power law to estimate the loss (in nats) given a fixed number
          of parameters and tokens:
        </div>
        <div className='my-2'></div>
        <Latex>
          {
            '$$L(\\text{\\#params}, \\text{\\#tokens}) = E + \\frac{A}{\\text{\\#params}^\\alpha} + \\frac{B}{\\text{\\#tokens}^\\beta}$$'
          }
        </Latex>
        <div className='my-2'>
          Unfortunately, this is only described for the third approach, so all
          loss calculations use the coefficients from section D.2.
        </div>
      </div>
      <CalculationTitle type='chinchilla-compute-split'>
        Optimal compute split
      </CalculationTitle>
      <div>
        <div className='my-2'>
          Given a fixed amount of FLOPs, DeepMind&apos;s{' '}
          <Link href={CHINCHILLA_SCALING}>Chinchilla scaling laws paper</Link>{' '}
          derives a way to calculate the best way to invest it: Do you scale up
          model size, or scale up dataset size?
        </div>
        <div className='my-2'>
          Again, they fit a power law for this. If you want to infer the optimal
          number of parameters or tokens for a fixed compute size, you can use:
        </div>
        <Latex>
          {
            '$$\\text{\\#params} \\propto (\\text{FLOPs})^a \\\\ \\text{\\#tokens} \\propto (\\text{FLOPs})^b$$'
          }
        </Latex>
        <div className='my-2'>
          To figure out the exact proportionality, we can fit coefficients using
          the examples given in the paper. See{' '}
          <Link href='https://github.com/mishajw/scaling/blob/main/scripts/infer_scaling_law_coefs.py'>
            this script
          </Link>{' '}
          for details.
        </div>
      </div>
      <CalculationTitle type='training-time'>Training time</CalculationTitle>
      <div>
        <div className='my-2'>
          We have a simple relationship between FLOPs, FLOP/S, and training
          time:
        </div>
        <Latex>
          {'$$\\text{FLOPs} = \\text{FLOP/S} * \\text{Training time seconds}$$'}
        </Latex>
      </div>
      <CalculationTitle type='gpu-flops'>GPU FLOP/S</CalculationTitle>
      <div>
        <div className='my-2'>
          We can derive the FLOP/S from the hardware we have:
        </div>
        <Latex>
          {
            '$$\\text{FLOP/S} = \\text{GPU FLOP/S} * \\text{\\#GPUs} * \\text{\\% GPU util}$$'
          }
        </Latex>
        <div className='my-2'>
          N.B.: We don&apos;t take into account the memory required by the model
          anywhere, so keep in mind that constraint when calculating (I&apos;d
          love to add this soon!).
        </div>
      </div>
      <CalculationTitle type='gpu-cost'>GPU cost</CalculationTitle>
      <div>
        <div className='my-2'>
          We calculate the cost of the GPUs from their hourly cost:
        </div>
        <Latex>
          {
            '$$\\$ = \\text{\\$/GPU/hour} * \\text{\\#GPUs} * \\text{Training time hours}$$'
          }
        </Latex>
      </div>
    </div>
  );
}

export const CALCULATION_TITLES: Record<CalculationType, string> = {
  flops: 'FLOPs',
  'chinchilla-loss': 'loss scaling law',
  'chinchilla-compute-split': 'optimal compute split',
  'training-time': 'training time',
  'gpu-flops': 'GPU FLOP/S',
  'gpu-cost': 'GPU cost',
};

function CalculationTitle({
  type,
  children,
}: {
  type: CalculationType;
  children: React.ReactNode;
}) {
  return (
    <div className='text-lg mt-2 font-bold' id={type}>
      {children}
    </div>
  );
}

export function CalculationLink({ type }: { type: CalculationType }) {
  const title = CALCULATION_TITLES[type];
  return (
    <Link href={'#' + type} target='_self'>
      {title}
    </Link>
  );
}
