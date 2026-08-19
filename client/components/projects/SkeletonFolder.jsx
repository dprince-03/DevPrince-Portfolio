export default function SkeletonFolder() {
  return (
    <div className="flex flex-col items-center gap-3.5">
      <div className="h-[135px] w-[168px] animate-pulse rounded-2xl bg-term-panel" />
      <div className="space-y-2">
        <div className="h-3 w-24 animate-pulse rounded bg-term-panel" />
        <div className="h-3 w-32 animate-pulse rounded bg-term-panel" />
      </div>
    </div>
  );
}
