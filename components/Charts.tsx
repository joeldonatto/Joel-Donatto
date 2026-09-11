
import React, { useMemo } from 'react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  BarChart, Bar, Cell, LineChart, LabelList, ComposedChart, ReferenceLine, Line, PieChart, Pie
} from 'recharts';

interface ChartProps {
  data: any[];
  isDarkMode?: boolean;
  theme?: 'light' | 'neon' | 'cyber' | 'infinity';
  showLabels?: boolean;
}

const monthAbbrMap: Record<string, string> = {
  "01": "Jan", "02": "Fev", "03": "Mar", "04": "Abr", "05": "Mai", "06": "Jun",
  "07": "Jul", "08": "Ago", "09": "Set", "10": "Out", "11": "Nov", "12": "Dez"
};

const formatXAxisDate = (val: any) => {
  if (val === 'Média') return 'Média';
  if (typeof val === 'string' && val.includes('-')) {
    const [year, month] = val.split('-');
    return `${monthAbbrMap[month] || month}/${year.slice(2)}`;
  }
  return val;
};

const CustomTooltip = ({ active, payload, label, isDarkMode, theme }: any) => {
  if (active && payload && payload.length) {
    const isInfinity = theme === 'infinity';
    const formattedLabel = formatXAxisDate(label);
    return (
      <div className={`p-4 rounded-xl border backdrop-blur-xl shadow-2xl z-[100] ${isInfinity ? 'bg-black/80 border-violet-500/50 text-white' : isDarkMode ? 'bg-slate-900 border-slate-700 text-slate-200' : 'bg-white border-slate-200 text-slate-800'}`}>
        <p className="font-black mb-2 border-b border-white/10 pb-1 uppercase tracking-widest text-[11px]">{formattedLabel || payload[0].payload?.year || label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-3 text-[12px] mb-1">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color || entry.stroke || entry.payload?.fill }}></span>
            <span className="opacity-75">{entry.name}:</span>
            <span className="font-bold">
              {typeof entry.value === 'number' ? entry.value.toLocaleString('pt-BR', { maximumFractionDigits: 2 }) : entry.value}
              {entry.name.toLowerCase().includes('taxa') || entry.name.toLowerCase().includes('engajamento') ? '%' : ''}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export const EngagementFocusChart: React.FC<ChartProps> = ({ data, isDarkMode, theme }) => {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];
    const avg = data.reduce((acc, curr) => acc + (curr.total?.engagementRate || 0), 0) / data.length;
    return [...data, { id: 'Média', monthName: 'Média', total: { engagementRate: avg }, isAverage: true }];
  }, [data]);
  
  const barColor = isDarkMode ? "#10b981" : "#059669";
  const labelColor = isDarkMode ? '#f8fafc' : '#1e293b';

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={chartData} margin={{ top: 35, right: 35, left: 10, bottom: 15 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? "rgba(255,255,255,0.05)" : "#e2e8f0"} />
        <XAxis dataKey="id" tick={{fontSize: 11, fill: isDarkMode ? '#94a3b8' : '#64748b', fontWeight: 600}} tickFormatter={formatXAxisDate} />
        <YAxis tick={{fontSize: 11, fill: isDarkMode ? '#94a3b8' : '#64748b', fontWeight: 600}} unit="%" axisLine={false} tickLine={false} />
        <Tooltip content={<CustomTooltip isDarkMode={isDarkMode} theme={theme} />} />
        <ReferenceLine y={20} stroke="#f43f5e" strokeDasharray="5 5" label={{ position: 'right', value: 'META 20%', fill: '#f43f5e', fontSize: 11, fontWeight: 'bold' }} />
        <Bar 
          dataKey="total.engagementRate" 
          name="Engajamento" 
          radius={[6, 6, 0, 0]}
          animationDuration={1200}
        >
          {chartData.map((e: any, i: number) => <Cell key={i} fill={e.isAverage ? "#0ea5e9" : barColor} />)}
          <LabelList dataKey="total.engagementRate" position="top" formatter={(v:any) => `${v.toFixed(1)}%`} style={{ fontSize: '11px', fontWeight: '900', fill: labelColor }} />
        </Bar>
        <Line 
          type="monotone" 
          dataKey="total.engagementRate" 
          stroke="#f59e0b" 
          strokeWidth={3} 
          dot={{ r: 5, fill: '#f59e0b' }} 
          activeDot={{ r: 8, strokeWidth: 0, fill: '#fff' }}
          animationDuration={1500}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
};

export const OverviewChart: React.FC<ChartProps> = ({ data, isDarkMode, theme }) => (
  <ResponsiveContainer width="100%" height="100%">
    <AreaChart data={data} margin={{ top: 20, right: 20, left: 10, bottom: 10 }}>
      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? "rgba(255,255,255,0.05)" : "#e2e8f0"} />
      <XAxis dataKey="id" tick={{fontSize: 11, fill: isDarkMode ? '#94a3b8' : '#64748b', fontWeight: 600}} tickFormatter={formatXAxisDate} />
      <YAxis tick={{fontSize: 11, fill: isDarkMode ? '#94a3b8' : '#64748b', fontWeight: 600}} width={80} axisLine={false} tickLine={false} />
      <Tooltip content={<CustomTooltip isDarkMode={isDarkMode} theme={theme} />} />
      <Legend verticalAlign="top" height={45} iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 'bold', color: isDarkMode ? '#fff' : '#1e293b' }} />
      <Area 
        type="monotone" 
        name="Alcance" 
        dataKey="total.reach" 
        stroke="#0ea5e9" 
        fillOpacity={0.2} 
        fill="#0ea5e9" 
        strokeWidth={3} 
        activeDot={{ r: 7, strokeWidth: 0, fill: '#fff' }}
        animationDuration={1500}
      />
      <Area 
        type="monotone" 
        name="Interações" 
        dataKey="total.interactions" 
        stroke="#d946ef" 
        fillOpacity={0.2} 
        fill="#d946ef" 
        strokeWidth={3} 
        activeDot={{ r: 7, strokeWidth: 0, fill: '#fff' }}
        animationDuration={1500}
      />
    </AreaChart>
  </ResponsiveContainer>
);

export const SimpleBarChart = ({ data, xAxisKey, yAxisKey, color, isDarkMode, theme, unit, name }: any) => {
  const labelColor = isDarkMode ? '#f8fafc' : '#1e293b';
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 25, right: 25, left: 10, bottom: 15 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? "rgba(255,255,255,0.05)" : "#eee"} />
        <XAxis dataKey={xAxisKey} tick={{fontSize: 11, fill: isDarkMode ? '#94a3b8' : '#64748b', fontWeight: 'bold'}} tickFormatter={formatXAxisDate} />
        <YAxis unit={unit} tick={{fontSize: 11, fill: isDarkMode ? '#94a3b8' : '#64748b'}} axisLine={false} tickLine={false} width={80} />
        <Tooltip content={<CustomTooltip isDarkMode={isDarkMode} theme={theme} />} />
        <Bar 
          dataKey={yAxisKey} 
          name={name || yAxisKey} 
          fill={color} 
          radius={[6, 6, 0, 0]}
          animationDuration={1000}
        >
          <LabelList dataKey={yAxisKey} position="top" formatter={(v:any) => typeof v === 'number' ? v.toLocaleString('pt-BR') : v} style={{fontSize: 11, fontWeight: 'bold', fill: labelColor}} />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export const SimplePieChart = ({ data, dataKey, nameKey, isDarkMode, theme, title, unit = "" }: any) => {
  const COLORS = ['#00f2ff', '#d946ef', '#10b981', '#f43f5e', '#f59e0b', '#ec4899'];
  const labelColor = isDarkMode ? '#cbd5e1' : '#475569';
  return (
    <div className="w-full h-full flex flex-col items-center">
      {title && <h4 className={`text-[11px] font-black uppercase tracking-widest mb-3 ${isDarkMode ? 'text-white/80' : 'text-slate-500'}`}>{title}</h4>}
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%" cy="50%"
            innerRadius="35%" outerRadius="70%"
            paddingAngle={5}
            dataKey={dataKey}
            nameKey={nameKey || "name"}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            className="text-[11px] font-bold"
            labelLine={{ stroke: labelColor }}
            animationDuration={1500}
            animationBegin={0}
          >
            {data.map((e: any, i: number) => <Cell key={i} fill={COLORS[i % COLORS.length]} stroke={isDarkMode ? 'rgba(0,0,0,0.5)' : '#fff'} />)}
          </Pie>
          <Tooltip content={<CustomTooltip isDarkMode={isDarkMode} theme={theme} />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export const PostTypeDistributionChart: React.FC<ChartProps> = ({ data, isDarkMode, theme }) => {
  const aggregated = useMemo(() => {
    const counts: any = {};
    data.forEach(p => counts[p.type] = (counts[p.type] || 0) + 1);
    return Object.entries(counts).map(([name, value]) => ({ name, value })).sort((a:any, b:any) => b.value - a.value);
  }, [data]);
  return <SimplePieChart data={aggregated} dataKey="value" isDarkMode={isDarkMode} theme={theme} />;
};

export const PostTypePerformanceChart: React.FC<{ data: any[], metric?: string, isDarkMode?: boolean, theme?: string }> = ({ data, metric = 'engagement', isDarkMode, theme }) => {
  const aggregated = useMemo(() => {
    if (!data || data.length === 0) return [];
    const stats: any = {};
    data.forEach(p => {
      const type = p.type || "Outros";
      if (!stats[type]) stats[type] = { sum: 0, count: 0 };
      const val = Number(p[metric]) || 0;
      stats[type].sum += val;
      stats[type].count++;
    });
    return Object.entries(stats)
      .map(([name, s]: any) => ({ name, avg: s.sum / s.count }))
      .sort((a:any, b:any) => b.avg - a.avg);
  }, [data, metric]);

  const barColor = isDarkMode ? "#10b981" : "#059669";
  const labelColor = isDarkMode ? '#f8fafc' : '#1e293b';
  
  if (aggregated.length === 0) {
    return <div className="w-full h-full flex items-center justify-center opacity-30 text-xs uppercase font-black">Sem Dados</div>;
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={aggregated} layout="vertical" margin={{ left: 20, right: 60, top: 15, bottom: 15 }}>
        <XAxis type="number" hide />
        <YAxis 
          dataKey="name" 
          type="category" 
          width={110} 
          tick={{fontSize: 11, fontWeight: 'bold', fill: isDarkMode ? '#cbd5e1' : '#475569'}} 
          axisLine={false} 
          tickLine={false} 
        />
        <Tooltip content={<CustomTooltip isDarkMode={isDarkMode} theme={theme} />} />
        <Bar 
          dataKey="avg" 
          fill={barColor} 
          radius={[0, 6, 6, 0]}
          animationDuration={1200}
        >
          <LabelList 
            dataKey="avg" 
            position="right" 
            formatter={(v:any) => `${v.toFixed(1)}${metric === 'engagement' ? '%' : ''}`} 
            style={{fontSize: 11, fontWeight: '900', fill: labelColor}} 
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export const MultiLineChart = ({ data, lines, isDarkMode, theme }: any) => {
  const labelColor = isDarkMode ? '#f1f5f9' : '#334155';
  
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 40, right: 40, left: 15, bottom: 15 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? "rgba(255,255,255,0.05)" : "#eee"} />
        <XAxis dataKey="name" tick={{fontSize: 11, fill: isDarkMode ? '#94a3b8' : '#475569', fontWeight: 'bold'}} />
        <YAxis tick={{fontSize: 11, fill: isDarkMode ? '#94a3b8' : '#475569', fontWeight: 'bold'}} width={80} axisLine={false} tickLine={false} />
        <Tooltip content={<CustomTooltip isDarkMode={isDarkMode} theme={theme} />} />
        <Legend iconType="rect" wrapperStyle={{ fontWeight: 'bold', fontSize: '13px', paddingTop: '15px', color: isDarkMode ? '#fff' : '#1e293b' }} />
        {lines.map((l: any) => (
          <Line 
            key={l.key} 
            type="monotone" 
            name={l.name} 
            dataKey={l.key} 
            stroke={l.color} 
            strokeWidth={4} 
            dot={{ r: 6 }} 
            activeDot={{ r: 10, strokeWidth: 0, fill: '#fff' }} 
            animationDuration={1500}
          >
            <LabelList 
              dataKey={l.key} 
              position="top" 
              offset={10}
              formatter={(v: any) => {
                if (v === null || v === undefined) return '';
                // Se o valor for pequeno (provavelmente engajamento %), mostramos uma casa decimal
                if (v < 100 && v > 0) return `${v.toFixed(1)}`;
                // Caso contrário (alcance/interações), formatamos com separador de milhar
                return v >= 1000 ? (v / 1000).toFixed(1) + 'k' : v.toString();
              }}
              style={{ fontSize: '10px', fontWeight: '900', fill: labelColor }}
            />
          </Line>
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};

export const NetworkStackedChart = ({ data, keys, isDarkMode, theme }: any) => {
  const COLORS = ['#00f2ff', '#8b5cf6', '#10b981'];
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 20, right: 20, left: 10, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? "rgba(255,255,255,0.05)" : "#eee"} />
        <XAxis dataKey="year" tick={{fontSize: 11, fill: isDarkMode ? '#94a3b8' : '#475569', fontWeight: 'bold'}} />
        <YAxis tick={{fontSize: 11, fill: isDarkMode ? '#94a3b8' : '#475569', fontWeight: 'bold'}} width={90} axisLine={false} tickLine={false} />
        <Tooltip content={<CustomTooltip isDarkMode={isDarkMode} theme={theme} />} />
        <Legend iconType="square" wrapperStyle={{ fontSize: '12px', fontWeight: 'bold', paddingTop: '15px', color: isDarkMode ? '#fff' : '#1e293b' }} />
        {keys.map((k: string, i: number) => (
          <Bar 
            key={k} 
            dataKey={k} 
            stackId="a" 
            fill={COLORS[i % COLORS.length]} 
            name={k.split('.')[0].toUpperCase()} 
            animationDuration={1500}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
};

export const NetworkEngagementComparisonChart = ({ data, isDarkMode, theme }: any) => (
  <ResponsiveContainer width="100%" height="100%">
    <LineChart data={data} margin={{ top: 25, right: 35, left: 15, bottom: 15 }}>
      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? "rgba(255,255,255,0.05)" : "#eee"} />
      <XAxis dataKey="year" tick={{fontSize: 11, fill: isDarkMode ? '#94a3b8' : '#475569', fontWeight: 'bold'}} />
      <YAxis unit="%" tick={{fontSize: 11, fill: isDarkMode ? '#94a3b8' : '#475569', fontWeight: 'bold'}} width={90} axisLine={false} tickLine={false} />
      <Tooltip content={<CustomTooltip isDarkMode={isDarkMode} theme={theme} />} />
      <Legend iconType="circle" wrapperStyle={{ fontWeight: 'bold', fontSize: '13px', paddingTop: '15px', color: isDarkMode ? '#fff' : '#1e293b' }} />
      <Line type="monotone" name="Instagram" dataKey="instagram.engagementRate" stroke="#00f2ff" strokeWidth={4} dot={{r: 6}} activeDot={{r: 9, fill: '#fff'}} animationDuration={1500} />
      <Line type="monotone" name="Facebook" dataKey="facebook.engagementRate" stroke="#8b5cf6" strokeWidth={4} dot={{r: 6}} activeDot={{r: 9, fill: '#fff'}} animationDuration={1500} />
      <Line type="monotone" name="LinkedIn" dataKey="linkedin.engagementRate" stroke="#10b981" strokeWidth={4} dot={{r: 6}} activeDot={{r: 9, fill: '#fff'}} animationDuration={1500} />
    </LineChart>
  </ResponsiveContainer>
);

export const MetricEvolutionChart = ({ data, dataKey, name, color, isDarkMode, theme }: any) => (
  <ResponsiveContainer width="100%" height="100%">
    <AreaChart data={data} margin={{ top: 20, right: 20, left: 10, bottom: 20 }}>
      <defs>
        <linearGradient id={`grad-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor={color} stopOpacity={0.4}/>
          <stop offset="95%" stopColor={color} stopOpacity={0}/>
        </linearGradient>
      </defs>
      <XAxis dataKey="id" hide />
      <YAxis width={80} tick={{fontSize: 11, fill: isDarkMode ? '#94a3b8' : '#475569', fontWeight: 'bold'}} axisLine={false} tickLine={false} />
      <Tooltip content={<CustomTooltip isDarkMode={isDarkMode} theme={theme} />} />
      <Area 
        type="monotone" 
        name={name} 
        dataKey={dataKey} 
        stroke={color} 
        strokeWidth={3} 
        fill={`url(#grad-${dataKey})`} 
        activeDot={{r: 8, fill: '#fff', strokeWidth: 0}}
        animationDuration={2000}
      />
    </AreaChart>
  </ResponsiveContainer>
);

export const SimpleAreaChart = ({ data, xAxisKey, yAxisKey, color, isDarkMode, theme, unit, name }: any) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 25, right: 25, left: 10, bottom: 15 }}>
        <defs>
          <linearGradient id={`grad-${yAxisKey}-${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
            <stop offset="95%" stopColor={color} stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? "rgba(255,255,255,0.05)" : "#eee"} />
        <XAxis dataKey={xAxisKey} tick={{fontSize: 11, fill: isDarkMode ? '#94a3b8' : '#64748b', fontWeight: 'bold'}} tickFormatter={formatXAxisDate} />
        <YAxis unit={unit} tick={{fontSize: 11, fill: isDarkMode ? '#94a3b8' : '#64748b'}} axisLine={false} tickLine={false} width={80} />
        <Tooltip content={<CustomTooltip isDarkMode={isDarkMode} theme={theme} />} />
        <Area 
          type="monotone" 
          dataKey={yAxisKey} 
          name={name || yAxisKey} 
          stroke={color} 
          strokeWidth={3}
          fill={`url(#grad-${yAxisKey}-${color.replace('#','')})`}
          activeDot={{ r: 6, strokeWidth: 0, fill: '#fff' }}
          animationDuration={1500}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};
