// src/pages/Dashboard.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { projectsAPI, schedulerAPI, ScheduleResponse } from '../services/api';
import { Project } from '../types';

const Dashboard = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showScheduler, setShowScheduler] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<number | null>(null);
  const [newProjectTitle, setNewProjectTitle] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');
  const [error, setError] = useState('');
  const [schedule, setSchedule] = useState<ScheduleResponse | null>(null);
  const [schedulerLoading, setSchedulerLoading] = useState(false);
  const { user, logout } = useAuth();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const data = await projectsAPI.getAll();
      setProjects(data);
    } catch (err) {
      console.error('Failed to load projects:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newProjectTitle.length < 3) {
      setError('Title must be at least 3 characters');
      return;
    }

    try {
      await projectsAPI.create({
        title: newProjectTitle,
        description: newProjectDescription || undefined,
      });
      setNewProjectTitle('');
      setNewProjectDescription('');
      setShowModal(false);
      loadProjects();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create project');
    }
  };

  const confirmDeleteProject = (id: number) => {
    setProjectToDelete(id);
    setShowDeleteConfirm(true);
  };

  const handleDeleteProject = async () => {
    if (projectToDelete === null) return;

    try {
      await projectsAPI.delete(projectToDelete);
      setShowDeleteConfirm(false);
      setProjectToDelete(null);
      loadProjects();
    } catch (err) {
      alert('Failed to delete project');
    }
  };

  const handleGenerateSchedule = async () => {
    setSchedulerLoading(true);
    try {
      const result = await schedulerAPI.generateSchedule({
        startDate: new Date().toISOString().split('T')[0],
        hoursPerDay: 8,
        tasksPerDay: 5
      });
      setSchedule(result);
    } catch (err) {
      alert('Failed to generate schedule');
    } finally {
      setSchedulerLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return isDarkMode ? '#ef4444' : '#dc2626';
      case 'High': return isDarkMode ? '#f59e0b' : '#d97706';
      case 'Medium': return isDarkMode ? '#3b82f6' : '#2563eb';
      default: return isDarkMode ? '#10b981' : '#059669';
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className={isDarkMode ? 'dark-bg' : ''} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: isDarkMode ? '#111827' : '#f3f4f6' }}>
        <div style={{ fontSize: '18px', color: isDarkMode ? '#9ca3af' : '#6b7280' }}>Loading...</div>
      </div>
    );
  }

  const bgColor = isDarkMode ? '#111827' : '#f3f4f6';
  const cardBg = isDarkMode ? '#1f2937' : '#ffffff';
  const textColor = isDarkMode ? '#f9fafb' : '#111827';
  const secondaryText = isDarkMode ? '#9ca3af' : '#6b7280';
  const borderColor = isDarkMode ? '#374151' : '#e5e7eb';

  return (
    <div style={{ minHeight: '100vh', backgroundColor: bgColor }}>
      {/* Header */}
      <div style={{ backgroundColor: cardBg, borderBottom: `1px solid ${borderColor}`, padding: '16px 24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: textColor }}>📊 Project Management</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ color: secondaryText, fontSize: '14px' }}>Welcome, <strong>{user?.username}</strong></span>
            <button
              onClick={toggleDarkMode}
              style={{
                padding: '8px 12px',
                backgroundColor: isDarkMode ? '#374151' : '#f3f4f6',
                color: textColor,
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '18px',
              }}
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDarkMode ? '☀️' : '🌙'}
            </button>
            <button
              onClick={() => setShowScheduler(true)}
              style={{
                padding: '8px 16px',
                backgroundColor: '#8b5cf6',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
              }}
            >
              🤖 Smart Scheduler
            </button>
            <button
              onClick={handleLogout}
              style={{
                padding: '8px 16px',
                backgroundColor: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', color: textColor }}>📁 My Projects</h2>
          <button
            onClick={() => setShowModal(true)}
            style={{
              padding: '10px 20px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              boxShadow: '0 4px 6px rgba(102, 126, 234, 0.4)',
            }}
          >
            + New Project
          </button>
        </div>

        {/* Projects Grid */}
        {projects.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px', backgroundColor: cardBg, borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📦</div>
            <p style={{ color: secondaryText, marginBottom: '16px', fontSize: '16px' }}>No projects yet. Create your first project!</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
            {projects.map((project) => (
              <div
                key={project.id}
                style={{
                  backgroundColor: cardBg,
                  padding: '24px',
                  borderRadius: '12px',
                  boxShadow: isDarkMode ? '0 4px 6px rgba(0,0,0,0.3)' : '0 4px 6px rgba(0,0,0,0.1)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  border: `1px solid ${borderColor}`,
                }}
                onClick={() => navigate(`/projects/${project.id}`)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = isDarkMode ? '0 8px 12px rgba(0,0,0,0.4)' : '0 8px 12px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = isDarkMode ? '0 4px 6px rgba(0,0,0,0.3)' : '0 4px 6px rgba(0,0,0,0.1)';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'start', marginBottom: '12px' }}>
                  <div style={{ fontSize: '32px', marginRight: '12px' }}>📋</div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px', color: textColor }}>{project.title}</h3>
                    <p style={{ color: secondaryText, fontSize: '14px', marginBottom: '12px', lineHeight: '1.5' }}>
                      {project.description || 'No description'}
                    </p>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: `1px solid ${borderColor}` }}>
                  <span style={{ fontSize: '13px', color: secondaryText, fontWeight: '500' }}>
                    ✓ {project.taskCount} task{project.taskCount !== 1 ? 's' : ''}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      confirmDeleteProject(project.id);
                    }}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: isDarkMode ? '#7f1d1d' : '#fee2e2',
                      color: isDarkMode ? '#fca5a5' : '#dc2626',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: '500',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = isDarkMode ? '#991b1b' : '#fecaca';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = isDarkMode ? '#7f1d1d' : '#fee2e2';
                    }}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
            backdropFilter: 'blur(4px)',
          }}
          onClick={() => setShowDeleteConfirm(false)}
        >
          <div
            style={{
              backgroundColor: cardBg,
              padding: '32px',
              borderRadius: '12px',
              maxWidth: '440px',
              width: '100%',
              margin: '20px',
              boxShadow: '0 20px 25px -5px rgba(0,0,0,0.3)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
              <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '12px', color: textColor }}>
                Delete Project?
              </h3>
              <p style={{ color: secondaryText, fontSize: '14px', lineHeight: '1.6' }}>
                Are you sure you want to delete this project? All tasks will be permanently deleted. This action cannot be undone.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                style={{
                  padding: '10px 24px',
                  backgroundColor: isDarkMode ? '#374151' : '#f3f4f6',
                  color: textColor,
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteProject}
                style={{
                  padding: '10px 24px',
                  backgroundColor: '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                }}
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Project Modal */}
      {showModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
            backdropFilter: 'blur(4px)',
          }}
          onClick={() => setShowModal(false)}
        >
          <div
            style={{
              backgroundColor: cardBg,
              padding: '32px',
              borderRadius: '12px',
              maxWidth: '500px',
              width: '100%',
              margin: '20px',
              boxShadow: '0 20px 25px -5px rgba(0,0,0,0.3)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px', color: textColor }}>
              ✨ Create New Project
            </h3>

            {error && (
              <div style={{ backgroundColor: '#fee2e2', border: '1px solid #ef4444', color: '#dc2626', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleCreateProject}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: textColor }}>
                  Title *
                </label>
                <input
                  type="text"
                  value={newProjectTitle}
                  onChange={(e) => setNewProjectTitle(e.target.value)}
                  required
                  minLength={3}
                  maxLength={100}
                  style={{ 
                    width: '100%', 
                    padding: '10px 12px', 
                    border: `1px solid ${borderColor}`, 
                    borderRadius: '8px', 
                    fontSize: '14px',
                    backgroundColor: isDarkMode ? '#374151' : '#ffffff',
                    color: textColor,
                  }}
                  placeholder="Enter project name"
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: textColor }}>
                  Description (optional)
                </label>
                <textarea
                  value={newProjectDescription}
                  onChange={(e) => setNewProjectDescription(e.target.value)}
                  maxLength={500}
                  rows={4}
                  style={{ 
                    width: '100%', 
                    padding: '10px 12px', 
                    border: `1px solid ${borderColor}`, 
                    borderRadius: '8px', 
                    fontSize: '14px', 
                    resize: 'vertical',
                    backgroundColor: isDarkMode ? '#374151' : '#ffffff',
                    color: textColor,
                  }}
                  placeholder="Describe your project"
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: isDarkMode ? '#374151' : '#f3f4f6',
                    color: textColor,
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '10px 20px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                  }}
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Smart Scheduler Modal */}
      {showScheduler && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
            backdropFilter: 'blur(4px)',
            overflowY: 'auto',
          }}
          onClick={() => setShowScheduler(false)}
        >
          <div
            style={{
              backgroundColor: cardBg,
              padding: '32px',
              borderRadius: '12px',
              maxWidth: '700px',
              width: '100%',
              margin: '20px',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 20px 25px -5px rgba(0,0,0,0.3)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontSize: '22px', fontWeight: '600', marginBottom: '12px', color: textColor }}>
              🤖 Smart Scheduler
            </h3>
            <p style={{ color: secondaryText, marginBottom: '24px', fontSize: '14px' }}>
              Let AI organize your tasks intelligently based on due dates and priorities.
            </p>

            {!schedule ? (
              <div style={{ textAlign: 'center' }}>
                <button
                  onClick={handleGenerateSchedule}
                  disabled={schedulerLoading}
                  style={{
                    padding: '12px 32px',
                    background: schedulerLoading ? '#9ca3af' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: schedulerLoading ? 'not-allowed' : 'pointer',
                    fontSize: '16px',
                    fontWeight: '500',
                  }}
                >
                  {schedulerLoading ? 'Generating...' : '✨ Generate Schedule'}
                </button>
              </div>
            ) : (
              <div>
                <div style={{ backgroundColor: isDarkMode ? '#1e293b' : '#f0fdf4', padding: '16px', borderRadius: '8px', marginBottom: '20px', border: `1px solid ${isDarkMode ? '#334155' : '#86efac'}` }}>
                  <p style={{ color: isDarkMode ? '#86efac' : '#166534', marginBottom: '8px', fontWeight: '500' }}>
                    {schedule.message}
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginTop: '12px' }}>
                    <div>
                      <span style={{ fontSize: '12px', color: secondaryText }}>Total Tasks:</span>
                      <p style={{ fontSize: '18px', fontWeight: '600', color: textColor }}>{schedule.totalTasks}</p>
                    </div>
                    <div>
                      <span style={{ fontSize: '12px', color: secondaryText }}>Scheduled Days:</span>
                      <p style={{ fontSize: '18px', fontWeight: '600', color: textColor }}>{schedule.totalDays}</p>
                    </div>
                    <div>
                      <span style={{ fontSize: '12px', color: secondaryText }}>Avg Tasks/Day:</span>
                      <p style={{ fontSize: '18px', fontWeight: '600', color: textColor }}>{schedule.averageTasksPerDay.toFixed(1)}</p>
                    </div>
                    <div>
                      <span style={{ fontSize: '12px', color: secondaryText }}>Overdue:</span>
                      <p style={{ fontSize: '18px', fontWeight: '600', color: '#ef4444' }}>{schedule.overdueTasks}</p>
                    </div>
                  </div>
                </div>

                <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                  {schedule.scheduledTasks.map((task, index) => (
                    <div
                      key={task.taskId}
                      style={{
                        backgroundColor: isDarkMode ? '#1e293b' : '#f9fafb',
                        padding: '16px',
                        borderRadius: '8px',
                        marginBottom: '12px',
                        border: `1px solid ${borderColor}`,
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                        <div style={{ flex: 1 }}>
                          <h4 style={{ fontSize: '15px', fontWeight: '600', color: textColor, marginBottom: '4px' }}>
                            {index + 1}. {task.taskTitle}
                          </h4>
                          <p style={{ fontSize: '12px', color: secondaryText }}>📁 {task.projectTitle}</p>
                        </div>
                        <span
                          style={{
                            padding: '4px 12px',
                            borderRadius: '12px',
                            fontSize: '11px',
                            fontWeight: '600',
                            backgroundColor: getPriorityColor(task.priority) + '20',
                            color: getPriorityColor(task.priority),
                          }}
                        >
                          {task.priority}
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: secondaryText }}>
                        <span>📅 {new Date(task.suggestedDate).toLocaleDateString()}</span>
                        <span>⏱️ {task.estimatedHours}h</span>
                        {task.isOverdue && <span style={{ color: '#ef4444' }}>⚠️ Overdue</span>}
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setSchedule(null)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    marginTop: '16px',
                    backgroundColor: isDarkMode ? '#374151' : '#f3f4f6',
                    color: textColor,
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                  }}
                >
                  Generate New Schedule
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;