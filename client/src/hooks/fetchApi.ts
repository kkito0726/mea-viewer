import { PagePath } from "../enum/PagePath";
import { ImgResponse } from "../types/ImgResponse";
import { PeakRequestEntity, RequestEntity } from "../types/requestEntity";

export const FLASK_ROOT_URL = "http://127.0.0.1:5001";
export const GIN_ROOT_URL = "http://localhost:8080";

export const fetchCreateFigure = async (
  rootUrl: string,
  value: RequestEntity,
  meaData: Float32Array[],
  activeChs: number[] | null
) => {
  const url = rootUrl + "/draw";

  // バイナリデータをBlobに変換
  const buffers = activeChs
    ? [0, ...activeChs].map((v) => new Blob([meaData[v].buffer]))
    : meaData.map((v) => new Blob([v.buffer]));

  // FormDataを使用してデータを送信
  const formData = new FormData();
  buffers.forEach((blob, index) => {
    formData.append(`file${index}`, blob);
  });
  value.chs = activeChs ? activeChs : [];
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

export const fetchShowAll = async (
  rootUrl: string,
  values: RequestEntity,
  meaData: Float32Array[]
) => {
  const url = rootUrl + PagePath.SHOW_ALL;

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
  rootUrl: string,
  value: RequestEntity,
  meaData: Float32Array[],
  activeChs: number[]
) => {
  const url = rootUrl + PagePath.SHOW_SINGLE;

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
  rootUrl: string,
  value: RequestEntity,
  meaData: Float32Array[],
  activeChs: number[]
) => {
  const url = rootUrl + PagePath.SHOW_DETECTION;
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
  root_url: string,
  value: PeakRequestEntity,
  meaData: Float32Array[],
  activeChs: number[]
) => {
  const url = root_url + PagePath.RASTER_PLOT;
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
  const url = FLASK_ROOT_URL + PagePath.DRAW_2D;
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
  const url = FLASK_ROOT_URL + PagePath.DRAW_3D;
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

export const fetchPlotPeaks = async (
  rootUrl: string,
  value: RequestEntity,
  meaData: Float32Array[],
  activeChs: number[]
) => {
  const url = rootUrl + PagePath.PlotPeaks;
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

export const get_images = async (pageName: string, fileName: string) => {
  const url = `${GIN_ROOT_URL}/crud/${pageName}/${fileName}`;
  const res = await fetch(url);
  const resData: ImgResponse[] = await res.json();
  return resData;
};

export const delete_image = async (pageName: string, img_url: string) => {
  const url = `${GIN_ROOT_URL}/crud/${pageName}`;
  await fetch(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      image_url: img_url,
    }),
  });
};

export const delete_all_image = async (pageName: string, file_name: string) => {
  const url = `${GIN_ROOT_URL}/crud/${pageName}/all`;
  await fetch(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      directory: `images/${pageName}`,
      file_name: file_name,
    }),
  });
};
