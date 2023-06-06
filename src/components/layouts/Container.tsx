import Header from './Header';
import Footer from './Footer';

export default function LayoutContainer({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="sm:px-4 pb-14 sm:pb-0">
      <div className="min-h-screen max-w-4xl mx-auto sm:flex">
        <Header className="w-full sm:w-48" />
        <div className="flex-1 flex flex-col lg:flex-row sm:border-l sm:border-r lg:border-r-0 dark:border-white/25">
          <main className="flex-1 lg:border-r dark:border-white/25 pb-12">
            {children}
          </main>
          <div className="relative lg:w-48 px-4 lg:pr-0">
            <div className="lg:sticky lg:top-0 lg:h-screen lg:flex lg:flex-col">
              <Footer className="mt-auto mb-4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}