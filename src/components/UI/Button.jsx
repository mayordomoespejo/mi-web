import { forwardRef } from "react";

const Button = forwardRef(function Button(
  { children, variant = "primary", disabled = false, className = "", ...props },
  ref
) {
  return (
    <button
      ref={ref}
      className={`btn btn--${variant} ${className}`.trim()}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
});

export default Button;
