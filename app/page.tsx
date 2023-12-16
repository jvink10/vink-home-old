import Link from 'next/link';

export default function HomePage() {
  return (
    <main>
      <header className="py-4 bg-zinc-700 text-white">
        <div className="flex flex-row justify-evenly mx-8">
          <Link href="#linkSection">Links</Link>
          <Link href="#noteSection">Notes</Link>
          <Link href="#emailSection">Emails</Link>
          <Link href="#docSection">Docs</Link>
        </div>
      </header>
    </main>
  );
};
