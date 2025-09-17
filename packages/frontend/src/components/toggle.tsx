import clsx from "clsx";

export function Toggle({
    value = false,
    onChange,
    activeColor,
}: {
    value?: boolean;
    onChange: (newValue: boolean) => void;
    activeColor: string;
}) {
    let c: string;
    if (activeColor == "bg-orange-400") {
        c = "peer-checked:bg-orange-400";
    } else if (activeColor == "bg-blue-400") {
        c = "peer-checked:bg-blue-400";
    } else {
        c = "peer-checked:bg-green-600";
    }

    return (
        <label className="inline-flex items-center cursor-pointer">
            <input
                type="checkbox"
                className="sr-only peer"
                checked={value}
                onChange={(e) => onChange(e.target.checked)}
            />
            <div className={clsx("w-8 h-5 bg-gray-300 rounded-full peer transition-colors duration-300", c)}></div>
            <div className="absolute ml-1 w-3 h-3 bg-white rounded-full transition-transform duration-300 peer-checked:translate-x-3"></div>
        </label>
    );
}
