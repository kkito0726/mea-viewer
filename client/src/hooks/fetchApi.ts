import { ImgResponse } from "../types/ImgResponse";
import { RequestEntity } from "../types/requestEntity";

const ROOT_URL = "http://127.0.0.1:5001";

export const fetchShowAll = async (
  values: RequestEntity,
  meaData: Float32Array[]
) => {
  const url = ROOT_URL + "/showAll";

  const buffers = meaData.map((v) => new Blob([v.buffer]));

  // FormDataを使用してデータを送信
  const formData = new FormData();
  buffers.forEach((blob, index) => {
    formData.append(`file${index}`, blob);
  });
  formData.append("jsonData", JSON.stringify(values));

  try {
    const res = await fetch(url, {
      method: "POST",
      body: formData, // ヘッダーのContent-TypeはFormDataに任せる
    });
    const resData: ImgResponse = await res.json();
    return resData;
  } catch (e) {
    console.error(e);
  }
  return { imgSrc: "" };
};

export const fetchShowSingle = async (
  value: RequestEntity,
  meaData: Float32Array[]
) => {
  const url = ROOT_URL + "/showSingle";

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
    const resData: ImgResponse = await res.json();
    return resData;
  } catch (e) {
    console.error(e);
  }
  return { imgSrc: "" };
};
