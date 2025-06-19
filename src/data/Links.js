import { IoBarChart } from "react-icons/io5";
import { FiHome,  FiEdit, FiClock, FiSearch } from 'react-icons/fi';

export const links = [
  {
    title: 'Sidebar',
    links: [ 
      { name: 'Home', icon: <FiHome /> },
      { name: 'Dashboard', icon: <IoBarChart /> },
      { name: 'ManualEntry', icon: <FiEdit /> },
      { name: 'History', icon: <FiClock /> },
      { name: 'Identifier', icon: <FiSearch /> },
    ],
  },
];

