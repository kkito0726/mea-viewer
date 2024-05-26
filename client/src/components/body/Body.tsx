import { ResFigure } from "../figure/ResFigure";
import { Form } from "./form/Form";
import { ReadBio } from "./readMeaFile/ReadBio";
import { useDataSubmission } from "../../hooks/useDataSubmition";
import { ChPad } from "../ChPad/ChPad";
import { useChPad } from "../../hooks/useChPad";
import { PageName } from "../../enum/PageName";
import { usePeakFormHandler } from "../../hooks/usePeakFormHandler";
import { useSharedMEA } from "../SharedMEA";

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
    handleHedChange,
    handleHedFile,
    handleReadTime,
    handleBioInput,
    handleRefreshHedFile,
    handleReadBio,
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
    imgSrc,
    resChs,
    isPost,
    handleChange,
    handleInitialize,
    handleSubmit,
    handleRemoveImg,
  } = useDataSubmission(pageName, activeChs, meaData, hedValue, peakFormValue);

  const chPadPages: string[] = [
    PageName.SHOW_SINGLE,
    PageName.SHOW_DETECTION,
    PageName.RASTER_PLOT,
  ];

  return (
    <div className="flex h-screen-minus-topbar">
      <div className="flex flex-col w-input bg-zinc-700 overflow-y-auto hide-scrollbar">
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
          meaData={meaData}
        />

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
          values={values}
          handleChange={handleChange}
          handleInitialize={handleInitialize}
          handleSubmit={handleSubmit}
          peakFormValue={peakFormValue}
          handlePeakFormChange={handlePeakFormChange}
        />
      </div>
      <div className="overflow-y-auto">
        <ResFigure
          isPost={isPost}
          imgSrc={imgSrc}
          resChs={resChs}
          handleRemoveImg={handleRemoveImg}
        />
      </div>
    </div>
  );
};
