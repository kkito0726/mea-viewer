type ProcessingProps = {
  message: string;
};
export const Processing: React.FC<ProcessingProps> = ({ message }) => {
  return (
    <div className="flex justify-center rounded-lg fixed top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2 text-7xl bg-zinc-900 z-50">
      <p className="text-slate-200 p-2">{message}</p>
    </div>
  );
};
