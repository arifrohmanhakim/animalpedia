import { useState, useRef, useLayoutEffect, useCallback } from "react";

export function useSectionOffsets(
  containerRef: React.RefObject<HTMLElement>,
  groupKeys: string[],
) {
  const [offsets, setOffsets] = useState<Record<string, number>>({});
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const lastOffsets = useRef<Record<string, number>>({});

  const measure = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const containerTop = container.getBoundingClientRect().top;
    const next: Record<string, number> = {};
    let changed = false;
    for (const key of groupKeys) {
      const el = sectionRefs.current[key];
      if (el) {
        next[key] =
          el.getBoundingClientRect().top - containerTop + container.scrollTop;
        if (next[key] !== lastOffsets.current[key]) changed = true;
      }
    }
    if (changed) {
      lastOffsets.current = next;
      setOffsets(next);
    }
  }, [containerRef, groupKeys]);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    measure();

    const ro = new ResizeObserver(measure);
    ro.observe(container);
    for (const key of groupKeys) {
      const el = sectionRefs.current[key];
      if (el) ro.observe(el);
    }

    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [containerRef, groupKeys, measure]);

  return { offsets, sectionRefs };
}
