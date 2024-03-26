export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen w-full p-4">
      <div className="mx-auto max-w-screen-2xl">{children}</div>
    </main>
  );
}
