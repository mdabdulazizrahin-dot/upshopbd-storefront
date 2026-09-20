import { Link } from 'react-router-dom';
import { Phone, MapPin, Mail } from 'lucide-react';
import { useSiteSettingsContext } from '@/contexts/SiteSettingsContext';
import { FooterColumn } from '@/hooks/useSiteSettings';

export const defaultFooterColumns: FooterColumn[] = [
  {
    id: 'col-1',
    title: 'কোম্পানি',
    links: [
      { id: '1', title: 'আমাদের সম্পর্কে', url: '/about' },
      { id: '2', title: 'টার্মস এন্ড কন্ডিশন', url: '/terms-conditions' },
      { id: '3', title: 'গোপনীয়তা নীতি', url: '/privacy-policy' },
      { id: '4', title: 'যোগাযোগের ঠিকানা', url: '/contact' },
    ],
  },
  {
    id: 'col-2',
    title: 'ই-কমার্স',
    links: [
      { id: '5', title: 'সেলস ক্যাম্পেইন', url: '/shop' },
      { id: '6', title: 'ফেভারিট প্রোডাক্ট', url: '/wishlist' },
      { id: '7', title: 'অর্ডার & রিটার্ন পলিসি', url: '/return-policy' },
      { id: '8', title: 'অর্ডার ট্র্যাক করুন', url: '/track-order' },
    ],
  },
  {
    id: 'col-3',
    title: 'কাস্টমার',
    links: [
      { id: '9', title: 'লগইন', url: '/login' },
      { id: '10', title: 'রেজিস্ট্রেশন', url: '/login?mode=register' },
      { id: '11', title: 'সাধারণ জিজ্ঞাসা', url: '/faq' },
      { id: '12', title: 'আমার অর্ডার', url: '/profile' },
    ],
  },
];

const Footer = () => {
  const { settings } = useSiteSettingsContext();

  const siteName = settings.footer?.aboutTitle || settings.general?.siteName || 'UpShop BD';
  const aboutDescription = settings.footer?.aboutDescription;
  const phone = settings.footer?.customPhone || settings.general?.phone || '+880 1700-000000';
  const address = settings.footer?.customAddress || settings.general?.address || 'Dhanmondi, Dhaka-1205, Bangladesh';
  const email = settings.footer?.customEmail || settings.general?.email;
  const showPhone = settings.footer?.showPhone !== false;
  const showAddress = settings.footer?.showAddress !== false;
  const showEmail = settings.footer?.showEmail === true && Boolean(email);

  const copyrightText = settings.footer?.copyrightText || `Copyright © ${new Date().getFullYear()} All Rights by ${siteName}.`;

  const backgroundColor = settings.footer?.backgroundColor || '#70c332';
  const textColor = settings.footer?.textColor || '#ffffff';

  const bgStyle = backgroundColor.startsWith('#') ? backgroundColor : `hsl(${backgroundColor})`;
  const textStyle = textColor.startsWith('#') ? textColor : `hsl(${textColor})`;

  const columns: FooterColumn[] = (settings.footer?.columns && settings.footer.columns.length > 0)
    ? settings.footer.columns
    : defaultFooterColumns;

  // Flatten all links for mobile view
  const allLinks = columns.flatMap(c => c.links || []);

  const getGridColsClass = () => {
    const totalCols = 1 + columns.length;
    if (totalCols <= 2) return 'grid-cols-1 sm:grid-cols-2';
    if (totalCols === 3) return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3';
    if (totalCols === 4) return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-4';
    if (totalCols >= 5) return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5';
    return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-4';
  };

  const renderLink = (link: { title: string; url: string }, key: string | number) => {
    const isExternal = link.url.startsWith('http://') || link.url.startsWith('https://');
    if (isExternal) {
      return (
        <a
          key={key}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="relative group inline-block py-0.5 hover:opacity-100 transition-opacity"
        >
          <span>{link.title}</span>
          <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-current rounded-full group-hover:w-full transition-all duration-300" />
        </a>
      );
    }
    return (
      <Link
        key={key}
        to={link.url}
        className="relative group inline-block py-0.5 hover:opacity-100 transition-opacity"
      >
        <span>{link.title}</span>
        <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-current rounded-full group-hover:w-full transition-all duration-300" />
      </Link>
    );
  };

  return (
    <footer className="mt-16 relative" style={{ backgroundColor: bgStyle, color: textStyle }}>
      {/* Top Brand Accent Line */}
      <div className="h-[3px] w-full bg-gradient-to-r from-white/20 via-white/80 to-white/20" />

      {/* Mobile View */}
      <div className="sm:hidden">
        <div className="container-custom py-6 space-y-4">
          <div className="text-center">
            <h3 className="text-lg font-bold">{siteName}</h3>
            {aboutDescription && (
              <p className="text-xs opacity-85 mt-1 px-4 leading-relaxed">{aboutDescription}</p>
            )}
          </div>

          {(showPhone || showAddress || showEmail) && (
            <div className="flex flex-col items-center gap-1.5 text-xs opacity-90 text-center">
              {showPhone && (
                <a href={`tel:${phone.replace(/[^0-9+]/g, '')}`} className="flex items-center gap-1.5 hover:underline">
                  <Phone className="h-3.5 w-3.5 flex-shrink-0" />
                  <span>{phone}</span>
                </a>
              )}
              {showAddress && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                  <span>{address}</span>
                </div>
              )}
              {showEmail && (
                <a href={`mailto:${email}`} className="flex items-center gap-1.5 hover:underline">
                  <Mail className="h-3.5 w-3.5 flex-shrink-0" />
                  <span>{email}</span>
                </a>
              )}
            </div>
          )}

          {/* Quick Links list on Mobile */}
          <div className="flex flex-wrap justify-center items-center gap-x-3 gap-y-2 text-sm pt-2 border-t border-white/15">
            {allLinks.map((link, idx) => (
              <span key={link.id || idx} className="inline-flex items-center gap-2">
                {idx > 0 && <span className="opacity-40 text-xs">|</span>}
                {renderLink(link, link.id || idx)}
              </span>
            ))}
          </div>

          <div className="text-center text-xs pt-3 border-t border-white/20 opacity-80">
            <p>{copyrightText}</p>
          </div>
        </div>
      </div>

      {/* Desktop View */}
      <div className="hidden sm:block">
        <div className="container-custom py-10">
          <div className={`grid ${getGridColsClass()} gap-8`}>
            {/* Brand & Contact */}
            <div>
              <div className="relative inline-block pb-1 mb-2">
                <h3 className="text-xl font-bold">{siteName}</h3>
                <div className="w-12 h-[2.5px] bg-current rounded-full mt-1 opacity-80" />
              </div>
              {aboutDescription && (
                <p className="text-sm opacity-85 mt-2 mb-3 leading-relaxed">
                  {aboutDescription}
                </p>
              )}
              <ul className="mt-4 space-y-2.5 text-sm">
                {showPhone && (
                  <li className="flex items-center gap-2">
                    <Phone className="h-4 w-4 flex-shrink-0" />
                    <a href={`tel:${phone.replace(/[^0-9+]/g, '')}`} className="hover:underline">
                      কল করুনঃ {phone}
                    </a>
                  </li>
                )}
                {showAddress && (
                  <li className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>ঠিকানাঃ {address}</span>
                  </li>
                )}
                {showEmail && (
                  <li className="flex items-center gap-2">
                    <Mail className="h-4 w-4 flex-shrink-0" />
                    <a href={`mailto:${email}`} className="hover:underline">
                      ইমেইলঃ {email}
                    </a>
                  </li>
                )}
              </ul>
            </div>

            {/* Dynamic Link Columns */}
            {columns.map((col, cIdx) => (
              <div key={col.id || cIdx}>
                <div className="relative inline-block pb-1 mb-2">
                  <h4 className="text-lg font-semibold">{col.title}</h4>
                  <div className="w-10 h-[2.5px] bg-current rounded-full mt-1 opacity-80" />
                </div>
                <ul className="mt-4 space-y-2 text-sm">
                  {col.links && col.links.map((link, lIdx) => (
                    <li key={link.id || lIdx}>
                      {renderLink(link, link.id || lIdx)}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div className="py-4 text-center text-sm border-t border-white/20">
          <p>{copyrightText}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
