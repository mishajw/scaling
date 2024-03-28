import { InferenceExplanationType } from '@/lib/inferences';
import Link from './link';

export default function InferenceExplanation({
  type,
}: {
  type: InferenceExplanationType;
}) {
  if (type === 'simple-flops') {
    return (
      <div>
        The&nbsp;
        <Link href='https://arxiv.org/abs/1909.08053'>Megatron-LM</Link>
        &nbsp;paper outlines a simple equation for calculating the number of
        FLOPs:
        <br />
        FLOPs = numTokens * numParams * 6.
      </div>
    );
  }
}
