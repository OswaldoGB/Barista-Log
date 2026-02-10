import React, { useState } from 'react';
import { BrewRecipe, BrewConfig, Technique, SensoryResult, LearningLog } from '../types';
import { EMPTY_RECIPE, METHODS } from '../constants';
import { ChevronDown, ChevronUp, Save, Droplets, Sliders, Activity, BrainCircuit, ArrowLeft } from 'lucide-react';

interface Props {
  initialData?: BrewRecipe;
  onSave: (recipe: BrewRecipe) => void;
  onCancel: () => void;
}

// Reusable Section Component
const Section: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode; defaultOpen?: boolean }> = ({ title, icon, children, defaultOpen = true }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 overflow-hidden mb-4 shadow-sm">
      <button type="button" onClick={() => setIsOpen(!isOpen)} className="w-full flex items-center justify-between p-4 bg-stone-50 dark:bg-stone-800/30 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors">
        <div className="flex items-center gap-3">
          <span className="text-amber-600 dark:text-amber-500">{icon}</span>
          <h3 className="font-bold text-stone-900 dark:text-stone-100">{title}</h3>
        </div>
        {isOpen ? <ChevronUp className="w-4 h-4 text-stone-400" /> : <ChevronDown className="w-4 h-4 text-stone-400" />}
      </button>
      {isOpen && <div className="p-5 space-y-5">{children}</div>}
    </div>
  );
};

// Reusable Range Input
const SensorySlider: React.FC<{ label: string; value: number; onChange: (val: number) => void }> = ({ label, value, onChange }) => (
  <div>
    <div className="flex justify-between mb-2">
      <label className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">{label}</label>
      <span className="text-sm font-bold text-amber-700 dark:text-amber-500 bg-amber-50 dark:bg-amber-900/30 px-2 py-0.5 rounded">{value}/10</span>
    </div>
    <input type="range" min="1" max="10" step="0.5" value={value} onChange={(e) => onChange(Number(e.target.value))}
      className="w-full h-2 bg-stone-200 dark:bg-stone-700 rounded-lg appearance-none cursor-pointer accent-amber-600 hover:accent-amber-500" />
  </div>
);

const BrewForm: React.FC<Props> = ({ initialData, onSave, onCancel }) => {
  const [formData, setFormData] = useState<BrewRecipe>(initialData || { ...EMPTY_RECIPE, id: crypto.randomUUID(), date: new Date().toISOString() });

  const updateConfig = (field: keyof BrewConfig, value: any) => setFormData(p => ({ ...p, config: { ...p.config, [field]: value } }));
  const updateTechnique = (field: keyof Technique, value: any) => setFormData(p => ({ ...p, technique: { ...p.technique, [field]: value } }));
  const updateResult = (field: keyof SensoryResult, value: any) => setFormData(p => ({ ...p, result: { ...p.result, [field]: value } }));
  const updateLearning = (field: keyof LearningLog, value: any) => setFormData(p => ({ ...p, learning: { ...p.learning, [field]: value } }));

  // Calculate ratio
  const ratio = formData.config.dose > 0 ? (formData.config.waterAmount / formData.config.dose).toFixed(1) : '0';

  return (
    <form className="pb-24 max-w-2xl mx-auto w-full" onSubmit={(e) => { e.preventDefault(); onSave(formData); }}>
      <div className="flex items-center justify-between mb-6 sticky top-0 bg-[#fdf8f6] dark:bg-[#1c1917] z-10 py-4">
        <button type="button" onClick={onCancel} className="flex items-center text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 transition-colors font-medium">
          <ArrowLeft className="w-5 h-5 mr-1" /> Volver
        </button>
        <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100">
          {initialData ? 'Editar Receta' : 'Nueva Receta'}
        </h2>
        <button type="submit" className="bg-amber-600 hover:bg-amber-700 text-white p-2.5 rounded-full shadow-lg active:scale-95 transition-transform">
          <Save className="w-5 h-5" />
        </button>
      </div>

      {/* 1. Preparation Stats */}
      <Section title="Preparación" icon={<Sliders className="w-5 h-5" />}>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2 md:col-span-1">
            <label className="label">Método</label>
            <select className="input" value={formData.config.method} onChange={e => updateConfig('method', e.target.value)}>
              {METHODS.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div className="col-span-2 md:col-span-1">
             <label className="label">Dripper / Dispositivo</label>
             <input type="text" className="input" placeholder="Ej. V60 02 Plástico" value={formData.config.dripper || ''} onChange={e => updateConfig('dripper', e.target.value)} />
          </div>
          <div>
            <label className="label">Dosis (g)</label>
            <input type="number" step="0.1" className="input" value={formData.config.dose} onChange={e => updateConfig('dose', parseFloat(e.target.value))} />
          </div>
          <div>
            <label className="label">Agua (ml)</label>
            <input type="number" className="input" value={formData.config.waterAmount} onChange={e => updateConfig('waterAmount', parseFloat(e.target.value))} />
          </div>
          <div className="col-span-2 bg-stone-100 dark:bg-stone-800 p-3 rounded-xl text-center border border-stone-200 dark:border-stone-700">
             <span className="text-stone-500 text-xs uppercase tracking-wider font-bold">Ratio Calculado</span>
             <div className="font-bold text-stone-900 dark:text-stone-100 text-lg">1 : {ratio}</div>
          </div>
          <div>
            <label className="label">Temp. (°C)</label>
            <input type="number" className="input" value={formData.config.temperature} onChange={e => updateConfig('temperature', parseFloat(e.target.value))} />
          </div>
          <div>
             <label className="label">Molienda</label>
             <input type="text" className="input" placeholder="Ej. 2.4 o 20 clics" value={formData.config.grinderSetting} onChange={e => updateConfig('grinderSetting', e.target.value)} />
          </div>
        </div>
      </Section>

      {/* 2. Technique */}
      <Section title="Técnica" icon={<Droplets className="w-5 h-5" />}>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Bloom Agua (ml)</label>
            <input type="number" className="input" value={formData.technique.bloomWater} onChange={e => updateTechnique('bloomWater', Number(e.target.value))} />
          </div>
          <div>
            <label className="label">Bloom Tiempo (s)</label>
            <input type="number" className="input" value={formData.technique.bloomTime} onChange={e => updateTechnique('bloomTime', Number(e.target.value))} />
          </div>
          <div>
             <label className="label">Num. Vertidos</label>
             <input type="number" className="input" value={formData.technique.pours} onChange={e => updateTechnique('pours', Number(e.target.value))} />
          </div>
          <div>
             <label className="label">Tiempo Total</label>
             <input type="text" className="input" placeholder="03:00" value={formData.config.totalTime} onChange={e => updateConfig('totalTime', e.target.value)} />
          </div>
        </div>
      </Section>

      {/* 3. Sensory */}
      <Section title="Análisis Sensorial" icon={<Activity className="w-5 h-5" />}>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SensorySlider label="Aroma" value={formData.result.aroma} onChange={v => updateResult('aroma', v)} />
            <SensorySlider label="Acidez" value={formData.result.acidity} onChange={v => updateResult('acidity', v)} />
            <SensorySlider label="Dulzura" value={formData.result.sweetness} onChange={v => updateResult('sweetness', v)} />
            <SensorySlider label="Cuerpo" value={formData.result.body} onChange={v => updateResult('body', v)} />
            <SensorySlider label="Amargor" value={formData.result.bitterness} onChange={v => updateResult('bitterness', v)} />
            <SensorySlider label="Claridad" value={formData.result.clarity} onChange={v => updateResult('clarity', v)} />
            <SensorySlider label="Balance" value={formData.result.balance} onChange={v => updateResult('balance', v)} />
            <SensorySlider label="Retrogusto" value={formData.result.aftertaste} onChange={v => updateResult('aftertaste', v)} />
          </div>
          <div>
            <label className="label">Notas de Sabor</label>
            <textarea className="input" rows={2} placeholder="Cítrico, Chocolate, Jazmín..." value={formData.result.flavorNotes} onChange={e => updateResult('flavorNotes', e.target.value)} />
          </div>
          <div>
            <label className="label">Sensación General</label>
            <textarea className="input" rows={2} placeholder="Una taza placentera, similar a té..." value={formData.result.generalFeeling} onChange={e => updateResult('generalFeeling', e.target.value)} />
          </div>
          <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-xl border border-amber-100 dark:border-amber-900/30">
             <SensorySlider label="Puntaje General" value={formData.result.overallScore} onChange={v => updateResult('overallScore', v)} />
          </div>
        </div>
      </Section>

      {/* 4. Learning & Diagnosis */}
      <Section title="Ajustes y Aprendizaje" icon={<BrainCircuit className="w-5 h-5" />}>
        <div className="space-y-5">
          <div>
             <label className="label">Diagnóstico de Extracción</label>
             <div className="flex gap-2">
               {['Sub-extraído', 'Balanceado', 'Sobre-extraído'].map((d) => (
                 <button
                   key={d}
                   type="button"
                   onClick={() => updateLearning('diagnosis', d)}
                   className={`flex-1 py-3 px-1 text-[10px] sm:text-xs font-bold rounded-xl border transition-all active:scale-95 ${
                     formData.learning.diagnosis === d 
                     ? 'bg-stone-800 text-white dark:bg-stone-100 dark:text-stone-900 border-stone-800 dark:border-stone-100 shadow-sm' 
                     : 'bg-transparent text-stone-500 border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800'
                   }`}
                 >
                   {d}
                 </button>
               ))}
             </div>
          </div>
          
          <div>
            <label className="label">Cambios desde la anterior</label>
            <input type="text" className="input" placeholder="Ej. Molienda más gruesa (2.2 -> 2.4)" value={formData.learning.changesFromPrevious} onChange={e => updateLearning('changesFromPrevious', e.target.value)} />
          </div>

          <div>
            <label className="label text-amber-700 dark:text-amber-500">¿Qué cambiar en la próxima?</label>
            <textarea className="input border-amber-200 dark:border-amber-900 focus:ring-amber-500 bg-amber-50/50 dark:bg-amber-900/10" rows={2} placeholder="Ej. Subir temperatura para resaltar acidez..." value={formData.learning.changesForNextTime} onChange={e => updateLearning('changesForNextTime', e.target.value)} />
          </div>
        </div>
      </Section>

      <style>{`
        .label { @apply block text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-1.5; }
        .input { @apply w-full p-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-amber-500 outline-none transition-all placeholder:text-stone-400; }
      `}</style>
    </form>
  );
};

export default BrewForm;