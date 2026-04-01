"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Users, Target, Heart, Shield, Globe, Award } from "lucide-react";

const timeline = [
  { year: "2021", title: "Lancement", desc: "Première version bêta déployée à Kinshasa avec 10 pharmacies pilotes." },
  { year: "2022", title: "Expansion RDC", desc: "Ouverture à Lubumbashi et Goma. 100+ pharmacies actives." },
  { year: "2023", title: "International", desc: "Déploiement au Burundi et au Congo-Brazzaville. Lancement de l'IA prédictive." },
  { year: "2024", title: "Scale-up", desc: "500+ pharmacies. Partenariats avec les grands répartiteurs nationaux." },
];

const values = [
  { icon: Heart, title: "Empathie", desc: "Nous plaçons l'humain au cœur de chaque ligne de code." },
  { icon: Shield, title: "Intégrité", desc: "La sécurité et la confidentialité des données sont nos priorités absolues." },
  { icon: Award, title: "Excellence", desc: "Nous visons la perfection dans l'expérience utilisateur et le support." },
  { icon: Users, title: "Collaboration", desc: "Nous grandissons avec nos clients en écoutant leurs besoins réels." },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-24 sm:pt-28 pb-0 bg-white">
      {/* Hero */}
      <section className="px-4 sm:px-6 lg:px-8 mb-12 sm:mb-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-7"
            >
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600 mb-3">
                Notre histoire
              </p>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-display font-bold text-slate-900 mb-4 tracking-tight leading-[1.05]">
                Révolutionner la{" "}
                <span className="text-emerald-600">santé</span> en Afrique.
              </h1>
              <p className="text-base sm:text-lg text-slate-500 leading-relaxed mb-8 font-medium max-w-2xl">
                SyntixPharma est né d&apos;une vision simple : donner aux pharmaciens
                les outils technologiques nécessaires pour offrir des soins de
                qualité supérieure, partout et à tout moment.
              </p>
              <div className="flex flex-wrap gap-8 sm:gap-14">
                {[
                  { val: "2021", label: "Fondation" },
                  { val: "500+", label: "Clients" },
                  { val: "4", label: "Pays" },
                ].map((s) => (
                  <div key={s.label}>
                    <p className="text-4xl sm:text-5xl font-display font-bold text-slate-900 mb-1">
                      {s.val}
                    </p>
                    <p className="text-slate-400 text-[10px] uppercase tracking-[0.2em] font-black">
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="lg:col-span-5 relative aspect-[4/5] rounded-3xl overflow-hidden shadow-xl"
            >
              <Image
                src="/images/hero.svg"
                alt="SyntixPharma Team"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
              <div className="absolute bottom-8 sm:bottom-12 left-6 sm:left-10 right-6 sm:right-10">
                <p className="text-white text-xl sm:text-2xl font-display font-bold italic leading-tight">
                  &quot;Notre mission est d&apos;éliminer les barrières technologiques.&quot;
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-12 sm:py-16 bg-slate-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid sm:grid-cols-2 gap-5 sm:gap-6">
            <div className="p-8 sm:p-10 bg-white rounded-3xl border border-slate-200 shadow-sm">
              <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center mb-5">
                <Target className="w-7 h-7 text-emerald-600" />
              </div>
              <h2 className="text-xl font-display font-bold text-slate-900 mb-3">
                Notre mission
              </h2>
              <p className="text-sm text-slate-500 leading-relaxed">
                Fournir une plateforme de gestion intégrée, intuitive et
                sécurisée qui permet aux pharmacies de toutes tailles d&apos;optimiser
                leurs opérations, de réduire les pertes et d&apos;améliorer l&apos;accès
                aux médicaments essentiels pour leurs communautés.
              </p>
            </div>
            <div className="p-8 sm:p-10 bg-slate-900 text-white rounded-3xl shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 blur-3xl rounded-full" />
              <div className="w-14 h-14 bg-emerald-500/20 rounded-xl flex items-center justify-center mb-5">
                <Globe className="w-7 h-7 text-emerald-400" />
              </div>
              <h2 className="text-xl font-display font-bold mb-3">
                Notre vision
              </h2>
              <p className="text-sm text-slate-400 leading-relaxed">
                Devenir le standard technologique de la gestion pharmaceutique
                en Afrique subsaharienne, en créant un écosystème de santé
                connecté où chaque patient reçoit le bon traitement, au bon
                moment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-3">
              Notre parcours
            </p>
            <h2 className="text-3xl sm:text-5xl font-display font-bold text-slate-900 tracking-tight">
              Une croissance{" "}
              <span className="text-emerald-600">accélérée.</span>
            </h2>
          </div>
          <div className="relative">
            <div className="hidden sm:block absolute top-1/2 left-0 w-full h-px bg-slate-100 -translate-y-1/2" />
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 relative z-10">
              {timeline.map((item, i) => (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all group"
                >
                  <div className="text-4xl font-display font-bold text-emerald-100 mb-4 group-hover:text-emerald-600 transition-colors">
                    {item.year}
                  </div>
                  <h3 className="text-xl font-display font-bold text-slate-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 mb-3">
              Nos valeurs fondamentales
            </h2>
            <p className="text-base text-slate-500 max-w-xl mx-auto">
              Ce qui nous guide au quotidien dans le développement de nos
              solutions.
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {values.map((v) => (
              <div
                key={v.title}
                className="p-6 sm:p-8 rounded-2xl border border-slate-100 bg-white hover:shadow-lg transition-shadow text-center group"
              >
                <div className="w-14 h-14 bg-slate-50 rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:bg-emerald-50 transition-colors">
                  <v.icon className="w-7 h-7 text-slate-400 group-hover:text-emerald-600 transition-colors" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-1">
                  {v.title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team CTA */}
      <section className="py-12 sm:py-16 bg-slate-900 text-white px-4 sm:px-6 lg:px-8 mx-4 sm:mx-6 rounded-3xl sm:rounded-[3rem] mb-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-display font-bold mb-4 leading-tight">
                Une équipe{" "}
                <span className="text-emerald-400">passionnée</span> par
                l&apos;impact.
              </h2>
              <p className="text-base text-slate-400 leading-relaxed mb-8">
                Nos ingénieurs, pharmaciens et experts en santé travaillent main
                dans la main pour construire le futur de l&apos;officine.
              </p>
              <Link
                href="/contact"
                className="inline-flex px-8 py-4 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-600/20"
              >
                Rejoindre l&apos;aventure
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((n) => (
                <div
                  key={n}
                  className="aspect-[4/5] bg-slate-800 rounded-2xl overflow-hidden relative group"
                >
                  <Image
                    src="/images/hero.svg"
                    alt={`Membre ${n}`}
                    fill
                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60" />
                  <div className="absolute bottom-4 left-4">
                    <p className="font-bold text-sm">Membre {n}</p>
                    <p className="text-emerald-400 text-xs">Expert SyntixPharma</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
