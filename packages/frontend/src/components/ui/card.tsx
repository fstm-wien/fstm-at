import Link, { LinkProps } from "next/link";
import { AnchorHTMLAttributes, HTMLAttributes } from "react";
import { VariantProps, tv } from "tailwind-variants";

const cardStyles = tv({
    base: "flex border bg-background border-background-emphest rounded-sm",
    variants: {
        size: {
            small: "py-1 px-2",
            base: "py-3 px-4",
            large: "py-6 px-7",
        },
    },
    defaultVariants: {
        size: "base",
    },
});

const linkCardStyles = tv({
    extend: cardStyles,
    base: "cursor-pointer hover:bg-background-emph",
});

type CardVariants = VariantProps<typeof cardStyles>;

export type CardProps = CardVariants & HTMLAttributes<HTMLDivElement> & {};

export function Card({ size, className, ...props }: CardProps) {
    return <div className={cardStyles({ size, className })} {...props}></div>;
}

type LinkCardVariants = VariantProps<typeof linkCardStyles>;

export type LinkCardProps = LinkCardVariants & AnchorHTMLAttributes<HTMLAnchorElement> & LinkProps;

export function LinkCard({ size, className, ...props }: LinkCardProps) {
    return <Link className={linkCardStyles({ size, className })} {...props} />;
}
