import { useCallback, useEffect, useRef, useState } from "react";
import { emToPx } from "../../utils/domUtils";
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";

const rowHeight = Math.round(emToPx(1.2))

export const HexSource = () => {
  const componentRef = useRef<HTMLDivElement>(null);
  const [componentHeight, setComponentHeight] = useState(0);
  const [topRowIndex, setTopRowIndex] = useState(0);
  const [visibleData, setVisibleData] = useState<number[]>([]);
  const [fileSize, setFileSize] = useState(0);
  const loadIdRef = useRef(0) // used to track what the latest load call was, and ignore all others
  const [projectPath, setProjectPath] = useState<String | null>(null);

  const totalRowCount = Math.ceil(fileSize / 16);
  const visibleRowCount = Math.ceil(componentHeight / rowHeight);

  const headerValues = Array.from({ length: 16 }, (_, i) =>
    i.toString(16).padStart(2, '0').toUpperCase()
  );

  const virtualizedContainerSize = 96000;

  // listen for when a new file is loaded, and grab the new data
  useEffect(() => {
    listen<ProjectLoadedEventParams>('project-loaded', (event) => {
      setProjectPath(event.payload.path);
      setFileSize(event.payload.size);
    });
  }, []);

  const loadData = async (start: number, end: number) => {
    const id = ++loadIdRef.current;
    const bytes = await invoke("load_rom_bytes", {
      start: start,
      end: end,
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

  // load new data into view
  useEffect(() => {
    loadData(topRowIndex * 16, (topRowIndex + visibleRowCount) * 16);
  }, [topRowIndex, visibleRowCount, projectPath]);

  // keep track of how big the container is
  useEffect(() => {
    const el = componentRef.current;
    if (!el) return;

    const observer = new ResizeObserver(([entry]) => {
      setComponentHeight(entry.contentRect.height);
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // keep track of scrolling
  const onScroll = useCallback(() => {
    const el = componentRef.current;
    if (!el) return;
    const { scrollTop, scrollHeight, clientHeight } = el;
    if (scrollTop === 0) {
      setTopRowIndex(0);
    }
    else if (scrollTop + clientHeight >= scrollHeight) {
      setTopRowIndex(totalRowCount - visibleRowCount);
    }
    else {
      setTopRowIndex(Math.floor(scrollTop / (scrollHeight - clientHeight) * totalRowCount))
    }
  }, [totalRowCount, visibleRowCount]);

  useEffect(() => {
    const el = componentRef.current;
    if (!el) return;

    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, [onScroll]);

  return (
    <div ref={componentRef} className="flex-1 overflow-auto h-full">
      <div
            className="w-full relative"
            style={{ height: `${virtualizedContainerSize}px` }}
          >
            <div className="sticky top-0 grid w-fit grid-cols-[max-content_repeat(16,1.5rem)]">
              <div className="text-sm font-mono font-bold pb-1 border-b border-gray-300" />
              {headerValues.map((hex) => (
                <div key={`header-${hex}`} className="text-sm font-mono font-bold pb-1 border-b border-gray-300">
                  {hex}
                </div>
              ))}
              {visibleData.map((hex, index) => (
                <>
                  {index % 16 === 0 && (
                    <div key={`offset-${index}`} className="text-sm font-mono font-bold pr-2 border-r border-gray-300">
                      {(index + topRowIndex * 16).toString(16).padStart(fileSize.toString(16).length, '0').toUpperCase()}
                    </div>
                  )}
                  <div
                    key={index}
                    className="text-sm font-mono"
                  >
                    {hex.toString(16).padStart(2, '0').toUpperCase() ?? ".."}
                  </div>
                </>
              ))}
            </div>
      </div>
    </div>
  )

  // const [visibleData, setVisibleData] = useState<number[]>([]);
  // const [projectPath, setProjectPath] = useState<String | null>(null);
  // const [fileSize, setFileSize] = useState<number>(0);
  // const parentRef = useRef(null)
  // const loadIdRef = useRef(0) // used to track what the latest load call was, and ignore all others

  // const trueRowCount = Math.ceil(fileSize / 16);
  // const virtualRowCount = Math.min(Math.ceil(fileSize / 16), 5000);
  // const virtualRowToRowScale = Math.floor(trueRowCount / virtualRowCount);

  // const virtualIndexToRealIndex = (virtualIndex: number) => {
  //   return virtualIndex * virtualRowToRowScale;
  // }

  // const rowVirtualizer = useVirtualizer({
  //   count: virtualRowCount,
  //   getScrollElement: () => parentRef.current,
  //   estimateSize: () => rowSize
  // })

  // const virtualItems = rowVirtualizer.getVirtualItems();
  // const virtualStartIndex = virtualItems[0]?.index ?? 0;
  // const virtualEndIndex = virtualItems[virtualItems.length - 1]?.index ?? 0;
  // const realStartIndex = virtualIndexToRealIndex(virtualStartIndex)

  // const loadData = async (start: number, end: number) => {
  //   const id = ++loadIdRef.current;
  //   console.log(id)
  //   const bytes = await invoke("load_rom_bytes", {
  //     start: start * 16,
  //     end: end * 16,
  //   });
  //   if (id !== loadIdRef.current) return; // ignore all but the latest call
  //   if (bytes instanceof ArrayBuffer) {
  //     const asArray: number[] = [];
  //     for (const entry of new Uint8Array(bytes)) {
  //       asArray.push(entry);
  //     }
  //     setVisibleData(asArray);
  //   }
  // }

  // // const debouncedLoadData = useRef(
  // //   debounce(
  // //     (start: number, end: number) => loadData(start, end),
  // //     1000,
  // //     { onCooldown: () => setVisibleData([]) }
  // //   )
  // // ).current;

  // // load new hex view
  // useEffect(() => {
  //   loadData(realStartIndex, realStartIndex + virtualEndIndex - virtualStartIndex);
  // }, [realStartIndex, virtualStartIndex, virtualEndIndex, projectPath]);

  // // listen for when a new file is loaded, and grab the new data
  // useEffect(() => {
  //   listen<ProjectLoadedEventParams>('project-loaded', (event) => {
  //     setProjectPath(event.payload.path);
  //     setFileSize(event.payload.size);
  //   });
  // }, []);
  
  // const fileSizeHex = fileSize.toString(16);
  // const headerValues = [
  //   fileSizeHex,
  //   ...
  //   Array.from({ length: 16 }, (_, i) =>
  //     i.toString(16).padStart(2, '0').toUpperCase()
  //   )
  // ];

  // return (
  //   <div className="h-full flex flex-col">
  //     <div className="flex flex-row pb-1 border-b border-gray-300">
  //       {headerValues.map((hex, index) => (
  //         <div key={`header-${hex}`} className={`text-sm font-mono font-bold px-1 ${index === 0 ? 'invisible' : ''}`}>
  //           {hex}
  //         </div>
  //       ))}
  //     </div>
  //     <div ref={parentRef} className="flex-1 overflow-auto">
  //       <div
  //           className="w-full relative"
  //           style={{ height: `${rowVirtualizer.getTotalSize()}px` }}
  //         >
  //           {virtualItems.map((virtualItem) => (
  //             <div
  //               key={virtualItem.key}
  //               className="flex flex-row"
  //               style={{
  //                 position: 'absolute',
  //                 top: 0,
  //                 left: 0,
  //                 width: '100%',
  //                 height: `${virtualItem.size}px`,
  //                 transform: `translateY(${virtualItem.start}px)`,
  //               }}>
  //                 <span className="text-sm font-mono font-bold px-1 border-r border-gray-300">
  //                   {
  //                     (realStartIndex + virtualItem.index * 16).toString(16).padStart(fileSizeHex.length, '0').toUpperCase()
  //                   }
  //                 </span>
  //                 {Array.from({ length: 16 }, (_, i) => {
  //                   return (
  //                     <div
  //                       key={i}
  //                       className="text-sm font-mono font-bold px-1">
  //                         {
  //                           visibleData[(virtualItem.index - virtualStartIndex) * 16 + i]?.toString(16).padStart(2, '0').toUpperCase() ?? ".."
  //                         }
  //                     </div>
  //                   );
  //                 })}
  //             </div>
  //           ))}
  //       </div>
  //     </div>
  //   </div>
  // )
}