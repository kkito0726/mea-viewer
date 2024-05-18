import { ResFigure } from "../figure/ResFigure";
import { Form } from "./form/Form";
import { ReadBio } from "./readMeaFile/ReadBio";
import { ChForm } from "./form/ChForm";
import { useFileHandler } from "../../hooks/useFileHandler";
import { useDataSubmission } from "../../hooks/useDataSubmition";
import { ChPad } from "../ChPad/ChPad";
import { useChPad } from "../../hooks/useChPad";
import { PageName } from "../../enum/PageName";

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
  } = useFileHandler();

  const {
    gridSize,
    activeChs,
    toggleButton,
    handleClearChs,
    handleSelectAllChs,
  } = useChPad();

  const {
    values,
    imgSrc,
    isPost,
    handleChange,
    handleInitialize,
    handleSubmit,
  } = useDataSubmission(pageName, activeChs, meaData, hedValue);

  return (
    <>
      <div className="flex">
        <div className="flex flex-col min-h-screen-minus-topbar bg-zinc-700">
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
          <div className="flex flex-col">
            {pageName === PageName.SHOW_SINGLE ? (
              <ChForm values={values} handleChange={handleChange} />
            ) : null}
            {!(pageName === PageName.SHOW_ALL) ? (
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
            />
          </div>
        </div>

        <ResFigure isPost={isPost} imgSrc={imgSrc} />
      </div>
    </>
  );
};
