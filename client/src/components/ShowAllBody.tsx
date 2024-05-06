import React, { useState } from "react";
import { Footer } from "./Footer";
import { ResFigure } from "./ResFigure";
import { FormValues, initFormValue } from "../types/FormValues";
import { Form } from "./Form";
import { fetchApi } from "../hooks/fetchApi";
import { ReadBio } from "./ReadBio";

export const ShowAllBody = () => {
  const [meaData, setMeaData] = useState<Float32Array[]>([]);
  const [values, setValues] = useState<FormValues>(initFormValue);

  const [imgSrc, setImgSrc] = useState<string>("");
  const [isPost, setIsPost] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: parseFloat(value),
    });
  };

  const handleInitialize = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setValues(initFormValue);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPost(true);
    const resData = await fetchApi(values, meaData);
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
          <Form
            values={values}
            handleChange={handleChange}
            handleInitialize={handleInitialize}
            handleSubmit={handleSubmit}
          />
          <ResFigure isPost={isPost} imgSrc={imgSrc} />
          <Footer />
        </div>
      ) : null}
    </div>
  );
};
