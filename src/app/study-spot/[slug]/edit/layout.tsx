export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-screen-2xl space-y-4 p-4">{children}</div>
  );
}
