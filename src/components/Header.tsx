export default function Header() {
  return (
    <header className="border-b border-neutral-800 px-6 py-4 flex items-center justify-between">
      <div className="font-semibold tracking-wide">
        Paper Street Corps
      </div>

      <nav className="flex gap-6 text-sm text-neutral-300">
        <a href="/" className="hover:text-white">Home</a>
        <a href="/mbti" className="hover:text-white">MBTI</a>
        <a href="/temperaments" className="hover:text-white">Temperaments</a>
        <a href="/theory" className="hover:text-white">Theory</a>
        <a href="/resources" className="hover:text-white">Resources</a>
      </nav>

      <div className="font-semibold tracking-wide invisible">
        Paper Street Corps
      </div>
    </header>
  );
}
