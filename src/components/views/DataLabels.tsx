import { useState } from "react";

interface KeyValuePair {
    key: string;
    value: string;
    address: string;
}

const VALUE_OPTIONS = ["u8", "u16", "u32", "i8", "i16", "i32", "string", "bool"];

export const DataLabels = () => {
    const [pairs, setPairs] = useState<KeyValuePair[]>([]);

    const addPair = () => {
        setPairs([...pairs, { key: "", value: VALUE_OPTIONS[0], address: "" }]);
    };

    const updateKey = (index: number, key: string) => {
        const updated = [...pairs];
        updated[index].key = key;
        setPairs(updated);
    };

    const updateValue = (index: number, value: string) => {
        const updated = [...pairs];
        updated[index].value = value;
        setPairs(updated);
    };

    const updateAddress = (index: number, address: string) => {
        const updated = [...pairs];
        updated[index].address = address;
        setPairs(updated);
    };

    const handleGoto = (index: number) => {
        const address = parseInt(pairs[index].address, 16);
        if (isNaN(address)) return;
        // TODO: navigate HexSource to this address
    };

    const removePair = (index: number) => {
        setPairs(pairs.filter((_, i) => i !== index));
    };

    return (
        <div className="flex flex-col gap-2 p-2">
            {pairs.map((pair, index) => (
                <div key={index} className="flex items-center gap-2">
                    <input
                        type="text"
                        value={pair.key}
                        onChange={(e) => updateKey(index, e.target.value)}
                        placeholder="Label"
                        className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-400"
                    />
                    <input
                        type="text"
                        value={pair.address}
                        onChange={(e) => updateAddress(index, e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter") handleGoto(index); }}
                        placeholder="hex address"
                        className="font-mono w-24 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-400"
                    />
                    <select
                        value={pair.value}
                        onChange={(e) => updateValue(index, e.target.value)}
                        className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-400"
                    >
                        {VALUE_OPTIONS.map((opt) => (
                            <option key={opt} value={opt}>
                                {opt}
                            </option>
                        ))}
                    </select>
                    <button
                        onClick={() => handleGoto(index)}
                        className="font-mono font-bold px-2 py-1 border border-gray-300 rounded text-sm hover:bg-gray-100"
                    >
                        Go to
                    </button>
                    <button
                        onClick={() => removePair(index)}
                        className="px-2 py-1 text-gray-500 hover:text-red-500 text-sm"
                        title="Remove"
                    >
                        ✕
                    </button>
                </div>
            ))}
            <button
                onClick={addPair}
                className="self-start px-3 py-1 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded text-sm"
            >
                + Add
            </button>
        </div>
    );
};
