import React from 'react';

const Badge = ({ variant, children, customColor }) => {
  const statusStyles = {
    New: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    Contacted: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    Qualified: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    Lost: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    Won: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  };

  const style = customColor 
    ? { backgroundColor: `${customColor}15`, color: customColor, borderColor: `${customColor}30` }
    : {};

  return (
    <span 
      style={style}
      className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${!customColor ? statusStyles[variant] || 'bg-slate-500/10 text-slate-400 border-slate-500/20' : ''}`}
    >
      {children}
    </span>
  );
};

export default Badge;