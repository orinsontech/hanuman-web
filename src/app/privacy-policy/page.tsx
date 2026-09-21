import LegalPage from '@/components/LegalPage';

export const metadata = {
  title: 'गोपनीयता नीति (Privacy Policy) | हनुमान स्तुति साधना',
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPage title="गोपनीयता नीति" updatedOn="22 सितंबर 2026">
      <section>
        <p>
          यह गोपनीयता नीति बताती है कि <strong>हनुमान स्तुति साधना</strong> (BhaktiAmrit द्वारा संचालित) आपकी जानकारी कैसे एकत्र, उपयोग और सुरक्षित करता है, जब आप हमारी वेबसाइट का उपयोग करते हैं।
        </p>
      </section>

      <section>
        <h2 className="font-bold text-orange-900 text-base mb-2">1. हम कौन सी जानकारी लेते हैं</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>आपका <strong>मोबाइल नंबर</strong> और <strong>नाम</strong> — रजिस्ट्रेशन और OTP लॉगिन के लिए</li>
          <li>आपकी <strong>साधना प्रगति</strong> (कौन-सा दिन पूरा किया) — ट्रैकिंग और सर्टिफिकेट के लिए</li>
          <li><strong>भुगतान जानकारी</strong> — भुगतान हमारे payment partner <strong>Razorpay</strong> द्वारा सीधे प्रोसेस होता है; हम आपके कार्ड/UPI विवरण न तो देखते हैं और न ही स्टोर करते हैं</li>
          <li><strong>डिवाइस और उपयोग डेटा</strong> (जैसे browser, IP address) — सुरक्षा और वेबसाइट सुधार के लिए</li>
          <li><strong>Cookies</strong> — लॉगिन सेशन बनाए रखने के लिए (httpOnly, secure)</li>
        </ul>
      </section>

      <section>
        <h2 className="font-bold text-orange-900 text-base mb-2">2. जानकारी का उपयोग कैसे होता है</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>OTP के ज़रिए आपकी पहचान verify करने के लिए</li>
          <li>आपकी 40-दिन की साधना और प्लान (Trial / 40-दिन / Lifetime) को track करने के लिए</li>
          <li>साधना पूरी होने पर डिजिटल सर्टिफिकेट बनाने के लिए</li>
          <li>ग्राहक सहायता (customer support) देने के लिए</li>
          <li>विज्ञापन प्रदर्शन मापने के लिए हम Meta (Facebook) Pixel और Conversions API का उपयोग करते हैं — इसके लिए आपका मोबाइल नंबर encrypted (hashed) रूप में Meta को भेजा जा सकता है</li>
        </ul>
      </section>

      <section>
        <h2 className="font-bold text-orange-900 text-base mb-2">3. जानकारी किसके साथ साझा होती है</h2>
        <p>
          हम आपकी जानकारी कभी नहीं बेचते। हम केवल इन trusted service partners के साथ ज़रूरत भर की जानकारी साझा करते हैं:
        </p>
        <ul className="list-disc pl-5 space-y-1 mt-2">
          <li><strong>Razorpay</strong> — भुगतान प्रोसेसिंग के लिए</li>
          <li><strong>MeraOTP</strong> — SMS/OTP भेजने के लिए</li>
          <li><strong>Meta (Facebook)</strong> — विज्ञापन मापन के लिए (केवल encrypted data)</li>
        </ul>
      </section>

      <section>
        <h2 className="font-bold text-orange-900 text-base mb-2">4. डेटा सुरक्षा</h2>
        <p>
          आपका लॉगिन सेशन encrypted token के ज़रिए httpOnly cookie में सुरक्षित रहता है। हमारा डेटाबेस access सीमित और सुरक्षित है।
        </p>
      </section>

      <section>
        <h2 className="font-bold text-orange-900 text-base mb-2">5. आपके अधिकार</h2>
        <p>
          आप कभी भी अपनी जानकारी देखने, सही करवाने या अपना अकाउंट/डेटा डिलीट करवाने के लिए हमसे नीचे दिए गए संपर्क पर लिख सकते हैं।
        </p>
      </section>

      <section>
        <h2 className="font-bold text-orange-900 text-base mb-2">6. नीति में बदलाव</h2>
        <p>
          हम समय-समय पर इस नीति को अपडेट कर सकते हैं। कोई भी बड़ा बदलाव इसी पेज पर दिखाया जाएगा।
        </p>
      </section>
    </LegalPage>
  );
}
