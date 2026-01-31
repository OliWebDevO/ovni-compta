export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-svh overflow-y-auto bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 px-4 py-8 sm:py-4 sm:flex sm:items-center sm:justify-center">
      <div className="w-full max-w-md mx-auto">
        {children}
      </div>
    </div>
  );
}
