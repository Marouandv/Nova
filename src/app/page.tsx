import ProductList from "@/app/components/ProductList";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex w-full max-w-2xl flex-1 flex-col gap-6 px-6 py-10 sm:px-8">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            Verkauf
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Produktliste
          </p>
        </div>
        <ProductList />
      </main>
    </div>
  );
}
