import React from 'react';

const Button = ({ children, variant = 'primary', onClick, type = 'button', disabled = false, className = '' }) => {
  const base = 'px-4 py-2 rounded-lg text-sm font-medium transition-all focus:outline-none flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const themes = {
    primary: 'bg-crm-brand text-white hover:bg-crm-brandHover shadow-md shadow-crm-brand/10',
    secondary: 'bg-crm-border text-crm-textMain hover:bg-slate-800 border border-crm-border',
    danger: 'bg-rose-600 text-white hover:bg-rose-700 shadow-md shadow-rose-600/10'
  };

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`${base} ${themes[variant]} ${className}`}>
      {children}
    </button>
  );
};

export default Button;