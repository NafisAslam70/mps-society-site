"use client";

import React from 'react';
import { FaFacebookF, FaTwitter, FaInstagram } from 'react-icons/fa';

const ContactPage = () => {
  return (
    <section className="py-10 min-h-screen" dir="rtl">
      <div className="container mx-auto px-4 max-w-7xl">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Information Card */}
          <div className="bg-white rounded-xl shadow-lg p-8 transform transition-all duration-500 hover:shadow-xl animate-slide-up">
            <h3 className="text-2xl font-semibold text-gray-800 mb-6 font-amiri text-right">
              جمعية مدرسة ميد العامة
            </h3>
            <ul className="space-y-4 text-gray-600 font-amiri text-right">
              <li className="flex items-start">
                <span className="font-medium text-gray-800 ml-2">العنوان:</span>
                طريق باكور، سريكونث، أندهاركوثا، جهارخاند 816101، الهند
              </li>
              <li className="flex items-start">
                <span className="font-medium text-gray-800 ml-2">الهاتف:</span>
                +91 6203601659
              </li>
              <li className="flex items-start">
                <span className="font-medium text-gray-800 ml-2">البريد الإلكتروني:</span>
                meedpss@gmail.com
              </li>
              <li className="flex items-start">
                <span className="font-medium text-gray-800 ml-2">ساعات العمل:</span>
                10 صباحًا - 6 مساءً
              </li>
            </ul>

            {/* Social Media Links */}
            <div className="mt-8">
              <h4 className="text-lg font-semibold text-gray-800 mb-4 font-amiri text-right">تابعونا</h4>
              <div className="flex space-x-4 justify-end">
                <a
                  href="https://facebook.com"
                  className="text-green-600 hover:text-green-700 transform hover:scale-110 transition-all duration-200"
                  aria-label="فيسبوك"
                >
                  <FaFacebookF size={24} />
                </a>
                <a
                  href="https://twitter.com"
                  className="text-green-600 hover:text-green-700 transform hover:scale-110 transition-all duration-200"
                  aria-label="تويتر"
                >
                  <FaTwitter size={24} />
                </a>
                <a
                  href="https://instagram.com"
                  className="text-green-600 hover:text-green-700 transform hover:scale-110 transition-all duration-200"
                  aria-label="إنستغرام"
                >
                  <FaInstagram size={24} />
                </a>
              </div>
            </div>

            {/* Google Maps Embed */}
            <div className="mt-8">
              <h4 className="text-lg font-semibold text-gray-800 mb-4 font-amiri text-right">موقعنا</h4>
              <div className="relative w-full h-64 rounded-lg overflow-hidden shadow-md">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6461.325387020825!2d87.7977638!3d24.7915067!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39fa66cae7e9e4fb%3A0x6b6ad42650bd414e!2sMeed%20Public%20School!5e1!3m2!1sen!2smy!4v1751926572824!5m2!1sen!2smy"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="موقع جمعية مدرسة ميد العامة"
                ></iframe>
              </div>
            </div>
          </div>

          {/* Contact Form Card */}
          <div className="bg-white rounded-xl shadow-lg p-8 animate-slide-up">
            <h3 className="text-2xl font-semibold text-gray-800 mb-6 font-amiri text-right">
              أرسل رسالة
            </h3>
            <form className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 font-amiri text-right"
                >
                  الاسم
                </label>
                <input
                  type="text"
                  id="name"
                  className="mt-1 p-3 w-full border border-gray-300 rounded-md text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200"
                  placeholder="اسمك"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 font-amiri text-right"
                >
                  البريد الإلكتروني
                </label>
                <input
                  type="email"
                  id="email"
                  className="mt-1 p-3 w-full border border-gray-300 rounded-md text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200"
                  placeholder="بريدك الإلكتروني"
                />
              </div>
              <div>
                <label
                  htmlFor="mobile"
                  className="block text-sm font-medium text-gray-700 font-amiri text-right"
                >
                  رقم الهاتف
                </label>
                <input
                  type="tel"
                  id="mobile"
                  className="mt-1 p-3 w-full border border-gray-300 rounded-md text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200"
                  placeholder="رقم هاتفك"
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 font-amiri text-right"
                >
                  الرسالة
                </label>
                <textarea
                  id="message"
                  rows="5"
                  className="mt-1 p-3 w-full border border-gray-300 rounded-md text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200"
                  placeholder="رسالتك"
                ></textarea>
              </div>
              <button
                type="button"
                className="w-full bg-green-600 text-white px-4 py-3 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transform transition-all duration-200 hover:scale-105 font-amiri"
              >
                إرسال
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
        @font-face {
          font-family: 'Amiri';
          src: url('https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&display=swap');
        }
      `}</style>
    </section>
  );
};

export default ContactPage;