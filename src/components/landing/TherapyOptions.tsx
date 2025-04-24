
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { users } from 'lucide-react';

const therapyTypes = [
  "Behavioral",
  "Cognitive",
  "Relationship",
  "Anxiety & Stress",
  "Depression",
  "Personal Growth",
  "Career",
  "Mindfulness"
];

const TherapyOptions = () => {
  const navigate = useNavigate();

  return (
    <section className="py-24 px-4 bg-gradient-to-b from-white to-serenity-50">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Title */}
        <div className="text-center space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold text-serenity-900">
            Find Your Perfect Match
          </h2>
          <p className="text-xl text-serenity-600 max-w-2xl mx-auto">
            Choose your therapy style and connect with an AI therapist that understands your unique needs
          </p>
        </div>

        {/* Therapy Types Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {therapyTypes.map((type) => (
            <button
              key={type}
              onClick={() => navigate('/chat')}
              className="p-4 rounded-xl bg-white hover:bg-serenity-50 border border-serenity-100 transition-all duration-300 text-left group"
            >
              <span className="text-lg font-medium text-serenity-900 group-hover:text-serenity-700">
                {type}
              </span>
            </button>
          ))}
        </div>

        {/* AI Therapists Showcase */}
        <div className="space-y-8">
          <div className="text-center">
            <h3 className="text-2xl font-semibold text-serenity-900 mb-2">
              Meet Our AI Therapists
            </h3>
            <p className="text-serenity-600">
              Each with their unique approach and expertise
            </p>
          </div>

          {/* AI Profiles */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div 
                key={i}
                className="p-6 rounded-2xl bg-white border border-serenity-100 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-serenity-200 to-serenity-300 flex items-center justify-center">
                    <users className="w-8 h-8 text-serenity-600" />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-serenity-900">
                      Dr. Sky {i}
                    </h4>
                    <p className="text-serenity-600">
                      {i === 1 ? "Cognitive Behavioral" : i === 2 ? "Mindfulness" : "Relationship"}
                    </p>
                  </div>
                </div>
                <p className="text-serenity-600 mb-6">
                  {i === 1 ? "Expert in anxiety and depression, using evidence-based CBT techniques." 
                    : i === 2 ? "Specializes in stress reduction and personal growth through mindfulness."
                    : "Focused on improving relationships and communication skills."}
                </p>
                <Button 
                  onClick={() => navigate('/chat')}
                  className="w-full bg-serenity-500 hover:bg-serenity-600 text-white"
                >
                  Start Session
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TherapyOptions;
