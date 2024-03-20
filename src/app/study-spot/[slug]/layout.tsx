export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen w-full">
      <div className="mx-auto max-w-screen-2xl">{children}</div>
    </main>
  );
}
