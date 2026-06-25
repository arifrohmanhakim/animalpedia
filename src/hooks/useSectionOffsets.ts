import { useState, useRef, useLayoutEffect } from "react";

export function useSectionOffsets(
  containerRef: React.RefObject<HTMLElement>,
  groupKeys: string[],
) {
  const [offsets, setOffsets] = useState<Record<string, number>>({});
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const measure = () => {
      const containerTop = container.getBoundingClientRect().top;
      const next: Record<string, number> = {};
      for (const key of groupKeys) {
        const el = sectionRefs.current[key];
        if (el) {
          next[key] =
            el.getBoundingClientRect().top - containerTop + container.scrollTop;
        }
      }
      setOffsets(next);
    };

    measure();

    const ro = new ResizeObserver(measure);
    ro.observe(container);
    for (const key of groupKeys) {
      const el = sectionRefs.current[key];
      if (el) ro.observe(el);
    }

    const mo = new MutationObserver(measure);
    mo.observe(container, {
      childList: true,
      subtree: true,
      attributes: true,
    });

    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      mo.disconnect();
      window.removeEventListener("resize", measure);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerRef, groupKeys.join(",")]);

  return { offsets, sectionRefs };
}
