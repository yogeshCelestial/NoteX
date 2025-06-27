import TakeNote from "@/components/TakeNote";

export default function Home() {
  return (
    <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
      <div className="flex flex-col gap-4 w-full max-w-3xl">
        <div>
          <TakeNote />
        </div>
        <div>
        </div>
      </div>
    </main>
  );
}
