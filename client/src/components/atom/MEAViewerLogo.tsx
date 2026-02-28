type Props = { size: number | undefined | null };
export const MEAViewerLogo: React.FC<Props> = ({ size }) => {
  return (
    <span className={`font-ui font-semibold tracking-tight text-slate-200 ${size ? `text-${size}xl` : ""}`}>
      MEA<span className="text-green-400 ml-0.5">Viewer</span>
    </span>
  );
};
