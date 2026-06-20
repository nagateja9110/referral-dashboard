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
        {loading && <p>Loading...</p>}
        {!loading && notFound && <h1>Referral not found</h1>}
        {!loading && !notFound && referral && (
          <>
            <h1>Referral Details</h1>
            <h2>{referral.name}</h2>
            <dl>
              <dt>Referral ID</dt>
              <dd>{referral.id}</dd>
              <dt>Service Name</dt>
              <dd>{referral.serviceName}</dd>
              <dt>Date</dt>
              <dd>{formatDate(referral.date)}</dd>
              <dt>Profit</dt>
              <dd>{formatProfit(referral.profit)}</dd>
            </dl>
            <Link to="/">← Back to dashboard</Link>
          </>
        )}
      </main>
      <Footer />
    </>
  );
}
