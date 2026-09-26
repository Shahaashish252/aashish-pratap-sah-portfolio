export function SectionLabel({ index, label }: { index: string; label: string }) {
  return (
    <p data-reveal className="mb-8 flex items-center gap-3 text-mute">
      <span className="eyebrow tabular-nums">({index})</span>
      <span className="h-px w-8 bg-mute/50" />
      <span className="eyebrow">{label}</span>
    </p>
  )
}
