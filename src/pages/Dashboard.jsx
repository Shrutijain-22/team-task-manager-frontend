import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Navbar from '../components/Navbar';

const MetricCard = ({ title, value, color, bg }) => (
  <div className={`${bg} overflow-hidden shadow-sm border border-gray-100 rounded-xl transition-all duration-200 hover:shadow-md`}>
    <div className="p-6">
      <div className="flex items-center">
        <div className="w-0 flex-1">
          <dl>
            <dt className="text-sm font-semibold text-gray-500 uppercase tracking-wider truncate">{title}</dt>
            <dd>
              <div className={`text-4xl font-bold mt-2 ${color}`}>{value || 0}</div>
            </dd>
          </dl>
        </div>
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchDashboardData = async () => {
      try {
        const response = await api.get('/api/dashboard');
        setData(response.data);
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/login');
        } else {
          setError('Failed to load dashboard data.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex justify-center items-center h-[calc(100vh-64px)]">
          <div className="animate-pulse flex space-x-4">
            <div className="text-xl font-medium text-gray-400">Loading metrics...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg shadow-sm">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="mt-1 text-sm text-gray-500">
            Welcome back, {user.name}! Here is a summary of your tasks and projects.
          </p>
        </div>
        
        <div className="mb-10 space-y-6">
          <h2 className="text-xl font-bold text-gray-800 border-b pb-2">My Personal Tasks</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard title="My Tasks" value={data.myStats?.totalTasks} color="text-blue-600" bg="bg-blue-50" />
            <MetricCard title="Completed Tasks" value={data.myStats?.completedTasks} color="text-green-600" bg="bg-green-50" />
            <MetricCard title="Pending Tasks" value={data.myStats?.pendingTasks} color="text-yellow-600" bg="bg-yellow-50" />
            <MetricCard title="Overdue Tasks" value={data.myStats?.overdueTasks} color="text-red-600" bg="bg-red-50" />
          </div>

          <div className="bg-white shadow-sm border border-gray-100 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 border-b pb-2">My Tasks by Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
              <div className="p-6 bg-gray-50 border border-gray-100 rounded-xl">
                <div className="text-sm font-medium text-gray-500 uppercase">To Do</div>
                <div className="text-3xl font-bold text-gray-700 mt-2">{data.myStats?.tasksByStatus?.todo || 0}</div>
              </div>
              <div className="p-6 bg-yellow-50 border border-yellow-100 rounded-xl">
                <div className="text-sm font-medium text-yellow-600 uppercase">In Progress</div>
                <div className="text-3xl font-bold text-yellow-700 mt-2">{data.myStats?.tasksByStatus?.inProgress || 0}</div>
              </div>
              <div className="p-6 bg-blue-50 border border-blue-100 rounded-xl">
                <div className="text-sm font-medium text-blue-600 uppercase">In Review</div>
                <div className="text-3xl font-bold text-blue-700 mt-2">{data.myStats?.tasksByStatus?.inReview || 0}</div>
              </div>
              <div className="p-6 bg-green-50 border border-green-100 rounded-xl">
                <div className="text-sm font-medium text-green-600 uppercase">Done</div>
                <div className="text-3xl font-bold text-green-700 mt-2">{data.myStats?.tasksByStatus?.done || 0}</div>
              </div>
            </div>
          </div>
        </div>

        {data.adminStats && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-800 border-b pb-2">Admin Overview (My Projects)</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
              <MetricCard title="Total Projects" value={data.adminStats.totalProjects} color="text-blue-600" bg="bg-blue-50" />
              <MetricCard title="Total Tasks" value={data.adminStats.totalTasks} color="text-gray-900" bg="bg-white" />
              <MetricCard title="Completed Tasks" value={data.adminStats.completedTasks} color="text-green-600" bg="bg-green-50" />
              <MetricCard title="Pending Tasks" value={data.adminStats.pendingTasks} color="text-yellow-600" bg="bg-yellow-50" />
              <MetricCard title="Overdue Tasks" value={data.adminStats.overdueTasks} color="text-red-600" bg="bg-red-50" />
            </div>

            <div className="bg-white shadow-sm border border-gray-100 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6 border-b pb-2">Tasks by Status Breakdown</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
                <div className="p-6 bg-gray-50 border border-gray-100 rounded-xl">
                  <div className="text-sm font-medium text-gray-500 uppercase">To Do</div>
                  <div className="text-3xl font-bold text-gray-700 mt-2">{data.adminStats.tasksByStatus?.todo || 0}</div>
                </div>
                <div className="p-6 bg-yellow-50 border border-yellow-100 rounded-xl">
                  <div className="text-sm font-medium text-yellow-600 uppercase">In Progress</div>
                  <div className="text-3xl font-bold text-yellow-700 mt-2">{data.adminStats.tasksByStatus?.inProgress || 0}</div>
                </div>
                <div className="p-6 bg-blue-50 border border-blue-100 rounded-xl">
                  <div className="text-sm font-medium text-blue-600 uppercase">In Review</div>
                  <div className="text-3xl font-bold text-blue-700 mt-2">{data.adminStats.tasksByStatus?.inReview || 0}</div>
                </div>
                <div className="p-6 bg-green-50 border border-green-100 rounded-xl">
                  <div className="text-sm font-medium text-green-600 uppercase">Done</div>
                  <div className="text-3xl font-bold text-green-700 mt-2">{data.adminStats.tasksByStatus?.done || 0}</div>
                </div>
              </div>
            </div>

            {data.adminStats.tasksPerUser?.length > 0 && (
              <div className="bg-white shadow-sm border border-gray-100 rounded-xl p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6 border-b pb-2">Tasks Per Team Member</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Member</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Tasks Assigned</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {data.adminStats.tasksPerUser.map((member) => (
                        <tr key={member.userId} className="hover:bg-gray-50 transition duration-150">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{member.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.email}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                              {member.count} {member.count === 1 ? 'task' : 'tasks'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
