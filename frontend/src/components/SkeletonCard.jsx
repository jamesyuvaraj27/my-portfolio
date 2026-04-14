const SkeletonCard = ({ className = "" }) => {
  return (
    <div className={`skeleton h-72 ${className}`}>
      <div className="h-40 border-b border-white/10 bg-white/[0.03]" />
      <div className="space-y-3 p-5">
        <div className="h-5 w-2/3 rounded-full bg-white/[0.06]" />
        <div className="h-4 w-full rounded-full bg-white/[0.05]" />
        <div className="h-4 w-5/6 rounded-full bg-white/[0.05]" />
        <div className="flex gap-2 pt-3">
          <div className="h-8 w-20 rounded-full bg-white/[0.05]" />
          <div className="h-8 w-20 rounded-full bg-white/[0.05]" />
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;
