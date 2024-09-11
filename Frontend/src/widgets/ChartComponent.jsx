// import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip } from 'chart.js';
// import React from 'react';
// import { Bar } from 'react-chartjs-2';

// ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

// const ChartComponent = ({ jobs, models }) => {
//   const processData = (data, type, dateField) => {
//     const counts = {};
//     data.forEach(item => {
//       if (item[dateField] && item[dateField].seconds) {
//         const date = new Date(item[dateField].seconds * 1000);
//         const yearMonthDay = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
//         if (!counts[yearMonthDay]) {
//           counts[yearMonthDay] = { jobs: 0, models: 0 };
//         }
//         counts[yearMonthDay][type]++;
//       }
//     });
//     return counts;
//   };

//   const jobCounts = processData(jobs, 'jobs', 'createdAt');
//   const modelCounts = processData(models, 'models', 'deployedAt');

//   const combinedCounts = {};
//   for (const key in jobCounts) {
//     if (!combinedCounts[key]) {
//       combinedCounts[key] = { jobs: 0, models: 0 };
//     }
//     combinedCounts[key].jobs += jobCounts[key].jobs;
//   }

//   for (const key in modelCounts) {
//     if (!combinedCounts[key]) {
//       combinedCounts[key] = { jobs: 0, models: 0 };
//     }
//     combinedCounts[key].models += modelCounts[key].models;
//   }

//   console.log('Job Counts:', jobCounts); // Debugging log
//   console.log('Model Counts:', modelCounts); // Debugging log
//   console.log('Combined Counts:', combinedCounts); // Debugging log

//   const labels = Object.keys(combinedCounts).sort();
//   const jobData = labels.map(label => combinedCounts[label].jobs || 0);
//   const modelData = labels.map(label => combinedCounts[label].models || 0);

//   const data = {
//     labels,
//     datasets: [
//       {
//         label: 'Jobs Created',
//         data: jobData,
//         backgroundColor: 'rgba(75, 192, 192, 0.6)',
//         borderColor: 'rgba(75, 192, 192, 1)',
//         borderWidth: 1,
//         barPercentage: 0.5,
//         barThickness: 'flex',
//         borderRadius: 4,
//         borderSkipped: false,
//       },
//       {
//         label: 'Models Deployed',
//         data: modelData,
//         backgroundColor: 'rgba(153, 102, 255, 0.6)',
//         borderColor: 'rgba(153, 102, 255, 1)',
//         borderWidth: 1,
//         barPercentage: 0.5,
//         barThickness: 'flex',
//         borderRadius: 4,
//         borderSkipped: false,
//       },
//     ],
//   };

//   const options = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       title: {
//         display: true,
//         text: 'Jobs Created and Models Deployed Over Time',
//         font: {
//           size: 18,
//         },
//       },
//       legend: {
//         display: true,
//         position: 'top',
//       },
//       tooltip: {
//         enabled: true,
//       },
//     },
//     scales: {
//       x: {
//         beginAtZero: true,
//         title: {
//           display: true,
//           text: 'Date',
//           font: {
//             size: 14,
//           },
//         },
//       },
//       y: {
//         beginAtZero: true,
//         title: {
//           display: true,
//           text: 'Count',
//           font: {
//             size: 14,
//           },
//         },
//       },
//     },
//   };

//   return (
//     <div style={{ width: '100%', height: '300px' }}>
//       <Bar data={data} options={options} />
//     </div>
//   );
// };

// export default ChartComponent;
