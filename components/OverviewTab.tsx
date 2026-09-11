
import React, { useMemo } from 'react';
import { MonthlyData, PostData } from '../types';
import SectionWrapper from './SectionWrapper';
import MetricCard from './MetricCard';
import { 
  EngagementFocusChart, 
  SimplePieChart,
  SimpleBarChart
} from './Charts';
import { formatNumber, formatPercentage } from '../utils';
import { 
  Activity, Zap, Eye, Share2, UserPlus, Target
} from 'lucide-react';

interface OverviewTabProps {
  filteredData: MonthlyData[];
  rawData: MonthlyData[];
  postsData: PostData[];
  isDarkMode: boolean;
  theme: string;
}

const OverviewTab: React.FC<OverviewTabProps> = ({
  filteredData,
  rawData,
  postsData,
  isDarkMode,
  theme
}) => {
  const aggregated = useMemo(() => {
    if (filteredData.length === 0) return null;
    const reach = filteredData.reduce((acc, d) => acc + d.total.reach, 0);
    const interactions = filteredData.reduce((acc, d) => acc + d.total.interactions, 0);
    const followers = filteredData.reduce((acc, d) => acc + d.total.followerIncrease, 0);
    const views = filteredData.reduce((acc, d) => acc + d.instagram.views + d.facebook.views + d.linkedin.views, 0);
    
    return { 
      reach, interactions, engagement: reach > 0 ? (interactions / reach) * 100 : 0, followers, views
    };
  }, [filteredData]);

  const selectedMonthsCodes = useMemo(() => new Set(filteredData.map(d => d.month)), [filteredData]);

  const yoyData = useMemo(() => {
     if (selectedMonthsCodes.size === 0) return [];
     const years = Array.from(new Set(rawData.map(d => d.year))).sort();
     return years.map(yr => {
        const monthsInYear = rawData.filter(d => d.year === yr && selectedMonthsCodes.has(d.month));
        const totalReach = monthsInYear.reduce((acc, m) => acc + m.total.reach, 0);
        const totalInteractions = monthsInYear.reduce((acc, m) => acc + m.total.interactions, 0);
        return {
           year: yr.toString(),
           reach: totalReach,
           interactions: totalInteractions,
           engagementRate: totalReach > 0 ? (totalInteractions / totalReach) * 100 : 0,
           name: yr.toString()
        };
     }).filter(d => d.reach > 0);
  }, [rawData, selectedMonthsCodes]);

  const netCompData = useMemo(() => {
    if (filteredData.length === 0) return [];
    const nets = { ig: { reach: 0, inter: 0 }, fb: { reach: 0, inter: 0 }, li: { reach: 0, inter: 0 } };
    filteredData.forEach(d => {
        nets.ig.reach += d.instagram.reach; nets.ig.inter += d.instagram.interactions;
        nets.fb.reach += d.facebook.reach; nets.fb.inter += d.facebook.interactions;
        nets.li.reach += d.linkedin.reach; nets.li.inter += d.linkedin.interactions;
    });
    return [
      { name: 'Instagram', reach: nets.ig.reach, interactions: nets.ig.inter, engagement: nets.ig.reach > 0 ? (nets.ig.inter/nets.ig.reach)*100 : 0 },
      { name: 'Facebook', reach: nets.fb.reach, interactions: nets.fb.inter, engagement: nets.fb.reach > 0 ? (nets.fb.inter/nets.fb.reach)*100 : 0 },
      { name: 'LinkedIn', reach: nets.li.reach, interactions: nets.li.inter, engagement: nets.li.reach > 0 ? (nets.li.inter/nets.li.reach)*100 : 0 },
    ];
  }, [filteredData]);

  const top10Posts = useMemo(() => {
     const monthCodes = new Set(filteredData.map(d => d.monthName.toLowerCase()));
     return postsData
        .filter(p => monthCodes.has(p.month.toLowerCase()))
        .sort((a, b) => b.engagement - a.engagement)
        .slice(0, 10);
  }, [postsData, filteredData]);

  const trendData = useMemo(() => {
    return filteredData.map(d => ({
      ...d,
      totalViews: d.instagram.views + d.facebook.views + d.linkedin.views,
      totalVisits: d.instagram.profileVisits + d.facebook.profileVisits + d.linkedin.profileVisits,
      totalClicks: d.instagram.clicks + d.facebook.clicks + d.linkedin.clicks,
    }));
  }, [filteredData]);

  if (!aggregated) return <div className="p-20 text-center opacity-40 uppercase font-black tracking-widest">Sem dados no período</div>;

  const performanceBadge = (rate: number) => {
    if (rate >= 20) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.2)]';
    if (rate >= 10) return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
    return 'text-slate-400 bg-slate-500/10 border-slate-500/30';
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      
      {/* 1. MÉTRICAS PRINCIPAIS (GRID SUPERIOR) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <MetricCard title="Alcance" value={formatNumber(aggregated.reach)} theme={theme as any} />
        <MetricCard title="Interações" value={formatNumber(aggregated.interactions)} theme={theme as any} />
        <MetricCard title="Taxa Engaj." value={formatPercentage(aggregated.engagement)} theme={theme as any} />
        <MetricCard title="Seguidores" value={formatNumber(aggregated.followers)} theme={theme as any} />
        
        {/* Status Box - Alinhada com os cards */}
        <div className={`p-5 rounded-2xl border flex flex-col justify-center relative overflow-hidden transition-all group ${
          isDarkMode ? 'bg-black/40 border-white/5' : 'bg-brand-50 border-brand-100'
        }`}>
          <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity">
            <Target size={60} className={theme === 'cyber' ? 'text-cyber-border' : 'text-violet-500'} />
          </div>
          <div className="relative z-10">
            <h4 className={`text-[8px] font-black uppercase tracking-[0.2em] mb-1 ${isDarkMode ? 'text-white/40' : 'text-brand-700/50'}`}>System Health</h4>
            <div className="flex items-center gap-2">
              <span className={`text-sm font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                {aggregated.engagement >= 15 ? 'Elite' : 'Stable'}
              </span>
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981] animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. CORPO DO DASHBOARD */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Coluna Esquerda: Gráfico Principal e Tabela */}
        <div className="lg:col-span-8 space-y-6">
          <SectionWrapper id="ov-eng-chart" title="Radar de Interatividade" subTitle="Curva de engajamento temporal" isDarkMode={isDarkMode} theme={theme as any} onCommentChange={()=>{}} isCommentVisible={false} onToggleComment={()=>{}}>
            <div className="h-[320px] w-full">
              <EngagementFocusChart data={filteredData} isDarkMode={isDarkMode} theme={theme as any} />
            </div>
          </SectionWrapper>

          <SectionWrapper id="ov-leaderboard" title="Top Conteúdo" subTitle="Ranking de alta performance" isDarkMode={isDarkMode} theme={theme as any} onCommentChange={()=>{}} isCommentVisible={false} onToggleComment={()=>{}}>
             <div className={`overflow-x-auto rounded-xl border ${isDarkMode ? 'border-white/5 bg-black/10' : 'border-slate-100 bg-white'}`}>
                <table className="w-full text-left border-collapse">
                  <thead className={isDarkMode ? 'bg-white/5 text-white/30' : 'bg-slate-50 text-slate-500'}>
                    <tr className="uppercase font-black tracking-widest text-[8px]">
                      <th className="px-4 py-3 w-10">Rank</th>
                      <th className="px-4 py-3">Publicação</th>
                      <th className="px-4 py-3 text-right">Alcance</th>
                      <th className="px-4 py-3 text-right">Taxa %</th>
                      <th className="px-4 py-3 text-center">Tag</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {top10Posts.map((p, i) => (
                      <tr key={i} className={`group transition-all text-[11px] ${isDarkMode ? 'hover:bg-white/5 text-white' : 'hover:bg-slate-50'}`}>
                        <td className={`px-4 py-3 font-black opacity-30`}>{(i+1).toString().padStart(2, '0')}</td>
                        <td className="px-4 py-3">
                          <div className="flex flex-col">
                            <span className="font-bold truncate max-w-[200px] md:max-w-xs">{p.title}</span>
                            <span className="text-[8px] opacity-40 uppercase tracking-tighter">{p.type}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right tabular-nums opacity-60">{formatNumber(p.reach)}</td>
                        <td className="px-4 py-3 text-right font-black">
                          {p.engagement.toFixed(2)}%
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`px-1.5 py-0.5 rounded-[4px] text-[7px] font-black uppercase border ${performanceBadge(p.engagement)}`}>
                            {p.engagement >= 15 ? 'Top' : 'Ok'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
             </div>
          </SectionWrapper>
        </div>

        {/* Coluna Direita: Mini Gráficos e Distribuição */}
        <div className="lg:col-span-4 space-y-6">
          <SectionWrapper id="ov-networks-pie" title="Share de Rede" isDarkMode={isDarkMode} theme={theme as any} onCommentChange={()=>{}} isCommentVisible={false} onToggleComment={()=>{}}>
             <div className="flex flex-col gap-8 py-2">
                <div className="h-[180px]"><SimplePieChart data={netCompData} dataKey="reach" title="Impacto" isDarkMode={isDarkMode} theme={theme as any} /></div>
                <div className="h-[180px]"><SimplePieChart data={netCompData} dataKey="interactions" title="Interação" isDarkMode={isDarkMode} theme={theme as any} /></div>
             </div>
          </SectionWrapper>

          <SectionWrapper id="ov-growth" title="Crescimento" isDarkMode={isDarkMode} theme={theme as any} onCommentChange={()=>{}} isCommentVisible={false} onToggleComment={()=>{}}>
             <div className="h-[180px]">
                <SimpleBarChart data={trendData} xAxisKey="id" yAxisKey="total.followerIncrease" color="#f59e0b" isDarkMode={isDarkMode} theme={theme as any} name="Seguidores" />
             </div>
          </SectionWrapper>

          <SectionWrapper id="ov-history" title="Histórico YoY" isDarkMode={isDarkMode} theme={theme as any} onCommentChange={()=>{}} isCommentVisible={false} onToggleComment={()=>{}}>
             <div className="grid grid-cols-2 gap-4">
                <div className="h-[120px]">
                   <p className="text-[8px] font-black uppercase mb-2 opacity-50">Alcance</p>
                   <SimpleBarChart data={yoyData} xAxisKey="year" yAxisKey="reach" color="#0ea5e9" isDarkMode={isDarkMode} theme={theme as any} />
                </div>
                <div className="h-[120px]">
                   <p className="text-[8px] font-black uppercase mb-2 opacity-50">Interações</p>
                   <SimpleBarChart data={yoyData} xAxisKey="year" yAxisKey="interactions" color="#d946ef" isDarkMode={isDarkMode} theme={theme as any} />
                </div>
             </div>
          </SectionWrapper>
        </div>

      </div>
    </div>
  );
};

export default OverviewTab;
