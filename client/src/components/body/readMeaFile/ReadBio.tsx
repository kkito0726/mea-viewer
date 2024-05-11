import { ChangeEvent } from "react";
import { HedInput } from "./HedInput";
import { BioInput } from "./BioInput";
import { HedValue } from "../../../types/HedValue";
import { ReadTime } from "../../../types/ReadTime";
type FileName = {
  hedName: string;
  bioName: string;
};

type ReadBioProps = {
  isBioRead: boolean;
  hedValue: HedValue;
  readTime: ReadTime;
  fileName: FileName;
  meaData: Float32Array[];
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
  meaData,
  handleHedChange,
  handleHedFile,
  handleBioInput,
  handleReadTime,
  handleRefreshHedFile,
  handleReadBio,
}) => {
  return (
    <div>
      <div className="flex">
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
          meaData={meaData}
        />
      </div>
      {isBioRead ? (
        <div className="flex justify-center">
          <span className="text-gray-300 text-center">MEAデータ読込中</span>
        </div>
      ) : null}
    </div>
  );
};
