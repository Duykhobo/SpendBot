import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface ExpenseChartProps {
  data: { name: string; value: number }[];
}

const COLORS = ['#22C55E', '#3B82F6', '#F59E0B', '#EC4899', '#8B5CF6'];

const ExpenseChart: React.FC<ExpenseChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)' }}>Chưa có dữ liệu chi tiêu</div>;
  }

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
            animationDuration={1000}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'var(--glass-bg)', 
              backdropFilter: 'blur(10px)',
              borderColor: 'rgba(255,255,255,0.1)',
              borderRadius: '8px',
              color: '#fff'
            }} 
            itemStyle={{ color: '#fff' }}
          />
          <Legend wrapperStyle={{ color: 'var(--color-text-muted)' }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ExpenseChart;
