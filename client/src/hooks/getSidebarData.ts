type SidebarData = {
  name: string;
  link: string;
  label: string;
};

export const sidebarData: SidebarData[] = [
  {
    name: "showAll",
    link: "/showAll",
    label: "64電極表示",
  },
  {
    name: "showSingle",
    link: "/showSingle",
    label: "1電極表示",
  },
];
