import { InferenceExplanation } from '@/lib/inferences';

export default function InferenceExplanation({
  type,
}: {
  type: InferenceExplanation;
}) {
  if (type === 'simple-flops') {
    return (
      <div>
        The&nbsp;
        <a href='https://arxiv.org/abs/1909.08053' target='_blank'>
          Megatron-LM
        </a>
        &nbsp;paper outlines a simple equation for calculating the number of
        FLOPs:
        <br />
        FLOPs = numTokens * numParams * 6.
      </div>
    );
  }
}
