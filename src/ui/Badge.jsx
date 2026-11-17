const TONE_CLASS = {
  primary: 'text-bg-primary',
  light: 'text-bg-light border',
};

export default function Badge({ tone = 'light', children }) {
  return <span className={`badge ${TONE_CLASS[tone]}`}>{children}</span>;
}
