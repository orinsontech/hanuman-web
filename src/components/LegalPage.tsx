import Link from 'next/link';

export default function LegalPage({
  title,
  updatedOn,
  children,
}: {
  title: string;
  updatedOn: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen" style={{ background: '#FFF8F0' }}>
      <div className="hero-bg py-10 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 select-none text-[200px] flex items-center justify-center leading-none text-yellow-300">🙏</div>
        <Link href="/" className="inline-flex items-center gap-1 text-orange-200 hover:text-white text-sm mb-4 relative z-10 transition-colors">
          ← होम पर वापस जाएं
        </Link>
        <p className="font-devanagari text-yellow-300 text-lg font-bold relative z-10">॥ जय बजरंग बली ॥</p>
        <h1 className="text-2xl md:text-3xl font-bold text-white mt-1 relative z-10">{title}</h1>
        <p className="text-orange-200 text-xs mt-1 relative z-10">अंतिम अपडेट: {updatedOn}</p>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="bg-white rounded-2xl shadow-md border border-orange-100 p-6 md:p-8 space-y-6 text-amber-900 text-sm leading-relaxed">
          {children}
        </div>

        <div className="text-center mt-8 text-xs text-amber-600">
          <p>कोई सवाल? हमसे संपर्क करें:</p>
          <p className="mt-1">
            📧 <a href="mailto:seva@bhaktiamrit.com" className="underline hover:text-orange-600">seva@bhaktiamrit.com</a>
            {' '}·{' '}
            💬 <a href="https://wa.me/919776307793" target="_blank" rel="noopener noreferrer" className="underline hover:text-orange-600">+91 97763 07793 (WhatsApp)</a>
          </p>
          <p className="mt-3">Powered by BhaktiAmrit</p>
        </div>
      </div>
    </div>
  );
}
