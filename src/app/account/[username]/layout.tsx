export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen w-full bg-neutral-100 p-4 text-sm">
      <div className="mx-auto max-w-screen-2xl">{children}</div>
    </main>
  );
}
