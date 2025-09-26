import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [report, setReport] = useState(null);
  const [reportYear, setReportYear] = useState("");
  const [reportMonth, setReportMonth] = useState("");
  
  const API_BASE = "http://127.0.0.1:8000/api";



useEffect(() => {
  axios.get(`${API_BASE}/users/`)
    .then(res => {
      console.log("Users:", res.data); // <-- DEBUG
      setUsers(res.data);
    })
    .catch(err => console.log("Users Error:", err));

  axios.get(`${API_BASE}/categories/`)
    .then(res => {
      console.log("Categories:", res.data); // <-- DEBUG
      setCategories(res.data);
    })
    .catch(err => console.log("Categories Error:", err));
}, []);





  // Load expenses when user changes
  useEffect(() => {
    if (selectedUser) {
      axios.get(`${API_BASE}/expenses/?user_id=${selectedUser}`)  // <-- trailing slash
           .then(res => setExpenses(res.data));
    }
  }, [selectedUser]);

  // Add new expense
  const addExpense = () => {
    if (!selectedUser || !category || !amount || !date) return alert("Fill all fields");
    axios.post(`${API_BASE}/expenses/create/`, {   // <-- trailing slash
      user: selectedUser,
      category,
      amount,
      date
    }).then(() => {
      axios.get(`${API_BASE}/expenses/?user_id=${selectedUser}`) // <-- trailing slash
           .then(res => setExpenses(res.data));
      setAmount(""); setCategory(""); setDate("");
    });
  }

  // Fetch monthly report
  const fetchReport = () => {
    if (!selectedUser || !reportYear || !reportMonth) return alert("Select user, year, month");
    axios.get(`${API_BASE}/reports/monthly_summary/`, {  // <-- trailing slash
      params: { user_id: selectedUser, year: reportYear, month: reportMonth }
    }).then(res => setReport(res.data));
  }

  return (
  <div className="app-container">
    <h2>Smart Expense Tracker</h2>

    {/* User Selector */}
    <div>
      <label>User: </label>
      <select value={selectedUser} onChange={e => setSelectedUser(e.target.value)}>
        <option value="">Select User</option>
        {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
      </select>
    </div>

    {/* Expense Form */}
    <h3>Add Expense</h3>
    <div>
      <select value={category} onChange={e => setCategory(e.target.value)}>
        <option value="">Select Category</option>
        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
      </select>
      <input type="number" placeholder="Amount" value={amount} onChange={e => setAmount(e.target.value)} />
      <input type="date" value={date} onChange={e => setDate(e.target.value)} />
      <button onClick={addExpense}>Add Expense</button>
    </div>

    {/* Expense List */}
    <h3>Expenses</h3>
    <table>
      <thead>
        <tr>
          <th>Category</th>
          <th>Amount</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        {expenses.map(exp => (
          <tr key={exp.id}>
            <td>{exp.category_name || categories.find(c => c.id === exp.category)?.name}</td>
            <td>{exp.amount}</td>
            <td>{exp.date}</td>
          </tr>
        ))}
      </tbody>
    </table>

    {/* Monthly Report */}
    <h3>Monthly Report</h3>
    <div>
      <input type="text" placeholder="Year (YYYY)" value={reportYear} onChange={e => setReportYear(e.target.value)} />
      <input type="text" placeholder="Month (MM)" value={reportMonth} onChange={e => setReportMonth(e.target.value)} />
      <button onClick={fetchReport}>Get Report</button>
    </div>

    {report && (
      <div className="report">
        <h4>Total Expenses: {report.total_expenses}</h4>
        <ul>
          {report.expenses_by_category.map(c => (
            <li key={c.category_name}>{c.category_name}: {c.total_amount}</li>
          ))}
        </ul>
      </div>
    )}
  </div>
);

}

export default App;
