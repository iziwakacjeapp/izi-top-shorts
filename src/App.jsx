import React, { useState, useEffect, useRef } from 'react';
import { Heart, Share2, Volume2, VolumeX, MapPin, Star, ChevronRight, Phone, Users, Calendar, X, Settings2, Globe, Check, Clock, ShieldCheck, Award } from 'lucide-react';

// === BAZA DANYCH (Wyselekcjonowane Bestsellery) ===
const MOCK_VIDEOS = [
  {
    id: '25279',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    name: 'Najtańsze ALL INCLUSIVE',
    location: 'Turcja, Riwiera',
    rating: '4.9',
    badge: 'HIT SPRZEDAŻY 🏆',
    desc: 'Absolutny pewniak! 🔥 Najniższa cena za ten standard w tym sezonie. Idealne dla rodzin szukających świętego spokoju.',
    price: 'od 2199 zł'
  },
  {
    id: '88123',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', 
    name: 'Greckie Wakacje Życia',
    location: 'Grecja, Zakynthos',
    rating: '4.7',
    badge: 'WYBÓR EKSPERTÓW 💎',
    desc: 'Białe klify i błękitna woda 🐢. Hotel sprawdzony przez setki naszych klientów. Gwarancja satysfakcji.',
    price: 'od 2599 zł'
  },
  {
    id: '12345',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4', 
    name: 'Kamelya Aishen Club',
    location: 'Turcja, Side',
    rating: '4.8',
    badge: 'GWARANCJA IZI 🛡️',
    desc: 'Potężny aquapark i ultra all inclusive! 🌊 Bezpiecznie, czysto i z najlepszym jedzeniem w regionie.',
    price: 'od 2899 zł'
  },
  {
    id: '99234',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4', 
    name: 'Luksusowa Majorka',
    location: 'Hiszpania, Majorka',
    rating: '4.6',
    badge: 'POLECAJKA 2026 🔥',
    desc: 'Elegancki hotel tuż przy plaży. Styl, jakość i niesamowite widoki. Dla tych, co wymagają więcej.',
    price: 'od 3100 zł'
  },
  {
    id: '67890',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4', 
    name: 'Rixos Premium',
    location: 'Egipt, Sharm El Sheikh',
    rating: '5.0',
    badge: 'ABSOLUTNY TOP 👑',
    desc: 'Prywatna rafa koralowa i serwis na najwyższym poziomie 🐠 Tu poczujesz się jak prawdziwy król.',
    price: 'od 4200 zł'
  }
];

const DESTINATIONS = [
  { id: 'Turcja', label: 'Turcja', flag: '🇹🇷' },
  { id: 'Grecja', label: 'Grecja', flag: '🇬🇷' },
  { id: 'Egipt', label: 'Egipt', flag: '🇪🇬' },
  { id: 'Hiszpania', label: 'Hiszpania', flag: '🇪🇸' },
  { id: 'Bułgaria', label: 'Bułgaria', flag: '🇧🇬' },
  { id: 'Chorwacja', label: 'Chorwacja', flag: '🇭🇷' },
  { id: 'Maroko', label: 'Maroko', flag: '🇲🇦' }
];

// === LOGIKA GENEROWANIA LINKÓW IZI ===
const generateIziUrl = (hotelId, prefs) => {
  let dateStr;
  if (prefs && prefs.isCustomDate) {
    dateStr = prefs.date;
  } else {
    const baseDate = new Date();
    baseDate.setDate(baseDate.getDate() + 30);
    const startDate = new Date(baseDate);
    startDate.setDate(startDate.getDate() - 3);
    dateStr = startDate.toISOString().split('T')[0];
  }
  const adults = prefs ? prefs.adults : 2;
  const children = prefs ? prefs.children : 0;
  return `https://iziwakacje.pl/szukaj?hotel_id=${hotelId}&data_od=${dateStr}&dorosli=${adults}&dzieci=${children}`;
};

export default function App() {
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const containerRef = useRef(null);

  const [prefs, setPrefs] = useState({ adults: 2, children: 0, date: new Date().toISOString().split('T')[0], isCustomDate: false });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [ratingState, setRatingState] = useState({ isOpen: false, videoId: null, score: 10, opinion: '' });
  const [isDestsOpen, setIsDestsOpen] = useState(false);
  const [selectedDests, setSelectedDests] = useState([]);
  const [callState, setCallState] = useState({ isOpen: false, hotelName: '', step: 'menu' });
  const [likedVideos, setLikedVideos] = useState([]);

  const toggleLike = (videoId) => {
    setLikedVideos(prev => prev.includes(videoId) ? prev.filter(id => id !== videoId) : [...prev, videoId]);
  };

  const filteredVideos = MOCK_VIDEOS.filter(video => {
    if (selectedDests.length === 0) return true;
    return selectedDests.some(dest => video.location.includes(dest));
  });

  useEffect(() => {
    setActiveVideoIndex(0);
    if (containerRef.current) containerRef.current.scrollTop = 0;
  }, [selectedDests]);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const scrollPosition = containerRef.current.scrollTop;
      const containerHeight = containerRef.current.clientHeight;
      const currentIndex = Math.round(scrollPosition / containerHeight);
      if (currentIndex !== activeVideoIndex && currentIndex >= 0 && currentIndex < filteredVideos.length) {
        setActiveVideoIndex(currentIndex);
      }
    };
    const container = containerRef.current;
    if (container) container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container && container.removeEventListener('scroll', handleScroll);
  }, [activeVideoIndex, filteredVideos.length]);

  return (
    <div className="min-h-screen w-full bg-zinc-950 flex items-center justify-center p-0 sm:p-4 font-sans selection:bg-blue-500/30">
      <div className="w-full max-w-[390px] h-screen sm:h-[844px] bg-black sm:rounded-[3rem] sm:border-[8px] border-zinc-800 shadow-[0_0_60px_rgba(0,0,0,0.6)] relative overflow-hidden flex flex-col sm:ring-1 ring-white/10">
        
        {/* Notch / Dynamic Island */}
        <div className="hidden sm:flex absolute top-0 inset-x-0 h-7 justify-center z-[60] pointer-events-none">
          <div className="w-32 h-7 bg-zinc-800 rounded-b-3xl relative">
             <div className="absolute top-2 right-4 w-2 h-2 rounded-full bg-zinc-950/50"></div>
          </div>
        </div>

        <div className="h-full w-full relative bg-black overflow-hidden">
          <div className="absolute top-0 left-0 w-full z-50 p-5 pt-10 sm:pt-12 flex justify-between items-start pointer-events-none bg-gradient-to-b from-black/95 via-black/40 to-transparent h-32">
            <div>
              <h1 className="text-xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 drop-shadow-lg leading-none">
                IZI<span className="text-white">WAKACJE</span>
              </h1>
              <div className="flex items-center gap-1 mt-1.5 opacity-90">
                <ShieldCheck size={12} className="text-emerald-400" />
                <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest drop-shadow-md">Tylko Pewniaki</span>
              </div>
            </div>
            <button onClick={() => setIsSettingsOpen(true)} className="pointer-events-auto flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold border border-white/20 text-white shadow-lg active:scale-95 transition-all">
              <Settings2 size={14} className="text-blue-400" /> {prefs.adults} Dor., {prefs.children} Dz.
            </button>
          </div>

          <div ref={containerRef} className="h-full w-full overflow-y-scroll snap-y snap-mandatory scroll-smooth text-white" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {filteredVideos.length > 0 ? (
              filteredVideos.map((video, index) => (
                <VideoItem 
                  key={video.id} 
                  video={video} 
                  isActive={index === activeVideoIndex} 
                  isMuted={isMuted} 
                  toggleMute={() => setIsMuted(!isMuted)} 
                  prefs={prefs} 
                  onOpenRating={() => setRatingState({ isOpen: true, videoId: video.id, score: 10, opinion: '' })} 
                  onOpenDests={() => setIsDestsOpen(true)} 
                  onOpenCall={() => setCallState({ isOpen: true, hotelName: video.name, step: 'menu' })}
                  isLiked={likedVideos.includes(video.id)}
                  onToggleLike={() => toggleLike(video.id)}
                />
              ))
            ) : (
              <div className="h-full w-full flex flex-col items-center justify-center bg-zinc-900 p-8 text-center">
                <Globe size={48} className="text-zinc-600 mb-4" />
                <h2 className="text-xl font-black text-white mb-2">Brak ofert</h2>
                <p className="text-zinc-400 text-sm mb-6">W tych kierunkach akurat nie mamy teraz bestsellerów.</p>
                <button onClick={() => setIsDestsOpen(true)} className="bg-blue-600 px-6 py-3 rounded-xl font-bold active:scale-95">Zmień kierunek</button>
              </div>
            )}
          </div>

          {isDestsOpen && <DestinationsDrawer onClose={() => setIsDestsOpen(false)} selectedDests={selectedDests} setSelectedDests={setSelectedDests} />}
          {isSettingsOpen && <SettingsDrawer onClose={() => setIsSettingsOpen(false)} prefs={prefs} setPrefs={setPrefs} likedVideos={likedVideos} videosData={MOCK_VIDEOS} />}
          {ratingState.isOpen && <RatingDrawer state={ratingState} setState={setRatingState} />}
          {callState.isOpen && <CallDrawer state={callState} setState={setCallState} />}
        </div>
        
        <div className="hidden sm:flex absolute bottom-2 inset-x-0 h-1.5 justify-center z-[60] pointer-events-none">
          <div className="w-1/3 h-full bg-white/50 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}

function VideoItem({ video, isActive, isMuted, toggleMute, prefs, onOpenRating, onOpenDests, onOpenCall, isLiked, onToggleLike }) {
  const videoRef = useRef(null);
  useEffect(() => {
    if (!videoRef.current) return;
    if (isActive) videoRef.current.play().catch(() => {});
    else { videoRef.current.pause(); videoRef.current.currentTime = 0; }
  }, [isActive]);

  return (
    <div className="h-full w-full snap-start relative flex flex-col justify-end bg-zinc-900 pb-8 overflow-hidden">
      <div className="absolute inset-0 w-full h-full" onClick={toggleMute}>
        <video ref={videoRef} src={video.videoUrl} loop muted={isMuted} playsInline className="absolute inset-0 w-full h-full object-cover opacity-90" />
      </div>
      <div className="absolute bottom-0 left-0 w-full h-[75%] bg-gradient-to-t from-black via-black/60 to-transparent z-20 pointer-events-none" />
      <div className="relative z-30 px-4 pb-4 flex items-end justify-between w-full">
        <div className="flex-1 pr-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-gradient-to-r from-orange-500 to-red-600 text-white text-[9px] font-black uppercase px-2 py-1 rounded-md tracking-widest shadow-xl flex items-center gap-1">
              <Award size={12} className="fill-white" /> {video.badge}
            </span>
          </div>
          <button onClick={onOpenDests} className="flex items-center gap-1.5 mb-2 bg-black/40 px-2 py-1 rounded-md backdrop-blur-sm border border-emerald-500/30 transition-all active:scale-95 group">
            <MapPin size={14} className="text-emerald-400 group-hover:animate-bounce" />
            <span className="text-emerald-400 font-bold text-xs uppercase tracking-wide">{video.location} <span className="text-white/40 ml-1">(Zmień)</span></span>
          </button>
          <h2 className="text-2xl font-black mb-1.5 drop-shadow-lg text-white leading-tight">{video.name}</h2>
          <button onClick={onOpenRating} className="flex items-center gap-1.5 mb-3 bg-white/10 px-2 py-1 rounded border border-white/5 backdrop-blur-sm active:scale-95 transition-all">
            <Star size={12} className="text-yellow-400 fill-yellow-400" />
            <span className="font-bold text-xs">{video.rating}</span>
            <span className="text-white/60 text-[10px] uppercase font-bold tracking-wider">Oceń</span>
          </button>
          <p className="text-sm text-white/90 line-clamp-2 mb-4 font-medium drop-shadow">{video.desc}</p>
          <button onClick={() => window.open(generateIziUrl(video.id, prefs), '_blank')} className="w-full relative group overflow-hidden bg-gradient-to-r from-blue-600 to-blue-500 text-white font-black text-base py-4 px-4 rounded-2xl shadow-[0_0_20px_rgba(59,130,246,0.4)] flex items-center justify-center gap-2 active:scale-95 transition-all animate-pulse-slow border border-blue-400/30 uppercase tracking-tighter">
            SPRAWDŹ CENĘ I TERMINY <ChevronRight size={20} className="animate-bounce-x" />
          </button>
        </div>
        <div className="flex flex-col items-center gap-6 pb-2">
          <ActionButton icon={<Heart size={28} className={isLiked ? "text-red-500 fill-red-500 scale-110" : "text-white"} />} label="Zapisz" onClick={onToggleLike} />
          <ActionButton icon={<Share2 size={28} className="text-white" />} label="Wyślij" />
          <ActionButton icon={<Phone size={28} className="text-white" />} label="Zadzwoń" onClick={onOpenCall} />
          <button onClick={toggleMute} className="w-10 h-10 mt-2 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 active:scale-90 shadow-lg">{isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}</button>
        </div>
      </div>
    </div>
  );
}

function ActionButton({ icon, label, onClick }) {
  return (
    <div onClick={onClick} className="flex flex-col items-center gap-1.5 cursor-pointer active:scale-90 transition-transform">
      <div className="w-12 h-12 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/10 shadow-lg">{icon}</div>
      <span className="text-[10px] font-bold text-white drop-shadow-md tracking-wide">{label}</span>
    </div>
  );
}

function DestinationsDrawer({ onClose, selectedDests, setSelectedDests }) {
  const toggleDest = (id) => setSelectedDests(p => p.includes(id) ? p.filter(d => d !== id) : [...p, id]);
  return (
    <div className="absolute inset-0 z-[110] flex items-end bg-black/80 backdrop-blur-sm">
      <div className="w-full max-h-[85%] bg-zinc-900 rounded-t-[2rem] border-t border-zinc-800 animate-slide-up flex flex-col shadow-2xl">
        <div className="p-6 shrink-0 flex justify-between items-center border-b border-white/5">
          <h3 className="text-xl font-black flex items-center gap-2"><Globe size={22} className="text-blue-400" /> GDZIE LECIMY?</h3>
          <button onClick={onClose} className="w-8 h-8 bg-zinc-800 rounded-full flex items-center justify-center"><X size={18} /></button>
        </div>
        <div className="overflow-y-auto p-4 space-y-2">
          <button onClick={() => setSelectedDests([])} className={`w-full flex items-center justify-between p-4 rounded-2xl border ${selectedDests.length === 0 ? 'bg-blue-600/10 border-blue-500' : 'bg-black/40 border-white/5'}`}>
            <span className="font-bold flex items-center gap-3">🌍 Wszystkie kierunki</span>
            {selectedDests.length === 0 && <Check size={20} className="text-blue-400" />}
          </button>
          {DESTINATIONS.map(d => (
            <button key={d.id} onClick={() => toggleDest(d.id)} className={`w-full flex items-center justify-between p-4 rounded-2xl border ${selectedDests.includes(d.id) ? 'bg-blue-600/10 border-blue-500' : 'bg-zinc-800/50 border-white/5'}`}>
              <span className="font-bold flex items-center gap-3"><span>{d.flag}</span> {d.label}</span>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedDests.includes(d.id) ? 'bg-blue-500 border-blue-500' : 'border-zinc-600'}`}>{selectedDests.includes(d.id) && <Check size={14} />}</div>
            </button>
          ))}
        </div>
        <div className="p-5 border-t border-white/5 bg-zinc-900">
          <button onClick={onClose} className="w-full bg-blue-600 text-white font-black py-4 rounded-xl shadow-lg active:scale-95 transition-all">POKAŻ WYNIKI {selectedDests.length > 0 && `(${selectedDests.length})`}</button>
        </div>
      </div>
    </div>
  );
}

function SettingsDrawer({ onClose, prefs, setPrefs, likedVideos, videosData }) {
  return (
    <div className="absolute inset-0 z-[100] flex items-start bg-black/60 backdrop-blur-sm">
      <div className="w-full max-h-[85vh] overflow-y-auto bg-zinc-900 rounded-b-[2rem] p-6 pt-12 border-b border-zinc-800 animate-slide-down relative pb-10 shadow-2xl">
        <button onClick={onClose} className="absolute top-12 right-5 w-8 h-8 bg-zinc-800 rounded-full flex items-center justify-center"><X size={18} /></button>
        <h3 className="text-base font-black mb-6 flex items-center gap-2 text-white/90 mt-2"><Users size={18} className="text-blue-400" /> TWOJE PREFERENCJE</h3>
        <div className="space-y-3 mb-6">
          <div className="flex justify-between items-center bg-black/40 p-4 rounded-2xl border border-white/5">
            <span className="font-bold text-sm">Dorośli</span>
            <div className="flex items-center gap-4">
              <button onClick={() => setPrefs(p => ({...p, adults: Math.max(1, p.adults - 1)}))} className="w-8 h-8 bg-zinc-700 rounded-full text-white">-</button>
              <span className="w-4 text-center font-black">{prefs.adults}</span>
              <button onClick={() => setPrefs(p => ({...p, adults: Math.min(6, p.adults + 1)}))} className="w-8 h-8 bg-blue-600 rounded-full text-white">+</button>
            </div>
          </div>
          <div className="flex justify-between items-center bg-black/40 p-4 rounded-2xl border border-white/5">
            <span className="font-bold text-sm">Dzieci</span>
            <div className="flex items-center gap-4">
              <button onClick={() => setPrefs(p => ({...p, children: Math.max(0, p.children - 1)}))} className="w-8 h-8 bg-zinc-700 rounded-full text-white">-</button>
              <span className="w-4 text-center font-black">{prefs.children}</span>
              <button onClick={() => setPrefs(p => ({...p, children: Math.min(4, p.children + 1)}))} className="w-8 h-8 bg-blue-600 rounded-full text-white">+</button>
            </div>
          </div>
          <div className="flex justify-between items-center bg-black/40 p-4 rounded-2xl border border-white/5">
            <span className="font-bold text-sm flex items-center gap-2 text-white"><Calendar size={16} className="text-emerald-400"/> Data od</span>
            <input type="date" className="bg-zinc-800 text-white px-3 py-1.5 rounded-lg border border-zinc-700 text-sm outline-none" value={prefs.date} onChange={(e) => setPrefs(p => ({...p, date: e.target.value, isCustomDate: true}))} />
          </div>
        </div>
        <div className="border-t border-white/10 pt-6">
          <h4 className="text-xs font-black flex items-center gap-2 text-white/90 mb-4 uppercase tracking-widest"><Heart size={14} className="text-red-500 fill-red-500" /> ULUBIONE BESTSELLERY</h4>
          {likedVideos.length > 0 ? (
            <div className="flex gap-3 overflow-x-auto pb-4 snap-x">
              {likedVideos.map(id => {
                const hotel = videosData.find(v => v.id === id);
                return (
                  <div key={id} className="shrink-0 w-36 bg-zinc-800/80 rounded-2xl overflow-hidden snap-start border border-white/5">
                    <div className="h-24 w-full relative bg-black/50 overflow-hidden">
                      <video src={hotel?.videoUrl} className="w-full h-full object-cover opacity-60" />
                      <div className="absolute top-2 right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center shadow-lg"><Heart size={10} className="fill-white" /></div>
                    </div>
                    <div className="p-3">
                      <div className="text-[9px] font-bold text-emerald-400 uppercase tracking-tighter truncate">{hotel?.location}</div>
                      <div className="font-black text-[11px] text-white line-clamp-2 leading-none my-1">{hotel?.name}</div>
                      <div className="text-[10px] font-bold text-zinc-400">{hotel?.price}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-6 bg-black/20 rounded-2xl border border-white/5 border-dashed">
              <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider">Brak ulubionych ofert</p>
            </div>
          )}
        </div>
        <button onClick={onClose} className="w-full bg-blue-600 text-white font-black py-4 rounded-xl shadow-xl active:scale-95 transition-all mt-6">ZAPISZ I WRÓĆ</button>
      </div>
    </div>
  );
}

function RatingDrawer({ state, setState }) {
  return (
    <div className="absolute inset-0 z-[120] flex items-end bg-black/80 backdrop-blur-sm">
      <div className="w-full bg-zinc-900 rounded-t-[2rem] p-6 border-t border-zinc-800 animate-slide-up relative pb-10 shadow-2xl">
        <button onClick={() => setState(p => ({...p, isOpen: false}))} className="absolute top-5 right-5 w-8 h-8 bg-zinc-800 rounded-full flex items-center justify-center text-white/70"><X size={18} /></button>
        <h3 className="text-base font-black mb-6 flex items-center gap-2"><Star size={18} className="text-yellow-400 fill-yellow-400" /> TWOJA OPINIA</h3>
        <div className="mb-6 bg-black/40 p-4 rounded-2xl border border-white/5">
          <div className="flex justify-between items-end mb-4">
            <span className="font-bold text-sm text-white/80 uppercase tracking-widest text-[10px]">Ocena hotelu:</span>
            <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">{state.score} <span className="text-lg text-white/40">/ 10</span></span>
          </div>
          <input type="range" min="1" max="10" step="1" value={state.score} onChange={(e) => setState(p => ({...p, score: parseInt(e.target.value)}))} className="w-full accent-yellow-400 h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer" />
        </div>
        <textarea placeholder="Co sądzisz o tym PEWNIAKU?" value={state.opinion} onChange={(e) => setState(p => ({...p, opinion: e.target.value}))} className="w-full bg-black/40 text-white p-4 rounded-2xl border border-white/5 text-sm outline-none focus:border-yellow-400/50 h-28 resize-none mb-6" />
        <button onClick={() => setState(p => ({...p, isOpen: false}))} className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-black py-4 rounded-xl shadow-lg active:scale-95 transition-all">WYŚLIJ RECENZJĘ</button>
      </div>
    </div>
  );
}

function CallDrawer({ state, setState }) {
  return (
    <div className="absolute inset-0 z-[120] flex items-end bg-black/90 backdrop-blur-sm">
      <div className="w-full bg-zinc-900 rounded-t-[2rem] p-6 border-t border-zinc-800 animate-slide-up relative pb-10 shadow-2xl text-white">
        <button onClick={() => setState({ isOpen: false, hotelName: '', step: 'menu' })} className="absolute top-5 right-5 w-8 h-8 bg-zinc-800 rounded-full flex items-center justify-center text-white/70"><X size={18} /></button>
        <h3 className="text-base font-black mb-6 flex items-center gap-2"><Phone size={18} className="text-blue-400" /> KONTAKT Z EKSPERTEM</h3>
        {state.step === 'menu' ? (
          <div className="space-y-4">
            <a href="tel:+48221234567" className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 p-5 rounded-2xl flex items-center justify-between shadow-xl group active:scale-95 transition-transform">
              <div className="text-left">
                <div className="font-black text-xl text-white mb-1 leading-none">Zadzwoń teraz</div>
                <div className="text-[10px] font-black text-emerald-100 flex items-center gap-1.5 uppercase tracking-widest mt-1"><Clock size={12} /> 9:00 - 21:00</div>
              </div>
              <Phone size={28} className="text-white fill-white" />
            </a>
            <div className="flex items-center gap-4 py-2"><div className="h-px flex-1 bg-white/10"></div><span className="text-[10px] font-black text-zinc-600 tracking-widest">LUB</span><div className="h-px flex-1 bg-white/10"></div></div>
            <button onClick={() => setState(p => ({ ...p, step: 'form' }))} className="w-full bg-zinc-800 p-5 rounded-2xl flex items-center justify-between border border-white/5 active:scale-95 transition-transform text-white text-left">
              <div>
                <div className="font-black text-lg mb-1 leading-none">Umów rozmowę</div>
                <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mt-1">Oddzwonimy do Ciebie</div>
              </div>
              <Calendar size={24} className="text-blue-400" />
            </button>
          </div>
        ) : (
          <div className="space-y-4 animate-slide-in-right text-left">
            <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4">Rezerwacja rozmowy o: <br/><strong className="text-white text-sm">{state.hotelName}</strong></p>
            <div className="flex gap-3">
              <div className="flex-1 bg-black/40 p-4 rounded-xl border border-white/5"><span className="text-[10px] font-black text-zinc-500 uppercase block mb-1">Data</span><input type="date" className="w-full bg-transparent text-white outline-none text-sm font-bold" defaultValue={new Date().toISOString().split('T')[0]} /></div>
              <div className="flex-1 bg-black/40 p-4 rounded-xl border border-white/5"><span className="text-[10px] font-black text-zinc-500 uppercase block mb-1">Godzina</span><input type="time" className="w-full bg-transparent text-white outline-none text-sm font-bold" defaultValue="18:00" /></div>
            </div>
            <div className="bg-black/40 p-4 rounded-xl border border-white/5"><span className="text-[10px] font-black text-zinc-500 uppercase block mb-1">Twój numer</span><input type="tel" placeholder="+48 ___ ___ ___" className="w-full bg-transparent text-white outline-none text-lg font-black placeholder:text-zinc-700" /></div>
            <button onClick={() => setState({ isOpen: false, hotelName: '', step: 'menu' })} className="w-full bg-blue-600 text-white font-black py-4 rounded-xl shadow-lg active:scale-95 transition-all uppercase tracking-widest text-xs">ZAMÓW DARMOWĄ ROZMOWĘ</button>
            <button onClick={() => setState(p => ({ ...p, step: 'menu' }))} className="w-full py-2 text-[10px] font-black text-zinc-600 uppercase tracking-widest">Wróć</button>
          </div>
        )}
      </div>
    </div>
  );
}

const styleId = 'izi-shorts-styles';
if (!document.getElementById(styleId)) {
  const style = document.createElement('style');
  style.id = styleId;
  style.textContent = `
    @keyframes bounce-x { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(20%); } }
    .animate-bounce-x { animation: bounce-x 1s infinite; }
    @keyframes pulse-slow { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(0.98); opacity: 0.95; } }
    .animate-pulse-slow { animation: pulse-slow 3s ease-in-out infinite; }
    @keyframes shimmer { 100% { transform: translateX(100%); } }
    .animate-shimmer { animation: shimmer 1.5s infinite; }
    @keyframes slide-up { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
    .animate-slide-up { animation: slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    @keyframes slide-down { from { transform: translateY(-100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
    .animate-slide-down { animation: slide-down 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    @keyframes slide-in-right { from { transform: translateX(30px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
    .animate-slide-in-right { animation: slide-in-right 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
  `;
  document.head.appendChild(style);
}
