
import React, { useState, useMemo, useEffect } from 'react';
import { RAW_DATA, POSTS_DATA } from './data';
import { MonthlyData, PostData, DateRange, UserProfile } from './types';
import OverviewTab from './components/OverviewTab';
import PostAnalysis from './components/PostAnalysis';
import YoYAnalysis from './components/YoYAnalysis';
import DetailedMetrics from './components/DetailedMetrics';
import AnnualSummary from './components/AnnualSummary';
import ReportTab from './components/ReportTab';
import CadastroTab from './components/CadastroTab';
import ChatBot from './components/ChatBot';
import { AuthScreen } from './components/AuthScreen';
import { subscribeToAuth, logoutUser } from './authService';
import { 
  Sun, 
  Zap, 
  Shield, 
  Infinity as InfinityIcon, 
  BarChart2, 
  Calendar, 
  Database, 
  Cloud, 
  RefreshCw, 
  CheckCircle2, 
  LogIn, 
  LogOut, 
  UserCheck 
} from 'lucide-react';
import {
  fetchMonthlyMetricsFromFirestore,
  fetchPostsFromFirestore,
  saveMonthToFirestore,
  deleteMonthFromFirestore,
  batchSaveMonthsToFirestore,
  savePostToFirestore,
  deletePostFromFirestore,
  batchSavePostsToFirestore,
  seedInitialFirestoreData,
  subscribeToComments,
  saveCommentToFirestore,
  subscribeToReportEdits,
  saveReportEditToFirestore
} from './firestoreService';

const STORAGE_KEY_MONTHLY = 'cssjd_social_monthly_data_v1';
const STORAGE_KEY_POSTS = 'cssjd_social_posts_data_v1';

/**
 * App Component
 * 
 * Central hub of the CSSJD Social Media Dashboard.
 * Manages global state including theme, date range filtering, tab navigation,
 * dynamic monthly metrics, and post ingestion.
 */
const App: React.FC = () => {
  // Theme & UI State
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [theme, setTheme] = useState<'light' | 'neon' | 'cyber' | 'infinity'>('infinity');
  // Defaults to 'report' (Relatório Gerencial) as requested
  const [activeTab, setActiveTab] = useState<'overview' | 'posts' | 'yoy' | 'detailed' | 'annual' | 'report' | 'cadastro'>('report');

  // Business Data State (Loaded from Local Storage or defaults to factory dataset)
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_MONTHLY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to load monthlyData from localStorage', e);
    }
    return RAW_DATA;
  });

  const [postsData, setPostsData] = useState<PostData[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_POSTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to load postsData from localStorage', e);
    }
    return POSTS_DATA;
  });

  // Cloud Firestore Sync State
  const [isSyncingWithFirestore, setIsSyncingWithFirestore] = useState(false);
  const [firestoreStatus, setFirestoreStatus] = useState<'connected' | 'connecting' | 'error' | 'synced'>('connecting');
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);

  const [dateRange, setDateRange] = useState<DateRange>({
    startYear: 2025,
    startMonth: '01',
    endYear: 2026,
    endMonth: '04'
  });

  // Comments & Reporting Annotation State
  const [commentsMap, setCommentsMap] = useState<Record<string, string>>({});
  const [visibleComments, setVisibleComments] = useState<Record<string, boolean>>({});
  const [reportEdits, setReportEdits] = useState<Record<string, string>>({});

  // 1. Initial Firestore synchronization on mount
  useEffect(() => {
    let isMounted = true;
    async function initFirestoreData() {
      setIsSyncingWithFirestore(true);
      try {
        const remoteMonths = await fetchMonthlyMetricsFromFirestore();
        const remotePosts = await fetchPostsFromFirestore();

        if (isMounted) {
          if (remoteMonths.length > 0) {
            setMonthlyData(remoteMonths);
          } else {
            // Seed Firestore with initial data so cloud has full dataset
            await seedInitialFirestoreData();
          }

          if (remotePosts.length > 0) {
            setPostsData(remotePosts);
          }

          setFirestoreStatus('synced');
          setLastSyncedAt(new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }));
        }
      } catch (err) {
        console.warn('Firestore sync initial load notice:', err);
        if (isMounted) setFirestoreStatus('error');
      } finally {
        if (isMounted) setIsSyncingWithFirestore(false);
      }
    }

    initFirestoreData();

    // Subscribe to real-time comments & report updates
    const unsubscribeComments = subscribeToComments(incomingComments => {
      if (isMounted && Object.keys(incomingComments).length > 0) {
        setCommentsMap(prev => ({ ...prev, ...incomingComments }));
      }
    });

    const unsubscribeReportEdits = subscribeToReportEdits(incomingEdits => {
      if (isMounted && Object.keys(incomingEdits).length > 0) {
        setReportEdits(prev => ({ ...prev, ...incomingEdits }));
      }
    });

    // Subscribe to Firebase Authentication state
    const unsubscribeAuth = subscribeToAuth(user => {
      if (isMounted) {
        setCurrentUser(user);
      }
    });

    return () => {
      isMounted = false;
      unsubscribeComments();
      unsubscribeReportEdits();
      unsubscribeAuth();
    };
  }, []);

  // Manual trigger to pull latest data from Firestore
  const handleForceSyncFirestore = async () => {
    setIsSyncingWithFirestore(true);
    try {
      const remoteMonths = await fetchMonthlyMetricsFromFirestore();
      const remotePosts = await fetchPostsFromFirestore();
      if (remoteMonths.length > 0) setMonthlyData(remoteMonths);
      if (remotePosts.length > 0) setPostsData(remotePosts);
      setFirestoreStatus('synced');
      setLastSyncedAt(new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }));
    } catch (err) {
      console.error('Error manual sync:', err);
      setFirestoreStatus('error');
    } finally {
      setIsSyncingWithFirestore(false);
    }
  };

  // Persist state changes to browser storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_MONTHLY, JSON.stringify(monthlyData));
    } catch (e) {
      console.error('Failed to save monthlyData to localStorage', e);
    }
  }, [monthlyData]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_POSTS, JSON.stringify(postsData));
    } catch (e) {
      console.error('Failed to save postsData to localStorage', e);
    }
  }, [postsData]);

  // Filtered Monthly Data based on selected date range and dynamic dataset
  const filteredData = useMemo(() => {
    return monthlyData.filter(d => {
      const dateVal = parseInt(`${d.year}${d.month}`);
      const startVal = parseInt(`${dateRange.startYear}${dateRange.startMonth}`);
      const endVal = parseInt(`${dateRange.endYear}${dateRange.endMonth}`);
      return dateVal >= startVal && dateVal <= endVal;
    });
  }, [monthlyData, dateRange]);

  // Sync theme with dark mode boolean for sub-components
  useEffect(() => {
    if (theme === 'light') setIsDarkMode(false);
    else setIsDarkMode(true);
  }, [theme]);

  // Handlers for Data Ingestion & Management with Cloud Firestore synchronization
  const handleSaveMonth = (month: MonthlyData) => {
    setMonthlyData(prev => {
      const exists = prev.some(m => m.id === month.id);
      const updated = exists ? prev.map(m => m.id === month.id ? month : m) : [...prev, month];
      return updated.sort((a, b) => parseInt(`${a.year}${a.month}`) - parseInt(`${b.year}${b.month}`));
    });

    // Asynchronously persist to Cloud Firestore
    saveMonthToFirestore(month)
      .then(() => {
        setFirestoreStatus('synced');
        setLastSyncedAt(new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }));
      })
      .catch(err => console.error('Failed to sync saved month to Firestore:', err));
  };

  const handleDeleteMonth = (id: string) => {
    setMonthlyData(prev => prev.filter(m => m.id !== id));
    deleteMonthFromFirestore(id)
      .catch(err => console.error('Failed to delete month from Firestore:', err));
  };

  const handleImportMonths = (newMonths: MonthlyData[], replaceAll?: boolean) => {
    setMonthlyData(prev => {
      if (replaceAll) {
        return [...newMonths].sort((a, b) => parseInt(`${a.year}${a.month}`) - parseInt(`${b.year}${b.month}`));
      }
      const map = new Map<string, MonthlyData>();
      prev.forEach(m => map.set(m.id, m));
      newMonths.forEach(m => map.set(m.id, m));
      return Array.from(map.values()).sort((a, b) => parseInt(`${a.year}${a.month}`) - parseInt(`${b.year}${b.month}`));
    });

    // Cloud Batch Ingestion
    batchSaveMonthsToFirestore(newMonths)
      .then(() => {
        setFirestoreStatus('synced');
        setLastSyncedAt(new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }));
      })
      .catch(err => console.error('Failed to batch save months to Firestore:', err));
  };

  const handleAddPost = (newPost: PostData) => {
    setPostsData(prev => [newPost, ...prev]);
    savePostToFirestore(newPost)
      .then(() => setFirestoreStatus('synced'))
      .catch(err => console.error('Failed to save post to Firestore:', err));
  };

  const handleUpdatePost = (updatedPost: PostData) => {
    setPostsData(prev => prev.map(p => p.id === updatedPost.id ? updatedPost : p));
    savePostToFirestore(updatedPost)
      .catch(err => console.error('Failed to update post in Firestore:', err));
  };

  const handleDeletePost = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta publicação?')) {
      setPostsData(prev => prev.filter(p => p.id !== id));
      deletePostFromFirestore(id)
        .catch(err => console.error('Failed to delete post from Firestore:', err));
    }
  };

  const handleImportPosts = (newPosts: PostData[], replaceAll?: boolean) => {
    setPostsData(prev => {
      if (replaceAll) return newPosts;
      const existingIds = new Set(prev.map(p => p.id));
      const toAdd = newPosts.filter(p => !existingIds.has(p.id));
      return [...toAdd, ...prev];
    });

    batchSavePostsToFirestore(newPosts)
      .then(() => setFirestoreStatus('synced'))
      .catch(err => console.error('Failed to batch save posts to Firestore:', err));
  };

  const handleResetAllData = async () => {
    setMonthlyData(RAW_DATA);
    setPostsData(POSTS_DATA);
    try {
      localStorage.removeItem(STORAGE_KEY_MONTHLY);
      localStorage.removeItem(STORAGE_KEY_POSTS);
      await seedInitialFirestoreData();
      setFirestoreStatus('synced');
    } catch (e) {
      console.error('Failed to reset data:', e);
    }
  };

  // UI Handlers
  const toggleVisibility = (id: string) => {
    setVisibleComments(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCommentChange = (id: string, text: string) => {
    setCommentsMap(prev => ({ ...prev, [id]: text }));
    saveCommentToFirestore(id, text);
  };

  const handleReportEdit = (id: string, text: string) => {
    setReportEdits(prev => ({ ...prev, [id]: text }));
    saveReportEditToFirestore(id, text);
  };

  const appBgClass = isDarkMode 
    ? (theme === 'cyber' ? 'bg-[#0a0a0c] text-slate-200' : 'bg-slate-950 text-slate-200')
    : 'bg-slate-50 text-slate-900';

  const tabClass = (tab: string) => `
    flex items-center gap-2 px-6 py-4 text-[10px] font-black uppercase tracking-widest transition-all duration-300 border-b-2 whitespace-nowrap
    ${activeTab === tab 
      ? (isDarkMode ? 'border-violet-500 text-white bg-white/5 shadow-[inset_0_-10px_20px_-10px_rgba(139,92,246,0.1)]' : 'border-brand-600 text-brand-600 bg-brand-50')
      : 'border-transparent text-slate-500 hover:text-slate-400 hover:bg-white/5'}
  `;

  return (
    <div className={`min-h-screen font-sans ${appBgClass} transition-colors duration-500`}>
      {/* HEADER SECTION */}
      <header className={`sticky top-0 z-[100] border-b backdrop-blur-md ${isDarkMode ? 'bg-slate-950/80 border-white/5' : 'bg-white/80 border-slate-200'}`}>
        <div className="max-w-[1600px] mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`p-2.5 rounded-2xl ${isDarkMode ? 'bg-violet-600 shadow-neon-purple text-white' : 'bg-brand-600 text-white'}`}>
              <BarChart2 size={24} />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-black uppercase tracking-tighter">CSSJD <span className="opacity-50 font-light">Social Intel</span></h1>
              <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Dashboard de Performance Estratégica</p>
            </div>
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            {/* Cloud Firestore Status Badge */}
            <div 
              onClick={handleForceSyncFirestore}
              className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl border text-[11px] font-bold cursor-pointer transition-all ${
                isDarkMode ? 'bg-black/30 border-white/10 hover:border-violet-500/50' : 'bg-slate-100 border-slate-200 hover:border-violet-400'
              }`}
              title="Clique para forçar sincronização com Firebase Firestore"
            >
              <Cloud size={14} className={isSyncingWithFirestore ? 'animate-pulse text-violet-400' : 'text-emerald-400'} />
              <span className="opacity-80">
                {isSyncingWithFirestore ? 'Sincronizando...' : 'Firebase Conectado'}
              </span>
              {isSyncingWithFirestore ? (
                <RefreshCw size={11} className="animate-spin text-violet-400 ml-0.5" />
              ) : (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              )}
              {lastSyncedAt && <span className="opacity-40 text-[9px] font-mono hidden lg:inline">({lastSyncedAt})</span>}
            </div>

            {/* Filter Group */}
            <div className={`flex items-center gap-3 px-4 py-2 rounded-xl border ${isDarkMode ? 'bg-black/20 border-white/5' : 'bg-slate-100 border-slate-200'}`}>
               <Calendar size={14} className="opacity-40" />
               <select 
                 value={`${dateRange.startMonth}-${dateRange.startYear}`}
                 onChange={(e) => {
                    const [m, y] = e.target.value.split('-');
                    setDateRange(prev => ({ ...prev, startMonth: m, startYear: parseInt(y) }));
                 }}
                 className="bg-transparent text-[10px] font-black uppercase focus:outline-none cursor-pointer"
               >
                 {monthlyData.map(d => <option key={`start-${d.id}`} value={`${d.month}-${d.year}`} className="bg-slate-900">{d.monthName} {d.year}</option>)}
               </select>
               <span className="opacity-20 text-xs">TO</span>
               <select 
                 value={`${dateRange.endMonth}-${dateRange.endYear}`}
                 onChange={(e) => {
                    const [m, y] = e.target.value.split('-');
                    setDateRange(prev => ({ ...prev, endMonth: m, endYear: parseInt(y) }));
                 }}
                 className="bg-transparent text-[10px] font-black uppercase focus:outline-none cursor-pointer"
               >
                 {monthlyData.map(d => <option key={`end-${d.id}`} value={`${d.month}-${d.year}`} className="bg-slate-900">{d.monthName} {d.year}</option>)}
               </select>
            </div>

            {/* Theme Toggle Group */}
            <div className={`flex items-center gap-1 p-1 rounded-xl border ${isDarkMode ? 'bg-black/40 border-white/10' : 'bg-slate-100 border-slate-200'}`}>
               <button onClick={() => setTheme('light')} className={`p-2 rounded-lg transition-all ${theme === 'light' ? 'bg-white shadow-sm text-brand-600' : 'text-slate-500'}`} title="Modo Claro"><Sun size={14}/></button>
               <button onClick={() => setTheme('neon')} className={`p-2 rounded-lg transition-all ${theme === 'neon' ? 'bg-cyan-500 text-white shadow-neon-blue' : 'text-slate-500'}`} title="Neon Theme"><Zap size={14}/></button>
               <button onClick={() => setTheme('cyber')} className={`p-2 rounded-lg transition-all ${theme === 'cyber' ? 'bg-amber-500 text-white shadow-cyber-glow' : 'text-slate-500'}`} title="Cyber Theme"><Shield size={14}/></button>
               <button onClick={() => setTheme('infinity')} className={`p-2 rounded-lg transition-all ${theme === 'infinity' ? 'bg-violet-600 text-white shadow-neon-purple' : 'text-slate-500'}`} title="Infinity Theme"><InfinityIcon size={14}/></button>
            </div>

            {/* Authentication User Button / Login Trigger */}
            {currentUser ? (
              <div className="flex items-center gap-2">
                <div 
                  className={`flex items-center gap-2.5 px-3 py-1.5 rounded-xl border text-xs font-semibold ${
                    isDarkMode ? 'bg-black/30 border-white/10 text-slate-200' : 'bg-slate-100 border-slate-200 text-slate-800'
                  }`}
                  title={`Conectado como ${currentUser.email || currentUser.displayName}`}
                >
                  <div className="w-6 h-6 rounded-full bg-violet-600 text-white flex items-center justify-center font-bold text-[10px] uppercase shadow-sm">
                    {currentUser.displayName ? currentUser.displayName.charAt(0) : 'U'}
                  </div>
                  <span className="max-w-[110px] truncate hidden sm:inline text-[11px] font-bold">
                    {currentUser.displayName || currentUser.email?.split('@')[0]}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={async () => {
                    await logoutUser();
                    setCurrentUser(null);
                  }}
                  className={`p-2 rounded-xl border text-slate-400 hover:text-rose-400 transition-all ${
                    isDarkMode ? 'border-white/10 hover:bg-rose-500/10' : 'border-slate-200 hover:bg-rose-50'
                  }`}
                  title="Sair da Conta (Logout)"
                >
                  <LogOut size={15} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsAuthModalOpen(true)}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider bg-violet-600 hover:bg-violet-500 text-white transition-all shadow-md shadow-violet-600/20 cursor-pointer"
              >
                <LogIn size={14} />
                <span>Entrar</span>
              </button>
            )}
          </div>
        </div>

        {/* NAVIGATION BAR */}
        <nav className="max-w-[1600px] mx-auto px-6 flex items-center overflow-x-auto no-scrollbar border-t border-white/5">
          <button onClick={() => setActiveTab('overview')} className={tabClass('overview')}>Overview</button>
          <button onClick={() => setActiveTab('posts')} className={tabClass('posts')}>Publicações</button>
          <button onClick={() => setActiveTab('yoy')} className={tabClass('yoy')}>Histórico YoY</button>
          <button onClick={() => setActiveTab('detailed')} className={tabClass('detailed')}>Funil & Conversão</button>
          <button onClick={() => setActiveTab('annual')} className={tabClass('annual')}>Resumo Anual</button>
          <button onClick={() => setActiveTab('report')} className={tabClass('report')}>Relatório Gerencial</button>
          <button onClick={() => setActiveTab('cadastro')} className={tabClass('cadastro')}>
            <Database size={13} className="text-violet-400" />
            Cadastro & Planilhas
          </button>
        </nav>
      </header>

      {/* MAIN VIEWPORT */}
      <main className="max-w-[1600px] mx-auto p-6 sm:p-8 pb-32">
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
          {activeTab === 'overview' && (
            <OverviewTab 
              filteredData={filteredData} 
              rawData={monthlyData} 
              postsData={postsData} 
              isDarkMode={isDarkMode} 
              theme={theme} 
            />
          )}

          {activeTab === 'posts' && (
            <PostAnalysis 
              data={postsData} 
              filteredData={filteredData} 
              isDarkMode={isDarkMode} 
              theme={theme} 
              commentsMap={commentsMap} 
              onCommentChange={handleCommentChange} 
              visibleComments={visibleComments} 
              toggleVisibility={toggleVisibility} 
              onUpdatePost={handleUpdatePost} 
              onDeletePost={handleDeletePost} 
            />
          )}

          {activeTab === 'yoy' && (
            <YoYAnalysis 
              rawData={monthlyData} 
              selectedMonth="all" 
              isDarkMode={isDarkMode} 
              commentsMap={commentsMap} 
              onCommentChange={handleCommentChange} 
              visibleComments={visibleComments} 
              toggleVisibility={toggleVisibility} 
            />
          )}

          {activeTab === 'detailed' && (
            <DetailedMetrics 
              filteredData={filteredData} 
              isDarkMode={isDarkMode} 
              theme={theme}
              commentsMap={commentsMap} 
              onCommentChange={handleCommentChange} 
              visibleComments={visibleComments} 
              toggleVisibility={toggleVisibility} 
            />
          )}

          {activeTab === 'annual' && (
            <AnnualSummary 
              rawData={monthlyData} 
              isDarkMode={isDarkMode} 
              theme={theme}
              commentsMap={commentsMap} 
              onCommentChange={handleCommentChange} 
              visibleComments={visibleComments} 
              toggleVisibility={toggleVisibility} 
            />
          )}

          {activeTab === 'report' && (
            <ReportTab 
              rawData={monthlyData} 
              postsData={postsData} 
              filteredData={filteredData} 
              isDarkMode={isDarkMode} 
              theme={theme} 
              commentsMap={commentsMap} 
              onCommentChange={handleCommentChange} 
              visibleComments={visibleComments} 
              toggleVisibility={toggleVisibility} 
              reportEdits={reportEdits}
              onReportEdit={handleReportEdit}
              onUpdatePost={handleUpdatePost}
            />
          )}

          {activeTab === 'cadastro' && (
            <CadastroTab
              monthlyData={monthlyData}
              postsData={postsData}
              onSaveMonth={handleSaveMonth}
              onDeleteMonth={handleDeleteMonth}
              onImportMonths={handleImportMonths}
              onAddPost={handleAddPost}
              onDeletePost={handleDeletePost}
              onImportPosts={handleImportPosts}
              onResetAllData={handleResetAllData}
              isDarkMode={isDarkMode}
              theme={theme}
              isSyncingWithFirestore={isSyncingWithFirestore}
              onForceSyncFirestore={handleForceSyncFirestore}
            />
          )}
        </div>
      </main>

      {/* FLOATING AI ASSISTANT */}
      <ChatBot isDarkMode={isDarkMode} data={filteredData} />

      {/* AUTHENTICATION SCREEN / MODAL */}
      <AuthScreen
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={(user) => {
          setCurrentUser(user);
          setIsAuthModalOpen(false);
        }}
        isDarkMode={isDarkMode}
        theme={theme}
        allowClose={true}
      />
    </div>
  );
};

export default App;
