import { PropsWithChildren } from "react";

export function PageHeading({ children }: PropsWithChildren) {
    return <h1 className="mt-6 mb-4 text-4xl">{children}</h1>;
}
