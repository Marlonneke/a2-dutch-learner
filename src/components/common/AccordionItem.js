import React from 'react';

const AccordionItem = ({ title, children, isOpen, onToggle, headerElementType = 'h2' }) => {
  const HeaderElement = headerElementType;
  const titleId = `accordion-header-${title.replace(/\s+/g, '-').toLowerCase()}`;
  const contentId = `accordion-content-${title.replace(/\s+/g, '-').toLowerCase()}`;

  return (
    <div className="accordion-item">
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
      {isOpen && (
        <div
          className="accordion-content"
          role="region"
          aria-labelledby={titleId}
          id={contentId}
        >
          {children}
        </div>
      )}
    </div>
  );
};

export default AccordionItem;