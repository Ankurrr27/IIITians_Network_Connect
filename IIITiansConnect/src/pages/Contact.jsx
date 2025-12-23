import React from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Instagram,
  ExternalLink,
  ShieldCheck,
  Users,
  Send,
  Linkedin,
  Youtube,
  MessageCircle,
  Hash,
  ArrowRight
} from "lucide-react";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function ContactPage() {
  const socialLinks = [
    { name: "Telegram", icon: <Send size={20} />, link: "#", color: "hover:bg-blue-50 hover:text-blue-600" },
    { name: "LinkedIn", icon: <Linkedin size={20} />, link: "https://www.linkedin.com/company/iiitians-network/", color: "hover:bg-cyan-50 hover:text-cyan-700" },
    { name: "Discord", icon: <MessageCircle size={20} />, link: "https://discord.gg/88AnpuNc6E", color: "hover:bg-indigo-50 hover:text-indigo-600" },
    { name: "Reddit", icon: <Hash size={20} />, link: "https://www.reddit.com/r/iiitiansnetwork_/s/raoRbgEdX6", color: "hover:bg-orange-50 hover:text-orange-600" },
    { name: "YouTube", icon: <Youtube size={20} />, link: "https://youtube.com/@iiitiansnetwork?si=8ytWXimIsJt2qJeF", color: "hover:bg-red-50 hover:text-red-600" },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 pt-5 pb-12 sm:pb-20 selection:bg-indigo-100 overflow-x-hidden">
      <div className="h-1.5 bg-gradient-to-r from-indigo-500 via-blue-500 to-indigo-500" />

      {/* HERO SECTION - Adjusted for Mobile */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-5xl mx-auto px-6 sm:px-8 pt-12 sm:pt-20 pb-10 sm:pb-14  text-left"
      >
        <motion.div 
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="inline-flex gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 shadow-sm mb-6"
        >
          <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-left text-slate-500">Official Channels</span>
        </motion.div>
        
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900 mb-4 sm:mb-6 leading-[1.1]">
          Connect with the <br className="hidden sm:block" />
          <span className="text-indigo-600">Network</span>
        </h1>
        <p className="text-slate-500 max-w-2xl text-sm sm:text-base md:text-lg leading-relaxed mx-auto md:mx-0">
          Centralized coordination for the IIIT ecosystem. Follow our verified handles 
          for institutional updates and community coordination.
        </p>
      </motion.section>

      <motion.section 
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-5xl mx-auto px-5 sm:px-8"
      >
        {/* TOP TIER CONTACTS - Stacked on Mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-6">
          <motion.a
  variants={item}
  href="mailto:iiitiansnetwork@gmail.com"
  className="group bg-white p-6 sm:p-8 rounded-2xl sm:rounded-[22px] border border-slate-200 hover:border-indigo-400 transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
>
  <Mail className="text-indigo-600 mb-3 sm:mb-4" size={24} />
  <h3 className="font-bold text-base sm:text-lg">Official Email</h3>
  <p className="text-slate-400 text-xs mb-3 sm:mb-4">
    Verification & Inquiries
  </p>
  <span className="text-indigo-600 text-sm font-bold flex items-center gap-1.5">
    Mail us
    <ArrowRight
      size={16}
      className="group-hover:translate-x-1 transition-transform"
    />
  </span>
</motion.a>


  <motion.a
  variants={item}
  href="https://www.instagram.com/iiitiansnetwork"
  target="_blank"
  rel="noreferrer"
  className="group bg-white p-6 sm:p-8 rounded-2xl sm:rounded-[22px] border border-slate-200 hover:border-pink-400 transition-all shadow-sm"
>
  <Instagram className="text-pink-600 mb-3 sm:mb-4" size={24} />
  <h3 className="font-bold text-base sm:text-lg">Instagram</h3>
  <p className="text-slate-400 text-xs mb-3 sm:mb-4">
    Community Highlights
  </p>
  <span className="text-pink-600 text-sm font-bold flex items-center gap-1.5">
    View Profile
    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
  </span>
</motion.a>

          {/* Transparency - Full width on small tablets */}
          <motion.div variants={item} className="sm:col-span-2 md:col-span-1 bg-indigo-50/50 p-6 sm:p-8 rounded-2xl sm:rounded-[22px] border border-indigo-100 relative overflow-hidden group">
            <ShieldCheck className="text-indigo-500 mb-3 sm:mb-4" size={24} />
            <h3 className="font-bold text-base sm:text-lg text-indigo-900">Transparency</h3>
            <p className="text-indigo-700/70 text-xs leading-relaxed pr-10">
              Public informational bridge. No data collection or personal tracking.
            </p>
            <div className="absolute -right-2 -bottom-2 text-indigo-100 opacity-40 pointer-events-none">
               <ShieldCheck size={70} />
            </div>
          </motion.div>
        </div>

        {/* SOCIAL LINKS - 2 cols on mobile, 5 on desktop */}
        <motion.div variants={item} className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4 mb-10">
          {socialLinks.map((social) => (
            <a 
              key={social.name}
              href={social.link}
              className={`flex items-center justify-center gap-2 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-200 bg-white transition-all text-slate-600 font-bold text-[10px] sm:text-[11px] uppercase tracking-widest group ${social.color}`}
            >
              <span className="group-hover:scale-110 transition-transform">{social.icon}</span>
              {social.name}
            </a>
          ))}
        </motion.div>

        {/* RECRUITMENT BOX - Responsive Flex */}
        <motion.div 
          variants={item}
          className="bg-white border border-slate-200 rounded-[24px] sm:rounded-[32px] p-6 sm:p-10 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8"
        >
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <div className="bg-indigo-600 text-white text-[9px] sm:text-[10px] font-black px-2.5 py-1 rounded-md mb-3 uppercase tracking-wider">
              Open Positions
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">Join the Core Team</h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-1.5 max-w-xs">Support collaboration and communication among IIITs.</p>
          </div>
          
          <motion.a
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            href="#"
            className="w-full md:w-auto bg-indigo-600 text-white px-8 sm:px-10 py-3.5 sm:py-4.5 rounded-xl sm:rounded-[18px] font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 hover:bg-indigo-700 transition-colors shadow-xl shadow-indigo-100"
          >
            Apply Now
            <ExternalLink size={20} />
          </motion.a>
        </motion.div>
      </motion.section>
    </div>
  );
}