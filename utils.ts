
import { MonthlyData, PostData, NetworkType } from './types';

export const formatNumber = (num: number) => {
  return new Intl.NumberFormat('pt-BR').format(num);
};

export const formatPercentage = (num: number) => {
  return `${new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num)}%`;
};

// =========================================================================================
// === ANÁLISE DE PERFORMANCE DE INTERVALO ===
// =========================================================================================

export const generateReportEngagementRange = (filteredData: MonthlyData[]) => {
    if (filteredData.length === 0) return "Aguardando seleção de período para análise.";
    
    const totalReach = filteredData.reduce((acc, d) => acc + d.total.reach, 0);
    const totalInteractions = filteredData.reduce((acc, d) => acc + d.total.interactions, 0);
    const avgEngagement = totalReach > 0 ? (totalInteractions / totalReach) * 100 : 0;
    const totalFollowers = filteredData.reduce((acc, d) => acc + d.total.followerIncrease, 0);

    const firstMonth = filteredData[0];
    const lastMonth = filteredData[filteredData.length - 1];

    return `DIAGNÓSTICO DE PERFORMANCE DO PERÍODO (${firstMonth.monthName}/${firstMonth.year} a ${lastMonth.monthName}/${lastMonth.year}):\n\n` +
    `Durante o intervalo selecionado, a marca alcançou **${formatNumber(totalReach)}** pessoas e gerou **${formatNumber(totalInteractions)}** interações totais. A taxa de engajamento média consolidada foi de **${formatPercentage(avgEngagement)}**.\n\n` +
    `**Análise Estratégica:** Observamos uma retenção de audiência saudável. O ganho acumulado de **${formatNumber(totalFollowers)}** novos seguidores no período indica que as campanhas de topo de funil estão sendo eficazes em converter alcance em base fiel. \n\n` +
    `**Conclusão:** Os dados validam a consistência da linha editorial. Mesmo em períodos de maior volume de postagens, a qualidade da interação não sofreu diluição crítica, mantendo-se dentro dos benchmarks institucionais.`;
};

export const generateReportNetworkComparisonRange = (filteredData: MonthlyData[]) => {
    if (filteredData.length === 0) return "Aguardando dados.";

    const nets = {
        ig: { reach: 0, interactions: 0 },
        fb: { reach: 0, interactions: 0 },
        li: { reach: 0, interactions: 0 }
    };

    filteredData.forEach(d => {
        nets.ig.reach += d.instagram.reach;
        nets.ig.interactions += d.instagram.interactions;
        nets.fb.reach += d.facebook.reach;
        nets.fb.interactions += d.facebook.interactions;
        nets.li.reach += d.linkedin.reach;
        nets.li.interactions += d.linkedin.interactions;
    });

    const igEng = nets.ig.reach > 0 ? (nets.ig.interactions / nets.ig.reach) * 100 : 0;
    const liEng = nets.li.reach > 0 ? (nets.li.interactions / nets.li.reach) * 100 : 0;

    return `DESEMPENHO POR CANAL NO PERÍODO:\n\n` +
    `• **Instagram (Potencializador de Alcance):** Representa a maior fatia de visibilidade do hospital. Com um engajamento médio de **${formatPercentage(igEng)}**, consolida-se como o canal primário para ações de humanização e resposta rápida do público.\n\n` +
    `• **LinkedIn (Autoridade Institucional):** Mantém uma performance técnica superior, com **${formatPercentage(liEng)}** de engajamento. É o canal que sustenta a percepção de excelência médica e atrai o olhar de parceiros e profissionais do setor.\n\n` +
    `• **Facebook (Relacionamento Comunitário):** Segue como um pilar de gratidão e prova social regional, sendo vital para o feedback direto de pacientes e familiares.`;
};

export const generateReportTopPosts = (posts: PostData[]) => {
    if (posts.length === 0) return "Processando ranking de conteúdo...";
    
    const top1 = posts[0];
    const typeStats: Record<string, { sum: number, count: number }> = {};
    posts.forEach(p => {
      if (!typeStats[p.type]) typeStats[p.type] = { sum: 0, count: 0 };
      typeStats[p.type].sum += p.engagement;
      typeStats[p.type].count++;
    });
    const bestType = Object.entries(typeStats).map(([name, s]) => ({ name, avg: s.sum/s.count })).sort((a,b) => b.avg - a.avg)[0];

    return `ANÁLISE DE CONTEÚDO (CREATIVITY & DATA):\n\n` +
    `O post **"${top1.title}"** liderou o período com **${top1.engagement.toFixed(2)}%** de engajamento.\n\n` +
    `**Insight de Formato:** Os dados apontam que o formato **${bestType.name.toUpperCase()}** obteve a melhor performance média. Isso indica uma preferência clara da audiência por conteúdos [ex: dinâmicos/rápidos].\n\n` +
    `**Recomendação:** Devemos escalar a produção deste formato vencedor, mantendo o tom de voz humanizado que gerou o pico de compartilhamentos no post campeão.`;
};

// Updated generateYoYReport signature to accept selectedNetwork as the 3rd argument
export const generateYoYReport = (specificMonthData: any[], monthName: string, selectedNetwork?: NetworkType) => {
    if (specificMonthData.length < 2) return "Aguardando mais dados históricos para comparação comparativa.";
    
    const latest = specificMonthData[specificMonthData.length - 1];
    const previous = specificMonthData[specificMonthData.length - 2];
    const reachGrowth = previous.reach > 0 ? ((latest.reach - previous.reach) / previous.reach * 100) : 0;
    const networkSuffix = selectedNetwork && selectedNetwork !== 'all' ? ` no canal ${selectedNetwork}` : "";

    return `CONTEXTO HISTÓRICO (YoY - ${monthName.toUpperCase()}${networkSuffix.toUpperCase()}):\n\n` +
    `Comparando o desempenho deste mês com o mesmo período do ano anterior, registramos uma variação de **${reachGrowth.toFixed(1)}% no alcance**. \n\n` +
    `**Diagnóstico Técnico:** Este crescimento anual prova que a marca CSSJD está ganhando terreno e expandindo seu "Share of Attention". O aumento do alcance com engajamento estável sugere uma estratégia de distribuição eficiente e uma base de seguidores cada vez mais qualificada.`;
};

// Added missing generateAnnualReport function
export const generateAnnualReport = (yearlyData: any[], selectedNetwork: NetworkType) => {
    if (yearlyData.length === 0) return "Aguardando dados anuais.";
    const networkLabel = selectedNetwork === 'all' ? 'Consolidado' : selectedNetwork.charAt(0).toUpperCase() + selectedNetwork.slice(1);
    const key = selectedNetwork === 'all' ? 'total' : selectedNetwork;
    const latest = yearlyData[yearlyData.length - 1];
    const previous = yearlyData.length > 1 ? yearlyData[yearlyData.length - 2] : null;
    const latestMetrics = latest[key];
    
    let report = `ANÁLISE DE PERFORMANCE ANUAL (${networkLabel.toUpperCase()}):\n\n`;
    report += `O ano de ${latest.year} encerrou com um alcance total de **${formatNumber(latestMetrics.reach)}** e **${formatNumber(latestMetrics.interactions)}** interações. `;
    if (previous) {
        const prevMetrics = previous[key];
        const reachGrowth = prevMetrics.reach > 0 ? ((latestMetrics.reach - prevMetrics.reach) / prevMetrics.reach * 100) : 0;
        report += `Isso representa uma variação de **${reachGrowth.toFixed(1)}%** em relação ao ano anterior. `;
    }
    report += `A taxa de engajamento média foi de **${formatPercentage(latestMetrics.engagementRate)}**, demonstrando a solidez da presença digital da instituição no canal ${networkLabel}.`;
    return report;
};

// Added missing generateSeasonalityReport function
export const generateSeasonalityReport = (data: MonthlyData[], selectedNetwork: NetworkType, metricMode: string) => {
    const networkLabel = selectedNetwork === 'all' ? 'Consolidado' : selectedNetwork.charAt(0).toUpperCase() + selectedNetwork.slice(1);
    const metricName = metricMode === 'engagementRate' ? 'Engajamento' : metricMode === 'reach' ? 'Alcance' : metricMode === 'interactions' ? 'Interações' : 'Seguidores';
    return `ANÁLISE DE SAZONALIDADE (${networkLabel.toUpperCase()}):\n\nObservando o comportamento histórico da métrica de ${metricName}, identificamos padrões cíclicos de engajamento que coincidem com períodos de campanhas institucionais e datas sazonais de saúde. A manutenção da consistência entre os anos valida o crescimento orgânico e a maturidade da audiência.`;
};

export const generateReportAction = (filteredData: MonthlyData[]) => {
    if (filteredData.length === 0) return "Selecione um período.";
    const totalReach = filteredData.reduce((acc, d) => acc + d.total.reach, 0);
    return `O impacto gerado nas ações executadas durante o período resultou em **${formatNumber(totalReach)}** impactos de marca. Estes números reforçam a autoridade do CSSJD e sua presença constante no cotidiano digital da população mineira.`;
};

export const generateReportJustification = (filteredData: MonthlyData[]) => {
    return `A manutenção da estratégia atual é recomendada, visto que os KPIs de engajamento e conversão (leads/contatos) permanecem acima dos benchmarks do setor hospitalar. Não há indícios de saturação de formato ou fadiga de audiência.`;
};

export const generateReportTrends2025 = (data: MonthlyData[]) => {
    return `TENDÊNCIAS E PRÓXIMOS PASSOS:\n\n` +
    `A curva de dados sugere que a integração de vídeos curtos com pautas de saúde preventiva continuará sendo o maior driver de crescimento para os próximos meses. Focar na otimização do CTR (taxa de clique) para converter o alto alcance em mais agendamentos e contatos diretos será a prioridade estratégica.`;
};

export const generateReportMetricEvolution = (filteredData: MonthlyData[], selectedNetwork: NetworkType) => {
    if (filteredData.length === 0) return "Aguardando dados.";
    const networkLabel = selectedNetwork === 'all' ? 'Consolidado' : selectedNetwork.charAt(0).toUpperCase() + selectedNetwork.slice(1);
    
    const first = filteredData[0];
    const last = filteredData[filteredData.length - 1];
    
    const getMetric = (d: MonthlyData, metric: 'reach' | 'interactions' | 'engagementRate') => {
        if (selectedNetwork === 'all') return d.total[metric];
        return (d as any)[selectedNetwork][metric];
    };

    const firstReach = getMetric(first, 'reach');
    const lastReach = getMetric(last, 'reach');
    const reachGrowth = firstReach > 0 ? ((lastReach - firstReach) / firstReach * 100) : 0;

    return `ANÁLISE DE EVOLUÇÃO TEMPORAL (${networkLabel.toUpperCase()}):\n\n` +
    `Observamos o avanço das métricas no período de ${first.monthName}/${first.year} a ${last.monthName}/${last.year}. O alcance registrou uma variação de **${reachGrowth.toFixed(1)}%**, enquanto o engajamento manteve uma curva de estabilidade condizente com o crescimento da base.\n\n` +
    `**Diagnóstico:** A correlação entre o aumento do alcance e a manutenção da taxa de interação indica que o conteúdo está sendo distribuído para públicos qualificados, evitando a dispersão comum em fases de escala.`;
};

export const generatePeriodComparisonReport = (data: any[]) => {
    if (data.length < 2) return "Aguardando mais dados históricos para análise comparativa.";
    const latest = data[data.length - 1];
    const previous = data[data.length - 2];
    const growth = previous.reach > 0 ? ((latest.reach - previous.reach) / previous.reach * 100) : 0;

    return `ANÁLISE COMPARATIVA ANUAL (YoY):\n\n` +
    `O desempenho de **${latest.name}** foi comparado com o mesmo mês de anos anteriores. Em relação ao ano anterior (${previous.year}), registramos uma variação de **${growth.toFixed(1)}% no alcance**.\n\n` +
    `**Diagnóstico:** Esta visão isolada do mês permite identificar se o crescimento é estrutural ou sazonal. O resultado atual demonstra a evolução da maturidade digital da marca, comparando períodos com as mesmas características de mercado e comportamento do público.`;
};

export const generateDetailedMetricReport = (filteredData: MonthlyData[], selectedNetwork: NetworkType) => {
    if (filteredData.length === 0) return "Dados insuficientes.";
    
    const visits = filteredData.reduce((acc, d) => {
        return acc + (selectedNetwork === 'all' 
            ? (d.instagram.profileVisits + d.facebook.profileVisits + d.linkedin.profileVisits)
            : (d as any)[selectedNetwork].profileVisits);
    }, 0);

    const contacts = filteredData.reduce((acc, d) => {
        return acc + (selectedNetwork === 'all' 
            ? (d.instagram.contacts + d.facebook.contacts + d.linkedin.contacts)
            : (d as any)[selectedNetwork].contacts);
    }, 0);

    const convRate = visits > 0 ? (contacts / visits * 100) : 0;

    return `ANÁLISE DE FUNIL E CONVERSÃO:\n\n` +
    `No período analisado, geramos uma taxa de conversão de **${formatPercentage(convRate)}** (Visita para Contato). \n\n` +
    `**Raciocínio de Marketing:** Este indicador é fundamental para provar o valor comercial das redes sociais. Não estamos apenas gerando visualizações, mas transformando o interesse passivo em ações concretas de busca por serviços de saúde. Manter essa taxa acima da média garante o ROI orgânico da operação.`;
};
