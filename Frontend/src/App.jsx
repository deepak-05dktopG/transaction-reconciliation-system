import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart, Pie, Tooltip, Legend, ResponsiveContainer, Cell,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';

const API_BASE = "http://localhost:3000";
function App() {
  //states
  const [summary, setSummary] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [settlementFilter, setSettlementFilter] = useState("ALL");
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(null);

  //API Calls

  //get Dashboard Summary
  const fetchDashboardSummary = async () => {
    try {
      const res = await axios.get(`${API_BASE}/dashboard/summary`);
      setSummary(res.data);
    } catch (err) {
      console.error("Error fetching summary:", err);
    }
  };

  //get All Transactions
  const fetchTransactions = async () => {
    try {
      const res = await axios.get(`${API_BASE}/transactions`);
      setTransactions(res.data);
      setFilteredTransactions(res.data); //initialize filtered transactions
    } catch (err) {
      console.error("Error fetching transactions:", err);
    }
  };

  //get Transaction by ID
  const fetchTransactionById = async (id) => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/transactions/${id}`);
      setSelectedTransaction(res.data);
    } catch (err) {
      console.error("Error fetching transaction:", err);
    } finally {
      setLoading(false);
    }
  };

  //upload CSV file to reconcile endpoint
  const handleFileUpload = async () => {
    if (!file) {
      setUploadStatus({ type: 'error', message: 'Please select a CSV file to upload.' });
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post(`${API_BASE}/reconcile`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setUploadStatus({ type: 'success', message: res.data.message || 'File uploaded successfully.' });
      //rrefresh transactions and summary after successful upload
      await fetchTransactions();
      await fetchDashboardSummary();
    } catch (err) {
      console.error("Error uploading file:", err);
      setUploadStatus({ type: 'error', message: err.response?.data?.message || 'Failed to upload file.' });
    }
  };

  //handle file input change
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setUploadStatus(null); //clear previous status
  };

  //filter transactions by settlement status
  const handleFilterChange = (e) => {
    const filterValue = e.target.value;
    setSettlementFilter(filterValue);

    if (filterValue === "ALL") {
      setFilteredTransactions(transactions);
    } else {
      const filtered = transactions.filter(
        (tx) => tx.settlement_status === filterValue
      );
      setFilteredTransactions(filtered);
    }
  };

  //load summary & transactions when page loads
  useEffect(() => {
    fetchDashboardSummary();
    fetchTransactions();
  }, []);

  //chart Data
  const COLORS = ['#ffc107', '#0dcaf0', '#198754', '#6c757d', '#212529'];

  const statusData = summary ? [
    { name: 'Pending', value: summary.totals.status_breakdown.PENDING },
    { name: 'Partial', value: summary.totals.status_breakdown.PARTIAL },
    { name: 'Fully Settled', value: summary.totals.status_breakdown.FULLY_SETTLED },
    { name: 'Over Settled', value: summary.totals.status_breakdown.OVER_SETTLED },
    { name: 'Refunded', value: summary.totals.status_breakdown.REFUNDED },
  ].filter(item => item.value > 0) : [];

  const issuesData = summary ? [
    { name: 'Critical', value: summary.issues.critical, fill: '#dc3545' },
    { name: 'Warning', value: summary.issues.warning, fill: '#ffc107' },
  ].filter(item => item.value > 0) : [];

  return (
    <div className="container mt-4">
      {/*dashboard Summary */}
      <h2 className="mb-4 text-center">📊 Dashboard Summary</h2>
      {summary ? (
        <div className="row g-3">
          {/*total Transactions */}
          <div className="col-6 col-md-4">
            <div className="card shadow-sm text-center h-100">
              <div className="card-body">
                <h6 className="text-muted">Total Transactions</h6>
                <h3 className="fw-bold text-primary">{summary.totals.total_transactions}</h3>
              </div>
            </div>
          </div>

          {/*total Settlements */}
          <div className="col-6 col-md-4">
            <div className="card shadow-sm text-center h-100">
              <div className="card-body">
                <h6 className="text-muted">Total Settlements</h6>
                <h3 className="fw-bold text-success">{summary.totals.total_settlements}</h3>
              </div>
            </div>
          </div>

          {/*outstanding Amount */}
          <div className="col-6 col-md-4">
            <div className="card shadow-sm text-center h-100">
              <div className="card-body">
                <h6 className="text-muted">Outstanding Amount</h6>
                <h3 className="fw-bold text-danger">${summary.metrics.outstanding_amount}</h3>
              </div>
            </div>
          </div>

          {/*breakdown by Settlement Status - Pie Chart */}
          <div className="col-md-6">
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <h6 className="mb-3">Settlement Status Breakdown</h6>
                {statusData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={statusData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label
                      >
                        {statusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-center">No data available for settlement status.</p>
                )}
              </div>
            </div>
          </div>

          {/*issues - bar chart */}
          <div className="col-md-6">
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <h6 className="mb-3">Issues</h6>
                {issuesData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={issuesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value">
                        {issuesData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-center">No issues data available.</p>
                )}
              </div>
            </div>
          </div>

          {/*metrics */}
          <div className="col-md-6">
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <h6 className="mb-3">Metrics</h6>
                <p><strong>Avg Days to Settle:</strong> {summary.metrics.avg_days_to_settle}</p>
                <p><strong>Settlement Rate:</strong> {summary.metrics.settlement_rate}</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-center">Loading summary...</p>
      )}

      {/* file Upload Section */}
      <h2 className="mt-4">Upload Reconciliation File</h2>
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <div className="mb-3">
            <label htmlFor="fileUpload" className="form-label">Select CSV File:</label>
            <input
              type="file"
              id="fileUpload"
              className="form-control"
              accept=".csv"
              onChange={handleFileChange}
            />
          </div>
          <button
            className="btn btn-primary"
            onClick={handleFileUpload}
            disabled={!file}
          >
            Upload CSV
          </button>
          {uploadStatus && (
            <div className={`mt-3 alert alert-${uploadStatus.type === 'success' ? 'success' : 'danger'}`}>
              {uploadStatus.message}
            </div>
          )}
        </div>
      </div>

      {/* transactions List */}
      <h2 className="mt-4">Transactions</h2>
      <div className="mb-3">
        <label htmlFor="settlementFilter" className="form-label">Filter by Settlement Status:</label>
        <select
          id="settlementFilter"
          className="form-select w-auto"
          value={settlementFilter}
          onChange={handleFilterChange}
        >
          <option value="ALL">All</option>
          <option value="PENDING">Pending</option>
          <option value="PARTIAL">Partial</option>
          <option value="FULLY_SETTLED">Fully Settled</option>
          <option value="OVER_SETTLED">Over Settled</option>
          <option value="REFUNDED">Refunded</option>
        </select>
      </div>
      {filteredTransactions.length > 0 ? (
        <div className="table-responsive shadow-sm">
          <table className="table table-bordered table-striped align-middle text-center">
            <thead className="table-dark">
              <tr>
                <th scope="col">Transaction ID</th>
                <th scope="col">Date</th>
                <th scope="col">Merchant</th>
                <th scope="col">Amount</th>
                <th scope="col">Settlement Status</th>
                <th scope="col">Settled Amount</th>
                <th scope="col">Issue</th>
                <th scope="col">Details</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((tx) => (
                <tr key={tx.transaction_id}>
                  <td>{tx.transaction_id}</td>
                  <td>{tx.transaction_date}</td>
                  <td>{tx.merchant_name}</td>
                  <td>{tx.transaction_amount} {tx.currency}</td>
                  <td>
                    <span
                      className={`badge ${tx.settlement_status === "PENDING"
                        ? "bg-warning text-dark"
                        : tx.settlement_status === "PARTIAL"
                          ? "bg-info"
                          : tx.settlement_status === "FULLY_SETTLED"
                            ? "bg-success"
                            : tx.settlement_status === "OVER_SETTLED"
                              ? "bg-secondary"
                              : "bg-dark"
                        }`}
                    >
                      {tx.settlement_status}
                    </span>
                  </td>
                  <td>{tx.total_settled_amount}</td>
                  <td>
                    {tx.issue === "CRITICAL" && (
                      <span className="badge bg-danger">Critical</span>
                    )}
                    {tx.issue === "WARNING" && (
                      <span className="badge bg-warning text-dark">Warning</span>
                    )}
                    {tx.issue === "NONE" && (
                      <span className="badge bg-success">None</span>
                    )}
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => fetchTransactionById(tx.transaction_id)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center">No transactions match the selected filter.</p>
      )}

      {/* transaction Details */}
      <h2 className="mt-5 mb-3 text-center">📄 Transaction Details</h2>
      {loading && <p className="text-center">Loading details...</p>}

      {selectedTransaction && (
        <div className="card shadow-sm p-4">
          <h5 className="mb-4">
            Transaction <span className="text-primary">{selectedTransaction.transaction_id}</span>
          </h5>

          <div className="row">
            {/* left column */}
            <div className="col-md-6">
              <p><strong>Lifecycle ID:</strong> {selectedTransaction.lifecycle_id}</p>
              <p><strong>Account ID:</strong> {selectedTransaction.account_id}</p>
              <p><strong>Merchant:</strong> {selectedTransaction.merchant_name}</p>
              <p><strong>Date:</strong> {selectedTransaction.transaction_date}</p>
              <p><strong>Currency:</strong> {selectedTransaction.currency}</p>
            </div>

            {/* right column */}
            <div className="col-md-6">
              <p><strong>Transaction Amount:</strong> {selectedTransaction.transaction_amount} {selectedTransaction.currency}</p>
              <p><strong>Status:</strong>
                <span className="badge bg-primary ms-2">{selectedTransaction.status}</span>
              </p>
              <p><strong>Settlement Status:</strong>
                <span className={`badge ms-2 ${selectedTransaction.settlement_status === "PENDING"
                  ? "bg-warning text-dark"
                  : selectedTransaction.settlement_status === "PARTIAL"
                    ? "bg-info"
                    : selectedTransaction.settlement_status === "FULLY_SETTLED"
                      ? "bg-success"
                      : selectedTransaction.settlement_status === "OVER_SETTLED"
                        ? "bg-secondary"
                        : "bg-dark"
                  }`}>
                  {selectedTransaction.settlement_status}
                </span>
              </p>
              <p><strong>Total Settled:</strong> {selectedTransaction.total_settled_amount}</p>
              <p><strong>Last Settlement Date:</strong> {selectedTransaction.last_settlement_date}</p>
            </div>
          </div>

          {/* issue Section */}
          <div className="mt-3">
            <p><strong>Issue:</strong>
              {selectedTransaction.issue === "CRITICAL" && (
                <span className="badge bg-danger ms-2">Critical</span>
              )}
              {selectedTransaction.issue === "WARNING" && (
                <span className="badge bg-warning text-dark ms-2">Warning</span>
              )}
              {selectedTransaction.issue === "NONE" && (
                <span className="badge bg-success ms-2">None</span>
              )}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;