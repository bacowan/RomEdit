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
  const [gotoInput, setGotoInput] = useState("");

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

  // manual arrow key behaviour 
  useEffect(() => {
    const el = componentRef.current;
    if (!el) return;

    const onKeyDown = (e: KeyboardEvent) => {
      const scrollKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
      if (scrollKeys.includes(e.key)) {
        e.preventDefault();
      }
    };

    el.addEventListener('keydown', onKeyDown);
    return () => el.removeEventListener('keydown', onKeyDown);
  }, []);

  // manual scroll wheel behaviour
  useEffect(() => {
    const el = componentRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const rowDelta = Math.round(e.deltaY / rowHeight);
      setTopRowIndex(prev => Math.max(0, Math.min(totalRowCount - visibleRowCount, prev + rowDelta)));
    };

    el.addEventListener('wheel', onWheel, { passive: false }); // passive: false required for preventDefault
    return () => el.removeEventListener('wheel', onWheel);
  }, [totalRowCount, visibleRowCount]);

  const handleGoto = () => {
    const address = parseInt(gotoInput, 16);
    if (isNaN(address)) return;
    const row = Math.floor(address / 16);
    setTopRowIndex(Math.max(0, Math.min(totalRowCount - visibleRowCount, row)));
  };

  return (
    <div className="flex-1 flex flex-col h-full">
      <div className="flex items-center gap-2 px-2 py-1 border-b border-gray-300">
        <input
          type="text"
          value={gotoInput}
          onChange={(e) => setGotoInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") handleGoto(); }}
          placeholder="hex address"
          className="text-sm font-mono px-1 py-0.5 border border-gray-300 rounded w-32"
        />
        <button
          onClick={handleGoto}
          className="text-sm font-mono font-bold px-2 py-0.5 border border-gray-300 rounded hover:bg-gray-100"
        >
          Go to
        </button>
      </div>
      <div ref={componentRef} className="flex-1 overflow-auto">
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
  </div>
  )
}