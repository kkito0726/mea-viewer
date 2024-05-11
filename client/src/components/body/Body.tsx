import { ChangeEvent, useState } from "react";
import { ResFigure } from "../figure/ResFigure";
import { Form } from "./form/Form";
import { ReadBio } from "./readMeaFile/ReadBio";
import { handleFileFromChangeEvent } from "../../hooks/handleEvent";
import { readHed } from "../../hooks/readHed";
import { HedValue, initHedValue } from "../../types/HedValue";
import { ReadTime } from "../../types/ReadTime";
import { readBio } from "../../hooks/readBio";
import { RequestEntity } from "../../types/requestEntity";
import { ImgResponse } from "../../types/ImgResponse";
import { ChFormValue, initChFormValue } from "../../types/ChFormValue";
import { ChForm } from "./form/ChForm";
type MeaFile = {
  hedFile: File | undefined;
  bioFile: File | undefined;
};
type FileName = {
  hedName: string;
  bioName: string;
};
type BodyProps = {
  pageName: string;
  fetchApi: (
    value: RequestEntity,
    meaData: Float32Array[]
  ) => Promise<ImgResponse>;
};
export const Body: React.FC<BodyProps> = ({ fetchApi, pageName }) => {
  const [meaData, setMeaData] = useState<Float32Array[]>([]);
  const [values, setValues] = useState<ChFormValue>(initChFormValue);
  const [hedValue, setHedValue] = useState<HedValue>(initHedValue);
  const [readTime, setReadTime] = useState<ReadTime>({ start: 0, end: 120 });
  const [isBioRead, setIsBioRead] = useState(false);

  const [meaFile, setMeaFile] = useState<MeaFile | undefined>({
    hedFile: undefined,
    bioFile: undefined,
  });
  const [fileName, setFileName] = useState<FileName>({
    hedName: "",
    bioName: "",
  });

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
      setMeaFile({ hedFile: file, bioFile: meaFile?.bioFile });
      setHedValue({ ...(await readHed(file)) });
    }
  };

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

  const handleReadTime = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setReadTime({
      ...readTime,
      [name]: parseInt(value),
    });
  };

  const [imgSrc, setImgSrc] = useState<string>("");
  const [isPost, setIsPost] = useState<boolean>(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: parseFloat(value),
    });
  };

  const handleInitialize = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setValues(initChFormValue);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!meaData[0]) {
      alert("MEAデータが読み込まれていません");
      return;
    }
    setIsPost(true);
    const resData = await fetchApi(
      {
        readTime: {
          start: Math.floor(meaData[0][0]),
          end: Math.round(meaData[0][meaData[0].length - 1]),
        },
        hedValue: hedValue,
        ...values,
      },
      meaData
    );
    setImgSrc(resData.imgSrc);
    setIsPost(false);
  };

  const handleRefreshHedFile = () => {
    setMeaFile({ hedFile: undefined, bioFile: meaFile?.bioFile });
    setFileName({ hedName: "", bioName: fileName.bioName });
  };

  const handleReadBio = async () => {
    setIsBioRead(true);
    if (!meaFile?.bioFile) return;
    setMeaData(await readBio(meaFile.bioFile, hedValue, readTime));
    setIsBioRead(false);
  };

  return (
    <>
      <div className="flex">
        <div className="flex flex-col h-screen-minus-topbar bg-zinc-700">
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
