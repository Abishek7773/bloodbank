/**
 * api.js — centralised API client for the Blood Bank frontend.
 *
 * Set VITE_API_URL in your Vercel environment variables to your Render URL
 * e.g. https://blood-bank-api.onrender.com
 *
 * During local development it falls back to http://localhost:5000
 */

const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

// ── helpers ──────────────────────────────────────────────────────────────────

const getToken = () => localStorage.getItem("bb_token");

const headers = (extra = {}) => ({
  "Content-Type": "application/json",
  ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
  ...extra,
});

const handle = async (res) => {
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "API error");
  return data;
};

// ── Auth ─────────────────────────────────────────────────────────────────────

export const apiLogin = (username, password, role) =>
  fetch(`${BASE}/api/auth/login`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({ username, password, role }),
  }).then(handle);

export const apiRegister = (payload) =>
  fetch(`${BASE}/api/auth/register`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify(payload),
  }).then(handle);

// ── Blood Banks ───────────────────────────────────────────────────────────────

export const apiFetchBanks = () =>
  fetch(`${BASE}/api/banks`, { headers: headers() }).then(handle);

export const apiUpdateInventory = (bankId, inventory) =>
  fetch(`${BASE}/api/banks/${bankId}/inventory`, {
    method: "PUT",
    headers: headers(),
    body: JSON.stringify({ inventory }),
  }).then(handle);

// ── Requests ──────────────────────────────────────────────────────────────────

export const apiFetchRequests = () =>
  fetch(`${BASE}/api/requests`, { headers: headers() }).then(handle);

export const apiCreateRequest = (payload) =>
  fetch(`${BASE}/api/requests`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify(payload),
  }).then(handle);

export const apiUpdateRequest = (id, action) =>
  fetch(`${BASE}/api/requests/${id}`, {
    method: "PUT",
    headers: headers(),
    body: JSON.stringify({ action }),
  }).then(handle);

// ── Donations ─────────────────────────────────────────────────────────────────

export const apiFetchDonations = () =>
  fetch(`${BASE}/api/donations`, { headers: headers() }).then(handle);

export const apiCreateDonation = (payload) =>
  fetch(`${BASE}/api/donations`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify(payload),
  }).then(handle);
