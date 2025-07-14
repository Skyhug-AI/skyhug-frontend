import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import MainDashboard from "@/components/dashboard/MainDashboard";

const SidePanel = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    agreeToTerms: false,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, agreeToTerms: checked }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    toast({
      title: "Form Submitted",
      description: "Thank you for your submission!",
      duration: 3000,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Tabs defaultValue="dashboard" className="w-full">
        <div className="p-4 border-b border-border bg-background/95 backdrop-blur-sm shadow-sm">
          <TabsList className="grid w-full grid-cols-4 bg-card shadow-md border border-border">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-muted data-[state=active]:text-foreground data-[state=active]:shadow-sm">Dashboard</TabsTrigger>
            <TabsTrigger value="treatment" className="data-[state=active]:bg-muted data-[state=active]:text-foreground data-[state=active]:shadow-sm">Treatment Plan</TabsTrigger>
            <TabsTrigger value="form" className="data-[state=active]:bg-muted data-[state=active]:text-foreground data-[state=active]:shadow-sm">Contact Form</TabsTrigger>
            <TabsTrigger value="info" className="data-[state=active]:bg-muted data-[state=active]:text-foreground data-[state=active]:shadow-sm">Information</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="dashboard" className="p-6 bg-background">
          <div className="bg-card/70 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-border">
            <MainDashboard />
          </div>
        </TabsContent>

        <TabsContent value="treatment" className="p-6 bg-background">
          <div className="bg-card/70 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-border">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-foreground">
                Your Treatment Plan
              </h2>
              <p className="text-muted-foreground mt-2">
                Personalized therapy journey based on your needs and goals.
              </p>
            </div>

          <div className="space-y-8">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-800 mb-2">Weekly Goals</h3>
              <ul className="list-disc list-inside text-blue-700 space-y-1">
                <li>Practice mindfulness meditation for 10 minutes daily</li>
                <li>Complete 2 journal entries about challenging thoughts</li>
                <li>Try one new stress management technique</li>
                <li>Engage in one pleasurable activity each day</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-3">
                Focus Areas
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-gray-200 rounded-md p-4">
                  <h4 className="font-medium text-purple-700">
                    Managing Anxiety
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Techniques to reduce anxious thoughts and physical symptoms.
                  </p>
                </div>
                <div className="border border-gray-200 rounded-md p-4">
                  <h4 className="font-medium text-green-700">
                    Building Resilience
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Strengthening your ability to adapt to life's challenges.
                  </p>
                </div>
                <div className="border border-gray-200 rounded-md p-4">
                  <h4 className="font-medium text-blue-700">Improving Sleep</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Creating better sleep habits and nighttime routines.
                  </p>
                </div>
                <div className="border border-gray-200 rounded-md p-4">
                  <h4 className="font-medium text-amber-700">
                    Emotional Regulation
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Learning to identify and manage difficult emotions.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-3">
                Recommended Exercises
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-md">
                  <div className="bg-green-100 p-2 rounded-full text-green-700">
                    1
                  </div>
                  <div>
                    <h4 className="font-medium">
                      Progressive Muscle Relaxation
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Tense and relax each muscle group to reduce physical
                      tension.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-md">
                  <div className="bg-blue-100 p-2 rounded-full text-blue-700">
                    2
                  </div>
                  <div>
                    <h4 className="font-medium">Breathing Exercises</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Practice deep breathing to activate your parasympathetic
                      nervous system.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-md">
                  <div className="bg-purple-100 p-2 rounded-full text-purple-700">
                    3
                  </div>
                  <div>
                    <h4 className="font-medium">Thought Challenging</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Identify and reframe negative thought patterns.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-800 mb-3">
                Next Steps
              </h3>
              <p className="text-gray-600 mb-4">
                Your treatment plan will adapt as we progress together. We'll
                review and adjust based on what works best for you.
              </p>
              <Button className="w-full">Schedule Next Session</Button>
            </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="form" className="p-6 bg-background">
          <div className="bg-card/70 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-border">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-foreground">Contact Us</h2>
              <p className="text-muted-foreground mt-2">
                Fill out this form and we'll get back to you as soon as possible.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className="text-sm font-medium text-foreground"
                >
                  Name
                </label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-foreground"
                >
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="message"
                  className="text-sm font-medium text-foreground"
                >
                  Message
                </label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Enter your message"
                  rows={5}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={formData.agreeToTerms}
                  onCheckedChange={handleCheckboxChange}
                />
                <label
                  htmlFor="terms"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  I agree to the terms and conditions
                </label>
              </div>

              <Button type="submit" className="w-full">
                Submit
              </Button>
            </form>
          </div>
        </TabsContent>

        <TabsContent value="info" className="p-6 bg-background">
          <div className="bg-card/70 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-border">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-foreground">
                Information
              </h2>
              <p className="text-muted-foreground mt-2">
                Important details about our services and support.
              </p>
            </div>

            <div className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-medium text-blue-800 mb-2">Support Hours</h3>
                <p className="text-blue-700">
                  Monday to Friday: 9am - 5pm
                  <br />
                  Weekend: Closed
                </p>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-medium text-purple-800 mb-2">
                  Emergency Contact
                </h3>
                <p className="text-purple-700">
                  For urgent matters, please call:
                  <br />
                  <strong>(555) 123-4567</strong>
                </p>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-medium text-green-800 mb-2">Resources</h3>
                <ul className="list-disc list-inside text-green-700 space-y-1">
                  <li>Therapy Guides</li>
                  <li>Wellness Articles</li>
                  <li>Community Forum</li>
                  <li>FAQ & Help Center</li>
                </ul>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SidePanel;
