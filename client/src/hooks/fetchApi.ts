import { PagePath } from "../enum/PagePath";
import { ImgResponse } from "../types/ImgResponse";
import { PeakRequestEntity, RequestEntity } from "../types/requestEntity";

const ROOT_URL = "http://127.0.0.1:5001";

export const fetchShowAll = async (
  values: RequestEntity,
  meaData: Float32Array[]
) => {
  const url = ROOT_URL + PagePath.SHOW_ALL;

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
};

export const fetchShowSingle = async (
  value: RequestEntity,
  meaData: Float32Array[],
  activeChs: number[]
) => {
  const url = ROOT_URL + PagePath.SHOW_SINGLE;

  // バイナリデータをBlobに変換
  const buffers = [0, ...activeChs].map((v) => new Blob([meaData[v].buffer]));

  // FormDataを使用してデータを送信
  const formData = new FormData();
  buffers.forEach((blob, index) => {
    formData.append(`file${index}`, blob);
  });
  value.chs = activeChs;
  formData.append("jsonData", JSON.stringify(value));

  try {
    const res = await fetch(url, {
      method: "POST",
      body: formData, // ヘッダーのContent-TypeはFormDataに任せる
    });
    const resData: ImgResponse[] = await res.json();
    return resData;
  } catch (e) {
    console.error(e);
  }
};

export const fetchShowDetection = async (
  value: RequestEntity,
  meaData: Float32Array[],
  activeChs: number[]
) => {
  const url = ROOT_URL + PagePath.SHOW_DETECTION;
  const buffers = [0, ...activeChs].map((v) => new Blob([meaData[v].buffer]));

  // FormDataを使用してデータを送信
  const formData = new FormData();
  buffers.forEach((blob, index) => {
    formData.append(`file${index}`, blob);
  });

  value.chs = activeChs;
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
};

export const fetchRasterPlot = async (
  value: PeakRequestEntity,
  meaData: Float32Array[],
  activeChs: number[]
) => {
  const url = ROOT_URL + PagePath.RASTER_PLOT;
  const buffers = [0, ...activeChs].map((v) => new Blob([meaData[v].buffer]));

  // FormDataを使用してデータを送信
  const formData = new FormData();
  buffers.forEach((blob, index) => {
    formData.append(`file${index}`, blob);
  });

  value.chs = activeChs;
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
};

export const fetchDraw2d = async (
  values: PeakRequestEntity,
  meaData: Float32Array[]
) => {
  const url = ROOT_URL + PagePath.DRAW_2D;
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
      body: formData,
    });
    const resData: ImgResponse[] = await res.json();
    return resData;
  } catch (e) {
    console.error(e);
  }
};

export const fetchDraw3d = async (
  values: PeakRequestEntity,
  meaData: Float32Array[]
) => {
  const url = ROOT_URL + PagePath.DRAW_3D;
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
      body: formData,
    });
    const resData: ImgResponse[] = await res.json();
    return resData;
  } catch (e) {
    console.error(e);
  }
};

export const get_images = async (pageName: string, fileName: string) => {
  const url = `${ROOT_URL}/crud/${pageName}/${fileName}`;
  const res = await fetch(url);
  const resData: ImgResponse[] = await res.json();
  return resData;
};

export const delete_image = async (pageName: string, img_url: string) => {
  const url = `${ROOT_URL}/crud/${pageName}`;
  await fetch(url, {
    method: "DELETE",
    body: JSON.stringify({
      image_url: img_url,
    }),
  });
};

export const delete_all_image = async (pageName: string, file_name: string) => {
  const url = `${ROOT_URL}/crud/${pageName}/all`;
  await fetch(url, {
    method: "DELETE",
    body: JSON.stringify({
      directory: `images/${pageName}`,
      file_name: file_name,
    }),
  });
};
