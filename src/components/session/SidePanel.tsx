
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { FileText, ListCheck } from "lucide-react";

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
    <div className="h-full overflow-y-auto bg-white">
      <Tabs defaultValue="treatment" className="w-full">
        <div className="p-4 border-b">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="treatment">
              <ListCheck className="h-4 w-4 mr-2" />
              Treatment
            </TabsTrigger>
            <TabsTrigger value="form">
              <FileText className="h-4 w-4 mr-2" />
              Contact
            </TabsTrigger>
            <TabsTrigger value="info">Info</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="treatment" className="p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">Your Treatment Plan</h2>
            <p className="text-gray-600 mt-2">
              Here's your personalized plan based on our assessment.
            </p>
          </div>

          <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-800 mb-2">Weekly Goals</h3>
              <ul className="list-disc list-inside text-blue-700 space-y-1">
                <li>Practice mindfulness meditation for 10 minutes daily</li>
                <li>Journal thoughts and emotions every evening</li>
                <li>Complete one cognitive behavioral exercise each week</li>
                <li>Track mood patterns using the mood chart</li>
              </ul>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-medium text-purple-800 mb-2">Focus Areas</h3>
              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-medium text-purple-800">Anxiety Management</h4>
                  <div className="w-full bg-purple-200 rounded-full h-2.5 mt-1">
                    <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-purple-800">Stress Resilience</h4>
                  <div className="w-full bg-purple-200 rounded-full h-2.5 mt-1">
                    <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-purple-800">Emotional Regulation</h4>
                  <div className="w-full bg-purple-200 rounded-full h-2.5 mt-1">
                    <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: '45%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-medium text-green-800 mb-2">Recommended Exercises</h3>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <Checkbox id="ex1" className="mr-2" defaultChecked />
                  <label htmlFor="ex1" className="text-green-700 text-sm">
                    Deep breathing technique (5-5-5)
                  </label>
                </li>
                <li className="flex items-center">
                  <Checkbox id="ex2" className="mr-2" />
                  <label htmlFor="ex2" className="text-green-700 text-sm">
                    Progressive muscle relaxation
                  </label>
                </li>
                <li className="flex items-center">
                  <Checkbox id="ex3" className="mr-2" />
                  <label htmlFor="ex3" className="text-green-700 text-sm">
                    Cognitive distortion worksheet
                  </label>
                </li>
                <li className="flex items-center">
                  <Checkbox id="ex4" className="mr-2" />
                  <label htmlFor="ex4" className="text-green-700 text-sm">
                    Gratitude journaling practice
                  </label>
                </li>
              </ul>
            </div>

            <div className="bg-amber-50 p-4 rounded-lg">
              <h3 className="font-medium text-amber-800 mb-2">Next Steps</h3>
              <p className="text-amber-700">
                We'll review your progress in our next session and adjust your plan as needed.
                Continue working on your daily goals and exercises.
              </p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="form" className="p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">Contact Us</h2>
            <p className="text-gray-600 mt-2">
              Fill out this form and we'll get back to you as soon as possible.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-gray-700">
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
              <label htmlFor="email" className="text-sm font-medium text-gray-700">
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
              <label htmlFor="message" className="text-sm font-medium text-gray-700">
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
        </TabsContent>

        <TabsContent value="info" className="p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">Information</h2>
            <p className="text-gray-600 mt-2">
              Important details about our services and support.
            </p>
          </div>

          <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-800 mb-2">Support Hours</h3>
              <p className="text-blue-700">
                Monday to Friday: 9am - 5pm<br />
                Weekend: Closed
              </p>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-medium text-purple-800 mb-2">Emergency Contact</h3>
              <p className="text-purple-700">
                For urgent matters, please call:<br />
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SidePanel;
