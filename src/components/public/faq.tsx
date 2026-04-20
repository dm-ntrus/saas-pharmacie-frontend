'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
import { useTranslations } from '@/lib/i18n-simple';
import { useMarketingFaqs } from '@/hooks/api/usePublicDynamicModules';

export default function FAQ() {
  const t = useTranslations('marketing');
  const { data } = useMarketingFaqs('home');

  const fallbackFaqs = [
    { q: t('faq1Q'), a: t('faq1A') },
    { q: t('faq2Q'), a: t('faq2A') },
    { q: t('faq3Q'), a: t('faq3A') },
    { q: t('faq4Q'), a: t('faq4A') }
  ];
  const faqs = data?.length
    ? data.map((item: any) => ({ q: item.question, a: item.answer }))
    : fallbackFaqs;

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-14 sm:py-24 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4 font-display">
              {t('faqTitle')}{' '}
              <span className="text-emerald-600">{t('faqHighlight')}</span>
            </h2>
            <p className="text-slate-600">
              {t('faqDesc')}
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div 
                key={i} 
                className="bg-white rounded-3xl border border-slate-200 overflow-hidden transition-all duration-300 hover:border-emerald-200 shadow-sm"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="w-full px-5 sm:px-8 py-4 sm:py-6 flex items-center justify-between text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40"
                >
                  <span className="font-bold text-slate-900 pr-3">{faq.q}</span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${openIndex === i ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                    {openIndex === i ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </div>
                </button>
                <AnimatePresence>
                  {openIndex === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="px-5 sm:px-8 pb-6 sm:pb-8 text-slate-600 leading-relaxed text-sm">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
