import React from 'react';
import { Zap, Clock, ArrowRight } from 'lucide-react';

const HeroBanner: React.FC = () => {
  return (
    <div className="w-full max-w-4xl mx-auto mb-12 p-1">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-neutral-900 to-black border border-white/10 shadow-2xl">

        {/* Background Effects */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl -ml-20 -mb-20"></div>

        <div className="relative z-10 p-8 flex flex-col md:flex-row items-center justify-between gap-8">



        </div>
      </div>
    </div >
  );
};

export default HeroBanner;