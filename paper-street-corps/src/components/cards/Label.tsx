interface LabelProps {
  text: string;
}

export default function Label({ text }: LabelProps) {
  return (
    <span
      className="px-2 py-0.5 text-xs rounded
                 border dark:border-gray-600
                 text-gray-700 dark:text-gray-200"
    >
      {text}
    </span>
  );
}
