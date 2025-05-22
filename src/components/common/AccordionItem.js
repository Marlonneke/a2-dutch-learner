import React from 'react';

const AccordionItem = ({ title, children, isOpen, onToggle, headerElementType = 'h2' }) => {
  const HeaderElement = headerElementType;
  const titleId = `accordion-header-${(title || '').toString().replace(/\s+/g, '-').toLowerCase()}`;
  const contentId = `accordion-content-${(title || '').toString().replace(/\s+/g, '-').toLowerCase()}`;

  return (
    // ADD "open" CLASS HERE BASED ON isOpen PROP
    <div className={`accordion-item ${isOpen ? 'open' : ''}`}> 
      <HeaderElement
        className="accordion-title"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={contentId}
        id={titleId}
      >
        <span>{title}</span>
        <span className={`accordion-icon ${isOpen ? 'open' : 'closed'}`}>
          {isOpen ? '▲' : '▼'}
        </span>
      </HeaderElement>
      {/* Content is always in DOM; visibility controlled by CSS max-height/opacity */}
      <div
        className="accordion-content"
        role="region"
        aria-labelledby={titleId}
        id={contentId}
        // Add hidden attribute for better accessibility when closed
        // though CSS opacity/max-height handles visual
        hidden={!isOpen} 
      >
        {children}
      </div>
    </div>
  );
};

export default AccordionItem;