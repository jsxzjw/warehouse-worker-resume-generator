import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | Warehouse Worker Resume Generator",
  description: "Learn how we protect your personal information and respect your privacy. Our commitment to data security and user privacy.",
  keywords: "privacy policy, data protection, user privacy, GDPR compliance",
};

export default function PrivacyPolicyPage() {
  const lastUpdated = "February 16, 2025";

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-slate-50">
      {/* Header */}
      <section className="bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Privacy Policy
          </h1>
          <p className="text-xl text-blue-100">
            Your privacy is important to us. This policy explains how we collect, use, and protect your information.
          </p>
          <p className="text-sm text-blue-200 mt-4">
            Last Updated: {lastUpdated}
          </p>
        </div>
      </section>

      {/* Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 sm:p-12">
          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Introduction</h2>
              <p className="text-slate-700 mb-4">
                Welcome to Warehouse Worker Resume Generator ("we," "our," or "us"). We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services.
              </p>
              <p className="text-slate-700">
                By using our services, you agree to the collection and use of information in accordance with this policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Information We Collect</h2>

              <h3 className="text-xl font-semibold text-slate-900 mb-3">2.1 Personal Information</h3>
              <p className="text-slate-700 mb-4">We may collect personal information that you provide directly to us, including:</p>
              <ul className="list-disc pl-6 mb-4 text-slate-700 space-y-2">
                <li>Name and contact information (email address, phone number)</li>
                <li>Resume data (work history, education, skills, certifications)</li>
                <li>Payment information (processed securely through Stripe)</li>
                <li>Account credentials (if you create an account)</li>
                <li>Communication data (messages, support requests)</li>
              </ul>

              <h3 className="text-xl font-semibold text-slate-900 mb-3">2.2 Automatically Collected Information</h3>
              <p className="text-slate-700 mb-4">We automatically collect certain information when you use our services:</p>
              <ul className="list-disc pl-6 mb-4 text-slate-700 space-y-2">
                <li>Device information (IP address, browser type, operating system)</li>
                <li>Usage data (pages visited, features used, time spent)</li>
                <li>Cookies and similar tracking technologies</li>
                <li>Analytics data (traffic patterns, user behavior)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">3. How We Use Your Information</h2>
              <p className="text-slate-700 mb-4">We use the collected information for various purposes:</p>
              <ul className="list-disc pl-6 mb-4 text-slate-700 space-y-2">
                <li><strong>Service Delivery:</strong> To generate and customize your resume</li>
                <li><strong>Payment Processing:</strong> To process transactions and send payment confirmations</li>
                <li><strong>Account Management:</strong> To create and manage your account</li>
                <li><strong>Communication:</strong> To send updates, security alerts, and support messages</li>
                <li><strong>Improvement:</strong> To analyze usage patterns and improve our services</li>
                <li><strong>Marketing:</strong> To send promotional emails (with your consent)</li>
                <li><strong>Security:</strong> To detect, prevent, and address technical issues and fraud</li>
                <li><strong>Legal Compliance:</strong> To comply with legal obligations and enforce our terms</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Data Sharing and Disclosure</h2>

              <h3 className="text-xl font-semibold text-slate-900 mb-3">4.1 Third-Party Service Providers</h3>
              <p className="text-slate-700 mb-4">We share data with trusted third parties who assist us in operating our services:</p>
              <ul className="list-disc pl-6 mb-4 text-slate-700 space-y-2">
                <li><strong>Payment Processors:</strong> Stripe for secure payment processing</li>
                <li><strong>AI Services:</strong> OpenAI for resume generation</li>
                <li><strong>Hosting Services:</strong> Vercel for website hosting</li>
                <li><strong>Analytics:</strong> Google Analytics and similar services</li>
                <li><strong>Email Services:</strong> Resend for email communications</li>
              </ul>

              <h3 className="text-xl font-semibold text-slate-900 mb-3">4.2 When We Share Your Data</h3>
              <p className="text-slate-700 mb-4">We may share your information in the following circumstances:</p>
              <ul className="list-disc pl-6 mb-4 text-slate-700 space-y-2">
                <li>With your consent</li>
                <li>To comply with legal obligations</li>
                <li>To protect our rights and prevent fraud</li>
                <li>In connection with a business transfer or merger</li>
                <li>With affiliates subsidiaries with your consent</li>
              </ul>

              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mt-6">
                <p className="text-slate-700 font-semibold">
                  🔒 We never sell your personal data to third parties for marketing purposes.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Data Security</h2>
              <p className="text-slate-700 mb-4">We implement industry-standard security measures to protect your information:</p>
              <ul className="list-disc pl-6 mb-4 text-slate-700 space-y-2">
                <li><strong>Encryption:</strong> SSL/TLS encryption for data in transit</li>
                <li><strong>Secure Storage:</strong> Encrypted databases for data at rest</li>
                <li><strong>Access Controls:</strong> Restricted access to personal information</li>
                <li><strong>Regular Audits:</strong> Periodic security assessments</li>
                <li><strong>PCI Compliance:</strong> Payment card industry compliance for transactions</li>
              </ul>
              <p className="text-slate-700">
                However, no method of transmission over the Internet is 100% secure. While we strive to protect your data, we cannot guarantee absolute security.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">6. Data Retention</h2>
              <p className="text-slate-700 mb-4">
                We retain your personal information for as long as necessary to provide our services and fulfill the purposes outlined in this policy. Specifically:
              </p>
              <ul className="list-disc pl-6 mb-4 text-slate-700 space-y-2">
                <li><strong>Account Data:</strong> Retained while your account is active</li>
                <li><strong>Resumes:</strong> Stored indefinitely unless you delete them</li>
                <li><strong>Payment Data:</strong> Retained as required by law (typically 7 years)</li>
                <li><strong>Analytics Data:</strong> Aggregated and anonymized after 26 months</li>
              </ul>
              <p className="text-slate-700">
                You can request deletion of your data at any time by contacting us.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">7. Your Privacy Rights</h2>
              <p className="text-slate-700 mb-4">Depending on your location, you may have certain rights regarding your personal information:</p>
              <ul className="list-disc pl-6 mb-4 text-slate-700 space-y-2">
                <li><strong>Access:</strong> Request a copy of your personal data</li>
                <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                <li><strong>Deletion:</strong> Request deletion of your personal data</li>
                <li><strong>Portability:</strong> Receive your data in a structured format</li>
                <li><strong>Objection:</strong> Object to processing of your data</li>
                <li><strong>Restriction:</strong> Limit how we use your data</li>
                <li><strong>Withdraw Consent:</strong> Withdraw consent at any time</li>
              </ul>

              <div className="bg-green-50 border-l-4 border-green-500 p-4 mt-6">
                <p className="text-slate-700">
                  <strong>GDPR Rights:</strong> If you're in the EU, you have additional rights under GDPR. Contact us for more information.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">8. Cookies and Tracking</h2>
              <p className="text-slate-700 mb-4">
                We use cookies and similar tracking technologies to improve your experience, analyze usage, and deliver personalized content. You can control cookies through your browser settings.
              </p>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Types of Cookies We Use:</h3>
              <ul className="list-disc pl-6 mb-4 text-slate-700 space-y-2">
                <li><strong>Essential Cookies:</strong> Required for core functionality</li>
                <li><strong>Analytics Cookies:</strong> Help us understand how you use our services</li>
                <li><strong>Functionality Cookies:</strong> Remember your preferences</li>
                <li><strong>Marketing Cookies:</strong> Deliver relevant advertisements (with consent)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">9. Children's Privacy</h2>
              <p className="text-slate-700">
                Our services are not intended for children under 16 years of age. We do not knowingly collect personal information from children under 16. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">10. International Data Transfers</h2>
              <p className="text-slate-700">
                Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your data in accordance with this Privacy Policy and applicable laws.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">11. Changes to This Privacy Policy</h2>
              <p className="text-slate-700 mb-4">
                We may update this Privacy Policy from time to time. We will notify you of any changes by:
              </p>
              <ul className="list-disc pl-6 mb-4 text-slate-700 space-y-2">
                <li>Emailing you (if you have an account)</li>
                <li>Posting a notice on our website</li>
                <li>Updating the "Last Updated" date at the top of this policy</li>
              </ul>
              <p className="text-slate-700">
                Your continued use of our services after the effective date of the revised policy constitutes acceptance of the changes.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">12. Contact Us</h2>
              <p className="text-slate-700 mb-4">
                If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="bg-slate-50 rounded-lg p-6 mt-4">
                <ul className="space-y-2 text-slate-700">
                  <li><strong>Email:</strong> privacy@warehouseworkerresume.com</li>
                  <li><strong>Website:</strong> https://www.warehouseworkerresume.com</li>
                  <li><strong>Response Time:</strong> We typically respond within 5 business days</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">13. Legal Basis for Processing (GDPR)</h2>
              <p className="text-slate-700 mb-4">If you are in the European Union, we process your data on the following legal bases:</p>
              <ul className="list-disc pl-6 mb-4 text-slate-700 space-y-2">
                <li><strong>Contract:</strong> To fulfill our service agreement with you</li>
                <li><strong>Legitimate Interest:</strong> To improve our services and prevent fraud</li>
                <li><strong>Consent:</strong> When you explicitly agree to data processing</li>
                <li><strong>Legal Obligation:</strong> To comply with applicable laws</li>
              </ul>
            </section>

            <div className="bg-slate-100 rounded-lg p-6 mt-8">
              <p className="text-sm text-slate-600">
                This Privacy Policy is designed to comply with the General Data Protection Regulation (GDPR), California Consumer Privacy Act (CCPA), and other applicable privacy laws.
              </p>
            </div>
          </div>
        </div>
      </article>

      {/* CTA Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-12 text-white text-center shadow-xl">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Build Your Resume?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Your data is safe with us. Start creating your professional resume today.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold text-lg hover:bg-blue-50 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
          >
            Get Started Now
          </Link>
        </div>
      </section>
    </main>
  );
}
