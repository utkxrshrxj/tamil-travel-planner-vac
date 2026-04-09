import { useNavigate } from 'react-router-dom';
import { Compass, Train, Bus, Plane, Navigation, Mic, ShieldCheck, Map, Clock, Star, Heart } from 'lucide-react';
import { useEffect, useState } from 'react';

export function Landing() {
  const navigate = useNavigate();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const features = [
    {
      title: 'ரயில் சேவை',
      desc: 'தமிழகம் முழுதும் சிறந்த ரயில் பயண வசதிகள். பாதுகாப்பான மற்றும் வசதியான இருக்கைகள்.',
      icon: Train,
      img: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      color: 'text-blue-400'
    },
    {
      title: 'பஸ் டிக்கெட்',
      desc: 'அனைத்து முக்கிய நகரங்களுக்கும் சொகுசு மற்றும் சாதாரண பஸ் சேவைகள்.',
      icon: Bus,
      img: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      color: 'text-orange-400'
    },
    {
      title: 'விமான ஊர்தி',
      desc: 'இந்தியாவிற்குள் மற்றும் சர்வதேச பயணங்களுக்கான விரைவான விமான முன்பதிவு.',
      icon: Plane,
      img: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      color: 'text-green-400'
    }
  ];

  const showcase = [
    { name: 'மதுரை', img: 'https://plus.unsplash.com/premium_photo-1689838027426-bf5cc3a0131f?auto=format&fit=crop&w=800&q=80' },
    { name: 'ஊட்டி', img: 'https://plus.unsplash.com/premium_photo-1710631508459-301f144061c3?auto=format&fit=crop&w=800&q=80' },
    { name: 'கொடைக்கானல்', img: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80' },
    { name: 'கன்னியாகுமரி', img: 'https://plus.unsplash.com/premium_photo-1769871817044-a95266c650ab?auto=format&fit=crop&w=800&q=80' }
  ];

  return (
    <div className="relative min-h-screen font-sans bg-slate-950 overflow-x-hidden">
      
      {/* SECTION 1: HERO (100vh) */}
      <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Dynamic Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1590050752117-238cb12be0fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=2500&q=80" 
            alt="Tamil Nadu Travel" 
            className={`w-full h-full object-cover transition-transform duration-[20s] ease-out ${loaded ? 'scale-100' : 'scale-110'}`}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/20 via-slate-900/40 to-slate-950/70 backdrop-blur-[1px]"></div>
        </div>

        {/* Central Frosted Glass Panel */}
        <div className={`relative z-10 w-full max-w-4xl px-6 transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] opacity-0 ${loaded ? 'translate-y-0 opacity-100' : 'translate-y-16'}`}>
          <div className="glassmorphism-dark rounded-[40px] p-10 md:p-16 flex flex-col items-center text-center backdrop-blur-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/20 overflow-hidden relative">
            
            {/* Internal Card Background Image */}
            <div className="absolute inset-0 z-0">
              <img 
                src="https://images.unsplash.com/photo-1582510003544-4d00b7f74220?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
                alt="Temple Architecture" 
                className="w-full h-full object-cover opacity-30 mix-blend-soft-light"
              />
              <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[4px]"></div>
            </div>

            {/* Internal Background Shine */}
            <div className="absolute inset-0 z-0 opacity-20 pointer-events-none bg-gradient-to-tr from-white/0 via-white/30 to-white/0"></div>

            <div className="relative z-10 flex flex-col items-center">
              <div className={`mb-8 flex flex-col items-center opacity-0 ${loaded ? 'animate-fade-in delay-200' : ''}`}>
                <div className="p-5 rounded-full bg-white/10 shadow-inner border border-white/20 mb-4 inline-flex backdrop-blur-lg">
                  <Compass className="text-blue-400 drop-shadow-md" size={52} strokeWidth={1.5} />
                </div>
                <h2 className="text-3xl md:text-4xl tracking-widest font-extrabold text-slate-200 drop-shadow-lg">
                  நம்ம யாத்ரா
                </h2>
              </div>

              <h1 className={`text-5xl md:text-7xl lg:text-8xl font-extrabold text-white mb-6 drop-shadow-2xl tracking-tight leading-tight opacity-0 ${loaded ? 'animate-slide-up delay-300' : ''}`}>
                பயணத்தை <br className="md:hidden" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-indigo-300 font-black">தொடங்குங்கள்</span>
              </h1>
              
              <p className={`text-xl md:text-2xl text-slate-200 font-medium max-w-2xl mx-auto mb-12 drop-shadow-lg opacity-0 ${loaded ? 'animate-slide-up delay-500' : ''}`}>
                தமிழகத்தின் அழகிய இடங்களை நம்ம யாத்ராவின் நவீன சேவைகள் மூலம் கண்டுகளியுங்கள்
              </p>

              <div className={`opacity-0 ${loaded ? 'animate-slide-up delay-700' : ''}`}>
                <button 
                  onClick={() => navigate('/login')}
                  className="group relative inline-flex items-center justify-center overflow-hidden rounded-full p-4 px-12 font-bold bg-white shadow-[0_10px_40px_rgba(255,255,255,0.25)] transition-all duration-300 hover:scale-[1.05] active:scale-95 hover:shadow-[0_15px_50px_rgba(255,255,255,0.4)]"
                >
                  <span className="relative flex items-center text-xl md:text-2xl text-slate-900">
                    உள்ளே நுழைய
                    <Navigation className="ml-3 text-indigo-700 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </span>
                </button>
              </div>
            </div>
          </div>
          
          <div className="mt-8 animate-bounce transition-opacity duration-1000 delay-1000 text-white/40 flex flex-col items-center">
             <span className="text-xs uppercase tracking-widest mb-2 font-bold">மேலும் அறிய கீழே செல்லவும்</span>
             <div className="w-px h-12 bg-gradient-to-b from-white/40 to-transparent"></div>
          </div>
        </div>
      </section>

      {/* SECTION 2: SERVICES (DETAILED) */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col items-center mb-20 text-center">
          <h2 className="text-blue-400 text-sm font-bold tracking-[0.3em] uppercase mb-4">எங்கள் சேவைகள்</h2>
          <h3 className="text-4xl md:text-6xl font-bold text-white mb-6">நாங்கள் வழங்கும் வசதிகள்</h3>
          <div className="h-1.5 w-24 bg-blue-500 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {features.map((f, i) => (
            <div key={i} className="group relative glassmorphism-dark rounded-[30px] overflow-hidden border border-white/10 hover:border-blue-500/50 transition-all duration-500 h-[450px]">
               <div className="absolute inset-0 z-0">
                 <img src={f.img} alt={f.title} className="w-full h-full object-cover opacity-30 transition-transform duration-700 group-hover:scale-110" />
                 <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent"></div>
               </div>
               
               <div className="relative z-10 p-10 h-full flex flex-col justify-end">
                 <div className={`mb-6 p-4 rounded-2xl bg-white/5 border border-white/10 w-fit backdrop-blur-md ${f.color}`}>
                   <f.icon size={36} />
                 </div>
                 <h4 className="text-3xl font-bold text-white mb-4">{f.title}</h4>
                 <p className="text-slate-400 text-lg leading-relaxed">{f.desc}</p>
                 
                 <div className="mt-8 flex items-center text-blue-400 font-bold tracking-wide group-hover:translate-x-2 transition-transform cursor-pointer">
                    மேலும் அறிய <Navigation size={18} className="ml-2 rotate-90" />
                 </div>
               </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 3: AI POWERED SEARCH */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-600/5 backdrop-blur-[100px] z-0"></div>
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <div className="flex flex-col items-center">
            <div className="w-full max-w-5xl">
              <div className="glassmorphism-dark p-8 md:p-16 rounded-[50px] border border-white/10 shadow-2xl relative overflow-hidden backdrop-blur-3xl">
                {/* Decorative Elements */}
                <div className="absolute -top-24 -left-24 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>

                <div className="absolute top-8 right-8 p-6 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl shadow-xl animate-pulse z-20">
                   <Mic className="text-white" size={48} />
                </div>

                <div className="relative z-10">
                  <h2 className="text-blue-400 text-sm font-bold tracking-[0.3em] uppercase mb-6 text-center lg:text-left">நவீன தொழில்நுட்பம்</h2>
                  <h3 className="text-4xl md:text-6xl font-black text-white mb-8 text-center lg:text-left leading-tight">
                    செயற்கை நுண்ணறிவு (AI) <br/> தேடல் வசதி
                  </h3>
                  
                  <p className="text-slate-300 text-xl md:text-2xl leading-relaxed mb-12 text-center lg:text-left max-w-4xl">
                    எமது தளம் நவீன செயற்கை நுண்ணறிவு தொழில்நுட்பத்தைப் பயன்படுத்துகிறது. நீங்கள் எங்கு செல்ல விரும்புகிறீர்கள் என்று குரல் (Voice) மூலமாகவோ அல்லது உரை (Text) மூலமாகவோ கூறினால், எமது ஏஐ (AI) உங்கள் தேவையை நொடியில் புரிந்துகொண்டு சிறந்த பயணத் திட்டத்தை அமைத்துத் தரும்.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                     <div className="flex items-start gap-5 p-6 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group">
                        <div className="p-3 bg-blue-500/20 rounded-2xl group-hover:scale-110 transition-transform"><Mic className="text-blue-400" size={28} /></div>
                        <div>
                          <h5 className="text-white font-bold text-xl mb-2">குரல் வழி தேடல்</h5>
                          <p className="text-slate-400 leading-relaxed">தட்டச்சு செய்யத் தேவையில்லை, உங்கள் குரல் மூலமே தேடலாம்.</p>
                        </div>
                     </div>
                     <div className="flex items-start gap-5 p-6 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group">
                        <div className="p-3 bg-green-500/20 rounded-2xl group-hover:scale-110 transition-transform"><ShieldCheck className="text-green-400" size={28} /></div>
                        <div>
                          <h5 className="text-white font-bold text-xl mb-2">துல்லியமான தேடல்</h5>
                          <p className="text-slate-400 leading-relaxed">நுண்ணறிவுடன் உங்கள் தேவைகளைப் புரிந்துகொண்டு முடிவுகளைத் தரும்.</p>
                        </div>
                     </div>
                     <div className="flex items-start gap-5 p-6 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group">
                        <div className="p-3 bg-purple-500/20 rounded-2xl group-hover:scale-110 transition-transform"><Clock className="text-purple-400" size={28} /></div>
                        <div>
                          <h5 className="text-white font-bold text-xl mb-2">நேர மேலாண்மை</h5>
                          <p className="text-slate-400 leading-relaxed">மிகக் குறைந்த நேரத்தில் அதிக விவரங்களை பெற்றுத் தரும்.</p>
                        </div>
                     </div>
                     <div className="flex items-start gap-5 p-6 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group">
                        <div className="p-3 bg-amber-500/20 rounded-2xl group-hover:scale-110 transition-transform"><Navigation className="text-amber-400" size={28} /></div>
                        <div>
                          <h5 className="text-white font-bold text-xl mb-2">தானியங்கி வழித்தடம்</h5>
                          <p className="text-slate-400 leading-relaxed">சிறந்த மற்றும் விரைவான பயண வழிகளை பரிந்துரைக்கும்.</p>
                        </div>
                     </div>
                     <div className="flex items-start gap-5 p-6 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group">
                        <div className="p-3 bg-red-500/20 rounded-2xl group-hover:scale-110 transition-transform"><Heart className="text-red-400" size={28} /></div>
                        <div>
                          <h5 className="text-white font-bold text-xl mb-2">பயனர் விருப்பம்</h5>
                          <p className="text-slate-400 leading-relaxed">உங்கள் ரசனைக்கு ஏற்ப இடங்களை முன்னிலைப்படுத்தும்.</p>
                        </div>
                     </div>
                     <div className="flex items-start gap-5 p-6 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group">
                        <div className="p-3 bg-teal-500/20 rounded-2xl group-hover:scale-110 transition-transform"><Map className="text-teal-400" size={28} /></div>
                        <div>
                          <h5 className="text-white font-bold text-xl mb-2">முழுமையான விவரம்</h5>
                          <p className="text-slate-400 leading-relaxed">பயணம் தொடர்பான அனைத்து தகவல்களையும் ஒரே இடத்தில் பெறலாம்.</p>
                        </div>
                     </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: SHOWCASE GALLERY */}
      <section className="py-24 px-6 md:px-12 bg-slate-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tight">தமிழகத்தின் சொர்க்கம்</h3>
            <p className="text-slate-400 text-xl font-medium">முக்கிய சுற்றுலா தளங்கள்</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {showcase.map((s, i) => (
              <div key={i} className="group relative h-[400px] rounded-[30px] overflow-hidden shadow-2xl">
                <img src={s.img} alt={s.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80"></div>
                <div className="absolute bottom-0 left-0 right-0 p-8 flex flex-col items-center transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                   <h4 className="text-2xl font-black text-white mb-2 tracking-wide font-sans">{s.name}</h4>
                   <div className="w-12 h-1 bg-blue-500 rounded-full mb-4 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5: FINAL CTA */}
      <section className="py-32 px-6 relative overflow-hidden flex flex-col items-center text-center">
        <div className="absolute inset-0 bg-blue-900/20 z-0"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto">
          <h2 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter">இன்றே இணையுங்கள்</h2>
          <p className="text-slate-300 text-2xl font-medium mb-12 opacity-80 leading-relaxed">
            உங்கள் கனவுப் பயணத்தை நம்ம யாத்ராவுடன் தொடங்கி, <br className="hidden md:block"/> மறக்க முடியாத அனுபவங்களைப் பெறுங்கள்.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button 
              onClick={() => navigate('/login')}
              className="w-full sm:w-auto px-12 py-5 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-2xl transition-all duration-300 shadow-[0_15px_40px_rgba(37,99,235,0.4)] hover:shadow-[0_20px_50px_rgba(37,99,235,0.6)] hover:-translate-y-1 active:scale-95"
            >
              இப்போதே தொடங்குங்கள்
            </button>
            <div className="text-slate-500 text-xl font-medium flex items-center gap-6 h-full">
               <span className="px-6">100% பாதுகாப்பானது</span>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER MINI */}
      <footer className="py-12 border-t border-white/5 text-center text-slate-500 relative z-10 px-6">
         <div className="flex items-center justify-center gap-2 mb-4">
            <Compass size={20} className="text-blue-500" />
            <span className="font-black text-xl text-white tracking-widest uppercase mb-0.5 text-nowrap">நம்ம யாத்ரா</span>
         </div>
         <p className="text-sm font-medium tracking-widest uppercase">&copy; 2026 நம்ம யாத்ரா. அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.</p>
      </footer>

    </div>
  );
}
