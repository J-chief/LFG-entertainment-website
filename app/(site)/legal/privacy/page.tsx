'use client';

export default function PrivacyPolicyPage() {
  return (
    <div className="w-full bg-black min-h-screen text-white py-20 px-6 md:px-12 max-w-4xl mx-auto">
      <span className="text-xs tracking-wide-accent text-gray-500 font-display block mb-2 uppercase">
        ○ LEGAL DOCUMENTS
      </span>
      <h1 className="text-3xl md:text-5xl font-display font-black tracking-tight uppercase mb-12">
        Privacy Policy
      </h1>

      <div className="text-gray-400 text-xs md:text-sm space-y-6 leading-relaxed font-sans">
        <p className="font-bold text-white uppercase font-display text-[10px] tracking-widest">
          Last Updated: July 10, 2026
        </p>
        
        <p>
          At LFG Entertainment, we respect your privacy and are committed to protecting your personal data. This privacy policy describes how we collect, use, process, and disclose your information, including personal data, in coordination with your access to and use of the LFG website and ticketing systems.
        </p>

        <h3 className="text-sm font-display font-bold text-white uppercase tracking-wider pt-4">
          1. Data We Collect
        </h3>
        <p>
          We collect personal data that you provide to us directly when purchasing tickets or joining LFG Nation. This includes: name, email address, phone number, and transaction details. We do not store or process credit/debit card information on our servers; payments are processed securely by external, fully-certified payment processors.
        </p>

        <h3 className="text-sm font-display font-bold text-white uppercase tracking-wider pt-4">
          2. How We Use Data
        </h3>
        <p>
          We use your data to: process ticket orders, dispatch receipt records and ticket PDF files containing QR entry codes, verify tickets at the gates of our events, and send you email updates/presale notifications if you join LFG Nation or sign up to our newsletter.
        </p>

        <h3 className="text-sm font-display font-bold text-white uppercase tracking-wider pt-4">
          3. Data Sharing & Storage
        </h3>
        <p>
          We do not sell, rent, or lease your personal information to third parties. We may share information with certified service providers who perform services on our behalf (such as dispatching emails or payment gateways), strictly limited to fulfilling order actions. Data is retained only for as long as necessary to provide transactional history or event validation.
        </p>
      </div>
    </div>
  );
}
