type Props = { size: number | undefined | null };
export const MEAViewerSubLogo: React.FC<Props> = ({ size }) => {
  return (
    <span className={`font-ui text-slate-500 ${size ? `text-${size}xl` : "text-sm"}`}>
      Powered by LaR<span className="text-green-400/70">Code</span>
    </span>
  );
};
