
import React from 'react';

interface SectionPanelProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

const SectionPanel: React.FC<SectionPanelProps> = ({ title, children, className }) => {
  return (
    <div className={`bg-slate-800/60 backdrop-blur-lg border border-slate-700/50 rounded-xl shadow-2xl p-6 ${className}`}>
      <h2 className="text-2xl font-semibold text-red-400 mb-4 border-b border-slate-700 pb-2">{title}</h2>
      {children}
    </div>
  );
};

export default SectionPanel;
