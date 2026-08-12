const baseClass =
  "w-full rounded-md border border-term-border bg-term-bg px-3 py-2 text-sm text-term-white outline-none focus:border-term-blue";

export function TextField({ label, className = "", ...props }) {
  return (
    <div className="space-y-1">
      <label className="text-xs text-term-silver-dim" htmlFor={props.id}>
        {label}
      </label>
      <input {...props} className={`${baseClass} ${className}`} />
    </div>
  );
}

export function TextareaField({ label, className = "", ...props }) {
  return (
    <div className="space-y-1">
      <label className="text-xs text-term-silver-dim" htmlFor={props.id}>
        {label}
      </label>
      <textarea {...props} className={`${baseClass} ${className}`} />
    </div>
  );
}

export function SelectField({ label, children, className = "", ...props }) {
  return (
    <div className="space-y-1">
      <label className="text-xs text-term-silver-dim" htmlFor={props.id}>
        {label}
      </label>
      <select {...props} className={`${baseClass} ${className}`}>
        {children}
      </select>
    </div>
  );
}

export function CheckboxField({ label, className = "", ...props }) {
  return (
    <label className="flex items-center gap-2 text-sm text-term-silver">
      <input type="checkbox" {...props} className={`accent-term-blue ${className}`} />
      {label}
    </label>
  );
}
