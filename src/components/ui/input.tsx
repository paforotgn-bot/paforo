import { cn } from '@/lib/utils';

/*
  Campos a una línea: sin caja, sin esquinas redondeadas, sin anillo de foco
  de color. Sólo la regla inferior, que se enciende al enfocar.
*/
const field =
  'w-full border-0 border-b border-line bg-transparent px-0 py-3 text-paper placeholder:text-faint focus:border-paper focus:outline-none focus:ring-0 transition-colors';

const invalid = 'border-accent focus:border-accent';

function Field({
  label,
  error,
  id,
  children,
}: {
  label: string;
  error?: string;
  id?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="label block">
        {label}
      </label>
      {children}
      {error && <p className="label !text-accent">{error}</p>}
    </div>
  );
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function Input({ label, error, className, id, ...props }: InputProps) {
  return (
    <Field label={label} error={error} id={id}>
      <input id={id} className={cn(field, error && invalid, className)} {...props} />
    </Field>
  );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

export function Textarea({ label, error, className, id, ...props }: TextareaProps) {
  return (
    <Field label={label} error={error} id={id}>
      <textarea
        id={id}
        className={cn(field, 'min-h-[140px] resize-y', error && invalid, className)}
        {...props}
      />
    </Field>
  );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  options: { value: string; label: string }[];
}

export function Select({ label, error, className, id, options, ...props }: SelectProps) {
  return (
    <Field label={label} error={error} id={id}>
      <select id={id} className={cn(field, error && invalid, className)} {...props}>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-ink text-paper">
            {opt.label}
          </option>
        ))}
      </select>
    </Field>
  );
}
