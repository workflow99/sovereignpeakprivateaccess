export default function PageHeader({ title, description, action }) {
  return (
    <div className="flex flex-col gap-4 px-6 pt-6 sm:flex-row sm:items-center sm:justify-between sm:px-8">
      <div className="min-w-0">
        <h1 className="font-serif text-2xl break-words text-white sm:text-3xl">{title}</h1>
        {description && <p className="mt-1.5 break-words text-sm text-[#B3B3B3]">{description}</p>}
      </div>
      {action}
    </div>
  );
}
