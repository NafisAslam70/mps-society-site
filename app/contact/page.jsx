"use client";

import React from 'react';
import { FaFacebookF, FaTwitter, FaInstagram } from 'react-icons/fa';

const ContactPage = () => {
  return (
    <section className="py-10 min-h-screen">
      <div className="container mx-auto px-4 max-w-7xl">
  

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Information Card */}
          <div className="bg-white rounded-xl shadow-lg p-8 transform transition-all duration-500 hover:shadow-xl animate-slide-up">
            <h3 className="text-2xl font-semibold text-gray-800 mb-6">
              Meed Public School Society
            </h3>
            <ul className="space-y-4 text-gray-600">
              <li className="flex items-start">
                <span className="font-medium text-gray-800 mr-2">Address:</span>
                Pakur Rd, Srikunth, Andharkotha, Jharkhand 816110, India
              </li>
              <li className="flex items-start">
                <span className="font-medium text-gray-800 mr-2">Phone:</span>
                +91 6203601659
              </li>
              <li className="flex items-start">
                <span className="font-medium text-gray-800 mr-2">Email:</span>
                meedpss@gmail.com
              </li>
              <li className="flex items-start">
                <span className="font-medium text-gray-800 mr-2">Office Hours:</span>
                10AM - 6PM
              </li>
            </ul>

            {/* Social Media Links */}
            <div className="mt-8">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Follow Us</h4>
              <div className="flex space-x-4">
                <a
                  href="https://facebook.com"
                  className="text-green-600 hover:text-green-700 transform hover:scale-110 transition-all duration-200"
                  aria-label="Facebook"
                >
                  <FaFacebookF size={24} />
                </a>
                <a
                  href="https://twitter.com"
                  className="text-green-600 hover:text-green-700 transform hover:scale-110 transition-all duration-200"
                  aria-label="Twitter"
                >
                  <FaTwitter size={24} />
                </a>
                <a
                  href="https://instagram.com"
                  className="text-green-600 hover:text-green-700 transform hover:scale-110 transition-all duration-200"
                  aria-label="Instagram"
                >
                  <FaInstagram size={24} />
                </a>
              </div>
            </div>

            {/* Google Maps Embed */}
            <div className="mt-8">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Our Location</h4>
              <div className="relative w-full h-64 rounded-lg overflow-hidden shadow-md">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6461.325387020825!2d87.7977638!3d24.7915067!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39fa66cae7e9e4fb%3A0x6b6ad42650bd414e!2sMeed%20Public%20School!5e1!3m2!1sen!2smy!4v1751926572824!5m2!1sen!2smy"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Meed Public School Society Location"
                ></iframe>
              </div>
            </div>
          </div>

          {/* Contact Form Card */}
          <div className="bg-white rounded-xl shadow-lg p-8 animate-slide-up">
            <h3 className="text-2xl font-semibold text-gray-800 mb-6">
              Send Us a Message
            </h3>
            <form className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="mt-1 p-3 w-full border border-gray-300 rounded-md text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200"
                  placeholder="Your Name"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="mt-1 p-3 w-full border border-gray-300 rounded-md text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200"
                  placeholder="Your Email"
                />
              </div>
              <div>
                <label
                  htmlFor="mobile"
                  className="block text-sm font-medium text-gray-700"
                >
                  Mobile No.
                </label>
                <input
                  type="tel"
                  id="mobile"
                  className="mt-1 p-3 w-full border border-gray-300 rounded-md text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200"
                  placeholder="Your Mobile Number"
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  rows="5"
                  className="mt-1 p-3 w-full border border-gray-300 rounded-md text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200"
                  placeholder="Your Message"
                ></textarea>
              </div>
              <button
                type="button"
                className="w-full bg-green-600 text-white px-4 py-3 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transform transition-all duration-200 hover:scale-105"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Custom CSS for Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-fade-in {
          animation: fadeIn 1s ease-out;
        }
        .animate-slide-up {
          animation: slideUp 0.8s ease-out;
        }
      `}</style>
    </section>
  );
};

export default ContactPage;