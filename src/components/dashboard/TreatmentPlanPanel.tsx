import React from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const TreatmentPlanPanel = () => {
  return (
    <Card className="w-full max-w-4xl mx-auto bg-white/90 backdrop-blur-sm rounded-2xl border border-white/30 shadow-xl">
      <Tabs defaultValue="treatment" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-gray-100/50 rounded-xl m-4">
          <TabsTrigger value="treatment" className="text-sm font-medium">Treatment Plan</TabsTrigger>
          <TabsTrigger value="contact" className="text-sm font-medium text-gray-500">Contact Form</TabsTrigger>
          <TabsTrigger value="information" className="text-sm font-medium text-gray-500">Information</TabsTrigger>
        </TabsList>
        
        <TabsContent value="treatment" className="p-6 space-y-8">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Your Treatment Plan</h2>
            <p className="text-gray-600">Personalized therapy journey based on your needs and goals.</p>
          </div>

          {/* Weekly Goals */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-blue-600">Weekly Goals</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-gray-700">Practice mindfulness meditation for 10 minutes daily</span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-gray-700">Complete 2 journal entries about challenging thoughts</span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-gray-700">Try one new stress management technique</span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-gray-700">Engage in one pleasurable activity each day</span>
              </li>
            </ul>
          </div>

          {/* Focus Areas */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Focus Areas</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h4 className="text-base font-medium text-purple-600">Managing Anxiety</h4>
                <p className="text-sm text-gray-600">Techniques to reduce anxious thoughts and physical symptoms.</p>
              </div>
              
              <div className="space-y-2">
                <h4 className="text-base font-medium text-green-600">Building Resilience</h4>
                <p className="text-sm text-gray-600">Strengthening your ability to adapt to life's challenges.</p>
              </div>
              
              <div className="space-y-2">
                <h4 className="text-base font-medium text-blue-600">Improving Sleep</h4>
                <p className="text-sm text-gray-600">Creating better sleep habits and nighttime routines.</p>
              </div>
              
              <div className="space-y-2">
                <h4 className="text-base font-medium text-orange-600">Emotional Regulation</h4>
                <p className="text-sm text-gray-600">Learning to identify and manage difficult emotions.</p>
              </div>
            </div>
          </div>

          {/* Recommended Exercises */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Recommended Exercises</h3>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl">
                <div className="w-8 h-8 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-sm font-medium">
                  1
                </div>
                <div className="space-y-1">
                  <h4 className="font-medium text-gray-900">Progressive Muscle Relaxation</h4>
                  <p className="text-sm text-gray-600">Tense and relax each muscle group to reduce physical tension.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl">
                <div className="w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-sm font-medium">
                  2
                </div>
                <div className="space-y-1">
                  <h4 className="font-medium text-gray-900">Breathing Exercises</h4>
                  <p className="text-sm text-gray-600">Practice deep breathing to activate your parasympathetic nervous system.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl">
                <div className="w-8 h-8 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center text-sm font-medium">
                  3
                </div>
                <div className="space-y-1">
                  <h4 className="font-medium text-gray-900">Thought Challenging</h4>
                  <p className="text-sm text-gray-600">Identify and challenge negative thought patterns using CBT techniques.</p>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="contact" className="p-6">
          <div className="text-center py-12">
            <p className="text-gray-500">Contact form content would go here.</p>
          </div>
        </TabsContent>
        
        <TabsContent value="information" className="p-6">
          <div className="text-center py-12">
            <p className="text-gray-500">Information content would go here.</p>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default TreatmentPlanPanel;