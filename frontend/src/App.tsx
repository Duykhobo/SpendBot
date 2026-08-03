import { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface Expense {
  _id: string;
  amount: number;
  category: string;
  description: string;
  timestamp: string;
}

function App() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/expenses');
      if (res.data.success) {
        setExpenses(res.data.data);
        toast.success('Tải dữ liệu thành công!', { theme: 'dark' });
      } else {
        toast.error('Lỗi khi tải dữ liệu.', { theme: 'dark' });
      }
    } catch (error) {
      toast.error('Không thể kết nối đến Backend!', { theme: 'dark' });
    } finally {
      setLoading(false);
    }
  };

  const totalAmount = expenses.reduce((sum, item) => sum + item.amount, 0);

  const dataByCategory = expenses.reduce((acc: any, curr) => {
    const existing = acc.find((item: any) => item.name === curr.category);
    if (existing) existing.value += curr.amount;
    else acc.push({ name: curr.category, value: curr.amount });
    return acc;
  }, []);

  const COLORS = ['#ef4444', '#3b82f6', '#f59e0b', '#10b981', '#6b7280'];

  return (
    <div className="dashboard-container">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <header className="header">
        <h1>Dashboard Quản lý Chi tiêu</h1>
        <button className="glass-card" onClick={fetchExpenses} style={{ padding: '0.5rem 1rem', cursor: 'pointer', border: 'none', color: 'white' }}>
          Làm mới
        </button>
      </header>

      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : (
        <>
          <div className="stats-grid">
            <div className="glass-card stat-item">
              <h3>Tổng chi tiêu</h3>
              <div className="value">{totalAmount.toLocaleString()}đ</div>
            </div>
            <div className="glass-card stat-item">
              <h3>Số giao dịch</h3>
              <div className="value">{expenses.length}</div>
            </div>
          </div>

          <div className="charts-section">
            <div className="glass-card table-container">
              <h3>Giao dịch gần đây</h3>
              <br/>
              <table>
                <thead>
                  <tr>
                    <th>Thời gian</th>
                    <th>Danh mục</th>
                    <th>Mô tả</th>
                    <th>Số tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.slice(0, 5).map(exp => (
                    <tr key={exp._id}>
                      <td>{new Date(exp.timestamp).toLocaleString('vi-VN')}</td>
                      <td><span className={`badge ${exp.category}`}>{exp.category}</span></td>
                      <td>{exp.description || '-'}</td>
                      <td style={{ fontWeight: 600 }}>{exp.amount.toLocaleString()}đ</td>
                    </tr>
                  ))}
                  {expenses.length === 0 && (
                    <tr>
                      <td colSpan={4} style={{ textAlign: 'center' }}>Chưa có giao dịch nào.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="glass-card">
              <h3>Phân bổ chi tiêu</h3>
              <div style={{ width: '100%', height: 300 }}>
                {dataByCategory.length > 0 ? (
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie data={dataByCategory} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
                        {dataByCategory.map((_: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => `${value.toLocaleString()}đ`} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <p style={{ textAlign: 'center', marginTop: '40%' }}>Chưa có dữ liệu</p>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
