import { ImgResponse } from "../types/ImgResponse";
import { RequestEntity } from "../types/requestEntity";

export const FLASK_ROOT_URL = "http://127.0.0.1:5001";
export const GIN_ROOT_URL = "http://localhost:8080";

export const fetchCreateFigure = async (
  rootUrl: string,
  value: RequestEntity,
  meaData: Float32Array[],
  activeChs: number[] | null
) => {
  const url = rootUrl + "/draw";

  let startFrame =
    (value.start - value.readTime.start) * value.hedValue.sampling_rate;
  if (startFrame < 0) {
    startFrame = 0;
    value.start = value.readTime.start;
  }

  let endFrame =
    (value.end - value.readTime.start) * value.hedValue.sampling_rate;
  if (endFrame > meaData[0].length) {
    endFrame = meaData[0].length;
    value.end = value.readTime.end;
  }

  // バイナリデータをBlobに変換
  const buffers = activeChs
    ? activeChs.map(
        (ch) => new Blob([meaData[ch - 1].slice(startFrame, endFrame).buffer])
      )
    : meaData.map((v) => new Blob([v.slice(startFrame, endFrame).buffer]));

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
    const resData = await res.json();
    // job_idのみ返す
    return resData;
  } catch (e) {
    console.error(e);
  }
};

export const get_images = async (pageName: string, fileName: string) => {
  const url = `${GIN_ROOT_URL}/fig/${pageName}/${fileName}`;
  const res = await fetch(url);
  const resData: ImgResponse[] = await res.json();
  return resData;
};

export const delete_image = async (pageName: string, img_url: string) => {
  const url = `${GIN_ROOT_URL}/fig/${pageName}`;
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
  const url = `${GIN_ROOT_URL}/fig/all/${pageName}`;
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
