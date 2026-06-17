import { ResFigure } from "../figure/ResFigure";
import { Form } from "./form/Form";
import { ReadBio } from "./readMeaFile/ReadBio";
import { NpzInput } from "./readMeaFile/NpzInput";
import { InputModeTabs } from "./readMeaFile/InputModeTabs";
import { useDataSubmission } from "../../../hooks/useDataSubmition";
import { ChPad } from "../ChPad/ChPad";
import { useChPad } from "../../../hooks/useChPad";
import { chPadPages, PageName } from "../../../enum/PageName";
import { usePeakFormHandler } from "../../../hooks/usePeakFormHandler";
import { useSharedMEA } from "../../SharedMEA";
import { useEffect } from "react";
import { delete_all_image, get_images } from "../../../hooks/fetchApi";
import { toast } from "react-toastify";

type BodyProps = {
  pageName: string;
};
export const Body: React.FC<BodyProps> = ({ pageName }) => {
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
    isPython,
    togglePython,
  } = useSharedMEA();

  const {
    gridSize,
    activeChs,
    toggleButton,
    handleClearChs,
    handleSelectAllChs,
  } = useChPad();

  const { peakFormValue, handlePeakFormChange } = usePeakFormHandler();

  const {
    values,
    imageResponses,
    setImageResponses,
    handleChange,
    handleInitialize,
    handleSubmit,
    handleRemoveImg,
  } = useDataSubmission(
    pageName,
    inputMode === "npz" ? npzName : fileName.bioName,
    readTime,
    activeChs,
    meaData,
    hedValue,
    peakFormValue,
    isPython,
    inputMode,
    npzFile
  );

  const pythonAndGoPages: string[] = [
    PageName.SHOW_ALL,
    PageName.SHOW_SINGLE,
    PageName.SHOW_DETECTION,
    PageName.RASTER_PLOT,
    PageName.PLOT_PEAKS,
  ];

  // 現在のモードで読み込み中のファイル名 (図の取得・削除キーに使う)
  const currentFileName = inputMode === "npz" ? npzName : fileName.bioName;

  useEffect(() => {
    if (currentFileName) {
      const func = async () => {
        const db_images = await get_images(pageName, currentFileName);
        setImageResponses(db_images);
      };
      func();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentFileName]);

  const handleDeleteAllFigure = () => {
    const isDelete = confirm("すべての図を削除しますか？");
    if (isDelete) {
      delete_all_image(pageName, currentFileName);
      setImageResponses([]);
      toast.error("Figureを全件削除しました", {
        position: "top-right",
        autoClose: 700,
        hideProgressBar: true,
      });
    }
  };

  return (
    <div className="flex h-screen-minus-topbar flex-1">
      {/* Input Panel */}
      <div className="flex flex-col w-input min-w-input max-w-input bg-[var(--bg-panel)] border-r border-[var(--border-subtle)] overflow-y-auto hide-scrollbar">
        <InputModeTabs
          inputMode={inputMode}
          handleInputMode={handleInputMode}
        />

        {inputMode === "npz" ? (
          <NpzInput
            npzName={npzName}
            handleNpzInput={handleNpzInput}
            handleRefreshNpzFile={handleRefreshNpzFile}
          />
        ) : (
          <ReadBio
            isBioRead={isBioRead}
            hedValue={hedValue}
            readTime={readTime}
            fileName={fileName}
            handleHedChange={handleHedChange}
            handleHedFile={handleHedFile}
            handleBioInput={handleBioInput}
            handleReadTime={handleReadTime}
            handleRefreshHedFile={handleRefreshHedFile}
            handleReadBio={handleReadBio}
          />
        )}

        {chPadPages.includes(pageName) ? (
          <ChPad
            gridSize={gridSize}
            activeChs={activeChs}
            toggleButton={toggleButton}
            handleClearChs={handleClearChs}
            handleSelectAllChs={handleSelectAllChs}
          />
        ) : null}

        <Form
          pageName={pageName}
          values={values}
          handleChange={handleChange}
          handleInitialize={handleInitialize}
          handleSubmit={handleSubmit}
          peakFormValue={peakFormValue}
          handlePeakFormChange={handlePeakFormChange}
        />
      </div>

      {/* Figure Display Area */}
      <div className="flex-1 overflow-y-auto relative bg-[var(--bg-root)]">
        <ResFigure imgs={imageResponses} handleRemoveImg={handleRemoveImg} />
      </div>

      {/* Right Controls */}
      <div className="flex flex-col items-center gap-2 p-2 bg-[var(--bg-surface)] border-l border-[var(--border-subtle)]">
        {imageResponses.length ? (
          <button
            className="p-2 text-xs font-ui font-medium text-red-400 bg-[var(--danger-muted)] hover:bg-red-500/20 rounded-md transition-colors duration-150 whitespace-nowrap"
            onClick={handleDeleteAllFigure}
            title="Delete All Figures"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        ) : null}

        {pythonAndGoPages.includes(pageName) ? (
          <div className="flex flex-col items-center gap-1.5 mt-auto pb-2">
            <button
              onClick={togglePython}
              className={`p-1.5 rounded-md transition-all duration-150 ${
                isPython
                  ? "bg-[var(--accent-glow)] ring-1 ring-green-500/30"
                  : "hover:bg-[var(--bg-hover)]"
              }`}
              title="Python"
            >
              <img src="python.svg" className="h-7 w-7" alt="Python" />
            </button>
            <button
              onClick={togglePython}
              className={`p-1.5 rounded-md transition-all duration-150 ${
                !isPython
                  ? "bg-[var(--accent-glow)] ring-1 ring-green-500/30"
                  : "hover:bg-[var(--bg-hover)]"
              }`}
              title="Go"
            >
              <img src="golang.svg" className="h-7 w-7" alt="Go" />
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};
