import Link from 'next/link';
import LegalPage from '@/components/LegalPage';

export const metadata = {
  title: 'नियम एवं शर्तें (Terms & Conditions) | हनुमान स्तुति साधना',
};

export default function TermsPage() {
  return (
    <LegalPage title="नियम एवं शर्तें" updatedOn="22 सितंबर 2026">
      <section>
        <p>
          इस वेबसाइट (<strong>हनुमान स्तुति साधना</strong>, BhaktiAmrit द्वारा संचालित) का उपयोग करके, आप नीचे दी गई शर्तों से सहमत होते हैं। कृपया इन्हें ध्यान से पढ़ें।
        </p>
      </section>

      <section>
        <h2 className="font-bold text-orange-900 text-base mb-2">1. सेवा का विवरण</h2>
        <p>
          हम एक <strong>डिजिटल ऑडियो साधना कार्यक्रम</strong> प्रदान करते हैं — हनुमान चालीसा स्तुति की 40-दिन की श्रृंखला, प्रगति ट्रैकर और डिजिटल सर्टिफिकेट के साथ। यह पूर्णतः एक डिजिटल सेवा है, कोई भौतिक वस्तु नहीं भेजी जाती।
        </p>
      </section>

      <section>
        <h2 className="font-bold text-orange-900 text-base mb-2">2. प्लान और भुगतान</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>3-दिन ट्रायल — ₹11:</strong> पहले 3 दिन की स्तुति तक पहुंच</li>
          <li><strong>40-दिन साधना — ₹199:</strong> पूरे 40 दिन की स्तुति तक एक बार पहुंच</li>
          <li><strong>Lifetime — ₹349:</strong> पूरे 40 दिन तक जीवनभर पहुंच, पूरा होने पर दोबारा शुरू करने की सुविधा</li>
        </ul>
        <p className="mt-2">
          सभी भुगतान <strong>Razorpay</strong> के माध्यम से सुरक्षित रूप से प्रोसेस होते हैं और भारतीय रुपये (INR) में लिए जाते हैं। ये एकमुश्त (one-time) भुगतान हैं, कोई recurring subscription नहीं है। भुगतान सफल होते ही आपका अकाउंट तुरंत activate हो जाता है।
        </p>
      </section>

      <section>
        <h2 className="font-bold text-orange-900 text-base mb-2">3. उपयोग की शर्तें</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>रजिस्ट्रेशन के समय दी गई जानकारी (मोबाइल नंबर, नाम) सही होनी चाहिए</li>
          <li>अपना अकाउंट किसी और के साथ साझा न करें</li>
          <li>यह content केवल आपके व्यक्तिगत उपयोग के लिए है — पुनः बिक्री, वितरण या सार्वजनिक प्रकाशन की अनुमति नहीं है</li>
        </ul>
      </section>

      <section>
        <h2 className="font-bold text-orange-900 text-base mb-2">4. सर्टिफिकेट</h2>
        <p>
          डिजिटल सर्टिफिकेट तभी उपलब्ध होता है जब आप अपने प्लान के अंतर्गत पूरे 40 दिन की साधना सफलतापूर्वक पूरी कर लेते हैं (Trial प्लान में यह उपलब्ध नहीं है जब तक अपग्रेड न करें)।
        </p>
      </section>

      <section>
        <h2 className="font-bold text-orange-900 text-base mb-2">5. अस्वीकरण (Disclaimer)</h2>
        <p>
          यह एक श्रद्धा-आधारित आध्यात्मिक/भक्ति कार्यक्रम है। हम किसी विशेष परिणाम, मनोकामना पूर्ति या चमत्कार की गारंटी नहीं देते — परिणाम श्रद्धा, नियमितता और व्यक्तिगत परिस्थितियों पर निर्भर करते हैं।
        </p>
      </section>

      <section>
        <h2 className="font-bold text-orange-900 text-base mb-2">6. रिफंड और कैंसिलेशन</h2>
        <p>
          कृपया हमारी <Link href="/refund-policy" className="text-orange-600 underline font-semibold">रिफंड नीति</Link> पढ़ें। सामान्यतः, चूंकि यह एक डिजिटल सेवा है जो भुगतान के तुरंत बाद activate हो जाती है, इसलिए कोई रिफंड या कैंसिलेशन उपलब्ध नहीं है।
        </p>
      </section>

      <section>
        <h2 className="font-bold text-orange-900 text-base mb-2">7. दायित्व की सीमा</h2>
        <p>
          हम इस सेवा के उपयोग से उत्पन्न किसी अप्रत्यक्ष, आकस्मिक या परिणामी हानि के लिए उत्तरदायी नहीं होंगे। सेवा &quot;जैसी है&quot; (as-is) आधार पर प्रदान की जाती है।
        </p>
      </section>

      <section>
        <h2 className="font-bold text-orange-900 text-base mb-2">8. लागू कानून</h2>
        <p>
          ये शर्तें भारतीय कानून के अंतर्गत शासित होंगी।
        </p>
      </section>

      <section>
        <h2 className="font-bold text-orange-900 text-base mb-2">9. शर्तों में बदलाव</h2>
        <p>
          हम समय-समय पर इन शर्तों को अपडेट कर सकते हैं। नवीनतम संस्करण हमेशा इसी पेज पर उपलब्ध रहेगा।
        </p>
      </section>
    </LegalPage>
  );
}
