import Header from './Header';
import Footer from './Footer';
import Side from './Side';

export default function LayoutContainer({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen max-w-4xl mx-auto flex">
      <Header className="w-48" />
      <main className="flex-1 border-l border-r dark:border-white/25 pb-12">
        {children}
      </main>
      <div className="relative w-48 ml-4">
        <div className="sticky top-0">
          <p>TODO:</p>
          <Side />
          <Footer />
        </div>
      </div>
    </div>
  );
}