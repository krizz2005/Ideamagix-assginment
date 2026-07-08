const Lead = require('../models/Lead');
const Tag = require('../models/Tag');
const User = require('../models/User');
const { parseExcelToJSON } = require('../utils/excelHelper');
const logActivity = require('../utils/logger');
const xlsx = require('xlsx');


const getLeads = async (req, res) => {
  try {
    let query = {};

   
    if (req.user.role === 'Support Agent') {
      query.assignedTo = req.user._id;
    } else if (req.query.assignedTo) {
      query.assignedTo = req.query.assignedTo;
    }

    
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      query.$or = [{ name: searchRegex }, { email: searchRegex }, { phone: searchRegex }];
    }

    
    if (req.query.status) query.status = req.query.status;

    if (req.query.tags) {
      const tagIds = req.query.tags.split(',');
      query.tags = { $in: tagIds };
    }

    
    if (req.query.startDate && req.query.endDate) {
      query.createdAt = {
        $gte: new Date(req.query.startDate),
        $lte: new Date(req.query.endDate)
      };
    }

    const leads = await Lead.find(query)
      .populate('tags')
      .populate('assignedTo', 'name email role')
      .populate('notes.createdBy', 'name role')
      .sort({ updatedAt: -1 });

    res.json(leads);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const createLead = async (req, res) => {
  try {
    const newLead = new Lead(req.body);
    const savedLead = await newLead.save();
    await logActivity(req.user._id, 'LEAD_CREATION', `Manually logged a new lead profile structure matching: ${savedLead.email}`, req);
    res.status(201).json(savedLead);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const updateLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ message: 'Target profile record not found' });

   
    if (req.user.role === 'Support Agent' && lead.assignedTo?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access Denied. This profile is not assigned to your tracking profile layout.' });
    }

    const updated = await Lead.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate('tags')
      .populate('assignedTo', 'name email');

    await logActivity(req.user._id, 'LEAD_UPDATE', `Modified field profile vectors configuration tracking structural ID: ${req.params.id}`, req);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const deleteLead = async (req, res) => {
  try {
    if (req.user.role === 'Support Agent') return res.status(403).json({ message: 'Action restricted to Management profiles.' });

    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ message: 'Lead target entry missing' });

    await Lead.findByIdAndDelete(req.params.id);
    await logActivity(req.user._id, 'LEAD_DELETION', `Dropped lead profile index parameters: ${req.params.id}`, req);
    res.json({ message: 'Lead record dropped clean' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const addLeadNote = async (req, res) => {
  const { comment } = req.body;
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ message: 'Lead data map profile structural failure' });

    lead.notes.push({ comment, createdBy: req.user._id });
    await lead.save();

    const refreshedLead = await Lead.findById(req.params.id)
      .populate('notes.createdBy', 'name role')
      .populate('tags')
      .populate('assignedTo', 'name email');

    res.status(201).json(refreshedLead);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const importLeadsExcel = async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'Missing target file attachment upload payload' });

  try {
    const dataRows = parseExcelToJSON(req.file.buffer);
    const validLeads = [];

    for (const row of dataRows) {
      if (row.Name && (row.Email || row.Phone)) {
        validLeads.push({
          name: row.Name,
          email: row.Email || 'N/A',
          phone: row.Phone ? String(row.Phone) : 'N/A',
          source: row.Source || 'Excel Bulk Import',
          status: row.Status || 'New'
        });
      }
    }

    if (validLeads.length === 0) return res.status(400).json({ message: 'Zero valid records extracted from spreadsheet structure.' });

    await Lead.insertMany(validLeads);
    await logActivity(req.user._id, 'BULK_IMPORT', `Bulk inserted ${validLeads.length} leads data configurations using file streaming helpers`, req);

    res.status(201).json({ message: `Bulk import completed successfully. Inserted counts: ${validLeads.length}` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const exportLeadsExcel = async (req, res) => {
  const { filters, fields } = req.body;
  try {
    let query = {};
    if (req.user.role === 'Support Agent') query.assignedTo = req.user._id;
    if (filters?.status) query.status = filters.status;
    if (filters?.tags) query.tags = { $in: filters.tags.split(',') };

    const rawData = await Lead.find(query).populate('assignedTo', 'name').populate('tags', 'name');

    const serializedRows = rawData.map(item => {
      let row = {};
      if (fields.includes('name')) row['Name'] = item.name;
      if (fields.includes('email')) row['Email'] = item.email;
      if (fields.includes('phone')) row['Phone'] = item.phone;
      if (fields.includes('source')) row['Source'] = item.source;
      if (fields.includes('status')) row['Status'] = item.status;
      if (fields.includes('agent')) row['Assigned Agent'] = item.assignedTo ? item.assignedTo.name : 'Unassigned';
      if (fields.includes('tags')) row['Tags'] = item.tags.map(t => t.name).join(', ');
      return row;
    });

    const worksheet = xlsx.utils.json_to_sheet(serializedRows);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Filtered Leads');
    
    const binaryBuffer = xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=leads_export.xlsx');
    res.send(binaryBuffer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getDashboardStats = async (req, res) => {
  try {
    let contextScope = {};
    if (req.user.role === 'Support Agent') contextScope.assignedTo = req.user._id;

    
    const totalCount = await Lead.countDocuments(contextScope);

    
    const statusAgg = await Lead.aggregate([
      { $match: contextScope },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    const statusMap = { New: 0, Contacted: 0, Qualified: 0, Lost: 0, Won: 0 };
    statusAgg.forEach(item => { if (statusMap[item._id] !== undefined) statusMap[item._id] = item.count; });

    
    let agentPerformance = [];
    if (req.user.role !== 'Support Agent') {
      agentPerformance = await Lead.aggregate([
        { $match: { assignedTo: { $ne: null } } },
        { $group: { 
            _id: '$assignedTo', 
            totalAssigned: { $sum: 1 },
            wonCount: { $sum: { $cond: [{ $eq: ['$status', 'Won'] }, 1, 0] } }
          }
        },
        { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'agentDetails' } },
        { $unwind: '$agentDetails' },
        { $project: { name: '$agentDetails.name', totalAssigned: 1, wonCount: 1 } },
        { $sort: { wonCount: -1 } }
      ]);
    }

    res.json({
      totalCount,
      statusDistribution: statusMap,
      agentPerformance
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { 
  getLeads, createLead, updateLead, deleteLead, 
  addLeadNote, importLeadsExcel, exportLeadsExcel, getDashboardStats 
};