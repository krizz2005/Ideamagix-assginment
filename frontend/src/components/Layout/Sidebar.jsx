import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, Users, Layers, ShieldCheck, LogOut } from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useAuth();

  const links = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard, roles: ['Super Admin', 'Sub-Admin', 'Support Agent'] },
    { to: '/leads', label: 'Leads Registry', icon: Layers, roles: ['Super Admin', 'Sub-Admin', 'Support Agent'] },
    { to: '/users', label: 'Team Accounts', icon: Users, roles: ['Super Admin'] },
  ];

  return (
    <aside className="w-64 bg-crm-card border-r border-crm-border flex flex-col justify-between h-screen sticky top-0">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8 px-2">
          <div className="bg-crm-brand p-2 rounded-lg text-white">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h2 className="font-bold text-lg tracking-tight">IDEAMAGIX</h2>
            <p className="text-xs text-crm-textMuted font-mono">{user?.role}</p>
          </div>
        </div>

        <nav className="space-y-1">
          {links.map((link) => {
            if (!link.roles.includes(user?.role)) return null;
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-crm-brand text-white shadow-lg shadow-crm-brand/20'
                      : 'text-crm-textMuted hover:bg-crm-border hover:text-crm-textMain'
                  }`
                }
              >
                <Icon size={18} />
                {link.label}
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-crm-border space-y-3">
        <div className="px-4 py-2 bg-crm-bg/50 rounded-lg">
          <p className="text-xs text-crm-textMuted">Logged in as</p>
          <p className="text-sm font-semibold truncate">{user?.name}</p>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-rose-400 hover:bg-rose-500/10 transition-all"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;