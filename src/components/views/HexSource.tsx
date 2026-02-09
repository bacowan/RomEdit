export const HexSource = () => {
  const headerValues = Array.from({ length: 16 }, (_, i) =>
    i.toString(16).padStart(2, '0').toUpperCase()
  );

  const hexValues = Array.from({ length: 256 }, (_, i) =>
    i.toString(16).padStart(2, '0').toUpperCase()
  );

  return (
    <div className="p-4 overflow-x-auto h-full">
      <div className="grid w-fit grid-cols-[3rem_repeat(16,1.5rem)]">
        <div className="text-sm font-mono font-bold pb-1 border-b border-gray-300" />
        {headerValues.map((hex) => (
          <div key={`header-${hex}`} className="text-sm font-mono font-bold pb-1 border-b border-gray-300">
            {hex}
          </div>
        ))}
        {hexValues.map((hex, index) => (
          <>
            {index % 16 === 0 && (
              <div key={`offset-${index}`} className="text-sm font-mono font-bold pr-2 border-r border-gray-300">
                {(index).toString(16).padStart(4, '0').toUpperCase()}
              </div>
            )}
            <div
              key={index}
              className="text-sm font-mono"
            >
              {hex}
            </div>
          </>
        ))}
      </div>
    </div>
  );
}