"use client";

import { forwardRef } from "react";
import { Button as BsButton } from "react-bootstrap";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: string;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, disabled, type = "button", variant = "primary", ...props }, ref) => {
    return (
      <BsButton type={type} disabled={disabled} variant={variant} ref={ref} {...props}>
        {children}
      </BsButton>
    );
  }
);

Button.displayName = "Button";

export default Button;
