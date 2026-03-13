import { useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';

// Reusable component for scroll fade-in/fade-out animations
const FadeInSection = ({ children, delay = 0, className = "" }) => {
    const [isIntersecting, setIntersecting] = useState(false);
    const domRef = useRef();

    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                // We toggle it so it fades in AND fades out as you scroll
                setIntersecting(entry.isIntersecting);
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

        const currentRef = domRef.current;
        if (currentRef) observer.observe(currentRef);
        return () => { if (currentRef) observer.unobserve(currentRef); };
    }, []);

    return (
        <div
            ref={domRef}
            className={`transition-all duration-1000 ease-out ${isIntersecting ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-95'} ${className}`}
            style={{ transitionDelay: `${delay}ms` }}
        >
            {children}
        </div>
    );
};

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="brutalist-bg min-h-screen relative overflow-hidden font-grotesk">
            <style>{`
                .brutalist-bg { background-color: #0a0a0f; color: #ffffff; }
                .text-muted { color: #6b7280; }
                .accent-purple { color: #7c3aed; }
                .accent-cyan { color: #06b6d4; }
                .bg-card { background-color: #111118; }
                .border-subtle { border-color: #1f1f2e; }
                .font-grotesk { font-family: 'Space Grotesk', sans-serif; }
                .font-mono { font-family: 'Space Mono', monospace; }
                
                .hero-overlay {
                    background: linear-gradient(to bottom, rgba(10,10,15,0.3) 0%, rgba(10,10,15,0.95) 90%);
                }
                
                /* Waveform animation */
                @keyframes wave {
                    0%, 100% { height: 16px; opacity: 0.5; }
                    50% { height: 96px; opacity: 1; }
                }
                .waveform-bar {
                    width: 6px;
                    background-color: #7c3aed;
                    border-radius: 9999px;
                    animation: wave 1.2s ease-in-out infinite;
                }
                .waveform-bar.center {
                    background-color: #f97316;
                    box-shadow: 0 0 15px rgba(249, 115, 22, 0.5);
                }
                
                /* Slide-up fade-in (Hero only) */
                @keyframes slideUpFade {
                    0% { opacity: 0; transform: translateY(30px); }
                    100% { opacity: 1; transform: translateY(0); }
                }
                .animate-hero {
                    animation: slideUpFade 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
                
                /* Brutalist Card */
                .brutalist-card {
                    background-color: #111118;
                    border-left: 4px solid #7c3aed;
                    border-top: 1px solid #1f1f2e;
                    border-right: 1px solid #1f1f2e;
                    border-bottom: 1px solid #1f1f2e;
                    transition: all 0.3s ease;
                }
                .brutalist-card:hover {
                    transform: scale(1.02);
                    border-left-color: #06b6d4;
                }
                
                /* Rotating / Floating Video-like effect for background */
                @keyframes floatBg {
                    0% { transform: scale(1.05) rotate(0deg); }
                    33% { transform: scale(1.1) rotate(1deg) translateY(-10px); }
                    66% { transform: scale(1.08) rotate(-1deg) translateY(10px); }
                    100% { transform: scale(1.05) rotate(0deg); }
                }
                .animate-float-bg {
                    animation: floatBg 20s ease-in-out infinite;
                }

                /* --- NEW: Glassy Word Hover Effects --- */
                .glassy-text-hover {
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    display: inline-block;
                    cursor: default;
                }
                .glassy-text-hover:hover {
                    color: rgba(255, 255, 255, 0.95);
                    text-shadow: 0 0 20px rgba(255, 255, 255, 0.6), 0 0 40px rgba(124, 58, 237, 0.5);
                    transform: translateY(-2px) scale(1.02);
                }
                .glassy-text-purple {
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    display: inline-block;
                    cursor: default;
                }
                .glassy-text-purple:hover {
                    color: #a78bfa;
                    text-shadow: 0 0 20px rgba(124, 58, 237, 0.8), 0 0 40px #7c3aed;
                    transform: translateY(-2px) scale(1.02);
                }
                /* Interactive translucent button hover */
                .glassy-btn:hover {
                    backdrop-filter: blur(10px);
                    background-color: rgba(255, 255, 255, 0.1);
                    box-shadow: 0 0 20px rgba(255, 255, 255, 0.2);
                }
            `}</style>

            {/* Hero Section */}
            <section className="relative w-full h-[calc(100vh-64px)] flex flex-col items-center justify-center overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0 z-0 overflow-hidden">
                    <img src="/kaunjeeta_hero_bg.png" alt="Background" className="w-full h-full object-cover animate-float-bg opacity-40 md:opacity-100" />
                    <div className="absolute inset-0 hero-overlay"></div>
                </div>

                {/* Hero Content */}
                <div className="relative z-10 text-center animate-hero flex flex-col items-center px-4 w-full">
                    <div className="font-mono text-[10px] md:text-xs text-white border border-[#7c3aed] px-3 py-1 rounded-sm mb-6 md:mb-8 tracking-widest bg-[#0a0a0f]/80 backdrop-blur-md glassy-text-hover">
                        ✦ AI-POWERED JUDGE
                    </div>

                    <h1 className="font-grotesk text-5xl md:text-[96px] font-bold leading-none mb-4 md:mb-6 tracking-tighter">
                        <span className="glassy-text-hover">Kaun</span>
                        <span className="accent-purple glassy-text-purple">Jeeta?</span>
                    </h1>

                    <p className="text-muted text-base md:text-[20px] font-mono mb-8 md:mb-12 max-w-2xl mx-auto leading-relaxed px-2">
                        <span className="glassy-text-hover">200 presentations mein se winners dhundo — seconds mein</span>
                    </p>

                    <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto items-center justify-center">
                        <button
                            onClick={() => navigate('/analyzer')}
                            className="bg-[#7c3aed] hover:brightness-110 text-white font-grotesk font-bold text-lg md:text-xl px-8 py-4 w-full md:w-auto rounded-sm transition-all hover:scale-[1.02] active:scale-95 shadow-[0_0_30px_rgba(124,58,237,0.4)]"
                        >
                            ▶ Try Karo Free
                        </button>
                        <button
                            onClick={() => document.getElementById('how-it-works').scrollIntoView({ behavior: 'smooth' })}
                            className="glassy-btn border border-[#1f1f2e] bg-[#111118]/80 hover:border-[#6b7280] text-white font-grotesk font-bold text-lg px-8 py-4 w-full md:w-auto rounded-sm transition-all hover:scale-[1.02] active:scale-95"
                        >
                            Kaise Kaam Karta Hai ↓
                        </button>
                    </div>

                    <p className="mt-8 md:mt-12 font-mono text-xs md:text-sm text-[#f97316] glassy-text-hover">
                        🏆 1000+ presentations already analyzed
                    </p>
                </div>
            </section>

            {/* Animated Waveform Section */}
            <FadeInSection>
                <section className="w-full h-[80px] md:h-[120px] bg-card flex items-center justify-center gap-[2px] md:gap-[3px] overflow-hidden border-y border-subtle relative z-20">
                    {[...Array(60)].map((_, i) => {
                        const distFromCenter = Math.abs(i - 30);
                        const isCenter = distFromCenter < 2;
                        const baseHeight = Math.max(0.1, 1 - (distFromCenter / 30));
                        const duration = 0.8 + (Math.random() * 0.6);
                        const delay = Math.random() * 0.6;
                        const hiddenOnMobile = (i < 15 || i > 45) ? 'hidden md:block' : 'block';

                        return (
                            <div
                                key={i}
                                className={`waveform-bar ${isCenter ? 'center' : ''} ${hiddenOnMobile}`}
                                style={{
                                    animationDuration: `${duration}s`,
                                    animationDelay: `${delay}s`,
                                    transform: `scaleY(${baseHeight})`,
                                }}
                            ></div>
                        );
                    })}
                </section>
            </FadeInSection>

            {/* How It Works Section */}
            <section id="how-it-works" className="py-20 md:py-32 px-6 bg-[#0a0a0f]">
                <FadeInSection>
                    <h2 className="font-grotesk text-4xl md:text-[48px] font-bold text-center mb-16 md:mb-24 text-white">
                        <span className="glassy-text-hover">Kaise Kaam Karta Hai</span>
                    </h2>
                </FadeInSection>

                <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 md:gap-4">

                    {/* Step 1 */}
                    <FadeInSection delay={0} className="flex-1 w-full">
                        <div className="bg-card p-6 md:p-8 rounded-sm border border-subtle relative text-center">
                            <div className="absolute -top-4 -left-4 font-mono text-sm bg-[#7c3aed] text-white w-8 h-8 flex items-center justify-center font-bold border border-white/20">01</div>
                            <div className="w-16 h-16 rounded-sm bg-white/5 mx-auto flex items-center justify-center mb-6 border border-[#1f1f2e]">
                                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                </svg>
                            </div>
                            <h3 className="font-grotesk text-xl font-bold mb-2 glassy-text-hover">PPTs Upload Karo</h3>
                            <p className="font-mono text-sm text-muted">Apna reference PPT aur baki sab files daal do.</p>
                        </div>
                    </FadeInSection>

                    {/* Arrow (Desktop) / Vertical separator (Mobile) */}
                    <FadeInSection delay={150} className="flex md:flex-col items-center justify-center text-[#7c3aed] h-12 md:h-auto w-full md:w-auto">
                        <div className="hidden md:block w-12 h-0 border-b-2 border-dashed border-[#7c3aed]"></div>
                        <div className="hidden md:block w-0 h-0 border-t-[6px] border-t-transparent border-l-[8px] border-l-[#7c3aed] border-b-[6px] border-b-transparent translate-x-6 -translate-y-[7px]"></div>
                        {/* Mobile arrow */}
                        <div className="md:hidden h-8 w-0 border-r-2 border-dashed border-[#7c3aed]"></div>
                        <div className="md:hidden w-0 h-0 border-l-[6px] border-l-transparent border-t-[8px] border-t-[#7c3aed] border-r-[6px] border-r-transparent translate-y-4 -translate-x-[7px]"></div>
                    </FadeInSection>

                    {/* Step 2 */}
                    <FadeInSection delay={300} className="flex-1 w-full">
                        <div className="bg-card p-6 md:p-8 rounded-sm border border-subtle relative text-center">
                            <div className="absolute -top-4 -left-4 font-mono text-sm bg-[#7c3aed] text-white w-8 h-8 flex items-center justify-center font-bold border border-white/20">02</div>
                            <div className="w-16 h-16 rounded-sm bg-[#7c3aed]/10 mx-auto flex items-center justify-center mb-6 border border-[#7c3aed]/30">
                                <svg className="w-8 h-8 text-[#7c3aed]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                </svg>
                            </div>
                            <h3 className="font-grotesk text-xl font-bold mb-2 glassy-text-hover">AI Analyze Karta Hai</h3>
                            <p className="font-mono text-sm text-muted">Llama 3 seconds mein sab padh leta hai.</p>
                        </div>
                    </FadeInSection>

                    {/* Arrow (Desktop) / Vertical separator (Mobile) */}
                    <FadeInSection delay={450} className="flex md:flex-col items-center justify-center text-[#7c3aed] h-12 md:h-auto w-full md:w-auto">
                        <div className="hidden md:block w-12 h-0 border-b-2 border-dashed border-[#7c3aed]"></div>
                        <div className="hidden md:block w-0 h-0 border-t-[6px] border-t-transparent border-l-[8px] border-l-[#7c3aed] border-b-[6px] border-b-transparent translate-x-6 -translate-y-[7px]"></div>
                        <div className="md:hidden h-8 w-0 border-r-2 border-dashed border-[#7c3aed]"></div>
                        <div className="md:hidden w-0 h-0 border-l-[6px] border-l-transparent border-t-[8px] border-t-[#7c3aed] border-r-[6px] border-r-transparent translate-y-4 -translate-x-[7px]"></div>
                    </FadeInSection>

                    {/* Step 3 */}
                    <FadeInSection delay={600} className="flex-1 w-full">
                        <div className="bg-card p-6 md:p-8 rounded-sm border border-subtle relative text-center">
                            <div className="absolute -top-4 -left-4 font-mono text-sm bg-[#7c3aed] text-white w-8 h-8 flex items-center justify-center font-bold border border-white/20">03</div>
                            <div className="w-16 h-16 rounded-sm bg-[#f97316]/10 mx-auto flex items-center justify-center mb-6 border border-[#f97316]/30">
                                <svg className="w-8 h-8 text-[#f97316]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                </svg>
                            </div>
                            <h3 className="font-grotesk text-xl font-bold mb-2 glassy-text-hover">Winners Dekho</h3>
                            <p className="font-mono text-sm text-muted">Fair aur transparent results aapke samne.</p>
                        </div>
                    </FadeInSection>

                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 md:py-32 px-6 bg-card border-t border-subtle relative">
                {/* Background grid pattern */}
                <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

                <div className="max-w-6xl mx-auto relative z-10">
                    <FadeInSection>
                        <h2 className="font-grotesk text-4xl md:text-[48px] font-bold text-center mb-16 md:mb-24 text-white">
                            <span className="glassy-text-hover">Kyun KaunJeeta?</span>
                        </h2>
                    </FadeInSection>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <FadeInSection delay={0}>
                            <div className="brutalist-card p-8 md:p-10 cursor-default">
                                <div className="text-4xl md:text-5xl mb-6 glassy-text-hover">⚡</div>
                                <h3 className="font-grotesk text-2xl font-bold mb-3 text-white glassy-text-hover">Instant Analysis</h3>
                                <p className="font-mono text-sm text-muted">Seconds mein 200 PPTs analyze</p>
                            </div>
                        </FadeInSection>
                        <FadeInSection delay={200}>
                            <div className="brutalist-card p-8 md:p-10 cursor-default">
                                <div className="text-4xl md:text-5xl mb-6 glassy-text-hover">🎯</div>
                                <h3 className="font-grotesk text-2xl font-bold mb-3 text-white glassy-text-hover">Smart Scoring</h3>
                                <p className="font-mono text-sm text-muted">AI criteria ke basis pe fair judgment</p>
                            </div>
                        </FadeInSection>
                        <FadeInSection delay={400}>
                            <div className="brutalist-card p-8 md:p-10 cursor-default">
                                <div className="text-4xl md:text-5xl mb-6 glassy-text-hover">📊</div>
                                <h3 className="font-grotesk text-2xl font-bold mb-3 text-white glassy-text-hover">Detailed Report</h3>
                                <p className="font-mono text-sm text-muted">Har PPT ka breakdown milega</p>
                            </div>
                        </FadeInSection>
                    </div>
                </div>
            </section>

            {/* Stats Banner */}
            <section className="w-full py-20 px-6 bg-gradient-to-r from-[#7c3aed] to-[#4f46e5] text-white overflow-hidden relative border-y border-white/10">
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 2px, transparent 0)', backgroundSize: '24px 24px' }}></div>
                <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center relative z-10">
                    <FadeInSection delay={0}>
                        <div className="flex flex-col items-center">
                            <div className="font-grotesk text-5xl md:text-[64px] font-black leading-none mb-3 glassy-text-hover">200+</div>
                            <div className="font-mono text-xs md:text-sm uppercase tracking-widest opacity-80 border-t border-white/20 pt-3 flex w-32 justify-center">PPTs ek baar mein</div>
                        </div>
                    </FadeInSection>
                    <FadeInSection delay={200}>
                        <div className="flex flex-col items-center">
                            <div className="font-grotesk text-5xl md:text-[64px] font-black leading-none mb-3 glassy-text-hover">&lt; 2 min</div>
                            <div className="font-mono text-xs md:text-sm uppercase tracking-widest opacity-80 border-t border-white/20 pt-3 flex w-32 justify-center">Analysis time</div>
                        </div>
                    </FadeInSection>
                    <FadeInSection delay={400}>
                        <div className="flex flex-col items-center">
                            <div className="font-grotesk text-5xl md:text-[64px] font-black leading-none mb-3 glassy-text-hover">99%</div>
                            <div className="font-mono text-xs md:text-sm uppercase tracking-widest opacity-80 border-t border-white/20 pt-3 flex w-32 justify-center">Organizers satisfied</div>
                        </div>
                    </FadeInSection>
                </div>
            </section>

            <footer className="bg-brutalist py-16 px-6 text-center border-t border-subtle">
                <FadeInSection>
                    <div className="flex justify-center mb-6">
                        <img src="/logo.png" alt="KaunJeeta Logo" className="h-32 md:h-40 object-contain hover:scale-105 transition-transform duration-300" />
                    </div>
                    <p className="font-mono text-muted mb-8 text-sm md:text-base">Ek hi click mein pata karo — kaun jeeta!</p>
                    <div className="text-xs font-mono text-muted/60 uppercase tracking-widest">Made with ❤️ for hackathon organizers and Students</div>
                </FadeInSection>
            </footer>
        </div>
    );
};

export default LandingPage;
