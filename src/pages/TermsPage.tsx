import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const TermsPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-muted">
      <div className="sticky top-0 z-50">
        <Header />
      </div>
      <div className="flex-grow container mx-auto px-4 py-8">
        <Card className="max-w-4xl mx-auto">
          <CardContent className="p-8">
            <div className="prose prose-gray max-w-none">
              <h1 className="text-3xl font-bold mb-6 text-foreground">Skyhug Terms of Service</h1>
              
              <p className="text-muted-foreground mb-8">Last updated: [Insert date here]</p>

              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4 text-foreground">1. Acceptance of Terms</h2>
                <p className="text-muted-foreground leading-relaxed">
                  By accessing and using Skyhug's services ("Skyhug," "we," "our," or "us"), including our text and voice chat applications (the "Services"), you ("User," "you," or "your") agree to comply with and be bound by these Terms of Service ("Terms").
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4 text-foreground">2. Changes to Terms</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We reserve the right to update, modify, or change these Terms at any time without prior notice. Continued use of our Services after any such change constitutes acceptance of the revised Terms.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4 text-foreground">3. Description of Services</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Skyhug provides a proprietary online platform offering text and voice chat interactions designed for consumer end-users. We may expand, limit, or modify features and services at any time, without notice.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4 text-foreground">4. Access and Use</h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>Our Services are currently provided free of charge, but we reserve the right to implement pricing, subscription models, or tiered services at any point.</p>
                  <p>We reserve the right to impose and modify usage limits (e.g., message counts, API calls, session lengths) at our discretion without prior notification.</p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4 text-foreground">5. User Conduct</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">Users agree not to:</p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4">
                  <li>Use Skyhug for illegal or unauthorized activities;</li>
                  <li>Harass, abuse, or threaten other users or our team;</li>
                  <li>Attempt to compromise the security or integrity of our Services.</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed">
                  We reserve the right to evaluate your conduct at any time and terminate your account without notice or liability for violations or any reason deemed necessary by Skyhug.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4 text-foreground">6. Anonymity and Privacy</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Skyhug respects your privacy. We do not require or collect your real name during use, allowing you the option to interact with the service anonymously. However, we do collect email addresses. If you wish for complete anonymity, we recommend using a non-identifying email address when signing up.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4 text-foreground">7. Privacy and Data Collection</h2>
                <p className="text-muted-foreground leading-relaxed">
                  By using Skyhug, you acknowledge and consent to the collection, storage, analysis, and use of your data, chat history, voice recordings, and usage statistics. While we implement measures to protect your data, we explicitly disclaim responsibility and liability for data leaks, unauthorized access, or security breaches.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4 text-foreground">8. Intellectual Property</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Skyhug and all related content, code, and trademarks are proprietary to Skyhug. Users receive a limited, revocable, non-transferable license to access and use the Services solely for personal, non-commercial purposes.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4 text-foreground">9. Disclaimers and Limitations of Liability</h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>Skyhug is provided "as is" and "as available," without guarantees or warranties of any kind, express or implied. Specifically:</p>
                  <ul className="list-disc list-inside space-y-2 mb-4">
                    <li>We provide no guarantee regarding accuracy, reliability, quality, or availability of the Services.</li>
                    <li>We expressly disclaim liability for emotional, psychological, medical, financial, or any other type of harm that may arise from using our Services.</li>
                  </ul>
                  <p>Skyhug is intended for informational and support purposes only and is not a substitute for professional medical or psychological advice, diagnosis, or treatment. Users should consult qualified professionals for any serious conditions or emergencies.</p>
                  <p>Under no circumstances shall Skyhug, its affiliates, officers, employees, agents, partners, or licensors be liable for any direct, indirect, incidental, consequential, special, exemplary, or punitive damages, including loss of profits, data, goodwill, or other intangible losses arising from the use or inability to use the Services.</p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4 text-foreground">10. Indemnification</h2>
                <p className="text-muted-foreground leading-relaxed">
                  You agree to indemnify, defend, and hold harmless Skyhug, its affiliates, officers, directors, employees, agents, licensors, and service providers from any claims, liabilities, damages, judgments, awards, losses, costs, expenses, or fees (including attorneys' fees) arising from or related to your violation of these Terms or use of the Services.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4 text-foreground">11. Termination</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Skyhug may terminate your access to all or part of the Services at any time, for any reason, without prior notice or liability.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4 text-foreground">12. Governing Law</h2>
                <p className="text-muted-foreground leading-relaxed">
                  These Terms shall be governed by the laws of [Insert jurisdiction here], without regard to its conflict of law principles. Users agree to submit to the exclusive jurisdiction of the courts located within [Insert jurisdiction here].
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4 text-foreground">13. Additional Disclaimers</h2>
                <p className="text-muted-foreground leading-relaxed">
                  For further details and expanded disclaimers related to use of Skyhug, please visit our dedicated Disclaimers page at [Insert hyperlink to disclaimers page here].
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4 text-foreground">14. Contact Information</h2>
                <p className="text-muted-foreground leading-relaxed">
                  For any questions or concerns regarding these Terms, please contact us at [Insert contact information here].
                </p>
              </section>

              <div className="mt-8 p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">
                  By continuing to use Skyhug, you confirm that you have read, understood, and accepted these Terms of Service in their entirety.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default TermsPage;