import { FaChartPie, FaCog, FaFileAlt, FaHome, FaProjectDiagram, FaTools } from 'react-icons/fa';

export const  menus = [
  { title: "Dashboard", Icon: FaHome }, // Example: using FaHome for Dashboard
  { title: "Tools", Icon: FaTools, gap: true },
  { title: "ML Flows", Icon: FaProjectDiagram },
  { title: "Analytics", Icon: FaChartPie },
  { title: "Model Files", Icon: FaFileAlt, gap: true },
  { title: "Setting", Icon: FaCog },
];
