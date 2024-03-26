export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-screen-2xl space-y-4">
      <div className="space-y-4 rounded xs:border xs:p-4">
        <h1 className="mb-4 text-lg font-bold underline">Edit Spot 🔧</h1>
        {children}
      </div>
    </div>
  );
}
