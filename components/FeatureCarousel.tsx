import React from 'react';
import { Brain, Github, ChevronRight } from 'lucide-react';

const features = [
    { icon: Brain, title: "Multimodal Core", desc: "Simultaneously parses text, equations, and visual data for complete context.", color: "emerald" },
    { icon: Github, title: "Code Synthesis", desc: "Generates production-grade PyTorch code ready for immediate execution.", color: "cyan" },
    { icon: ChevronRight, title: "Deep Analysis", desc: "Identifies contradictions and suggests novel experimental variants.", color: "teal" },
    { icon: Brain, title: "Context Awareness", desc: "Understands cross-references effectively linking figures to methods.", color: "emerald" },
    { icon: Github, title: "Auto-Refinement", desc: "Iteratively improves code based on static analysis and linting results.", color: "cyan" },
];

const FeatureCarousel: React.FC = () => {
    return (
        <div className="w-full overflow-hidden py-10 fade-mask">
            <div className="flex w-max animate-carousel gap-8 hover:pause">
                {[...features, ...features, ...features].map((feature, idx) => (
                    <div
                        key={idx}
                        className="w-[350px] flex-shrink-0 group relative p-6 rounded-2xl bg-slate-900/40 border border-white/5 hover:border-emerald-500/30 transition-all duration-300 hover:bg-slate-900/60 overflow-hidden cursor-default"
                    >
                        <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-${feature.color}-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity`}></div>
                        <div className={`w-12 h-12 rounded-xl bg-${feature.color}-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                            <feature.icon size={24} className={`text-${feature.color}-400`} />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2 text-left">{feature.title}</h3>
                        <p className="text-sm text-slate-400 text-left leading-relaxed">{feature.desc}</p>
                    </div>
                ))}
            </div>
            <style>{`
        @keyframes carousel {
           0% { transform: translateX(0); }
           100% { transform: translateX(-33.33%); }
        }
        .animate-carousel {
           animation: carousel 40s linear infinite;
        }
        .hover\\:pause:hover {
           animation-play-state: paused;
        }
        .fade-mask {
           mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
           -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
        }
      `}</style>
        </div>
    );
};

export default FeatureCarousel;
