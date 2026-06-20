const AUTH_URL = 'https://v9fes04dwf.execute-api.eu-north-1.amazonaws.com/api/auth/signin';
const REFERRALS_URL = 'https://v9fes04dwf.execute-api.eu-north-1.amazonaws.com/api/referrals';

export async function signIn(email, password) {
  const res = await fetch(AUTH_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const json = await res.json();
  if (!res.ok) {
    const error = new Error(json.message || 'Invalid email or password');
    error.status = res.status;
    throw error;
  }
  return json;
}

export async function fetchReferrals({ token, search, sort, id } = {}) {
  const params = new URLSearchParams();
  if (search) params.set('search', search);
  if (sort) params.set('sort', sort);
  if (id !== undefined && id !== null) params.set('id', id);

  const query = params.toString();
  const url = query ? `${REFERRALS_URL}?${query}` : REFERRALS_URL;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  let json;
  try {
    json = await res.json();
  } catch {
    json = null;
  }

  if (!res.ok) {
    const message = json?.message || 'Failed to load referrals';
    const error = new Error(message);
    error.status = res.status;
    throw error;
  }

  return json;
}
