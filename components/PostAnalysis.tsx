
import React, { useState, useMemo } from 'react';
import { PostData, MonthlyData } from '../types';
import { Search, ChevronLeft, ChevronRight, BarChart2, Filter, Users, Trophy, Medal, Edit2, Trash2, X, Save, RefreshCw, ExternalLink } from 'lucide-react';
import { PostTypeDistributionChart, PostTypePerformanceChart } from './Charts';
import SectionWrapper from './SectionWrapper';

interface PostAnalysisProps {
  data: PostData[];
  filteredData: MonthlyData[]; // Recebe os dados mensais filtrados para saber quais meses/anos estão ativos
  isDarkMode: boolean;
  theme: string;
  commentsMap: Record<string, string>;
  onCommentChange: (id: string, text: string) => void;
  visibleComments: Record<string, boolean>;
  toggleVisibility: (id: string) => void;
  onUpdatePost: (post: PostData) => void;
  onDeletePost: (id: string) => void;
}

const PostAnalysis: React.FC<PostAnalysisProps> = ({ 
  data,
  filteredData,
  isDarkMode, 
  theme,
  commentsMap,
  onCommentChange,
  visibleComments,
  toggleVisibility,
  onUpdatePost,
  onDeletePost
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<keyof PostData>('engagement');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  const [minReach, setMinReach] = useState<number | ''>('');
  const [minInteractions, setMinInteractions] = useState<number | ''>('');

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Estado de Edição
  const [editingPost, setEditingPost] = useState<PostData | null>(null);

  // Mapeamento dos nomes de meses presentes no filtro atual (ex: "janeiro", "fevereiro"...)
  const activeMonthNames = useMemo(() => {
    return new Set(filteredData.map(d => d.monthName.toLowerCase()));
  }, [filteredData]);

  const uniqueTypes = useMemo(() => Array.from(new Set(data.map(p => p.type))).sort(), [data]);

  const filteredPosts = useMemo(() => {
    return data.filter(post => {
      const searchMatch = post.title.toLowerCase().includes(searchTerm.toLowerCase());
      const typeMatch = filterType === 'all' || post.type === filterType;
      const reachMatch = minReach === '' || post.reach >= minReach;
      const interactionsMatch = minInteractions === '' || post.interactions >= minInteractions;
      
      // O post deve pertencer a um dos meses ativos no filtro global do dashboard
      const monthMatch = activeMonthNames.has(post.month.toLowerCase());

      return searchMatch && typeMatch && monthMatch && reachMatch && interactionsMatch;
    });
  }, [data, searchTerm, filterType, activeMonthNames, minReach, minInteractions]);

  const sortedPosts = useMemo(() => {
    return [...filteredPosts].sort((a, b) => {
      const valA = a[sortBy];
      const valB = b[sortBy];
      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredPosts, sortBy, sortOrder]);

  const totalPages = Math.ceil(sortedPosts.length / itemsPerPage);
  const currentData = sortedPosts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleSort = (key: keyof PostData) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(key);
      setSortOrder('desc');
    }
  };

  const handleEditClick = (post: PostData) => {
    setEditingPost({ ...post });
  };

  const handleSaveEdit = () => {
    if (editingPost) {
      onUpdatePost(editingPost);
      setEditingPost(null);
    }
  };

  const cardClass = isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200';
  const textClass = isDarkMode ? 'text-slate-200' : 'text-slate-800';
  const subTextClass = isDarkMode ? 'text-slate-400' : 'text-slate-500';
  const tableHeaderClass = isDarkMode ? 'bg-slate-950 text-slate-400' : 'bg-slate-50 text-slate-500';
  const tableRowClass = isDarkMode ? 'border-slate-800 hover:bg-slate-800/50' : 'border-slate-100 hover:bg-slate-50';
  const inputClass = isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-200 placeholder-slate-500' : 'bg-slate-50 border-slate-200 text-slate-700 placeholder-slate-400';

  return (
    <div className="space-y-6">
      {/* Modal de Edição */}
      {editingPost && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className={`w-full max-w-lg rounded-2xl border shadow-2xl p-6 relative ${
            theme === 'infinity' ? 'glass-card border-white/20' : 
            isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'
          }`}>
            <button onClick={() => setEditingPost(null)} className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full text-slate-500">
              <X size={20} />
            </button>
            <h3 className={`text-xl font-black mb-6 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              <Edit2 size={20} className="text-brand-500" /> Editar Publicação
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className={`text-xs font-black uppercase mb-1 block ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Título</label>
                <input 
                  type="text" 
                  value={editingPost.title} 
                  onChange={e => setEditingPost({...editingPost, title: e.target.value})}
                  className={`w-full p-3 rounded-xl border text-sm ${inputClass}`}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`text-xs font-black uppercase mb-1 block ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Alcance</label>
                  <input 
                    type="number" 
                    value={editingPost.reach} 
                    onChange={e => setEditingPost({...editingPost, reach: Number(e.target.value)})}
                    className={`w-full p-3 rounded-xl border text-sm ${inputClass}`}
                  />
                </div>
                <div>
                  <label className={`text-xs font-black uppercase mb-1 block ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Interações</label>
                  <input 
                    type="number" 
                    value={editingPost.interactions} 
                    onChange={e => setEditingPost({...editingPost, interactions: Number(e.target.value)})}
                    className={`w-full p-3 rounded-xl border text-sm ${inputClass}`}
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              <button onClick={() => setEditingPost(null)} className={`flex-1 py-3 rounded-xl font-bold border ${isDarkMode ? 'border-slate-700 text-slate-400' : 'border-slate-200 text-slate-500'}`}>
                Cancelar
              </button>
              <button onClick={handleSaveEdit} className="flex-1 py-3 rounded-xl font-bold bg-brand-600 text-white hover:bg-brand-700 shadow-lg">
                Salvar Alterações
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Gráficos de Análise (Baseados nos posts filtrados) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print-break-inside">
         <SectionWrapper id="posts-distribution" title="Distribuição por Tipo" subTitle="Baseado no filtro selecionado" isDarkMode={isDarkMode} theme={theme as any} comment={commentsMap['posts-distribution']} onCommentChange={onCommentChange} isCommentVisible={!!visibleComments['posts-distribution']} onToggleComment={toggleVisibility}>
            <div className="h-[350px]">
              <PostTypeDistributionChart data={filteredPosts} isDarkMode={isDarkMode} />
            </div>
         </SectionWrapper>
         <SectionWrapper id="posts-performance-avg" title="Performance por Tipo" subTitle="Baseado no filtro selecionado" isDarkMode={isDarkMode} theme={theme as any} comment={commentsMap['posts-performance-avg']} onCommentChange={onCommentChange} isCommentVisible={!!visibleComments['posts-performance-avg']} onToggleComment={toggleVisibility}>
            <div className="h-[350px]">
              <PostTypePerformanceChart data={filteredPosts} isDarkMode={isDarkMode} />
            </div>
         </SectionWrapper>
      </div>

      {/* Barra de Busca e Filtros */}
      <div className={`p-4 rounded-xl border flex flex-col gap-4 ${cardClass}`}>
        <div className="flex flex-col md:flex-row gap-4 justify-between">
            <div className="flex items-center gap-2 w-full md:w-auto flex-1">
            <Search size={18} className={subTextClass} />
            <input type="text" placeholder="Buscar por título..." value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} className={`bg-transparent border-none focus:ring-0 w-full ${textClass} placeholder-slate-500`} />
            </div>
            <select value={sortBy} onChange={(e) => { setSortBy(e.target.value as keyof PostData); }} className={`p-2 rounded-lg text-sm border min-w-[180px] ${inputClass}`}>
                <option value="engagement">Ordenar: Engajamento</option>
                <option value="reach">Ordenar: Alcance</option>
                <option value="interactions">Ordenar: Interações</option>
            </select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
           <select value={filterType} onChange={(e) => { setFilterType(e.target.value); setCurrentPage(1); }} className={`p-2 rounded-lg text-sm border w-full ${inputClass}`}>
             <option value="all">Todos os Tipos</option>
             {uniqueTypes.map(t => <option key={t} value={t}>{t}</option>)}
           </select>
           <input type="number" placeholder="Mín. Alcance" value={minReach} onChange={e => { setMinReach(e.target.value ? Number(e.target.value) : ''); setCurrentPage(1); }} className={`p-2 rounded-lg text-sm border w-full ${inputClass}`} />
           <input type="number" placeholder="Mín. Interações" value={minInteractions} onChange={e => { setMinInteractions(e.target.value ? Number(e.target.value) : ''); setCurrentPage(1); }} className={`p-2 rounded-lg text-sm border w-full ${inputClass}`} />
        </div>
      </div>

      {/* Tabela de Posts */}
      <SectionWrapper id="posts-table" title="Listagem de Posts" subTitle={`${filteredPosts.length} posts encontrados no período`} isDarkMode={isDarkMode} theme={theme as any} comment={commentsMap['posts-table']} onCommentChange={onCommentChange} isCommentVisible={!!visibleComments['posts-table']} onToggleComment={toggleVisibility}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className={`text-xs uppercase font-semibold ${tableHeaderClass}`}>
              <tr>
                <th className="px-6 py-4 cursor-pointer" onClick={() => handleSort('title')}>Título</th>
                <th className="px-6 py-4 cursor-pointer" onClick={() => handleSort('month')}>Mês</th>
                <th className="px-6 py-4 cursor-pointer" onClick={() => handleSort('type')}>Tipo</th>
                <th className="px-6 py-4 text-right cursor-pointer" onClick={() => handleSort('reach')}>Alcance</th>
                <th className="px-6 py-4 text-right cursor-pointer" onClick={() => handleSort('interactions')}>Interações</th>
                <th className="px-6 py-4 text-right cursor-pointer" onClick={() => handleSort('engagement')}>Engajamento</th>
                <th className="px-6 py-4 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {currentData.map((post, idx) => (
                  <tr key={post.id} className={`transition-colors group ${tableRowClass}`}>
                    <td className={`px-6 py-5 font-medium max-w-xs truncate ${textClass}`} title={post.title}>
                       <div className="flex items-center gap-2">
                         {post.link ? (
                            <a href={post.link} target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-1">
                               {post.title} <ExternalLink size={12} className="opacity-50" />
                            </a>
                         ) : post.title}
                       </div>
                    </td>
                    <td className={`px-6 py-5 capitalize ${subTextClass}`}>{post.month}</td>
                    <td className={`px-6 py-5 ${subTextClass}`}><span className={`px-2 py-1 rounded text-xs font-bold ${isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>{post.type}</span></td>
                    <td className={`px-6 py-5 text-right ${subTextClass}`}>{post.reach.toLocaleString('pt-BR')}</td>
                    <td className={`px-6 py-5 text-right ${subTextClass}`}>{post.interactions.toLocaleString('pt-BR')}</td>
                    <td className={`px-6 py-5 text-right font-bold ${post.engagement >= 20 ? (isDarkMode ? 'text-neon-green' : 'text-emerald-600') : (isDarkMode ? 'text-slate-300' : 'text-slate-900')}`}>{post.engagement.toFixed(2)}%</td>
                    <td className="px-6 py-5 text-center">
                      <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleEditClick(post)}
                          className={`p-2 rounded-lg hover:bg-brand-500 hover:text-white transition-all ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => onDeletePost(post.id)}
                          className={`p-2 rounded-lg hover:bg-rose-500 hover:text-white transition-all ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
              ))}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className={`px-6 py-4 border-t flex items-center justify-between ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
            <span className={`text-xs ${subTextClass}`}>Página {currentPage} de {totalPages}</span>
            <div className="flex gap-2">
              <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-2 rounded disabled:opacity-50"><ChevronLeft size={16} /></button>
              <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-2 rounded disabled:opacity-50"><ChevronRight size={16} /></button>
            </div>
          </div>
        )}
      </SectionWrapper>
    </div>
  );
};

export default PostAnalysis;
