import { useState, useEffect, useCallback } from 'react';
import {
  format, startOfMonth, endOfMonth, eachDayOfInterval,
  getDay, addMonths, subMonths, isToday, startOfDay, isBefore, parseISO,
} from 'date-fns';
import {
  ChevronLeft, ChevronRight, Lock, Unlock, User,
  Loader2, AlertCircle, CheckCircle, XCircle, Ban, CalendarOff,
} from 'lucide-react';
import {
  getCalendarMonth, getDaySlots, blockSlot, unblockSlot,
  type CalendarDayData, type DaySlotsResponse, type DaySlotItem,
} from '@/lib/api';
import { cn } from '@/lib/utils';

const WEEKDAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

// Status colours for slot chips
const slotStyles = {
  available: 'bg-emerald-950/60 border border-emerald-700/40 text-emerald-300',
  booked:    'bg-blue-950/60   border border-blue-600/40   text-blue-200',
  blocked:   'bg-red-950/60    border border-red-700/40    text-red-300',
};

interface Props { token: string }

export function AdminCalendar({ token }: Props) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [monthData, setMonthData] = useState<Record<string, CalendarDayData>>({});
  const [dayDetail, setDayDetail] = useState<DaySlotsResponse | null>(null);
  const [monthLoading, setMonthLoading] = useState(false);
  const [dayLoading, setDayLoading] = useState(false);
  const [actionId, setActionId] = useState<string | null>(null); // which slot is processing
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const monthStr = format(currentMonth, 'yyyy-MM');

  // ── Load month overview ───────────────────────────────────────────────────
  const loadMonth = useCallback(async () => {
    setMonthLoading(true);
    setError('');
    try {
      const data = await getCalendarMonth(token, monthStr);
      setMonthData(data.days);
    } catch {
      setError('Could not load calendar. Is the backend running?');
    } finally {
      setMonthLoading(false);
    }
  }, [token, monthStr]);

  useEffect(() => { loadMonth(); }, [loadMonth]);

  // ── Load day detail ────────────────────────────────────────────────────────
  const loadDay = useCallback(async (date: string) => {
    setDayLoading(true);
    setDayDetail(null);
    setError('');
    try {
      const data = await getDaySlots(token, date);
      setDayDetail(data);
    } catch {
      setError('Could not load day slots.');
    } finally {
      setDayLoading(false);
    }
  }, [token]);

  const handleDayClick = (dateStr: string, isPast: boolean) => {
    if (isPast) return;
    setSelectedDate(dateStr);
    loadDay(dateStr);
    setSuccess('');
    setError('');
  };

  // ── Block a slot or the whole day ─────────────────────────────────────────
  const handleBlock = async (time?: string) => {
    if (!selectedDate) return;
    const key = time ?? 'day';
    setActionId(key);
    setError('');
    try {
      await blockSlot(token, {
        date: selectedDate,
        time,
        reason: time ? 'Unavailable' : 'Clinic closed',
      });
      setSuccess(time ? `Slot ${time} blocked.` : 'Entire day blocked.');
      loadDay(selectedDate);
      loadMonth();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to block.');
    } finally {
      setActionId(null);
    }
  };

  // ── Unblock ───────────────────────────────────────────────────────────────
  const handleUnblock = async (id: string, label: string) => {
    setActionId(id);
    setError('');
    try {
      await unblockSlot(token, id);
      setSuccess(`${label} unblocked.`);
      if (selectedDate) loadDay(selectedDate);
      loadMonth();
    } catch {
      setError('Failed to unblock.');
    } finally {
      setActionId(null);
    }
  };

  // ── Calendar grid math ────────────────────────────────────────────────────
  const monthStart = startOfMonth(currentMonth);
  const monthEnd   = endOfMonth(currentMonth);
  const days       = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Pad start so Mon is column 0
  const startPad = (getDay(monthStart) + 6) % 7;
  const paddedDays: (Date | null)[] = [
    ...Array(startPad).fill(null),
    ...days,
  ];
  // Fill to complete last row
  while (paddedDays.length % 7 !== 0) paddedDays.push(null);

  const todayStart = startOfDay(new Date());

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col xl:flex-row gap-6">

      {/* ── Left: Monthly calendar ─────────────────────────────────────────── */}
      <div className="flex-1 min-w-0">

        {/* Month header */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => { setCurrentMonth(subMonths(currentMonth, 1)); setSelectedDate(null); setDayDetail(null); }}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="text-center">
            <h3 className="text-lg font-bold text-white">{format(currentMonth, 'MMMM yyyy')}</h3>
            {monthLoading && <Loader2 className="w-4 h-4 animate-spin text-cyan-400 mx-auto mt-1" />}
          </div>
          <button
            onClick={() => { setCurrentMonth(addMonths(currentMonth, 1)); setSelectedDate(null); setDayDetail(null); }}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Weekday labels */}
        <div className="grid grid-cols-7 mb-2">
          {WEEKDAY_LABELS.map((d) => (
            <div key={d} className={cn(
              'text-center text-xs font-semibold py-1',
              ['Sat', 'Sun'].includes(d) ? 'text-slate-600' : 'text-slate-400'
            )}>
              {d}
            </div>
          ))}
        </div>

        {/* Day grid */}
        <div className="grid grid-cols-7 gap-1">
          {paddedDays.map((day, i) => {
            if (!day) return <div key={`pad-${i}`} />;

            const dateStr = format(day, 'yyyy-MM-dd');
            const dayOfWeek = getDay(day); // 0=Sun,6=Sat
            const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
            const isPast    = isBefore(startOfDay(day), todayStart);
            const isSel     = dateStr === selectedDate;
            const isNow     = isToday(day);
            const info      = monthData[dateStr];

            return (
              <button
                key={dateStr}
                onClick={() => handleDayClick(dateStr, isPast || isWeekend)}
                disabled={isPast || isWeekend}
                className={cn(
                  'relative flex flex-col items-center justify-start rounded-xl p-1.5 min-h-[58px]',
                  'text-xs font-medium transition-all duration-150 group',
                  isPast || isWeekend
                    ? 'opacity-25 cursor-not-allowed'
                    : 'cursor-pointer hover:bg-white/10',
                  isSel
                    ? 'bg-cyan-600/30 ring-2 ring-cyan-500 text-white'
                    : isNow
                    ? 'ring-2 ring-yellow-400/60 text-yellow-300'
                    : 'text-slate-300',
                  info?.blocked && !isSel
                    ? 'bg-red-950/40'
                    : '',
                )}
              >
                {/* Day number */}
                <span className={cn(
                  'w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold',
                  isSel   ? 'bg-cyan-500 text-white'
                  : isNow ? 'bg-yellow-400 text-slate-900'
                  :         '',
                )}>
                  {format(day, 'd')}
                </span>

                {/* Indicators */}
                {info && (
                  <div className="flex flex-wrap gap-0.5 justify-center mt-1">
                    {info.appointments > 0 && (
                      <span className="px-1 py-0.5 rounded text-[10px] bg-blue-600/50 text-blue-200 leading-none">
                        {info.appointments}
                      </span>
                    )}
                    {info.blocked > 0 && (
                      <span className="px-1 py-0.5 rounded text-[10px] bg-red-700/50 text-red-300 leading-none">
                        <Lock className="w-2.5 h-2.5 inline" />
                      </span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 mt-4 pt-3 border-t border-white/10 text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-blue-600/50 inline-block" />
            Booked appointments
          </span>
          <span className="flex items-center gap-1.5">
            <Lock className="w-3 h-3 text-red-400" />
            Dentist blocked
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-yellow-400 flex items-center justify-center text-slate-900 text-[9px] font-bold inline-flex">5</span>
            Today
          </span>
        </div>
      </div>

      {/* ── Right: Day detail panel ────────────────────────────────────────── */}
      <div className="xl:w-[360px] shrink-0">
        {/* Toast messages */}
        {error && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-red-950/60 border border-red-700/40 text-red-300 text-sm mb-4">
            <AlertCircle className="w-4 h-4 shrink-0" /> {error}
          </div>
        )}
        {success && !error && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-950/60 border border-emerald-700/40 text-emerald-300 text-sm mb-4">
            <CheckCircle className="w-4 h-4 shrink-0" /> {success}
          </div>
        )}

        {!selectedDate ? (
          <div className="flex flex-col items-center justify-center h-64 text-slate-500 rounded-2xl border border-white/10 bg-white/5">
            <CalendarOff className="w-10 h-10 mb-3 opacity-40" />
            <p className="text-sm">Select a date to manage slots</p>
          </div>
        ) : dayLoading ? (
          <div className="flex flex-col items-center justify-center h-64 text-slate-500 rounded-2xl border border-white/10 bg-white/5">
            <Loader2 className="w-8 h-8 animate-spin text-cyan-400 mb-3" />
            <p className="text-sm">Loading slots…</p>
          </div>
        ) : dayDetail ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">

            {/* Day header */}
            <div className="px-4 py-3 border-b border-white/10 bg-white/5">
              <p className="text-xs text-slate-400 mb-0.5">Selected date</p>
              <h4 className="font-bold text-white text-base">
                {format(parseISO(selectedDate), 'EEEE, MMMM d yyyy')}
              </h4>

              {/* Block / Unblock entire day */}
              <div className="mt-3">
                {dayDetail.isDayBlocked ? (
                  <button
                    onClick={() => handleUnblock(dayDetail.dayBlockId!, 'Full day')}
                    disabled={actionId === dayDetail.dayBlockId}
                    className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-red-950/50 border border-red-700/50 text-red-300 hover:bg-red-900/50 text-sm font-medium transition-colors disabled:opacity-50"
                  >
                    {actionId === dayDetail.dayBlockId
                      ? <Loader2 className="w-4 h-4 animate-spin" />
                      : <Unlock className="w-4 h-4" />}
                    Unblock entire day
                  </button>
                ) : (
                  <button
                    onClick={() => handleBlock(undefined)}
                    disabled={actionId === 'day'}
                    className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-red-950/30 border border-red-700/30 text-red-400 hover:bg-red-900/40 hover:text-red-300 text-sm font-medium transition-colors disabled:opacity-50"
                  >
                    {actionId === 'day'
                      ? <Loader2 className="w-4 h-4 animate-spin" />
                      : <Ban className="w-4 h-4" />}
                    Block entire day
                  </button>
                )}
              </div>
            </div>

            {/* Slot list */}
            <div className="divide-y divide-white/5 max-h-[480px] overflow-y-auto">
              {dayDetail.slots.map((slot: DaySlotItem) => (
                <SlotRow
                  key={slot.time}
                  slot={slot}
                  actionId={actionId}
                  isDayBlocked={dayDetail.isDayBlocked}
                  onBlock={() => handleBlock(slot.time)}
                  onUnblock={() => handleUnblock(slot.blocked_id!, slot.time)}
                />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

// ─── Slot row sub-component ────────────────────────────────────────────────────

interface SlotRowProps {
  slot: DaySlotItem;
  actionId: string | null;
  isDayBlocked: boolean;
  onBlock: () => void;
  onUnblock: () => void;
}

function SlotRow({ slot, actionId, isDayBlocked, onBlock, onUnblock }: SlotRowProps) {
  const isProcessing =
    actionId === slot.time ||
    (slot.type === 'blocked' && slot.blocked_id && actionId === slot.blocked_id);

  return (
    <div className="flex items-center justify-between px-4 py-2.5 gap-3">
      {/* Time */}
      <span className="text-sm font-mono font-semibold text-slate-300 shrink-0 w-12">
        {slot.time}
      </span>

      {/* Status label */}
      <div className={cn('flex-1 px-2 py-1 rounded-lg text-xs font-medium', slotStyles[slot.type])}>
        {slot.type === 'booked' && slot.appointment ? (
          <span className="flex items-center gap-1.5">
            <User className="w-3 h-3 shrink-0" />
            <span className="truncate">
              {slot.appointment.name}
              <span className="opacity-60"> · {slot.appointment.service}</span>
            </span>
            {slot.appointment.status === 'confirmed' && (
              <CheckCircle className="w-3 h-3 text-emerald-400 shrink-0" />
            )}
            {slot.appointment.status === 'pending' && (
              <span className="text-yellow-400 shrink-0">•</span>
            )}
          </span>
        ) : slot.type === 'blocked' ? (
          <span className="flex items-center gap-1.5">
            <Lock className="w-3 h-3 shrink-0" />
            {slot.reason || 'Blocked'}
          </span>
        ) : (
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
            Available
          </span>
        )}
      </div>

      {/* Action button */}
      {slot.type === 'available' && !isDayBlocked && (
        <button
          onClick={onBlock}
          disabled={!!actionId}
          className="shrink-0 px-2 py-1 rounded-lg text-xs font-medium bg-red-950/40 border border-red-700/30 text-red-400 hover:bg-red-900/50 hover:text-red-300 transition-colors disabled:opacity-40"
        >
          {isProcessing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Lock className="w-3 h-3" />}
        </button>
      )}

      {slot.type === 'blocked' && !isDayBlocked && (
        <button
          onClick={onUnblock}
          disabled={!!actionId}
          className="shrink-0 px-2 py-1 rounded-lg text-xs font-medium bg-emerald-950/40 border border-emerald-700/30 text-emerald-400 hover:bg-emerald-900/50 hover:text-emerald-300 transition-colors disabled:opacity-40"
        >
          {isProcessing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Unlock className="w-3 h-3" />}
        </button>
      )}

      {slot.type === 'booked' && (
        <XCircle className="w-4 h-4 text-slate-600 shrink-0" />
      )}
    </div>
  );
}
