import Header from './Header';
import Footer from './Footer';

export default function LayoutContainer({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen max-w-2xl mx-auto flex gap-4">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}