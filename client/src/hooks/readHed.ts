import { ChangeEvent } from "react";
import { HedValue } from "../types/HedValue";

type readType = {
  [key: number]: number;
};

const rates: readType = {
  0: 100000,
  1: 50000,
  2: 25000,
  3: 20000,
  4: 10000,
  5: 5000,
};

const gains: readType = {
  16436: 20,
  16473: 100,
  16527: 1000,
  16543: 2000,
  16563: 5000,
  16579: 10000,
  16595: 20000,
  16616: 50000,
};

export const readHed = (
  event: ChangeEvent<HTMLInputElement>
): Promise<HedValue> => {
  return new Promise<HedValue>((resolve, reject) => {
    const input = event.target as HTMLInputElement; // イベントからHTMLInputElementを取得
    const file = input.files?.item(0); // inputからファイルを取得

    if (!file) {
      const errMsg = "ファイルが選択されていません";
      alert(errMsg);
      reject(new Error(errMsg)); // ファイルがない場合はrejectを呼び出す
      return;
    }

    const reader = new FileReader();
    reader.onload = (loadEvent: ProgressEvent<FileReader>) => {
      if (loadEvent.target?.result instanceof ArrayBuffer) {
        // 結果がArrayBufferのインスタンスであることを確認
        const buffer = new Uint16Array(loadEvent.target.result);
        const rateKey = buffer[16]; // 16番目の要素
        const gainKey = buffer[3]; // 3番目の要素
        const sampling_rate = rates[rateKey];
        const gain = gains[gainKey];
        resolve({ sampling_rate, gain });
      } else {
        reject(new Error("読み込んだデータが正しい形式ではありません"));
      }
    };
    reader.onerror = () => {
      reject(new Error("File could not be read."));
    };

    reader.readAsArrayBuffer(file); // Fileオブジェクトを渡す
  });
};
