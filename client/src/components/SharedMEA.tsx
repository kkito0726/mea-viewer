import React, { createContext, ReactNode, useContext } from "react";
import { FileName, useFileHandler } from "../hooks/useFileHandler";
import { HedValue } from "../types/HedValue";
import { ReadTime } from "../types/ReadTime";

interface SharedMeaContextType {
  fileName: FileName;
  isBioRead: boolean;
  hedValue: HedValue;
  readTime: ReadTime;
  meaData: Float32Array[];
  handleHedChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handleHedFile: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  handleReadTime: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleBioInput: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  handleRefreshHedFile: () => void;
  handleReadBio: () => Promise<void>;
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
    handleHedChange,
    handleHedFile,
    handleReadTime,
    handleBioInput,
    handleRefreshHedFile,
    handleReadBio,
  } = useFileHandler();

  return (
    <SharedMeaContext.Provider
      value={{
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
