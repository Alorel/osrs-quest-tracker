import {PropRef, useEffect} from 'preact/hooks';

export function useEventListener(
  ref: PropRef<any>,
  evt: string,
  listener: any,
  opts?: AddEventListenerOptions
): void {
  useEffect(() => {
    const curr = ref.current as HTMLElement;
    if (!curr) {
      return;
    }

    curr.addEventListener(evt, listener, opts);

    return () => {
      curr.removeEventListener(evt, listener, opts);
    };
  }, [ref.current, evt, listener, opts]);
}
