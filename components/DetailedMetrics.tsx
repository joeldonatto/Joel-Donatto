
import React, { useMemo, useState } from 'react';
import { MonthlyData, NetworkType } from '../types';
import SectionWrapper from './SectionWrapper';
import { MetricEvolutionChart } from './Charts';
import { generateDetailedMetricReport } from '../utils';
import { LayoutDashboard, Instagram, Facebook, Linkedin, Users, Activity } from 'lucide-react';

interface DetailedMetricsProps {
  filteredData: MonthlyData[];
  isDarkMode: boolean;
  // Added theme prop to interface
  theme?: 'light' | 'neon' | 'cyber' | 'infinity';
  commentsMap: Record<string, string>;
  onCommentChange: (id: string, text: string) => void;
  visibleComments: Record<string, boolean>;
  toggleVisibility: (id: string) => void;
}

const DetailedMetrics: React.FC<DetailedMetricsProps> = ({
  filteredData,
  isDarkMode,
  theme,
  commentsMap,
  onCommentChange,
  visibleComments,
  toggleVisibility
}) => {
  const [selectedNetwork, setSelectedNetwork] = useState<NetworkType>('all');

  const chartData = useMemo(() => {
    return filteredData.map(d => {
      const net = selectedNetwork === 'all' 
        ? { views: d.instagram.views + d.facebook.views + d.linkedin.views, visits: d.instagram.profileVisits + d.facebook.profileVisits + d.linkedin.profileVisits, clicks: d.instagram.clicks + d.facebook.clicks + d.linkedin.clicks, contacts: d.instagram.contacts + d.facebook.contacts + d.linkedin.contacts }
        : { views: d[selectedNetwork].views, visits: d[selectedNetwork].profileVisits, clicks: d[selectedNetwork].clicks, contacts: d[selectedNetwork].contacts };
      return { ...d, views: net.views, profileVisits: net.visits, clicks: net.clicks, contacts: net.contacts };
    });
  }, [filteredData, selectedNetwork]);

  const analysisText = useMemo(() => generateDetailedMetricReport(filteredData, selectedNetwork), [filteredData, selectedNetwork]);

  return (
    <div className="space-y-8">
      <div className={`p-2 rounded-xl border inline-flex gap-1 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
          <button onClick={() => setSelectedNetwork('all')} className={`px-4 py-2 rounded-lg text-sm font-bold border ${selectedNetwork === 'all' ? 'bg-brand-600 text-white' : 'text-slate-500 border-transparent'}`}>Geral</button>
          <button onClick={() => setSelectedNetwork('instagram')} className={`px-4 py-2 rounded-lg text-sm font-bold border ${selectedNetwork === 'instagram' ? 'bg-brand-600 text-white' : 'text-slate-500 border-transparent'}`}>Instagram</button>
          <button onClick={() => setSelectedNetwork('facebook')} className={`px-4 py-2 rounded-lg text-sm font-bold border ${selectedNetwork === 'facebook' ? 'bg-brand-600 text-white' : 'text-slate-500 border-transparent'}`}>Facebook</button>
          <button onClick={() => setSelectedNetwork('linkedin')} className={`px-4 py-2 rounded-lg text-sm font-bold border ${selectedNetwork === 'linkedin' ? 'bg-brand-600 text-white' : 'text-slate-500 border-transparent'}`}>LinkedIn</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Fixed SectionWrapper missing props */}
          <SectionWrapper id="det-views" title="Visualizações Totais" isDarkMode={isDarkMode} theme={theme} comment={commentsMap['det-views']} onCommentChange={onCommentChange} isCommentVisible={!!visibleComments['det-views']} onToggleComment={toggleVisibility}>
             <div className="h-[350px]"><MetricEvolutionChart data={chartData} dataKey="views" name="Views" color="#8b5cf6" isDarkMode={isDarkMode} /></div>
          </SectionWrapper>
          {/* Fixed SectionWrapper missing props */}
          <SectionWrapper id="det-visits" title="Visitas ao Perfil" isDarkMode={isDarkMode} theme={theme} comment={commentsMap['det-visits']} onCommentChange={onCommentChange} isCommentVisible={!!visibleComments['det-visits']} onToggleComment={toggleVisibility}>
             <div className="h-[350px]"><MetricEvolutionChart data={chartData} dataKey="profileVisits" name="Visitas" color="#f43f5e" isDarkMode={isDarkMode} /></div>
          </SectionWrapper>
          {/* Fixed SectionWrapper missing props */}
          <SectionWrapper id="det-clicks" title="Cliques no Link" isDarkMode={isDarkMode} theme={theme} comment={commentsMap['det-clicks']} onCommentChange={onCommentChange} isCommentVisible={!!visibleComments['det-clicks']} onToggleComment={toggleVisibility}>
             <div className="h-[350px]"><MetricEvolutionChart data={chartData} dataKey="clicks" name="Cliques" color="#0ea5e9" isDarkMode={isDarkMode} /></div>
          </SectionWrapper>
          {/* Fixed SectionWrapper missing props */}
          <SectionWrapper id="det-contacts" title="Contatos Diretos" isDarkMode={isDarkMode} theme={theme} comment={commentsMap['det-contacts']} onCommentChange={onCommentChange} isCommentVisible={!!visibleComments['det-contacts']} onToggleComment={toggleVisibility}>
             <div className="h-[350px]"><MetricEvolutionChart data={chartData} dataKey="contacts" name="Contatos" color="#10b981" isDarkMode={isDarkMode} /></div>
          </SectionWrapper>
      </div>

      <section className={`rounded-3xl p-8 ${isDarkMode ? 'bg-slate-900 border border-white/5' : 'bg-white border shadow-sm'}`}>
            <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-brand-600 text-white rounded-2xl"><Activity size={24}/></div>
                <h3 className={`text-xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Funil de Conversão e Tráfego</h3>
            </div>
            <p className={`text-lg leading-relaxed whitespace-pre-line text-justify ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{analysisText}</p>
       </section>
    </div>
  );
};

export default DetailedMetrics;
