import { Checkbox } from "@/components/ui/checkbox";

interface Props {
  value?: string[];
  onChange: (value: string[]) => void;
  options: string[];
  optionLabel: (option: string) => string;
}

export default function CheckboxArray(props: Props) {
  return (
    <ul className="flex gap-2">
      {props.options.map((option) => (
        <li key={option}>
          <Checkbox
            id={option}
            checked={props.value?.includes(option) ?? false}
          />
        </li>
      ))}
    </ul>
  );
}
