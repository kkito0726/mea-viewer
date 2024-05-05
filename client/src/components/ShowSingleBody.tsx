import { ChangeEvent, useState } from "react";
import { HedInput } from "./HedInput";
import { HedValue, initHedValue } from "../types/HedValue";
import { readHed } from "../hooks/readHed";
import { BioInput } from "./BioInput";
import { readBio, ReadTime } from "../hooks/readBio";
import { Form } from "./Form";
import { fetchShowSingle } from "../hooks/fetchApi";
import { ResFigure } from "./ResFigure";
import { ChForm } from "./ChForm";
import { ChFormValue, initChFormValue } from "../types/ChFormValue";
import { Footer } from "./Footer";

export const ShowSingleBady = () => {
  const [hedValue, setHedValue] = useState<HedValue>(initHedValue);
  const handleHedChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setHedValue({
      ...hedValue,
      [name]: parseInt(value),
    });
  };
  const handleHedFile = async (e: ChangeEvent<HTMLInputElement>) => {
    setHedValue({ ...(await readHed(e)) });
  };

  const [values, setValues] = useState<ChFormValue>(initChFormValue);

  const [imgSrc, setImgSrc] = useState<string>("");
  const [isPost, setIsPost] = useState<boolean>(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    if (name === "hed_path") {
      setValues({
        ...values,
        [name]: value,
      });
    } else {
      setValues({
        ...values,
        [name]: value,
      });
    }
  };

  const handleInitialize = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setValues(initChFormValue);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPost(true);
    const resData = await fetchShowSingle(values, meaData);
    setImgSrc(resData.imgSrc);
    setIsPost(false);
  };

  const [readTime, setReadTime] = useState<ReadTime>({ start: 0, end: 5 });
  const [meaData, setMeaData] = useState<Float32Array[]>([]);
  const handleReadTime = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setReadTime({
      ...readTime,
      [name]: parseInt(value),
    });
  };
  const handleBioInput = async (e: ChangeEvent<HTMLInputElement>) => {
    setMeaData(await readBio(e, hedValue, readTime));
  };

  return (
    <div className="flex-1">
      <div className="flex justify-center">
        <div className="flex max-w-4xl p-2">
          <HedInput
            hedValue={hedValue}
            handleHedChange={handleHedChange}
            handleHedFile={handleHedFile}
          />
          <BioInput
            readTime={readTime}
            handleReadTime={handleReadTime}
            handleBioInput={handleBioInput}
          />
        </div>
      </div>

      {meaData[0] ? (
        <div className="flex flex-col items-center">
          <ChForm values={values} handleChange={handleChange} />
          <Form
            values={values}
            handleChange={handleChange}
            handleInitialize={handleInitialize}
            handleSubmit={handleSubmit}
          />
          <ResFigure imgSrc={imgSrc} isPost={isPost} />
          <Footer />
        </div>
      ) : null}
    </div>
  );
};
