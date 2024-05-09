import { handleFileError } from "../errors/handleFileError";
import { HedValue } from "../types/HedValue";
import { ReadTime } from "../types/ReadTime";

const VOLT_RANGE = 100;
const ELECTRODE_NUMBER = 64;
const BYTES_PER_SAMPLE = 2;
const DATA_UNIT_LENGTH = ELECTRODE_NUMBER + 4;

export const readBio = (
  file: File,
  hedValue: HedValue,
  readTime: ReadTime
): Promise<Float32Array[]> => {
  return new Promise((resolve, reject) => {
    const startByte: number =
      readTime.start *
      hedValue.sampling_rate *
      BYTES_PER_SAMPLE *
      DATA_UNIT_LENGTH;
    const byteCount: number =
      (readTime.end - readTime.start) *
      hedValue.sampling_rate *
      BYTES_PER_SAMPLE *
      DATA_UNIT_LENGTH;
    const cols: number =
      (readTime.end - readTime.start) * hedValue.sampling_rate;

    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const buffer = new Int16Array(e.target!.result as ArrayBuffer);
      const reshapedData = convertData(buffer, hedValue, readTime, cols);
      resolve(reshapedData);
    };
    reader.onerror = () => {
      handleFileError("ファイルの読み込みに失敗しました", reject);
    };
    reader.readAsArrayBuffer(file.slice(startByte, startByte + byteCount));
  });
};

const convertData = (
  buffer: Int16Array,
  hedValue: HedValue,
  readTime: ReadTime,
  cols: number
): Float32Array[] => {
  const data: Float32Array = new Float32Array(buffer.length);
  for (let i = 0; i < buffer.length; i++) {
    data[i] = buffer[i] * (VOLT_RANGE / (Math.pow(2, 16) - 1)) * 4;
  }

  const reshapedData: Float32Array[] = new Array(ELECTRODE_NUMBER + 1);
  reshapedData[0] = new Float32Array(cols); // For time array
  for (let i = 0; i < ELECTRODE_NUMBER; i++) {
    reshapedData[i + 1] = new Float32Array(cols);
    for (let j = 0; j < cols; j++) {
      reshapedData[i + 1][j] = data[j * DATA_UNIT_LENGTH + 4 + i]; // skip first 4 elements
    }
  }

  if (hedValue.gain !== 50000) {
    const amp: number = 50000 / hedValue.gain;
    for (let i = 1; i < reshapedData.length; i++) {
      reshapedData[i] = reshapedData[i].map((value) => value * amp);
    }
  }

  // Create time array
  for (let i = 0; i < cols; i++) {
    reshapedData[0][i] = i / hedValue.sampling_rate + readTime.start;
  }

  return reshapedData;
};
