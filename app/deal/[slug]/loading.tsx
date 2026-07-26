export default function DealLoading() {
  return (
    <main className="min-h-screen bg-neutral-50">
      <div className="border-b border-neutral-200 bg-white">
        <div className="mx-auto h-16 max-w-7xl px-5 sm:px-8" />
      </div>
      <div className="mx-auto max-w-7xl animate-pulse px-5 py-10 sm:px-8">
        <div className="h-20 rounded-2xl bg-neutral-200" />
        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div className="h-[560px] rounded-3xl bg-neutral-200" />
          <div className="h-[480px] rounded-3xl bg-neutral-200" />
        </div>
      </div>
    </main>
  );
}
