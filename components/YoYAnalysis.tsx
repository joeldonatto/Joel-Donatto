
import React, { useMemo, useState } from 'react';
import { MonthlyData, NetworkType } from '../types';
import SectionWrapper from './SectionWrapper';
import { SimpleBarChart, MultiLineChart } from './Charts';
import { formatNumber, formatPercentage, generateYoYReport, generateSeasonalityReport } from '../utils';
import { AlertCircle, LayoutDashboard, Instagram, Facebook, Linkedin, Users, Activity, Eye, Share2, UserPlus, Table } from 'lucide-react';

interface YoYAnalysisProps {
  rawData: MonthlyData[];
  selectedMonth: string; // 'all' or '01'...'12'
  isDarkMode: boolean;
  commentsMap: Record<string, string>;
  onCommentChange: (id: string, text: string) => void;
  visibleComments: Record<string, boolean>;
  toggleVisibility: (id: string) => void;
}

const YoYAnalysis: React.FC<YoYAnalysisProps> = ({
  rawData,
  selectedMonth,
  isDarkMode,
  commentsMap,
  onCommentChange,
  visibleComments,
  toggleVisibility
}) => {
  
  const [selectedNetwork, setSelectedNetwork] = useState<NetworkType>('all');
  const [metricMode, setMetricMode] = useState<'engagementRate' | 'reach' | 'interactions' | 'followers'>('engagementRate');

  const monthNameMap: Record<string, string> = {
    "01": "Janeiro", "02": "Fevereiro", "03": "Março", "04": "Abril", "05": "Maio", "06": "Junho",
    "07": "Julho", "08": "Agosto", "09": "Setembro", "10": "Outubro", "11": "Novembro", "12": "Dezembro"
  };

  // Helper to extract correct metrics
  const getMetrics = (d: MonthlyData) => {
      if (selectedNetwork === 'instagram') return { ...d.instagram, followers: d.instagram.followers }; 
      if (selectedNetwork === 'facebook') return { ...d.facebook, followers: d.facebook.followers };
      if (selectedNetwork === 'linkedin') return { ...d.linkedin, followers: d.linkedin.followers };
      // total
      return { 
          reach: d.total.reach, 
          interactions: d.total.interactions, 
          engagementRate: d.total.engagementRate,
          followers: d.total.followerIncrease 
      };
  };

  const formatByMetric = (val: number | null) => {
    if (val === null) return '-';
    if (metricMode === 'engagementRate') return formatPercentage(val);
    return formatNumber(val);
  };

  // Logic 1: Specific Month Selected (Bar Charts Comparison)
  const specificMonthData = useMemo(() => {
    if (selectedMonth === 'all') return [];
    
    return rawData
      .filter(d => d.month === selectedMonth)
      .map(d => {
         const metrics = getMetrics(d);
         return {
            year: d.year.toString(),
            reach: metrics.reach,
            interactions: metrics.interactions,
            engagementRate: metrics.engagementRate,
            followers: metrics.followers,
            // for tooltip
            name: d.year.toString()
         };
      })
      .sort((a,b) => parseInt(a.year) - parseInt(b.year));
  }, [rawData, selectedMonth, selectedNetwork]);

  // Logic 2: All Months (Line Chart Comparison - Seasonality)
  const seasonalityData = useMemo(() => {
     if (selectedMonth !== 'all') return [];

     // Structure: { name: 'Jan', 2023: val, 2024: val, 2025: val }
     const monthLabels = Object.keys(monthNameMap).sort();
     const availableYears = Array.from(new Set(rawData.map(d => d.year))).sort();
     
     return monthLabels.map(mCode => {
        const item: Record<string, any> = { 
          name: monthNameMap[mCode].substring(0, 3),
          fullName: monthNameMap[mCode],
          code: mCode
        };
        availableYears.forEach((year: number) => {
            const found = rawData.find(d => d.year === year && d.month === mCode);
            if (found) {
                const m = getMetrics(found);
                // Dynamically access the selected metric
                item[year.toString()] = m[metricMode];
            } else {
                item[year.toString()] = null;
            }
        });
        return item;
     });
  }, [rawData, selectedMonth, selectedNetwork, metricMode]);

  const availableYears = useMemo(() => Array.from(new Set(rawData.map(d => d.year))).sort(), [rawData]);
  const yearColors = ["#94a3b8", "#60a5fa", "#34d399", "#f472b6"]; // Colors for 2022, 23, 24, 25...

  // AI Analysis Text Generation
  const analysisText = useMemo(() => {
      if (selectedMonth === 'all') {
         return generateSeasonalityReport(rawData, selectedNetwork, metricMode);
      }
      return generateYoYReport(specificMonthData, monthNameMap[selectedMonth], selectedNetwork);
  }, [specificMonthData, selectedMonth, selectedNetwork, rawData, metricMode]);

  const renderFilterButton = (id: NetworkType, label: string, Icon: React.ElementType) => (
    <button
      onClick={() => setSelectedNetwork(id)}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors border ${
        selectedNetwork === id 
          ? (isDarkMode ? 'bg-slate-800 text-neon-glowBlue border-neon-glowBlue' : 'bg-white text-brand-600 border-brand-200 shadow-sm')
          : (isDarkMode ? 'bg-transparent text-slate-400 border-transparent hover:bg-slate-800' : 'bg-transparent text-slate-500 border-transparent hover:bg-slate-100')
      }`}
    >
      <Icon size={16} />
      {label}
    </button>
  );

  const renderMetricButton = (id: typeof metricMode, label: string, Icon: React.ElementType) => (
    <button
      onClick={() => setMetricMode(id)}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-colors border ${
        metricMode === id 
          ? (isDarkMode ? 'bg-slate-800 text-neon-purple border-neon-purple' : 'bg-white text-fuchsia-600 border-fuchsia-200 shadow-sm')
          : (isDarkMode ? 'bg-transparent text-slate-500 border-transparent hover:bg-slate-800' : 'bg-transparent text-slate-500 border-transparent hover:bg-slate-100')
      }`}
    >
      <Icon size={14} />
      {label}
    </button>
  );

  const metricTitle = {
    engagementRate: 'Taxa de Engajamento (%)',
    reach: 'Alcance Bruto',
    interactions: 'Interações Totais',
    followers: 'Aumento de Seguidores'
  };

  return (
    <div className="space-y-6">
        {/* Network Selector */}
        <div className={`p-2 rounded-xl border inline-flex gap-1 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
           {renderFilterButton('all', 'Consolidado', LayoutDashboard)}
           {renderFilterButton('instagram', 'Instagram', Instagram)}
           {renderFilterButton('facebook', 'Facebook', Facebook)}
           {renderFilterButton('linkedin', 'LinkedIn', Linkedin)}
       </div>

        {selectedMonth === 'all' ? (
        <div className="space-y-6">
            <div className={`p-4 rounded-xl border flex items-start gap-3 ${isDarkMode ? 'bg-slate-900 border-slate-700 text-slate-300' : 'bg-blue-50 border-blue-100 text-blue-800'}`}>
                <AlertCircle className="flex-shrink-0 mt-0.5" size={20} />
                <div>
                    <h4 className="font-bold">Modo de Comparação Geral</h4>
                    <p className="text-sm">Selecione um mês específico no filtro superior para ver a comparação detalhada (barras) entre os anos. Abaixo, você vê a análise de tendência completa.</p>
                </div>
            </div>

            <SectionWrapper
                id="yoy-seasonality"
                title={`Sazonalidade e Evolução Histórica`}
                subTitle="Selecione a métrica abaixo para visualizar a curva de tendência comparativa entre os anos."
                isDarkMode={isDarkMode}
                comment={commentsMap['yoy-seasonality']}
                onCommentChange={onCommentChange}
                isCommentVisible={!!visibleComments['yoy-seasonality']}
                onToggleComment={toggleVisibility}
                headerAction={
                    <div className={`flex items-center gap-1 rounded-lg p-1 ${isDarkMode ? 'bg-slate-950 border border-slate-800' : 'bg-slate-100 border border-slate-200'}`}>
                        {renderMetricButton('engagementRate', 'Engajamento', Activity)}
                        {renderMetricButton('reach', 'Alcance', Eye)}
                        {renderMetricButton('interactions', 'Interações', Share2)}
                        {renderMetricButton('followers', 'Seguidores', UserPlus)}
                    </div>
                }
            >
                <div className="h-[450px]">
                  <MultiLineChart 
                      data={seasonalityData} 
                      lines={availableYears.map((y, i) => ({ 
                          key: y.toString(), 
                          color: yearColors[i % yearColors.length], 
                          name: y.toString() 
                      }))}
                      isDarkMode={isDarkMode} 
                  />
                </div>
            </SectionWrapper>

            {/* TABELA COMPARATIVA DE DADOS */}
            <SectionWrapper 
                id="yoy-data-table" 
                title={`Tabela Comparativa: ${metricTitle[metricMode]}`}
                subTitle={`Detalhamento numérico mensal por ano`}
                isDarkMode={isDarkMode}
                onCommentChange={onCommentChange}
                isCommentVisible={!!visibleComments['yoy-data-table']}
                onToggleComment={toggleVisibility}
            >
                <div className={`overflow-hidden rounded-xl border ${isDarkMode ? 'bg-slate-900 border-white/5' : 'bg-white border-slate-200'}`}>
                    <table className="w-full text-[11px] text-left">
                        <thead className={isDarkMode ? 'bg-black/40 text-slate-400' : 'bg-slate-50 text-slate-500'}>
                            <tr className="uppercase tracking-widest font-black border-b border-white/5">
                                <th className="px-6 py-4">Mês</th>
                                {availableYears.map((year, i) => (
                                  <th key={year} className="px-6 py-4 text-right" style={{ color: yearColors[i % yearColors.length] }}>
                                    {year}
                                  </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className={`divide-y ${isDarkMode ? 'divide-white/5' : 'divide-slate-100'}`}>
                            {seasonalityData.map((item) => (
                                <tr key={item.code} className={`group transition-all ${isDarkMode ? 'hover:bg-white/5 text-slate-300' : 'hover:bg-slate-50 text-slate-700'}`}>
                                    <td className="px-6 py-3 font-bold uppercase tracking-tighter opacity-80">{item.fullName}</td>
                                    {availableYears.map((year) => {
                                      const val = item[year.toString()];
                                      return (
                                        <td key={`${item.code}-${year}`} className="px-6 py-3 text-right font-mono font-medium tabular-nums">
                                          {formatByMetric(val)}
                                        </td>
                                      );
                                    })}
                                </tr>
                            ))}
                            {/* Linha de Totais/Médias Anuais */}
                            <tr className={`font-black ${isDarkMode ? 'bg-white/5 text-white' : 'bg-slate-100 text-slate-900'}`}>
                                <td className="px-6 py-4 uppercase tracking-widest">Resumo Anual</td>
                                {availableYears.map((year) => {
                                  const yearValues = seasonalityData.map(d => d[year.toString()]).filter(v => v !== null);
                                  const summary = metricMode === 'engagementRate' 
                                    ? (yearValues.reduce((a, b) => a + b, 0) / yearValues.length)
                                    : yearValues.reduce((a, b) => a + b, 0);
                                  return (
                                    <td key={`summary-${year}`} className="px-6 py-4 text-right font-mono">
                                      {formatByMetric(summary)}
                                    </td>
                                  );
                                })}
                            </tr>
                        </tbody>
                    </table>
                </div>
            </SectionWrapper>

            {/* AI Analysis Section (Seasonality) - MOVED TO BOTTOM */}
            <section className={`rounded-xl shadow-lg p-6 md:p-8 text-white transition-all
                    ${isDarkMode ? 'bg-gradient-to-br from-cyan-950 to-slate-900 border border-slate-800 shadow-neon-blue' : 'bg-gradient-to-br from-slate-900 to-slate-800'}`}>
                <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-cyan-500/20 text-cyan-300' : 'bg-white/10 text-brand-300'}`}>
                    <Users size={24} />
                </div>
                <h3 className="text-xl font-bold">Análise Automática de Tendência</h3>
                </div>
                <div className={`rounded-lg p-6 border ${isDarkMode ? 'bg-slate-950/50 border-cyan-500/20' : 'bg-white/5 border-white/10'}`}>
                <p className={`text-lg leading-relaxed whitespace-pre-line ${isDarkMode ? 'text-cyan-50 shadow-black drop-shadow-sm' : 'text-slate-200'}`}>
                    {analysisText}
                </p>
                </div>
            </section>
        </div>
        ) : (
            <>
                <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                    Comparativo Histórico: {monthNameMap[selectedMonth]} ({availableYears.join(' vs ')}) - {selectedNetwork === 'all' ? 'Geral' : selectedNetwork}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 print-break-inside">
                    <SectionWrapper
                        id="yoy-reach"
                        title="Alcance"
                        isDarkMode={isDarkMode}
                        comment={commentsMap['yoy-reach']}
                        onCommentChange={onCommentChange}
                        isCommentVisible={!!visibleComments['yoy-reach']}
                        onToggleComment={toggleVisibility}
                    >
                        <div className="h-[300px]">
                          <SimpleBarChart 
                              data={specificMonthData} 
                              xAxisKey="year" 
                              yAxisKey="reach" 
                              color={isDarkMode ? "#22d3ee" : "#0ea5e9"}
                              isDarkMode={isDarkMode} 
                          />
                        </div>
                    </SectionWrapper>

                    <SectionWrapper
                        id="yoy-interactions"
                        title="Interações"
                        isDarkMode={isDarkMode}
                        comment={commentsMap['yoy-interactions']}
                        onCommentChange={onCommentChange}
                        isCommentVisible={!!visibleComments['yoy-interactions']}
                        onToggleComment={toggleVisibility}
                    >
                        <div className="h-[300px]">
                          <SimpleBarChart 
                              data={specificMonthData} 
                              xAxisKey="year" 
                              yAxisKey="interactions" 
                              color={isDarkMode ? "#d946ef" : "#8b5cf6"}
                              isDarkMode={isDarkMode} 
                          />
                        </div>
                    </SectionWrapper>

                    <SectionWrapper
                        id="yoy-engagement"
                        title="Engajamento (%)"
                        isDarkMode={isDarkMode}
                        comment={commentsMap['yoy-engagement']}
                        onCommentChange={onCommentChange}
                        isCommentVisible={!!visibleComments['yoy-engagement']}
                        onToggleComment={toggleVisibility}
                    >
                        <div className="h-[300px]">
                          <SimpleBarChart 
                              data={specificMonthData} 
                              xAxisKey="year" 
                              yAxisKey="engagementRate" 
                              color={isDarkMode ? "#34d399" : "#10b981"}
                              unit="%"
                              isDarkMode={isDarkMode} 
                          />
                        </div>
                    </SectionWrapper>

                    <SectionWrapper
                        id="yoy-followers"
                        title="Novos Seguidores"
                        isDarkMode={isDarkMode}
                        comment={commentsMap['yoy-followers']}
                        onCommentChange={onCommentChange}
                        isCommentVisible={!!visibleComments['yoy-followers']}
                        onToggleComment={toggleVisibility}
                    >
                        <div className="h-[300px]">
                          <SimpleBarChart 
                              data={specificMonthData} 
                              xAxisKey="year" 
                              yAxisKey="followers" 
                              color={isDarkMode ? "#fbbf24" : "#f59e0b"}
                              name="Novos Seg."
                              isDarkMode={isDarkMode} 
                          />
                        </div>
                    </SectionWrapper>
                </div>

                {/* Growth Table */}
                <div className={`overflow-hidden rounded-xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                    <table className="w-full text-sm">
                        <thead className={isDarkMode ? 'bg-slate-950 text-slate-400' : 'bg-slate-50 text-slate-500'}>
                            <tr>
                                <th className="px-6 py-3 text-left">Ano</th>
                                <th className="px-6 py-3 text-right">Alcance</th>
                                <th className="px-6 py-3 text-right">Interações</th>
                                <th className="px-6 py-3 text-right">Novos Seg.</th>
                                <th className="px-6 py-3 text-right">Engajamento</th>
                            </tr>
                        </thead>
                        <tbody className={`divide-y ${isDarkMode ? 'divide-slate-800' : 'divide-slate-200'}`}>
                            {specificMonthData.map((d, i) => (
                                <tr key={d.year} className={isDarkMode ? 'text-slate-200' : 'text-slate-800'}>
                                    <td className="px-6 py-3 font-bold">{d.year}</td>
                                    <td className="px-6 py-3 text-right">{formatNumber(d.reach)}</td>
                                    <td className="px-6 py-3 text-right">{formatNumber(d.interactions)}</td>
                                    <td className="px-6 py-3 text-right">{formatNumber(d.followers)}</td>
                                    <td className={`px-6 py-3 text-right font-bold ${d.engagementRate >= 20 ? (isDarkMode ? 'text-neon-green' : 'text-emerald-600') : ''}`}>
                                        {formatPercentage(d.engagementRate)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* AI Analysis Section (YoY) - MOVED TO BOTTOM */}
                <section className={`rounded-xl shadow-lg p-6 md:p-8 text-white transition-all
                    ${isDarkMode ? 'bg-gradient-to-br from-cyan-950 to-slate-900 border border-slate-800 shadow-neon-blue' : 'bg-gradient-to-br from-slate-900 to-slate-800'}`}>
                    <div className="flex items-center gap-3 mb-4">
                    <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-cyan-500/20 text-cyan-300' : 'bg-white/10 text-brand-300'}`}>
                        <Users size={24} />
                    </div>
                    <h3 className="text-xl font-bold">Análise Automática YoY ({monthNameMap[selectedMonth]})</h3>
                    </div>
                    <div className={`rounded-lg p-6 border ${isDarkMode ? 'bg-slate-950/50 border-cyan-500/20' : 'bg-white/5 border-white/10'}`}>
                    <p className={`text-lg leading-relaxed whitespace-pre-line ${isDarkMode ? 'text-cyan-50 shadow-black drop-shadow-sm' : 'text-slate-200'}`}>
                        {analysisText}
                    </p>
                    </div>
                </section>
            </>
        )}
    </div>
  );
};

export default YoYAnalysis;
