'use client';

import { motion } from 'motion/react';
import { Check, ArrowRight, Zap, ShieldCheck, HelpCircle, CheckCircle2, X, Plus, Star } from 'lucide-react';
import Link from 'next/link';

const pricingPlans = [
  {
    name: 'Simple',
    price: '29',
    desc: 'Pour les petites pharmacies de quartier.',
    features: ['1 Pharmacien', 'Inventaire de base', 'Ventes POS', 'Support Email', '14 jours d&apos;essai'],
    color: 'slate',
    cta: 'Démarrer'
  },
  {
    name: 'Standard',
    price: '99',
    desc: 'La solution complète pour pharmacies établies.',
    features: ['Illimité', 'IA Prédictive', 'Comptabilité', 'Multi-devises', 'Support 24/7', 'Mobile Money'],
    color: 'emerald',
    popular: true,
    cta: 'Choisir Standard'
  },
  {
    name: 'Grossiste',
    price: '199',
    desc: 'Pour les distributeurs et chaînes.',
    features: ['Multi-sites', 'Gestion Entrepôt', 'API Accès', 'Manager Dédié', 'Formation sur site', 'SLA Garanti'],
    color: 'slate',
    cta: 'Contacter Ventes'
  }
];

export default function PricingPage() {
  return (
    <div className="min-h-screen pt-32 pb-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-4xl mx-auto mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-3 px-5 py-2 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-black mb-4 border border-emerald-100 uppercase tracking-[0.2em]">
              Tarification
            </div>
            <h1 className="text-5xl lg:text-7xl font-display font-bold text-slate-900 mb-4 tracking-[-0.04em] leading-[0.9]">
              Investissez dans <br />
              votre <span className="text-emerald-600">Succès.</span>
            </h1>
            <p className="text-xl text-slate-500 leading-relaxed font-medium max-w-2xl mx-auto">
              Des forfaits transparents conçus pour accompagner chaque étape de la vie de votre officine.
            </p>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-3 gap-10 mb-16">
          {pricingPlans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`relative p-12 rounded-[3rem] border ${
                plan.popular 
                  ? 'bg-slate-900 text-white border-slate-800 shadow-2xl shadow-emerald-600/20' 
                  : 'bg-slate-50 border-slate-100 text-slate-900'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-2 bg-emerald-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl">
                  Recommandé
                </div>
              )}
              <div className="mb-10">
                <h3 className="text-2xl font-display font-bold mb-4">{plan.name}</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-6xl font-display font-bold">${plan.price}</span>
                  <span className={`text-sm font-bold uppercase tracking-widest ${plan.popular ? 'text-slate-400' : 'text-slate-500'}`}>/ mois</span>
                </div>
                <p className={`mt-6 text-lg leading-relaxed ${plan.popular ? 'text-slate-400' : 'text-slate-500'}`}>{plan.desc}</p>
              </div>

              <ul className="space-y-3 mb-10">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-4">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${plan.popular ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-600'}`}>
                      <Check className="w-4 h-4" />
                    </div>
                    <span className="font-medium">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link 
                href="/auth/register"
                className={`w-full py-5 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-3 ${
                  plan.popular 
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-xl shadow-emerald-600/20' 
                    : 'bg-slate-900 text-white hover:bg-emerald-600'
                }`}
              >
                {plan.cta}
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Comparison Table */}
        <section className="mb-24">
          <div className="text-center mb-10">
            <h2 className="text-4xl lg:text-6xl font-display font-bold text-slate-900 mb-4 tracking-tight">Comparatif Détaillé</h2>
            <p className="text-xl text-slate-500 font-medium">Comparez les fonctionnalités pour trouver le plan idéal.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="py-6 px-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Fonctionnalité</th>
                  <th className="py-6 px-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] text-center">Simple</th>
                  <th className="py-6 px-6 text-[10px] font-black text-emerald-600 uppercase tracking-[0.3em] text-center">Standard</th>
                  <th className="py-6 px-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] text-center">Grossiste</th>
                </tr>
              </thead>
              <tbody className="text-slate-900 font-medium">
                {[
                 { name: 'Gestion de Stock', simple: true, standard: true, grossiste: true },
                 { name: 'Ventes & POS', simple: true, standard: true, grossiste: true },
                 { name: 'Rapports de base', simple: true, standard: true, grossiste: true },
                 { name: 'Alertes péremption', simple: false, standard: true, grossiste: true },
                 { name: 'Gestion Patients', simple: false, standard: true, grossiste: true },
                 { name: 'Multi-utilisateurs', simple: '1', standard: 'Jusqu\'à 5', grossiste: 'Illimité' },
                 { name: 'Analyses IA', simple: false, standard: false, grossiste: true },
                 { name: 'Support Prioritaire', simple: false, standard: false, grossiste: true },
                ].map((row, i) => (
                  <tr key={i} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="py-6 px-6 text-lg">{row.name}</td>
                    <td className="py-6 px-6 text-center">
                      {typeof row.simple === 'boolean' ? (row.simple ? <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto" /> : <X className="w-6 h-6 text-slate-200 mx-auto" />) : row.simple}
                    </td>
                    <td className="py-6 px-6 text-center text-emerald-600 font-bold">
                      {typeof row.standard === 'boolean' ? (row.standard ? <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto" /> : <X className="w-6 h-6 text-slate-200 mx-auto" />) : row.standard}
                    </td>
                    <td className="py-6 px-6 text-center">
                      {typeof row.grossiste === 'boolean' ? (row.grossiste ? <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto" /> : <X className="w-6 h-6 text-slate-200 mx-auto" />) : row.grossiste}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-24 bg-slate-50 rounded-[4rem] px-12 lg:px-24">
          <div className="grid lg:grid-cols-2 gap-20">
            <div>
              <h2 className="text-4xl lg:text-6xl font-display font-bold text-slate-900 mb-8 tracking-tight leading-tight">Questions <br />Fréquentes.</h2>
              <p className="text-xl text-slate-500 leading-relaxed font-medium mb-12">
                Tout ce que vous devez savoir pour démarrer sereinement avec SyntixPharma.
              </p>
              <Link href="/contact" className="inline-flex items-center gap-3 text-emerald-600 font-black uppercase tracking-widest text-xs group">
                Encore des questions ? Contactez-nous
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>
            <div className="space-y-8">
              {[
                { q: 'Puis-je changer de plan à tout moment ?', a: 'Oui, vous pouvez upgrader ou downgrader votre forfait directement depuis votre interface administrateur. Le changement est immédiat.' },
                { q: 'Y a-t-il des frais d&apos;installation ?', a: 'Non, SyntixPharma est une solution Cloud. L&apos;activation est instantanée et gratuite. Nous proposons toutefois des services d&apos;accompagnement sur mesure.' },
                { q: 'Mes données sont-elles exportables ?', a: 'Absolument. Vos données vous appartiennent. Vous pouvez exporter vos stocks, ventes et dossiers patients en format Excel ou CSV à tout moment.' },
                { q: 'Proposez-vous des tarifs annuels ?', a: 'Oui, nous offrons une réduction de 20% pour tout engagement annuel. Contactez notre équipe commerciale pour en bénéficier.' },
              ].map((faq, i) => (
                <div key={i} className="group">
                  <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-4">
                    <Plus className="w-5 h-5 text-emerald-500 group-hover:rotate-90 transition-transform" />
                    {faq.q}
                  </h4>
                  <p className="text-slate-500 leading-relaxed pl-9">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}