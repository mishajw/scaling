import Model from '@/lib/model';

interface Props {
  model: Model;
  setModel: (model: Model) => void;
}

export default function CustomModelEditor({ model, setModel }: Props) {
  return (
    <div>
      <div className='text-lg'>Custom model</div>
      <div className='grid grid-cols-2'>
        <div>FLOPs</div>
        <Input
          value={model.flops}
          setValue={value => setModel({ ...model, flops: value })}
        />
      </div>
    </div>
  );
}

function Input({
  value,
  setValue,
}: {
  value?: number;
  setValue: (value: number) => void;
}) {
  return (
    <input
      className='border-2'
      type='number'
      onChange={e => setValue(Number(e.target.value))}
      value={value}
    />
  );
}
