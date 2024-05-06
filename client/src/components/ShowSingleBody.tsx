import { useState } from "react";

import { Form } from "./Form";
import { fetchShowSingle } from "../hooks/fetchApi";
import { ResFigure } from "./ResFigure";
import { ChForm } from "./ChForm";
import { ChFormValue, initChFormValue } from "../types/ChFormValue";
import { Footer } from "./Footer";
import { ReadBio } from "./ReadBio";

export const ShowSingleBady = () => {
  const [meaData, setMeaData] = useState<Float32Array[]>([]);

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

  return (
    <div className="flex-1">
      <div className="flex justify-center">
        <ReadBio setMeaData={setMeaData} />
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
