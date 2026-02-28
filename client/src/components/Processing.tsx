type ProcessingProps = {
  message: string;
};
export const Processing: React.FC<ProcessingProps> = ({ message }) => {
  return (
    <div className="fixed inset-0 z-40 processing-overlay flex items-center justify-center">
      <div className="flex flex-col items-center gap-4 animate-fade-in">
        <div className="flex gap-1.5">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" style={{ animationDelay: "0ms" }} />
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" style={{ animationDelay: "150ms" }} />
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" style={{ animationDelay: "300ms" }} />
        </div>
        <p className="font-ui text-lg text-slate-200 tracking-wide">{message}</p>
      </div>
    </div>
  );
};
