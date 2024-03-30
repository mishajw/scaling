import { ModelFieldType } from '@/lib/model';
import { assertNever } from '@/lib/util';

export default function FieldDescription({ type }: { type: ModelFieldType }) {
  switch (type) {
    case 'flops':
      return (
        <div className='text-sm'>
          The number of <b>fl</b>oating point <b>op</b>erations used to train
          the model. N.B.: Different from FLOP/S.
        </div>
      );
    case 'numParams':
      return (
        <div className='text-sm'>
          The number of non-embedding parameters in the model. Including
          embedding params makes for less smooth scaling laws.
        </div>
      );
    case 'numTokens':
      return (
        <div className='text-sm'>
          The number of tokens used to train the model. N.B.: Different models
          use different tokenizers, so this may not accurately reflect the
          number of characters trained on.
        </div>
      );
    case 'lossNats':
      return (
        <div className='text-sm'>
          The final loss of the model. This is the log-likelihood (aka nats) of
          a held-out evaluation set.
        </div>
      );
    case 'trainingTimeDays':
      return (
        <div className='text-sm'>
          The number of days it took to train the model.
        </div>
      );
    case 'flopsPerSecond':
      return (
        <div className='text-sm'>
          The number of <i>effective</i> FLOPs per second while training the
          model. By effective, we mean the number of FLOPs actually done by the
          hardware, not the theoretical maximum FLOPs of the hardware.
        </div>
      );
    case 'gpuType':
      return (
        <div className='text-sm'>
          The type of GPU we're training the model on.
        </div>
      );
    case 'gpuCount':
      return (
        <div className='text-sm'>The number of GPUs we're running on.</div>
      );
    case 'gpuUtilization':
      return (
        <div className='text-sm'>
          The number of GPUs we're running on. Use this to account for
          algorithmic (in)efficiency, especially for running models at scale.
        </div>
      );
    default:
      // assertNever(type);
      return <div>??</div>;
  }
}
