import { ChangeEvent, useState } from "react";
import { HedValue, initHedValue } from "../types/HedValue";
import { readHed } from "./readHed";
import { handleFileFromChangeEvent } from "./handleEvent";
import { readBio } from "./readBio";
import { ReadTime } from "../types/ReadTime";
import { toast } from "react-toastify";

export type InputMode = "bio" | "npz";

export type MeaFile = {
  hedFile: File | undefined;
  bioFile: File | undefined;
};
export type FileName = {
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
  const [readTime, setReadTime] = useState<ReadTime>({ start: 0, end: 30 });
  const [isBioRead, setIsBioRead] = useState(false);
  const [npzFile, setNpzFile] = useState<File | undefined>(undefined);
  const [npzName, setNpzName] = useState("");
  const [inputMode, setInputMode] = useState<InputMode>("bio");

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

  const handleReadTime = async (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setReadTime({
      ...readTime,
      [name]: parseInt(value),
    });
    await handleReadBio();
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
      toast.success("MEAデータを読み込み完了", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
      });
    }
  };

  //   .hedファイルのリセット
  const handleRefreshHedFile = () => {
    setMeaFile({ hedFile: undefined, bioFile: meaFile?.bioFile });
    setFileName({ hedName: "", bioName: fileName.bioName });
  };

  // .bioファイルを読み込み直す
  const handleReadBio = async () => {
    if (!meaFile?.bioFile) return;
    setIsBioRead(true);

    setMeaData(await readBio(meaFile.bioFile, hedValue, readTime));
    setIsBioRead(false);
    toast.success("MEAデータを読み込み完了", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: true,
    });
  };

  // .npzファイルが選択されたら保持する (パースはバックエンドに委譲)
  const handleNpzInput = (e: ChangeEvent<HTMLInputElement>) => {
    const file = handleFileFromChangeEvent(e);
    if (file) {
      setNpzFile(file);
      setNpzName(file.name);
      toast.success("npzファイルを選択しました", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
      });
    }
  };

  // .npzファイルのリセット
  const handleRefreshNpzFile = () => {
    setNpzFile(undefined);
    setNpzName("");
  };

  // 入力モードを切り替える (切替時に他方のファイル状態をクリアして排他にする)
  const handleInputMode = (mode: InputMode) => {
    if (mode === inputMode) return;
    setInputMode(mode);
    if (mode === "npz") {
      setMeaFile({ hedFile: undefined, bioFile: undefined });
      setFileName({ hedName: "", bioName: "" });
      setMeaData([]);
    } else {
      handleRefreshNpzFile();
    }
  };

  return {
    fileName,
    isBioRead,
    hedValue,
    readTime,
    meaData,
    npzFile,
    npzName,
    inputMode,
    handleHedChange,
    handleHedFile,
    handleReadTime,
    handleBioInput,
    handleRefreshHedFile,
    handleReadBio,
    handleNpzInput,
    handleRefreshNpzFile,
    handleInputMode,
  } as const;
};
