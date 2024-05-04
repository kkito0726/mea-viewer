import React, { useState } from "react";
import { Footer } from "./Footer";
import { ResFigure } from "./ResFigure";
import { FormValues, initFormValue } from "../types/FormValues";
import { Form } from "./Form";
import { fetchApi } from "../hooks/fetchApi";

export const ShowAllBody = () => {
  const [values, setValues] = useState<FormValues>(initFormValue);

  const [imgSrc, setImgSrc] = useState<string>("");
  const [isPost, setIsPost] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    setValues(initFormValue);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPost(true);
    const resData = await fetchApi(values);
    setImgSrc(resData.imgSrc);
    setIsPost(false);
  };

  return (
    <div className="flex-1">
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
    </div>
  );
};
