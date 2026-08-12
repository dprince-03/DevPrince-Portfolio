const VARIANTS = {
  primary: "bg-term-blue/90 text-term-bg hover:bg-term-blue",
  danger: "bg-term-red/90 text-term-bg hover:bg-term-red",
  success: "bg-term-green/90 text-term-bg hover:bg-term-green",
  ghost: "border border-term-border text-term-silver hover:border-term-gold hover:text-term-gold",
};

export default function Button({ variant = "primary", className = "", ...props }) {
  return (
    <button
      {...props}
      className={`rounded-md px-3 py-2 text-sm font-semibold transition disabled:opacity-50 ${VARIANTS[variant]} ${className}`}
    />
  );
}
