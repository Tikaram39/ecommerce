import { useState } from "react";
import { PhoneIcon, EnvelopeIcon, MapPinIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

const CONTACT_INFO = [
  { icon: PhoneIcon, label: "Phone", value: "+977-9800000000", href: "tel:+9779800000000" },
  { icon: EnvelopeIcon, label: "Email", value: "support@shopnow.com.np", href: "mailto:support@shopnow.com.np" },
  { icon: MapPinIcon, label: "Address", value: "Kathmandu, Nepal", href: "#" },
];

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    await new Promise((r) => setTimeout(r, 1500));
    toast.success("Message sent! We'll get back to you soon. 📧");
    setForm({ name: "", email: "", subject: "", message: "" });
    setSending(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
          Get In Touch
        </h1>
        <p className="text-gray-500 text-lg max-w-xl mx-auto">
          Have questions, feedback, or need support? We're here to help!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Info */}
        <div className="space-y-4">
          {CONTACT_INFO.map((info) => (
            <a
              key={info.label}
              href={info.href}
              className="flex items-center gap-4 p-5 bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-md transition-all group"
            >
              <div className="p-3 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl">
                <info.icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">{info.label}</p>
                <p className="font-semibold text-gray-800 dark:text-white group-hover:text-purple-600 transition-colors">
                  {info.value}
                </p>
              </div>
            </a>
          ))}

          {/* Social Links */}
          <div className="p-5 bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
            <p className="font-semibold text-gray-800 dark:text-white mb-3">Follow Us</p>
            <div className="flex gap-3">
              {["Facebook", "Instagram", "Twitter", "LinkedIn"].map((s) => (
                <button key={s} className="px-3 py-1.5 text-xs font-medium bg-purple-50 text-purple-600 rounded-full hover:bg-purple-100 transition-colors">
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Send a Message</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Name</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  placeholder="Your Name"
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Subject</label>
              <input
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                required
                placeholder="How can we help?"
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Message</label>
              <textarea
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                required
                rows={5}
                placeholder="Write your message here..."
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white resize-none"
              />
            </div>
            <button
              type="submit"
              disabled={sending}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-xl hover:shadow-lg transition-all disabled:opacity-70"
            >
              {sending ? "Sending..." : "Send Message →"}
            </button>
          </form>
        </div>
      </div>

      {/* Google Map Embed */}
      <div className="mt-8 rounded-2xl overflow-hidden shadow-sm h-80">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.0!2d85.3240!3d27.7172!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjfCsDQzJzAyLjAiTiA4NcKwMTknMjYuNCJF!5e0!3m2!1sen!2snp!4v1234567890"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          title="Store Location"
        />
      </div>
    </div>
  );
}
