import Badge from '@/ui/Badge';

export default function Card({ ref, id, step, title, meta, children }) {
  const titleId = id ? `${id}-title` : undefined;
  const hasHeader = step || title || meta;

  return (
    <section ref={ref} className="card shadow-sm" id={id} aria-labelledby={titleId}>
      {hasHeader && (
        <div className="card-header bg-white d-flex align-items-center gap-2 py-3">
          {step ? <Badge tone="primary">{step}</Badge> : null}
          {title ? (
            <h2 id={titleId} className="h6 mb-0">
              {title}
            </h2>
          ) : null}
          {meta !== undefined ? (
            <span
              className={`ms-auto${meta ? '' : ' invisible'}`}
              aria-hidden={meta ? undefined : true}
            >
              <Badge>{meta || '\u00a0'}</Badge>
            </span>
          ) : null}
        </div>
      )}
      <div className="card-body">{children}</div>
    </section>
  );
}
