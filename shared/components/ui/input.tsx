import { IconEraser } from "@/shared/icons/eraser";
import * as React from "react";
import { cn } from "./tabulator";

type Props = React.ComponentProps<"input"> & {
  error?: string | boolean;
  onClear?: () => void;
  leftIcon?: React.ReactNode;
  wrapperClassName?: string;
  clearIcon?: boolean;
  formStates: any;
  name: string;
};

const Input = React.forwardRef<HTMLInputElement, Props>(
  (
    {
      className,
      wrapperClassName,
      type,
      name,
      value,
      error,
      leftIcon,
      clearIcon,
      onChange,
      onClear,
      formStates,
      ...props
    },
    ref
  ) => {
    const internalRef = React.useRef<HTMLInputElement>(null);
    const inputRef = ref || internalRef;

    const handleClear = () => {
      if (onChange) {
        const event = {
          target: {
            value: "",
            name: name,
          },
          currentTarget: {
            value: "",
            name: name,
          },
        } as React.ChangeEvent<HTMLInputElement>;

        onChange(event);
      } else if (typeof inputRef === "object" && inputRef.current) {
        inputRef.current.value = "";
        inputRef.current.dispatchEvent(new Event("input", { bubbles: true }));
      }

      if (typeof inputRef === "object" && inputRef.current) {
        inputRef.current.focus();
      }

      onClear?.();
    };

    return (
      <div className={cn("relative w-full", leftIcon && "pl-2", error && "bg-[#FFECEB]", wrapperClassName)}>
        {leftIcon}

        <input
          ref={inputRef}
          type={type}
          value={value}
          onChange={onChange}
          {...formStates.register(name)}
          data-slot="input"
          className={cn(`bgInput p-3 pr-14 w-full `, className)}
          {...props}
        />

        {value && clearIcon && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
            aria-label="Clear input"
          >
            <IconEraser className="h-4 w-4" />
          </button>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
