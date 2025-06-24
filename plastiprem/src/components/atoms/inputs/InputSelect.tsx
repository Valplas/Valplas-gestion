import { UseFormRegister } from 'react-hook-form';

interface InputSelectProps {
  name: string;
  register: UseFormRegister<any>;
  placeholder?: string;
  options: {
    value: any;
    label: string;
  }[];
  error?: boolean;
  icon?: boolean;
}

export const InputSelect = ({
  name,
  register,
  options,
  placeholder,
  error,
  icon,
}: InputSelectProps) => {
  return (
    <select
    //  pl-11.5 pr-4.5 
      className={`w-full rounded border py-3 px-4.5  ${ icon ? "pl-11.5 pr-4.5" : undefined} border-stroke bg-gray 
        
          text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary ${
        error ? 'border-danger' : undefined
      }`}
      id={name}
      placeholder={placeholder}
      {...register(name)}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};
