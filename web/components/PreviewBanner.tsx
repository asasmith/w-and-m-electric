type PreviewBannerProps = {
  isPreview: boolean;
};

export default function PreviewBanner({ isPreview }: PreviewBannerProps) {
  if (!isPreview) {
    return null;
  }

  return (
    <div className="border-b border-amber bg-volt text-paper">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <p className="font-mono text-[0.72rem] uppercase tracking-[0.22em] text-paper/90">Preview mode is active</p>
        <a className="border border-paper/24 px-4 py-2 font-mono text-[0.72rem] uppercase tracking-[0.2em] text-paper transition hover:border-amber hover:text-amber" href="/api/exit-preview">
          Exit preview
        </a>
      </div>
    </div>
  );
}
