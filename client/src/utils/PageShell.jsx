export default function PageShell({ header, children, footer }) {
  return (
    <div className="wa-shell">
      {header}
      <main className="wa-body">
        <div className="mx-auto flex w-full max-w-2xl flex-col gap-3">{children}</div>
      </main>
      {footer && (
        <footer className="sticky bottom-0 z-20 border-t border-wa-border bg-white px-4 py-3">
          <div className="mx-auto w-full max-w-2xl">{footer}</div>
        </footer>
      )}
    </div>
  );
}
