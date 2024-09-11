import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#ff0000'];

const GraphWidget = ({ projectName }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);

  useEffect(() => {
    if (projectName) {
      axios.get(`https://myowngpt-server.onrender.com/wandb-data?projectName=${projectName}`)
      // axios.get(`https://yogpt-server.vercel.app/wandb-data?projectName=${projectName}`)
        .then(response => {
          setData(response.data);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching data:', error);
          setLoading(false);
        });

      const handleResize = () => {
        if (containerRef.current) {
          containerRef.current.dispatchEvent(new Event('resize'));
        }
      };

      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, [projectName]);

  const metrics = ['train/loss', 'train/global_step', 'train/learning_rate', 'train/grad_norm', 'train/epoch'];

  const spinnerStyle = {
    border: '8px solid #f3f3f3', /* Light grey */
    borderTop: '8px solid #3498db', /* Blue */
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    animation: 'spin 2s linear infinite',
  };

  return (
    <div>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      <div className="flex flex-wrap overflow-auto" ref={containerRef}>
        {metrics.map((metric, index) => (
          <div
            key={metric}
            className="w-full sm:w-1/2 md:w-1/3 p-2"
          >
            <div className="bg-white border border-gray-300 rounded-lg shadow-md py-2 flex flex-col items-center justify-center h-64">
              <h3 className="mb-4 text-lg font-semibold text-center">
                {metric.replace('_', ' ')}
              </h3>
              <div className="flex justify-center items-center w-full h-full">
                {loading ? (
                  <div style={spinnerStyle}></div>
                ) : (
                  <ResponsiveContainer width="100%" height={150}>
                    <LineChart data={data}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="_step" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey={metric}
                        stroke={COLORS[index % COLORS.length]}
                        name={metric}
                        connectNulls
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GraphWidget;
