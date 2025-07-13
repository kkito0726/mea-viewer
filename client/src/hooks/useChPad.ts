import { useEffect, useState } from "react";

export const useChPad = () => {
  const gridSize = 8;
  const totalButtons = gridSize * gridSize;

  const [activeChs, setActiveChs] = useState<number[]>(() => {
    const stored = localStorage.getItem("activeChs");
    return stored ? JSON.parse(stored) : [];
  });

  // 更新されるたびにlocalStorageへ保存
  useEffect(() => {
    localStorage.setItem("activeChs", JSON.stringify(activeChs));
  }, [activeChs]);

  const toggleButton = (index: number) => {
    setActiveChs((prev) => {
      const buttonNumber = index + 1;
      if (prev.includes(buttonNumber)) {
        return prev.filter((item) => item !== buttonNumber);
      } else {
        return [...prev, buttonNumber];
      }
    });
  };
  const handleClearChs = () => {
    setActiveChs([]);
  };
  const handleSelectAllChs = () => {
    setActiveChs(Array.from({ length: totalButtons }, (_, index) => index + 1));
  };
  return {
    gridSize,
    activeChs,
    toggleButton,
    handleClearChs,
    handleSelectAllChs,
  } as const;
};
