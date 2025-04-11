import React, { useState } from 'react';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import Card from '../common/Card';
import Dropdown from '../common/Dropdown';

/**
 * RevenueChart component for displaying financial charts
 * @param {Object} props - Component props
 * @param {Array} props.data - Chart data
 * @param {string} props.title - Chart title
 * @param {string} props.className - Additional CSS classes
 * @param {Array} props.periodOptions - Options for period selector
 * @param {string} props.defaultPeriod - Default selected period
 * @param {string} props.defaultView - Default chart view (line or bar)
 */
const RevenueChart = ({
  data = [],
  title = 'Revenue Overview',
  className = '',
  periodOptions = [
    { value: 'week', label: 'Last 7 Days' },
    { value: 'month', label: 'Last 30 Days' },
    { value: 'quarter', label: 'Last 3 Months' },
    { value: 'year', label: 'Last 12 Months' }
  ],
  defaultPeriod = 'month',
  defaultView = 'line'
}) => {
  const [period, setPeriod] = useState(defaultPeriod);
  const [chartView, setChartView] = useState(defaultView);
  
  // Handle period change
  const handlePeriodChange = (value) => {
    setPeriod(value);
  };
  
  // Handle view change
  const handleViewChange = (value) => {
    setChartView(value);
  };
  
  // Chart view options
  const viewOptions = [
    { value: 'line', label: 'Line Chart' },
    { value: 'bar', label: 'Bar Chart' }
  ];
  
  // Filter data based on selected period
  const filteredData = data;
  
  // Format currency for tooltip
  const formatCurrency = (value) => {
    return `RM ${value.toLocaleString()}`;
  };
  
  // Custom tooltip formatter
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border shadow rounded">
          <p className="font-medium text-gray-900">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    
    return null;
  };
  
  return (
    <Card 
      title={title}
      className={className}
      titleAction={
        <div className="flex items-center space-x-2">
          <Dropdown
            options={viewOptions}
            value={chartView}
            onChange={handleViewChange}
            size="sm"
            variant="outline"
          />
          <Dropdown
            options={periodOptions}
            value={period}
            onChange={handlePeriodChange}
            size="sm"
            variant="outline"
          />
        </div>
      }
    >
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          {chartView === 'line' ? (
            <LineChart
              data={filteredData}
              margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={formatCurrency} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#3b82f6"
                strokeWidth={2}
                activeDot={{ r: 6 }}
                name="Revenue"
              />
              <Line
                type="monotone"
                dataKey="cost"
                stroke="#ef4444"
                strokeWidth={2}
                activeDot={{ r: 6 }}
                name="Cost"
              />
              <Line
                type="monotone"
                dataKey="profit"
                stroke="#10b981"
                strokeWidth={2}
                activeDot={{ r: 6 }}
                name="Profit"
              />
            </LineChart>
          ) : (
            <BarChart
              data={filteredData}
              margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={formatCurrency} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="revenue" fill="#3b82f6" name="Revenue" />
              <Bar dataKey="cost" fill="#ef4444" name="Cost" />
              <Bar dataKey="profit" fill="#10b981" name="Profit" />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
      
      {data.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70">
          <p className="text-gray-500">No data available</p>
        </div>
      )}
    </Card>
  );
};

export default RevenueChart;