import { useEffect, useRef, useState } from 'react';

const MIN_THUMB_REM = 1.75;
const HIDDEN_THUMB = { visible: false, top: 0, height: 0 };

function getRootFontSize() {
  return Number.parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
}

function toRem(px) {
  return `${px / getRootFontSize()}rem`;
}

function measureThumb(viewport, trackHeight) {
  const { scrollTop, scrollHeight, clientHeight } = viewport;

  if (scrollHeight <= clientHeight + 1 || trackHeight <= 0) {
    return HIDDEN_THUMB;
  }

  const height = Math.max(
    (clientHeight / scrollHeight) * trackHeight,
    MIN_THUMB_REM * getRootFontSize(),
  );
  const maxTop = trackHeight - height;
  const top = maxTop <= 0 ? 0 : (scrollTop / (scrollHeight - clientHeight)) * maxTop;

  return { visible: true, top, height };
}

/**
 * Прячет системный скроллбар Windows (со стрелками) и рисует свой ползунок.
 * Размер содержимого отслеживает ResizeObserver, поэтому от `children` эффект не зависит.
 * @param {{ children: import('react').ReactNode, className?: string }} props
 */
export default function ScrollArea({ children, className = '' }) {
  const viewportRef = useRef(null);
  const railRef = useRef(null);
  const dragRef = useRef(null);

  const [thumb, setThumb] = useState(HIDDEN_THUMB);

  useEffect(() => {
    const viewport = viewportRef.current;
    const rail = railRef.current;
    const syncThumb = () => setThumb(measureThumb(viewport, rail.clientHeight));

    syncThumb();
    viewport.addEventListener('scroll', syncThumb, { passive: true });

    const resizeObserver = new ResizeObserver(syncThumb);
    resizeObserver.observe(viewport);
    resizeObserver.observe(rail);

    if (viewport.firstElementChild) {
      resizeObserver.observe(viewport.firstElementChild);
    }

    return () => {
      viewport.removeEventListener('scroll', syncThumb);
      resizeObserver.disconnect();
    };
  }, []);

  const handleThumbPointerDown = (event) => {
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = { startY: event.clientY, startScrollTop: viewportRef.current.scrollTop };
  };

  const handleThumbPointerMove = (event) => {
    const drag = dragRef.current;

    if (!drag) {
      return;
    }

    const viewport = viewportRef.current;
    const maxScroll = viewport.scrollHeight - viewport.clientHeight;
    const trackSpace = railRef.current.clientHeight - event.currentTarget.offsetHeight;

    if (maxScroll <= 0 || trackSpace <= 0) {
      return;
    }

    viewport.scrollTop =
      drag.startScrollTop + ((event.clientY - drag.startY) / trackSpace) * maxScroll;
  };

  const handleThumbPointerUp = () => {
    dragRef.current = null;
  };

  return (
    <div className={`scroll-area ${className}`.trim()}>
      <div className="scroll-area__clip">
        <div ref={viewportRef} className="scroll-area__viewport">
          {children}
        </div>
      </div>
      <div ref={railRef} className="scroll-area__rail" aria-hidden="true">
        {thumb.visible ? (
          <button
            type="button"
            className="scroll-area__thumb"
            tabIndex={-1}
            style={{ top: toRem(thumb.top), height: toRem(thumb.height) }}
            onPointerDown={handleThumbPointerDown}
            onPointerMove={handleThumbPointerMove}
            onPointerUp={handleThumbPointerUp}
            onPointerCancel={handleThumbPointerUp}
          />
        ) : null}
      </div>
    </div>
  );
}
