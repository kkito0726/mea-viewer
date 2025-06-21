type Props = { size: number | undefined | null };
export const MEAViewerLogo: React.FC<Props> = ({ size }) => {
  return (
    <span className={`text-slate-300 text-${size}xl`}>
      MEA <span className="text-green-400">Viewer</span>
    </span>
  );
};
