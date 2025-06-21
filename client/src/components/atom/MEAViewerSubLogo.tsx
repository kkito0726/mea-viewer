type Props = { size: number | undefined | null };
export const MEAViewerSubLogo: React.FC<Props> = ({ size }) => {
  return (
    <span className={`text-${size}xl`}>
      Powered by LaR<span className="text-green-400">Code</span>
    </span>
  );
};
