import { siFormat, siParse } from "@/lib/numberFormat";
import { useState } from "react";

export default function NumberInput({
  value,
  setValue,
}: {
  value?: number;
  setValue: (value: number) => void;
}) {
  const [state, setState] = useState({
    numberValue: value,
    stringValue: value ? siFormat(value) : "",
    isValid: true,
  });
  if (state.numberValue !== value) {
    setState({
      numberValue: value,
      stringValue: value ? siFormat(value) : "",
      isValid: true,
    });
  }
  return (
    <input
      className={`m-1 px-1 border-2 ${state.isValid ? '' : 'bg-red-200'}`}
      onChange={e => {
        const valueNumber = siParse(e.target.value);
        if (valueNumber !== undefined) {
          setState({
            numberValue: valueNumber,
            stringValue: e.target.value,
            isValid: true,
          });
          setValue(valueNumber);
        } else {
          setState({
            ...state,
            stringValue: e.target.value,
            isValid: false,
          });
        }
      }}
      value={state.stringValue}
    />
  );
}
