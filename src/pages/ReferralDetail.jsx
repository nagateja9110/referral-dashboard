import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { Link, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { fetchReferrals } from '../api';
import { formatDate, formatProfit } from '../format';

function extractRow(responseJson, id) {
  const root = responseJson?.data ?? responseJson ?? {};

  if (root.id !== undefined && String(root.id) === String(id)) {
    return root;
  }

  const list = root.referrals;
  if (Array.isArray(list)) {
    return list.find((row) => String(row.id) === String(id)) || null;
  }

  return null;
}

export default function ReferralDetail() {
  const { id } = useParams();
  const [referral, setReferral] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setNotFound(false);

    const token = Cookies.get('jwt_token');
    fetchReferrals({ token, id })
      .then((responseJson) => {
        if (cancelled) return;
        const row = extractRow(responseJson, id);
        if (row) {
          setReferral(row);
        } else {
          setNotFound(true);
        }
      })
      .catch(() => {
        if (cancelled) return;
        setNotFound(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  return (
    <>
      <Navbar />
      <main className="referral-detail-page">
        <Link to="/" className="back-link">
          ← Back to dashboard
        </Link>
        {loading && <p>Loading...</p>}
        {!loading && notFound && <h1>Referral not found</h1>}
        {!loading && !notFound && referral && (
          <>
            <h1>Referral Details</h1>
            <p className="detail-subtitle">Full information for this referral partner.</p>
            <div className="card detail-card">
              <div className="detail-card-header">
                <h2>{referral.name}</h2>
                <span className="service-badge">{referral.serviceName}</span>
              </div>
              <dl>
                <div className="detail-row">
                  <dt>Referral ID</dt>
                  <dd>{referral.id}</dd>
                </div>
                <div className="detail-row">
                  <dt>Name</dt>
                  <dd>{referral.name}</dd>
                </div>
                <div className="detail-row">
                  <dt>Service Name</dt>
                  <dd>{referral.serviceName}</dd>
                </div>
                <div className="detail-row">
                  <dt>Date</dt>
                  <dd>{formatDate(referral.date)}</dd>
                </div>
                <div className="detail-row">
                  <dt>Profit</dt>
                  <dd>{formatProfit(referral.profit)}</dd>
                </div>
              </dl>
            </div>
          </>
        )}
      </main>
      <Footer />
    </>
  );
}
