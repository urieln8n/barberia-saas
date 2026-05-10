import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "dark" | "gold";

type SharedProps = {
  children: ReactNode;
  variant?: Variant;
  className?: string;
};

type ButtonProps = SharedProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: never;
  };

type LinkProps = SharedProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
  };

type PrimaryButtonProps = ButtonProps | LinkProps;

const variantClasses: Record<Variant, string> = {
  primary: "btn-primary",
  secondary: "btn-outline",
  ghost: "btn-ghost",
  danger: "btn-danger",
  dark: "btn-dark",
  gold: "btn-gold",
};

export function PrimaryButton(props: PrimaryButtonProps) {
  const { children, variant = "primary", className = "" } = props;
  const classes = `${variantClasses[variant]} ${className}`;

  if ("href" in props && typeof props.href === "string") {
    const { href, variant: _variant, className: _className, children: _children, ...rest } = props;

    return (
      <Link href={href} className={classes} {...rest}>
        {children}
      </Link>
    );
  }

  const { variant: _variant, className: _className, children: _children, ...rest } = props;

  return (
    <button className={classes} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  );
}
