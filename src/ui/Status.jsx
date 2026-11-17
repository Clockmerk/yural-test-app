export function Loader({ children }) {
  return (
    <div className="d-flex align-items-center gap-2 text-secondary py-2" role="status">
      <span className="spinner-border spinner-border-sm text-primary" aria-hidden="true" />
      <span>{children}</span>
    </div>
  );
}

export function Alert({ children }) {
  return (
    <div className="alert alert-danger mb-0" role="alert">
      {children}
    </div>
  );
}

export function Empty({ children }) {
  return <p className="text-secondary mb-0">{children}</p>;
}
