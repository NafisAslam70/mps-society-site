// ------------------------------
// components/ContactForm.jsx  (dual‑language)
// ------------------------------
"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";

export default function ContactForm() {
  const isAr = usePathname().startsWith("/ar");
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const labels = {
    name:    isAr ? "اسمك"            : "Your Name",
    email:   isAr ? "بريدك الإلكتروني" : "Your Email",
    message: isAr ? "رسالتك"          : "Your Message",
    button:  isAr ? "إرسال"           : "Send Message",
    alert:   isAr ? "تم إرسال الرسالة (المعالج غير متصل)" : "Message sent. (Form handler not connected)",
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = (e) => { e.preventDefault(); alert(labels.alert); };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-4" dir={isAr ? "rtl" : "ltr"}>
      <input type="text"   name="name"    placeholder={labels.name}    value={form.name}    onChange={handleChange} required className="w-full px-4 py-2 border rounded" />
      <input type="email"  name="email"   placeholder={labels.email}   value={form.email}   onChange={handleChange} required className="w-full px-4 py-2 border rounded" />
      <textarea name="message" placeholder={labels.message} value={form.message} onChange={handleChange} rows={4} required className="w-full px-4 py-2 border rounded" />
      <button type="submit" className="bg-green-700 text-white px-6 py-2 rounded hover:bg-green-800">
        {labels.button}
      </button>
    </form>
  );
}