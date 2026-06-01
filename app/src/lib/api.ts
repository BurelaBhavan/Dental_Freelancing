// API base URL — set VITE_API_URL in app/.env to override
const API_BASE = (import.meta.env.VITE_API_URL as string) || 'http://localhost:3001/api';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TimeSlot {
  time: string;
  available: boolean;
}

export interface AvailabilityResponse {
  slots: TimeSlot[];
  closed: boolean;
  date?: string;
  reason?: string;
}

export interface AppointmentRequest {
  name: string;
  email: string;
  phone: string;
  service: string;
  reason: string;
  date: string;
  time: string;
}

export interface BookingResponse {
  success: boolean;
  message: string;
  appointment: {
    id: string;
    name: string;
    service: string;
    date: string;
    time: string;
    status: string;
  };
}

export type AppointmentStatus = 'pending' | 'confirmed' | 'cancelled';

export interface Appointment {
  id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  reason: string;
  date: string;
  time: string;
  status: AppointmentStatus;
  admin_notes: string;
  created_at: string;
}

export interface AdminStats {
  total: number;
  pending: number;
  confirmed: number;
  cancelled: number;
  today: number;
}

export interface AdminAppointmentsResponse {
  appointments: Appointment[];
  stats: AdminStats;
}

// ─── Calendar types ───────────────────────────────────────────────────────────

export interface CalendarDayData {
  appointments: number;
  blocked: number;
}

export interface CalendarMonthResponse {
  month: string;
  days: Record<string, CalendarDayData>;
}

export type SlotType = 'available' | 'booked' | 'blocked';

export interface DaySlotItem {
  time: string;
  type: SlotType;
  appointment?: Appointment;
  blocked_id?: string;
  reason?: string;
}

export interface DaySlotsResponse {
  date: string;
  slots: DaySlotItem[];
  isDayBlocked: boolean;
  dayBlockId: string | null;
}

export interface BlockedSlot {
  id: string;
  date: string;
  time: string | null;
  reason: string;
  created_at: string;
}

// ─── Public API ───────────────────────────────────────────────────────────────

export async function getAvailability(date: string): Promise<AvailabilityResponse> {
  const res = await fetch(`${API_BASE}/appointments/availability?date=${encodeURIComponent(date)}`);
  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw new Error((json as { error?: string }).error || 'Failed to fetch availability.');
  }
  return res.json();
}

export async function bookAppointment(data: AppointmentRequest): Promise<BookingResponse> {
  const res = await fetch(`${API_BASE}/appointments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error((json as { error?: string }).error || 'Booking failed.');
  return json as BookingResponse;
}

// ─── Admin Auth ───────────────────────────────────────────────────────────────

export async function adminLogin(password: string): Promise<{ token: string; clinic: string }> {
  const res = await fetch(`${API_BASE}/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error((json as { error?: string }).error || 'Login failed.');
  return json as { token: string; clinic: string };
}

// ─── Admin Appointments ───────────────────────────────────────────────────────

export async function getAdminAppointments(
  token: string,
  filters?: { date?: string; status?: string; search?: string }
): Promise<AdminAppointmentsResponse> {
  const params = new URLSearchParams();
  if (filters?.date) params.set('date', filters.date);
  if (filters?.status && filters.status !== 'all') params.set('status', filters.status);
  if (filters?.search) params.set('search', filters.search);
  const res = await fetch(`${API_BASE}/admin/appointments?${params.toString()}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const json = await res.json();
  if (!res.ok) throw new Error((json as { error?: string }).error || 'Failed to load appointments.');
  return json as AdminAppointmentsResponse;
}

export async function updateAppointment(
  token: string,
  id: string,
  data: { status?: string; admin_notes?: string }
): Promise<{ success: boolean; appointment: Appointment }> {
  const res = await fetch(`${API_BASE}/admin/appointments/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error((json as { error?: string }).error || 'Update failed.');
  return json as { success: boolean; appointment: Appointment };
}

export async function deleteAppointment(
  token: string,
  id: string
): Promise<{ success: boolean; message: string }> {
  const res = await fetch(`${API_BASE}/admin/appointments/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  const json = await res.json();
  if (!res.ok) throw new Error((json as { error?: string }).error || 'Delete failed.');
  return json as { success: boolean; message: string };
}

// ─── Admin Calendar ───────────────────────────────────────────────────────────

export async function getCalendarMonth(
  token: string,
  month: string
): Promise<CalendarMonthResponse> {
  const res = await fetch(`${API_BASE}/admin/calendar?month=${month}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const json = await res.json();
  if (!res.ok) throw new Error((json as { error?: string }).error || 'Failed to load calendar.');
  return json as CalendarMonthResponse;
}

export async function getDaySlots(
  token: string,
  date: string
): Promise<DaySlotsResponse> {
  const res = await fetch(`${API_BASE}/admin/day-slots?date=${date}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const json = await res.json();
  if (!res.ok) throw new Error((json as { error?: string }).error || 'Failed to load day slots.');
  return json as DaySlotsResponse;
}

export async function blockSlot(
  token: string,
  data: { date: string; time?: string; reason?: string }
): Promise<{ success: boolean; blockedSlot: BlockedSlot }> {
  const res = await fetch(`${API_BASE}/admin/blocked-slots`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error((json as { error?: string }).error || 'Failed to block slot.');
  return json as { success: boolean; blockedSlot: BlockedSlot };
}

export async function unblockSlot(
  token: string,
  id: string
): Promise<{ success: boolean }> {
  const res = await fetch(`${API_BASE}/admin/blocked-slots/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  const json = await res.json();
  if (!res.ok) throw new Error((json as { error?: string }).error || 'Failed to unblock.');
  return json as { success: boolean };
}
