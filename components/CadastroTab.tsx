import React, { useState, useMemo, useRef } from 'react';
import * as XLSX from 'xlsx';
import { MonthlyData, PostData, NetworkMetrics, LinkedinMetrics } from '../types';
import { formatNumber, formatPercentage } from '../utils';
import { 
  Upload, 
  Download, 
  Database, 
  FileSpreadsheet, 
  PlusCircle, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  AlertCircle, 
  Copy, 
  Check, 
  RotateCcw, 
  Sparkles, 
  Instagram, 
  Facebook, 
  Linkedin, 
  Eye, 
  Users, 
  Activity, 
  Share2, 
  MousePointer, 
  PhoneCall, 
  FileCode, 
  Search, 
  ArrowRight,
  TrendingUp,
  HelpCircle,
  Cloud,
  RefreshCw,
  Lock,
  Unlock,
  ChevronLeft,
  ChevronRight,
  Calculator
} from 'lucide-react';

interface CadastroTabProps {
  monthlyData: MonthlyData[];
  postsData: PostData[];
  onSaveMonth: (month: MonthlyData) => void;
  onDeleteMonth: (id: string) => void;
  onImportMonths: (months: MonthlyData[], replaceAll?: boolean) => void;
  onAddPost: (post: PostData) => void;
  onDeletePost: (id: string) => void;
  onImportPosts: (posts: PostData[], replaceAll?: boolean) => void;
  onResetAllData: () => void;
  isDarkMode: boolean;
  theme: string;
  isSyncingWithFirestore?: boolean;
  onForceSyncFirestore?: () => void;
}

const MONTH_NAMES_MAP: Record<string, string> = {
  '01': 'Janeiro',
  '02': 'Fevereiro',
  '03': 'Março',
  '04': 'Abril',
  '05': 'Maio',
  '06': 'Junho',
  '07': 'Julho',
  '08': 'Agosto',
  '09': 'Setembro',
  '10': 'Outubro',
  '11': 'Novembro',
  '12': 'Dezembro'
};

const MONTH_INPUT_OPTIONS = [
  { value: '01', label: '01 - Janeiro' },
  { value: '02', label: '02 - Fevereiro' },
  { value: '03', label: '03 - Março' },
  { value: '04', label: '04 - Abril' },
  { value: '05', label: '05 - Maio' },
  { value: '06', label: '06 - Junho' },
  { value: '07', label: '07 - Julho' },
  { value: '08', label: '08 - Agosto' },
  { value: '09', label: '09 - Setembro' },
  { value: '10', label: '10 - Outubro' },
  { value: '11', label: '11 - Novembro' },
  { value: '12', label: '12 - Dezembro' }
];

export const CadastroTab: React.FC<CadastroTabProps> = ({
  monthlyData,
  postsData,
  onSaveMonth,
  onDeleteMonth,
  onImportMonths,
  onAddPost,
  onDeletePost,
  onImportPosts,
  onResetAllData,
  isDarkMode,
  theme,
  isSyncingWithFirestore,
  onForceSyncFirestore
}) => {
  // Navigation inside this tab - defaults to 'manual-month' (Cadastrar Mês Completo)
  const [subTab, setSubTab] = useState<'upload' | 'manual-month' | 'manual-post' | 'list' | 'database'>('manual-month');

  // Notification feedback banner
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);
  const showFeedback = (type: 'success' | 'error' | 'info', message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 5000);
  };

  // -------------------------------------------------------------
  // 1. FILE UPLOAD & PREVIEW STATE
  // -------------------------------------------------------------
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [parsedMonthsPreview, setParsedMonthsPreview] = useState<MonthlyData[] | null>(null);
  const [parsedPostsPreview, setParsedPostsPreview] = useState<PostData[] | null>(null);
  const [uploadFileName, setUploadFileName] = useState<string>('');
  const [uploadTarget, setUploadTarget] = useState<'months' | 'posts' | 'auto'>('auto');
  const [replaceExistingOnImport, setReplaceExistingOnImport] = useState(false);

  // -------------------------------------------------------------
  // 2. MANUAL MONTH FORM STATE
  // -------------------------------------------------------------
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [selectedMonthCode, setSelectedMonthCode] = useState<string>('05');
  const [isEditingExisting, setIsEditingExisting] = useState(false);
  const [isEditUnlocked, setIsEditUnlocked] = useState(false);

  // Instagram Form (defaults to 0 for unentered months)
  const [igReach, setIgReach] = useState<number>(0);
  const [igFollowers, setIgFollowers] = useState<number>(0);
  const [igViews, setIgViews] = useState<number>(0);
  const [igInteractions, setIgInteractions] = useState<number>(0);
  const [igVisits, setIgVisits] = useState<number>(0);
  const [igClicks, setIgClicks] = useState<number>(0);
  const [igContacts, setIgContacts] = useState<number>(0);

  // Facebook Form (defaults to 0 for unentered months)
  const [fbReach, setFbReach] = useState<number>(0);
  const [fbFollowers, setFbFollowers] = useState<number>(0);
  const [fbViews, setFbViews] = useState<number>(0);
  const [fbInteractions, setFbInteractions] = useState<number>(0);
  const [fbVisits, setFbVisits] = useState<number>(0);
  const [fbClicks, setFbClicks] = useState<number>(0);
  const [fbContacts, setFbContacts] = useState<number>(0);

  // LinkedIn Form (defaults to 0 for unentered months)
  const [liReach, setLiReach] = useState<number>(0);
  const [liFollowers, setLiFollowers] = useState<number>(0);
  const [liViews, setLiViews] = useState<number>(0);
  const [liInteractions, setLiInteractions] = useState<number>(0);
  const [liVisits, setLiVisits] = useState<number>(0);
  const [liClicks, setLiClicks] = useState<number>(0);
  const [liContacts, setLiContacts] = useState<number>(0);
  const [liReactions, setLiReactions] = useState<number>(0);
  const [liComments, setLiComments] = useState<number>(0);
  const [liShares, setLiShares] = useState<number>(0);

  // -------------------------------------------------------------
  // 3. MANUAL POST FORM STATE
  // -------------------------------------------------------------
  const [postTitle, setPostTitle] = useState('');
  const [postMonth, setPostMonth] = useState('maio/2026');
  const [postType, setPostType] = useState('Reels');
  const [postReach, setPostReach] = useState<number>(5000);
  const [postInteractions, setPostInteractions] = useState<number>(450);
  const [postLink, setPostLink] = useState('');

  // -------------------------------------------------------------
  // 4. LIST & SEARCH STATE
  // -------------------------------------------------------------
  const [searchTerm, setSearchTerm] = useState('');
  const [filterYear, setFilterYear] = useState<string>('all');
  const [copiedSql, setCopiedSql] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);

  // Available unique years in dataset
  const availableYears = useMemo(() => {
    const years = monthlyData.map(d => d.year);
    return Array.from(new Set(years)).sort((a: number, b: number) => b - a);
  }, [monthlyData]);

  // Live calculations for manual month entry - STRICTLY AUTOMATIC MATHEMATICAL FORMULAS
  const calculatedIgEng = useMemo(() => {
    return igReach > 0 ? parseFloat(((igInteractions / igReach) * 100).toFixed(2)) : 0;
  }, [igReach, igInteractions]);

  const calculatedFbEng = useMemo(() => {
    return fbReach > 0 ? parseFloat(((fbInteractions / fbReach) * 100).toFixed(2)) : 0;
  }, [fbReach, fbInteractions]);

  const calculatedLiEng = useMemo(() => {
    return liReach > 0 ? parseFloat(((liInteractions / liReach) * 100).toFixed(2)) : 0;
  }, [liReach, liInteractions]);

  const totalCalculated = useMemo(() => {
    const reach = igReach + fbReach + liReach;
    const interactions = igInteractions + fbInteractions + liInteractions;
    const followers = igFollowers + fbFollowers + liFollowers;
    const views = igViews + fbViews + liViews;
    const engagementRate = reach > 0 ? parseFloat(((interactions / reach) * 100).toFixed(2)) : 0;
    return { reach, interactions, followers, views, engagementRate };
  }, [igReach, fbReach, liReach, igInteractions, fbInteractions, liInteractions, igFollowers, fbFollowers, liFollowers, igViews, fbViews, liViews]);

  // Auto-load existing month data if user selects an existing year/month
  const loadMonthDataIntoForm = (year: number, monthCode: string) => {
    const existing = monthlyData.find(d => d.year === year && d.month === monthCode);
    setSelectedYear(year);
    setSelectedMonthCode(monthCode);
    if (existing) {
      setIsEditingExisting(true);
      setIsEditUnlocked(false); // Past / existing registered month starts in view/locked mode with explicit option to edit
      // Instagram
      setIgReach(existing.instagram.reach || 0);
      setIgFollowers(existing.instagram.followers || 0);
      setIgViews(existing.instagram.views || 0);
      setIgInteractions(existing.instagram.interactions || 0);
      setIgVisits(existing.instagram.profileVisits || 0);
      setIgClicks(existing.instagram.clicks || 0);
      setIgContacts(existing.instagram.contacts || 0);

      // Facebook
      setFbReach(existing.facebook.reach || 0);
      setFbFollowers(existing.facebook.followers || 0);
      setFbViews(existing.facebook.views || 0);
      setFbInteractions(existing.facebook.interactions || 0);
      setFbVisits(existing.facebook.profileVisits || 0);
      setFbClicks(existing.facebook.clicks || 0);
      setFbContacts(existing.facebook.contacts || 0);

      // LinkedIn
      setLiReach(existing.linkedin.reach || 0);
      setLiFollowers(existing.linkedin.followers || 0);
      setLiViews(existing.linkedin.views || 0);
      setLiInteractions(existing.linkedin.interactions || 0);
      setLiVisits(existing.linkedin.profileVisits || 0);
      setLiClicks(existing.linkedin.clicks || 0);
      setLiContacts(existing.linkedin.contacts || 0);
      setLiReactions(existing.linkedin.reactions || existing.linkedin.interactions || 0);
      setLiComments(existing.linkedin.comments || 0);
      setLiShares(existing.linkedin.shares || 0);
      showFeedback('info', `Mês ${existing.monthName}/${existing.year} já cadastrado. Clique em "Editar Valores" para alterar.`);
    } else {
      // Month not yet registered: reset all fields to 0 and unlocked for new input
      setIsEditingExisting(false);
      setIsEditUnlocked(true);
      // Instagram
      setIgReach(0);
      setIgFollowers(0);
      setIgViews(0);
      setIgInteractions(0);
      setIgVisits(0);
      setIgClicks(0);
      setIgContacts(0);
      // Facebook
      setFbReach(0);
      setFbFollowers(0);
      setFbViews(0);
      setFbInteractions(0);
      setFbVisits(0);
      setFbClicks(0);
      setFbContacts(0);
      // LinkedIn
      setLiReach(0);
      setLiFollowers(0);
      setLiViews(0);
      setLiInteractions(0);
      setLiVisits(0);
      setLiClicks(0);
      setLiContacts(0);
      setLiReactions(0);
      setLiComments(0);
      setLiShares(0);
    }
  };

  // Step month backwards (with auto-adjustment across year boundaries)
  const handlePrevMonth = () => {
    const currentM = parseInt(selectedMonthCode, 10);
    let newYear = selectedYear;
    let newM = currentM - 1;
    if (newM < 1) {
      newM = 12;
      newYear -= 1;
    }
    const newMonthCode = String(newM).padStart(2, '0');
    loadMonthDataIntoForm(newYear, newMonthCode);
  };

  // Step month forwards (with auto-adjustment across year boundaries)
  const handleNextMonth = () => {
    const currentM = parseInt(selectedMonthCode, 10);
    let newYear = selectedYear;
    let newM = currentM + 1;
    if (newM > 12) {
      newM = 1;
      newYear += 1;
    }
    const newMonthCode = String(newM).padStart(2, '0');
    loadMonthDataIntoForm(newYear, newMonthCode);
  };

  // Handle saving manual month
  const handleSaveMonthForm = (e: React.FormEvent) => {
    e.preventDefault();
    const id = `${selectedYear}-${selectedMonthCode}`;
    const monthName = MONTH_NAMES_MAP[selectedMonthCode] || 'Mês';

    // Build Instagram
    const instagram: NetworkMetrics = {
      reach: igReach,
      interactions: igInteractions,
      engagementRate: calculatedIgEng,
      followers: igFollowers,
      profileVisits: igVisits,
      clicks: igClicks,
      views: igViews,
      contacts: igContacts
    };

    // Build Facebook
    const facebook: NetworkMetrics = {
      reach: fbReach,
      interactions: fbInteractions,
      engagementRate: calculatedFbEng,
      followers: fbFollowers,
      profileVisits: fbVisits,
      clicks: fbClicks,
      views: fbViews,
      contacts: fbContacts
    };

    // Build LinkedIn
    const linkedin: LinkedinMetrics = {
      reach: liReach,
      interactions: liInteractions,
      engagementRate: calculatedLiEng,
      followers: liFollowers,
      profileVisits: liVisits,
      clicks: liClicks,
      views: liViews,
      contacts: liContacts,
      uniqueImpressions: liReach,
      reactions: liReactions,
      comments: liComments,
      shares: liShares
    };

    // Previous month comparison for follower increase percent
    const currentVal = parseInt(`${selectedYear}${selectedMonthCode}`);
    const sorted = [...monthlyData].sort((a, b) => parseInt(`${a.year}${a.month}`) - parseInt(`${b.year}${b.month}`));
    const prev = sorted.filter(d => parseInt(`${d.year}${d.month}`) < currentVal).pop();
    let followerIncreasePercent = 0;
    if (prev && prev.total.followerIncrease > 0) {
      followerIncreasePercent = Math.round(((totalCalculated.followers - prev.total.followerIncrease) / prev.total.followerIncrease) * 100);
    }

    const newMonthData: MonthlyData = {
      id,
      month: selectedMonthCode,
      year: selectedYear,
      monthName,
      instagram,
      facebook,
      linkedin,
      total: {
        followerIncrease: totalCalculated.followers,
        followerIncreasePercent,
        reach: totalCalculated.reach,
        interactions: totalCalculated.interactions,
        engagementRate: totalCalculated.engagementRate
      }
    };

    onSaveMonth(newMonthData);
    setIsEditingExisting(true);
    setIsEditUnlocked(false);
    showFeedback('success', `Mês ${monthName}/${selectedYear} salvo com sucesso no dashboard!`);
  };

  // Handle saving manual post
  const handleSavePostForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postTitle.trim()) {
      showFeedback('error', 'Por favor, informe o título da publicação.');
      return;
    }

    const calculatedEng = postReach > 0 ? parseFloat(((postInteractions / postReach) * 100).toFixed(2)) : 0;

    const newPost: PostData = {
      id: `post-${Date.now()}`,
      title: postTitle.trim(),
      month: postMonth.trim().toLowerCase(),
      type: postType.trim() || 'Reels',
      reach: postReach,
      interactions: postInteractions,
      engagement: calculatedEng,
      link: postLink.trim() || undefined
    };

    onAddPost(newPost);
    setPostTitle('');
    setPostLink('');
    showFeedback('success', `Publicação "${newPost.title}" cadastrada com sucesso!`);
  };

  // -------------------------------------------------------------
  // EXCEL / SPREADSHEET PARSING & TEMPLATE GENERATION
  // -------------------------------------------------------------
  const normalizeKey = (key: string) => {
    return key
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]/g, '_')
      .replace(/_+/g, '_')
      .trim();
  };

  const parseMonthString = (raw: any): { month: string; monthName: string } => {
    if (!raw) return { month: '01', monthName: 'Janeiro' };
    const str = String(raw).trim().toLowerCase();
    
    // Numeric cases
    const num = parseInt(str);
    if (!isNaN(num) && num >= 1 && num <= 12) {
      const code = num.toString().padStart(2, '0');
      return { month: code, monthName: MONTH_NAMES_MAP[code] || 'Mês' };
    }

    // Name cases
    if (str.includes('jan')) return { month: '01', monthName: 'Janeiro' };
    if (str.includes('fev') || str.includes('feb')) return { month: '02', monthName: 'Fevereiro' };
    if (str.includes('mar')) return { month: '03', monthName: 'Março' };
    if (str.includes('abr') || str.includes('apr')) return { month: '04', monthName: 'Abril' };
    if (str.includes('mai') || str.includes('may')) return { month: '05', monthName: 'Maio' };
    if (str.includes('jun')) return { month: '06', monthName: 'Junho' };
    if (str.includes('jul')) return { month: '07', monthName: 'Julho' };
    if (str.includes('ago') || str.includes('aug')) return { month: '08', monthName: 'Agosto' };
    if (str.includes('set') || str.includes('sep')) return { month: '09', monthName: 'Setembro' };
    if (str.includes('out') || str.includes('oct')) return { month: '10', monthName: 'Outubro' };
    if (str.includes('nov')) return { month: '11', monthName: 'Novembro' };
    if (str.includes('dez') || str.includes('dec')) return { month: '12', monthName: 'Dezembro' };

    return { month: '01', monthName: 'Janeiro' };
  };

  const handleFileUpload = (file: File) => {
    setUploadFileName(file.name);
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const buffer = e.target?.result;
        const workbook = XLSX.read(buffer, { type: 'binary' });

        const firstSheetName = workbook.SheetNames[0];
        const postsSheetName = workbook.SheetNames.find(s => s.toLowerCase().includes('post'));
        const monthsSheetName = workbook.SheetNames.find(s => s.toLowerCase().includes('metrica') || s.toLowerCase().includes('mensal') || s.toLowerCase().includes('rede'));

        let monthsToPreview: MonthlyData[] = [];
        let postsToPreview: PostData[] = [];

        // Check if there are posts
        const targetPostsSheet = postsSheetName || (uploadTarget === 'posts' ? firstSheetName : null);
        if (targetPostsSheet) {
          const rawPosts = XLSX.utils.sheet_to_json<Record<string, any>>(workbook.Sheets[targetPostsSheet]);
          postsToPreview = rawPosts.map((row, idx) => {
            const normalized: Record<string, any> = {};
            Object.entries(row).forEach(([k, v]) => {
              normalized[normalizeKey(k)] = v;
            });

            const title = normalized.titulo || normalized.title || normalized.post || `Post #${idx + 1}`;
            const month = String(normalized.mes || normalized.month || 'geral');
            const type = normalized.tipo || normalized.type || normalized.formato || 'Reels';
            const reach = Number(normalized.alcance || normalized.reach || 0);
            const interactions = Number(normalized.interacoes || normalized.interactions || 0);
            const rawEng = normalized.engajamento || normalized.engagement || normalized.engajamento_pct;
            const engagement = rawEng !== undefined ? Number(rawEng) : (reach > 0 ? Number(((interactions / reach) * 100).toFixed(2)) : 0);
            const link = normalized.link || normalized.url || undefined;

            return {
              id: `imported-post-${idx}-${Date.now()}`,
              title,
              month,
              type,
              reach,
              interactions,
              engagement,
              link
            };
          }).filter(p => p.reach > 0 || p.title);
        }

        // Check monthly metrics
        const targetMonthsSheet = monthsSheetName || (uploadTarget !== 'posts' ? firstSheetName : null);
        if (targetMonthsSheet) {
          const rawMonths = XLSX.utils.sheet_to_json<Record<string, any>>(workbook.Sheets[targetMonthsSheet]);
          monthsToPreview = rawMonths.map(row => {
            const n: Record<string, any> = {};
            Object.entries(row).forEach(([k, v]) => {
              n[normalizeKey(k)] = v;
            });

            const year = parseInt(n.ano || n.year || n.exercicio || '2026') || 2026;
            const { month, monthName } = parseMonthString(n.mes || n.month || n.periodo);
            const id = `${year}-${month}`;

            // Instagram values
            const igR = Number(n.instagram_alcance || n.insta_alcance || n.alcance_instagram || n.alcance_insta || 0);
            const igF = Number(n.instagram_seguidores || n.insta_seguidores || n.seguidores_instagram || n.alteracao_instagram || 0);
            const igV = Number(n.instagram_visualizacoes || n.insta_visualizacoes || n.visualizacoes_instagram || n.impressoes_instagram || 0);
            const igI = Number(n.instagram_interacoes || n.insta_interacoes || n.interacoes_instagram || 0);
            const igP = Number(n.instagram_visitas || n.insta_visitas || n.visitas_perfil_instagram || 0);
            const igC = Number(n.instagram_cliques || n.insta_cliques || n.cliques_instagram || 0);
            const igCt = Number(n.instagram_contatos || n.insta_contatos || n.contatos_instagram || 0);
            const igEng = n.instagram_engajamento !== undefined ? Number(n.instagram_engajamento) : (igR > 0 ? Number(((igI / igR) * 100).toFixed(2)) : 0);

            // Facebook values
            const fbR = Number(n.facebook_alcance || n.face_alcance || n.alcance_facebook || n.alcance_face || 0);
            const fbF = Number(n.facebook_seguidores || n.face_seguidores || n.seguidores_facebook || n.alteracao_facebook || 0);
            const fbV = Number(n.facebook_visualizacoes || n.face_visualizacoes || n.visualizacoes_facebook || 0);
            const fbI = Number(n.facebook_interacoes || n.face_interacoes || n.interacoes_facebook || 0);
            const fbP = Number(n.facebook_visitas || n.face_visitas || n.visitas_pagina_facebook || 0);
            const fbC = Number(n.facebook_cliques || n.face_cliques || n.cliques_facebook || 0);
            const fbCt = Number(n.facebook_contatos || n.face_contatos || n.contatos_facebook || 0);
            const fbEng = n.facebook_engajamento !== undefined ? Number(n.facebook_engajamento) : (fbR > 0 ? Number(((fbI / fbR) * 100).toFixed(2)) : 0);

            // LinkedIn values
            const liR = Number(n.linkedin_alcance || n.alcance_linkedin || n.linkedin_reach || 0);
            const liF = Number(n.linkedin_seguidores || n.seguidores_linkedin || n.linkedin_followers || 0);
            const liV = Number(n.linkedin_visualizacoes || n.visualizacoes_linkedin || n.linkedin_views || 0);
            const liI = Number(n.linkedin_interacoes || n.interacoes_linkedin || n.linkedin_interactions || 0);
            const liP = Number(n.linkedin_visitas || n.visitas_linkedin || n.linkedin_profile_visits || 0);
            const liC = Number(n.linkedin_cliques || n.cliques_linkedin || n.linkedin_clicks || 0);
            const liCt = Number(n.linkedin_contatos || n.contatos_linkedin || 0);
            const liRe = Number(n.linkedin_reacoes || n.reacoes_linkedin || liI);
            const liCm = Number(n.linkedin_comentarios || n.comentarios_linkedin || 0);
            const liSh = Number(n.linkedin_compartilhamentos || n.compartilhamentos_linkedin || 0);
            const liEng = n.linkedin_engajamento !== undefined ? Number(n.linkedin_engajamento) : (liR > 0 ? Number(((liI / liR) * 100).toFixed(2)) : 0);

            const totReach = igR + fbR + liR;
            const totInteractions = igI + fbI + liI;
            const totFollowers = igF + fbF + liF;
            const totEng = totReach > 0 ? Number(((totInteractions / totReach) * 100).toFixed(2)) : 0;

            const item: MonthlyData = {
              id,
              year,
              month,
              monthName,
              instagram: {
                reach: igR,
                followers: igF,
                views: igV,
                interactions: igI,
                profileVisits: igP,
                clicks: igC,
                contacts: igCt,
                engagementRate: igEng
              },
              facebook: {
                reach: fbR,
                followers: fbF,
                views: fbV,
                interactions: fbI,
                profileVisits: fbP,
                clicks: fbC,
                contacts: fbCt,
                engagementRate: fbEng
              },
              linkedin: {
                reach: liR,
                followers: liF,
                views: liV,
                interactions: liI,
                profileVisits: liP,
                clicks: liC,
                contacts: liCt,
                reactions: liRe,
                comments: liCm,
                shares: liSh,
                engagementRate: liEng,
                uniqueImpressions: liR
              },
              total: {
                reach: totReach,
                interactions: totInteractions,
                followerIncrease: totFollowers,
                followerIncreasePercent: 0,
                engagementRate: totEng
              }
            };
            return item;
          }).filter(m => m.total.reach > 0 || m.total.interactions > 0 || m.total.followerIncrease > 0);
        }

        if (monthsToPreview.length === 0 && postsToPreview.length === 0) {
          showFeedback('error', 'Não foi possível encontrar colunas compatíveis no arquivo. Baixe o modelo oficial para conferir o formato.');
          return;
        }

        setParsedMonthsPreview(monthsToPreview.length > 0 ? monthsToPreview : null);
        setParsedPostsPreview(postsToPreview.length > 0 ? postsToPreview : null);
        showFeedback('success', `Planilha lida com sucesso! ${monthsToPreview.length} meses e ${postsToPreview.length} posts identificados.`);
      } catch (err: any) {
        console.error('Error parsing spreadsheet:', err);
        showFeedback('error', `Erro ao processar arquivo: ${err?.message || 'Formato inválido'}`);
      }
    };

    reader.readAsBinaryString(file);
  };

  const confirmImport = () => {
    let count = 0;
    if (parsedMonthsPreview && parsedMonthsPreview.length > 0) {
      onImportMonths(parsedMonthsPreview, replaceExistingOnImport);
      count += parsedMonthsPreview.length;
    }
    if (parsedPostsPreview && parsedPostsPreview.length > 0) {
      onImportPosts(parsedPostsPreview, replaceExistingOnImport);
      count += parsedPostsPreview.length;
    }

    showFeedback('success', `Importação concluída com sucesso! ${count} registros integrados ao dashboard.`);
    setParsedMonthsPreview(null);
    setParsedPostsPreview(null);
    setUploadFileName('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Download official Excel template
  const handleDownloadTemplate = () => {
    const wb = XLSX.utils.book_new();

    // Sheet 1: Monthly metrics
    const monthlyHeaders = [
      [
        'Ano', 'Mes', 
        'Instagram_Alcance', 'Instagram_Seguidores', 'Instagram_Visualizacoes', 'Instagram_Interacoes', 'Instagram_Visitas_Perfil', 'Instagram_Cliques', 'Instagram_Contatos',
        'Facebook_Alcance', 'Facebook_Seguidores', 'Facebook_Visualizacoes', 'Facebook_Interacoes', 'Facebook_Visitas_Pagina', 'Facebook_Cliques', 'Facebook_Contatos',
        'Linkedin_Alcance', 'Linkedin_Seguidores', 'Linkedin_Visualizacoes', 'Linkedin_Interacoes', 'Linkedin_Visitas', 'Linkedin_Cliques', 'Linkedin_Contatos', 'Linkedin_Reacoes', 'Linkedin_Comentarios', 'Linkedin_Compartilhamentos'
      ],
      [
        2026, '05', 
        65000, 920, 980000, 11200, 8400, 120, 240,
        15500, 48, 58000, 560, 1450, 8, 12,
        6800, 95, 15200, 240, 910, 1200, 2, 210, 18, 12
      ],
      [
        2026, '06', 
        72000, 980, 1100000, 12400, 8900, 140, 260,
        16200, 52, 61000, 590, 1500, 10, 15,
        7100, 105, 16500, 260, 950, 1400, 3, 230, 20, 10
      ]
    ];
    const wsMonths = XLSX.utils.aoa_to_sheet(monthlyHeaders);
    XLSX.utils.book_append_sheet(wb, wsMonths, 'Metricas_Mensais');

    // Sheet 2: Posts Ranking
    const postsHeaders = [
      ['Titulo', 'Mes', 'Tipo', 'Alcance', 'Interacoes', 'Engajamento_Pct', 'Link'],
      ['Podcast Especial com Cirurgião Geral', 'julho/2026', 'Podcast', 5200, 410, 7.88, 'https://instagram.com/p/exemplo1'],
      ['Semana de Conscientização da Saúde do Coração', 'julho/2026', 'Reels', 8500, 720, 8.47, 'https://instagram.com/p/exemplo2'],
      ['Vagas de Enfermagem e Apoio Hospitalar', 'julho/2026', 'Vagas', 11000, 650, 5.91, 'https://linkedin.com/feed/exemplo3']
    ];
    const wsPosts = XLSX.utils.aoa_to_sheet(postsHeaders);
    XLSX.utils.book_append_sheet(wb, wsPosts, 'Ranking_Posts');

    XLSX.writeFile(wb, 'Modelo_Cadastro_Planilha_CSSJD.xlsx');
    showFeedback('success', 'Modelo oficial gerado e baixado! Preencha e suba nesta mesma aba.');
  };

  // Export current full database to Excel
  const handleExportFullExcel = () => {
    const wb = XLSX.utils.book_new();

    // Map monthly data
    const exportMonthsData = monthlyData.map(d => ({
      Ano: d.year,
      Mes: d.month,
      Mes_Nome: d.monthName,
      Total_Alcance: d.total.reach,
      Total_Interacoes: d.total.interactions,
      Total_Novos_Seguidores: d.total.followerIncrease,
      Total_Engajamento_Pct: d.total.engagementRate,
      Instagram_Alcance: d.instagram.reach,
      Instagram_Seguidores: d.instagram.followers,
      Instagram_Visualizacoes: d.instagram.views,
      Instagram_Interacoes: d.instagram.interactions,
      Instagram_Visitas_Perfil: d.instagram.profileVisits,
      Instagram_Cliques: d.instagram.clicks,
      Instagram_Contatos: d.instagram.contacts,
      Instagram_Engajamento_Pct: d.instagram.engagementRate,
      Facebook_Alcance: d.facebook.reach,
      Facebook_Seguidores: d.facebook.followers,
      Facebook_Visualizacoes: d.facebook.views,
      Facebook_Interacoes: d.facebook.interactions,
      Facebook_Visitas_Pagina: d.facebook.profileVisits,
      Facebook_Cliques: d.facebook.clicks,
      Facebook_Contatos: d.facebook.contacts,
      Facebook_Engajamento_Pct: d.facebook.engagementRate,
      Linkedin_Alcance: d.linkedin.reach,
      Linkedin_Seguidores: d.linkedin.followers,
      Linkedin_Visualizacoes: d.linkedin.views,
      Linkedin_Interacoes: d.linkedin.interactions,
      Linkedin_Visitas: d.linkedin.profileVisits,
      Linkedin_Cliques: d.linkedin.clicks,
      Linkedin_Contatos: d.linkedin.contacts,
      Linkedin_Reacoes: d.linkedin.reactions || 0,
      Linkedin_Comentarios: d.linkedin.comments || 0,
      Linkedin_Compartilhamentos: d.linkedin.shares || 0,
      Linkedin_Engajamento_Pct: d.linkedin.engagementRate
    }));
    const wsMonths = XLSX.utils.json_to_sheet(exportMonthsData);
    XLSX.utils.book_append_sheet(wb, wsMonths, 'Metricas_Mensais');

    // Map posts
    const exportPostsData = postsData.map(p => ({
      ID: p.id,
      Titulo: p.title,
      Mes: p.month,
      Tipo: p.type,
      Alcance: p.reach,
      Interacoes: p.interactions,
      Engajamento_Pct: p.engagement,
      Link: p.link || ''
    }));
    const wsPosts = XLSX.utils.json_to_sheet(exportPostsData);
    XLSX.utils.book_append_sheet(wb, wsPosts, 'Ranking_Posts');

    XLSX.writeFile(wb, `CSSJD_Dados_Completos_Export_${new Date().toISOString().slice(0, 10)}.xlsx`);
    showFeedback('success', 'Arquivo Excel com todos os dados exportado com sucesso!');
  };

  // Export JSON backup
  const handleExportJson = () => {
    const backup = {
      exportedAt: new Date().toISOString(),
      institution: 'CSSJD - Complexo de Saúde São João de Deus',
      monthlyMetricsCount: monthlyData.length,
      postsCount: postsData.length,
      monthlyMetrics: monthlyData,
      posts: postsData
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cssjd_social_database_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showFeedback('success', 'Backup JSON exportado com sucesso!');
  };

  // SQL Script generator for PostgreSQL / Supabase / MySQL
  const generatedSqlScript = useMemo(() => {
    return `-- ========================================================
-- COMPLEXO DE SAÚDE SÃO JOÃO DE DEUS (CSSJD)
-- DDL & SEEDING PARA BANCO DE DADOS RELACIONAL (PostgreSQL / Supabase)
-- ========================================================

-- 1. TABELA DE MÉTRICAS MENSAIS CONSOLIDADAS
CREATE TABLE IF NOT EXISTS social_monthly_metrics (
    id VARCHAR(10) PRIMARY KEY, -- 'YYYY-MM'
    year INTEGER NOT NULL,
    month VARCHAR(2) NOT NULL,
    month_name VARCHAR(20) NOT NULL,
    
    -- Instagram
    instagram_reach BIGINT DEFAULT 0,
    instagram_followers INTEGER DEFAULT 0,
    instagram_views BIGINT DEFAULT 0,
    instagram_interactions INTEGER DEFAULT 0,
    instagram_profile_visits INTEGER DEFAULT 0,
    instagram_clicks INTEGER DEFAULT 0,
    instagram_contacts INTEGER DEFAULT 0,
    instagram_engagement_rate NUMERIC(5,2) DEFAULT 0,

    -- Facebook
    facebook_reach BIGINT DEFAULT 0,
    facebook_followers INTEGER DEFAULT 0,
    facebook_views BIGINT DEFAULT 0,
    facebook_interactions INTEGER DEFAULT 0,
    facebook_profile_visits INTEGER DEFAULT 0,
    facebook_clicks INTEGER DEFAULT 0,
    facebook_contacts INTEGER DEFAULT 0,
    facebook_engagement_rate NUMERIC(5,2) DEFAULT 0,

    -- LinkedIn
    linkedin_reach BIGINT DEFAULT 0,
    linkedin_followers INTEGER DEFAULT 0,
    linkedin_views BIGINT DEFAULT 0,
    linkedin_interactions INTEGER DEFAULT 0,
    linkedin_profile_visits INTEGER DEFAULT 0,
    linkedin_clicks INTEGER DEFAULT 0,
    linkedin_contacts INTEGER DEFAULT 0,
    linkedin_reactions INTEGER DEFAULT 0,
    linkedin_comments INTEGER DEFAULT 0,
    linkedin_shares INTEGER DEFAULT 0,
    linkedin_engagement_rate NUMERIC(5,2) DEFAULT 0,

    -- Totais Consolidados
    total_reach BIGINT NOT NULL,
    total_interactions INTEGER NOT NULL,
    total_follower_increase INTEGER NOT NULL,
    total_follower_increase_percent INTEGER DEFAULT 0,
    total_engagement_rate NUMERIC(5,2) NOT NULL,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. TABELA DE RANKING DE POSTS E PUBLICAÇÕES
CREATE TABLE IF NOT EXISTS social_posts (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    month_reference VARCHAR(50) NOT NULL,
    media_type VARCHAR(50) NOT NULL,
    reach BIGINT NOT NULL,
    interactions INTEGER NOT NULL,
    engagement_rate NUMERIC(5,2) NOT NULL,
    link_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. ÍNDICES DE BUSCA E PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_monthly_year_month ON social_monthly_metrics(year, month);
CREATE INDEX IF NOT EXISTS idx_posts_type ON social_posts(media_type);
CREATE INDEX IF NOT EXISTS idx_posts_reach ON social_posts(reach DESC);

-- Exemplo de INSERT:
-- INSERT INTO social_monthly_metrics (id, year, month, month_name, total_reach, total_interactions, total_follower_increase, total_engagement_rate)
-- VALUES ('2026-05', 2026, '05', 'Maio', 86800, 11800, 1040, 13.59);
`;
  }, []);

  const handleCopySql = () => {
    navigator.clipboard.writeText(generatedSqlScript);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 3000);
    showFeedback('success', 'Script SQL copiado para a área de transferência!');
  };

  const handleCopyJsonPayload = () => {
    const payload = JSON.stringify(monthlyData, null, 2);
    navigator.clipboard.writeText(payload);
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 3000);
    showFeedback('success', 'Payload JSON completo dos meses copiado!');
  };

  // Filter months in table
  const filteredMonthsList = useMemo(() => {
    return monthlyData.filter(d => {
      const matchYear = filterYear === 'all' || d.year.toString() === filterYear;
      const matchSearch = d.monthName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          d.id.includes(searchTerm);
      return matchYear && matchSearch;
    }).sort((a, b) => parseInt(`${b.year}${b.month}`) - parseInt(`${a.year}${a.month}`));
  }, [monthlyData, filterYear, searchTerm]);

  // Card theme classes
  const cardBgClass = isDarkMode
    ? (theme === 'cyber' ? 'bg-[#0e1217] border-cyan-500/20' : 'bg-slate-900/90 border-white/10')
    : 'bg-white border-slate-200 shadow-sm';

  // For manual month form: if month is already registered and user hasn't clicked edit, disable inputs
  const isFormInputsDisabled = isEditingExisting && !isEditUnlocked;

  const inputClass = isDarkMode
    ? `bg-slate-950 border-white/10 text-white focus:border-violet-500 focus:ring-1 focus:ring-violet-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-900/60`
    : `bg-slate-50 border-slate-300 text-slate-900 focus:border-brand-600 focus:ring-1 focus:ring-brand-600 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-200/50`;

  const subtabClass = (tab: string) => `
    flex items-center gap-2 px-4 py-3 text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-200
    ${subTab === tab
      ? (isDarkMode ? 'bg-violet-600 text-white shadow-md shadow-violet-900/30' : 'bg-brand-600 text-white shadow-md shadow-brand-600/20')
      : (isDarkMode ? 'text-slate-400 hover:text-white hover:bg-white/5' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100')}
  `;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* TOP HERO & SUMMARY BAR */}
      <div className={`p-6 rounded-2xl border ${cardBgClass}`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className={`p-2.5 rounded-xl ${isDarkMode ? 'bg-violet-600 text-white' : 'bg-brand-600 text-white'}`}>
                <Database size={22} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-black uppercase tracking-tight">Central de Cadastro & Ingestão de Dados</h2>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Pronto p/ Banco de Dados
                  </span>
                </div>
                <p className="text-xs opacity-60">Suba planilhas oficiais (.xlsx, .csv) ou cadastre métricas de Instagram, Facebook e LinkedIn diretamente.</p>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleDownloadTemplate}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
                isDarkMode 
                  ? 'bg-slate-800 border-white/10 text-slate-200 hover:bg-slate-700' 
                  : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
              }`}
              title="Baixar modelo com exemplos preenchidos"
            >
              <Download size={15} className="text-emerald-500" />
              Baixar Modelo Excel (.xlsx)
            </button>

            <button
              onClick={handleExportFullExcel}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
                isDarkMode 
                  ? 'bg-slate-800 border-white/10 text-slate-200 hover:bg-slate-700' 
                  : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
              }`}
              title="Exportar base completa"
            >
              <FileSpreadsheet size={15} className="text-cyan-500" />
              Exportar Excel Completo
            </button>

            <button
              onClick={handleExportJson}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
                isDarkMode 
                  ? 'bg-slate-800 border-white/10 text-slate-200 hover:bg-slate-700' 
                  : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
              }`}
              title="Exportar JSON para banco de dados"
            >
              <FileCode size={15} className="text-amber-500" />
              Exportar JSON
            </button>
          </div>
        </div>

        {/* Quick KPI stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/5">
          <div className="p-3 rounded-xl bg-black/20 border border-white/5">
            <span className="text-[10px] uppercase font-bold tracking-widest opacity-50 block">Meses Cadastrados</span>
            <span className="text-xl font-black">{monthlyData.length} meses</span>
            <span className="text-[10px] text-emerald-400 block mt-0.5">2023 até 2026</span>
          </div>
          <div className="p-3 rounded-xl bg-black/20 border border-white/5">
            <span className="text-[10px] uppercase font-bold tracking-widest opacity-50 block">Posts no Ranking</span>
            <span className="text-xl font-black">{postsData.length} publicações</span>
            <span className="text-[10px] text-cyan-400 block mt-0.5">Podcasts, Reels, Vagas</span>
          </div>
          <div className="p-3 rounded-xl bg-black/20 border border-white/5 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest opacity-50 block">Armazenamento Cloud</span>
              <span className="text-base font-black text-violet-400 flex items-center gap-1.5 mt-0.5">
                <Cloud size={16} className="text-emerald-400" />
                Firebase Firestore
              </span>
              <span className="text-[10px] text-emerald-400 block mt-0.5">Banco de Dados Ativo</span>
            </div>
            {onForceSyncFirestore && (
              <button
                type="button"
                onClick={onForceSyncFirestore}
                disabled={isSyncingWithFirestore}
                className="p-2 rounded-lg bg-violet-600/20 text-violet-400 hover:bg-violet-600 hover:text-white transition-all border border-violet-500/30"
                title="Sincronizar com Firebase Firestore"
              >
                <RefreshCw size={14} className={isSyncingWithFirestore ? 'animate-spin' : ''} />
              </button>
            )}
          </div>
          <div className="p-3 rounded-xl bg-black/20 border border-white/5 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest opacity-50 block">Dados de Fábrica</span>
              <span className="text-xs font-bold block mt-1">Resetar Base?</span>
            </div>
            <button
              onClick={() => {
                if (window.confirm('Atenção: deseja restaurar os dados originais padrão de fábrica do CSSJD? Os dados do Firebase e locais serão reinicializados.')) {
                  onResetAllData();
                  showFeedback('info', 'Dados de fábrica restaurados com sucesso no Firebase e localmente!');
                }
              }}
              className="p-2 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white transition-all border border-rose-500/20"
              title="Restaurar dados iniciais padrão"
            >
              <RotateCcw size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* FEEDBACK BANNER */}
      {feedback && (
        <div className={`p-4 rounded-xl flex items-center gap-3 border animate-in slide-in-from-top-2 duration-300 ${
          feedback.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' :
          feedback.type === 'error' ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' :
          'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
        }`}>
          {feedback.type === 'success' && <CheckCircle2 size={20} className="shrink-0" />}
          {feedback.type === 'error' && <AlertCircle size={20} className="shrink-0" />}
          {feedback.type === 'info' && <Sparkles size={20} className="shrink-0" />}
          <span className="text-sm font-medium">{feedback.message}</span>
        </div>
      )}

      {/* SUB-TABS NAVIGATION */}
      <div className={`p-1.5 rounded-2xl border flex flex-wrap gap-1.5 ${isDarkMode ? 'bg-slate-900/70 border-white/5' : 'bg-slate-100 border-slate-200'}`}>
        <button onClick={() => setSubTab('upload')} className={subtabClass('upload')}>
          <Upload size={16} />
          Subir Planilha (.xlsx/.csv)
        </button>
        <button onClick={() => setSubTab('manual-month')} className={subtabClass('manual-month')}>
          <PlusCircle size={16} />
          Cadastrar Mês Completo
        </button>
        <button onClick={() => setSubTab('manual-post')} className={subtabClass('manual-post')}>
          <Sparkles size={16} />
          Cadastrar Publicação (Post)
        </button>
        <button onClick={() => setSubTab('list')} className={subtabClass('list')}>
          <Search size={16} />
          Gerenciar Meses ({monthlyData.length})
        </button>
        <button onClick={() => setSubTab('database')} className={subtabClass('database')}>
          <Database size={16} />
          Banco de Dados & API (Futuro)
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 1. SUBIR PLANILHA EXCEL / CSV                                             */}
      {/* ========================================================================= */}
      {subTab === 'upload' && (
        <div className="space-y-6">
          <div className={`p-8 rounded-2xl border ${cardBgClass}`}>
            <div className="max-w-2xl mx-auto text-center mb-6">
              <h3 className="text-lg font-black uppercase tracking-tight">Upload de Planilha de Redes Sociais</h3>
              <p className="text-xs opacity-60 mt-1">
                Suba a planilha com os dados mensais de alcance, seguidores, visualizações, interações do Instagram, Facebook e LinkedIn.
              </p>
            </div>

            {/* Target selection */}
            <div className="flex justify-center mb-6">
              <div className={`p-1 rounded-xl border inline-flex gap-1 ${isDarkMode ? 'bg-slate-950 border-white/10' : 'bg-slate-100 border-slate-200'}`}>
                <button 
                  type="button"
                  onClick={() => setUploadTarget('auto')} 
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${uploadTarget === 'auto' ? 'bg-violet-600 text-white' : 'opacity-60'}`}
                >
                  Auto-detectar Abas
                </button>
                <button 
                  type="button"
                  onClick={() => setUploadTarget('months')} 
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${uploadTarget === 'months' ? 'bg-violet-600 text-white' : 'opacity-60'}`}
                >
                  Métricas Mensais
                </button>
                <button 
                  type="button"
                  onClick={() => setUploadTarget('posts')} 
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${uploadTarget === 'posts' ? 'bg-violet-600 text-white' : 'opacity-60'}`}
                >
                  Publicações / Posts
                </button>
              </div>
            </div>

            {/* Drag & Drop Area */}
            <div 
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                  handleFileUpload(e.dataTransfer.files[0]);
                }
              }}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-300 ${
                isDragging 
                  ? 'border-violet-500 bg-violet-500/10 scale-[1.01]' 
                  : (isDarkMode ? 'border-white/15 bg-black/20 hover:border-violet-500/50 hover:bg-black/30' : 'border-slate-300 bg-slate-50 hover:border-brand-500 hover:bg-brand-50/50')
              }`}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept=".xlsx, .xls, .csv" 
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    handleFileUpload(e.target.files[0]);
                  }
                }}
              />
              <div className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center mb-4 bg-violet-600/20 text-violet-400 border border-violet-500/30">
                <FileSpreadsheet size={32} />
              </div>
              <h4 className="text-base font-bold mb-1">
                {uploadFileName ? `Arquivo Selecionado: ${uploadFileName}` : 'Clique para selecionar ou arraste o arquivo aqui'}
              </h4>
              <p className="text-xs opacity-50 max-w-md mx-auto">
                Suporta formatos Excel (.xlsx, .xls) e CSV (.csv). As colunas são identificadas e mapeadas automaticamente.
              </p>

              <div className="mt-4 inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-xl bg-white/5 border border-white/10">
                <Upload size={14} /> Selecionar Arquivo do Computador
              </div>
            </div>

            {/* Template download callout */}
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 gap-3">
              <div className="flex items-center gap-3">
                <FileSpreadsheet className="text-emerald-400 shrink-0" size={24} />
                <div>
                  <h5 className="text-xs font-bold text-emerald-300">Precisa do modelo padrão com colunas prontas?</h5>
                  <p className="text-[11px] opacity-70 text-emerald-200">Baixe a planilha de exemplo com as colunas certas de Instagram, Facebook e LinkedIn.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleDownloadTemplate}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-all shrink-0"
              >
                Baixar Planilha Modelo (.xlsx)
              </button>
            </div>
          </div>

          {/* PREVIEW TABLE IF FILE PARSED */}
          {(parsedMonthsPreview || parsedPostsPreview) && (
            <div className={`p-6 rounded-2xl border ${cardBgClass} space-y-6 animate-in slide-in-from-bottom-2 duration-300`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-black uppercase tracking-tight flex items-center gap-2">
                    <CheckCircle2 size={18} className="text-emerald-400" />
                    Pré-visualização dos Dados para Importação
                  </h3>
                  <p className="text-xs opacity-60">Confira as métricas lidas antes de integrá-las aos dashboards e relatórios.</p>
                </div>

                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-xs cursor-pointer select-none">
                    <input 
                      type="checkbox" 
                      checked={replaceExistingOnImport} 
                      onChange={(e) => setReplaceExistingOnImport(e.target.checked)} 
                      className="rounded accent-violet-600"
                    />
                    <span>Substituir meses com mesmo Ano/Mês</span>
                  </label>

                  <button
                    type="button"
                    onClick={confirmImport}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-lg shadow-emerald-600/30"
                  >
                    <Check size={16} />
                    Confirmar e Subir para o Dashboard
                  </button>
                </div>
              </div>

              {/* Monthly preview */}
              {parsedMonthsPreview && parsedMonthsPreview.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-violet-400">
                    Métricas Mensais Identificadas ({parsedMonthsPreview.length} meses)
                  </h4>
                  <div className="overflow-x-auto rounded-xl border border-white/10">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-black/40 text-slate-400 uppercase font-semibold">
                        <tr>
                          <th className="p-3">Período</th>
                          <th className="p-3 text-right">Total Alcance</th>
                          <th className="p-3 text-right">Total Interações</th>
                          <th className="p-3 text-right">Novos Seg.</th>
                          <th className="p-3 text-right">Engajamento</th>
                          <th className="p-3 text-right">Insta Alcance</th>
                          <th className="p-3 text-right">Face Alcance</th>
                          <th className="p-3 text-right">LinkedIn Alcance</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {parsedMonthsPreview.map((m) => (
                          <tr key={m.id} className="hover:bg-white/5">
                            <td className="p-3 font-bold">{m.monthName} / {m.year}</td>
                            <td className="p-3 text-right font-medium">{formatNumber(m.total.reach)}</td>
                            <td className="p-3 text-right">{formatNumber(m.total.interactions)}</td>
                            <td className="p-3 text-right font-bold text-emerald-400">+{formatNumber(m.total.followerIncrease)}</td>
                            <td className="p-3 text-right">{formatPercentage(m.total.engagementRate)}</td>
                            <td className="p-3 text-right text-pink-400">{formatNumber(m.instagram.reach)}</td>
                            <td className="p-3 text-right text-blue-400">{formatNumber(m.facebook.reach)}</td>
                            <td className="p-3 text-right text-cyan-400">{formatNumber(m.linkedin.reach)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Posts preview */}
              {parsedPostsPreview && parsedPostsPreview.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                    Publicações / Posts Identificados ({parsedPostsPreview.length} itens)
                  </h4>
                  <div className="overflow-x-auto rounded-xl border border-white/10">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-black/40 text-slate-400 uppercase font-semibold">
                        <tr>
                          <th className="p-3">Título</th>
                          <th className="p-3">Mês</th>
                          <th className="p-3">Tipo</th>
                          <th className="p-3 text-right">Alcance</th>
                          <th className="p-3 text-right">Interações</th>
                          <th className="p-3 text-right">Engajamento</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {parsedPostsPreview.slice(0, 8).map((p) => (
                          <tr key={p.id} className="hover:bg-white/5">
                            <td className="p-3 font-medium max-w-xs truncate">{p.title}</td>
                            <td className="p-3 capitalize">{p.month}</td>
                            <td className="p-3"><span className="px-2 py-0.5 rounded bg-white/10 text-[10px]">{p.type}</span></td>
                            <td className="p-3 text-right">{formatNumber(p.reach)}</td>
                            <td className="p-3 text-right">{formatNumber(p.interactions)}</td>
                            <td className="p-3 text-right font-bold text-emerald-400">{p.engagement.toFixed(2)}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {parsedPostsPreview.length > 8 && (
                      <div className="p-2 text-center text-xs opacity-50 bg-black/20">
                        ... e mais {parsedPostsPreview.length - 8} publicações
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. FORMULÁRIO MANUAL: MÊS COMPLETO (INSTA, FACE, LINKEDIN)                */}
      {/* ========================================================================= */}
      {subTab === 'manual-month' && (
        <form onSubmit={handleSaveMonthForm} className="space-y-6">
          {/* Header & Date Selector */}
          <div className={`p-6 rounded-2xl border ${cardBgClass}`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-lg font-black uppercase tracking-tight flex items-center gap-2">
                  <PlusCircle size={20} className="text-violet-500" />
                  Cadastro de Métricas do Mês
                </h3>
                <p className="text-xs opacity-60">
                  {isEditingExisting 
                    ? 'Mês já registrado na base de dados. Clique em "Editar Valores" para destravar a alteração dos dados.' 
                    : 'Mês ainda não cadastrado. Valores iniciam em 0 para você preencher e salvar.'}
                </p>
              </div>

              {/* Status and Edit unlock action */}
              <div className="flex items-center gap-2">
                {isEditingExisting ? (
                  !isEditUnlocked ? (
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold">
                        <Lock size={14} /> Mês Cadastrado (Bloqueado)
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditUnlocked(true);
                          showFeedback('info', `Modo de edição ativado para ${MONTH_NAMES_MAP[selectedMonthCode]}/${selectedYear}. Agora você pode alterar os campos e salvar.`);
                        }}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black uppercase tracking-wide transition-all shadow-md shadow-amber-500/20"
                      >
                        <Edit3 size={14} /> Editar Valores
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                        <Unlock size={14} /> Modo Edição Liberado
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          loadMonthDataIntoForm(selectedYear, selectedMonthCode);
                        }}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                          isDarkMode ? 'bg-slate-800 border-white/10 hover:bg-slate-700 text-slate-300' : 'bg-slate-200 border-slate-300 hover:bg-slate-300 text-slate-700'
                        }`}
                        title="Cancelar edição e recarregar dados originais"
                      >
                        <RotateCcw size={13} /> Cancelar Edição
                      </button>
                    </div>
                  )
                ) : (
                  <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-violet-500/10 border border-violet-500/30 text-violet-400 text-xs font-bold">
                    <PlusCircle size={14} /> Novo Mês (Valores em 0)
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider mb-1.5 opacity-70">Ano de Referência</label>
                <input 
                  type="number" 
                  min={2020} 
                  max={2030} 
                  value={selectedYear} 
                  onChange={(e) => {
                    const y = parseInt(e.target.value) || 2026;
                    loadMonthDataIntoForm(y, selectedMonthCode);
                  }}
                  className={`w-full p-2.5 rounded-xl text-sm font-bold border ${inputClass}`}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-[11px] font-bold uppercase tracking-wider opacity-70">Mês</label>
                  <span className="text-[10px] opacity-40 font-semibold hidden sm:inline">Navegar mês a mês</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handlePrevMonth}
                    className={`h-[42px] px-2.5 rounded-xl border flex items-center justify-center transition-all ${
                      isDarkMode 
                        ? 'bg-slate-800 border-white/10 hover:bg-violet-600 hover:border-violet-500 text-slate-300 hover:text-white' 
                        : 'bg-slate-100 border-slate-300 hover:bg-brand-50 hover:border-brand-400 text-slate-700 hover:text-brand-600'
                    }`}
                    title="Mês Anterior (Voltar 1 mês)"
                  >
                    <ChevronLeft size={16} />
                  </button>

                  <select 
                    value={selectedMonthCode} 
                    onChange={(e) => {
                      const m = e.target.value;
                      loadMonthDataIntoForm(selectedYear, m);
                    }}
                    className={`flex-1 p-2.5 rounded-xl text-sm font-bold border ${inputClass}`}
                  >
                    {MONTH_INPUT_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value} className="bg-slate-900 text-white">
                        {opt.label}
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    onClick={handleNextMonth}
                    className={`h-[42px] px-2.5 rounded-xl border flex items-center justify-center transition-all ${
                      isDarkMode 
                        ? 'bg-slate-800 border-white/10 hover:bg-violet-600 hover:border-violet-500 text-slate-300 hover:text-white' 
                        : 'bg-slate-100 border-slate-300 hover:bg-brand-50 hover:border-brand-400 text-slate-700 hover:text-brand-600'
                    }`}
                    title="Próximo Mês (Avançar 1 mês)"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>

              <div className="sm:col-span-2 md:col-span-1 flex items-end">
                <button
                  type="button"
                  onClick={() => loadMonthDataIntoForm(selectedYear, selectedMonthCode)}
                  className={`w-full p-2.5 rounded-xl text-xs font-bold border flex items-center justify-center gap-2 transition-all ${
                    isDarkMode ? 'bg-slate-800 border-white/10 hover:bg-slate-700' : 'bg-slate-100 border-slate-300 hover:bg-slate-200'
                  }`}
                >
                  <RotateCcw size={14} /> Verificar / Recarregar Mês
                </button>
              </div>
            </div>
          </div>

          {/* 3 NETWORKS GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* INSTAGRAM CARD */}
            <div className={`p-6 rounded-2xl border ${cardBgClass} space-y-4`}>
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white">
                    <Instagram size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-black uppercase tracking-tight">Instagram</h4>
                    <span className="text-[10px] opacity-60">Hospital CSSJD</span>
                  </div>
                </div>
                <span className="text-xs font-black text-rose-400">
                  {calculatedIgEng.toFixed(2)}% Eng.
                </span>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider mb-1 opacity-70">Alcance (Reach)</label>
                  <input 
                    type="number" 
                    value={igReach} 
                    disabled={isFormInputsDisabled}
                    onChange={e => setIgReach(Number(e.target.value))} 
                    className={`w-full p-2 rounded-lg text-xs font-semibold border ${inputClass}`}
                    placeholder="Ex: 60000"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider mb-1 opacity-70">Novos Seguidores</label>
                    <input 
                      type="number" 
                      value={igFollowers} 
                      disabled={isFormInputsDisabled}
                      onChange={e => setIgFollowers(Number(e.target.value))} 
                      className={`w-full p-2 rounded-lg text-xs font-semibold border ${inputClass}`}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider mb-1 opacity-70">Visualizações (Views)</label>
                    <input 
                      type="number" 
                      value={igViews} 
                      disabled={isFormInputsDisabled}
                      onChange={e => setIgViews(Number(e.target.value))} 
                      className={`w-full p-2 rounded-lg text-xs font-semibold border ${inputClass}`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider mb-1 opacity-70">Interações</label>
                    <input 
                      type="number" 
                      value={igInteractions} 
                      disabled={isFormInputsDisabled}
                      onChange={e => setIgInteractions(Number(e.target.value))} 
                      className={`w-full p-2 rounded-lg text-xs font-semibold border ${inputClass}`}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider mb-1 opacity-70">Visitas ao Perfil</label>
                    <input 
                      type="number" 
                      value={igVisits} 
                      disabled={isFormInputsDisabled}
                      onChange={e => setIgVisits(Number(e.target.value))} 
                      className={`w-full p-2 rounded-lg text-xs font-semibold border ${inputClass}`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider mb-1 opacity-70">Cliques no Link</label>
                    <input 
                      type="number" 
                      value={igClicks} 
                      disabled={isFormInputsDisabled}
                      onChange={e => setIgClicks(Number(e.target.value))} 
                      className={`w-full p-2 rounded-lg text-xs font-semibold border ${inputClass}`}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider mb-1 opacity-70">Contatos / Mensagens</label>
                    <input 
                      type="number" 
                      value={igContacts} 
                      disabled={isFormInputsDisabled}
                      onChange={e => setIgContacts(Number(e.target.value))} 
                      className={`w-full p-2 rounded-lg text-xs font-semibold border ${inputClass}`}
                    />
                  </div>
                </div>

                <div className={`p-3 rounded-xl border ${isDarkMode ? 'bg-slate-950/60 border-white/10' : 'bg-slate-100 border-slate-200'}`}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5">
                      <Calculator size={12} className="text-rose-400" />
                      <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">Taxa de Engajamento</span>
                    </div>
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-rose-500/10 border border-rose-500/20 text-rose-400">
                      <Lock size={9} /> Cálculo Automático
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-sm font-black text-rose-400 font-mono">
                      {calculatedIgEng.toFixed(2)}%
                    </span>
                    <span className="text-[10px] font-mono opacity-50">
                      (Interações ÷ Alcance) × 100
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* FACEBOOK CARD */}
            <div className={`p-6 rounded-2xl border ${cardBgClass} space-y-4`}>
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-blue-600 text-white">
                    <Facebook size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-black uppercase tracking-tight">Facebook</h4>
                    <span className="text-[10px] opacity-60">Página Institucional</span>
                  </div>
                </div>
                <span className="text-xs font-black text-blue-400">
                  {calculatedFbEng.toFixed(2)}% Eng.
                </span>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider mb-1 opacity-70">Alcance (Reach)</label>
                  <input 
                    type="number" 
                    value={fbReach} 
                    disabled={isFormInputsDisabled}
                    onChange={e => setFbReach(Number(e.target.value))} 
                    className={`w-full p-2 rounded-lg text-xs font-semibold border ${inputClass}`}
                    placeholder="Ex: 15000"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider mb-1 opacity-70">Novos Seguidores</label>
                    <input 
                      type="number" 
                      value={fbFollowers} 
                      disabled={isFormInputsDisabled}
                      onChange={e => setFbFollowers(Number(e.target.value))} 
                      className={`w-full p-2 rounded-lg text-xs font-semibold border ${inputClass}`}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider mb-1 opacity-70">Visualizações (Views)</label>
                    <input 
                      type="number" 
                      value={fbViews} 
                      disabled={isFormInputsDisabled}
                      onChange={e => setFbViews(Number(e.target.value))} 
                      className={`w-full p-2 rounded-lg text-xs font-semibold border ${inputClass}`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider mb-1 opacity-70">Interações</label>
                    <input 
                      type="number" 
                      value={fbInteractions} 
                      disabled={isFormInputsDisabled}
                      onChange={e => setFbInteractions(Number(e.target.value))} 
                      className={`w-full p-2 rounded-lg text-xs font-semibold border ${inputClass}`}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider mb-1 opacity-70">Visitas à Página</label>
                    <input 
                      type="number" 
                      value={fbVisits} 
                      disabled={isFormInputsDisabled}
                      onChange={e => setFbVisits(Number(e.target.value))} 
                      className={`w-full p-2 rounded-lg text-xs font-semibold border ${inputClass}`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider mb-1 opacity-70">Cliques no Link</label>
                    <input 
                      type="number" 
                      value={fbClicks} 
                      disabled={isFormInputsDisabled}
                      onChange={e => setFbClicks(Number(e.target.value))} 
                      className={`w-full p-2 rounded-lg text-xs font-semibold border ${inputClass}`}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider mb-1 opacity-70">Contatos / Mensagens</label>
                    <input 
                      type="number" 
                      value={fbContacts} 
                      disabled={isFormInputsDisabled}
                      onChange={e => setFbContacts(Number(e.target.value))} 
                      className={`w-full p-2 rounded-lg text-xs font-semibold border ${inputClass}`}
                    />
                  </div>
                </div>

                <div className={`p-3 rounded-xl border ${isDarkMode ? 'bg-slate-950/60 border-white/10' : 'bg-slate-100 border-slate-200'}`}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5">
                      <Calculator size={12} className="text-blue-400" />
                      <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">Taxa de Engajamento</span>
                    </div>
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-500/10 border border-blue-500/20 text-blue-400">
                      <Lock size={9} /> Cálculo Automático
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-sm font-black text-blue-400 font-mono">
                      {calculatedFbEng.toFixed(2)}%
                    </span>
                    <span className="text-[10px] font-mono opacity-50">
                      (Interações ÷ Alcance) × 100
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* LINKEDIN CARD */}
            <div className={`p-6 rounded-2xl border ${cardBgClass} space-y-4`}>
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-sky-700 text-white">
                    <Linkedin size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-black uppercase tracking-tight">LinkedIn</h4>
                    <span className="text-[10px] opacity-60">Company Page</span>
                  </div>
                </div>
                <span className="text-xs font-black text-cyan-400">
                  {calculatedLiEng.toFixed(2)}% Eng.
                </span>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider mb-1 opacity-70">Alcance / Impressões Únicas</label>
                  <input 
                    type="number" 
                    value={liReach} 
                    disabled={isFormInputsDisabled}
                    onChange={e => setLiReach(Number(e.target.value))} 
                    className={`w-full p-2 rounded-lg text-xs font-semibold border ${inputClass}`}
                    placeholder="Ex: 7000"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider mb-1 opacity-70">Novos Seguidores</label>
                    <input 
                      type="number" 
                      value={liFollowers} 
                      disabled={isFormInputsDisabled}
                      onChange={e => setLiFollowers(Number(e.target.value))} 
                      className={`w-full p-2 rounded-lg text-xs font-semibold border ${inputClass}`}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider mb-1 opacity-70">Visualizações</label>
                    <input 
                      type="number" 
                      value={liViews} 
                      disabled={isFormInputsDisabled}
                      onChange={e => setLiViews(Number(e.target.value))} 
                      className={`w-full p-2 rounded-lg text-xs font-semibold border ${inputClass}`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider mb-1 opacity-70">Interações Totais</label>
                    <input 
                      type="number" 
                      value={liInteractions} 
                      disabled={isFormInputsDisabled}
                      onChange={e => setLiInteractions(Number(e.target.value))} 
                      className={`w-full p-2 rounded-lg text-xs font-semibold border ${inputClass}`}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider mb-1 opacity-70">Visitas à Página</label>
                    <input 
                      type="number" 
                      value={liVisits} 
                      disabled={isFormInputsDisabled}
                      onChange={e => setLiVisits(Number(e.target.value))} 
                      className={`w-full p-2 rounded-lg text-xs font-semibold border ${inputClass}`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-wider mb-1 opacity-70">Reações</label>
                    <input 
                      type="number" 
                      value={liReactions} 
                      disabled={isFormInputsDisabled}
                      onChange={e => setLiReactions(Number(e.target.value))} 
                      className={`w-full p-2 rounded-lg text-xs font-semibold border ${inputClass}`}
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-wider mb-1 opacity-70">Comentários</label>
                    <input 
                      type="number" 
                      value={liComments} 
                      disabled={isFormInputsDisabled}
                      onChange={e => setLiComments(Number(e.target.value))} 
                      className={`w-full p-2 rounded-lg text-xs font-semibold border ${inputClass}`}
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-wider mb-1 opacity-70">Compartilhar</label>
                    <input 
                      type="number" 
                      value={liShares} 
                      disabled={isFormInputsDisabled}
                      onChange={e => setLiShares(Number(e.target.value))} 
                      className={`w-full p-2 rounded-lg text-xs font-semibold border ${inputClass}`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider mb-1 opacity-70">Cliques</label>
                    <input 
                      type="number" 
                      value={liClicks} 
                      disabled={isFormInputsDisabled}
                      onChange={e => setLiClicks(Number(e.target.value))} 
                      className={`w-full p-2 rounded-lg text-xs font-semibold border ${inputClass}`}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider mb-1 opacity-70">Contatos</label>
                    <input 
                      type="number" 
                      value={liContacts} 
                      disabled={isFormInputsDisabled}
                      onChange={e => setLiContacts(Number(e.target.value))} 
                      className={`w-full p-2 rounded-lg text-xs font-semibold border ${inputClass}`}
                    />
                  </div>
                </div>

                <div className={`p-3 rounded-xl border ${isDarkMode ? 'bg-slate-950/60 border-white/10' : 'bg-slate-100 border-slate-200'}`}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5">
                      <Calculator size={12} className="text-cyan-400" />
                      <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">Taxa de Engajamento</span>
                    </div>
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                      <Lock size={9} /> Cálculo Automático
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-sm font-black text-cyan-400 font-mono">
                      {calculatedLiEng.toFixed(2)}%
                    </span>
                    <span className="text-[10px] font-mono opacity-50">
                      (Interações ÷ Alcance) × 100
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* LIVE SUMMARY AND SAVE ACTION */}
          <div className={`p-6 rounded-2xl border ${cardBgClass} flex flex-col md:flex-row items-center justify-between gap-6`}>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 w-full md:w-auto">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest opacity-50 block">Total Alcance</span>
                <span className="text-xl font-black">{formatNumber(totalCalculated.reach)}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest opacity-50 block">Total Interações</span>
                <span className="text-xl font-black">{formatNumber(totalCalculated.interactions)}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest opacity-50 block">Total Novos Seg.</span>
                <span className="text-xl font-black text-emerald-400">+{formatNumber(totalCalculated.followers)}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest opacity-50 block">Engajamento Médio</span>
                <span className="text-xl font-black text-violet-400">{totalCalculated.engagementRate.toFixed(2)}%</span>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto justify-end">
              {isEditingExisting && !isEditUnlocked ? (
                <button
                  type="button"
                  onClick={() => {
                    setIsEditUnlocked(true);
                    showFeedback('info', `Modo de edição ativado para ${MONTH_NAMES_MAP[selectedMonthCode]}/${selectedYear}. Altere os valores desejados e clique em Salvar.`);
                  }}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-xs font-black uppercase tracking-wider bg-amber-500 hover:bg-amber-400 text-slate-950 transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
                >
                  <Edit3 size={16} />
                  Editar Dados de {MONTH_NAMES_MAP[selectedMonthCode]}/{selectedYear}
                </button>
              ) : (
                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-violet-600 hover:bg-violet-500 text-white transition-all shadow-lg shadow-violet-600/30 flex items-center justify-center gap-2"
                >
                  <Check size={16} />
                  Salvar Mês {MONTH_NAMES_MAP[selectedMonthCode]}/{selectedYear} no Dashboard
                </button>
              )}
            </div>
          </div>
        </form>
      )}

      {/* ========================================================================= */}
      {/* 3. CADASTRO DE PUBLICAÇÃO (POST INDIVIDUAL)                                */}
      {/* ========================================================================= */}
      {subTab === 'manual-post' && (
        <form onSubmit={handleSavePostForm} className="space-y-6">
          <div className={`p-8 rounded-2xl border ${cardBgClass} max-w-3xl mx-auto space-y-6`}>
            <div>
              <h3 className="text-lg font-black uppercase tracking-tight flex items-center gap-2">
                <Sparkles size={20} className="text-cyan-400" />
                Cadastrar Nova Publicação no Ranking
              </h3>
              <p className="text-xs opacity-60">Adicione posts em destaque para alimentar os relatórios de conteúdo, Podcasts e Reels.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 opacity-70">
                  Título / Tema do Post <span className="text-rose-400">*</span>
                </label>
                <input 
                  type="text" 
                  value={postTitle} 
                  onChange={e => setPostTitle(e.target.value)} 
                  placeholder="Ex: Podcast com Dr. Rossini - Cirurgia Cardíaca no CSSJD"
                  className={`w-full p-3 rounded-xl text-sm font-medium border ${inputClass}`}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 opacity-70">Mês de Referência</label>
                  <input 
                    type="text" 
                    value={postMonth} 
                    onChange={e => setPostMonth(e.target.value)} 
                    placeholder="Ex: maio/2026 ou julho/2025"
                    className={`w-full p-3 rounded-xl text-sm font-medium border ${inputClass}`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 opacity-70">Formato / Tipo</label>
                  <select 
                    value={postType} 
                    onChange={e => setPostType(e.target.value)} 
                    className={`w-full p-3 rounded-xl text-sm font-medium border ${inputClass}`}
                  >
                    <option value="Podcast">Podcast</option>
                    <option value="Reels">Reels</option>
                    <option value="Data Comemorativa">Data Comemorativa</option>
                    <option value="Vagas">Vagas de Emprego</option>
                    <option value="Carrossel">Carrossel Educativo</option>
                    <option value="Foto">Foto Institucional</option>
                    <option value="Institucional">Institucional / Notícia</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 opacity-70">Alcance (Pessoas)</label>
                  <input 
                    type="number" 
                    value={postReach} 
                    onChange={e => setPostReach(Number(e.target.value))} 
                    className={`w-full p-3 rounded-xl text-sm font-medium border ${inputClass}`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 opacity-70">Interações</label>
                  <input 
                    type="number" 
                    value={postInteractions} 
                    onChange={e => setPostInteractions(Number(e.target.value))} 
                    className={`w-full p-3 rounded-xl text-sm font-medium border ${inputClass}`}
                  />
                </div>

                <div className={`p-3 rounded-xl border ${isDarkMode ? 'bg-slate-950/60 border-white/10' : 'bg-slate-100 border-slate-200'} flex flex-col justify-center`}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5">
                      <Calculator size={12} className="text-cyan-400" />
                      <span className="text-xs font-bold uppercase tracking-wider opacity-80">Taxa Engajamento</span>
                    </div>
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                      <Lock size={9} /> Automático
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-sm font-black text-cyan-400 font-mono">
                      {postReach > 0 ? ((postInteractions / postReach) * 100).toFixed(2) : '0.00'}%
                    </span>
                    <span className="text-[10px] font-mono opacity-50">
                      (Interações ÷ Alcance) × 100
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 opacity-70">Link da Publicação (URL)</label>
                <input 
                  type="url" 
                  value={postLink} 
                  onChange={e => setPostLink(e.target.value)} 
                  placeholder="https://www.instagram.com/p/..."
                  className={`w-full p-3 rounded-xl text-sm font-medium border ${inputClass}`}
                />
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider bg-cyan-600 hover:bg-cyan-500 text-white transition-all shadow-lg shadow-cyan-600/30 flex items-center gap-2"
                >
                  <Sparkles size={16} /> Cadastrar Publicação
                </button>
              </div>
            </div>
          </div>
        </form>
      )}

      {/* ========================================================================= */}
      {/* 4. LISTA & GERENCIAMENTO DE MESES CADASTRADOS                              */}
      {/* ========================================================================= */}
      {subTab === 'list' && (
        <div className="space-y-6">
          <div className={`p-6 rounded-2xl border ${cardBgClass}`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-base font-black uppercase tracking-tight">Meses Registrados no Sistema</h3>
                <p className="text-xs opacity-60">Visualize, edite ou exclua meses existentes da base de dados.</p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-3 opacity-40" />
                  <input 
                    type="text" 
                    placeholder="Filtrar mês..." 
                    value={searchTerm} 
                    onChange={e => setSearchTerm(e.target.value)} 
                    className={`pl-9 pr-4 py-2 rounded-xl text-xs border ${inputClass}`}
                  />
                </div>

                <select 
                  value={filterYear} 
                  onChange={e => setFilterYear(e.target.value)} 
                  className={`px-3 py-2 rounded-xl text-xs font-bold border ${inputClass}`}
                >
                  <option value="all">Todos os Anos</option>
                  {availableYears.map(y => (
                    <option key={y} value={y.toString()} className="bg-slate-900 text-white">{y}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-white/10">
              <table className="w-full text-xs text-left">
                <thead className="bg-black/30 text-slate-400 uppercase font-semibold">
                  <tr>
                    <th className="p-4">Ano/Mês</th>
                    <th className="p-4 text-right">Alcance Total</th>
                    <th className="p-4 text-right">Interações</th>
                    <th className="p-4 text-right">Novos Seg.</th>
                    <th className="p-4 text-right">Engajamento</th>
                    <th className="p-4 text-right">Instagram</th>
                    <th className="p-4 text-right">Facebook</th>
                    <th className="p-4 text-right">LinkedIn</th>
                    <th className="p-4 text-center">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredMonthsList.map((m) => (
                    <tr key={m.id} className="hover:bg-white/5 group transition-colors">
                      <td className="p-4 font-bold">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-violet-600/20 text-violet-400 text-[10px] font-mono">
                            {m.id}
                          </span>
                          <span>{m.monthName} {m.year}</span>
                        </div>
                      </td>
                      <td className="p-4 text-right font-medium">{formatNumber(m.total.reach)}</td>
                      <td className="p-4 text-right">{formatNumber(m.total.interactions)}</td>
                      <td className="p-4 text-right font-bold text-emerald-400">+{formatNumber(m.total.followerIncrease)}</td>
                      <td className="p-4 text-right font-semibold">{formatPercentage(m.total.engagementRate)}</td>
                      <td className="p-4 text-right text-pink-400">{formatNumber(m.instagram.reach)}</td>
                      <td className="p-4 text-right text-blue-400">{formatNumber(m.facebook.reach)}</td>
                      <td className="p-4 text-right text-cyan-400">{formatNumber(m.linkedin.reach)}</td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              loadMonthDataIntoForm(m.year, m.month);
                              setIsEditUnlocked(true); // Direct edit request from table list
                              setSubTab('manual-month');
                            }}
                            className="p-1.5 rounded-lg bg-violet-600/20 text-violet-400 hover:bg-violet-600 hover:text-white transition-all"
                            title="Editar este mês no formulário"
                          >
                            <Edit3 size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(`Tem certeza que deseja excluir os dados de ${m.monthName}/${m.year}?`)) {
                                onDeleteMonth(m.id);
                                showFeedback('info', `Mês ${m.monthName}/${m.year} excluído.`);
                              }
                            }}
                            className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white transition-all"
                            title="Excluir este mês"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. SEÇÃO: PREPARAÇÃO PARA BANCO DE DADOS & API (FUTURO)                    */}
      {/* ========================================================================= */}
      {subTab === 'database' && (
        <div className="space-y-6">
          <div className={`p-8 rounded-2xl border ${cardBgClass} space-y-6`}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-black uppercase tracking-tight">Arquitetura para Conexão com Banco de Dados</h3>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-violet-500/20 text-violet-300 border border-violet-500/30">
                    Schema Ready
                  </span>
                </div>
                <p className="text-xs opacity-60 mt-1">
                  Como você mencionou que irá conectar um banco de dados futuramente, preparamos toda a estrutura relacional e NoSQL para facilitar 100% a sua migração!
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleCopySql}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-violet-600 hover:bg-violet-500 text-white transition-all"
                >
                  {copiedSql ? <Check size={14} /> : <Copy size={14} />}
                  {copiedSql ? 'SQL Copiado!' : 'Copiar Script SQL'}
                </button>

                <button
                  type="button"
                  onClick={handleCopyJsonPayload}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white transition-all"
                >
                  {copiedJson ? <Check size={14} /> : <Copy size={14} />}
                  {copiedJson ? 'JSON Copiado!' : 'Copiar Payload JSON'}
                </button>
              </div>
            </div>

            {/* Feature cards explaining database integration */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase">
                  <Cloud size={16} /> Firebase Firestore (Conectado)
                </div>
                <p className="text-[11px] opacity-70 leading-relaxed">
                  Banco de dados em nuvem em tempo real do Google Cloud integrado com sucesso. Projeto: <code className="text-emerald-300 font-mono">analise-de-metricas-sjd</code>.
                </p>
                <div className="pt-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Cloud Sync Ativo</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-black/20 border border-white/5 space-y-2">
                <div className="flex items-center gap-2 text-violet-400 font-bold text-xs uppercase">
                  <Database size={16} /> PostgreSQL / Supabase / MySQL
                </div>
                <p className="text-[11px] opacity-70 leading-relaxed">
                  Tabelas normalizadas prontas com campos para cada indicador de Instagram, Facebook e LinkedIn, além de totais agregados e índices para consultas rápidas.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-black/20 border border-white/5 space-y-2">
                <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase">
                  <FileCode size={16} /> REST API / Endpoints
                </div>
                <p className="text-[11px] opacity-70 leading-relaxed">
                  Compatível com rotas <code className="text-violet-300">GET /api/metrics</code>, <code className="text-violet-300">POST /api/metrics</code> e <code className="text-violet-300">PUT /api/metrics/:id</code> para salvar diretamente da aplicação.
                </p>
              </div>
            </div>

            {/* SQL Preview Box */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider opacity-70">
                  Script de Criação de Tabelas (SQL DDL):
                </label>
                <button
                  type="button"
                  onClick={handleCopySql}
                  className="text-xs font-bold text-violet-400 hover:underline flex items-center gap-1"
                >
                  <Copy size={12} /> Copiar Código
                </button>
              </div>
              <pre className="p-4 rounded-xl bg-slate-950 border border-white/10 text-slate-300 font-mono text-xs overflow-x-auto max-h-96 leading-relaxed">
                {generatedSqlScript}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CadastroTab;
