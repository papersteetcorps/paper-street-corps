interface SuggestionCardProps {
  title: string;
  description: string;
  image?: string;
}

export default function SuggestionCard({
  title,
  description,
  image
}: SuggestionCardProps) {
  return (
    <div
      className="flex gap-4 border rounded-lg p-4 mb-3
                 bg-white dark:bg-navy
                 dark:border-gray-700
                 cursor-pointer transition
                 hover:shadow-md hover:-translate-y-[1px]"
    >
      {/* Image */}
      <div
        className="w-20 h-20 border rounded
                   flex items-center justify-center text-xs
                   dark:border-gray-700"
      >
        {image ? 'IMG' : 'NO IMG'}
      </div>

      {/* Content */}
      <div>
        <h4 className="font-semibold">{title}</h4>
        <p className="text-sm mt-1 text-gray-700 dark:text-gray-300">
          {description}
        </p>
      </div>
    </div>
  );
}
