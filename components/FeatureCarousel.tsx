import React from 'react';
import { Brain, Code2, Sparkles, Zap, GitBranch } from 'lucide-react';

const features = [
    { icon: Brain, title: "Multimodal Core", desc: "Parses text, equations, and visual data for complete context.", color: "emerald" },
    { icon: Code2, title: "Code Synthesis", desc: "Generates production-grade PyTorch code ready for execution.", color: "cyan" },
    { icon: Sparkles, title: "Deep Analysis", desc: "Identifies contradictions and suggests experimental variants.", color: "violet" },
    { icon: Zap, title: "Context Aware", desc: "Links figures to methods with cross-reference understanding.", color: "amber" },
    { icon: GitBranch, title: "Auto-Refinement", desc: "Iteratively improves code based on static analysis.", color: "teal" },
];

const colorClasses: Record<string, { bg: string; text: string; border: string }> = {
  emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'hover:border-emerald-500/30' },
  cyan: { bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'hover:border-cyan-500/30' },
  violet: { bg: 'bg-violet-500/10', text: 'text-violet-400', border: 'hover:border-violet-500/30' },
  amber: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'hover:border-amber-500/30' },
  teal: { bg: 'bg-teal-500/10', text: 'text-teal-400', border: 'hover:border-teal-500/30' },
};

const FeatureCarousel: React.FC = () => {
    return (
        <div className="w-full overflow-hidden py-8 fade-mask">
            <div className="flex w-max animate-carousel gap-4 lg:gap-6 hover:pause">
                {[...features, ...features, ...features].map((feature, idx) => {
                    const colors = colorClasses[feature.color] || colorClasses.emerald;
                    return (
                        <div
                            key={idx}
                            className={`w-[280px] lg:w-[320px] flex-shrink-0 group relative p-5 rounded-2xl bg-slate-900/60 border border-white/10 ${colors.border} transition-all duration-300 hover:bg-slate-900/80 overflow-hidden cursor-default`}
                        >
                            <div className={`w-10 h-10 rounded-xl ${colors.bg} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
                                <feature.icon size={20} className={colors.text} />
                            </div>
                            <h3 className="text-base font-bold text-white mb-1.5 text-left">{feature.title}</h3>
                            <p className="text-sm text-slate-400 text-left leading-relaxed line-clamp-2">{feature.desc}</p>
                        </div>
                    );
                })}
            </div>
            <style>{`
        @keyframes carousel {
           0% { transform: translateX(0); }
           100% { transform: translateX(-33.33%); }
        }
        .animate-carousel {
           animation: carousel 35s linear infinite;
        }
        .hover\\:pause:hover {
           animation-play-state: paused;
        }
        .fade-mask {
           mask-image: linear-gradient(to right, transparent, black 8%, black 92%, transparent);
           -webkit-mask-image: linear-gradient(to right, transparent, black 8%, black 92%, transparent);
        }
      `}</style>
        </div>
    );
};

export default FeatureCarousel;
