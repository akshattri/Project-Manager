// src/pages/ProjectDetails.tsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { tasksAPI } from '../services/api';
import { Task } from '../types';

const ProjectDetails = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<number | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (projectId) {
      loadTasks();
    }
  }, [projectId]);

  const loadTasks = async () => {
    try {
      const data = await tasksAPI.getByProject(Number(projectId));
      setTasks(data);
    } catch (err) {
      console.error('Failed to load tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await tasksAPI.create(Number(projectId), {
        title: newTaskTitle,
        dueDate: newTaskDueDate || undefined,
      });
      setNewTaskTitle('');
      setNewTaskDueDate('');
      setShowModal(false);
      loadTasks();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create task');
    }
  };

  const handleUpdateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTask) return;

    setError('');

    try {
      await tasksAPI.update(editingTask.id, {
        title: newTaskTitle,
        dueDate: newTaskDueDate || undefined,
      });
      setEditingTask(null);
      setNewTaskTitle('');
      setNewTaskDueDate('');
      loadTasks();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update task');
    }
  };

  const handleToggleComplete = async (task: Task) => {
    try {
      await tasksAPI.update(task.id, {
        isCompleted: !task.isCompleted,
      });
      loadTasks();
    } catch (err) {
      alert('Failed to update task');
    }
  };

  const confirmDeleteTask = (id: number) => {
    setTaskToDelete(id);
    setShowDeleteConfirm(true);
  };

  const handleDeleteTask = async () => {
    if (taskToDelete === null) return;

    try {
      await tasksAPI.delete(taskToDelete);
      setShowDeleteConfirm(false);
      setTaskToDelete(null);
      loadTasks();
    } catch (err) {
      alert('Failed to delete task');
    }
  };

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setNewTaskTitle(task.title);
    setNewTaskDueDate(task.dueDate ? task.dueDate.split('T')[0] : '');
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingTask(null);
    setNewTaskTitle('');
    setNewTaskDueDate('');
    setError('');
  };

  const bgColor = isDarkMode ? '#111827' : '#f3f4f6';
  const cardBg = isDarkMode ? '#1f2937' : '#ffffff';
  const textColor = isDarkMode ? '#f9fafb' : '#111827';
  const secondaryText = isDarkMode ? '#9ca3af' : '#6b7280';
  const borderColor = isDarkMode ? '#374151' : '#e5e7eb';

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: bgColor }}>
        <div style={{ fontSize: '18px', color: secondaryText }}>Loading...</div>
      </div>
    );
  }

  const completedTasks = tasks.filter(t => t.isCompleted).length;
  const progress = tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: bgColor }}>
      {/* Header */}
      <div style={{ backgroundColor: cardBg, borderBottom: `1px solid ${borderColor}`, padding: '16px 24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={() => navigate('/dashboard')}
            style={{
              padding: '8px 16px',
              backgroundColor: isDarkMode ? '#374151' : '#f3f4f6',
              color: textColor,
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
            }}
          >
            ← Back to Projects
          </button>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: textColor }}>📋 Project Tasks</h1>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
        {/* Progress Card */}
        <div style={{ backgroundColor: cardBg, padding: '20px', borderRadius: '12px', marginBottom: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: textColor }}>Progress</h3>
            <span style={{ fontSize: '14px', color: secondaryText }}>
              {completedTasks} / {tasks.length} completed
            </span>
          </div>
          <div style={{ width: '100%', height: '8px', backgroundColor: isDarkMode ? '#374151' : '#e5e7eb', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ width: `${progress}%`, height: '100%', background: 'linear-gradient(90deg, #10b981 0%, #059669 100%)', transition: 'width 0.3s ease' }}></div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', color: textColor }}>✅ Tasks</h2>
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
            + New Task
          </button>
        </div>

        {/* Tasks List */}
        {tasks.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px', backgroundColor: cardBg, borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📝</div>
            <p style={{ color: secondaryText, marginBottom: '16px', fontSize: '16px' }}>No tasks yet. Create your first task!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {tasks.map((task) => (
              <div
                key={task.id}
                style={{
                  backgroundColor: cardBg,
                  padding: '20px',
                  borderRadius: '12px',
                  boxShadow: isDarkMode ? '0 2px 4px rgba(0,0,0,0.3)' : '0 2px 4px rgba(0,0,0,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  border: `1px solid ${borderColor}`,
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateX(4px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateX(0)';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
                  <input
                    type="checkbox"
                    checked={task.isCompleted}
                    onChange={() => handleToggleComplete(task)}
                    style={{ width: '22px', height: '22px', cursor: 'pointer', accentColor: '#10b981' }}
                  />
                  <div style={{ flex: 1 }}>
                    <h3
                      style={{
                        fontSize: '16px',
                        fontWeight: '500',
                        textDecoration: task.isCompleted ? 'line-through' : 'none',
                        color: task.isCompleted ? secondaryText : textColor,
                        marginBottom: '4px',
                      }}
                    >
                      {task.title}
                    </h3>
                    {task.dueDate && (
                      <p style={{ fontSize: '13px', color: secondaryText }}>
                        📅 Due: {new Date(task.dueDate).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </p>
                    )}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => openEditModal(task)}
                    style={{
                      padding: '8px 14px',
                      backgroundColor: isDarkMode ? '#1e3a8a' : '#dbeafe',
                      color: isDarkMode ? '#93c5fd' : '#1e40af',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: '500',
                    }}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => confirmDeleteTask(task.id)}
                    style={{
                      padding: '8px 14px',
                      backgroundColor: isDarkMode ? '#7f1d1d' : '#fee2e2',
                      color: isDarkMode ? '#fca5a5' : '#dc2626',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: '500',
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
                Delete Task?
              </h3>
              <p style={{ color: secondaryText, fontSize: '14px', lineHeight: '1.6' }}>
                Are you sure you want to delete this task? This action cannot be undone.
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
                onClick={handleDeleteTask}
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

      {/* Create/Edit Task Modal */}
      {(showModal || editingTask) && (
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
          onClick={closeModal}
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
              {editingTask ? '✏️ Edit Task' : '✨ Create New Task'}
            </h3>

            {error && (
              <div style={{ backgroundColor: '#fee2e2', border: '1px solid #ef4444', color: '#dc2626', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>
                {error}
              </div>
            )}

            <form onSubmit={editingTask ? handleUpdateTask : handleCreateTask}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: textColor }}>
                  Title *
                </label>
                <input
                  type="text"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  required
                  maxLength={200}
                  style={{ 
                    width: '100%', 
                    padding: '10px 12px', 
                    border: `1px solid ${borderColor}`, 
                    borderRadius: '8px', 
                    fontSize: '14px',
                    backgroundColor: isDarkMode ? '#374151' : '#ffffff',
                    color: textColor,
                  }}
                  placeholder="Enter task title"
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: textColor }}>
                  Due Date (optional)
                </label>
                <input
                  type="date"
                  value={newTaskDueDate}
                  onChange={(e) => setNewTaskDueDate(e.target.value)}
                  style={{ 
                    width: '100%', 
                    padding: '10px 12px', 
                    border: `1px solid ${borderColor}`, 
                    borderRadius: '8px', 
                    fontSize: '14px',
                    backgroundColor: isDarkMode ? '#374151' : '#ffffff',
                    color: textColor,
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={closeModal}
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
                  {editingTask ? 'Update Task' : 'Create Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetails;