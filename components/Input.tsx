import { forwardRef } from "react";
import { twMerge } from "tailwind-merge";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({ className, type, disabled, label, error, ...props }, ref) => {
  return (
    <div className="w-full">
      <label className="text-sm font-medium leading-6">{label}</label>
      <div className="mt-2">
        <input
          type={type}
          className={twMerge(
            `
            w-full 
            rounded-md 
            border 
            border-gray-300 
            bg-white 
            px-4 
            py-2 
            text-sm 
            file:border-0 
            file:bg-transparent 
            file:text-sm 
            file:font-medium 
            placeholder:text-gray-500 
            focus:outline-none 
            focus:ring-2 
            focus:ring-green-500 
            disabled:cursor-not-allowed 
            disabled:opacity-50
            `,
            className
          )}
          disabled={disabled}
          ref={ref}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
});

Input.displayName = "Input";

export default Input;
