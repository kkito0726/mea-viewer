import React, { useState } from "react";
import { Footer } from "./Footer";

interface FormValues {
  start: number;
  end: number;
  volt_min: number;
  volt_max: number;
  dpi: number;
}

interface PostValue {
  hed_path: string;
  start: number;
  end: number;
  volt_min: number;
  volt_max: number;
}

export const ShowAllBody = () => {
  const [values, setValues] = useState<FormValues>({
    start: 0,
    end: 5,
    volt_min: -200,
    volt_max: 200,
    dpi: 100,
  });

  const [filePath, setFilePath] = useState<string>("");
  const [imgSrc, setImgSrc] = useState<string>("");
  const [isPost, setIsPost] = useState<boolean>(false);

  const handlePathChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilePath(e.target.value);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: parseFloat(value),
    });
  };

  const handleInitialize = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setValues({
      start: 0,
      end: 5,
      volt_min: -200,
      volt_max: 200,
      dpi: 100,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPost(true);
    const url = "http://127.0.0.1:5001/showAll";
    const reqBody: PostValue = {
      hed_path: filePath,
      ...values,
    };

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reqBody),
      });

      const resData = await res.json();
      console.log(resData);
      setImgSrc(resData.imgSrc);
    } catch (e) {
      console.error(e);
    }
    setIsPost(false);
  };

  return (
    <div className="flex-1">
      <div className="flex flex-col items-center">
        <div className="p-4 bg-gray-500 text-white max-w-2xl mx-auto my-10 rounded-lg shadow-lg">
          <div className="p-4 rounded mb-2">
            <label
              htmlFor="start"
              className="block font-medium text-gray-300 rounded-sm"
            >
              hedファイルのフルパス追加
            </label>
            <input
              type="text"
              id="hed_path"
              name="hed_path"
              className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              value={filePath}
              onChange={handlePathChange}
            />
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4 bg-gray-500">
              <div>
                <label
                  htmlFor="start"
                  className="block text-sm font-medium text-gray-300 p-1 rounded-sm"
                >
                  Start (s)
                </label>
                <input
                  type="number"
                  id="start"
                  name="start"
                  className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  value={values.start}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label
                  htmlFor="end"
                  className="block text-sm font-medium text-gray-300 p-1"
                >
                  End (s)
                </label>
                <input
                  type="number"
                  id="end"
                  name="end"
                  className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  value={values.end}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label
                  htmlFor="volt_min"
                  className="block text-sm font-medium text-gray-300 p-1"
                >
                  Volt-min (μV)
                </label>
                <input
                  type="number"
                  id="volt_min"
                  name="volt_min"
                  className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  value={values.volt_min}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label
                  htmlFor="volt_max"
                  className="block text-sm font-medium text-gray-300 p-1"
                >
                  Volt-max (μV)
                </label>
                <input
                  type="number"
                  id="volt_max"
                  name="volt_max"
                  className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  value={values.volt_max}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label
                  htmlFor="dpi"
                  className="block text-sm font-medium text-gray-300 p-1"
                >
                  dpi
                </label>
                <input
                  type="number"
                  id="dpi"
                  name="dpi"
                  className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  value={values.dpi}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="flex justify-end mt-4 bg-gray-500">
              <button
                type="submit"
                className="mt-4 bg-gray-400 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-3"
                onClick={handleInitialize}
              >
                Initialize
              </button>
              <button
                type="submit"
                className="mt-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              >
                Submit
              </button>
            </div>
          </form>
          {isPost ? (
            <p className="text-center rounded p-2">処理中です</p>
          ) : null}
          {imgSrc ? (
            <img
              src={"data:image/png;base64," + imgSrc}
              className="p-3 rounded"
              alt=""
            />
          ) : (
            ""
          )}
        </div>
        <Footer />
      </div>
    </div>
  );
};
