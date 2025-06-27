import { ChangeEvent } from "react";
import { HedInput } from "./HedInput";
import { BioInput } from "./BioInput";
import { HedValue } from "../../../../types/HedValue";
import { ReadTime } from "../../../../types/ReadTime";
import { Processing } from "../../../Processing";
type FileName = {
  hedName: string;
  bioName: string;
};

type ReadBioProps = {
  isBioRead: boolean;
  hedValue: HedValue;
  readTime: ReadTime;
  fileName: FileName;
  handleHedChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  handleHedFile: (e: ChangeEvent<HTMLInputElement>) => void;
  handleBioInput: (e: ChangeEvent<HTMLInputElement>) => void;
  handleReadTime: (e: ChangeEvent<HTMLInputElement>) => void;
  handleRefreshHedFile: () => void;
  handleReadBio: () => void;
};
export const ReadBio: React.FC<ReadBioProps> = ({
  isBioRead,
  hedValue,
  readTime,
  fileName,
  handleHedChange,
  handleHedFile,
  handleBioInput,
  handleReadTime,
  handleRefreshHedFile,
  handleReadBio,
}) => {
  return (
    <>
      <HedInput
        handleRefreshHedFile={handleRefreshHedFile}
        hedValue={hedValue}
        handleHedChange={handleHedChange}
        handleHedFile={handleHedFile}
        hedName={fileName.hedName}
      />
      <BioInput
        handleReadBio={handleReadBio}
        readTime={readTime}
        handleReadTime={handleReadTime}
        handleBioInput={handleBioInput}
        bioName={fileName.bioName}
      />
      <div className="px-9 pb-2">
        <hr className="border border-zinc-600" />
      </div>
      {isBioRead ? <Processing message="MEAデータ読み込み中..." /> : null}
    </>
  );
};
