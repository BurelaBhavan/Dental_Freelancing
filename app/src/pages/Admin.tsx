import { useState, useEffect, useCallback, useRef } from 'react';
import {
  adminLogin,
  getAdminAppointments,
  updateAppointment,
  deleteAppointment,
  type Appointment,
  type AdminStats,
} from '@/lib/api';
import { format, parseISO } from 'date-fns';
import {
  LogOut, Search, RefreshCw, CheckCircle, XCircle, Trash2,
  Edit3, Save, X, Users, CalendarCheck, Clock, AlertCircle,
  ChevronDown, ChevronUp, Eye, Lock, Stethoscope, Loader2,
  Phone, Mail, Calendar, FileText, MessageSquare, CalendarDays, ListChecks,
} from 'lucide-react';
import { AdminCalendar } from './AdminCalendar';

// ─── Constants ────────────────────────────────────────────────────────────────

const STATUS_CONFIG = {
  pending: {
    label: 'Pending',
    className: 'bg-amber-500/15 text-amber-400 border border-amber-500/25',
    dot: 'bg-amber-400',
  },
  confirmed: {
    label: 'Confirmed',
    className: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25',
    dot: 'bg-emerald-400',
  },
  cancelled: {
    label: 'Cancelled',
    className: 'bg-red-500/15 text-red-400 border border-red-500/25',
    dot: 'bg-red-400',
  },
} as const;

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: keyof typeof STATUS_CONFIG }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${cfg.className}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

function StatCard({
  label, value, icon: Icon, color,
}: {
  label: string; value: number | string; icon: React.ElementType; color: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl p-5 border border-white/8"
      style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(12px)' }}>
      <div className={`absolute top-0 right-0 w-20 h-20 rounded-full opacity-10 blur-2xl ${color}`} />
      <div className={`inline-flex p-2.5 rounded-xl mb-3 ${color} bg-opacity-15`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <p className="text-3xl font-bold text-white mb-0.5">{value}</p>
      <p className="text-sm text-slate-400">{label}</p>
    </div>
  );
}

// ─── Expanded Row ─────────────────────────────────────────────────────────────

function ExpandedRow({
  appt, token, onUpdate,
}: {
  appt: Appointment; token: string; onUpdate: () => void;
}) {
  const [editingNotes, setEditingNotes] = useState(false);
  const [notes, setNotes] = useState(appt.admin_notes || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateAppointment(token, appt.id, { admin_notes: notes });
      setEditingNotes(false);
      onUpdate();
    } finally {
      setSaving(false);
    }
  };

  return (
    <tr>
      <td colSpan={7} className="px-4 pb-4 pt-0">
        <div className="rounded-xl border border-white/8 p-4 ml-4"
          style={{ background: 'rgba(255,255,255,0.02)' }}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div className="flex items-start gap-2">
              <Phone className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-slate-500 mb-0.5">Phone</p>
                <p className="text-sm text-slate-200">{appt.phone}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Mail className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-slate-500 mb-0.5">Email</p>
                <p className="text-sm text-slate-200">{appt.email}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Calendar className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-slate-500 mb-0.5">Booked On</p>
                <p className="text-sm text-slate-200">
                  {format(parseISO(appt.created_at), 'MMM d, yyyy • h:mm a')}
                </p>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex items-start gap-2">
              <FileText className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
              <div className="flex-1">
                <p className="text-xs text-slate-500 mb-1">Patient's Reason</p>
                <p className="text-sm text-slate-200 leading-relaxed">{appt.reason}</p>
              </div>
            </div>
          </div>

          {/* Admin Notes */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-slate-400" />
                <p className="text-xs text-slate-500">Internal Notes (only visible to admin)</p>
              </div>
              {!editingNotes && (
                <button
                  onClick={() => setEditingNotes(true)}
                  className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  <Edit3 className="w-3 h-3" />
                  {appt.admin_notes ? 'Edit' : 'Add Note'}
                </button>
              )}
            </div>

            {editingNotes ? (
              <div className="flex flex-col gap-2">
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Patient requested whitening, needs x-ray..."
                  rows={2}
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 resize-none"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white text-xs rounded-lg transition-colors"
                  >
                    {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                    Save
                  </button>
                  <button
                    onClick={() => { setEditingNotes(false); setNotes(appt.admin_notes || ''); }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs rounded-lg transition-colors"
                  >
                    <X className="w-3 h-3" /> Cancel
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-300 leading-relaxed min-h-[1.5rem]">
                {appt.admin_notes || <span className="text-slate-600 italic">No internal notes yet.</span>}
              </p>
            )}
          </div>
        </div>
      </td>
    </tr>
  );
}

// ─── Appointment Row ──────────────────────────────────────────────────────────

function AppointmentRow({
  appt, token, onUpdate,
}: {
  appt: Appointment; token: string; onUpdate: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const handleStatus = async (status: string) => {
    setActionLoading(status);
    try {
      await updateAppointment(token, appt.id, { status });
      onUpdate();
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete ${appt.name}'s appointment? This cannot be undone.`)) return;
    setActionLoading('delete');
    try {
      await deleteAppointment(token, appt.id);
      onUpdate();
    } finally {
      setActionLoading(null);
    }
  };

  const isLoading = (key: string) => actionLoading === key;

  return (
    <>
      <tr
        className="border-b border-white/5 hover:bg-white/3 transition-colors cursor-pointer"
        onClick={() => setExpanded((v) => !v)}
      >
        {/* Expand indicator */}
        <td className="px-4 py-3.5 text-slate-500">
          {expanded
            ? <ChevronUp className="w-4 h-4" />
            : <ChevronDown className="w-4 h-4" />}
        </td>

        {/* Name */}
        <td className="px-4 py-3.5">
          <p className="text-sm font-medium text-slate-100">{appt.name}</p>
          <p className="text-xs text-slate-500 mt-0.5">{appt.email}</p>
        </td>

        {/* Service */}
        <td className="px-4 py-3.5">
          <span className="text-sm text-slate-300">{appt.service}</span>
        </td>

        {/* Date & Time */}
        <td className="px-4 py-3.5">
          <p className="text-sm text-slate-200">
            {format(parseISO(appt.date + 'T12:00:00'), 'MMM d, yyyy')}
          </p>
          <p className="text-xs text-slate-500">{appt.time}</p>
        </td>

        {/* Status */}
        <td className="px-4 py-3.5" onClick={(e) => e.stopPropagation()}>
          <StatusBadge status={appt.status} />
        </td>

        {/* Notes indicator */}
        <td className="px-4 py-3.5">
          {appt.admin_notes && (
            <span className="inline-flex items-center gap-1 text-xs text-slate-500">
              <MessageSquare className="w-3 h-3" /> Note
            </span>
          )}
        </td>

        {/* Actions */}
        <td className="px-4 py-3.5" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center gap-1">
            {appt.status !== 'confirmed' && (
              <button
                onClick={() => handleStatus('confirmed')}
                disabled={!!actionLoading}
                title="Confirm"
                className="p-1.5 rounded-lg hover:bg-emerald-500/15 text-slate-500 hover:text-emerald-400 transition-colors disabled:opacity-40"
              >
                {isLoading('confirmed')
                  ? <Loader2 className="w-4 h-4 animate-spin" />
                  : <CheckCircle className="w-4 h-4" />}
              </button>
            )}
            {appt.status !== 'cancelled' && (
              <button
                onClick={() => handleStatus('cancelled')}
                disabled={!!actionLoading}
                title="Cancel"
                className="p-1.5 rounded-lg hover:bg-amber-500/15 text-slate-500 hover:text-amber-400 transition-colors disabled:opacity-40"
              >
                {isLoading('cancelled')
                  ? <Loader2 className="w-4 h-4 animate-spin" />
                  : <XCircle className="w-4 h-4" />}
              </button>
            )}
            <button
              onClick={handleDelete}
              disabled={!!actionLoading}
              title="Delete permanently"
              className="p-1.5 rounded-lg hover:bg-red-500/15 text-slate-500 hover:text-red-400 transition-colors disabled:opacity-40"
            >
              {isLoading('delete')
                ? <Loader2 className="w-4 h-4 animate-spin" />
                : <Trash2 className="w-4 h-4" />}
            </button>
          </div>
        </td>
      </tr>

      {expanded && (
        <ExpandedRow appt={appt} token={token} onUpdate={onUpdate} />
      )}
    </>
  );
}

// ─── Login Screen ─────────────────────────────────────────────────────────────

function LoginScreen({ onLogin }: { onLogin: (token: string, clinic: string) => void }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await adminLogin(password);
      onLogin(data.token, data.clinic);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: 'linear-gradient(135deg, #0a0f1e 0%, #0d1b2a 50%, #0a1628 100%)',
      }}
    >
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #06b6d4, transparent 70%)' }} />
      </div>

      <div
        className="relative w-full max-w-md rounded-3xl p-8 border border-white/10"
        style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)' }}
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
            style={{ background: 'linear-gradient(135deg, #0891b2, #06b6d4)' }}>
            <Stethoscope className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Admin Portal</h1>
          <p className="text-slate-400 text-sm mt-1">Dental Clinic Dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-slate-400 mb-2">Admin Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                required
                autoFocus
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-800/70 border border-slate-700 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 transition-all"
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-semibold text-white transition-all duration-200 disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg, #0891b2, #06b6d4)' }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" /> Signing in...
              </span>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <p className="text-center text-xs text-slate-600 mt-6">
          Dental Clinic Admin • Password set in server config
        </p>
      </div>
    </div>
  );
}

// ─── Main Admin Dashboard ─────────────────────────────────────────────────────

export function Admin() {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('admin_token'));
  const [clinicName, setClinicName] = useState(localStorage.getItem('admin_clinic') || 'Dental Clinic');
  const [activeTab, setActiveTab] = useState<'appointments' | 'calendar'>('appointments');

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [searchQuery, setSearchQuery] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const searchTimeout = useRef<ReturnType<typeof setTimeout>>(null!);

  const fetchData = useCallback(async (
    tok: string,
    search: string,
    date: string,
    status: string
  ) => {
    setLoading(true);
    setError('');
    try {
      const data = await getAdminAppointments(tok, {
        search: search || undefined,
        date: date || undefined,
        status: status !== 'all' ? status : undefined,
      });
      setAppointments(data.appointments);
      setStats(data.stats);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load appointments';
      if (msg.includes('expired') || msg.includes('Invalid')) {
        handleLogout();
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  }, []); // eslint-disable-line

  useEffect(() => {
    if (!token) return;
    clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      fetchData(token, searchQuery, filterDate, filterStatus);
    }, 300);
    return () => clearTimeout(searchTimeout.current);
  }, [token, searchQuery, filterDate, filterStatus, fetchData]);

  const handleLogin = (tok: string, clinic: string) => {
    localStorage.setItem('admin_token', tok);
    localStorage.setItem('admin_clinic', clinic);
    setToken(tok);
    setClinicName(clinic);
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_clinic');
    setToken(null);
  };

  const refresh = () => {
    if (token) fetchData(token, searchQuery, filterDate, filterStatus);
  };

  if (!token) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div
      className="min-h-screen text-slate-100"
      style={{ background: 'linear-gradient(135deg, #0a0f1e 0%, #0c1524 100%)' }}
    >
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 border-b border-white/8"
        style={{ background: 'rgba(10,15,30,0.85)', backdropFilter: 'blur(20px)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #0891b2, #06b6d4)' }}>
              <Stethoscope className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-semibold text-white leading-none">{clinicName}</h1>
              <p className="text-xs text-slate-500 mt-0.5">Admin Dashboard</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={refresh}
              disabled={loading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        {/* ── Tab Navigation ──────────────────────────────────────────────────── */}
        <div className="flex gap-1 p-1 mb-8 rounded-xl bg-white/5 border border-white/10 w-fit">
          <button
            onClick={() => setActiveTab('appointments')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
              activeTab === 'appointments'
                ? 'bg-cyan-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <ListChecks className="w-4 h-4" />
            Appointments
          </button>
          <button
            onClick={() => setActiveTab('calendar')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
              activeTab === 'calendar'
                ? 'bg-cyan-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <CalendarDays className="w-4 h-4" />
            Availability Calendar
          </button>
        </div>

        {/* ── Stats Row ──────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Appointments" value={stats?.total ?? '—'} icon={Users} color="bg-cyan-500" />
          <StatCard label="Today's Bookings" value={stats?.today ?? '—'} icon={CalendarCheck} color="bg-violet-500" />
          <StatCard label="Pending Confirmation" value={stats?.pending ?? '—'} icon={Clock} color="bg-amber-500" />
          <StatCard label="Confirmed" value={stats?.confirmed ?? '—'} icon={CheckCircle} color="bg-emerald-500" />
        </div>


        {/* ── Conditional content based on tab ────────────────────────────────── */}
        {activeTab === 'appointments' ? (
          <>
            {/* Error Banner */}
            {error && (
              <div className="flex items-center gap-3 px-4 py-3 mb-6 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
                <button onClick={() => setError('')} className="ml-auto"><X className="w-4 h-4" /></button>
              </div>
            )}

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search name, email, phone, service…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-200 placeholder:text-slate-500 text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/20 transition-all"
                />
              </div>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className="pl-9 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-200 text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/20 transition-all [color-scheme:dark]"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-200 text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/20 transition-all [color-scheme:dark]"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              {(searchQuery || filterDate || filterStatus !== 'all') && (
                <button
                  onClick={() => { setSearchQuery(''); setFilterDate(''); setFilterStatus('all'); }}
                  className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-slate-200 text-sm transition-colors flex items-center gap-1.5"
                >
                  <X className="w-3.5 h-3.5" /> Clear
                </button>
              )}
            </div>

            {/* Table */}
            <div className="rounded-2xl border border-white/8 overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)' }}>
              <div className="px-4 py-3 border-b border-white/8 flex items-center justify-between">
                <p className="text-sm font-medium text-slate-300">
                  {loading ? 'Loading…' : `${appointments.length} appointment${appointments.length !== 1 ? 's' : ''}`}
                </p>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Eye className="w-3.5 h-3.5" /> Click a row to expand details & add notes
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[700px]">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th className="px-4 py-3 w-8" />
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Patient</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Service</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date & Time</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Notes</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading && appointments.length === 0 ? (
                      <tr><td colSpan={7} className="px-4 py-16 text-center">
                        <Loader2 className="w-6 h-6 animate-spin text-slate-500 mx-auto mb-2" />
                        <p className="text-sm text-slate-500">Loading appointments…</p>
                      </td></tr>
                    ) : appointments.length === 0 ? (
                      <tr><td colSpan={7} className="px-4 py-16 text-center">
                        <CalendarCheck className="w-10 h-10 text-slate-700 mx-auto mb-3" />
                        <p className="text-sm font-medium text-slate-400">No appointments found</p>
                        <p className="text-xs text-slate-600 mt-1">
                          {searchQuery || filterDate || filterStatus !== 'all'
                            ? 'Try adjusting your filters'
                            : 'Appointments will appear here once patients book'}
                        </p>
                      </td></tr>
                    ) : (
                      appointments.map((appt) => (
                        <AppointmentRow key={appt.id} appt={appt} token={token} onUpdate={refresh} />
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* WhatsApp upgrade note */}
            <div className="mt-6 px-4 py-3 rounded-xl border border-violet-500/20 bg-violet-500/5 flex items-start gap-3">
              <div className="w-5 h-5 rounded flex items-center justify-center shrink-0 mt-0.5" style={{ background: '#25D366' }}>
                <svg viewBox="0 0 24 24" className="w-3 h-3 fill-white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.111.553 4.094 1.524 5.812L0 24l6.337-1.507A11.951 11.951 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.807 9.807 0 0 1-5.003-1.371l-.36-.214-3.761.894.924-3.663-.234-.374A9.791 9.791 0 0 1 2.182 12c0-5.418 4.4-9.818 9.818-9.818 5.418 0 9.818 4.4 9.818 9.818 0 5.418-4.4 9.818-9.818 9.818z"/></svg>
              </div>
              <div>
                <p className="text-xs font-medium text-violet-300">WhatsApp Integration — Coming Soon</p>
                <p className="text-xs text-slate-500 mt-0.5">Automatic confirmations, reminders & rescheduling via WhatsApp Business API.</p>
              </div>
            </div>
          </>
        ) : (
          /* ── Calendar Tab ─────────────────────────────────────────────────── */
          <div className="rounded-2xl border border-white/8 p-6" style={{ background: 'rgba(255,255,255,0.03)' }}>
            <div className="mb-5">
              <h2 className="text-lg font-bold text-white">Availability Calendar</h2>
              <p className="text-sm text-slate-400 mt-1">
                Click any future date to view its time slots. Block individual slots or entire days to prevent patient bookings.
              </p>
            </div>
            <AdminCalendar token={token} />
          </div>
        )}
      </main>
    </div>
  );
}
