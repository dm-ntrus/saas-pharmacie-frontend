"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "@/lib/i18n-simple";
import {
  ArrowLeft,
  Send,
  User,
  Bot,
  Clock,
  CheckCircle2,
  AlertCircle,
  Phone,
  Mail,
} from "lucide-react";
import { Link } from "@/i18n/navigation";

interface Message {
  id: string;
  role: "user" | "agent" | "bot";
  content: string;
  timestamp: Date;
}

const FAQ_ANSWERS: Record<string, string> = {
  "hours": "Nos heures de support en direct sont 24h/24, 7j/7 pour tous les clients Enterprise. Pour les autres plans, le support est disponible de 8h à 18h (Heure de Kinshasa) lun-sam.",
  "pricing": "Le prix dépend de votre plan. Starter à partir de 50$/mois, Professional à 150$/mois, et Enterprise sur devis. Tous les prix sont hors taxes.",
  "demo": "Vous pouvez planifier une démo gratuite sur /plan_demo. Nous proposons aussi un essai gratuit de 14 jours sur tous les plans.",
  "features": "SyntixPharma inclut: gestion des stocks, POS, patients, ordonnances, facturation, conformité, et bien plus. Voir tous les modules sur /modules.",
  "data": "Vos données sont stockées sur des serveurs sécurisés en Afrique (RD Congo) avec replication. Nous respectons HIPAA et GDP.",
};

export default function LiveSupportPage() {
  const t = useTranslations("pages.liveSupport");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [ticketCreated, setTicketCreated] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const startSession = () => {
    if (!name || !email) return;
    setSessionStarted(true);
    setMessages([
      {
        id: "1",
        role: "bot",
        content: t("welcomeMessage"),
        timestamp: new Date(),
      },
    ]);
  };

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: newMessage,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setNewMessage("");

    setIsTyping(true);
    setTimeout(() => {
      const lowerMsg = newMessage.toLowerCase();
      let responseContent = t("defaultResponse");

      for (const [key, answer] of Object.entries(FAQ_ANSWERS)) {
        if (lowerMsg.includes(key)) {
          responseContent = answer;
          break;
        }
      }

      const agentMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "agent",
        content: responseContent,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, agentMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const createTicket = () => {
    setTicketCreated(true);
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        role: "bot",
        content: t("ticketCreatedMessage"),
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <div className="min-h-screen pt-28 sm:pt-32 pb-16 sm:pb-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/support"
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-emerald-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour au support
          </Link>
        </div>

        <div className="text-center max-w-3xl mx-auto mb-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600 mb-3">
              {t("tag")}
            </p>
            <h1 className="text-3xl sm:text-5xl font-display font-bold text-slate-900 mb-4 tracking-tight">
              {t("title")}
            </h1>
            <p className="text-base text-slate-500 font-medium leading-relaxed max-w-lg mx-auto">
              {t("desc")}
            </p>
          </motion.div>
        </div>

        {/* Status Banner */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <span className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            {t("onlineStatus")}
          </span>
        </div>

        {!sessionStarted ? (
          /* Pre-chat form */
          <div className="max-w-lg mx-auto">
            <div className="bg-slate-50 rounded-3xl border border-slate-100 p-8">
              <h2 className="text-lg font-display font-bold text-slate-900 mb-6">
                {t("formTitle")}
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                    {t("nameLabel")}
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t("namePlaceholder")}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                    {t("emailLabel")}
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t("emailPlaceholder")}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                    {t("subjectLabel")}
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500"
                  >
                    <option value="">{t("subjectPlaceholder")}</option>
                    <option value="technical">{t("subjectTechnical")}</option>
                    <option value="billing">{t("subjectBilling")}</option>
                    <option value="onboarding">{t("subjectOnboarding")}</option>
                    <option value="features">{t("subjectFeatures")}</option>
                    <option value="other">{t("subjectOther")}</option>
                  </select>
                </div>
                <button
                  onClick={startSession}
                  disabled={!name || !email}
                  className="w-full py-4 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t("startChat")}
                </button>
              </div>
            </div>

            {/* Other options */}
            <div className="grid sm:grid-cols-2 gap-4 mt-6">
              <Link
                href="/support/tickets"
                className="flex items-center justify-center gap-2 p-4 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:border-emerald-200 hover:text-emerald-700 transition-colors"
              >
                <AlertCircle className="w-4 h-4" />
                {t("createTicket")}
              </Link>
              <a
                href="mailto:support@syntixpharma.com"
                className="flex items-center justify-center gap-2 p-4 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:border-emerald-200 hover:text-emerald-700 transition-colors"
              >
                <Mail className="w-4 h-4" />
                {t("emailInstead")}
              </a>
            </div>
          </div>
        ) : (
          /* Chat interface */
          <div className="max-w-3xl mx-auto">
            <div className="bg-slate-50 rounded-3xl border border-slate-100 overflow-hidden">
              {/* Chat header */}
              <div className="bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-slate-900">Support SyntixPharma</p>
                    <p className="text-xs text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      {t("agentAvailable")}
                    </p>
                  </div>
                </div>
                <button
                  onClick={createTicket}
                  disabled={ticketCreated}
                  className="text-xs font-bold text-slate-500 hover:text-emerald-600 transition-colors disabled:opacity-50"
                >
                  {ticketCreated ? t("ticketCreated") : t("convertToTicket")}
                </button>
              </div>

              {/* Messages */}
              <div className="h-[400px] overflow-y-auto p-6 space-y-4">
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                        msg.role === "user"
                          ? "bg-slate-900 text-white"
                          : msg.role === "agent"
                          ? "bg-emerald-50 text-slate-900 border border-emerald-100"
                          : "bg-slate-100 text-slate-900"
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        {msg.role !== "user" && (
                          <Bot className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                        )}
                        <p className="text-sm leading-relaxed">{msg.content}</p>
                      </div>
                      <p
                        className={`text-[10px] mt-1 ${
                          msg.role === "user" ? "text-slate-400" : "text-slate-400"
                        }`}
                      >
                        <Clock className="w-3 h-3 inline mr-1" />
                        {msg.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </motion.div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-emerald-50 border border-emerald-100 px-4 py-3 rounded-2xl">
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <Bot className="w-4 h-4 text-emerald-600" />
                        <span className="flex gap-1">
                          <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" />
                          <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.1s]" />
                          <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="bg-white border-t border-slate-100 p-4">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    placeholder={t("messagePlaceholder")}
                    className="flex-1 px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!newMessage.trim()}
                    className="px-4 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="flex items-center justify-center gap-4 mt-6 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <Phone className="w-3 h-3" />
                +243 99 000 0000
              </span>
              <span>•</span>
              <span>support@syntixpharma.com</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}