import React, { useState, useEffect } from 'react';
import BeanList from './components/BeanList';
import BeanDetail from './components/BeanDetail';
import BeanForm from './components/BeanForm';
import BrewForm from './components/BrewForm';
import { CoffeeBean, BrewRecipe } from './types';
import { Coffee, Globe, Moon, Sun } from 'lucide-react';
import { TRANSLATIONS } from './constants';

type ViewState = 'beanList' | 'addBean' | 'editBean' | 'beanDetail' | 'addRecipe' | 'editRecipe';

const App: React.FC = () => {
  // State: List of Beans (which contain recipes)
  const [beans, setBeans] = useState<CoffeeBean[]>(() => {
    try {
      const saved = localStorage.getItem('barista-beans');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [lang, setLang] = useState<'es' | 'en'>('es');

  // Navigation State
  const [view, setView] = useState<ViewState>('beanList');
  const [activeBeanId, setActiveBeanId] = useState<string | null>(null);
  const [activeRecipeId, setActiveRecipeId] = useState<string | null>(null);

  // Persistence
  useEffect(() => {
    localStorage.setItem('barista-beans', JSON.stringify(beans));
  }, [beans]);

  // Derived State
  const activeBean = beans.find(b => b.id === activeBeanId);
  const activeRecipe = activeBean?.recipes.find(r => r.id === activeRecipeId);
  const t = TRANSLATIONS[lang];

  // --- Actions ---

  // Bean Actions
  const handleSaveBean = (bean: CoffeeBean) => {
    if (activeBeanId && view === 'editBean') {
      setBeans(prev => prev.map(b => b.id === bean.id ? bean : b));
      setView('beanDetail');
    } else {
      setBeans(prev => [bean, ...prev]);
      setActiveBeanId(bean.id); // Go to new bean
      setView('beanDetail');
    }
  };

  const handleSelectBean = (bean: CoffeeBean) => {
    setActiveBeanId(bean.id);
    setView('beanDetail');
  };

  // Recipe Actions
  const handleSaveRecipe = (recipe: BrewRecipe) => {
    if (!activeBeanId) return;

    setBeans(prev => prev.map(bean => {
      if (bean.id !== activeBeanId) return bean;

      const existingRecipeIndex = bean.recipes.findIndex(r => r.id === recipe.id);
      let updatedRecipes;
      
      if (existingRecipeIndex >= 0) {
        updatedRecipes = [...bean.recipes];
        updatedRecipes[existingRecipeIndex] = recipe;
      } else {
        updatedRecipes = [recipe, ...bean.recipes]; // Add new recipe to top
      }

      return { ...bean, recipes: updatedRecipes };
    }));

    setView('beanDetail');
    setActiveRecipeId(null);
  };

  const handleDeleteRecipe = (recipeId: string) => {
    if (!activeBeanId) return;
    if (!confirm(t.confirmDelete)) return;
    
    setBeans(prev => prev.map(bean => {
      if (bean.id !== activeBeanId) return bean;
      return { ...bean, recipes: bean.recipes.filter(r => r.id !== recipeId) };
    }));
  };

  const handleSelectRecipe = (recipe: BrewRecipe) => {
    setActiveRecipeId(recipe.id);
    setView('editRecipe');
  };

  // Render logic based on view state
  const renderContent = () => {
    switch (view) {
      case 'beanList':
        return <BeanList beans={beans} onSelectBean={handleSelectBean} onAddBean={() => setView('addBean')} lang={lang} />;
      
      case 'addBean':
        return <BeanForm onSave={handleSaveBean} onCancel={() => setView('beanList')} lang={lang} />;

      case 'editBean':
        return activeBean ? <BeanForm initialData={activeBean} onSave={handleSaveBean} onCancel={() => setView('beanDetail')} lang={lang} /> : null;

      case 'beanDetail':
        return activeBean ? (
          <BeanDetail 
            bean={activeBean} 
            onBack={() => { setActiveBeanId(null); setView('beanList'); }}
            onEditBean={() => setView('editBean')}
            onAddRecipe={() => { setActiveRecipeId(null); setView('addRecipe'); }}
            onSelectRecipe={handleSelectRecipe}
            onDeleteRecipe={handleDeleteRecipe}
            lang={lang}
          />
        ) : null;

      case 'addRecipe':
        return <BrewForm onSave={handleSaveRecipe} onCancel={() => setView('beanDetail')} lang={lang} />;

      case 'editRecipe':
        return activeRecipe ? <BrewForm initialData={activeRecipe} onSave={handleSaveRecipe} onCancel={() => setView('beanDetail')} lang={lang} /> : null;
        
      default:
        return <div>Error: Vista Desconocida</div>;
    }
  };

  return (
    <div className="min-h-screen bg-[#fdf8f6] dark:bg-[#1c1917] text-stone-900 dark:text-stone-100 font-sans transition-colors duration-200">
      <nav className="bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer group" onClick={() => { setView('beanList'); setActiveBeanId(null); }}>
            <div className="bg-stone-900 dark:bg-white text-white dark:text-stone-900 p-1.5 rounded-lg group-hover:scale-105 transition-transform">
              <Coffee className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg tracking-tight">{t.appTitle}</span>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Language Toggle Button */}
            <button
              onClick={() => setLang(prev => prev === 'es' ? 'en' : 'es')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors text-xs font-bold active:scale-95"
              aria-label="Switch Language"
            >
              <Globe className="w-3.5 h-3.5" />
              {lang.toUpperCase()}
            </button>

            {/* Dark Mode Toggle */}
            <button 
              onClick={() => document.documentElement.classList.toggle('dark')}
              className="p-2 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 transition-colors active:scale-95"
              aria-label="Toggle Dark Mode"
            >
              <Moon className="w-5 h-5 block dark:hidden" />
              <Sun className="w-5 h-5 hidden dark:block" />
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto p-4 md:p-6 w-full">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;