import ScrollArea from '@/ui/ScrollArea';

export function List({ children }) {
  return (
    <ScrollArea className="scroll-area--list">
      <div className="list-group list-group-flush">{children}</div>
    </ScrollArea>
  );
}

export function ListItem({ selected, onClick, children }) {
  return (
    <button
      type="button"
      className={`list-group-item list-group-item-action d-flex align-items-center gap-3 py-3 text-start${selected ? ' active' : ''}`}
      aria-current={selected || undefined}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
