"use client";

import React, { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Mail, Send, ChevronDown, MessageSquareMore } from "lucide-react";
interface FormData {
  name: string;
  email: string;
  message: string;
}

interface FAQ {
  question: string;
  answer: string;
}

export default function ContactFAQPage() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    message: "",
  });

  const [activeFaq, setActiveFaq] = useState<number | null>(0); // Default open first FAQ

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Here you can call your API to send the message
  };

  const faqs: FAQ[] = [
    {
      question: "What items can I donate?",
      answer:
        "You can donate clothes, furniture, books, electronics, kitchen items, baby goods, and more. Items should be in usable condition.",
    },
    {
      question: "How does pickup work?",
      answer:
        "Once your donation is matched with an organization, you can schedule a pickup date and time that works for you.",
    },
    {
      question: "Is there a cost to use KindDrop?",
      answer:
        "No! KindDrop is completely free for both donors and receiving organizations.",
    },
    {
      question: "How are organizations verified?",
      answer:
        "All NGOs and charities go through a verification process to ensure they are legitimate and trustworthy.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#FDFCFB] flex flex-col items-center py-16 px-4">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-2">
          Contact & FAQ
        </h1>
        <p className="text-gray-500 text-sm">
          Have questions? We're here to help.
        </p>
      </div>

      {/* Main Grid */}
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
        {/* Left: Contact Form */}
        <div className="space-y-8">
          <h2 className="text-lg font-bold text-gray-900">Get in Touch</h2>

          <div className="space-y-3">
            <div className="flex items-center gap-3 bg-gray-100 p-4 rounded-md">
              <span className="p-2 bg-white rounded-md shadow-sm">
                <Mail className="h-5 w-5 text-gray-500" />
              </span>
              <span className="text-sm text-gray-700">
                hong.sophaline@institute.com
              </span>
            </div>

            <div className="flex items-center gap-3 bg-gray-100 p-4 rounded-md">
              <span className="p-2 bg-white rounded-md shadow-sm">
                <Send className="h-5 w-5 text-blue-500" />
              </span>
              <span className="text-sm text-gray-700">
                +855 70 835 672 / 97 420 570
              </span>
            </div>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
              required
            />
            <textarea
              name="message"
              placeholder="Your Message"
              rows={5}
              value={formData.message}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-200 rounded-md text-sm resize-none focus:outline-none focus:ring-2 focus:ring-pink-500"
              required
            />
            <button
              type="submit"
              className="w-full py-3 bg-pink-500 hover:bg-pink-600 text-white font-semibold text-sm rounded-md shadow-md transition-colors"
            >
              Send Message
            </button>
          </form>
        </div>

        {/* Right: FAQ */}
        <div className="space-y-8">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-gray-900">
              Frequently Asked Questions
            </h2>
            <MessageSquareMore className="h-5 w-5 text-purple-500" />
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-gray-100 rounded-lg overflow-hidden"
              >
                <button
                  onClick={() =>
                    setActiveFaq(activeFaq === index ? null : index)
                  }
                  className="w-full flex justify-between items-center p-5 text-left focus:outline-none"
                >
                  <span className="text-sm font-semibold text-gray-800">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${
                      activeFaq === index ? "transform rotate-180" : ""
                    }`}
                  />
                </button>

                <div
                  className={`px-5 overflow-hidden transition-all duration-300 ease-in-out ${
                    activeFaq === index ? "max-h-40 pb-5" : "max-h-0"
                  }`}
                >
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
