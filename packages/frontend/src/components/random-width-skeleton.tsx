import Skeleton from "react-loading-skeleton";

function pseudoRandomFromIndex(index: number, min = 60, max = 100) {
    const x = (index * 93121 + 49297) % 233280;
    const r01 = x / 233280;
    return Math.round(min + r01 * (max - min));
}

const RandomWidthSkeleton: React.FC<
    React.ComponentProps<typeof Skeleton> & { seed: number; width?: number; delta?: number }
> = (props) => {
    const propDelta = props.delta ?? 0.2;
    const propWidth = props.width ?? 60;
    const width = pseudoRandomFromIndex(props.seed, propWidth * (1 - propDelta), propWidth * (1 + propDelta));
    return <Skeleton {...props} width={width} />;
};

export default RandomWidthSkeleton;
