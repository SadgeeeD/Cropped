// // frontend/src/components/FarmList.jsx
// import React, { createContext, useState, useEffect, useContext } from 'react';
// import axios from 'axios';

// const FarmContext = createContext();
// export const useFarms = () => useContext(FarmContext);


// export const FarmListProvider = ({ children }) => {
//   const [farms, setFarms] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchFarms = async () => {
//       try {
//         const res = await axios.get("http://localhost:5000/api/getFarms");
//         setFarms(res.data);
//       } catch (err) {
//         console.error("Failed to fetch farms:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchFarms();
//   }, []);

//   return (
//     <FarmContext.Provider value={{ farms, loading }}>
//       {children}
//     </FarmContext.Provider>
//   );
// };



// const FarmList = ({ show = "name" }) => {
//   const [farms, setFarms] = useState([]);



//   useEffect(() => {
//     const fetchFarms = async () => {
//       try {
//         const res = await axios.get('http://localhost:5000/api/getFarms');
//         console.log("Fetched farms:", res.data); // Add this
//         setFarms(res.data);
//       } catch (err) {
//         console.error('Error fetching farms:', err);
//       }
//     };

//     fetchFarms();
//   }, []);

//   return (
//     <ul>
//       {farms.map((farm, index) => (
//         <li key={index}>
//           {show === "farmId" && farm.FarmId}
//           {show === "userId" && farm.UserId}
//           {show === "user" && farm.User}
//           {show === "name" && farm.Name}
//           {show === "location" && farm.Location}
//           {show === "country" && farm.Country}
//         </li>
//       ))}
//     </ul>
//   );
// };



// export default FarmList;
