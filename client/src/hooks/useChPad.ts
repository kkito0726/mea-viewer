import { useState } from "react";

export const useChPad = () => {
  const gridSize = 8;
  const totalButtons = gridSize * gridSize;

  const [activeChs, setActiveChs] = useState<number[]>([]);

  const toggleButton = (index: number) => {
    setActiveChs((prev) => {
      const buttonNumber = index + 1;
      const currentIndex = prev.indexOf(buttonNumber);
      if (currentIndex === -1) {
        return [...prev, buttonNumber]; // ボタンをアクティブリストに追加
      } else {
        return prev.filter((item) => item !== buttonNumber); // ボタンをアクティブリストから削除
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
