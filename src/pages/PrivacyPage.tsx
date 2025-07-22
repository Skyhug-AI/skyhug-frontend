import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const PrivacyPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-muted">
      <div className="sticky top-0 z-50">
        <Header />
      </div>
      <div className="flex-grow container mx-auto px-4 py-8">
        <Card className="max-w-4xl mx-auto">
          <CardContent className="p-8">
            <div className="prose prose-gray max-w-none">
              <h1 className="text-3xl font-bold mb-6 text-foreground">Skyhug Privacy Policy</h1>
              
              <p className="text-muted-foreground mb-8">Last updated: July 22, 2025</p>

              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4 text-foreground">1. Introduction</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Skyhug ("Skyhug," "we," "us," or "our") respects your privacy but explicitly reserves the right to collect, store, analyze, use, and share user data as detailed in this Privacy Policy. By using our services ("Services"), you ("User," "you," or "your") consent fully to these practices.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4 text-foreground">2. Information We Collect</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">We reserve the right to collect and process the following information:</p>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p><strong>Email Address:</strong> Collected upon registration and used for account management, service communications, marketing, and security purposes.</p>
                  <p><strong>User Profile Information:</strong> Information that you self-report during account creation or reveal during interactions with our AI therapists, including but not limited to career, age, topics on mind, and self-diagnosed issues.</p>
                  <p><strong>Text and Voice Chat Data:</strong> We collect all interactions, including text messages and voice recordings, processed by Skyhug.</p>
                  <p><strong>Usage Statistics and Analytics:</strong> We gather data about how you use our Services, including session durations, interaction frequency, device type, and other analytical metrics.</p>
                  <p><strong>Logs and Device Information:</strong> We collect technical data such as IP addresses, browser types, timestamps, and device-specific details.</p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4 text-foreground">3. How We Use Your Data</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">Skyhug reserves the right to use collected data for purposes including but not limited to:</p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Providing and improving our Services.</li>
                  <li>Customizing and enhancing user experience.</li>
                  <li>Conducting analytics and market research.</li>
                  <li>Security, compliance, and operational management.</li>
                  <li>Communicating promotional or administrative information.</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4 text-foreground">4. Data Sharing</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">Skyhug explicitly reserves the right to share collected user data with third parties, including but not limited to:</p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Service providers assisting in operations or analytics.</li>
                  <li>Affiliates, subsidiaries, or partners.</li>
                  <li>Legal entities or governmental agencies upon request, compliance with law, or to protect our rights and safety.</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4 text-foreground">5. Data Security and Storage</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We implement reasonable security measures to protect user data. However, we explicitly disclaim liability for unauthorized access, security breaches, or data leaks. You acknowledge and accept these risks.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4 text-foreground">6. User Data Rights</h2>
                <p className="text-muted-foreground leading-relaxed">
                  You may request access to, modification, or deletion of your data. While we strive to accommodate such requests, we reserve the right to deny or limit these requests based on operational, legal, or compliance reasons.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4 text-foreground">7. Arbitration and Limitation of Damages</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Any disputes arising out of or related to this Privacy Policy or your use of Skyhug's Services will be subject to binding arbitration. You agree to waive any right to a jury trial or participation in class action litigation. In the event of any dispute, damages are explicitly limited to the amount you paid to Skyhug in the month during which the alleged damages occurred.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4 text-foreground">8. Policy Changes</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Skyhug reserves the right to modify this Privacy Policy at any time, without prior notice. Continued use of our Services following any changes constitutes acceptance of the updated Privacy Policy.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4 text-foreground">9. Disclaimer of Liability</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We explicitly disclaim responsibility and liability to the fullest extent permissible by law for any direct, indirect, incidental, consequential, special, or exemplary damages arising from the use or inability to use our Services or arising from any data-related incidents, including but not limited to unauthorized access, data breaches, or privacy violations.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4 text-foreground">10. Additional Disclaimers</h2>
                <p className="text-muted-foreground leading-relaxed">
                  For further details and expanded disclaimers related to use of Skyhug, please visit our dedicated <a href="/disclaimer" className="text-skyhug-500 hover:underline">Disclaimers page</a>.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4 text-foreground">11. Contact Information</h2>
                <p className="text-muted-foreground leading-relaxed">
                  For any questions regarding this Privacy Policy or our data practices, please contact us at [Insert contact information here].
                </p>
              </section>

              <div className="mt-8 p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">
                  By continuing to use Skyhug, you confirm that you have read, understood, and consent to the terms outlined in this Privacy Policy in their entirety.
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

export default PrivacyPage;