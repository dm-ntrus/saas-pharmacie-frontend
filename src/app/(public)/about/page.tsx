'use client';

import { motion } from 'motion/react';
import Image from 'next/image';
import { Users, Target, Heart, Shield, Globe, Award } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-24 pb-24 bg-white">
      {/* Hero Section */}
      <section className="px-6 mb-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-7"
            >
              <div className="inline-flex items-center gap-3 px-5 py-2 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-black mb-4 border border-emerald-100 uppercase tracking-[0.2em]">
                Notre Histoire
              </div>
              <h1 className="text-5xl lg:text-7xl font-display font-bold text-slate-900 mb-4 tracking-[-0.04em] leading-[0.9]">
                Révolutionner la <br />
                <span className="text-emerald-600">Santé</span> en Afrique.
              </h1>
              <p className="text-xl text-slate-500 leading-relaxed mb-6 font-medium max-w-2xl">
                SyntixPharma est né d&apos;une vision simple : donner aux pharmaciens les outils technologiques nécessaires pour offrir des soins de qualité supérieure, partout et à tout moment.
              </p>
              <div className="flex gap-16">
                <div>
                  <p className="text-6xl font-display font-bold text-slate-900 mb-2">2021</p>
                  <p className="text-slate-400 text-xs uppercase tracking-[0.2em] font-black">Fondation</p>
                </div>
                <div>
                  <p className="text-6xl font-display font-bold text-slate-900 mb-2">500+</p>
                  <p className="text-slate-400 text-xs uppercase tracking-[0.2em] font-black">Clients</p>
                </div>
                <div>
                  <p className="text-6xl font-display font-bold text-slate-900 mb-2">4</p>
                  <p className="text-slate-400 text-xs uppercase tracking-[0.2em] font-black">Pays</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="lg:col-span-5 relative aspect-[4/5] rounded-[4rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)]"
            >
              <Image
                src="/images/hero.png"
                alt="SyntixPharma Team"
                fill
                className="object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
              <div className="absolute bottom-16 left-12 right-12">
                <p className="text-white text-3xl font-display font-bold italic leading-tight">
                  &quot;Notre mission est d&apos;éliminer les barrières technologiques.&quot;
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-12 bg-slate-50 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-10 bg-white rounded-[3rem] border border-slate-200 shadow-sm">
              <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mb-4">
                <Target className="w-8 h-8 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-display font-bold text-slate-900 mb-2">Notre Mission</h2>
              <p className=" text-slate-500 leading-relaxed">
                Fournir une plateforme de gestion intégrée, intuitive et sécurisée qui permet aux pharmacies de toutes tailles d&apos;optimiser leurs opérations, de réduire les pertes et d&apos;améliorer l&apos;accès aux médicaments essentiels pour leurs communautés.
              </p>
            </div>
            <div className="p-10 bg-slate-900 text-white rounded-[3rem] shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-3xl rounded-full"></div>
              <div className="w-16 h-16 bg-emerald-500/20 rounded-2xl flex items-center justify-center mb-4">
                <Globe className="w-8 h-8 text-emerald-400" />
              </div>
              <h2 className="text-2xl font-display font-bold mb-2">Notre Vision</h2>
              <p className=" text-slate-400 leading-relaxed">
                Devenir le standard technologique de la gestion pharmaceutique en Afrique subsaharienne, en créant un écosystème de santé connecté où chaque patient reçoit le bon traitement, au bon moment, grâce à une gestion de données intelligente.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-16 px-6 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-slate-50 text-slate-500 rounded-full text-[10px] font-black mb-6 border border-slate-100 uppercase tracking-[0.2em]">
              Notre Parcours
            </div>
            <h2 className="text-4xl lg:text-6xl font-display font-bold text-slate-900 mb-8 tracking-tight">Une croissance <span className="text-emerald-600">accélérée.</span></h2>
          </div>

          <div className="relative">
            <div className="absolute top-1/2 left-0 w-full h-px bg-slate-100 -translate-y-1/2 hidden md:block"></div>
            <div className="grid md:grid-cols-4 gap-6 relative z-10">
              {[
                { year: "2021", title: "Lancement", desc: "Première version bêta déployée à Kinshasa avec 10 pharmacies pilotes." },
                { year: "2022", title: "Expansion RDC", desc: "Ouverture de bureaux à Lubumbashi et Goma. 100+ pharmacies actives." },
                { year: "2023", title: "International", desc: "Déploiement au Burundi et au Congo-Brazzaville. Lancement de l'IA prédictive." },
                { year: "2024", title: "Scale-up", desc: "500+ pharmacies. Partenariats avec les grands répartiteurs nationaux." },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 group"
                >
                  <div className="text-5xl font-display font-bold text-emerald-100 mb-6 group-hover:text-emerald-600 transition-colors duration-500">
                    {item.year}
                  </div>
                  <h3 className="text-2xl font-display font-bold text-slate-900 mb-4">{item.title}</h3>
                  <p className="text-slate-500 leading-relaxed font-medium">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-display font-bold text-slate-900 mb-4">Nos Valeurs Fondamentales</h2>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto">
              Ce qui nous guide au quotidien dans le développement de nos solutions.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Heart, title: "Empathie", desc: "Nous plaçons l'humain au cœur de chaque ligne de code." },
              { icon: Shield, title: "Intégrité", desc: "La sécurité et la confidentialité des données sont nos priorités absolues." },
              { icon: Award, title: "Excellence", desc: "Nous visons la perfection dans l'expérience utilisateur et le support." },
              { icon: Users, title: "Collaboration", desc: "Nous grandissons avec nos clients en écoutant leurs besoins réels." },
            ].map((value, i) => (
              <div key={i} className="p-8 rounded-[2rem] border border-slate-100 bg-white hover:shadow-xl transition-shadow text-center group">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:bg-emerald-50 transition-colors">
                  <value.icon className="w-8 h-8 text-slate-400 group-hover:text-emerald-600 transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">{value.title}</h3>
                <p className="text-slate-500 leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-slate-50 text-slate-500 rounded-full text-[10px] font-black mb-4 border border-slate-100 uppercase tracking-[0.2em]">
              Confiance
            </div>
            <h2 className="text-4xl lg:text-5xl font-display font-bold text-slate-900 mb-4">Ils nous font confiance</h2>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto">
              Des institutions de santé et des pharmacies leaders à travers le continent.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-12 items-center opacity-50 grayscale hover:grayscale-0 transition-all duration-700">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex items-center justify-center">
                <div className="w-32 h-12 bg-slate-100 rounded-lg animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section Placeholder */}
      <section className="py-24 bg-slate-900 text-white px-6 rounded-[4rem] mx-6">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-4xl lg:text-6xl font-display font-bold mb-8 leading-tight">Une Équipe <span className="text-emerald-400">Passionnée</span> par l&apos;Impact.</h2>
              <p className="text-xl text-slate-400 leading-relaxed mb-12">
                Nos ingénieurs, pharmaciens et experts en santé travaillent main dans la main pour construire le futur de l&apos;officine.
              </p>
              <button className="px-10 py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/20">
                Rejoindre l&apos;aventure
              </button>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="aspect-[4/5] bg-slate-800 rounded-3xl overflow-hidden relative group">
                  <Image
                    src={`/images/hero.png`}
                    alt="Team Member"
                    fill
                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60"></div>
                  <div className="absolute bottom-6 left-6">
                    <p className="font-bold text-lg">Membre {n}</p>
                    <p className="text-emerald-400 text-sm">Expert SyntixPharma</p>
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