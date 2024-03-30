import Link from './link';
import Latex from 'react-latex-next';
import 'katex/dist/katex.min.css';
import { CalculationType } from '@/lib/calculations/types';

const OAI_SCALING = 'https://TODO';

export default function CalculationDescriptions() {
  return (
    <div>
      <div className='text-xl'>Methods</div>
      <CalculationTitle type='flops'>FLOPs</CalculationTitle>
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
          of the total FLOPs when <Latex>{'$d_{model} \\gg d_{ctx}/12$'}</Latex>
          .
        </div>
      </div>
      <CalculationTitle type='open-ai-loss'>
        OpenAI's loss power law
      </CalculationTitle>
      <div>
        <div className='my-2'>
          OpenAI's <Link href={OAI_SCALING}>scaling laws paper</Link> fits a
          power law to estimate the loss (in nats) given a fixed number of
          parameters and tokens:
        </div>
        <div className='my-2'></div>
        <Latex>
          {/* TODO: Fix latex. */}
          {'$$L(\\text{\\#params}, \\text{\\#tokens}) = (' +
            '(\\frac{N_c}{\\text{\\#params}})^{\\frac{\\alpha_N}{\\alpha_D}} + ' +
            '\\frac{D_c}{\\text{\\#tokens}}' +
            ')^{\\alpha_D}$$'}
        </Latex>
        <div className='my-2'>
          Where <Latex>{'$\\alpha_N = 0.076$'}</Latex>,{' '}
          <Latex>{'$\\alpha_D = 0.103$'}</Latex>,{' '}
          <Latex>{'$N_c = 6.4 * 10^{13}$'}</Latex>,{' '}
          <Latex>{'$N_c = 1.8 * 10^{13}$'}</Latex>. See section 4 for details.
        </div>
      </div>
      <CalculationTitle type='open-ai-compute-split'>
        OpenAI's optimal compute split
      </CalculationTitle>
      <div>
        <div className='my-2'>
          Given a fixed amount of FLOPs, OpenAI's{' '}
          <Link href={OAI_SCALING}>scaling laws paper</Link> derives a way to
          calculate the best way to invest it: Do you scale up model size, or
          scale up dataset size?
        </div>
        <div className='my-2'>
          Again, they fit a power law for this. If you want to infer the optimal
          number of parameters for a fixed compute size, you can use:
        </div>
        <Latex>
          {'$$\\text{\\#params} = 9 * 10^{-7} * (\\text{FLOPs})^{0.7}$$'}
        </Latex>
        <div className='my-2'>
          To then pick the best number of parameter, simply rearrange the{' '}
          <CalculationLink type='flops' /> equation:
        </div>
        <Latex>
          {
            '$$\\text{\\#tokens} = \\frac{\\text{FLOPs}}{\\text{\\#params} * 6}$$'
          }
        </Latex>
        <div className='my-2'>See section 6 for details.</div>
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
          N.B.: We don't take into account the memory required by the model
          anywhere, so keep in mind that constraint when calculating (I'd love
          to add this soon!).
        </div>
      </div>
    </div>
  );
}

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
  const title = {
    flops: 'FLOPs',
    'open-ai-loss': "OpenAI's loss law",
    'open-ai-compute-split': "OpenAI's compute split",
    'training-time': 'training time',
    'gpu-flops': 'GPU FLOP/S',
  }[type];
  return (
    <Link href={'#' + type} target='_self'>
      {title}
    </Link>
  );
}
