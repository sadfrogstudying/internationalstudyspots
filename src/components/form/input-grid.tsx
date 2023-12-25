export default function InputGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded border border-neutral-400">
      <div className="grid grid-cols-1 gap-4 border-l-4 border-neutral-400 p-4 sm:grid-cols-2 md:grid-cols-4">
        {children}
      </div>
    </div>
  );
}
