import Link, { LinkProps } from "next/link";
import { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";
import { VariantProps, tv } from "tailwind-variants";

const buttonStyles = tv({
    base: "rounded-sm cursor-pointer select-none disabled:bg-background-emphest disabled:cursor-default text-center",
    variants: {
        variant: {
            primary: "bg-orange-400 hover:bg-orange-500 text-white",
            secondary: "bg-background-emph hover:bg-background-emphest",
            outlined:
                "border border-orange-400 text-orange-600 bg-orange-100 hover:bg-orange-200 dark:border-orange-600 dark:bg-orange-800/30 dark:text-orange-200",
        },
        size: {
            small: "px-2 py-1",
            base: "px-3 py-1",
            large: "px-4 py-2",
        },
    },
    defaultVariants: {
        variant: "primary",
        size: "base",
    },
});

export type ButtonProps = VariantProps<typeof buttonStyles> & ButtonHTMLAttributes<HTMLButtonElement> & {};

export function Button({ variant, className, ...props }: ButtonProps) {
    return <button type="button" className={buttonStyles({ variant, className })} {...props} />;
}

export type LinkButtonProps = VariantProps<typeof buttonStyles> & AnchorHTMLAttributes<HTMLAnchorElement> & LinkProps;

export function LinkButton({ variant, className, ...props }: LinkButtonProps) {
    return <Link className={buttonStyles({ variant, className })} {...props} />;
}

const iconButtonStyles = tv({
    extend: buttonStyles,
    variants: {
        size: {
            small: "p-1",
            base: "p-2",
            large: "p-3",
        },
    },
});

export type IconButtonProps = VariantProps<typeof iconButtonStyles> & ButtonHTMLAttributes<HTMLButtonElement> & {};

export function IconButton({ variant, className, ...props }: ButtonProps) {
    return <button type="button" className={iconButtonStyles({ variant, className })} {...props} />;
}
