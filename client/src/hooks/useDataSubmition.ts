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
import { chPadPages, PageName } from "../enum/PageName";
import { ReadTime } from "../types/ReadTime";

export const useDataSubmission = (
  pageName: string,
  fileName: string,
  readTime: ReadTime,
  activeChs: number[],
  meaData: Float32Array[],
  hedValue: HedValue,
  peakFormValue: PeakFormValue,
  isPython: boolean
) => {
  const [values, setValues] = useState<ChFormValue>(initChFormValue(pageName));

  const [imageResponses, setImageResponses] = useState<ImgResponse[]>([]);
  const [isPost, setIsPost] = useState<boolean>(false);

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
    if (chPadPages.includes(pageName) && activeChs.length === 0) {
      toast.error("電極が指定されていません", {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: true,
      });
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
        start: readTime.start,
        end: readTime.end,
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
      isPython ||
        [PageName.DRAW_2D, PageName.DRAW_3D].includes(pageName as PageName)
        ? FLASK_ROOT_URL
        : GIN_ROOT_URL,
      peakRequestEntity,
      meaData,
      chPadPages.includes(pageName as PageName) ? activeChs : null
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
