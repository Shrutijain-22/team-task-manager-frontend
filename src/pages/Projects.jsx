import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Navbar from '../components/Navbar';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Create Project Form State
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [teamMembersInput, setTeamMembersInput] = useState('');
  const [createError, setCreateError] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  // Member Management State
  const [addMemberProjectId, setAddMemberProjectId] = useState(null);
  const [newMemberId, setNewMemberId] = useState('');
  const [actionError, setActionError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/projects');
      setProjects(response.data.projects || []);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      } else {
        setError('Failed to load projects.');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await api.get('/api/users');
      setAllUsers(response.data.users || []);
    } catch (err) {
      console.error('Failed to load users');
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchProjects();
    fetchUsers();
  }, [navigate]);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    setCreateError('');
    setIsCreating(true);
    
    try {
      const teamMembers = teamMembersInput
        .split(',')
        .map(id => id.trim())
        .filter(id => id);

      await api.post('/api/projects', {
        name,
        description,
        teamMembers
      });
      
      setName('');
      setDescription('');
      setTeamMembersInput('');
      setShowForm(false);
      setActionSuccess('Project created successfully!');
      setTimeout(() => setActionSuccess(''), 3000);
      fetchProjects();
    } catch (err) {
      setCreateError(err.response?.data?.message || 'Failed to create project.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleAddMember = async (projectId) => {
    if (!newMemberId) return;
    setActionError('');
    setActionSuccess('');
    try {
      await api.put(`/api/projects/${projectId}/add-member`, { userId: newMemberId });
      setActionSuccess('Member added successfully!');
      setAddMemberProjectId(null);
      setNewMemberId('');
      fetchProjects();
      setTimeout(() => setActionSuccess(''), 3000);
    } catch (err) {
      setActionError(err.response?.data?.message || 'Failed to add member');
      setTimeout(() => setActionError(''), 4000);
    }
  };

  const handleRemoveMember = async (projectId, userId) => {
    if (!window.confirm("Are you sure you want to remove this member?")) return;
    setActionError('');
    setActionSuccess('');
    try {
      await api.put(`/api/projects/${projectId}/remove-member`, { userId });
      setActionSuccess('Member removed successfully!');
      fetchProjects();
      setTimeout(() => setActionSuccess(''), 3000);
    } catch (err) {
      setActionError(err.response?.data?.message || 'Failed to remove member');
      setTimeout(() => setActionError(''), 4000);
    }
  };

  if (loading && projects.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex justify-center items-center h-[calc(100vh-64px)]">
          <div className="animate-pulse text-xl text-gray-400 font-medium">Loading projects...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
            <p className="mt-1 text-sm text-gray-500">Manage and view your team's projects.</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition duration-150"
          >
            {showForm ? 'Cancel' : '+ Create Project'}
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg shadow-sm mb-6">
            {error}
          </div>
        )}

        {actionSuccess && (
          <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg shadow-sm mb-6">
            {actionSuccess}
          </div>
        )}

        {actionError && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg shadow-sm mb-6">
            {actionError}
          </div>
        )}

        {/* Create Project Form */}
        {showForm && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">New Project</h2>
            <form onSubmit={handleCreateProject} className="space-y-4">
              {createError && <div className="text-red-500 text-sm bg-red-50 p-2 rounded">{createError}</div>}
              <div>
                <label className="block text-sm font-medium text-gray-700">Project Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2 border"
                  placeholder="e.g. Website Redesign"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2 border"
                  rows="3"
                  placeholder="Project details..."
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isCreating}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition duration-150 disabled:opacity-50"
                >
                  {isCreating ? 'Creating...' : 'Save Project'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Projects Grid */}
        {projects.length === 0 && !loading ? (
          <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-200 text-center">
            <h3 className="mt-2 text-sm font-medium text-gray-900">No projects found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating a new project.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => {
              const isCreator = project.createdBy?._id === user._id || project.createdBy === user._id;
              
              // Filter out users who are already in the project
              const availableUsers = allUsers.filter(
                (u) => !project.teamMembers.some((m) => m._id === u._id)
              );

              return (
                <div key={project._id} className="bg-white overflow-hidden shadow-sm border border-gray-200 rounded-xl hover:shadow-md transition-shadow duration-200 flex flex-col">
                  <div className="p-6 flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-bold text-gray-900 truncate" title={project.name}>{project.name}</h3>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800" title="Project ID">
                        ID: {project._id.slice(-6)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                      {project.description || 'No description provided.'}
                    </p>
                    
                    <div className="mt-4">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Team Members</h4>
                        {isCreator && (
                          <button 
                            onClick={() => {
                              setAddMemberProjectId(addMemberProjectId === project._id ? null : project._id);
                              setNewMemberId(''); // reset selection
                            }}
                            className="text-xs text-blue-600 hover:text-blue-800 font-medium focus:outline-none"
                          >
                            {addMemberProjectId === project._id ? 'Cancel' : '+ Add'}
                          </button>
                        )}
                      </div>

                      {addMemberProjectId === project._id && (
                        <div className="flex mb-3 gap-2">
                          <select
                            value={newMemberId}
                            onChange={(e) => setNewMemberId(e.target.value)}
                            className="text-xs border border-gray-300 rounded px-2 py-1.5 flex-1 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                          >
                            <option value="" disabled>Select a user to add...</option>
                            {availableUsers.length > 0 ? (
                              availableUsers.map(u => (
                                <option key={u._id} value={u._id}>
                                  {u.name} ({u.email})
                                </option>
                              ))
                            ) : (
                              <option value="" disabled>No new users available</option>
                            )}
                          </select>
                          <button 
                            onClick={() => handleAddMember(project._id)}
                            disabled={!newMemberId}
                            className="bg-blue-600 text-white text-xs px-3 py-1.5 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150"
                          >
                            Add
                          </button>
                        </div>
                      )}

                      <div className="flex flex-wrap gap-2">
                        {project.teamMembers?.map((member) => {
                          const isProjectCreator = member._id === project.createdBy?._id;
                          return (
                            <span key={member._id} className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                              {member.name}
                              {isCreator && !isProjectCreator && (
                                <button 
                                  onClick={() => handleRemoveMember(project._id, member._id)}
                                  className="text-blue-400 hover:text-red-500 font-bold ml-1 focus:outline-none"
                                  title="Remove member"
                                >
                                  ×
                                </button>
                              )}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-6 py-3 border-t border-gray-100 flex justify-between items-center">
                    <p className="text-xs text-gray-500">Created by {project.createdBy?.name}</p>
                    <p className="text-[10px] text-gray-400">ID: {project._id}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;
