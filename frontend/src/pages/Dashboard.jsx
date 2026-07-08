import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import StatusDistributionChart from '../components/Charts/StatusDistributionChart';
import AgentPerformanceChart from '../components/Charts/AgentPerformanceChart';
import { Layers, Activity, Users2 } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const statsRes = await api.get('/leads/dashboard/stats');
        setStats(statsRes.data);

        if (user.role === 'Super Admin') {
          const logsRes = await api.get('/users/logs');
          setLogs(logsRes.data.slice(0, 10)); 
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [user.role]);

  if (loading) return <div className="text-crm-textMuted animate-pulse">Computing analytics</div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">CRM Overview</h1>
        <p className="text-sm text-crm-textMuted">Real-time tracking operations.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-crm-card border border-crm-border p-6 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-crm-textMuted uppercase">Active Registry Size</p>
            <h3 className="text-3xl font-bold mt-2">{stats?.totalCount}</h3>
          </div>
          <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl"><Layers size={24} /></div>
        </div>
        <div className="bg-crm-card border border-crm-border p-6 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-crm-textMuted uppercase">Deals Won Metric</p>
            <h3 className="text-3xl font-bold mt-2 text-emerald-400">{stats?.statusDistribution?.Won || 0}</h3>
          </div>
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl"><Activity size={24} /></div>
        </div>
        <div className="bg-crm-card border border-crm-border p-6 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-crm-textMuted uppercase">Closed Lost Ratio</p>
            <h3 className="text-3xl font-bold mt-2 text-rose-400">{stats?.statusDistribution?.Lost || 0}</h3>
          </div>
          <div className="p-3 bg-rose-500/10 text-rose-400 rounded-xl"><Users2 size={24} /></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-crm-card border border-crm-border p-6 rounded-xl">
          <h4 className="font-semibold text-sm mb-6 text-crm-textMuted uppercase tracking-wider">Lead  Distribution</h4>
          <StatusDistributionChart dataValues={stats?.statusDistribution || {}} />
        </div>

        {user.role !== 'Support Agent' && (
          <div className="bg-crm-card border border-crm-border p-6 rounded-xl">
            <h4 className="font-semibold text-sm mb-6 text-crm-textMuted uppercase tracking-wider">Agent Conversions Table</h4>
            <AgentPerformanceChart agents={stats?.agentPerformance || []} />
          </div>
        )}
      </div>

      {user.role === 'Super Admin' && (
        <div className="bg-crm-card border border-crm-border rounded-xl overflow-hidden">
          <div className="p-6 border-b border-crm-border">
            <h4 className="font-semibold text-sm text-crm-textMuted uppercase tracking-wider">Recent System Logs</h4>
          </div>
          <div className="divide-y divide-crm-border max-h-96 overflow-y-auto">
            {logs.map(log => (
              <div key={log._id} className="p-4 text-xs flex justify-between items-center hover:bg-crm-border/30">
                <div>
                  <span className="font-bold text-crm-brand uppercase bg-crm-brand/10 px-2 py-0.5 rounded mr-2">{log.action}</span>
                  <span className="text-crm-textMain">{log.details}</span>
                </div>
                <div className="text-right text-crm-textMuted">
                  <p className="font-mono">{log.user?.name} ({log.user?.role})</p>
                  <p>{new Date(log.createdAt).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;