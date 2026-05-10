export default function MenuLoading() {
  return (
    <section className="bg-ink pb-20 pt-36 md:pt-44">
      <div className="site-shell">
        <div className="h-4 w-24 rounded-full bg-brass/30" />
        <div className="mt-5 h-16 max-w-2xl rounded-md bg-ivory/10" />
        <div className="mt-14 space-y-6">
          {[1, 2, 3].map((item) => (
            <div key={item} className="grid gap-5 border-t border-ivory/10 py-6 md:grid-cols-[128px_1fr_auto]">
              <div className="aspect-[5/4] rounded-md bg-ivory/10" />
              <div className="space-y-3">
                <div className="h-7 w-56 rounded-md bg-ivory/10" />
                <div className="h-4 max-w-xl rounded-md bg-ivory/10" />
                <div className="h-4 max-w-md rounded-md bg-ivory/10" />
              </div>
              <div className="h-6 w-20 rounded-md bg-brass/20" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
