import { PropsWithChildren } from "react";

export function PageHeading({ children }: PropsWithChildren) {
    return <h1 className="font-bold mt-2 lg:mt-6 mb-8 text-4xl">{children}</h1>;
}
