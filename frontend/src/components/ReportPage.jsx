import React from 'react';
import ReportCard from './ReportCard';
import '../pages/admin/Admin.css';

const ReportPage = ({ title, loading, error, data, renderItem, searchForm }) => {
  return (
    <div className="admin-page">
      <h1>{title}</h1>
      {searchForm && <div className="search-form">{searchForm}</div>}
      {loading && <div className="text-center">Loading...</div>}
      {error && <div className="text-center text-red-500">Error: {error}</div>}
      {data && data.length > 0 ? (
        <div className="report-grid">
          {data.map((item, index) => (
            <ReportCard key={index}>
              {renderItem(item)}
            </ReportCard>
          ))}
        </div>
      ) : (
        !loading && <div className="text-center">No data available.</div>
      )}
    </div>
  );
};

export default ReportPage;
