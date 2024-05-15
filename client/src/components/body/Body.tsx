import { ResFigure } from "../figure/ResFigure";
import { Form } from "./form/Form";
import { ReadBio } from "./readMeaFile/ReadBio";
import { RequestEntity } from "../../types/requestEntity";
import { ImgResponse } from "../../types/ImgResponse";
import { ChForm } from "./form/ChForm";
import { useFileHandler } from "../../hooks/useFileHandler";
import { useDataSubmission } from "../../hooks/useDataSubmition";

type BodyProps = {
  pageName: string;
  fetchApi: (
    value: RequestEntity,
    meaData: Float32Array[]
  ) => Promise<ImgResponse>;
};
export const Body: React.FC<BodyProps> = ({ fetchApi, pageName }) => {
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
    values,
    imgSrc,
    isPost,
    handleChange,
    handleInitialize,
    handleSubmit,
  } = useDataSubmission(fetchApi, meaData, hedValue);

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
            {pageName === "showSingle" ? (
              <ChForm values={values} handleChange={handleChange} />
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
