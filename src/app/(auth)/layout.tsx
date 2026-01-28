export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-svh items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        {/* Logo / Titre */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight">
            O.V.N.I
            <span className="ml-2 text-muted-foreground font-normal text-lg">
              Compta
            </span>
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Gestion comptable de l&apos;ASBL
          </p>
        </div>

        {children}
      </div>
    </div>
  );
}
