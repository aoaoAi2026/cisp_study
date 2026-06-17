import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Search, X, BookOpen, FileText, Globe, ArrowRight } from 'lucide-react';
import { learningData } from '../../data/learningData';
import { pastPapers } from '../../data/pastPapers';
import { toolSites } from '../../data/toolSites';

interface SearchResult {
  type: 'day' | 'question' | 'tool';
  title: string;
  snippet: string;
  url: string;
}

export const SearchBox: React.FC<{ onNavigate?: () => void }> = ({ onNavigate }) => {
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const boxRef = useRef<HTMLDivElement>(null);

  const results = useMemo<SearchResult[]>(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const out: SearchResult[] = [];

    for (const day of learningData) {
      const haystack = (day.title + ' ' + day.content + ' ' + day.objectives.join(' ')).toLowerCase();
      if (haystack.includes(q)) {
        const idx = haystack.indexOf(q);
        const snippet = day.content.slice(Math.max(0, idx - 20), Math.min(day.content.length, idx + 80));
        out.push({
          type: 'day',
          title: `第${day.day}天 · ${day.title}`,
          snippet,
          url: `/cyber-learning/cisp/${day.id}`,
        });
        if (out.length >= 30) break;
      }
    }

    for (const paper of pastPapers) {
      for (const qItem of paper.questions) {
        const haystack = (qItem.question + ' ' + qItem.explanation).toLowerCase();
        if (haystack.includes(q)) {
          out.push({
            type: 'question',
            title: `${paper.title} · 题目`,
            snippet: qItem.question.slice(0, 80),
            url: `/past-papers/${paper.id}`,
          });
          if (out.length >= 30) break;
        }
      }
      if (out.length >= 30) break;
    }

    for (const group of toolSites) {
      for (const site of group.sites) {
        const haystack = (site.name + ' ' + site.description).toLowerCase();
        if (haystack.includes(q)) {
          out.push({
            type: 'tool',
            title: `${group.category} · ${site.name}`,
            snippet: site.description.slice(0, 80),
            url: `/tool-sites`,
          });
          if (out.length >= 30) break;
        }
      }
      if (out.length >= 30) break;
    }

    return out.slice(0, 30);
  }, [query]);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) {
        setFocused(false);
      }
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const iconFor = (t: SearchResult['type']) => {
    if (t === 'day') return <BookOpen size={16} className="text-cyber-green" />;
    if (t === 'question') return <FileText size={16} className="text-cyber-blue" />;
    return <Globe size={16} className="text-cyber-gold" />;
  };

  return (
    <div ref={boxRef} className="relative mb-4">
      <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all bg-cyber-purple/10 ${focused ? 'border-cyber-green' : 'border-cyber-purple/30'}`}>
        <Search size={16} className="text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setActiveIndex(-1); }}
          onFocus={() => setFocused(true)}
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown') { setActiveIndex(Math.min(activeIndex + 1, results.length - 1)); e.preventDefault(); }
            else if (e.key === 'ArrowUp') { setActiveIndex(Math.max(activeIndex - 1, -1)); e.preventDefault(); }
            else if (e.key === 'Enter' && activeIndex >= 0) {
              window.location.href = results[activeIndex].url;
            }
            else if (e.key === 'Escape') { setQuery(''); setFocused(false); }
          }}
          placeholder="搜索课程/题目/工具..."
          className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-gray-500"
        />
        {query && (
          <button onClick={() => setQuery('')} className="text-gray-400 hover:text-white">
            <X size={14} />
          </button>
        )}
      </div>
      {focused && query && (
        <div className="absolute top-full left-0 right-0 mt-2 rounded-lg border border-cyber-purple/30 bg-cyber-black shadow-2xl max-h-96 overflow-y-auto z-50">
          {results.length === 0 ? (
            <div className="px-4 py-6 text-center text-sm text-gray-500">
              未找到与 "<span className="text-gray-400">{query}</span>" 相关的内容
            </div>
          ) : (
            results.map((r, i) => (
              <a
                key={r.url + r.title + i}
                href={r.url}
                onClick={onNavigate}
                className={`flex items-start gap-3 px-4 py-3 border-b border-cyber-purple/10 transition-colors ${i === activeIndex ? 'bg-cyber-green/10' : 'hover:bg-cyber-purple/20'}`}
              >
                <div className="mt-1">{iconFor(r.type)}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-white truncate">{r.title}</div>
                  <div className="text-xs text-gray-400 truncate mt-0.5">{r.snippet}...</div>
                </div>
                <ArrowRight size={14} className="text-gray-500 mt-1" />
              </a>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBox;
