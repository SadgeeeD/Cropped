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

export const plantCareTips = {
  species: {
    peppermint: [
      "Prefers moist, well-drained soil.",
      "Thrives in partial shade.",
      "Trim regularly to encourage growth."
    ],
    bok_choy: [
      "Water consistently to avoid bitterness.",
      "Grows best in cool temperatures (15–20°C).",
      "Protect from pests like aphids and flea beetles."
    ],
    nai_bai: [
      "Needs full sun or partial shade.",
      "Keep soil moist but not soggy.",
      "Use organic compost for better growth."
    ]
  },
  health: {
    healthy: [
      "No issues detected — continue current care routine.",
      "Monitor regularly for early signs of disease."
    ],
    anthracnose: [
      "Remove and discard infected leaves immediately.",
      "Avoid overhead watering to reduce moisture on leaves.",
      "Use a copper-based fungicide if needed."
    ],
    downy_mildew: [
      "Improve air circulation around plants.",
      "Avoid watering late in the day.",
      "Apply fungicides early if outbreak occurs."
    ],
    fusarium_leaf_spot: [
      "Use disease-free soil and avoid waterlogging.",
      "Ensure proper drainage in pots or beds.",
      "Sanitize gardening tools between uses."
    ],
    leaf_spot: [
      "Avoid wetting the foliage during watering.",
      "Trim affected areas and dispose of them properly.",
      "Use a general-purpose fungicide if spreading."
    ],
    powdery_mildew: [
      "Ensure plants get enough sunlight and airflow.",
      "Avoid excess nitrogen fertilizer.",
      "Apply sulfur- or potassium bicarbonate-based fungicides."
    ],
    viral_mosaic: [
      "Remove and destroy infected plants if severe.",
      "Control aphids and whiteflies — common virus carriers.",
      "Avoid planting susceptible species nearby."
    ]
  }
};
