
import React from 'react';

interface SectionPanelProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

const SectionPanel: React.FC<SectionPanelProps> = ({ title, children, className }) => {
  return (
    <div className={`bg-zinc-900 border border-zinc-800 rounded-3xl p-6 md:p-8 ${className}`}>
      <h2 className="text-2xl font-bold text-zinc-100 mb-6">{title}</h2>
      <div className="space-y-6">
        {children}
      </div>
    </div>
  );
};

export default SectionPanel;