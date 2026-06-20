import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { fetchReferrals } from '../api';
import { formatDate, formatProfit } from '../format';

const PAGE_SIZE = 10;
const METRIC_ICONS = ['$', '▣', '⧉', '☺', '%', '⧈', '▦', '⇄'];

function normalizeData(responseJson) {
  const root = responseJson?.data ?? responseJson ?? {};
  return {
    metrics: root.metrics ?? [],
    serviceSummary: root.serviceSummary ?? {},
    referral: root.referral ?? {},
    referrals: root.referrals ?? [],
  };
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState([]);
  const [serviceSummary, setServiceSummary] = useState({});
  const [referral, setReferral] = useState({});
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('desc');
  const [page, setPage] = useState(1);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');

    const token = Cookies.get('jwt_token');
    fetchReferrals({ token, search, sort })
      .then((responseJson) => {
        if (cancelled) return;
        const normalized = normalizeData(responseJson);
        setMetrics(normalized.metrics);
        setServiceSummary(normalized.serviceSummary);
        setReferral(normalized.referral);
        setReferrals(normalized.referrals);
        setPage(1);
      })
      .catch((err) => {
        if (cancelled) return;
        const status = err.status ? ` (${err.status})` : '';
        setError(`${err.message}${status}`);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [search, sort]);

  const total = referrals.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const pageRows = referrals.slice(startIndex, startIndex + PAGE_SIZE);
  const from = total === 0 ? 0 : startIndex + 1;
  const to = Math.min(startIndex + PAGE_SIZE, total);

  function copyToClipboard(text) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
    }
  }

  return (
    <>
      <Navbar />
      <main className="dashboard-page">
        <header className="dashboard-header">
          <h1>Referral Dashboard</h1>
          <p>Track your referrals, earnings, and partner activity in one place.</p>
        </header>

        {loading && <p>Loading...</p>}
        {error && (
          <p role="alert" className="error-message">
            {error}
          </p>
        )}

        {!loading && !error && (
          <>
            <section aria-label="Overview metrics" role="region" className="card overview-section">
              <h2>Overview</h2>
              <div className="metrics-grid">
                {metrics.map((metric, index) => (
                  <div key={metric.id} className="metric-card">
                    <span className="metric-icon">{METRIC_ICONS[index % METRIC_ICONS.length]}</span>
                    <span className="metric-value">{metric.value}</span>
                    <span className="metric-label">{metric.label}</span>
                  </div>
                ))}
              </div>
            </section>

            <section aria-label="Service summary" className="card service-summary-section">
              <h2>Service summary</h2>
              <div className="service-summary-list">
                <div className="summary-item">
                  <span className="summary-label">Service</span>
                  <span className="summary-value">{serviceSummary.service}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Your Referrals</span>
                  <span className="summary-value">{serviceSummary.yourReferrals}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Active Referrals</span>
                  <span className="summary-value">{serviceSummary.activeReferrals}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Total Ref. Earnings</span>
                  <span className="summary-value">{serviceSummary.totalRefEarnings}</span>
                </div>
              </div>
            </section>

            <section aria-label="Share referral" className="card share-referral-section">
              <h2>Refer friends and earn more</h2>
              <div className="share-fields">
                <div className="share-field">
                  <label htmlFor="referral-link">Your Referral Link</label>
                  <div className="share-field-row">
                    <input id="referral-link" type="text" readOnly value={referral.link || ''} />
                    <button type="button" onClick={() => copyToClipboard(referral.link || '')}>
                      Copy
                    </button>
                  </div>
                </div>
                <div className="share-field">
                  <label htmlFor="referral-code">Your Referral Code</label>
                  <div className="share-field-row">
                    <input id="referral-code" type="text" readOnly value={referral.code || ''} />
                    <button type="button" onClick={() => copyToClipboard(referral.code || '')}>
                      Copy
                    </button>
                  </div>
                </div>
              </div>
            </section>

            <section className="card referrals-section">
              <h2>All referrals</h2>
              <div className="referrals-controls">
                <label className="search-field">
                  Search
                  <input
                    type="text"
                    placeholder="Name or service…"
                    aria-label="Search referrals"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </label>
                <label className="sort-field">
                  Sort by date
                  <select value={sort} onChange={(e) => setSort(e.target.value)}>
                    <option value="desc">Newest first</option>
                    <option value="asc">Oldest first</option>
                  </select>
                </label>
              </div>

              <table className="referrals-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Service</th>
                    <th>Date</th>
                    <th>Profit</th>
                  </tr>
                </thead>
                <tbody>
                  {pageRows.length === 0 ? (
                    <tr>
                      <td colSpan={4}>No matching entries</td>
                    </tr>
                  ) : (
                    pageRows.map((row) => (
                      <tr
                        key={row.id}
                        onClick={() => navigate(`/referral/${row.id}`)}
                        tabIndex={0}
                        role="button"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') navigate(`/referral/${row.id}`);
                        }}
                      >
                        <td>{row.name}</td>
                        <td>{row.serviceName}</td>
                        <td>{formatDate(row.date)}</td>
                        <td className="profit-cell">{formatProfit(row.profit)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              <div className="pagination">
                <p>
                  Showing {from}–{to} of {total} entries
                </p>
                <div className="pagination-controls">
                  <button
                    type="button"
                    disabled={currentPage === 1}
                    onClick={() => setPage(currentPage - 1)}
                  >
                    Previous
                  </button>
                  {totalPages > 1 &&
                    Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <button
                        key={p}
                        type="button"
                        className={p === currentPage ? 'active' : ''}
                        onClick={() => setPage(p)}
                      >
                        {p}
                      </button>
                    ))}
                  <button
                    type="button"
                    disabled={currentPage === totalPages}
                    onClick={() => setPage(currentPage + 1)}
                  >
                    Next
                  </button>
                </div>
              </div>
            </section>
          </>
        )}
      </main>
      <Footer />
    </>
  );
}
