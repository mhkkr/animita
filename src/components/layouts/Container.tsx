import Sidebar from './Sidebar';

export default function LayoutContainer({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex">
      <Sidebar />
      <main className="max-w-5xl mx-auto">
        {children}
      </main>
    </div>
  );
}