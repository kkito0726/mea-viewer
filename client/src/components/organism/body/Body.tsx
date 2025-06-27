import { ResFigure } from "../figure/ResFigure";
import { Form } from "./form/Form";
import { ReadBio } from "./readMeaFile/ReadBio";
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
    handleHedChange,
    handleHedFile,
    handleReadTime,
    handleBioInput,
    handleRefreshHedFile,
    handleReadBio,
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
    isPost,
    handleChange,
    handleInitialize,
    handleSubmit,
    handleRemoveImg,
  } = useDataSubmission(
    pageName,
    fileName.bioName,
    readTime,
    activeChs,
    meaData,
    hedValue,
    peakFormValue,
    isPython
  );

  const pythonAndGoPages: string[] = [
    PageName.SHOW_ALL,
    PageName.SHOW_SINGLE,
    PageName.SHOW_DETECTION,
    PageName.RASTER_PLOT,
    PageName.PLOT_PEAKS,
  ];

  useEffect(() => {
    if (fileName.bioName) {
      const func = async () => {
        const db_images = await get_images(pageName, fileName.bioName);
        setImageResponses(db_images);
      };
      func();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileName.bioName]);

  const handleDeleteAllFigure = () => {
    const isDelete = confirm("すべての図を削除しますか？");
    if (isDelete) {
      delete_all_image(pageName, fileName.bioName);
      setImageResponses([]);
      toast.error("Figureを全件削除しました", {
        position: "top-right",
        autoClose: 700,
        hideProgressBar: true,
      });
    }
  };

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
          pageName={pageName}
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
          imgs={imageResponses}
          handleRemoveImg={handleRemoveImg}
        />
      </div>
      {imageResponses.length ? (
        <button
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleDeleteAllFigure}
        >
          Delete All Figure
        </button>
      ) : null}
      {pythonAndGoPages.includes(pageName) ? (
        <div className="flex justify-end p-2">
          <div>
            <img
              onClick={togglePython}
              src="python.svg"
              className={`h-10 px-2 d rounded-full ${
                isPython ? "bg-slate-500 border-slate-600" : null
              }`}
              alt=""
            />
          </div>
          <div>
            <img
              onClick={togglePython}
              src="golang.svg"
              className={`h-10 px-2 rounded-full ${
                !isPython ? "bg-slate-600" : null
              }`}
              alt=""
            />
          </div>
        </div>
      ) : null}
    </div>
  );
};
