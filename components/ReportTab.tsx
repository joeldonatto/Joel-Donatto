
import React, { useMemo, useState, useEffect } from 'react';
import { MonthlyData, PostData, NetworkType } from '../types';
import SectionWrapper from './SectionWrapper';
import MetricCard from './MetricCard';
import { 
  EngagementFocusChart, 
  PostTypeDistributionChart, PostTypePerformanceChart, SimplePieChart,
  MultiLineChart,
  SimpleBarChart,
  MetricEvolutionChart,
  OverviewChart,
  SimpleAreaChart
} from './Charts';
import { 
  generateReportEngagementRange, 
  generateReportNetworkComparisonRange, 
  generateYoYReport, 
  generateReportTopPosts, 
  generateReportAction, 
  generateReportJustification, 
  generateReportTrends2025,
  generateReportMetricEvolution,
  generatePeriodComparisonReport,
  formatNumber,
  formatPercentage
} from '../utils';
import { FileText, Users, TrendingUp, BarChart3, AlertCircle, Award, Target, Edit2, Save, X, RotateCcw, Eye, Printer, LayoutTemplate, Trophy, Medal, Activity, Share2, MousePointer2, Instagram, Facebook, Linkedin, History, Filter, Compass, UserPlus, MousePointerClick, MessageSquareText, CalendarRange, ExternalLink, RefreshCw, MousePointer, PhoneCall } from 'lucide-react';

interface ReportTabProps {
  rawData: MonthlyData[];
  postsData: PostData[];
  filteredData: MonthlyData[];
  isDarkMode: boolean;
  theme: string;
  commentsMap: Record<string, string>;
  onCommentChange: (id: string, text: string) => void;
  visibleComments: Record<string, boolean>;
  toggleVisibility: (id: string) => void;
  reportEdits: Record<string, string>;
  onReportEdit: (id: string, text: string) => void;
  onUpdatePost: (post: PostData) => void;
}

const ReportTab: React.FC<ReportTabProps> = ({
  rawData,
  postsData,
  filteredData,
  isDarkMode,
  theme,
  commentsMap,
  onCommentChange,
  visibleComments,
  toggleVisibility,
  reportEdits,
  onReportEdit,
  onUpdatePost
}) => {
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [rankMetric, setRankMetric] = useState<'engagement' | 'reach' | 'interactions'>('engagement');
  const [editingPost, setEditingPost] = useState<PostData | null>(null);
  const [selectedNetwork, setSelectedNetwork] = useState<NetworkType>('all');

  const aggregatedMetrics = useMemo(() => {
    if (filteredData.length === 0) return null;
    const reach = filteredData.reduce((acc, d) => acc + d.total.reach, 0);
    const interactions = filteredData.reduce((acc, d) => acc + d.total.interactions, 0);
    const eng = reach > 0 ? (interactions / reach) * 100 : 0;
    const followers = filteredData.reduce((acc, d) => acc + d.total.followerIncrease, 0);
    
    return { reach, interactions, engagementRate: eng, followers };
  }, [filteredData]);

  const trendData = useMemo(() => {
    return filteredData.map(d => ({
      ...d,
      totalViews: d.instagram.views + d.facebook.views + d.linkedin.views,
      totalVisits: d.instagram.profileVisits + d.facebook.profileVisits + d.linkedin.profileVisits,
      totalClicks: d.instagram.clicks + d.facebook.clicks + d.linkedin.clicks,
      totalContacts: d.instagram.contacts + d.facebook.contacts + d.linkedin.contacts,
    }));
  }, [filteredData]);

  const selectedMonthsCodes = useMemo(() => new Set(filteredData.map(d => d.month)), [filteredData]);

  const yoyMonthData = useMemo(() => {
    if (filteredData.length === 0) return [];
    const lastMonthData = filteredData[filteredData.length - 1];
    const targetMonth = lastMonthData.month; // e.g., "02"
    
    return rawData
      .filter(d => d.month === targetMonth)
      .map(d => ({
        id: d.id,
        year: d.year.toString(),
        name: `${d.monthName} ${d.year}`,
        reach: d.total.reach,
        interactions: d.total.interactions,
        engagementRate: d.total.engagementRate
      }))
      .sort((a, b) => Number(a.year) - Number(b.year));
  }, [rawData, filteredData]);

  const netCompData = useMemo(() => {
    if (filteredData.length === 0) return [];
    const nets = { ig: { reach: 0, interactions: 0 }, fb: { reach: 0, interactions: 0 }, li: { reach: 0, interactions: 0 } };
    filteredData.forEach(d => {
        nets.ig.reach += d.instagram.reach; nets.ig.interactions += d.instagram.interactions;
        nets.fb.reach += d.facebook.reach; nets.fb.interactions += d.facebook.interactions;
        nets.li.reach += d.linkedin.reach; nets.li.interactions += d.linkedin.interactions;
    });
    return [
      { name: 'Instagram', reach: nets.ig.reach, interactions: nets.ig.interactions, engagement: nets.ig.reach > 0 ? (nets.ig.interactions/nets.ig.reach)*100 : 0 },
      { name: 'Facebook', reach: nets.fb.reach, interactions: nets.fb.interactions, engagement: nets.fb.reach > 0 ? (nets.fb.interactions/nets.fb.reach)*100 : 0 },
      { name: 'LinkedIn', reach: nets.li.reach, interactions: nets.li.interactions, engagement: nets.li.reach > 0 ? (nets.li.interactions/nets.li.reach)*100 : 0 },
    ];
  }, [filteredData]);

  const top20Posts = useMemo(() => {
     const monthCodes = new Set(filteredData.map(d => d.monthName.toLowerCase()));
     return postsData
        .filter(p => monthCodes.has(p.month.toLowerCase()))
        .sort((a, b) => {
          if (rankMetric === 'engagement') return b.engagement - a.engagement;
          if (rankMetric === 'reach') return b.reach - a.reach;
          return b.interactions - a.interactions;
        })
        .slice(0, 20);
  }, [postsData, filteredData, rankMetric]);

  const periodLabel = useMemo(() => {
    if (filteredData.length === 0) return "";
    const first = filteredData[0];
    const last = filteredData[filteredData.length - 1];
    return first.id === last.id ? first.monthName : `${first.monthName} a ${last.monthName}`;
  }, [filteredData]);

  const txtEng = useMemo(() => generateReportEngagementRange(filteredData), [filteredData]);
  const txtNet = useMemo(() => generateReportNetworkComparisonRange(filteredData), [filteredData]);
  const txtPeriodComparison = useMemo(() => generatePeriodComparisonReport(yoyMonthData), [yoyMonthData]);
  const txtPosts = useMemo(() => generateReportTopPosts(top20Posts), [top20Posts]);
  const txtAction = useMemo(() => generateReportAction(filteredData), [filteredData]);
  const txtJustification = useMemo(() => generateReportJustification(filteredData), [filteredData]);
  const txtTrends = useMemo(() => generateReportTrends2025(filteredData), [filteredData]);
  const txtMetricEvolution = useMemo(() => generateReportMetricEvolution(filteredData, selectedNetwork), [filteredData, selectedNetwork]);

  const effectiveDarkMode = isPreviewMode ? false : isDarkMode;
  const effectiveTheme = isPreviewMode ? 'light' : theme;
  const containerClass = isPreviewMode ? "w-full max-w-[210mm] mx-auto bg-white text-slate-900 shadow-2xl p-[15mm] min-h-[297mm] rounded-none border-none" : "max-w-6xl mx-auto space-y-12";
  const inputClass = effectiveDarkMode ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-slate-50 border-slate-200';

  const EditableAIBox = ({ id, initialText, title = "Análise Automática Estratégica" }: any) => {
    const savedText = reportEdits[id];
    const displayText = savedText !== undefined ? savedText : initialText;
    const [isEditing, setIsEditing] = useState(false);
    const [tempText, setTempText] = useState(displayText);
    const handleSave = () => { onReportEdit(id, tempText); setIsEditing(false); };
    return (
        <div className={`mt-8 mb-4 rounded-xl p-5 border shadow-sm section-break-avoid ${effectiveDarkMode ? 'bg-slate-900/50 border-cyan-900/50' : 'bg-slate-50 border-slate-200'}`}>
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Activity size={16} className={effectiveDarkMode ? 'text-neon-glowBlue' : 'text-slate-500'} />
                  <h4 className={`text-sm font-bold uppercase ${effectiveDarkMode ? 'text-cyan-400' : 'text-slate-800'}`}>{title}</h4>
                </div>
                {!isEditing && !isPreviewMode && <button onClick={() => { setTempText(displayText); setIsEditing(true); }} className="text-xs text-slate-500 hover:text-brand-600 no-print"><Edit2 size={14} /></button>}
                {isEditing && <div className="flex gap-2 no-print"><button onClick={() => setIsEditing(false)} className="text-xs">X</button><button onClick={handleSave} className="text-xs font-bold text-brand-600">S</button></div>}
            </div>
            {isEditing ? <textarea value={tempText} onChange={(e) => setTempText(e.target.value)} className={`w-full min-h-[100px] p-2 bg-transparent text-sm border rounded ${effectiveDarkMode ? 'text-white' : 'text-slate-800'}`} /> : <p className={`text-sm leading-relaxed text-justify whitespace-pre-line ${effectiveDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>{displayText}</p>}
        </div>
    );
  };

  const EditableTextBox = ({ id, initialText, title, icon: Icon }: any) => {
    const savedText = reportEdits[id];
    const displayText = savedText !== undefined ? savedText : initialText;
    const [isEditing, setIsEditing] = useState(false);
    const [tempText, setTempText] = useState(displayText);
    const handleSave = () => { onReportEdit(id, tempText); setIsEditing(false); };
    return (
        <div className={`p-6 rounded-xl border-l-4 shadow-lg mb-8 section-break-avoid ${effectiveDarkMode ? 'bg-slate-900 border-l-emerald-500 border-slate-800' : 'bg-white border-l-emerald-600 border-slate-200'}`}>
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Icon size={24} className="text-emerald-500"/>
                  <h3 className={`text-xl font-bold ${effectiveDarkMode ? 'text-white' : 'text-slate-900'}`}>{title}</h3>
                </div>
                {!isEditing && !isPreviewMode && <button onClick={() => { setTempText(displayText); setIsEditing(true); }} className="text-xs no-print"><Edit2 size={16}/></button>}
                {isEditing && <div className="flex gap-2 no-print"><button onClick={() => setIsEditing(false)}>X</button><button onClick={handleSave} className="font-bold">S</button></div>}
            </div>
            {isEditing ? <textarea value={tempText} onChange={(e) => setTempText(e.target.value)} className={`w-full min-h-[150px] p-3 bg-transparent border rounded ${effectiveDarkMode ? 'text-white' : 'text-slate-800'}`} /> : <p className={`text-base leading-relaxed text-justify ${effectiveDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>{displayText}</p>}
        </div>
    );
  };

  const metricLabelMap = { engagement: 'Engajamento', reach: 'Alcance', interactions: 'Interações' };

  if (!aggregatedMetrics) return null;

  return (
    <div className={isPreviewMode ? "bg-slate-100 p-8 min-h-screen" : ""}>
        {editingPost && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300 no-print">
            <div className={`w-full max-w-lg rounded-2xl border shadow-2xl p-6 relative ${effectiveDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
              <button onClick={() => setEditingPost(null)} className="absolute top-4 right-4 p-2 text-slate-500"><X size={20} /></button>
              <h3 className={`text-xl font-black mb-6 ${effectiveDarkMode ? 'text-white' : 'text-slate-900'}`}>Editar Publicação</h3>
              <div className="space-y-4">
                <div><label className="text-xs font-black uppercase mb-1 block">Título</label><input type="text" value={editingPost.title} onChange={e => setEditingPost({...editingPost, title: e.target.value})} className={`w-full p-3 rounded-xl border text-sm ${inputClass}`} /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="text-xs font-black uppercase mb-1 block">Alcance</label><input type="number" value={editingPost.reach} onChange={e => setEditingPost({...editingPost, reach: Number(e.target.value)})} className={`w-full p-3 rounded-xl border text-sm ${inputClass}`} /></div>
                  <div><label className="text-xs font-black uppercase mb-1 block">Interações</label><input type="number" value={editingPost.interactions} onChange={e => setEditingPost({...editingPost, interactions: Number(e.target.value)})} className={`w-full p-3 rounded-xl border text-sm ${inputClass}`} /></div>
                </div>
              </div>
              <div className="mt-8 flex gap-3"><button onClick={() => setEditingPost(null)} className="flex-1 py-3 rounded-xl font-bold border">Cancelar</button><button onClick={() => { onUpdatePost(editingPost); setEditingPost(null); }} className="flex-1 py-3 rounded-xl font-bold bg-brand-600 text-white">Salvar</button></div>
            </div>
          </div>
        )}

        <div className={`flex justify-between items-center mb-8 no-print ${isPreviewMode ? 'max-w-[210mm] mx-auto' : ''}`}>
            <h2 className={`text-2xl font-bold ${effectiveDarkMode ? 'text-white' : 'text-slate-900'}`}>Relatório Gerencial Estratégico</h2>
            <div className="flex gap-3">
                 <button onClick={() => window.print()} className="px-4 py-2 rounded-lg bg-brand-600 text-white shadow-md flex items-center gap-2 hover:bg-brand-700 transition-all"><Printer size={18}/> Imprimir Relatório</button>
            </div>
        </div>
        
        <div className={containerClass} id="printable-report">
            <div className={`mb-10 text-center border-b-2 pb-8 section-break-avoid ${effectiveDarkMode ? 'border-slate-800' : 'border-slate-900'}`}>
               <h1 className={`text-4xl font-black uppercase tracking-tighter mb-2 ${effectiveDarkMode ? 'text-white' : 'text-slate-900'}`}>INDICADOR ESTRATÉGICO DA ASS. COMUNICAÇÃO DO CSSJD</h1>
               <p className={`text-xl font-bold italic ${effectiveDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Fórmula: (Interações / Alcance) * 100</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 section-break-avoid">
              <MetricCard title="Alcance Acumulado" value={formatNumber(aggregatedMetrics.reach)} isKeyMetric theme={effectiveTheme as any} />
              <MetricCard title="Interações Totais" value={formatNumber(aggregatedMetrics.interactions)} isKeyMetric theme={effectiveTheme as any} />
              <MetricCard title="Taxa de Engajamento" value={formatPercentage(aggregatedMetrics.engagementRate)} goal={20} highlightCondition={aggregatedMetrics.engagementRate >= 20} theme={effectiveTheme as any} />
              <MetricCard title="Novos Seguidores" value={formatNumber(aggregatedMetrics.followers)} theme={effectiveTheme as any} />
            </div>
            
            <SectionWrapper id="rep-eng-range" title="Evolução de Engajamento (Período)" isDarkMode={effectiveDarkMode} theme={effectiveTheme as any} comment={commentsMap['rep-eng-range']} onCommentChange={onCommentChange} isCommentVisible={!!visibleComments['rep-eng-range']} onToggleComment={toggleVisibility}>
                <div className="h-[350px]"><EngagementFocusChart data={filteredData} isDarkMode={effectiveDarkMode} theme={effectiveTheme as any} /></div>
                <EditableAIBox id="rep-eng-range-ai" initialText={txtEng} />
            </SectionWrapper>

            <SectionWrapper 
               id="rep-metric-evolution" 
               title="Avanço de Métricas Estratégicas" 
               subTitle="Evolução temporal de Alcance, Interação e Engajamento"
               isDarkMode={effectiveDarkMode} 
               theme={effectiveTheme as any} 
               comment={commentsMap['rep-metric-evolution']} 
               onCommentChange={onCommentChange} 
               isCommentVisible={!!visibleComments['rep-metric-evolution']} 
               onToggleComment={toggleVisibility}
               headerAction={
                 <div className={`flex items-center gap-1 rounded-lg p-1 border no-print ${effectiveDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'}`}>
                   {(['all', 'instagram', 'facebook', 'linkedin'] as const).map((net) => (
                     <button 
                       key={net} 
                       onClick={() => setSelectedNetwork(net)} 
                       className={`px-3 py-1.5 rounded-md text-[10px] font-black uppercase transition-all ${selectedNetwork === net ? 'bg-brand-600 text-white shadow-md' : 'text-slate-500 hover:text-brand-600'}`}
                     >
                       {net === 'all' ? 'Consolidado' : net}
                     </button>
                   ))}
                 </div>
               }
            >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                   <div className="h-[250px]">
                     <h4 className={`text-[9px] font-black uppercase tracking-widest mb-4 flex items-center gap-2 ${effectiveDarkMode ? 'text-white/80' : 'text-slate-400'}`}><Eye size={12}/> Alcance</h4>
                     <SimpleAreaChart 
                        data={filteredData.map(d => ({ ...d, val: selectedNetwork === 'all' ? d.total.reach : (d as any)[selectedNetwork].reach }))} 
                        xAxisKey="id" 
                        yAxisKey="val" 
                        color="#0ea5e9" 
                        isDarkMode={effectiveDarkMode} 
                        theme={effectiveTheme as any} 
                        name="Alcance"
                     />
                   </div>
                   <div className="h-[250px]">
                     <h4 className={`text-[9px] font-black uppercase tracking-widest mb-4 flex items-center gap-2 ${effectiveDarkMode ? 'text-white/80' : 'text-slate-400'}`}><Share2 size={12}/> Interação</h4>
                     <SimpleAreaChart 
                        data={filteredData.map(d => ({ ...d, val: selectedNetwork === 'all' ? d.total.interactions : (d as any)[selectedNetwork].interactions }))} 
                        xAxisKey="id" 
                        yAxisKey="val" 
                        color="#d946ef" 
                        isDarkMode={effectiveDarkMode} 
                        theme={effectiveTheme as any} 
                        name="Interação"
                     />
                   </div>
                   <div className="h-[250px]">
                     <h4 className={`text-[9px] font-black uppercase tracking-widest mb-4 flex items-center gap-2 ${effectiveDarkMode ? 'text-white/80' : 'text-slate-400'}`}><Activity size={12}/> Engajamento</h4>
                     <SimpleAreaChart 
                        data={filteredData.map(d => ({ ...d, val: selectedNetwork === 'all' ? d.total.engagementRate : (d as any)[selectedNetwork].engagementRate }))} 
                        xAxisKey="id" 
                        yAxisKey="val" 
                        color="#10b981" 
                        unit="%" 
                        isDarkMode={effectiveDarkMode} 
                        theme={effectiveTheme as any} 
                        name="Engajamento"
                     />
                   </div>
                </div>
                <EditableAIBox id="rep-metric-evolution-ai" initialText={txtMetricEvolution} />
            </SectionWrapper>

            <SectionWrapper id="rep-net-range" title="Performance Consolidada por Rede" isDarkMode={effectiveDarkMode} theme={effectiveTheme as any} comment={commentsMap['rep-net-range']} onCommentChange={onCommentChange} isCommentVisible={!!visibleComments['rep-net-range']} onToggleComment={toggleVisibility}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 min-h-[350px] items-center">
                    <div className="h-[320px]"><SimplePieChart data={netCompData} dataKey="reach" title="Fatia de Alcance" isDarkMode={effectiveDarkMode} theme={effectiveTheme as any} /></div>
                    <div className="h-[320px]"><SimplePieChart data={netCompData} dataKey="interactions" title="Fatia de Interação" isDarkMode={effectiveDarkMode} theme={effectiveTheme as any} /></div>
                    <div className="h-[320px]"><SimplePieChart data={netCompData} dataKey="engagement" title="Engajamento por Canal" unit="%" isDarkMode={effectiveDarkMode} theme={effectiveTheme as any} /></div>
                </div>
                <EditableAIBox id="rep-net-range-ai" initialText={txtNet} />
            </SectionWrapper>
            
            <SectionWrapper 
               id="rep-top20" 
               title="Top 20 Publicações do Período" 
               isDarkMode={effectiveDarkMode} 
               theme={effectiveTheme as any} 
               comment={commentsMap['rep-top20']} 
               onCommentChange={onCommentChange} 
               isCommentVisible={!!visibleComments['rep-top20']} 
               onToggleComment={toggleVisibility}
               headerAction={
                 <div className={`flex items-center gap-1 rounded-lg p-1 border no-print ${effectiveDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'}`}>
                   {(['engagement', 'reach', 'interactions'] as const).map((m) => (
                     <button key={m} onClick={() => setRankMetric(m)} className={`px-3 py-1.5 rounded-md text-[10px] font-black uppercase transition-all ${rankMetric === m ? 'bg-brand-600 text-white shadow-md' : 'text-slate-500 hover:text-brand-600'}`}>{metricLabelMap[m]}</button>
                   ))}
                 </div>
               }
            >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                   <div className={`p-6 rounded-2xl h-[350px] ${effectiveDarkMode ? 'bg-black/20 border border-white/5' : 'bg-slate-50 border border-slate-200'}`}>
                      <h4 className={`text-[10px] font-black uppercase tracking-widest mb-4 ${effectiveDarkMode ? 'text-white/80' : 'text-slate-400'}`}>Mix de Formatos</h4>
                      <PostTypeDistributionChart data={top20Posts} isDarkMode={effectiveDarkMode} theme={effectiveTheme as any} />
                   </div>
                   <div className={`p-6 rounded-2xl h-[350px] ${effectiveDarkMode ? 'bg-black/20 border border-white/5' : 'bg-slate-50 border border-slate-200'}`}>
                      <h4 className={`text-[10px] font-black uppercase tracking-widest mb-4 ${effectiveDarkMode ? 'text-white/80' : 'text-slate-400'}`}>Performance Média</h4>
                      <PostTypePerformanceChart data={top20Posts} metric={rankMetric} isDarkMode={effectiveDarkMode} theme={effectiveTheme as any} />
                   </div>
                </div>

                <div className={`overflow-x-auto rounded-2xl border ${effectiveDarkMode ? 'border-white/5 bg-black/10' : 'border-slate-200 bg-white'}`}>
                   <table className={`w-full text-xs text-left border-collapse`}>
                      <thead className={effectiveDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-500'}>
                        <tr className="uppercase tracking-widest font-black text-[9px] border-b border-white/10">
                           <th className="px-6 py-4">Ranking</th>
                           <th className="px-6 py-4">Título</th>
                           <th className="px-6 py-4">Mês</th>
                           <th className="px-6 py-4 text-right">Alcance</th>
                           <th className="px-6 py-4 text-right">Taxa %</th>
                           <th className="px-6 py-4 text-center no-print">Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {top20Posts.map((p, i) => (
                          <tr key={i} className={`border-b transition-all ${effectiveDarkMode ? 'border-white/5 hover:bg-white/5 text-white' : 'border-slate-100 hover:bg-slate-50 text-slate-800'}`}>
                             <td className={`px-6 py-4 font-bold text-lg ${effectiveDarkMode ? 'text-white/40' : 'opacity-30'}`}>{(i + 1).toString().padStart(2, '0')}</td>
                             <td className="px-6 py-4 font-bold text-[11px] truncate max-w-xs">{p.title}</td>
                             <td className={`px-6 py-4 font-medium capitalize ${effectiveDarkMode ? 'text-white/70' : 'opacity-60'}`}>{p.month}</td>
                             <td className="px-6 py-4 text-right tabular-nums">{formatNumber(p.reach)}</td>
                             <td className={`px-6 py-4 text-right font-black text-sm ${effectiveDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>{p.engagement.toFixed(2)}%</td>
                             <td className="px-6 py-4 text-center no-print">
                               <button onClick={() => setEditingPost(p)} className={`p-2 rounded-lg transition-colors ${effectiveDarkMode ? 'text-white hover:bg-white/10' : 'hover:bg-brand-50'}`}>
                                 <Edit2 size={14} />
                               </button>
                             </td>
                          </tr>
                        ))}
                      </tbody>
                   </table>
                </div>
                <EditableAIBox id="rep-top20-ai" initialText={txtPosts} />
            </SectionWrapper>

            <SectionWrapper id="rep-period-comparison" title={`Contexto Histórico: Comparativo Anual (YoY)`} subTitle={`Referência: ${filteredData.length > 0 ? filteredData[filteredData.length-1].monthName : ''} em diferentes anos`} isDarkMode={effectiveDarkMode} theme={effectiveTheme as any} comment={commentsMap['rep-period-comparison']} onCommentChange={onCommentChange} isCommentVisible={!!visibleComments['rep-period-comparison']} onToggleComment={toggleVisibility}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                   <div className="h-[250px]"><h4 className={`text-[9px] font-black uppercase tracking-widest mb-4 flex items-center gap-2 ${effectiveDarkMode ? 'text-white/80' : 'text-slate-400'}`}><Eye size={12}/> Alcance</h4><SimpleBarChart data={yoyMonthData} xAxisKey="year" yAxisKey="reach" color="#0ea5e9" isDarkMode={effectiveDarkMode} theme={effectiveTheme as any} /></div>
                   <div className="h-[250px]"><h4 className={`text-[9px] font-black uppercase tracking-widest mb-4 flex items-center gap-2 ${effectiveDarkMode ? 'text-white/80' : 'text-slate-400'}`}><Share2 size={12}/> Interação</h4><SimpleBarChart data={yoyMonthData} xAxisKey="year" yAxisKey="interactions" color="#d946ef" isDarkMode={effectiveDarkMode} theme={effectiveTheme as any} /></div>
                   <div className="h-[250px]"><h4 className={`text-[9px] font-black uppercase tracking-widest mb-4 flex items-center gap-2 ${effectiveDarkMode ? 'text-white/80' : 'text-slate-400'}`}><Activity size={12}/> Engajamento</h4><SimpleBarChart data={yoyMonthData} xAxisKey="year" yAxisKey="engagementRate" color="#10b981" unit="%" isDarkMode={effectiveDarkMode} theme={effectiveTheme as any} /></div>
                </div>
                <EditableAIBox id="rep-period-comparison-ai" initialText={txtPeriodComparison} />
            </SectionWrapper>

            <EditableTextBox id="rep-action" title="Resultado na Ação Executada" icon={Award} initialText={txtAction} />
            <EditableTextBox id="rep-justification" title="Justificativa de Performance" icon={Target} initialText={txtJustification} />

            <SectionWrapper id="rep-consolidated-trends" title="Tendências de Médio Prazo" isDarkMode={effectiveDarkMode} theme={effectiveTheme as any} comment={commentsMap['rep-consolidated-trends']} onCommentChange={onCommentChange} isCommentVisible={!!visibleComments['rep-consolidated-trends']} onToggleComment={toggleVisibility}>
                <div className="grid grid-cols-1 gap-8 mb-12">
                   <div className="h-[350px]"><h4 className={`text-sm font-black uppercase tracking-widest mb-4 flex items-center gap-2 ${effectiveDarkMode ? 'text-yellow-400' : 'text-yellow-600'}`}><UserPlus size={16}/> Crescimento Consolidado de Seguidores</h4><SimpleBarChart data={trendData} xAxisKey="id" yAxisKey="total.followerIncrease" color="#f59e0b" isDarkMode={effectiveDarkMode} theme={effectiveTheme as any} /></div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                   <div className="h-[220px]"><h4 className={`text-[10px] font-black uppercase tracking-widest mb-3 ${effectiveDarkMode ? 'text-white/80' : 'text-slate-400'}`}>Engajamento</h4><SimpleBarChart data={trendData} xAxisKey="id" yAxisKey="total.engagementRate" color="#10b981" unit="%" isDarkMode={effectiveDarkMode} /></div>
                   <div className="h-[220px]"><h4 className={`text-[10px] font-black uppercase tracking-widest mb-3 ${effectiveDarkMode ? 'text-white/80' : 'text-slate-400'}`}>Visualizações</h4><SimpleBarChart data={trendData} xAxisKey="id" yAxisKey="totalViews" color="#06b6d4" isDarkMode={effectiveDarkMode} /></div>
                   <div className="h-[220px]"><h4 className={`text-[10px] font-black uppercase tracking-widest mb-3 ${effectiveDarkMode ? 'text-white/80' : 'text-slate-400'}`}>Visitas</h4><SimpleBarChart data={trendData} xAxisKey="id" yAxisKey="totalVisits" color="#f43f5e" isDarkMode={effectiveDarkMode} /></div>
                   <div className="h-[220px]"><h4 className={`text-[10px] font-black uppercase tracking-widest mb-3 ${effectiveDarkMode ? 'text-white/80' : 'text-slate-400'}`}>Cliques</h4><SimpleBarChart data={trendData} xAxisKey="id" yAxisKey="totalClicks" color="#8b5cf6" isDarkMode={effectiveDarkMode} /></div>
                </div>
                <EditableAIBox id="rep-trends-ai" initialText={txtTrends} />
            </SectionWrapper>
        </div>
    </div>
  );
};

export default ReportTab;
