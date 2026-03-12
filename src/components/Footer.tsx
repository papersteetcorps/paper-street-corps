export default function Footer() {
  return (
    <footer className="border-t border-surface-800 px-6 py-6 text-sm text-surface-500 flex justify-between">
      <div>&copy; {new Date().getFullYear()} Paper Street Corps</div>
      <div className="text-surface-600">
        Formal psychological assessments grounded in research
      </div>
    </footer>
  );
}
