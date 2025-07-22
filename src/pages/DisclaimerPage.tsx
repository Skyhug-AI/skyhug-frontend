import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Card, CardContent } from '../components/ui/card';

const DisclaimerPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container max-w-4xl mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-8">
            <h1 className="text-3xl font-bold mb-6">Skyhug Disclaimer Policy</h1>
            <p className="text-muted-foreground mb-8">Last updated: July 22, 2025</p>
            
            <div className="space-y-6">
              <section>
                <h2 className="text-xl font-semibold mb-3">1. Introduction</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Skyhug ("Skyhug," "we," "us," or "our") provides an online platform featuring AI-powered text and voice chat interactions. Skyhug is strictly intended for informational and educational purposes and explicitly is not intended to replace professional medical or psychological advice, diagnosis, treatment, or therapy.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">2. No Professional Relationship or Advice</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Use of Skyhug does not create any professional-client relationship between you and Skyhug. Information provided by Skyhug, including advice or insights delivered via our AI therapists, is not and should not be considered professional psychological, psychiatric, medical, or therapeutic advice.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">3. Consult Professionals</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Always consult a licensed medical professional, psychiatrist, therapist, counselor, or healthcare provider for advice concerning medical, emotional, psychological, or mental health conditions. Do not disregard or delay seeking professional advice because of something you read, heard, or discussed through Skyhug.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">4. Accuracy and Reliability</h2>
                <p className="text-muted-foreground leading-relaxed">
                  While Skyhug strives to provide helpful and accurate information, we make absolutely no guarantees regarding the accuracy, reliability, completeness, or timeliness of the content provided. Skyhug may contain inaccuracies, errors, or outdated information. Users should independently verify critical information with qualified professionals.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">5. Liability and Indemnification</h2>
                <p className="text-muted-foreground leading-relaxed">
                  You explicitly acknowledge and agree that Skyhug, its affiliates, officers, directors, employees, agents, licensors, and service providers will not be held liable, under any circumstances, for any direct, indirect, incidental, consequential, special, exemplary, or punitive damages arising from your use or inability to use our Services, including but not limited to emotional distress, psychological harm, physical harm, financial loss, or damages related to the misinterpretation or misuse of information provided by Skyhug.
                </p>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  You agree to indemnify, defend, and hold harmless Skyhug, its affiliates, officers, directors, employees, agents, licensors, and service providers from and against any and all claims, liabilities, losses, damages, costs, expenses (including reasonable attorneys' fees), judgments, and awards arising from or related to your use or misuse of the Services or breach of this Disclaimer Policy.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">6. Arbitration Agreement and Damages Cap</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Any dispute, controversy, or claim arising out of or relating to this Disclaimer Policy or your use of Skyhug shall be resolved exclusively through binding arbitration. You expressly waive your right to a jury trial and your right to participate in any class-action litigation.
                </p>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  In the event that liability is established despite this Disclaimer, damages awarded to you are explicitly limited to the amount you paid to Skyhug in the month in which the alleged damages occurred.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">7. Policy Changes</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Skyhug reserves the right to modify this Disclaimer Policy at any time without notice. Continued use of our Services constitutes your acceptance of any modifications.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">8. Contact Information</h2>
                <p className="text-muted-foreground leading-relaxed">
                  For any questions regarding this Disclaimer Policy or our practices, please contact us at [Insert contact information here].
                </p>
              </section>

              <section className="border-t pt-6 mt-8">
                <p className="text-muted-foreground leading-relaxed font-medium">
                  By continuing to use Skyhug, you affirm that you have read, understood, and accepted this Disclaimer Policy in its entirety.
                </p>
              </section>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default DisclaimerPage;