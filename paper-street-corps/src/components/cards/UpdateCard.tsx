import Label from './Label';

interface UpdateCardProps {
  title: string;
  description: string;
  image?: string;
  access: 'Free' | 'Paid';
  category: 'Typology' | 'Software';
}

export default function UpdateCard({
  title,
  description,
  image,
  access,
  category
}: UpdateCardProps) {
  return (
    <div
      className="flex gap-4 border rounded-lg p-4 mb-4
                 bg-white dark:bg-navy
                 dark:border-gray-700
                 transition
                 hover:shadow-md hover:-translate-y-[1px]"
    >
      {/* Image */}
      <div
        className="w-28 h-28 border rounded
                   flex items-center justify-center text-xs
                   dark:border-gray-700"
      >
        {image ? 'IMG' : 'NO IMG'}
      </div>

      {/* Content */}
      <div className="flex-1">
        <h3 className="font-semibold text-lg">{title}</h3>
        <p className="text-sm mt-1 text-gray-700 dark:text-gray-300">
          {description}
        </p>

        <div className="flex gap-2 mt-4 justify-end">
          <Label text={access} />
          <Label text={category} />
        </div>
      </div>
    </div>
  );
}
