import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import Modal from '../../components/UI/Modal';
import { Trash2, Edit } from 'lucide-react';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'Support Agent' });

  const fetchUsers = async () => {
    const { data } = await api.get('/users');
    setUsers(data);
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleOpenCreate = () => {
    setEditingUser(null);
    setFormData({ name: '', email: '', password: '', role: 'Support Agent' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user) => {
    setEditingUser(user);
    setFormData({ name: user.name, email: user.email, password: '', role: user.role });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingUser) {
      await api.put(`/users/${editingUser._id}`, formData);
    } else {
      await api.post('/users', formData);
    }
    setIsModalOpen(false);
    fetchUsers();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Confirm execution to delete user account registry matching tracking profile link?')) {
      await api.delete(`/users/${id}`);
      fetchUsers();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Identity Management </h1>
          <p className="text-sm text-crm-textMuted">Manage Sub-Admins and Support Agents accounts.</p>
        </div>
        <Button onClick={handleOpenCreate}>+ Deploy New Profile Account</Button>
      </div>

      <div className="bg-crm-card border border-crm-border rounded-xl overflow-hidden shadow-lg">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-crm-bg border-b border-crm-border text-xs text-crm-textMuted uppercase font-semibold">
              <th className="p-4">Profile Name</th>
              <th className="p-4">Electronic Mail Address</th>
              <th className="p-4">Assigned Authority Level</th>
              <th className="p-4 text-right">Operational Executions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-crm-border text-sm">
            {users.map(u => (
              <tr key={u._id} className="hover:bg-crm-border/20 transition-colors">
                <td className="p-4 font-medium">{u.name}</td>
                <td className="p-4 text-crm-textMuted">{u.email}</td>
                <td className="p-4"><span className="bg-crm-border px-2.5 py-1 rounded-md text-xs font-semibold">{u.role}</span></td>
                <td className="p-4 flex gap-3 justify-end">
                  <button onClick={() => handleOpenEdit(u)} className="text-crm-textMuted hover:text-crm-brand"><Edit size={16} /></button>
                  <button onClick={() => handleDelete(u._id)} className="text-crm-textMuted hover:text-rose-400"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingUser ? "Modify Identity Settings Parameters" : "Provision Security Access Account Profile"}>
        <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
          <Input 
            label="Complete Identity Name" 
            name="crm-user-fullname"
            value={formData.name} 
            onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
            required 
          />
          <Input 
            label="Email Registration String" 
            type="email" 
            name="crm-user-new-email"
            autoComplete="off"
            value={formData.email} 
            onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
            required 
          />
          <Input 
            label="Account Password Security Hash" 
            type="password" 
            name="crm-user-new-password"
            autoComplete="new-password"
            value={formData.password} 
            onChange={(e) => setFormData({ ...formData, password: e.target.value })} 
            required={!editingUser} 
            placeholder={editingUser ? "Unchanged unless provided new string parameters..." : ""} 
          />
          
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-crm-textMuted uppercase">Assigned Strategic Role Map</label>
            <select 
              value={formData.role} 
              onChange={(e) => setFormData({ ...formData, role: e.target.value })} 
              className="w-full bg-crm-bg border border-crm-border rounded-lg px-4 py-2.5 text-sm text-white"
            >
              <option value="Sub-Admin">Sub-Admin</option>
              <option value="Support Agent">Support Agent</option>
            </select>
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel Action</Button>
            <Button type="submit">Commit Configuration Settings</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default UserList;