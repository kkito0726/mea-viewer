import { ChFormValue } from "../types/ChFormValue";
import { FormValues } from "../types/FormValues";
import { ImgResponse } from "../types/ImgResponse";

export const fetchApi = async (values: FormValues) => {
  const url = "http://127.0.0.1:5001/showAll";

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    const resData: ImgResponse = await res.json();
    return resData;
  } catch (e) {
    console.error(e);
  }
  return { imgSrc: "" };
};

export const fetchShowSingle = async (
  value: ChFormValue,
  meaData: Float32Array[]
) => {
  const url = "http://127.0.0.1:5001/showSingle";

  // バイナリデータをBlobに変換
  const buffers = [meaData[0], meaData[value.ch]].map(
    (v) => new Blob([v.buffer])
  );

  // FormDataを使用してデータを送信
  const formData = new FormData();
  buffers.forEach((blob, index) => {
    formData.append(`file${index}`, blob);
  });
  formData.append("jsonData", JSON.stringify(value));

  try {
    const res = await fetch(url, {
      method: "POST",
      body: formData, // ヘッダーのContent-TypeはFormDataに任せる
    });
    const resData = await res.json();
    return resData;
  } catch (e) {
    console.error(e);
  }
};
