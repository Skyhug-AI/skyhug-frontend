
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";

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
      <Tabs defaultValue="form" className="w-full">
        <div className="p-4 border-b">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="form">Contact Form</TabsTrigger>
            <TabsTrigger value="info">Information</TabsTrigger>
          </TabsList>
        </div>

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
