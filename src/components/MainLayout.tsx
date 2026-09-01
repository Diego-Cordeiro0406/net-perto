export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
      <section className="min-h-screen flex w-full">

        <main className="w-full flex-1 flex flex-col">
          <header className="h-16 border-b border-border bg-card flex items-center px-4 gap-4">

            {/* <NavLink to="/" className="flex items-center gap-2">
              <img src="/images/logo-full.png" alt="Revezah" className="h-9 object-contain" />
            </NavLink> */}
          </header>


          <main className="flex-1 p-6 pb-40 sm:pb-32 bg-background">
            {children}
          </main>

          {/* <Footer /> */}
        </main>
      </section>
  );
}