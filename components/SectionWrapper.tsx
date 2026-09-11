
import React from 'react';
import { MessageSquare, Zap } from 'lucide-react';

interface SectionWrapperProps {
  id: string;
  title: string;
  subTitle?: string;
  children: React.ReactNode;
  isDarkMode: boolean;
  theme?: 'light' | 'neon' | 'cyber' | 'infinity';
  comment?: string;
  onCommentChange: (id: string, text: string) => void;
  isCommentVisible: boolean;
  onToggleComment: (id: string) => void;
  headerAction?: React.ReactNode;
  className?: string;
}

const SectionWrapper: React.FC<SectionWrapperProps> = ({
  id, title, subTitle, children, isDarkMode, theme = 'infinity', comment = '', onCommentChange, isCommentVisible, onToggleComment, headerAction, className = ''
}) => {
  const isInfinity = theme === 'infinity';
  const isCyber = theme === 'cyber';

  if (!isDarkMode) {
    return (
      <div className={`p-8 rounded-3xl bg-white border border-slate-200 shadow-sm ${className}`}>
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">{title}</h3>
            {subTitle && <p className="text-xs font-bold text-slate-500 uppercase mt-1">{subTitle}</p>}
          </div>
          <div className="flex items-center gap-2">
            {headerAction}
            <button onClick={() => onToggleComment(id)} className={`p-2 rounded-xl ${isCommentVisible ? 'bg-brand-600 text-white' : 'text-slate-400 hover:bg-slate-100'}`}>
              <MessageSquare size={18} />
            </button>
          </div>
        </div>
        {children}
      </div>
    );
  }

  const neonBorderClass = isCyber ? 'border-cyber-border shadow-cyber-glow animate-pulse-neon' : 
                         isInfinity ? 'border-violet-500/40 shadow-violet-500/5' :
                         'border-neon-glowBlue shadow-neon-blue';

  const accentColor = isCyber ? 'bg-cyber-border' : isInfinity ? 'bg-violet-500' : 'bg-neon-glowBlue';

  return (
    <div className={`p-8 rounded-3xl border glass-card relative transition-all duration-500 section-break-avoid ${
      isCyber ? 'bg-cyber-card/80' : 'bg-slate-900/40'
    } ${neonBorderClass} ${className}`}>
      
      <div className="flex justify-between items-start mb-8 relative z-10">
        <div className="flex items-center gap-4">
          <div className={`w-1 h-8 rounded-full shadow-[0_0_10px_currentColor] ${accentColor}`}></div>
          <div>
            <h3 className={`text-lg font-black tracking-widest text-white uppercase ${
              isCyber ? 'neon-text-blue' : isInfinity ? 'neon-text-purple' : 'neon-text-blue'
            }`}>
              {title}
            </h3>
            {subTitle && (
              <p className="text-[10px] mt-1 font-black uppercase tracking-[0.2em] text-white/50">
                {subTitle}
              </p>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-3 no-print">
          {headerAction}
          <button 
            onClick={() => onToggleComment(id)} 
            className={`p-2.5 rounded-xl transition-all border ${
              isCommentVisible 
                ? 'bg-white text-slate-900 border-white shadow-[0_0_15px_white]' 
                : 'bg-black/40 text-white/40 border-white/10 hover:border-white/40 hover:text-white'
            }`}
          >
            <MessageSquare size={18} />
          </button>
        </div>
      </div>
      
      <div className="w-full relative z-10">{children}</div>
      
      {isCommentVisible && (
        <div className="mt-6 p-5 rounded-2xl bg-black/60 border border-white/10 animate-in slide-in-from-top-4 duration-500">
          <textarea
            value={comment}
            onChange={(e) => onCommentChange(id, e.target.value)}
            placeholder="Comentário estratégico do analista..."
            className="w-full bg-transparent border-none focus:ring-0 text-sm placeholder-white/20 text-white/80 resize-none h-24 font-medium"
          />
        </div>
      )}
    </div>
  );
};

export default SectionWrapper;
