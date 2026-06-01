import { useState } from 'react';
import { X } from 'lucide-react';

const WHATSAPP_PHONE = '919686714025';
const WHATSAPP_MESSAGE =
  'Hi! I\'d like to book an appointment at Bright Smile Dental. 😊';

const WA_URL = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

// ─── WhatsApp SVG icon (official brand colour) ────────────────────────────────
function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.111.553 4.094 1.524 5.812L0 24l6.337-1.507A11.951 11.951 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.807 9.807 0 0 1-5.003-1.371l-.36-.214-3.761.894.924-3.663-.234-.374A9.791 9.791 0 0 1 2.182 12c0-5.418 4.4-9.818 9.818-9.818 5.418 0 9.818 4.4 9.818 9.818 0 5.418-4.4 9.818-9.818 9.818z" />
    </svg>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export function WhatsAppButton() {
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div
      className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3"
      aria-label="WhatsApp chat"
    >
      {/* ── Tooltip / chat bubble ─────────────────────────────────── */}
      <div
        className={`
          flex items-start gap-2 max-w-[220px] bg-white rounded-2xl rounded-br-sm
          shadow-[0_8px_30px_rgba(0,0,0,0.12)] px-4 py-3
          transition-all duration-300 ease-out
          ${tooltipVisible
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 translate-y-2 pointer-events-none'}
        `}
        role="tooltip"
      >
        {/* WhatsApp coloured dot */}
        <span className="mt-0.5 w-2 h-2 rounded-full bg-[#25D366] shrink-0 animate-pulse" />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-slate-800 leading-tight">Chat with us!</p>
          <p className="text-xs text-slate-500 mt-0.5 leading-snug">
            We typically reply in a few minutes.
          </p>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); setDismissed(true); }}
          className="shrink-0 text-slate-400 hover:text-slate-600 transition-colors -mt-0.5 -mr-1"
          aria-label="Dismiss WhatsApp bubble"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* ── Floating button ──────────────────────────────────────── */}
      <a
        href={WA_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Open WhatsApp chat"
        onMouseEnter={() => setTooltipVisible(true)}
        onMouseLeave={() => setTooltipVisible(false)}
        onFocus={() => setTooltipVisible(true)}
        onBlur={() => setTooltipVisible(false)}
        className="
          relative flex items-center justify-center
          w-14 h-14 rounded-full
          bg-[#25D366] text-white
          shadow-[0_4px_20px_rgba(37,211,102,0.4)]
          hover:bg-[#20b858] hover:shadow-[0_6px_28px_rgba(37,211,102,0.55)]
          hover:scale-110
          active:scale-95
          transition-all duration-200 ease-out
          focus:outline-none focus-visible:ring-4 focus-visible:ring-[#25D366]/50
        "
      >
        {/* Pulse ring */}
        <span
          className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-30"
          aria-hidden="true"
        />
        <WhatsAppIcon className="w-7 h-7 relative z-10" />
      </a>
    </div>
  );
}
