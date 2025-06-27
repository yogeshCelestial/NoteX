import TakeNote from "@/components/TakeNote";

export default function Home() {
  return (
    <main className="flex flex-col w-full min-h-screen">
      <div className="mx-auto w-1/2 p-4">
        <TakeNote />
      </div>
      <br />
      <div className="mx-auto w-4/5 p-4">
        First
      </div>
    </main>
  );
}
