import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service | Warehouse Worker Resume Generator",
  description: "Read our Terms of Service to understand the rules and guidelines for using our resume generator platform.",
  keywords: "terms of service, user agreement, legal terms, terms and conditions",
};

export default function TermsOfServicePage() {
  const lastUpdated = "February 16, 2025";

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-slate-50">
      {/* Header */}
      <section className="bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Terms of Service
          </h1>
          <p className="text-xl text-blue-100">
            Please read these terms carefully before using our services.
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
              <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Acceptance of Terms</h2>
              <p className="text-slate-700 mb-4">
                By accessing or using Warehouse Worker Resume Generator ("Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use our Service.
              </p>
              <p className="text-slate-700">
                These Terms constitute a legally binding agreement between you and Warehouse Worker Resume Generator. We reserve the right to modify these Terms at any time, and your continued use of the Service constitutes acceptance of any changes.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Description of Service</h2>
              <p className="text-slate-700 mb-4">
                Warehouse Worker Resume Generator provides an AI-powered resume building service that allows users to:
              </p>
              <ul className="list-disc pl-6 mb-4 text-slate-700 space-y-2">
                <li>Generate professional resumes using artificial intelligence</li>
                <li>Choose from multiple resume templates</li>
                <li>Download resumes in PDF format</li>
                <li>Save and edit resumes</li>
                <li>Access career resources and blog content</li>
              </ul>
              <p className="text-slate-700">
                We reserve the right to modify, suspend, or discontinue any aspect of the Service at any time.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">3. User Accounts</h2>

              <h3 className="text-xl font-semibold text-slate-900 mb-3">3.1 Account Creation</h3>
              <p className="text-slate-700 mb-4">To use certain features of the Service, you may be required to:</p>
              <ul className="list-disc pl-6 mb-4 text-slate-700 space-y-2">
                <li>Create an account with a valid email address</li>
                <li>Provide accurate and complete information</li>
                <li>Maintain and update your account information</li>
                <li>Keep your password secure and confidential</li>
              </ul>

              <h3 className="text-xl font-semibold text-slate-900 mb-3">3.2 Account Responsibilities</h3>
              <p className="text-slate-700 mb-4">You are responsible for all activities that occur under your account. You agree to:</p>
              <ul className="list-disc pl-6 mb-4 text-slate-700 space-y-2">
                <li>Notify us immediately of any unauthorized use</li>
                <li>Accept all risks of unauthorized access</li>
                <li>Not share your account credentials with others</li>
                <li>Take responsibility for all actions under your account</li>
              </ul>

              <div className="bg-red-50 border-l-4 border-red-500 p-4 mt-6">
                <p className="text-slate-700">
                  <strong>Warning:</strong> You are liable for any damage caused by failure to maintain account security.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Acceptable Use Policy</h2>

              <h3 className="text-xl font-semibold text-slate-900 mb-3">4.1 Permitted Use</h3>
              <p className="text-slate-700 mb-4">You agree to use the Service only for lawful purposes and in accordance with these Terms. You may:</p>
              <ul className="list-disc pl-6 mb-4 text-slate-700 space-y-2">
                <li>Create resumes for personal job applications</li>
                <li>Use the templates and content for legitimate career purposes</li>
                <li>Download and share resumes with potential employers</li>
                <li>Access our blog and educational resources</li>
              </ul>

              <h3 className="text-xl font-semibold text-slate-900 mb-3">4.2 Prohibited Activities</h3>
              <p className="text-slate-700 mb-4">You agree NOT to:</p>
              <ul className="list-disc pl-6 mb-4 text-slate-700 space-y-2">
                <li>Use the Service for any illegal purpose or fraud</li>
                <li>Generate resumes with false or misleading information</li>
                <li>Impersonate any person or entity</li>
                <li>Violate any local, state, national, or international law</li>
                <li>Transmit viruses or harmful code through the Service</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Interfere with or disrupt the Service or servers</li>
                <li>Use automated tools to abuse the Service (e.g., scraping, bots)</li>
                <li>Reverse engineer or attempt to extract source code</li>
                <li>Sell or redistribute resumes generated for others without permission</li>
                <li>Use the Service to create harassing, offensive, or inappropriate content</li>
              </ul>

              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mt-6">
                <p className="text-slate-700">
                  <strong>Violation of this policy may result in immediate account termination and legal action.</strong>
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Intellectual Property Rights</h2>

              <h3 className="text-xl font-semibold text-slate-900 mb-3">5.1 Our Content</h3>
              <p className="text-slate-700 mb-4">All content on the Service, including:</p>
              <ul className="list-disc pl-6 mb-4 text-slate-700 space-y-2">
                <li>Text, graphics, logos, and images</li>
                <li>Software and code</li>
                    <li>Resume templates and designs</li>
                <li>Website layout and interface</li>
                <li>Blog articles and educational content</li>
              </ul>
              <p className="text-slate-700 mb-4">
                is owned by Warehouse Worker Resume Generator and protected by copyright, trademark, and other intellectual property laws.
              </p>

              <h3 className="text-xl font-semibold text-slate-900 mb-3">5.2 Your Content</h3>
              <p className="text-slate-700 mb-4">
                You retain ownership of the personal information and resume content you provide. By submitting content to our Service, you grant us a license to:
              </p>
              <ul className="list-disc pl-6 mb-4 text-slate-700 space-y-2">
                <li>Store and process your content to provide the Service</li>
                <li>Display your resume in our interface</li>
                <li>Use aggregated, anonymized data for service improvement</li>
              </ul>
              <p className="text-slate-700">
                We do not claim ownership of your resume content or personal information.
              </p>

              <h3 className="text-xl font-semibold text-slate-900 mb-3">5.3 AI-Generated Content</h3>
              <p className="text-slate-700">
                Resumes generated using our AI-powered service are owned by you. You have full rights to use, modify, and distribute the generated resumes for personal and professional purposes.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">6. Payment Terms</h2>

              <h3 className="text-xl font-semibold text-slate-900 mb-3">6.1 Fees</h3>
              <p className="text-slate-700 mb-4">
                Certain features of the Service require payment. Our pricing is clearly displayed on the <Link href="/pricing" className="text-blue-600 hover:underline">Pricing page</Link>. By purchasing a paid plan, you agree to pay the specified fees.
              </p>

              <h3 className="text-xl font-semibold text-slate-900 mb-3">6.2 Payment Method</h3>
              <p className="text-slate-700 mb-4">
                Payments are processed securely through Stripe. We accept:
              </p>
              <ul className="list-disc pl-6 mb-4 text-slate-700 space-y-2">
                <li>Major credit cards (Visa, MasterCard, American Express, Discover)</li>
                <li>Debit cards</li>
                <li>Other payment methods as displayed on checkout</li>
              </ul>

              <h3 className="text-xl font-semibold text-slate-900 mb-3">6.3 Refund Policy</h3>
              <p className="text-slate-700 mb-4">
                We offer a 30-day satisfaction guarantee on Premium plans. If you are not satisfied with the Service:
              </p>
              <ul className="list-disc pl-6 mb-4 text-slate-700 space-y-2">
                <li>Contact our support team within 30 days of purchase</li>
                <li>Provide a reason for your refund request</li>
                <li>We will process your refund within 5-10 business days</li>
              </ul>
              <p className="text-slate-700">
                Refunds are processed to the original payment method. Basic and Free plans are non-refundable.
              </p>

              <h3 className="text-xl font-semibold text-slate-900 mb-3">6.4 No Recurring Billing</h3>
              <div className="bg-green-50 border-l-4 border-green-500 p-4 mt-6">
                <p className="text-slate-700">
                  <strong>Good news:</strong> We do NOT have recurring subscriptions. You pay once and have access to the specified features forever. No automatic renewals, no surprise charges.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">7. Disclaimer of Warranties</h2>
              <p className="text-slate-700 mb-4">
                THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO:
              </p>
              <ul className="list-disc pl-6 mb-4 text-slate-700 space-y-2">
                <li>MERCHANTABILITY</li>
                <li>FITNESS FOR A PARTICULAR PURPOSE</li>
                <li>NON-INFRINGEMENT</li>
                <li>ACCURACY OR RELIABILITY OF CONTENT</li>
                <li>AVAILABILITY OR UNINTERRUPTED OPERATION</li>
                <li>SECURITY OR VIRUS-FREE OPERATION</li>
              </ul>
              <p className="text-slate-700">
                We do not guarantee that the Service will meet your requirements or that it will be error-free. Use of the Service is at your own risk.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">8. Limitation of Liability</h2>
              <p className="text-slate-700 mb-4">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, WAREHOUSE WORKER RESUME GENERATOR SHALL NOT BE LIABLE FOR:
              </p>
              <ul className="list-disc pl-6 mb-4 text-slate-700 space-y-2">
                <li>INDIRECT, INCIDENTAL, SPECIAL, OR CONSEQUENTIAL DAMAGES</li>
                <li>LOSS OF PROFITS, DATA, OR BUSINESS OPPORTUNITIES</li>
                <li>DAMAGES EXCEEDING THE AMOUNT YOU PAID (IF ANY) FOR THE SERVICE</li>
                <li>JOB APPLICATION OUTCOMES OR EMPLOYMENT DECISIONS</li>
              </ul>
              <p className="text-slate-700">
                In no event shall our total liability exceed the amount paid by you, if any, for accessing the Service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">9. Termination</h2>

              <h3 className="text-xl font-semibold text-slate-900 mb-3">9.1 Termination by You</h3>
              <p className="text-slate-700 mb-4">
                You may terminate your account at any time by:
              </p>
              <ul className="list-disc pl-6 mb-4 text-slate-700 space-y-2">
                <li>Contacting customer support</li>
                <li>Deleting your account through the settings page</li>
                <li>Simply ceasing to use the Service</li>
              </ul>

              <h3 className="text-xl font-semibold text-slate-900 mb-3">9.2 Termination by Us</h3>
              <p className="text-slate-700 mb-4">
                We reserve the right to suspend or terminate your account immediately if:
              </p>
              <ul className="list-disc pl-6 mb-4 text-slate-700 space-y-2">
                <li>You violate these Terms</li>
                <li>You engage in fraudulent or illegal activity</li>
                <li>Your account poses a security risk</li>
                <li>We discontinue the Service</li>
              </ul>

              <h3 className="text-xl font-semibold text-slate-900 mb-3">9.3 Effect of Termination</h3>
              <p className="text-slate-700">
                Upon termination, your right to use the Service ceases immediately. We may delete your account data, but resumes you have downloaded will remain in your possession.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">10. Privacy Policy</h2>
              <p className="text-slate-700 mb-4">
                Your use of the Service is also governed by our <Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>, which explains how we collect, use, and protect your information.
              </p>
              <p className="text-slate-700">
                By using the Service, you agree to the collection and use of information as described in our Privacy Policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">11. Dispute Resolution</h2>

              <h3 className="text-xl font-semibold text-slate-900 mb-3">11.1 Governing Law</h3>
              <p className="text-slate-700 mb-4">
                These Terms are governed by and construed in accordance with the laws of the United States. Any disputes arising under these Terms shall be subject to the exclusive jurisdiction of the federal and state courts located in the United States.
              </p>

              <h3 className="text-xl font-semibold text-slate-900 mb-3">11.2 Arbitration</h3>
              <p className="text-slate-700">
                Any dispute, controversy, or claim arising out of or relating to these Terms shall be settled by binding arbitration in accordance with the rules of the American Arbitration Association.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">12. Indemnification</h2>
              <p className="text-slate-700 mb-4">
                You agree to indemnify, defend, and hold harmless Warehouse Worker Resume Generator and its affiliates, officers, directors, employees, and agents from and against any claims, damages, losses, liabilities, and expenses (including attorneys' fees) arising from:
              </p>
              <ul className="list-disc pl-6 mb-4 text-slate-700 space-y-2">
                <li>Your use of the Service</li>
                <li>Your violation of these Terms</li>
                <li>Your violation of any third-party rights</li>
                <li>Content you submit to the Service</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">13. Third-Party Links</h2>
              <p className="text-slate-700 mb-4">
                The Service may contain links to third-party websites or resources. We are not responsible for the content, policies, or practices of third-party sites. Your interactions with third parties are solely between you and that third party.
              </p>
              <p className="text-slate-700">
                We encourage you to review the privacy policies and terms of service of any third-party sites you visit.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">14. Modifications to Service</h2>
              <p className="text-slate-700 mb-4">
                We reserve the right to modify, suspend, or discontinue the Service (or any part thereof) at any time with or without notice. We will not be liable to you or any third party for any modification, suspension, or discontinuation of the Service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">15. Waiver and Severability</h2>
              <p className="text-slate-700 mb-4">
                Failure to enforce any right or provision of these Terms does not constitute a waiver of such right or provision. If any provision of these Terms is found to be unenforceable, the remaining provisions will remain in full force and effect.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">16. Entire Agreement</h2>
              <p className="text-slate-700">
                These Terms, together with our Privacy Policy, constitute the entire agreement between you and Warehouse Worker Resume Generator regarding the Service and supersede all prior agreements, communications, and proposals.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">17. Contact Information</h2>
              <p className="text-slate-700 mb-4">
                If you have any questions about these Terms, please contact us:
              </p>
              <div className="bg-slate-50 rounded-lg p-6 mt-4">
                <ul className="space-y-2 text-slate-700">
                  <li><strong>Email:</strong> legal@warehouseworkerresume.com</li>
                  <li><strong>Website:</strong> https://www.warehouseworkerresume.com</li>
                  <li><strong>Response Time:</strong> We typically respond within 5 business days</li>
                </ul>
              </div>
            </section>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mt-8">
              <p className="text-slate-700">
                <strong>Last Updated:</strong> {lastUpdated}. Please check back periodically for any changes to these Terms.
              </p>
            </div>
          </div>
        </div>
      </article>

      {/* CTA Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-12 text-white text-center shadow-xl">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            By using our service, you agree to these terms. Start building your professional resume today.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold text-lg hover:bg-blue-50 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
          >
            Create My Resume
          </Link>
        </div>
      </section>
    </main>
  );
}
