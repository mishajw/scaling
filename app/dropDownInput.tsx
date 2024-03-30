import { ModelValueType } from '@/lib/model';

export default function DropDownInput<T extends ModelValueType & string>({
  value,
  options,
  setValue,
}: {
  value?: T;
  options: T[];
  setValue: (value: T | undefined) => void;
}) {
  return (
    <select
      className='m-1 px-1 border-2'
      onChange={event =>
        setValue(
          event.target.value !== '' ? (event.target.value as T) : undefined
        )
      }
      value={value}
    >
      <option></option>
      {options.map((option, i) => (
        <option key={i}>{option}</option>
      ))}
    </select>
  );
}
