import { useEffect, useState } from "react";

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
import { chPadPages, onlyPythonList, PageName } from "../enum/PageName";
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
  const [values, setValues] = useState<ChFormValue>(() => {
    const stored = localStorage.getItem("chFormValue");
    if (stored) {
      const v: ChFormValue = JSON.parse(stored);
      v.figType = pageName; // 現在のページのfigTypeで上書きする (ストレージが別ページのものの場合があるため)
      return v;
    }
    return initChFormValue(pageName);
  });

  useEffect(() => {
    localStorage.setItem("chFormValue", JSON.stringify(values));
  }, [values]);

  const [imageResponses, setImageResponses] = useState<ImgResponse[]>([]);
  const [disabled, setDisabled] = useState<boolean>(false);

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
    if (disabled) {
      return;
    }
    setDisabled(true);
    if (!meaData[0]) {
      alert("MEAデータが読み込まれていません");
      setDisabled(false);
      return;
    }
    if (chPadPages.includes(pageName) && activeChs.length === 0) {
      toast.error("電極が指定されていません", {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: true,
      });
      setDisabled(false);
      return;
    }
    if (
      chPadPages.includes(pageName) &&
      peakFormValue.baseCh &&
      !activeChs.includes(peakFormValue.baseCh)
    ) {
      toast.error("拍動周期の基準電極は指定した電極から選択してください", {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: true,
      });
      setDisabled(false);
      return;
    }

    const wait = new Promise((resolve) => setTimeout(resolve, 2000));
    await Promise.race([handleFetch(), wait]);
    setDisabled(false);
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
      hedValue,
      filename: fileName,
      ...values,
    };
    const peakRequestEntity: PeakRequestEntity = {
      ...requestEntity,
      peakFormValue,
    };

    toast.info("描画処理を開始しました", {
      position: "top-right",
      autoClose: 1000,
      hideProgressBar: true,
    });

    const rootUrl =
      isPython || onlyPythonList.includes(pageName as PageName)
        ? FLASK_ROOT_URL
        : GIN_ROOT_URL;

    const resData = await fetchCreateFigure(
      rootUrl,
      peakRequestEntity,
      meaData,
      chPadPages.includes(pageName as PageName) ? activeChs : null
    );

    // resData.job_id があるなら SSE を Promise 化して返す
    if (resData?.job_id) {
      return new Promise<void>((resolve) => {
        const eventSource = new EventSource(
          `${rootUrl}/draw/stream/${resData.job_id}`
        );

        eventSource.onmessage = (event) => {
          try {
            const result: ImgResponse[] = JSON.parse(event.data);
            setImageResponses((prev) => [...prev, ...result]);
            toast.success(`${result.length}枚のグラフ描画処理が完了しました`, {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: true,
            });
          } catch (e) {
            console.error("SSE parse error:", e);
          }
          eventSource.close();
          resolve(); // SSE完了として扱う
        };

        eventSource.onerror = (e) => {
          console.error("SSE error:", e);
          eventSource.close();
          resolve(); // エラーでも resolve してボタンは再有効化
        };
      });
    }
  };

  return {
    values,
    imageResponses,
    setImageResponses,
    handleChange,
    handleInitialize,
    handleSubmit,
    handleRemoveImg,
  } as const;
};
