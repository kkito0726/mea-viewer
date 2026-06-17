import React, { createContext, ReactNode, useContext, useState } from "react";
import {
  FileName,
  InputMode,
  useFileHandler,
} from "../hooks/useFileHandler";
import { HedValue } from "../types/HedValue";
import { ReadTime } from "../types/ReadTime";

interface SharedMeaContextType {
  fileName: FileName;
  isBioRead: boolean;
  hedValue: HedValue;
  readTime: ReadTime;
  meaData: Float32Array[];
  npzFile: File | undefined;
  npzName: string;
  inputMode: InputMode;
  handleHedChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handleHedFile: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  handleReadTime: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleBioInput: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  handleRefreshHedFile: () => void;
  handleReadBio: () => Promise<void>;
  handleNpzInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRefreshNpzFile: () => void;
  handleInputMode: (mode: InputMode) => void;
  isPython: boolean;
  togglePython: () => void;
}

const SharedMeaContext = createContext<SharedMeaContextType | undefined>(
  undefined
);

interface SharedMeaProviderProps {
  children: ReactNode;
}

export const SharedMeaProvider: React.FC<SharedMeaProviderProps> = ({
  children,
}) => {
  const {
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
  } = useFileHandler();
  const [isPython, setIsPython] = useState(true);
  const togglePython = () => {
    setIsPython(!isPython);
  };

  return (
    <SharedMeaContext.Provider
      value={{
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
        isPython,
        togglePython,
      }}
    >
      {children}
    </SharedMeaContext.Provider>
  );
};

export const useSharedMEA = (): SharedMeaContextType => {
  const context = useContext(SharedMeaContext);
  if (!context) {
    throw new Error("useSharedMEA must be used within a SharedMeaProvider");
  }
  return context;
};
