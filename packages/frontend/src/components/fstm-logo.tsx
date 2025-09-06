import clsx from "clsx";
import Image from "next/image";

export function FSTMLogo({ size = 64, className }: { size: number; className?: string }) {
    return (
        <div className={clsx("relative select-none", className)}>
            <Image
                src="/images/FSTM_cube.png"
                width={size}
                height={size}
                alt="FSTM Cube"
                draggable={false}
                quality={100}
                loading="eager"
            />
            <Image
                className="absolute top-0 scale-110 brightness-0 invert -z-5"
                src="/images/FSTM_cube.png"
                width={size}
                height={size}
                alt="FSTM Cube"
                draggable={false}
                quality={100}
                loading="eager"
            />
        </div>
    );
}
