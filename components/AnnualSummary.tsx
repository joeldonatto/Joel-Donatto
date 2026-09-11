
import React, { useMemo, useState } from 'react';
import { MonthlyData, NetworkType } from '../types';
import SectionWrapper from './SectionWrapper';
import { SimpleBarChart, OverviewChart, NetworkStackedChart, NetworkEngagementComparisonChart } from './Charts';
import { formatNumber, formatPercentage, generateAnnualReport } from '../utils';
import { Users, LayoutDashboard, Instagram, Facebook, Linkedin, BarChart2, MousePointer, PhoneCall, Eye, UserPlus } from 'lucide-react';

interface AnnualSummaryProps {
  rawData: MonthlyData[];
  isDarkMode: boolean;
  theme?: 'light' | 'neon' | 'cyber' | 'infinity';
  commentsMap: Record<string, string>;
  onCommentChange: (id: string, text: string) => void;
  visibleComments: Record<string, boolean>;
  toggleVisibility: (id: string) => void;
}

const AnnualSummary: React.FC<AnnualSummaryProps> = ({
  rawData,
  isDarkMode,
  theme,
  commentsMap,
  onCommentChange,
  visibleComments,
  toggleVisibility
}) => {
  
  const [selectedNetwork, setSelectedNetwork] = useState<NetworkType>('all');

  const yearlyData = useMemo(() => {
    const years: Record<number, any> = {};
    rawData.forEach(d => {
        if (!years[d.year]) {
            years[d.year] = { 
                year: d.year, 
                total: { reach: 0, interactions: 0, followerIncrease: 0, views: 0, clicks: 0, contacts: 0, profileVisits: 0 },
                instagram: { reach: 0, interactions: 0, followers: 0, views: 0, clicks: 0, contacts: 0, profileVisits: 0 },
                facebook: { reach: 0, interactions: 0, followers: 0, views: 0, clicks: 0, contacts: 0, profileVisits: 0 },
                linkedin: { reach: 0, interactions: 0, followers: 0, views: 0, clicks: 0, contacts: 0, profileVisits: 0 }
            };
        }
        
        // Agregação Instagram
        years[d.year].instagram.reach += d.instagram.reach;
        years[d.year].instagram.interactions += d.instagram.interactions;
        years[d.year].instagram.followers += d.instagram.followers;
        years[d.year].instagram.views += d.instagram.views;
        years[d.year].instagram.clicks += d.instagram.clicks;
        years[d.year].instagram.contacts += d.instagram.contacts;
        years[d.year].instagram.profileVisits += d.instagram.profileVisits;
        
        // Agregação Facebook
        years[d.year].facebook.reach += d.facebook.reach;
        years[d.year].facebook.interactions += d.facebook.interactions;
        years[d.year].facebook.followers += d.facebook.followers;
        years[d.year].facebook.views += d.facebook.views;
        years[d.year].facebook.clicks += d.facebook.clicks;
        years[d.year].facebook.contacts += d.facebook.contacts;
        years[d.year].facebook.profileVisits += d.facebook.profileVisits;
        
        // Agregação LinkedIn
        years[d.year].linkedin.reach += d.linkedin.reach;
        years[d.year].linkedin.interactions += d.linkedin.interactions;
        years[d.year].linkedin.followers += d.linkedin.followers;
        years[d.year].linkedin.views += d.linkedin.views;
        years[d.year].linkedin.clicks += d.linkedin.clicks;
        years[d.year].linkedin.contacts += d.linkedin.contacts;
        years[d.year].linkedin.profileVisits += d.linkedin.profileVisits;

        // Totais consolidados
        years[d.year].total.reach += d.total.reach;
        years[d.year].total.interactions += d.total.interactions;
        years[d.year].total.followerIncrease += d.total.followerIncrease;
        years[d.year].total.views += (d.instagram.views + d.facebook.views + d.linkedin.views);
        years[d.year].total.clicks += (d.instagram.clicks + d.facebook.clicks + d.linkedin.clicks);
        years[d.year].total.contacts += (d.instagram.contacts + d.facebook.contacts + d.linkedin.contacts);
        years[d.year].total.profileVisits += (d.instagram.profileVisits + d.facebook.profileVisits + d.linkedin.profileVisits);
    });

    return Object.values(years).sort((a: any, b: any) => a.year - b.year).map((y: any) => {
        const calcEng = (reach: number, inter: number) => reach > 0 ? (inter / reach) * 100 : 0;
        y.total.engagementRate = calcEng(y.total.reach, y.total.interactions);
        y.instagram.engagementRate = calcEng(y.instagram.reach, y.instagram.interactions);
        y.facebook.engagementRate = calcEng(y.facebook.reach, y.facebook.interactions);
        y.linkedin.engagementRate = calcEng(y.linkedin.reach, y.linkedin.interactions);
        return { ...y, id: y.year.toString() };
    });
  }, [rawData]);

  const chartData = useMemo(() => {
     return yearlyData.map(y => {
        const metrics = selectedNetwork === 'all' ? y.total : y[selectedNetwork];
        return { 
          id: y.id, 
          year: y.year, 
          total: metrics, 
          engagementRate: metrics.engagementRate, 
          reach: metrics.reach, 
          interactions: metrics.interactions,
          followerIncrease: metrics.followerIncrease || metrics.followers,
          views: metrics.views,
          clicks: metrics.clicks,
          contacts: metrics.contacts,
          profileVisits: metrics.profileVisits
        };
     });
  }, [yearlyData, selectedNetwork]);

  const analysisText = useMemo(() => generateAnnualReport(yearlyData, selectedNetwork), [yearlyData, selectedNetwork]);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
       <div className={`p-2 rounded-xl border inline-flex gap-1 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
           <button onClick={() => setSelectedNetwork('all')} className={`px-4 py-2 rounded-lg text-sm font-bold border ${selectedNetwork === 'all' ? 'bg-brand-600 text-white' : 'text-slate-500 border-transparent'}`}>Geral</button>
           <button onClick={() => setSelectedNetwork('instagram')} className={`px-4 py-2 rounded-lg text-sm font-bold border ${selectedNetwork === 'instagram' ? 'bg-brand-600 text-white' : 'text-slate-500 border-transparent'}`}>Instagram</button>
           <button onClick={() => setSelectedNetwork('facebook')} className={`px-4 py-2 rounded-lg text-sm font-bold border ${selectedNetwork === 'facebook' ? 'bg-brand-600 text-white' : 'text-slate-500 border-transparent'}`}>Facebook</button>
           <button onClick={() => setSelectedNetwork('linkedin')} className={`px-4 py-2 rounded-lg text-sm font-bold border ${selectedNetwork === 'linkedin' ? 'bg-brand-600 text-white' : 'text-slate-500 border-transparent'}`}>LinkedIn</button>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {chartData.map(d => (
              <div key={d.year} className={`p-6 rounded-2xl border transition-all hover:scale-[1.01] ${isDarkMode ? 'bg-slate-900 border-white/5 shadow-xl' : 'bg-white border-slate-200 shadow-sm'}`}>
                  <h3 className={`text-xl font-black mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Ano {d.year}</h3>
                  <div className="space-y-3">
                      <div className="flex justify-between text-sm"><span className="opacity-60">Alcance:</span><span className="font-bold">{formatNumber(d.total.reach)}</span></div>
                      <div className="flex justify-between text-sm"><span className="opacity-60">Interações:</span><span className="font-bold">{formatNumber(d.total.interactions)}</span></div>
                      <div className="flex justify-between font-black pt-2 border-t border-dashed border-white/10"><span className="opacity-60">Engajamento:</span><span className="text-emerald-500">{formatPercentage(d.total.engagementRate)}</span></div>
                  </div>
              </div>
          ))}
       </div>

       {/* GRÁFICOS DE VOLUME E ENGAJAMENTO */}
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <SectionWrapper id="annual-vol" title="Evolução de Volume Anual" subTitle="Comparativo entre Alcance e Interações" isDarkMode={isDarkMode} theme={theme} comment={commentsMap['annual-vol']} onCommentChange={onCommentChange} isCommentVisible={!!visibleComments['annual-vol']} onToggleComment={toggleVisibility}>
             <div className="h-[400px]"><OverviewChart data={chartData} isDarkMode={isDarkMode} /></div>
          </SectionWrapper>
          <SectionWrapper id="annual-eng" title="Taxa de Engajamento Anual (%)" subTitle="Qualidade da interação ano a ano" isDarkMode={isDarkMode} theme={theme} comment={commentsMap['annual-eng']} onCommentChange={onCommentChange} isCommentVisible={!!visibleComments['annual-eng']} onToggleComment={toggleVisibility}>
             <div className="h-[400px]"><SimpleBarChart data={chartData} xAxisKey="year" yAxisKey="engagementRate" color="#10b981" unit="%" isDarkMode={isDarkMode} /></div>
          </SectionWrapper>
       </div>

       {/* NOVOS GRÁFICOS: SEGUIDORES E VISUALIZAÇÕES */}
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <SectionWrapper id="annual-followers" title="Crescimento de Seguidores" subTitle="Saldo anual de novas conexões" isDarkMode={isDarkMode} theme={theme} comment={commentsMap['annual-followers']} onCommentChange={onCommentChange} isCommentVisible={!!visibleComments['annual-followers']} onToggleComment={toggleVisibility}>
             <div className="h-[350px]"><SimpleBarChart data={chartData} xAxisKey="year" yAxisKey="followerIncrease" color="#f59e0b" name="Seguidores" isDarkMode={isDarkMode} /></div>
          </SectionWrapper>
          <SectionWrapper id="annual-views" title="Impacto Visual (Impressões)" subTitle="Total de visualizações de conteúdo" isDarkMode={isDarkMode} theme={theme} comment={commentsMap['annual-views']} onCommentChange={onCommentChange} isCommentVisible={!!visibleComments['annual-views']} onToggleComment={toggleVisibility}>
             <div className="h-[350px]"><SimpleBarChart data={chartData} xAxisKey="year" yAxisKey="views" color="#06b6d4" name="Visualizações" isDarkMode={isDarkMode} /></div>
          </SectionWrapper>
       </div>

       {/* NOVOS GRÁFICOS: CLIQUES E CONTATOS */}
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <SectionWrapper id="annual-clicks" title="Tráfego: Cliques no Link" subTitle="Conversão de interesse em ação externa" isDarkMode={isDarkMode} theme={theme} comment={commentsMap['annual-clicks']} onCommentChange={onCommentChange} isCommentVisible={!!visibleComments['annual-clicks']} onToggleComment={toggleVisibility}>
             <div className="h-[350px]"><SimpleBarChart data={chartData} xAxisKey="year" yAxisKey="clicks" color="#8b5cf6" name="Cliques" isDarkMode={isDarkMode} /></div>
          </SectionWrapper>
          <SectionWrapper id="annual-contacts" title="Geração de Contatos" subTitle="Leads e contatos diretos via redes" isDarkMode={isDarkMode} theme={theme} comment={commentsMap['annual-contacts']} onCommentChange={onCommentChange} isCommentVisible={!!visibleComments['annual-contacts']} onToggleComment={toggleVisibility}>
             <div className="h-[350px]"><SimpleBarChart data={chartData} xAxisKey="year" yAxisKey="contacts" color="#f43f5e" name="Contatos" isDarkMode={isDarkMode} /></div>
          </SectionWrapper>
       </div>

       {selectedNetwork === 'all' && (
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <SectionWrapper id="annual-net-reach" title="Distribuição de Alcance por Rede" isDarkMode={isDarkMode} theme={theme} comment={commentsMap['annual-net-reach']} onCommentChange={onCommentChange} isCommentVisible={!!visibleComments['annual-net-reach']} onToggleComment={toggleVisibility}>
                <div className="h-[400px]"><NetworkStackedChart data={yearlyData} keys={["instagram.reach", "facebook.reach", "linkedin.reach"]} isDarkMode={isDarkMode} /></div>
            </SectionWrapper>
            <SectionWrapper id="annual-net-eng" title="Comparativo de Qualidade (Engajamento %)" isDarkMode={isDarkMode} theme={theme} comment={commentsMap['annual-net-eng']} onCommentChange={onCommentChange} isCommentVisible={!!visibleComments['annual-net-eng']} onToggleComment={toggleVisibility}>
                <div className="h-[400px]"><NetworkEngagementComparisonChart data={yearlyData} isDarkMode={isDarkMode} /></div>
            </SectionWrapper>
         </div>
       )}

       <section className={`rounded-3xl p-8 shadow-2xl transition-all duration-500 ${
         theme === 'infinity' ? 'bg-violet-900/10 border border-violet-500/20' : 
         isDarkMode ? 'bg-slate-900 border border-white/5' : 'bg-white border shadow-sm'
       }`}>
            <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-brand-600 text-white rounded-2xl shadow-lg"><BarChart2 size={24}/></div>
                <h3 className={`text-xl font-black uppercase tracking-tighter ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Análise Estratégica Automática Anual</h3>
            </div>
            <p className={`text-lg leading-relaxed whitespace-pre-line text-justify ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{analysisText}</p>
       </section>
    </div>
  );
};

export default AnnualSummary;
