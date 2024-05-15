import { useState } from "react";
import { ImgResponse } from "../types/ImgResponse";
import { RequestEntity } from "../types/requestEntity";
import { ChFormValue, initChFormValue } from "../types/ChFormValue";
import { HedValue } from "../types/HedValue";

export const useDataSubmission = (
  fetchApi: (
    value: RequestEntity,
    meaData: Float32Array[]
  ) => Promise<ImgResponse>,
  meaData: Float32Array[],
  hedValue: HedValue
) => {
  const [values, setValues] = useState<ChFormValue>(initChFormValue);

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
  return {
    values,
    imgSrc,
    isPost,
    handleChange,
    handleInitialize,
    handleSubmit,
  } as const;
};
