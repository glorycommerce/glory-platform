type BannerSlotProps = {
  title: string;
  size: string;
};

export function BannerSlot({ title, size }: BannerSlotProps) {
  return (
    <div className="flex h-full flex-col justify-between rounded-2xl border border-dashed border-black/10 bg-[var(--surface-soft)] p-4">
      <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
        {title}
      </p>
      <p className="text-sm text-[var(--muted)]">{size}</p>
    </div>
  );
}
