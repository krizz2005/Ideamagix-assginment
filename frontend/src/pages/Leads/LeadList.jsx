import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import Badge from '../../components/UI/Badge';
import Modal from '../../components/UI/Modal';
import { Filter, UploadCloud, DownloadCloud, Plus, MessageSquare } from 'lucide-react';

const LeadList = () => {
  const { user } = useAuth();
  const [leads, setLeads] = useState([]);
  const [tags, setTags] = useState([]);
  const [agents, setAgents] = useState([]);
  
  // Filtering & Search states
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [assignedAgent, setAssignedAgent] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Modals & Forms states
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);

  const [leadForm, setLeadForm] = useState({ name: '', email: '', phone: '', source: '', status: 'New', assignedTo: '' });
  const [noteText, setNoteText] = useState('');
  const [excelFile, setExcelFile] = useState(null);
  const [exportFields, setExportFields] = useState(['name', 'email', 'phone', 'status', 'source']);

  const fetchLeads = async () => {
    let params = `?search=${search}&status=${status}&tags=${selectedTag}&assignedTo=${assignedAgent}&startDate=${startDate}&endDate=${endDate}`;
    const { data } = await api.get(`/leads${params}`);
    setLeads(data);
  };

  const fetchMetadata = async () => {
    const tagsRes = await api.get('/tags');
    setTags(tagsRes.data);
    if (user.role !== 'Support Agent') {
      const usersRes = await api.get('/users');
      setAgents(usersRes.data.filter(u => u.role === 'Support Agent'));
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchLeads();
    fetchMetadata();
  }, [search, status, selectedTag, assignedAgent, startDate, endDate]);

  const handleOpenCreateLead = () => {
    setSelectedLead(null);
    setLeadForm({ name: '', email: '', phone: '', source: '', status: 'New', assignedTo: '' });
    setIsLeadModalOpen(true);
  };

  const handleOpenEditLead = (lead) => {
    setSelectedLead(lead);
    setLeadForm({ name: lead.name, email: lead.email, phone: lead.phone, source: lead.source, status: lead.status, assignedTo: lead.assignedTo?._id || '' });
    setIsLeadModalOpen(true);
  };

  const handleSaveLead = async (e) => {
    e.preventDefault();
    const payload = { ...leadForm, assignedTo: leadForm.assignedTo || null };
    if (selectedLead) {
      await api.put(`/leads/${selectedLead._id}`, payload);
    } else {
      await api.post('/leads', payload);
    }
    setIsLeadModalOpen(false);
    fetchLeads();
  };

  const handleOpenNoteModal = (lead) => {
    setSelectedLead(lead);
    setNoteText('');
    setIsNoteModalOpen(true);
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    await api.post(`/leads/${selectedLead._id}/notes`, { comment: noteText });
    setIsNoteModalOpen(false);
    fetchLeads();
  };

  const handleImportExcel = async (e) => {
    e.preventDefault();
    if (!excelFile) return;
    const formData = new FormData();
    formData.append('file', excelFile);
    await api.post('/leads/import', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    setIsImportModalOpen(false);
    fetchLeads();
  };

  const handleExportExcel = async () => {
    let params = `?status=${status}&tags=${selectedTag}`;
    const response = await api.post(`/leads/export${params}`, { fields: exportFields }, { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'crm_leads_export.xlsx');
    document.body.appendChild(link);
    link.click();
    setIsExportModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Leads Central Matrix</h1>
          <p className="text-sm text-crm-textMuted">Complete CRUD  control  setup </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          {user.role !== 'Support Agent' && (
            <>
              <Button variant="secondary" onClick={() => setIsImportModalOpen(true)}><UploadCloud size={16} /> Import Sheet</Button>
              <Button variant="secondary" onClick={() => setIsExportModalOpen(true)}><DownloadCloud size={16} /> Export Customized Data</Button>
              <Button onClick={handleOpenCreateLead}><Plus size={16} /> Add Manual Lead</Button>
            </>
          )}
        </div>
      </div>

      {/* Advanced Filtering Strip */}
      <div className="bg-crm-card border border-crm-border p-5 rounded-xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <Input placeholder="Search string..." value={search} onChange={(e) => setSearch(e.target.value)} className="lg:col-span-1" />
        
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="bg-crm-bg border border-crm-border rounded-lg text-sm px-3 py-2 text-crm-textMain">
          <option value="">All  States</option>
          <option value="New">New</option>
          <option value="Contacted">Contacted</option>
          <option value="Qualified">Qualified</option>
          <option value="Lost">Lost</option>
          <option value="Won">Won</option>
        </select>

        <select value={selectedTag} onChange={(e) => setSelectedTag(e.target.value)} className="bg-crm-bg border border-crm-border rounded-lg text-sm px-3 py-2 text-crm-textMain">
          <option value="">Filter Categorization Tags</option>
          {tags.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
        </select>

        {user.role !== 'Support Agent' && (
          <select value={assignedAgent} onChange={(e) => setAssignedAgent(e.target.value)} className="bg-crm-bg border border-crm-border rounded-lg text-sm px-3 py-2 text-crm-textMain">
            <option value="">Assigned Agents</option>
            {agents.map(a => <option key={a._id} value={a._id}>{a.name}</option>)}
          </select>
        )}

        <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
      </div>

      {/* Main Grid View Data Registers */}
      <div className="bg-crm-card border border-crm-border rounded-xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-crm-bg border-b border-crm-border text-xs text-crm-textMuted uppercase font-semibold">
              <th className="p-4">Customer profile</th>
              <th className="p-4">Communications channels</th>
              <th className="p-4">Lead Source</th>
              <th className="p-4">Status</th>
              <th className="p-4">Tracking Tags</th>
              <th className="p-4">Assigned Resource</th>
              <th className="p-4 text-right">Activity logs Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-crm-border text-sm">
            {leads.map(l => (
              <tr key={l._id} className="hover:bg-crm-border/10 transition-colors">
                <td className="p-4 font-semibold hover:text-crm-brand cursor-pointer" onClick={() => handleOpenEditLead(l)}>{l.name}</td>
                <td className="p-4 text-xs font-mono">
                  <p className="text-crm-textMain">{l.email}</p>
                  <p className="text-crm-textMuted mt-0.5">{l.phone}</p>
                </td>
                <td className="p-4 text-crm-textMuted text-xs">{l.source}</td>
                <td className="p-4"><Badge variant={l.status}>{l.status}</Badge></td>
                <td className="p-4 flex gap-1 flex-wrap">
                  {l.tags?.map(t => <Badge key={t._id} customColor={t.color}>{t.name}</Badge>)}
                </td>
                <td className="p-4 text-xs text-slate-300 font-medium">{l.assignedTo?.name || <span className="text-crm-textMuted italic">Unassigned</span>}</td>
                <td className="p-4 text-right">
                  <button onClick={() => handleOpenNoteModal(l)} className="text-crm-textMuted hover:text-crm-brand inline-flex gap-1 items-center bg-crm-bg border border-crm-border px-2 py-1 rounded-md text-xs"><MessageSquare size={12} /> Notes ({l.notes?.length || 0})</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Manual Modals Structure Implementation Sections */}
      <Modal isOpen={isLeadModalOpen} onClose={() => setIsLeadModalOpen(false)} title={selectedLead ? "Modify Lead Record Profiles Layout" : "Log New Intent Customer Target Profile"}>
        <form onSubmit={handleSaveLead} className="space-y-4">
          <Input label="Target Name" value={leadForm.name} onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })} required />
          <Input label="Electronic Mail" type="email" value={leadForm.email} onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })} required />
          <Input label="Phone String Reference" value={leadForm.phone} onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })} required />
          <Input label="Acquisitions Channels Source" value={leadForm.source} onChange={(e) => setLeadForm({ ...leadForm, source: e.target.value })} required />
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-crm-textMuted uppercase">State</label>
              <select value={leadForm.status} onChange={(e) => setLeadForm({ ...leadForm, status: e.target.value })} className="w-full bg-crm-bg border border-crm-border rounded-lg px-3 py-2 text-sm">
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Qualified">Qualified</option>
                <option value="Lost">Lost</option>
                <option value="Won">Won</option>
              </select>
            </div>

            {user.role !== 'Support Agent' && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-crm-textMuted uppercase">Assign Operations Agent</label>
                <select value={leadForm.assignedTo} onChange={(e) => setLeadForm({ ...leadForm, assignedTo: e.target.value })} className="w-full bg-crm-bg border border-crm-border rounded-lg px-3 py-2 text-sm">
                  <option value="">Leave Unassigned</option>
                  {agents.map(a => <option key={a._id} value={a._id}>{a.name}</option>)}
                </select>
              </div>
            )}
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <Button variant="secondary" onClick={() => setIsLeadModalOpen(false)}>Dismiss</Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </Modal>

      {/* Note Addition Pane Sheet */}
      <Modal isOpen={isNoteModalOpen} onClose={() => setIsNoteModalOpen(false)} title={`Workspace interaction timelines history tracking logs: ${selectedLead?.name}`}>
        <div className="space-y-4">
          <div className="space-y-3 max-h-48 overflow-y-auto bg-crm-bg/60 p-3 rounded-lg border border-crm-border">
            {selectedLead?.notes?.map((n, i) => (
              <div key={i} className="text-xs bg-crm-card p-2.5 rounded border border-crm-border">
                <p className="text-crm-textMain">{n.comment}</p>
                <p className="text-[10px] text-crm-textMuted mt-1 font-mono text-right">- {n.createdBy?.name} ({new Date(n.createdAt).toLocaleDateString()})</p>
              </div>
            ))}
            {(!selectedLead?.notes || selectedLead?.notes.length === 0) && <p className="text-xs text-crm-textMuted italic text-center">timeline  registered  activities.</p>}
          </div>

          <form onSubmit={handleAddNote} className="space-y-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-crm-textMuted uppercase">Append Narrative Commentary</label>
              <textarea rows={3} value={noteText} onChange={(e) => setNoteText(e.target.value)} required className="w-full bg-crm-bg border border-crm-border rounded-lg p-3 text-sm focus:outline-none focus:border-crm-brand" placeholder="Log dynamic client response parameters configurations here..." />
            </div>
            <div className="flex justify-end gap-2"><Button variant="secondary" onClick={() => setIsNoteModalOpen(false)}>Close</Button><Button type="submit">Commit Annotation</Button></div>
          </form>
        </div>
      </Modal>

      {/* Bulk Upload Spreadsheet sheet */}
      <Modal isOpen={isImportModalOpen} onClose={() => setIsImportModalOpen(false)} title="Bulk Pipeline Processing Engine">
        <form onSubmit={handleImportExcel} className="space-y-4">
          <div className="border-2 border-dashed border-crm-border hover:border-crm-brand rounded-xl p-8 flex flex-col items-center justify-center bg-crm-bg/40 cursor-pointer transition-colors relative">
            <input type="file" accept=".xlsx, .xls" onChange={(e) => setExcelFile(e.target.files[0])} required className="absolute inset-0 opacity-0 cursor-pointer" />
            <p className="text-sm font-semibold text-center">{excelFile ? excelFile.name : "Select structured customer registry data records (.xlsx)"}</p>
            <p className="text-xs text-crm-textMuted mt-1 text-center">Data headers must parse across tracking matrices.</p>
          </div>
          <div className="flex justify-end gap-2"><Button variant="secondary" onClick={() => setIsImportModalOpen(false)}>Abort</Button><Button type="submit">Execute Import Parse</Button></div>
        </form>
      </Modal>

      {/* Customized Excel Configurable Export Matrix Modal */}
      <Modal isOpen={isExportModalOpen} onClose={() => setIsExportModalOpen(false)} title="Configure Report Extraction Pipeline">
        <div className="space-y-4">
          <p className="text-xs text-crm-textMuted">Select the specific data fields to include in the generated Excel sheet:</p>
          <div className="grid grid-cols-2 gap-3 p-3 bg-crm-bg/50 rounded-lg border border-crm-border">
            {['name', 'email', 'phone', 'status', 'source', 'agent', 'tags'].map(f => (
              <label key={f} className="flex items-center gap-2 text-xs font-medium capitalize cursor-pointer">
                <input type="checkbox" checked={exportFields.includes(f)} onChange={(e) => {
                  if (e.target.checked) setExportFields([...exportFields, f]);
                  else setExportFields(exportFields.filter(field => field !== f));
                }} className="rounded border-crm-border bg-crm-bg text-crm-brand focus:ring-0" />
                {f === 'agent' ? 'Assigned Agent' : f}
              </label>
            ))}
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setIsExportModalOpen(false)}>Cancel</Button>
            <Button onClick={handleExportExcel}><DownloadCloud size={16} /> Generate spreadsheet reports</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default LeadList;