import Header from '@/components/sections/header';
import Footer from '@/components/sections/footer';
import PageTransition from '@/components/effects/page-transition';
import GraniteBackground from '@/components/effects/granite-background';

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-black text-white relative isolate">
      <GraniteBackground />
      <Header />
      <main className="flex-1 flex flex-col">
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer />
    </div>
  );
}
