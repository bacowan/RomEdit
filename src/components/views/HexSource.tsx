import { useVirtualizer } from "@tanstack/react-virtual";
import { useRef } from "react";

const emToPx = (em: number) => em * parseFloat(getComputedStyle(document.documentElement).fontSize);

export const HexSource = () => {
  const headerValues = [
    "0000",
    ...
    Array.from({ length: 16 }, (_, i) =>
      i.toString(16).padStart(2, '0').toUpperCase()
    )
  ];

  const parentRef = useRef(null)

  // The virtualizer
  const rowVirtualizer = useVirtualizer({
    count: 10000,
    getScrollElement: () => parentRef.current,
    estimateSize: () => emToPx(1.2),
  })


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
            {rowVirtualizer.getVirtualItems().map((virtualItem) => (
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
                          1F
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