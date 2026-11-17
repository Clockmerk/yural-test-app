export default function Button({ children, ...props }) {
  return (
    <button type="button" className="btn btn-primary" {...props}>
      {children}
    </button>
  );
}
