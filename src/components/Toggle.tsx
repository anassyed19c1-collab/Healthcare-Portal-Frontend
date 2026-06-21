interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export default function Toggle({ checked, onChange }: ToggleProps) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`w-12 h-7 rounded-full p-1 transition-colors ${
        checked ? "bg-primary" : "bg-gray-300"
      }`}
    >
      <span
        className={`block w-5 h-5 bg-white rounded-full shadow transition-transform ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}