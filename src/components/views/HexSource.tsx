import { useVirtualizer } from "@tanstack/react-virtual";
import { useRef } from "react";

const emToPx = (em: number) => em * parseFloat(getComputedStyle(document.documentElement).fontSize);

export const HexSource = () => {
  const headerValues = Array.from({ length: 16 }, (_, i) =>
    i.toString(16).padStart(2, '0').toUpperCase()
  );

  const hexValues = Array.from({ length: 256 }, (_, i) =>
    i.toString(16).padStart(2, '0').toUpperCase()
  );

  const parentRef = useRef(null)

  // The virtualizer
  const rowVirtualizer = useVirtualizer({
    count: 10000,
    getScrollElement: () => parentRef.current,
    estimateSize: () => emToPx(1.2),
  })


  return (
    <div ref={parentRef} className="h-full overflow-auto">
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
  )
}