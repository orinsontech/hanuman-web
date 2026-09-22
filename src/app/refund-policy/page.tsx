import LegalPage from '@/components/LegalPage';

export const metadata = {
  title: 'रिफंड नीति (Refund Policy) | हनुमान स्तुति साधना',
};

export default function RefundPolicyPage() {
  return (
    <LegalPage title="रिफंड नीति" updatedOn="22 सितंबर 2026">
      <section className="rounded-xl border-2 border-red-200 bg-red-50 p-4">
        <p className="font-bold text-red-700">
          ⚠️ कृपया ध्यान दें: हमारी सभी सेवाएं <u>डिजिटल</u> हैं और भुगतान होते ही तुरंत activate हो जाती हैं। इसलिए <strong>किसी भी प्लान (40-दिन साधना, 1 साल एक्सेस, या Lifetime) पर किसी भी परिस्थिति में कोई रिफंड नहीं दिया जाएगा।</strong>
        </p>
      </section>

      <section>
        <h2 className="font-bold text-orange-900 text-base mb-2">1. No Refund Policy</h2>
        <p>
          चूंकि हमारा उत्पाद एक <strong>तुरंत उपलब्ध डिजिटल साधना कार्यक्रम</strong> है (कोई भौतिक वस्तु नहीं), भुगतान सफल होने और अकाउंट activate होने के बाद निम्नलिखित किसी भी कारण से रिफंड नहीं दिया जाएगा:
        </p>
        <ul className="list-disc pl-5 space-y-1 mt-2">
          <li>मन बदल जाना (change of mind)</li>
          <li>साधना पूरी न कर पाना या बीच में छोड़ देना</li>
          <li>अपेक्षित परिणाम/मनोकामना पूर्ति न होना</li>
          <li>गलत प्लान चुन लेना (कृपया भुगतान से पहले सही प्लान चुनें)</li>
          <li>अकाउंट का कम उपयोग करना</li>
        </ul>
      </section>

      <section>
        <h2 className="font-bold text-orange-900 text-base mb-2">2. कोई कैंसिलेशन नहीं</h2>
        <p>
          चूंकि प्लान एकमुश्त (one-time) भुगतान हैं और कोई subscription नहीं है, इसमें &quot;कैंसिल करने&quot; जैसा कोई विकल्प लागू नहीं होता — भुगतान के साथ ही सेवा पूरी तरह से delivered मानी जाती है।
        </p>
      </section>

      <section>
        <h2 className="font-bold text-orange-900 text-base mb-2">3. तकनीकी गड़बड़ी या डुप्लिकेट भुगतान</h2>
        <p>
          अगर तकनीकी खराबी के कारण आपसे <strong>एक ही plan के लिए एक से ज़्यादा बार पैसा कट गया हो</strong> (duplicate/double charge), तो यह हमारी नीति के तहत अपवाद है — ऐसी स्थिति में payment proof के साथ हमें <strong>7 दिन के अंदर</strong> संपर्क करें। सत्यापन के बाद अतिरिक्त कटी हुई राशि 7-10 कार्यदिवस में उसी भुगतान माध्यम (Razorpay/बैंक) में वापस कर दी जाएगी।
        </p>
      </section>

      <section>
        <h2 className="font-bold text-orange-900 text-base mb-2">4. संपर्क</h2>
        <p>
          रिफंड नीति से जुड़े किसी भी सवाल के लिए नीचे दिए गए ईमेल या WhatsApp पर संपर्क करें।
        </p>
      </section>
    </LegalPage>
  );
}
