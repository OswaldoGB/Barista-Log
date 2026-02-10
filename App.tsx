import React, { useState, useEffect } from 'react';
import BeanList from './components/BeanList';
import BeanDetail from './components/BeanDetail';
import BeanForm from './components/BeanForm';
import BrewForm from './components/BrewForm';
import { CoffeeBean, BrewRecipe } from './types';
import { Coffee } from 'lucide-react';

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
        updatedRecipes = [recipe, ...bean.recipes];
      }

      return { ...bean, recipes: updatedRecipes };
    }));

    setView('beanDetail');
    setActiveRecipeId(null);
  };

  const handleDeleteRecipe = (recipeId: string) => {
    if (!activeBeanId) return;
    if (!confirm('¿Estás seguro de que quieres eliminar esta receta?')) return;
    
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
        return <BeanList beans={beans} onSelectBean={handleSelectBean} onAddBean={() => setView('addBean')} />;
      
      case 'addBean':
        return <BeanForm onSave={handleSaveBean} onCancel={() => setView('beanList')} />;

      case 'editBean':
        return activeBean ? <BeanForm initialData={activeBean} onSave={handleSaveBean} onCancel={() => setView('beanDetail')} /> : null;

      case 'beanDetail':
        return activeBean ? (
          <BeanDetail 
            bean={activeBean} 
            onBack={() => { setActiveBeanId(null); setView('beanList'); }}
            onEditBean={() => setView('editBean')}
            onAddRecipe={() => { setActiveRecipeId(null); setView('addRecipe'); }}
            onSelectRecipe={handleSelectRecipe}
            onDeleteRecipe={handleDeleteRecipe}
          />
        ) : null;

      case 'addRecipe':
        return <BrewForm onSave={handleSaveRecipe} onCancel={() => setView('beanDetail')} />;

      case 'editRecipe':
        return activeRecipe ? <BrewForm initialData={activeRecipe} onSave={handleSaveRecipe} onCancel={() => setView('beanDetail')} /> : null;
        
      default:
        return <div>Error: Vista Desconocida</div>;
    }
  };

  return (
    <div className="min-h-screen bg-[#fdf8f6] dark:bg-[#1c1917] text-stone-900 dark:text-stone-100 font-sans transition-colors duration-200">
      <nav className="bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => { setView('beanList'); setActiveBeanId(null); }}>
            <div className="bg-stone-900 dark:bg-white text-white dark:text-stone-900 p-1.5 rounded-lg">
              <Coffee className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg tracking-tight">BaristaLog</span>
          </div>
          <button 
            onClick={() => document.documentElement.classList.toggle('dark')}
            className="p-2 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-500 transition-colors"
          >
            🌙
          </button>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto p-4 md:p-6 w-full">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;