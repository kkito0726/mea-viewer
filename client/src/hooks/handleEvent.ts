import { ChangeEvent } from "react";

export const handleFileFromChangeEvent = (
  e: ChangeEvent<HTMLInputElement>
): File | undefined => {
  const input = e.target as HTMLInputElement;
  const file = input.files?.item(0);

  if (!file) {
    return;
  }
  return file;
};
