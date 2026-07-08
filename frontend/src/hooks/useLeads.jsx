import { useState, useEffect } from 'react';
import api from '../services/api';

export const useLeads = (filters) => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  
  const fetchLeads = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        search: filters.search || '',
        status: filters.status || '',
        tags: filters.selectedTag || '',
        assignedTo: filters.assignedAgent || '',
        startDate: filters.startDate || '',
        endDate: filters.endDate || ''
      }).toString();

      const { data } = await api.get(`/leads?${params}`);
      setLeads(data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Error processing pipelines data');
    } finally {
      setLoading(false);
    }
  };

 
  useEffect(() => {
    fetchLeads();
  }, [filters.search, filters.status, filters.selectedTag, filters.assignedAgent, filters.startDate, filters.endDate]);

  const addLead = async (leadData) => {
    await api.post('/leads', leadData);
    await fetchLeads();
  };

  const updateLead = async (id, leadData) => {
    await api.put(`/leads/${id}`, leadData);
    await fetchLeads();
  };

  const deleteLead = async (id) => {
    await api.delete(`/leads/${id}`);
    await fetchLeads();
  };

  const appendNote = async (leadId, comment) => {
    await api.post(`/leads/${leadId}/notes`, { comment });
    await fetchLeads();
  };

  return {
    leads,
    loading,
    error,
    refreshLeads: fetchLeads,
    addLead,
    updateLead,
    deleteLead,
    appendNote
  };
};