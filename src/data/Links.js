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


export const themeColors = [
  {
    name: 'blue-theme',
    color: '#1A97F5',
  },
  {
    name: 'green-theme',
    color: '#03C9D7',
  },
  {
    name: 'purple-theme',
    color: '#7352FF',
  },
  {
    name: 'red-theme',
    color: '#FF5C8E',
  },
  {
    name: 'indigo-theme',
    color: '#1E4DB7',
  },
  {
    color: '#FB9678',
    name: 'orange-theme',
  },
];