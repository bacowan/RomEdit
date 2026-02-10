interface DebounceOptions<T extends (...args: Parameters<T>) => void> {
  leading?: boolean;
  onCooldown?: (...args: Parameters<T>) => void;
}

export const debounce = <T extends (...args: Parameters<T>) => void>(
  fn: T,
  delay: number,
  { leading = false, onCooldown }: DebounceOptions<T> = {}
): T => {
  let timer: ReturnType<typeof setTimeout> | null = null;
  return ((...args: Parameters<T>) => {
    const isFirstCall = leading && !timer;
    const isOnCooldown = !!timer;

    clearTimeout(timer ?? undefined);
    timer = setTimeout(() => {
      timer = null;
      if (!isFirstCall) fn(...args);
    }, delay);

    if (isFirstCall) fn(...args);
    else if (isOnCooldown) onCooldown?.(...args);
  }) as T;
}