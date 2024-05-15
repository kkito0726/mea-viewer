import { ChangeEvent, useState } from "react";
import { HedValue, initHedValue } from "../types/HedValue";
import { readHed } from "./readHed";
import { handleFileFromChangeEvent } from "./handleEvent";
import { readBio } from "./readBio";
import { ReadTime } from "../types/ReadTime";

type MeaFile = {
  hedFile: File | undefined;
  bioFile: File | undefined;
};
type FileName = {
  hedName: string;
  bioName: string;
};

export const useFileHandler = () => {
  const [meaFile, setMeaFile] = useState<MeaFile | undefined>({
    hedFile: undefined,
    bioFile: undefined,
  });
  const [fileName, setFileName] = useState<FileName>({
    hedName: "",
    bioName: "",
  });
  const [hedValue, setHedValue] = useState<HedValue>(initHedValue);
  const [meaData, setMeaData] = useState<Float32Array[]>([]);
  const [readTime, setReadTime] = useState<ReadTime>({ start: 0, end: 120 });
  const [isBioRead, setIsBioRead] = useState(false);

  const handleHedChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setHedValue({
      ...hedValue,
      [name]: parseInt(value),
    });
  };

  //   .hedファイル読み込み
  const handleHedFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = handleFileFromChangeEvent(e);
    if (file) {
      setFileName({
        ...fileName,
        hedName: file.name,
      });
      setMeaFile({ hedFile: file, bioFile: meaFile?.bioFile });
      setHedValue({ ...(await readHed(file)) });
    }
  };

  const handleReadTime = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setReadTime({
      ...readTime,
      [name]: parseInt(value),
    });
  };

  // .bioファイルがinputされたらデータを読み込む
  const handleBioInput = async (e: ChangeEvent<HTMLInputElement>) => {
    setIsBioRead(true);
    const file = handleFileFromChangeEvent(e);
    if (file) {
      setMeaData(await readBio(file, hedValue, readTime));
      setFileName({
        ...fileName,
        bioName: file.name,
      });
      setMeaFile({ hedFile: meaFile?.hedFile, bioFile: file });

      setIsBioRead(false);
    }
  };

  //   .hedファイルのリセット
  const handleRefreshHedFile = () => {
    setMeaFile({ hedFile: undefined, bioFile: meaFile?.bioFile });
    setFileName({ hedName: "", bioName: fileName.bioName });
  };

  // .bioファイルを読み込み直す
  const handleReadBio = async () => {
    setIsBioRead(true);
    if (!meaFile?.bioFile) return;
    setMeaData(await readBio(meaFile.bioFile, hedValue, readTime));
    setIsBioRead(false);
  };

  return {
    fileName,
    isBioRead,
    hedValue,
    readTime,
    meaData,
    handleHedChange,
    handleHedFile,
    handleReadTime,
    handleBioInput,
    handleRefreshHedFile,
    handleReadBio,
  } as const;
};
