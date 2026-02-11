import { useVirtualizer } from "@tanstack/react-virtual";
import { useEffect, useRef, useState } from "react";
import { emToPx } from "../../utils/domUtils";
import { invoke } from "@tauri-apps/api/core";

export const HexSource = () => {
  const [visibleData, setVisibleData] = useState<number[]>([]);
  const parentRef = useRef(null)
  const loadIdRef = useRef(0) // used to track what the latest load call was, and ignore all others

  const rowVirtualizer = useVirtualizer({
    count: 10000,
    getScrollElement: () => parentRef.current,
    estimateSize: () => emToPx(1.2),
  })

  const virtualItems = rowVirtualizer.getVirtualItems();
  const startIndex = virtualItems[0]?.index ?? 0;
  const endIndex = virtualItems[virtualItems.length - 1]?.index ?? 0;

  const loadData = async (start: number, end: number) => {
    const id = ++loadIdRef.current;
    const bytes = await invoke("load_rom_bytes", {
      start: start * 16,
      end: end * 16,
    });
    if (id !== loadIdRef.current) return; // ignore all but the latest call
    if (bytes instanceof ArrayBuffer) {
      const asArray: number[] = [];
      for (const entry of new Uint8Array(bytes)) {
        asArray.push(entry);
      }
      setVisibleData(asArray);
    }
  }

  useEffect(() => {
    loadData(startIndex, endIndex);
  }, [startIndex, endIndex]);
  
  const headerValues = [
    "0000",
    ...
    Array.from({ length: 16 }, (_, i) =>
      i.toString(16).padStart(2, '0').toUpperCase()
    )
  ];

  return (
    <div className="h-full flex flex-col">
      <div className="flex flex-row pb-1 border-b border-gray-300">
        {headerValues.map((hex, index) => (
          <div key={`header-${hex}`} className={`text-sm font-mono font-bold px-1 ${index === 0 ? 'invisible' : ''}`}>
            {hex}
          </div>
        ))}
      </div>
      <div ref={parentRef} className="flex-1 overflow-auto">
        <div
            className="w-full relative"
            style={{ height: `${rowVirtualizer.getTotalSize()}px` }}
          >
            {virtualItems.map((virtualItem) => (
              <div
                key={virtualItem.key}
                className="flex flex-row"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: `${virtualItem.size}px`,
                  transform: `translateY(${virtualItem.start}px)`,
                }}>
                  <span className="text-sm font-mono font-bold px-1 border-r border-gray-300">{virtualItem.index.toString(16).padStart(4, '0').toUpperCase()}</span>
                  {Array.from({ length: 16 }, (_, i) => {
                    return (
                      <div
                        key={i}
                        className="text-sm font-mono font-bold px-1">
                          {
                            visibleData[(virtualItem.index - startIndex) * 16 + i]?.toString(16).padStart(2, '0').toUpperCase() ?? ".."
                          }
                      </div>
                    );
                  })}
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}