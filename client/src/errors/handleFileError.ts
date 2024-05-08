export const handleFileError = (
  errMsg: string,
  reject: (reason?: unknown) => void
) => {
  alert(errMsg);
  console.error(errMsg);
  reject(new Error(errMsg));
};
