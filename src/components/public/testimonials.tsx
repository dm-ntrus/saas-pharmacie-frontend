'use client';

import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { useTranslations } from '@/lib/i18n-simple';
import { useMarketingTestimonials } from '@/hooks/api/usePublicDynamicModules';

export default function Testimonials() {
  const t = useTranslations('marketing');
  const { data } = useMarketingTestimonials();

  const fallbackTestimonials = [
    {
      name: t('testimonial1Name'),
      role: t('testimonial1Role'),
      content: t('testimonial1Content'),
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah'
    },
    {
      name: t('testimonial2Name'),
      role: t('testimonial2Role'),
      content: t('testimonial2Content'),
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=JP'
    },
    {
      name: t('testimonial3Name'),
      role: t('testimonial3Role'),
      content: t('testimonial3Content'),
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Amina'
    }
  ];

  const testimonials = (data?.length
    ? data.map((entry: any) => ({
        name: entry.author_name,
        role: entry.author_role,
        content: entry.content,
        avatar: entry.avatar_url,
      }))
    : fallbackTestimonials);

  return (
    <section className="py-12 sm:py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4 font-display">
            {t('testimonialsTitle')}{' '}
            <span className="text-emerald-600">{t('testimonialsHighlight')}</span>
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            {t('testimonialsDesc')}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 sm:gap-8">
          {testimonials.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="p-5 sm:p-8 bg-slate-50 rounded-[2rem] border border-slate-100 relative group hover:bg-white hover:shadow-2xl hover:border-emerald-100 transition-all duration-500 h-full flex flex-col"
            >
              <Quote className="absolute top-6 right-8 w-12 h-12 text-emerald-600/10 group-hover:text-emerald-600/20 transition-colors" />
              <div className="flex gap-1 mb-6">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-4 h-4 text-emerald-500 fill-current" />
                ))}
              </div>
              <p className="text-slate-700 leading-relaxed mb-8 relative z-10 line-clamp-6 min-h-[9rem]">
                &quot;{item.content}&quot;
              </p>
              <div className="flex items-center gap-4 mt-auto">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-md relative">
                </div>
                <div>
                  <p className="font-bold text-slate-900 line-clamp-1">{item.name}</p>
                  <p className="text-xs text-slate-500 font-medium line-clamp-1">{item.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
