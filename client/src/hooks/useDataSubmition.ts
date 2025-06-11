import { useState } from "react";

import { PeakRequestEntity, RequestEntity } from "../types/requestEntity";
import { ChFormValue, initChFormValue } from "../types/ChFormValue";
import { HedValue } from "../types/HedValue";
import {
  delete_image,
  fetchCreateFigure,
  FLASK_ROOT_URL,
  GIN_ROOT_URL,
} from "./fetchApi";
import { PeakFormValue } from "../types/PeakFormValue";
import { toast } from "react-toastify";
import { ImgResponse } from "../types/ImgResponse";
import { chPadPages } from "../enum/PageName";

export const useDataSubmission = (
  pageName: string,
  fileName: string,
  activeChs: number[],
  meaData: Float32Array[],
  hedValue: HedValue,
  peakFormValue: PeakFormValue,
  isPython: boolean
) => {
  const [values, setValues] = useState<ChFormValue>(initChFormValue(pageName));

  const [imageResponses, setImageResponses] = useState<ImgResponse[]>([]);
  const [isPost, setIsPost] = useState<boolean>(false);
  // const [isPython, setIsPython] = useState(true);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === "ch") {
      setValues({
        ...values,
        chs: [parseInt(value)],
      });
    } else {
      setValues({
        ...values,
        [name]: parseFloat(value),
      });
    }
  };

  const handleInitialize = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setValues(initChFormValue(fileName));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!meaData[0]) {
      alert("MEAデータが読み込まれていません");
      return;
    }
    setIsPost(true);
    await handleFetch();
    setIsPost(false);
  };

  const handleRemoveImg = async (index: number) => {
    if (imageResponses) {
      await delete_image(pageName, imageResponses[index].image_url);
      const newImgs = imageResponses.filter((_, i) => i !== index);
      setImageResponses(newImgs);
      toast.error("Figureを削除しました", {
        position: "top-right",
        autoClose: 700,
        hideProgressBar: true,
      });
    }
  };

  const handleFetch = async () => {
    const requestEntity: RequestEntity = {
      readTime: {
        start: Math.floor(meaData[0][0]),
        end: Math.round(meaData[0][meaData[0].length - 1]),
      },
      hedValue: hedValue,
      filename: fileName,
      ...values,
    };
    const peakRequestEntity: PeakRequestEntity = {
      ...requestEntity,
      peakFormValue,
    };

    const resData = await fetchCreateFigure(
      isPython ? FLASK_ROOT_URL : GIN_ROOT_URL,
      peakRequestEntity,
      meaData,
      chPadPages.includes(pageName) ? activeChs : null
    );
    if (resData) {
      setImageResponses((prev) => [...prev, ...resData]);
    }
  };

  return {
    values,
    imageResponses,
    setImageResponses,
    isPost,
    handleChange,
    handleInitialize,
    handleSubmit,
    handleRemoveImg,
  } as const;
};
