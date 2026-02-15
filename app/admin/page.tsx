"use client";

import Image from "next/image";
import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';

interface Contact {
    _id: string;
    fullName: string;
    companyName?: string;
    email: string;
    projectType?: string;
    message: string;
    status: 'new' | 'read' | 'replied';
    createdAt: string;
}

interface Project {
    _id: string;
    title: string;
    description: string;
    category: string;
    image?: string;
    technologies?: string[];
    link?: string;
    status: 'active' | 'completed' | 'in-progress';
    createdAt: string;
}

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState<'contacts' | 'projects'>('contacts');
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [showProjectForm, setShowProjectForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [newProject, setNewProject] = useState({
        title: '',
        description: '',
        category: '',
        image: '',
        technologies: '',
        link: '',
        status: 'active' as 'active' | 'completed' | 'in-progress'
    });

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            if (activeTab === 'contacts') {
                const res = await fetch('/api/contacts');
                const data = await res.json();
                if (data.success) {
                    setContacts(data.data);
                }
            } else {
                const res = await fetch('/api/projects');
                const data = await res.json();
                if (data.success) {
                    setProjects(data.data);
                }
            }
        } catch {
            toast.error('Failed to load data');
        } finally {
            setLoading(false);
        }
    }, [activeTab]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const updateContactStatus = async (id: string, status: 'new' | 'read' | 'replied') => {
        try {
            const res = await fetch(`/api/contacts/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });
            const data = await res.json();
            if (data.success) {
                toast.success('Status updated');
                fetchData();
            }
        } catch {
            toast.error('Failed to update status');
        }
    };

    const deleteContact = async (id: string) => {
        if (!confirm('Are you sure you want to delete this contact?')) return;

        try {
            const res = await fetch(`/api/contacts/${id}`, { method: 'DELETE' });
            const data = await res.json();
            if (data.success) {
                toast.success('Contact deleted');
                fetchData();
            }
        } catch {
            toast.error('Failed to delete contact');
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) { // 2MB limit
                toast.error('Image size should be less than 2MB');
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewProject({ ...newProject, image: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleProjectSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const projectData = {
                ...newProject,
                technologies: newProject.technologies.split(',').map(t => t.trim()).filter(t => t)
            };

            let res;
            if (editingId) {
                res = await fetch(`/api/projects/${editingId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(projectData)
                });
            } else {
                res = await fetch('/api/projects', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(projectData)
                });
            }

            const data = await res.json();
            if (data.success) {
                toast.success(editingId ? 'Project updated successfully' : 'Project added successfully');
                setShowProjectForm(false);
                setEditingId(null);
                setNewProject({
                    title: '',
                    description: '',
                    category: '',
                    image: '',
                    technologies: '',
                    link: '',
                    status: 'active'
                });
                fetchData();
            }
        } catch {
            toast.error(editingId ? 'Failed to update project' : 'Failed to add project');
        }
    };

    const handleEdit = (project: Project) => {
        setEditingId(project._id);
        setNewProject({
            title: project.title,
            description: project.description,
            category: project.category,
            image: project.image || '',
            technologies: project.technologies ? project.technologies.join(', ') : '',
            link: project.link || '',
            status: project.status
        });
        setShowProjectForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const resetForm = () => {
        setShowProjectForm(false);
        setEditingId(null);
        setNewProject({
            title: '',
            description: '',
            category: '',
            image: '',
            technologies: '',
            link: '',
            status: 'active'
        });
    };

    const deleteProject = async (id: string) => {
        if (!confirm('Are you sure you want to delete this project?')) return;

        try {
            const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
            const data = await res.json();
            if (data.success) {
                toast.success('Project deleted');
                fetchData();
            }
        } catch {
            toast.error('Failed to delete project');
        }
    };

    return (
        <div className="min-h-screen bg-brand-bg text-white">
            <Toaster />

            {/* Header */}
            <div className="bg-gradient-to-r from-brand-bg via-brand-accent/10 to-brand-bg border-b border-brand-accent/20">
                <div className="max-w-7xl mx-auto px-6 py-8">
                    <h1 className="text-4xl font-bold text-brand-accent mb-2">Admin Dashboard</h1>
                    <p className="text-slate-400">Manage your projects and contact messages</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="max-w-7xl mx-auto px-6 py-6">
                <div className="flex gap-4 mb-8">
                    <button
                        onClick={() => setActiveTab('contacts')}
                        className={`px-6 py-3 rounded-twelve font-bold transition-all ${activeTab === 'contacts'
                            ? 'bg-brand-accent text-brand-bg shadow-lg shadow-brand-accent/20'
                            : 'bg-white/5 text-slate-400 hover:bg-white/10'
                            }`}
                    >
                        Contact Messages
                    </button>
                    <button
                        onClick={() => setActiveTab('projects')}
                        className={`px-6 py-3 rounded-twelve font-bold transition-all ${activeTab === 'projects'
                            ? 'bg-brand-accent text-brand-bg shadow-lg shadow-brand-accent/20'
                            : 'bg-white/5 text-slate-400 hover:bg-white/10'
                            }`}
                    >
                        Projects
                    </button>
                </div>

                {/* Content */}
                {loading ? (
                    <div className="text-center py-20">
                        <div className="inline-block w-12 h-12 border-4 border-brand-accent/30 border-t-brand-accent rounded-full animate-spin"></div>
                    </div>
                ) : activeTab === 'contacts' ? (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold">Contact Messages ({contacts.length})</h2>
                        </div>

                        {contacts.length === 0 ? (
                            <div className="text-center py-20 text-slate-400">
                                <p className="text-xl">No contact messages yet</p>
                            </div>
                        ) : (
                            contacts.map((contact) => (
                                <motion.div
                                    key={contact._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="glass-morphism p-6 rounded-twelve border border-white/10"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-xl font-bold text-brand-accent">{contact.fullName}</h3>
                                            {contact.companyName && (
                                                <p className="text-slate-400">{contact.companyName}</p>
                                            )}
                                        </div>
                                        <div className="flex gap-2">
                                            <select
                                                value={contact.status}
                                                onChange={(e) => updateContactStatus(contact._id, e.target.value as "new" | "read" | "replied")}
                                                className="bg-brand-bg border border-white/20 rounded-lg px-3 py-1 text-sm"
                                            >
                                                <option value="new">New</option>
                                                <option value="read">Read</option>
                                                <option value="replied">Replied</option>
                                            </select>
                                            <button
                                                onClick={() => deleteContact(contact._id)}
                                                className="px-3 py-1 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all text-sm"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                                        <div>
                                            <span className="text-slate-500">Email:</span>
                                            <p className="text-slate-200">{contact.email}</p>
                                        </div>
                                        {contact.projectType && (
                                            <div>
                                                <span className="text-slate-500">Project Type:</span>
                                                <p className="text-slate-200">{contact.projectType}</p>
                                            </div>
                                        )}
                                        <div>
                                            <span className="text-slate-500">Date:</span>
                                            <p className="text-slate-200">
                                                {new Date(contact.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div>
                                            <span className="text-slate-500">Status:</span>
                                            <p className={`inline-block px-2 py-1 rounded text-xs font-bold ${contact.status === 'new' ? 'bg-green-500/20 text-green-400' :
                                                contact.status === 'read' ? 'bg-yellow-500/20 text-yellow-400' :
                                                    'bg-blue-500/20 text-blue-400'
                                                }`}>
                                                {contact.status.toUpperCase()}
                                            </p>
                                        </div>
                                    </div>

                                    <div>
                                        <span className="text-slate-500 text-sm">Message:</span>
                                        <p className="text-slate-200 mt-2 p-4 bg-white/5 rounded-lg">
                                            {contact.message}
                                        </p>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold">Projects ({projects.length})</h2>
                            <button
                                onClick={() => showProjectForm ? resetForm() : setShowProjectForm(true)}
                                className="px-6 py-3 bg-brand-accent text-brand-bg font-bold rounded-twelve hover:shadow-lg hover:shadow-brand-accent/20 transition-all"
                            >
                                {showProjectForm ? 'Cancel' : '+ Add Project'}
                            </button>
                        </div>

                        {showProjectForm && (
                            <motion.form
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                onSubmit={handleProjectSubmit}
                                className="glass-morphism p-6 rounded-twelve border border-brand-accent/20 mb-6"
                            >
                                <h3 className="text-xl font-bold mb-4 text-brand-accent">{editingId ? 'Edit Project' : 'Add New Project'}</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        placeholder="Project Title"
                                        value={newProject.title}
                                        onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                                        required
                                        className="bg-brand-bg/50 border border-white/10 rounded-lg px-4 py-3 text-slate-200"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Category"
                                        value={newProject.category}
                                        onChange={(e) => setNewProject({ ...newProject, category: e.target.value })}
                                        required
                                        className="bg-brand-bg/50 border border-white/10 rounded-lg px-4 py-3 text-slate-200"
                                    />
                                    <div className="md:col-span-2">
                                        <input
                                            type="text"
                                            placeholder="Live Demo Link"
                                            value={newProject.link}
                                            onChange={(e) => setNewProject({ ...newProject, link: e.target.value })}
                                            className="w-full bg-brand-bg/50 border border-white/10 rounded-lg px-4 py-3 text-slate-200"
                                        />
                                    </div>
                                    <div className="col-span-1 md:col-span-2 space-y-2">
                                        <label className="text-sm text-slate-400">Project Image</label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="block w-full text-sm text-slate-400
                                                file:mr-4 file:py-2 file:px-4
                                                file:rounded-full file:border-0
                                                file:text-sm file:font-semibold
                                                file:bg-brand-accent/10 file:text-brand-accent
                                                hover:file:bg-brand-accent/20
                                                bg-brand-bg/50 border border-white/10 rounded-lg p-2"
                                        />
                                        {newProject.image && (
                                            <div className="mt-2 relative h-32 w-full md:w-48 rounded-lg overflow-hidden border border-white/10 group">
                                                <Image
                                                    src={newProject.image}
                                                    alt="Preview"
                                                    fill
                                                    className="object-cover"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setNewProject({ ...newProject, image: '' })}
                                                    className="absolute top-2 right-2 bg-red-500/80 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Technologies (comma separated)"
                                        value={newProject.technologies}
                                        onChange={(e) => setNewProject({ ...newProject, technologies: e.target.value })}
                                        className="bg-brand-bg/50 border border-white/10 rounded-lg px-4 py-3 text-slate-200"
                                    />
                                    <select
                                        value={newProject.status}
                                        onChange={(e) => setNewProject({ ...newProject, status: e.target.value as "active" | "completed" | "in-progress" })}
                                        className="bg-brand-bg/50 border border-white/10 rounded-lg px-4 py-3 text-slate-200"
                                    >
                                        <option value="active">Active</option>
                                        <option value="in-progress">In Progress</option>
                                        <option value="completed">Completed</option>
                                    </select>
                                </div>
                                <textarea
                                    placeholder="Project Description"
                                    value={newProject.description}
                                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                                    required
                                    rows={4}
                                    className="w-full mt-4 bg-brand-bg/50 border border-white/10 rounded-lg px-4 py-3 text-slate-200"
                                />
                                <button
                                    type="submit"
                                    className="mt-4 px-6 py-3 bg-brand-accent text-brand-bg font-bold rounded-lg hover:shadow-lg transition-all"
                                >
                                    {editingId ? 'Update Project' : 'Add Project'}
                                </button>
                            </motion.form>
                        )
                        }

                        {
                            projects.length === 0 ? (
                                <div className="text-center py-20 text-slate-400">
                                    <p className="text-xl">No projects yet</p>
                                    <p className="mt-2">Click &quot;Add Project&quot; to create your first project</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {projects.map((project) => (
                                        <motion.div
                                            key={project._id}
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="glass-morphism p-6 rounded-twelve border border-white/10"
                                        >
                                            {project.image && (
                                                <div className="relative w-full h-48 mb-4">
                                                    <Image
                                                        src={project.image}
                                                        alt={project.title}
                                                        fill
                                                        className="object-cover rounded-lg"
                                                    />
                                                </div>
                                            )}
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="text-xl font-bold text-brand-accent">{project.title}</h3>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleEdit(project)}
                                                        className="px-3 py-1 bg-brand-accent/20 text-brand-accent rounded-lg hover:bg-brand-accent/30 transition-all text-sm"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => deleteProject(project._id)}
                                                        className="px-3 py-1 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all text-sm"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                            <p className="text-sm text-slate-400 mb-3">{project.category}</p>
                                            <p className="text-slate-300 mb-4">{project.description}</p>
                                            {project.technologies && project.technologies.length > 0 && (
                                                <div className="flex flex-wrap gap-2 mb-4">
                                                    {project.technologies.map((tech, idx) => (
                                                        <span
                                                            key={idx}
                                                            className="px-2 py-1 bg-brand-accent/20 text-brand-accent rounded text-xs font-bold"
                                                        >
                                                            {tech}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                            <div className="flex justify-between items-center text-sm">
                                                <span className={`px-3 py-1 rounded font-bold ${project.status === 'active' ? 'bg-green-500/20 text-green-400' :
                                                    project.status === 'in-progress' ? 'bg-yellow-500/20 text-yellow-400' :
                                                        'bg-blue-500/20 text-blue-400'
                                                    }`}>
                                                    {project.status.toUpperCase()}
                                                </span>
                                                <span className="text-slate-500">
                                                    {new Date(project.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )
                        }
                    </div >
                )}
            </div >
        </div >
    );
}
