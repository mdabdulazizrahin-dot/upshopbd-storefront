import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useSiteSettingsContext } from '@/contexts/SiteSettingsContext';
import { Phone, X, MessageSquare, Headphones } from 'lucide-react';

const FloatingHelpline: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { settings } = useSiteSettingsContext();

  // Hide on admin routes
  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  const helpline = settings?.helpline;
  const isEnabled = helpline?.enabled !== false;

  // If disabled by admin, return null
  if (!isEnabled) {
    return null;
  }

  // Fallbacks: if admin hasn't set custom numbers yet, use footer/general contact if present
  const whatsappNumber = helpline?.whatsapp_number || settings?.footer?.phone || '01951530277';
  const whatsappMessage = helpline?.whatsapp_message || 'আসসালামু আলাইকুম, আমি UpShop BD থেকে কেনাকাটা করতে সাহায্য চাই।';
  const messengerUsername = helpline?.messenger_username || 'upshopbd';
  const phoneNumber = helpline?.phone_number || settings?.footer?.phone || '01951530277';
  const position = helpline?.position || 'bottom-right';

  // Format clean phone for WhatsApp (digits only; if starts with 01, prepend 88)
  const cleanPhoneForWa = (num: string) => {
    let cleaned = num.replace(/[^0-9]/g, '');
    if (cleaned.startsWith('01')) {
      cleaned = '88' + cleaned;
    }
    return cleaned;
  };

  const cleanMessengerUrl = (input: string) => {
    if (!input) return '';
    if (input.startsWith('http://') || input.startsWith('https://')) {
      return input;
    }
    const cleanUser = input.replace(/^@/, '').trim();
    return `https://m.me/${cleanUser}`;
  };

  const waUrl = whatsappNumber
    ? `https://wa.me/${cleanPhoneForWa(whatsappNumber)}?text=${encodeURIComponent(whatsappMessage)}`
    : null;
  const messengerUrl = messengerUsername ? cleanMessengerUrl(messengerUsername) : null;
  const callUrl = phoneNumber ? `tel:${phoneNumber.replace(/[^0-9+]/g, '')}` : null;

  const positionClasses = position === 'bottom-left'
    ? 'left-4 sm:left-6 items-start'
    : 'right-4 sm:right-6 items-end';

  return (
    <div
      className={`fixed bottom-20 lg:bottom-6 ${positionClasses} z-40 flex flex-col gap-3 select-none`}
      aria-label="Helpline & Customer Support"
    >
      {/* Floating Action Buttons Stack (Visible when open) */}
      <div
        className={`flex flex-col gap-2.5 transition-all duration-300 ease-out ${
          isOpen
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 translate-y-4 pointer-events-none'
        } ${position === 'bottom-left' ? 'items-start' : 'items-end'}`}
      >
        {/* WhatsApp Button */}
        {waUrl && (
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2.5 hover:scale-105 active:scale-95 transition-all duration-200"
            title="WhatsApp চ্যাট"
          >
            {position === 'bottom-right' && (
              <span className="hidden sm:inline-block px-3 py-1.5 rounded-full bg-white dark:bg-card text-gray-800 dark:text-gray-100 text-xs font-semibold shadow-md border border-gray-100 dark:border-gray-800">
                WhatsApp এ চ্যাট করুন
              </span>
            )}

            <div className="w-12 h-12 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg shadow-[#25D366]/40 hover:brightness-110 transition-all">
              {/* Official WhatsApp SVG Icon */}
              <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.698.077-2.18-.538-1.764-.73-2.883-2.53-2.97-2.646-.088-.117-.714-.951-.714-1.815 0-.865.452-1.291.614-1.467.161-.176.352-.22.47-.22.119 0 .237.002.34.007.108.005.253-.042.395.3.144.347.49 1.196.533 1.284.043.088.072.191.014.307-.058.117-.087.19-.174.292-.087.103-.184.23-.263.309-.089.088-.182.184-.078.362.103.178.46 76.76.99 1.233.684.61 1.261.799 1.439.887.177.088.281.077.385-.043.104-.12.443-.517.562-.693.118-.176.236-.146.394-.088.158.059 1.002.472 1.174.558.173.086.289.13.332.202.043.072.043.418-.101.823z" />
                <path d="M12 2C6.477 2 2 6.477 2 12c0 1.891.524 3.662 1.435 5.183L2.05 22l4.98-1.306A9.957 9.957 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.2c-1.637 0-3.155-.494-4.422-1.343l-.317-.212-3.129.82.835-3.05-.207-.329A8.163 8.163 0 013.8 12c0-4.521 3.679-8.2 8.2-8.2 4.521 0 8.2 3.679 8.2 8.2 0 4.521-3.679 8.2-8.2 8.2z" />
              </svg>
            </div>

            {position === 'bottom-left' && (
              <span className="hidden sm:inline-block px-3 py-1.5 rounded-full bg-white dark:bg-card text-gray-800 dark:text-gray-100 text-xs font-semibold shadow-md border border-gray-100 dark:border-gray-800">
                WhatsApp এ চ্যাট করুন
              </span>
            )}
          </a>
        )}

        {/* Messenger Button */}
        {messengerUrl && (
          <a
            href={messengerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2.5 hover:scale-105 active:scale-95 transition-all duration-200"
            title="Messenger চ্যাট"
          >
            {position === 'bottom-right' && (
              <span className="hidden sm:inline-block px-3 py-1.5 rounded-full bg-white dark:bg-card text-gray-800 dark:text-gray-100 text-xs font-semibold shadow-md border border-gray-100 dark:border-gray-800">
                Messenger এ নক দিন
              </span>
            )}

            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#00C6FF] via-[#0078FF] to-[#A800FF] text-white flex items-center justify-center shadow-lg shadow-blue-500/30 hover:brightness-110 transition-all">
              {/* Official Messenger SVG Icon */}
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <path d="M12 2C6.477 2 2 6.145 2 11.258c0 2.914 1.455 5.517 3.735 7.152V22l3.435-1.89c.895.248 1.845.382 2.83.382 5.523 0 10-4.145 10-9.258C22 6.145 17.523 2 12 2zm1.055 12.445l-2.695-2.875-5.26 2.875 5.79-6.145 2.76 2.875 5.195-2.875-5.79 6.145z" />
              </svg>
            </div>

            {position === 'bottom-left' && (
              <span className="hidden sm:inline-block px-3 py-1.5 rounded-full bg-white dark:bg-card text-gray-800 dark:text-gray-100 text-xs font-semibold shadow-md border border-gray-100 dark:border-gray-800">
                Messenger এ নক দিন
              </span>
            )}
          </a>
        )}

        {/* Direct Call Button (if phone exists) */}
        {callUrl && (
          <a
            href={callUrl}
            className="group flex items-center gap-2.5 hover:scale-105 active:scale-95 transition-all duration-200"
            title="সরাসরি কল করুন"
          >
            {position === 'bottom-right' && (
              <span className="hidden sm:inline-block px-3 py-1.5 rounded-full bg-white dark:bg-card text-gray-800 dark:text-gray-100 text-xs font-semibold shadow-md border border-gray-100 dark:border-gray-800">
                সরাসরি কল: {phoneNumber}
              </span>
            )}

            <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/40 hover:brightness-110 transition-all">
              <Phone className="w-5 h-5" />
            </div>

            {position === 'bottom-left' && (
              <span className="hidden sm:inline-block px-3 py-1.5 rounded-full bg-white dark:bg-card text-gray-800 dark:text-gray-100 text-xs font-semibold shadow-md border border-gray-100 dark:border-gray-800">
                সরাসরি কল: {phoneNumber}
              </span>
            )}
          </a>
        )}
      </div>

      {/* Main Toggle Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`relative w-13 h-13 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-white shadow-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-primary/20 ${
          isOpen
            ? 'bg-gray-800 hover:bg-gray-900 rotate-90 scale-95 shadow-gray-800/40'
            : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/40 hover:scale-105 active:scale-95'
        }`}
        aria-label={isOpen ? 'Close helpline menu' : 'Open helpline menu'}
      >
        {/* Pulsing ripple animation when closed */}
        {!isOpen && (
          <>
            <span className="absolute -inset-1 rounded-full bg-emerald-500/30 animate-ping pointer-events-none" />
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-white dark:border-gray-900" />
          </>
        )}

        {isOpen ? (
          <X className="w-6 h-6 transition-transform duration-200" />
        ) : (
          <Headphones className="w-6 h-6 transition-transform duration-200" />
        )}
      </button>
    </div>
  );
};

export default FloatingHelpline;
