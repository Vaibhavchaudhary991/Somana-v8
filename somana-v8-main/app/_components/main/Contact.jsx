"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin } from "lucide-react";

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Send to API or email handler here
      await new Promise((res) => setTimeout(res, 2000)); // Simulate async call
      setSubmitted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-20">
      <section className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight">Contact Us</h1>
        <p className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto">
          Got questions, feedback, or just want to say hi? We’d love to hear
          from you.
        </p>
      </section>

      <div className="grid md:grid-cols-2 gap-10">
        {/* Contact Details */}
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <Mail className="text-primary mt-1" />
            <div>
              <p className="font-semibold">Email</p>
              <p className="text-muted-foreground">contact@somana.in</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <Phone className="text-primary mt-1" />
            <div>
              <p className="font-semibold">Phone</p>
              <p className="text-muted-foreground">+91 98765 43210</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <MapPin className="text-primary mt-1" />
            <div>
              <p className="font-semibold">Location</p>
              <p className="text-muted-foreground">
                Lovely Professional University, Punjab, India
              </p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block font-medium mb-1">Your Name</label>
            <Input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="John Doe"
              required
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Your Email</label>
            <Input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Your Message</label>
            <Textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              rows={5}
              placeholder="Write your message here..."
              required
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Sending..." : "Send Message"}
          </Button>
          {submitted && (
            <p className="text-green-600 font-medium text-center">
              ✅ Message sent successfully!
            </p>
          )}
        </form>
      </div>
    </main>
  );
};

export default Contact;
