export default function AppLoading() {
  return (
    <div role="status" aria-label="Caricamento pagina" className="space-y-4 px-4 pb-36 pt-4">
      <span className="sr-only">Caricamento...</span>
      <div className="h-8 w-40 animate-pulse rounded-lg bg-subtle" />
      <div className="h-12 animate-pulse rounded-2xl bg-subtle" />
      <div className="space-y-3">
        <div className="h-36 animate-pulse rounded-2xl bg-card" />
        <div className="h-36 animate-pulse rounded-2xl bg-card" />
      </div>
    </div>
  );
}
