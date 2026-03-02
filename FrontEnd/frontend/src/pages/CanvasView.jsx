import React, { useState, useEffect } from 'react';
import api from '../api';
import './CanvasView.css';
import FAB from '../components/FAB';
import Modal from '../components/Modal';
import Input from '../components/Input';
import Button from '../components/Button';

const CanvasView = ({ user }) => {
    const [teams, setTeams] = useState([]);
    const [projects, setProjects] = useState([]);
    const [sprints, setSprints] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [teamMembers, setTeamMembers] = useState([]);
    const [loading, setLoading] = useState(true);

    const [activeTeamId, setActiveTeamId] = useState(null);
    const [activeProjectId, setActiveProjectId] = useState(null);

    // Modals
    const [modalType, setModalType] = useState(null); // 'team', 'project', 'sprint', 'task', 'members'
    const [formData, setFormData] = useState({});
    const [selectedSprintId, setSelectedSprintId] = useState(null);

    const fetchData = async () => {
        try {
            const [teamsRes, projectsRes, sprintsRes, tasksRes, usersRes, membersRes] = await Promise.all([
                api.get(`/teams/teams/?user_id=${user.user_id}`),
                api.get(`/projects/projects/?user_id=${user.user_id}`),
                api.get('/sprints/sprints/'),
                api.get('/sprints/sprint-tasks/'),
                api.get('/accounts/users/'),
                api.get('/teams/team-members/')
            ]);

            setTeams(teamsRes.data);
            setProjects(projectsRes.data);
            setSprints(sprintsRes.data);
            setTasks(tasksRes.data);
            setAllUsers(usersRes.data);
            setTeamMembers(membersRes.data);

            if (teamsRes.data.length > 0 && !activeTeamId) {
                setActiveTeamId(teamsRes.data[0].team_id);
            }
        } catch (err) {
            console.error("Error fetching canvas data:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAction = (action) => {
        setFormData({});
        setModalType(action);
    };

    const handleStatusChange = async (taskId, newStatus) => {
        // Optimistic UI update
        const previousTasks = [...tasks];
        const updatedTasks = tasks.map(t =>
            t.sprint_task_id === taskId ? { ...t, status: newStatus } : t
        );
        setTasks(updatedTasks);

        try {
            await api.patch(`/sprints/sprint-tasks/${taskId}/`, { status: newStatus });
        } catch (err) {
            console.error("Failed to update status:", err);
            setTasks(previousTasks); // Revert on failure
            alert("Failed to update task status.");
        }
    };

    const handleDeleteSprint = async (sprintId) => {
        if (!window.confirm("Are you sure you want to delete this Sprint and all its tasks?")) return;
        try {
            await api.delete(`/sprints/sprints/${sprintId}/`);
            setSprints(currentSprints => currentSprints.filter(s => s.sprint_id !== sprintId));
            setTasks(currentTasks => currentTasks.filter(t => t.sprint_id !== sprintId));
        } catch (err) {
            console.error("Failed to delete sprint:", err);
            alert("Failed to delete sprint");
        }
    };

    const handleDeleteTask = async (taskId) => {
        if (!window.confirm("Are you sure you want to delete this Task?")) return;
        try {
            await api.delete(`/sprints/sprint-tasks/${taskId}/`);
            setTasks(currentTasks => currentTasks.filter(t => t.sprint_task_id !== taskId));
        } catch (err) {
            console.error("Failed to delete task:", err);
            alert("Failed to delete task");
        }
    };

    const handleCreateTaskForSprint = (sprintId) => {
        setFormData({});
        setSelectedSprintId(sprintId);
        setModalType('task');
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            if (modalType === 'team') {
                const res = await api.post('/teams/teams/', { name: formData.name, description: formData.description || '' });
                await api.post('/teams/team-members/', { team_id: res.data.team_id, user_id: user.user_id, role: 'Manager' });
                setActiveTeamId(res.data.team_id);
            } else if (modalType === 'project') {
                if (!activeTeamId) return alert('Create a team first!');
                const res = await api.post('/projects/projects/', {
                    user_id: user.user_id, team_id: activeTeamId,
                    name: formData.name, description: formData.description || '',
                    start_date: formData.start_date || new Date().toISOString().split('T')[0], end_date: formData.end_date || new Date().toISOString().split('T')[0]
                });
                setActiveProjectId(res.data.project_id);
            } else if (modalType === 'sprint') {
                if (!activeProjectId) return alert('Select or create a project first!');
                await api.post('/sprints/sprints/', {
                    project_id: activeProjectId, team_id: activeTeamId,
                    name: formData.name, description: formData.description || '',
                    start_date: formData.start_date || new Date().toISOString().split('T')[0], end_date: formData.end_date || new Date().toISOString().split('T')[0]
                });
            } else if (modalType === 'task') {
                await api.post('/sprints/sprint-tasks/', {
                    sprint_id: selectedSprintId,
                    assignee: formData.assignee || user.user_id,
                    name: formData.name, description: formData.description || '',
                    status: 'To Do'
                });
            }
            setModalType(null);
            fetchData();
        } catch (err) {
            console.error(`Error creating ${modalType}:`, err);
            alert(`Failed to create ${modalType}`);
        }
    };

    if (loading) return <div className="canvas-loading">Loading Workspace...</div>;

    const activeTeam = teams.find(t => t.team_id === activeTeamId);

    // Auto-select project if there is one for the active team and none is selected
    const teamProjects = projects.filter(p => p.team_id === activeTeamId);
    if (!activeProjectId && teamProjects.length > 0) {
        setActiveProjectId(teamProjects[0].project_id);
    }
    const currentProjectSprints = sprints.filter(s => s.project_id === activeProjectId);

    return (
        <div className="canvas-container">
            {/* Premium Header */}
            <div className="canvas-header">
                <div className="team-selector" onClick={() => activeTeam && setModalType('members')}>
                    {activeTeam ? (
                        <div className="team-name-wrapper">
                            <span className="team-name">{activeTeam.name}</span>
                            <span className="team-members-badge">Members</span>
                        </div>
                    ) : (
                        <div className="team-name-wrapper empty">
                            <span className="no-team-text">No Team Selected</span>
                        </div>
                    )}
                </div>

                {teamProjects.length > 0 && (
                    <div className="project-selector">
                        <span className="project-selector-label">Project:</span>
                        <select
                            value={activeProjectId || ''}
                            onChange={(e) => setActiveProjectId(parseInt(e.target.value))}
                            className="clean-select project-dropdown"
                        >
                            {teamProjects.map(p => (
                                <option key={p.project_id} value={p.project_id}>{p.name}</option>
                            ))}
                        </select>
                    </div>
                )}
            </div>

            <div className="canvas-workspace">
                {teams.length === 0 ? (
                    <div className="empty-state">
                        <h2>Welcome to ManageIT</h2>
                        <p>A clean canvas awaits. Create a Team to get started.</p>
                    </div>
                ) : teamProjects.length === 0 ? (
                    <div className="empty-state">
                        <h2>You have a Team</h2>
                        <p>Now, create your first Project to start organizing work.</p>
                    </div>
                ) : (
                    <div className="sprints-board">
                        {currentProjectSprints.length === 0 ? (
                            <div className="empty-state">
                                <h2>Ready for action</h2>
                                <p>Create a Sprint to start adding tasks.</p>
                            </div>
                        ) : (
                            currentProjectSprints.map(sprint => (
                                <div key={sprint.sprint_id} className="sprint-column">
                                    <div className="sprint-header">
                                        <h3>{sprint.name}</h3>
                                        <div className="sprint-actions">
                                            <button className="add-task-btn" onClick={() => handleCreateTaskForSprint(sprint.sprint_id)} title="Add Task">+</button>
                                            <button className="delete-btn" onClick={() => handleDeleteSprint(sprint.sprint_id)} title="Delete Sprint">×</button>
                                        </div>
                                    </div>
                                    <div className="task-list">
                                        {tasks.filter(t => t.sprint_id === sprint.sprint_id).map(task => {
                                            const statusClass = `status-${(task.status || 'todo').toLowerCase().replace(/\s+/g, '-')}`;
                                            return (
                                                <div key={task.sprint_task_id} className={`task-card ${statusClass}`}>
                                                    <div className="task-header">
                                                        <span className="task-name">{task.name}</span>
                                                        <div className="task-header-actions">
                                                            <select
                                                                className="task-status-select"
                                                                value={task.status || 'To Do'}
                                                                onChange={(e) => handleStatusChange(task.sprint_task_id, e.target.value)}
                                                                onClick={(e) => e.stopPropagation()}
                                                            >
                                                                <option value="To Do">TO DO</option>
                                                                <option value="In Progress">IN PROGRESS</option>
                                                                <option value="Done">DONE</option>
                                                                <option value="Blocked">BLOCKED</option>
                                                            </select>
                                                            <button className="delete-btn-small" onClick={(e) => { e.stopPropagation(); handleDeleteTask(task.sprint_task_id); }} title="Delete Task">×</button>
                                                        </div>
                                                    </div>
                                                    <p className="task-desc">{task.description}</p>
                                                    <div className="task-footer">
                                                        <span className="task-assignee">
                                                            {(() => {
                                                                const u = allUsers.find(u => u.user_id === task.assignee || u.user_id === task.assignee_id);
                                                                return u ? u.name : 'Unassigned';
                                                            })()}
                                                        </span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>

            <FAB onAction={handleAction} hasTeam={teams.length > 0} />

            {/* Universal Creation Modal */}
            <Modal isOpen={!!modalType && modalType !== 'members'} onClose={() => setModalType(null)} title={`Create ${modalType}`}>
                <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <Input label="Name" required value={formData.name || ''} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                    <Input label="Description" value={formData.description || ''} onChange={e => setFormData({ ...formData, description: e.target.value })} />

                    {(modalType === 'project' || modalType === 'sprint') && (
                        <>
                            <Input label="Start Date" type="date" required value={formData.start_date || ''} onChange={e => setFormData({ ...formData, start_date: e.target.value })} />
                            <Input label="End Date" type="date" required value={formData.end_date || ''} onChange={e => setFormData({ ...formData, end_date: e.target.value })} />
                        </>
                    )}

                    {modalType === 'task' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                            <label style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Assign To</label>
                            <select
                                className="clean-select"
                                value={formData.assignee || ''}
                                onChange={e => setFormData({ ...formData, assignee: parseInt(e.target.value) })}
                                required
                            >
                                <option value="">Select team member...</option>
                                {teamMembers.filter(tm => tm.team_id === activeTeamId).map(tm => {
                                    const memberUser = allUsers.find(u => u.user_id === tm.user_id);
                                    if (!memberUser) return null;
                                    return <option key={memberUser.user_id} value={memberUser.user_id}>{memberUser.name}</option>;
                                })}
                            </select>
                        </div>
                    )}
                    <Button type="submit" style={{ marginTop: '1rem' }}>Create</Button>
                </form>
            </Modal>

            {/* Members View Modal */}
            <Modal isOpen={modalType === 'members'} onClose={() => setModalType(null)} title={`${activeTeam?.name} Members`}>
                <div style={{ padding: '0.5rem', color: 'var(--text-secondary)' }}>
                    <ul style={{ marginBottom: '1.5rem', listStyle: 'none', padding: 0 }}>
                        {teamMembers.filter(tm => tm.team_id === activeTeamId).map(tm => {
                            const memberUser = allUsers.find(u => u.user_id === tm.user_id);
                            return (
                                <li key={tm.team_member_id} style={{ padding: '0.8rem', backgroundColor: 'var(--surface-color)', border: '1px solid var(--surface-border)', borderRadius: '8px', marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ color: 'var(--text-primary)', fontWeight: '500' }}>{memberUser?.name || 'Unknown User'}</span>
                                    <span style={{ color: 'var(--primary-color)', fontSize: '0.85rem', fontWeight: '600' }}>{tm.role}</span>
                                </li>
                            );
                        })}
                    </ul>

                    <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.8rem' }}>Add New Member</h4>
                    <form onSubmit={async (e) => {
                        e.preventDefault();
                        if (!formData.newMemberEmail) return alert('Enter an email address!');

                        // Find user by exact email match
                        const targetUser = allUsers.find(u => u.email.toLowerCase() === formData.newMemberEmail.toLowerCase());

                        if (!targetUser) {
                            return alert('No user found with that email address.');
                        }

                        // Check if already a member
                        if (teamMembers.some(tm => tm.team_id === activeTeamId && tm.user_id === targetUser.user_id)) {
                            return alert('This user is already a member of the team.');
                        }

                        try {
                            await api.post('/teams/team-members/', {
                                team_id: activeTeamId,
                                user_id: targetUser.user_id,
                                role: 'Member'
                            });
                            setFormData({ ...formData, newMemberEmail: '' });
                            fetchData();
                            alert('Member added successfully!');
                        } catch (err) {
                            console.error(err);
                            alert("Failed to add member");
                        }
                    }} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-end' }}>
                        <div style={{ flex: 1 }}>
                            <Input
                                label="User Email"
                                type="email"
                                placeholder="name@example.com"
                                value={formData.newMemberEmail || ''}
                                onChange={e => setFormData({ ...formData, newMemberEmail: e.target.value })}
                                required
                            />
                        </div>
                        <Button type="submit">Check & Add</Button>
                    </form>
                </div>
            </Modal>
        </div>
    );
};

export default CanvasView;
