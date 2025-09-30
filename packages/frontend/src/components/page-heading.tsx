import { twMerge } from "tailwind-merge";

export function PageHeading({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
    return (
        <h1 className={twMerge("font-bold mt-2 lg:mt-6 mb-8 text-4xl leading-[1.05]", className)} {...props}>
            {children}
        </h1>
    );
}
