/** @param {{
 *   id?: string,
 *   options: { value: string, label: string }[],
 *   value: string,
 *   onChange: (value: string) => void,
 *   'aria-label': string,
 * }} props
 */
export default function Select({ id, options, value, onChange, 'aria-label': ariaLabel }) {
  const handleChange = (event) => {
    onChange(event.target.value);
  };

  return (
    <select
      id={id}
      className="form-select"
      value={value}
      aria-label={ariaLabel}
      onChange={handleChange}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
