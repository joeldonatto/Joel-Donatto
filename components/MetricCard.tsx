
import React from 'react';
import { ArrowUp, ArrowDown, ShieldCheck, Activity, AlertTriangle } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subValue?: string;
  trend?: 'up' | 'down' | 'neutral';
  isKeyMetric?: boolean;
  highlightCondition?: boolean;
  goal?: number;
  theme?: 'light' | 'neon' | 'cyber' | 'infinity';
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  title, value, subValue, trend, isKeyMetric = false, highlightCondition, goal, theme = 'infinity'
}) => {
  const isDarkMode = theme !== 'light';

  // INFINITY/CYBER/NEON THEMES
  if (isDarkMode) {
    const glowColor = theme === 'cyber' ? 'border-cyber-border shadow-neon-blue' : 
                     theme === 'infinity' ? 'border-violet-500/30 shadow-violet-500/10' :
                     'border-neon-glowBlue shadow-neon-blue';
    
    return (
      <div className={`relative overflow-hidden p-6 rounded-2xl border transition-all duration-300 group ${
        theme === 'cyber' ? 'bg-cyber-card' : 'glass-card bg-slate-900/40'
      } ${glowColor} hover:scale-[1.02] hover:shadow-2xl`}>
        
        {/* Decorative Glow Orb */}
        <div className={`absolute -top-12 -right-12 w-24 h-24 rounded-full blur-3xl opacity-20 transition-opacity group-hover:opacity-40 ${
          theme === 'cyber' ? 'bg-cyan-400' : 'bg-violet-600'
        }`}></div>

        <div className="flex justify-between items-start mb-4">
          <h3 className={`text-[10px] font-black uppercase tracking-[0.2em] opacity-60 group-hover:opacity-100 transition-all ${
            theme === 'cyber' ? 'text-cyber-border' : 'text-violet-400'
          }`}>
            {title}
          </h3>
          <Activity size={14} className={theme === 'cyber' ? 'text-cyber-border/50' : 'text-violet-500/50'} />
        </div>

        <div className="flex items-baseline justify-between relative z-10">
          <span className="text-3xl font-black tracking-tighter text-white">
            {value}
          </span>
          {trend && (
            <div className={`px-2 py-0.5 rounded-md text-[9px] font-black border uppercase ${
              trend === 'up' ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' : 
              trend === 'down' ? 'text-rose-400 border-rose-500/30 bg-rose-500/10' : 'text-slate-400'}`}>
              {trend === 'up' ? 'HIGH' : 'LOW'}
            </div>
          )}
        </div>

        {(subValue || goal) && (
          <div className="mt-4 pt-3 border-t border-white/5 flex justify-between items-center text-[9px] font-bold">
            <span className="opacity-40 uppercase tracking-widest">{subValue || 'System OK'}</span>
            {goal && <span className="text-emerald-400/80">OBJETIVO: {goal}%</span>}
          </div>
        )}
      </div>
    );
  }

  // LIGHT THEME
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
      <h3 className="text-xs font-black uppercase text-slate-400 mb-2 tracking-widest">{title}</h3>
      <div className="flex items-baseline justify-between">
        <span className="text-2xl font-black text-slate-900 tracking-tight">{value}</span>
        {trend && <span className={trend === 'up' ? 'text-emerald-600' : 'text-rose-600'}>
          {trend === 'up' ? <ArrowUp size={16}/> : <ArrowDown size={16}/>}
        </span>}
      </div>
    </div>
  );
};

export default MetricCard;
