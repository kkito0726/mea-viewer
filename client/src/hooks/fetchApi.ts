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
