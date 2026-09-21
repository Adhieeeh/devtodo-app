import React, { useState, useEffect } from 'react';

const STORAGE_KEY = 'devtodo_tasks_v1';

const INITIAL_TASKS = [
  { id: '1', text: 'Set up Vite + React development environment', completed: true },
  { id: '2', text: 'Design dark developer aesthetic UI', completed: true },
  { id: '3', text: 'Implement localStorage persistence', completed: false }
];

export default function App() {

  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_TASKS;
    } catch {
      return INITIAL_TASKS;
    }
  });

  const [inputText, setInputText] = useState('');
  const [filter, setFilter] = useState('all'); 
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState('');


  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (err) {
      console.error('Failed to save tasks:', err);
    }
  }, [tasks]);

  const addTask = (e) => {
    e.preventDefault();
    const clean = inputText.trim();
    if (!clean) return;

    const newTask = {
      id: Date.now().toString(),
      text: clean,
      completed: false
    };

    setTasks([newTask, ...tasks]);
    setInputText('');
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const startEditing = (task) => {
    setEditingId(task.id);
    setEditingText(task.text);
  };

  const saveEditing = (id) => {
    const clean = editingText.trim();
    if (!clean) {
      deleteTask(id);
    } else {
      setTasks(tasks.map(t => t.id === id ? { ...t, text: clean } : t));
    }
    setEditingId(null);
    setEditingText('');
  };

  const handleEditKeyDown = (e, id) => {
    if (e.key === 'Enter') saveEditing(id);
    if (e.key === 'Escape') setEditingId(null);
  };

  const toggleAll = () => {
    const allDone = tasks.length > 0 && tasks.every(t => t.completed);
    setTasks(tasks.map(t => ({ ...t, completed: !allDone })));
  };

  const clearCompleted = () => {
    setTasks(tasks.filter(t => !t.completed));
  };


  const filteredTasks = tasks.filter(t => {
    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  const completedCount = tasks.filter(t => t.completed).length;
  const progressPercent = tasks.length === 0 ? 0 : Math.round((completedCount / tasks.length) * 100);

  return (
    <div style={{ maxWidth: '640px', margin: '40px auto', padding: '0 20px', fontFamily: 'monospace', backgroundColor: '#070a13', color: '#f8fafc', minHeight: '85vh' }}>
      
      {/* Header */}
      <header style={{ borderBottom: '1px solid #1e293b', paddingBottom: '20px', marginBottom: '24px' }}>
        <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#38bdf8' }}>
           DevTasks Studio
        </h1>
        <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '12px' }}>
          To-Do list with a dark developer aesthetic, localStorage persistence, and a progress bar to track your productivity.
        </p>

        {/* Progress Bar */}
        <div style={{ marginTop: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#94a3b8', marginBottom: '6px' }}>
            <span>Progress ({completedCount}/{tasks.length} Completed)</span>
            <span style={{ color: '#38bdf8', fontWeight: 'bold' }}>{progressPercent}%</span>
          </div>
          <div style={{ height: '6px', backgroundColor: '#0f172a', borderRadius: '4px', overflow: 'hidden', border: '1px solid #1e293b' }}>
            <div style={{ height: '100%', width: `${progressPercent}%`, backgroundColor: '#38bdf8', transition: 'width 0.25s ease' }}></div>
          </div>
        </div>
      </header>

      {/* Input Box */}
      <form onSubmit={addTask} style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Type a task and hit Enter..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          style={{ flex: 1, padding: '10px 14px', backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', color: '#fff', fontSize: '13px', fontFamily: 'monospace', outline: 'none', boxSizing: 'border-box' }}
        />
        <button
          type="submit"
          style={{ padding: '10px 18px', backgroundColor: '#38bdf8', color: '#070a13', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}
        >
          Add ➕
        </button>
      </form>

      {/* Filter Tabs & Quick Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', gap: '6px' }}>
          {['all', 'active', 'completed'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '5px 12px',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '11px',
                fontWeight: 'bold',
                textTransform: 'capitalize',
                backgroundColor: filter === f ? '#1e293b' : 'transparent',
                color: filter === f ? '#38bdf8' : '#64748b'
              }}
            >
              {f}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={toggleAll}
            disabled={tasks.length === 0}
            style={{ padding: '4px 10px', backgroundColor: '#0f172a', border: '1px solid #1e293b', color: '#94a3b8', borderRadius: '6px', fontSize: '11px', cursor: tasks.length ? 'pointer' : 'not-allowed' }}
          >
            Toggle All
          </button>
          <button
            onClick={clearCompleted}
            disabled={completedCount === 0}
            style={{ padding: '4px 10px', backgroundColor: '#0f172a', border: '1px solid #1e293b', color: completedCount ? '#ef4444' : '#475569', borderRadius: '6px', fontSize: '11px', cursor: completedCount ? 'pointer' : 'not-allowed' }}
          >
            Clear Done
          </button>
        </div>
      </div>

      {/* Tasks List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {filteredTasks.map(task => (
          <div
            key={task.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: '#0f172a',
              border: `1px solid ${task.completed ? '#1e293b' : '#334155'}`,
              padding: '10px 14px',
              borderRadius: '8px',
              transition: 'all 0.15s'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTask(task.id)}
                style={{ width: '16px', height: '16px', accentColor: '#38bdf8', cursor: 'pointer' }}
              />

              {editingId === task.id ? (
                <input
                  type="text"
                  autoFocus
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                  onBlur={() => saveEditing(task.id)}
                  onKeyDown={(e) => handleEditKeyDown(e, task.id)}
                  style={{ flex: 1, padding: '4px 8px', backgroundColor: '#070a13', border: '1px solid #38bdf8', borderRadius: '4px', color: '#fff', fontSize: '13px', fontFamily: 'monospace', outline: 'none' }}
                />
              ) : (
                <span
                  onDoubleClick={() => startEditing(task)}
                  title="Double click to edit"
                  style={{
                    fontSize: '13px',
                    color: task.completed ? '#64748b' : '#f8fafc',
                    textDecoration: task.completed ? 'line-through' : 'none',
                    cursor: 'pointer',
                    userSelect: 'none'
                  }}
                >
                  {task.text}
                </span>
              )}
            </div>

            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                onClick={() => startEditing(task)}
                style={{ padding: '4px 8px', backgroundColor: 'transparent', border: '1px solid #1e293b', color: '#64748b', borderRadius: '4px', cursor: 'pointer', fontSize: '11px' }}
              >
                ✎
              </button>
              <button
                onClick={() => deleteTask(task.id)}
                style={{ padding: '4px 8px', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#ef4444', borderRadius: '4px', cursor: 'pointer', fontSize: '11px' }}
              >
                ✕
              </button>
            </div>
          </div>
        ))}

        {filteredTasks.length === 0 && (
          <div style={{ textAlign: 'center', color: '#475569', fontSize: '12px', padding: '40px 0', border: '1px dashed #1e293b', borderRadius: '8px' }}>
            No tasks found under the "{filter}" view.
          </div>
        )}
      </div>

    </div>
  );
}