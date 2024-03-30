import { ModelValueType } from '@/lib/model';

export default function DropDownInput<T extends ModelValueType & string>({
  value,
  options,
  setValue,
}: {
  value?: T;
  options: T[];
  setValue: (value: T) => void;
}) {
  return (
    <select
      className='m-1 px-1 border-2'
      onChange={event => setValue(event.target.value as T)}
      value={value}
    >
      {options.map((option, i) => (
        <option key={i}>{option}</option>
      ))}
    </select>
  );
}
