import { PageName } from "../enum/PageName";

type SidebarData = {
  name: string;
  link: string;
  label: string;
};

export const sidebarData: SidebarData[] = [
  {
    name: PageName.SHOW_ALL,
    link: "/showAll",
    label: "64電極表示",
  },
  {
    name: PageName.SHOW_SINGLE,
    link: "/showSingle",
    label: "1電極表示",
  },
  {
    name: PageName.SHOW_DETECTION,
    link: "/showDetection",
    label: "積み上げ表示",
  },
  {
    name: PageName.RASTER_PLOT,
    link: "/rasterPlot",
    label: "ラスタプロット",
  },
  {
    name: PageName.DRAW_2D,
    link: "/draw2d",
    label: "2Dカラーマップ",
  },
  {
    name: PageName.DRAW_3D,
    link: "/draw3d",
    label: "3Dカラーマップ",
  },
];
