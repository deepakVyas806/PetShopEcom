"use client";
/**
 * FormField — single consistent input / textarea style across every form.
 * Replaces CheckoutInput + all scattered direct input styling.
 */
import { cn } from "@/lib/utils";

interface BaseFieldProps {
  label?: string;
  error?: string;
  className?: string;
}

type InputFieldProps = BaseFieldProps &
  Omit<React.InputHTMLAttributes<HTMLInputElement>, "className"> & { multiline?: false };

type TextareaFieldProps = BaseFieldProps &
  Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "className"> & {
    multiline: true;
    rows?: number;
  };

type FieldProps = InputFieldProps | TextareaFieldProps;

const INPUT_CLS =
  "w-full bg-surface-container-low border border-outline-variant/50 rounded-lg " +
  "focus:border-primary focus:ring-0 focus:shadow-[0_0_0_3px_rgba(99,14,212,0.10)] text-xs py-2.5 px-3 " +
  "text-on-surface placeholder:text-on-surface-variant/50 outline-none transition-all duration-150";

export default function FormField(props: FieldProps) {
  const { label, error, className, multiline, ...rest } = props;

  return (
    <div className={cn("space-y-1", className)}>
      {label && (
        <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest ml-0.5">
          {label}
        </label>
      )}

      {multiline ? (
        <textarea
          {...(rest as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
          className={cn(INPUT_CLS, "resize-none")}
          rows={(rest as TextareaFieldProps).rows ?? 3}
        />
      ) : (
        <input
          {...(rest as React.InputHTMLAttributes<HTMLInputElement>)}
          className={cn(INPUT_CLS, error && "border-error focus:border-error")}
        />
      )}

      {error && <p className="text-[10px] text-error font-medium ml-0.5">{error}</p>}
    </div>
  );
}
