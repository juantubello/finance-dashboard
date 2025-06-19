import React from 'react';
import SyncButton from './SyncButton';

const SyncSection = ({ title, buttons }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-700 border-b pb-2">{title}</h3>
      {buttons.map((button, index) => (
        <SyncButton
          key={index}
          onClick={button.onClick}
          disabled={button.disabled}
          icon={button.icon}
          iconColor={button.iconColor}
          hoverColor={button.hoverColor}
        >
          {button.label}
        </SyncButton>
      ))}
    </div>
  );
};

export default SyncSection;