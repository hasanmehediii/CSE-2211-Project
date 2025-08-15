import React from 'react';
import '../pages/admin/Admin.css';

const ReportCard = ({ children }) => {
  return (
    <div className="report-card">
      {children}
    </div>
  );
};

export default ReportCard;
