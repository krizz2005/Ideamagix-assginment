import React from 'react';

const Input = ({ label, type = 'text', value, onChange, placeholder, className = '', ...rest }) => {
  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && <label className="text-xs font-semibold text-crm-textMuted uppercase tracking-wider">{label}</label>}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        {...rest} 
        className="w-full bg-crm-bg border border-crm-border rounded-lg px-4 py-2.5 text-sm text-crm-textMain focus:outline-none focus:border-crm-brand transition-colors placeholder:text-crm-textMuted/60"
      />
    </div>
  );
};

export default Input;