import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import ExpenseChart from '../components/ExpenseChart';
import api from '../services/api';
import { useAuthStore } from '../store/useAuthStore';

const Dashboard: React.FC = () => {
  const { user } = useAuthStore();
  const [expenses, setExpenses] = useState<any[]>([]);
  const [reminders, setReminders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [expRes, remRes] = await Promise.all([
          api.get('/expenses'),
          api.get('/reminders')
        ]);
        
        if (expRes.data.success) {
          setExpenses(expRes.data.data);
        }
        if (remRes.data.success) {
          setReminders(remRes.data.data);
        }
      } catch (error) {
        console.error('Lỗi khi fetch dữ liệu dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Tiền xử lý dữ liệu cho biểu đồ
  const chartData = expenses.reduce((acc: any[], curr: any) => {
    const existing = acc.find(item => item.name === curr.category);
    if (existing) {
      existing.value += curr.amount;
    } else {
      acc.push({ name: curr.category, value: curr.amount });
    }
    return acc;
  }, []);

  const totalExpense = expenses.reduce((sum, item) => sum + item.amount, 0);

  if (loading) {
    return (
      <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        <Header />
        <div style={{ textAlign: 'center', color: 'var(--color-text-muted)', marginTop: '4rem' }}>
          Đang tải dữ liệu...
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
      <Header />
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '2rem'
      }}>
        
        {/* Card 1: Tổng quan */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h3 style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem', marginBottom: '0.5rem', fontWeight: 500 }}>
            Tổng chi tiêu
          </h3>
          <p style={{ fontSize: '3rem', fontWeight: 700, color: 'var(--color-text)', margin: 0 }}>
            {totalExpense.toLocaleString('vi-VN')} đ
          </p>
          <div style={{ marginTop: '2rem' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
              Ngân sách: {user?.budget.toLocaleString('vi-VN')} đ
            </span>
          </div>
        </div>

        {/* Card 2: Biểu đồ */}
        <div className="glass-panel">
          <h3 style={{ color: 'var(--color-text)', fontSize: '1.25rem', marginBottom: '1.5rem' }}>Phân bổ danh mục</h3>
          <ExpenseChart data={chartData} />
        </div>

        {/* Card 3: Nhắc nhở */}
        <div className="glass-panel">
          <h3 style={{ color: 'var(--color-text)', fontSize: '1.25rem', marginBottom: '1.5rem' }}>Nhắc nhở sắp tới</h3>
          {reminders.length === 0 ? (
            <p style={{ color: 'var(--color-text-muted)' }}>Không có nhắc nhở nào.</p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {reminders.map((r, i) => (
                <li key={i} style={{ 
                  padding: '1rem', 
                  background: 'rgba(0,0,0,0.2)', 
                  borderRadius: '8px',
                  borderLeft: '4px solid var(--color-cta)'
                }}>
                  <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{r.message}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                    {new Date(r.time).toLocaleString('vi-VN')}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Card 4: Giao dịch gần đây */}
        <div className="glass-panel">
          <h3 style={{ color: 'var(--color-text)', fontSize: '1.25rem', marginBottom: '1.5rem' }}>Giao dịch gần đây</h3>
          {expenses.length === 0 ? (
            <p style={{ color: 'var(--color-text-muted)' }}>Chưa có giao dịch.</p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {expenses.slice(0, 5).map((e, i) => (
                <li key={i} style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '1rem', 
                  background: 'rgba(0,0,0,0.2)', 
                  borderRadius: '8px'
                }}>
                  <div>
                    <div style={{ fontWeight: 600, marginBottom: '0.25rem', textTransform: 'capitalize' }}>
                      {e.category.replace('_', ' ')}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                      {e.description || 'Không có mô tả'} • {new Date(e.timestamp).toLocaleDateString('vi-VN')}
                    </div>
                  </div>
                  <div style={{ fontWeight: 700, color: '#F8FAFC' }}>
                    -{e.amount.toLocaleString('vi-VN')}đ
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
