import { useState } from "react";

import { PeakRequestEntity, RequestEntity } from "../types/requestEntity";
import { ChFormValue, initChFormValue } from "../types/ChFormValue";
import { HedValue } from "../types/HedValue";
import {
  fetchDraw2d,
  fetchDraw3d,
  fetchRasterPlot,
  fetchShowAll,
  fetchShowDetection,
  fetchShowSingle,
} from "./fetchApi";
import { PageName } from "../enum/PageName";
import { PeakFormValue } from "../types/PeakFormValue";
import { toast } from "react-toastify";

export const useDataSubmission = (
  pageName: string,
  activeChs: number[],
  meaData: Float32Array[],
  hedValue: HedValue,
  peakFormValue: PeakFormValue
) => {
  const [values, setValues] = useState<ChFormValue>(initChFormValue);

  const [imgSrc, setImgSrc] = useState<string[]>([]);
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
    setValues(initChFormValue);
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

  const handleRemoveImg = (index: number) => {
    const newImgSrc = imgSrc.filter((_, i) => i !== index);
    setImgSrc(newImgSrc);
    toast.error("Figureを削除しました", {
      position: "top-right",
      autoClose: 700,
      hideProgressBar: true,
    });
  };

  const handleFetch = async () => {
    const requestEntity: RequestEntity = {
      readTime: {
        start: Math.floor(meaData[0][0]),
        end: Math.round(meaData[0][meaData[0].length - 1]),
      },
      hedValue: hedValue,
      ...values,
    };
    switch (pageName) {
      case PageName.SHOW_ALL:
        {
          const resData = await fetchShowAll(requestEntity, meaData);
          setImgSrc(resData.imgSrc);
        }
        break;
      case PageName.SHOW_SINGLE:
        {
          const resData = await fetchShowSingle(requestEntity, meaData);
          setImgSrc((prev) => [...prev, ...resData.imgSrc]);
        }
        break;
      case PageName.SHOW_DETECTION:
        {
          const resData = await fetchShowDetection(
            requestEntity,
            meaData,
            activeChs
          );
          setImgSrc((prev) => [...prev, ...resData.imgSrc]);
        }
        break;
      case PageName.RASTER_PLOT:
        {
          const peakRequestEntity: PeakRequestEntity = {
            ...requestEntity,
            peakFormValue,
          };
          const resData = await fetchRasterPlot(
            peakRequestEntity,
            meaData,
            activeChs
          );
          setImgSrc(resData.imgSrc);
        }
        break;
      case PageName.DRAW_2D:
        {
          const peakRequestEntity: PeakRequestEntity = {
            ...requestEntity,
            peakFormValue,
          };
          const resData = await fetchDraw2d(peakRequestEntity, meaData);
          setImgSrc(resData.imgSrc);
        }
        break;
      case PageName.DRAW_3D:
        {
          const peakRequestEntity: PeakRequestEntity = {
            ...requestEntity,
            peakFormValue,
          };
          const resData = await fetchDraw3d(peakRequestEntity, meaData);
          setImgSrc(resData.imgSrc);
        }
        break;
    }
  };
  return {
    values,
    imgSrc,
    isPost,
    handleChange,
    handleInitialize,
    handleSubmit,
    handleRemoveImg,
  } as const;
};
