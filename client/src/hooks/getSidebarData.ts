import { PageName } from "../enum/PageName";
import { PagePath } from "../enum/PagePath";

type SidebarData = {
  name: string;
  link: string;
  label: string;
};

export const sidebarData: SidebarData[] = [
  {
    name: PageName.SHOW_ALL,
    link: PagePath.SHOW_ALL,
    label: "64電極表示",
  },
  {
    name: PageName.SHOW_SINGLE,
    link: PagePath.SHOW_SINGLE,
    label: "1電極表示",
  },
  {
    name: PageName.SHOW_DETECTION,
    link: PagePath.SHOW_DETECTION,
    label: "積み上げ表示",
  },
  {
    name: PageName.RASTER_PLOT,
    link: PagePath.RASTER_PLOT,
    label: "ラスタプロット",
  },
  {
    name: PageName.DRAW_2D,
    link: PagePath.DRAW_2D,
    label: "2Dカラーマップ",
  },
  {
    name: PageName.DRAW_3D,
    link: PagePath.DRAW_3D,
    label: "3Dカラーマップ",
  },
  {
    name: PageName.PlotPeaks,
    link: PagePath.PlotPeaks,
    label: "ピーク抽出",
  },
];
