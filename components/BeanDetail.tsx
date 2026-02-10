import React from 'react';
import { CoffeeBean, BrewRecipe } from '../types';
import { ArrowLeft, Plus, Droplet, Thermometer, Timer, Edit, Trash2, TrendingUp } from 'lucide-react';

interface Props {
  bean: CoffeeBean;
  onBack: () => void;
  onEditBean: () => void;
  onAddRecipe: () => void;
  onSelectRecipe: (recipe: BrewRecipe) => void;
  onDeleteRecipe: (recipeId: string) => void;
}

const BeanDetail: React.FC<Props> = ({ bean, onBack, onEditBean, onAddRecipe, onSelectRecipe, onDeleteRecipe }) => {
  // Sort recipes by date descending
  const recipes = [...bean.recipes].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Calculate average score
  const avgScore = recipes.length > 0 
    ? (recipes.reduce((acc, curr) => acc + curr.result.overallScore, 0) / recipes.length).toFixed(1)
    : '-';

  return (
    <div className="pb-24 max-w-4xl mx-auto w-full">
      {/* Header / Nav */}
      <div className="flex items-center justify-between mb-6 sticky top-0 bg-[#fdf8f6] dark:bg-[#1c1917] z-10 py-4 transition-colors">
        <button onClick={onBack} className="flex items-center text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100 transition-colors font-medium">
          <ArrowLeft className="w-5 h-5 mr-1" /> Mis Cafés
        </button>
        <button onClick={onEditBean} className="p-2 text-stone-400 hover:text-amber-600 transition-colors">
          <Edit className="w-5 h-5" />
        </button>
      </div>

      {/* Bean Dashboard Card */}
      <div className="bg-white dark:bg-stone-900 rounded-2xl p-6 shadow-sm border border-stone-200 dark:border-stone-800 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 dark:bg-amber-900/10 rounded-bl-full -mr-10 -mt-10 z-0 pointer-events-none"></div>
        
        <div className="relative z-10">
          <span className="text-xs font-bold tracking-widest uppercase text-amber-600 dark:text-amber-500 mb-1 block">
            {bean.roaster}
          </span>
          <h1 className="text-2xl md:text-3xl font-bold text-stone-900 dark:text-stone-100 mb-2 leading-tight">{bean.name}</h1>
          <div className="flex flex-wrap gap-x-3 gap-y-1 text-sm text-stone-600 dark:text-stone-400 mb-6 font-medium">
            <span>{bean.origin}</span>
            <span className="text-stone-300">•</span>
            <span>{bean.process}</span>
            <span className="text-stone-300">•</span>
            <span>{bean.variety}</span>
            <span className="text-stone-300">•</span>
            <span>{bean.altitude} msnm</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-stone-100 dark:border-stone-800">
             <div>
               <span className="label">Fecha Tueste</span>
               <p className="font-mono text-stone-800 dark:text-stone-200 text-sm">{new Date(bean.roastDate).toLocaleDateString()}</p>
             </div>
             <div>
               <span className="label">Nivel</span>
               <p className="font-medium text-stone-800 dark:text-stone-200 text-sm">{bean.roastLevel}</p>
             </div>
             <div>
               <span className="label">Recetas</span>
               <p className="font-medium text-stone-800 dark:text-stone-200 text-sm">{recipes.length}</p>
             </div>
             <div>
               <span className="label">Puntaje</span>
               <p className="font-bold text-amber-600 text-lg">{avgScore}</p>
             </div>
          </div>
        </div>
      </div>

      {/* Recipes List */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-stone-800 dark:text-stone-200">Bitácora</h2>
        <button onClick={onAddRecipe} className="flex items-center gap-2 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 px-4 py-2 rounded-xl text-sm font-bold hover:bg-stone-800 dark:hover:bg-white transition-colors shadow-md active:scale-95">
          <Plus className="w-4 h-4" /> Nueva Receta
        </button>
      </div>

      {recipes.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-stone-200 dark:border-stone-800 rounded-xl bg-stone-50/50 dark:bg-stone-900/50">
          <p className="text-stone-500 font-medium">Aún no hay recetas. ¡Prepara tu primera taza!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {recipes.map(recipe => (
            <div key={recipe.id} className="group bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 hover:border-amber-400 dark:hover:border-amber-600 transition-all p-5 cursor-pointer relative shadow-sm active:bg-stone-50 dark:active:bg-stone-800"
              onClick={() => onSelectRecipe(recipe)}>
              
              <div className="flex justify-between items-start mb-3">
                 <div className="flex items-center gap-3">
                   <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shadow-sm
                     ${recipe.result.overallScore >= 8.5 ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100' : 'bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-400'}`}>
                     {recipe.result.overallScore}
                   </div>
                   <div>
                     <h3 className="font-bold text-stone-800 dark:text-stone-100">{recipe.config.method}</h3>
                     <p className="text-xs text-stone-500 font-medium">{new Date(recipe.date).toLocaleDateString()} · {new Date(recipe.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                   </div>
                 </div>
                 <button 
                   onClick={(e) => { e.stopPropagation(); onDeleteRecipe(recipe.id); }}
                   className="opacity-100 sm:opacity-0 group-hover:opacity-100 p-2 text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-all"
                 >
                   <Trash2 className="w-4 h-4" />
                 </button>
              </div>

              {/* Quick Stats Grid */}
              <div className="grid grid-cols-4 gap-2 mb-3">
                <div className="stat-pill"><Droplet className="w-3 h-3" /> 1:{(recipe.config.waterAmount / recipe.config.dose).toFixed(1)}</div>
                <div className="stat-pill"><Thermometer className="w-3 h-3" /> {recipe.config.temperature}°C</div>
                <div className="stat-pill"><Timer className="w-3 h-3" /> {recipe.config.totalTime}</div>
                <div className="stat-pill font-mono text-[10px] tracking-tighter">Molienda: {recipe.config.grinderSetting}</div>
              </div>

              {/* Diagnosis & Next Steps */}
              <div className="space-y-2">
                 <div className="flex items-center gap-2 text-xs">
                    <span className={`px-2 py-0.5 rounded-md font-bold ${
                      recipe.learning.diagnosis === 'Balanceado' || recipe.learning.diagnosis === 'Excelente' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                      recipe.learning.diagnosis === 'Sub-extraído' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {recipe.learning.diagnosis}
                    </span>
                 </div>
                 {recipe.learning.changesForNextTime && (
                   <div className="flex items-start gap-2 text-sm text-stone-600 dark:text-stone-400 bg-stone-50 dark:bg-stone-800/50 p-2.5 rounded-lg border border-stone-100 dark:border-stone-800">
                     <TrendingUp className="w-4 h-4 mt-0.5 text-amber-600 flex-shrink-0" />
                     <p className="leading-snug"><span className="font-semibold text-stone-700 dark:text-stone-300">Siguiente:</span> {recipe.learning.changesForNextTime}</p>
                   </div>
                 )}
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        .label { @apply block text-[10px] font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500 mb-0.5; }
        .stat-pill { @apply flex flex-col sm:flex-row items-center justify-center gap-1 bg-stone-50 dark:bg-stone-800 text-stone-600 dark:text-stone-300 rounded-lg py-2 text-xs font-medium border border-stone-100 dark:border-stone-700; }
      `}</style>
    </div>
  );
};

export default BeanDetail;