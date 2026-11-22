export default function AuthLayout({ children }: { children:React.ReactNode }) {
  return <main className="min-h-[100dvh] bg-base flex items-center justify-center p-5">
    <div className="w-full max-w-[430px]">{children}</div>
  </main>;
}
