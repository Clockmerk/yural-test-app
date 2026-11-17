export default function Input({ id, label, hint, ...props }) {
  return (
    <div>
      {label ? (
        <label className="form-label" htmlFor={id}>
          {label}
        </label>
      ) : null}
      <input id={id} className="form-control" {...props} />
      {hint ? <div className="form-text">{hint}</div> : null}
    </div>
  );
}
