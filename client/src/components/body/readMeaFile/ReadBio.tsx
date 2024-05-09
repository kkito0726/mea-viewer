import { ChangeEvent, useState } from "react";
import { readBio } from "../../../hooks/readBio";
import { HedInput } from "./HedInput";
import { BioInput } from "./BioInput";
import { HedValue, initHedValue } from "../../../types/HedValue";
import { readHed } from "../../../hooks/readHed";
import { handleFileFromChangeEvent } from "../../../hooks/handleEvent";
import { ReadTime } from "../../../types/ReadTime";
type FileName = {
  hedName: string;
  bioName: string;
};
type ReadBioProps = {
  setMeaData: React.Dispatch<React.SetStateAction<Float32Array[]>>;
};
export const ReadBio: React.FC<ReadBioProps> = ({ setMeaData }) => {
  const [isBioRead, setIsBioRead] = useState(false);
  const [hedValue, setHedValue] = useState<HedValue>(initHedValue);
  const handleHedChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setHedValue({
      ...hedValue,
      [name]: parseInt(value),
    });
  };
  const handleHedFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = handleFileFromChangeEvent(e);
    if (file) {
      setFileName({
        ...fileName,
        hedName: file.name,
      });
      setHedValue({ ...(await readHed(file)) });
    }
  };
  const [readTime, setReadTime] = useState<ReadTime>({ start: 0, end: 120 });
  const handleBioInput = async (e: ChangeEvent<HTMLInputElement>) => {
    setIsBioRead(true);
    const file = handleFileFromChangeEvent(e);
    if (file) {
      setFileName({
        ...fileName,
        bioName: file.name,
      });
      setMeaData(await readBio(file, hedValue, readTime));
      setIsBioRead(false);
    }
  };
  const handleReadTime = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setReadTime({
      ...readTime,
      [name]: parseInt(value),
    });
  };

  const [fileName, setFileName] = useState<FileName>({
    hedName: "",
    bioName: "",
  });

  return (
    <div>
      <div className="flex max-w-4xl p-2">
        <HedInput
          hedValue={hedValue}
          handleHedChange={handleHedChange}
          handleHedFile={handleHedFile}
          hedName={fileName.hedName}
        />
        <BioInput
          readTime={readTime}
          handleReadTime={handleReadTime}
          handleBioInput={handleBioInput}
          bioName={fileName.bioName}
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
