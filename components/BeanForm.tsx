import React, { useState } from 'react';
import { CoffeeBean } from '../types';
import { EMPTY_BEAN, PROCESSES, ROAST_LEVELS } from '../constants';
import { Save, X, Coffee } from 'lucide-react';

interface Props {
  initialData?: CoffeeBean;
  onSave: (bean: CoffeeBean) => void;
  onCancel: () => void;
}

const BeanForm: React.FC<Props> = ({ initialData, onSave, onCancel }) => {
  const [formData, setFormData] = useState<CoffeeBean>(
    initialData || { ...EMPTY_BEAN, id: crypto.randomUUID() }
  );

  const handleChange = (field: keyof CoffeeBean, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }} className="max-w-2xl mx-auto bg-white dark:bg-stone-900 p-6 rounded-2xl shadow-sm border border-stone-200 dark:border-stone-800 w-full">
      <div className="flex justify-between items-center mb-6 border-b border-stone-100 dark:border-stone-800 pb-4">
        <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
          <Coffee className="w-6 h-6 text-amber-600" />
          {initialData ? 'Editar Café' : 'Nuevo Café'}
        </h2>
        <button type="button" onClick={onCancel} className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200">
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="space-y-6">
        {/* Información Básica */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="col-span-1 md:col-span-2">
            <label className="label">Nombre del Café</label>
            <input required type="text" className="input" 
              value={formData.name} onChange={e => handleChange('name', e.target.value)} placeholder="Ej. El Paraiso Lychee" />
          </div>
          <div>
            <label className="label">Tostador</label>
            <input required type="text" className="input" 
              value={formData.roaster} onChange={e => handleChange('roaster', e.target.value)} placeholder="Ej. Café Estelar"/>
          </div>
          <div>
            <label className="label">País y Región</label>
            <input required type="text" className="input" 
              value={formData.origin} onChange={e => handleChange('origin', e.target.value)} placeholder="Ej. Colombia, Cauca"/>
          </div>
        </div>

        {/* Detalles */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Finca / Productor</label>
            <input type="text" className="input" 
              value={formData.farm || ''} onChange={e => handleChange('farm', e.target.value)} />
          </div>
          <div>
            <label className="label">Altitud (msnm)</label>
            <input type="text" className="input" 
              value={formData.altitude || ''} onChange={e => handleChange('altitude', e.target.value)} />
          </div>
          <div>
            <label className="label">Variedad</label>
            <input type="text" className="input" 
              value={formData.variety || ''} onChange={e => handleChange('variety', e.target.value)} placeholder="Ej. Geisha, Borbón"/>
          </div>
          <div>
            <label className="label">Proceso</label>
            <select className="input" value={formData.process} onChange={e => handleChange('process', e.target.value)}>
              {PROCESSES.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
        </div>

        {/* Fechas y Tueste */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <label className="label">Fecha Tueste</label>
            <input type="date" className="input" 
              value={formData.roastDate} onChange={e => handleChange('roastDate', e.target.value)} />
          </div>
          <div>
            <label className="label">Fecha Apertura</label>
            <input type="date" className="input" 
              value={formData.openDate || ''} onChange={e => handleChange('openDate', e.target.value)} />
          </div>
          <div className="col-span-2 md:col-span-1">
            <label className="label">Nivel de Tueste</label>
            <select className="input" value={formData.roastLevel} onChange={e => handleChange('roastLevel', e.target.value)}>
              {ROAST_LEVELS.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-stone-100 dark:border-stone-800">
        <button type="button" onClick={onCancel} className="btn-secondary">Cancelar</button>
        <button type="submit" className="btn-primary flex items-center gap-2">
          <Save className="w-4 h-4" /> Guardar
        </button>
      </div>

      <style>{`
        .label { @apply block text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-1.5; }
        .input { @apply w-full p-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-amber-500 outline-none transition-all placeholder:text-stone-400; }
        .btn-primary { @apply px-6 py-3 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 rounded-xl font-bold hover:bg-stone-800 dark:hover:bg-white transition-colors shadow-sm active:scale-95; }
        .btn-secondary { @apply px-6 py-3 text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-xl font-medium transition-colors active:scale-95; }
      `}</style>
    </form>
  );
};

export default BeanForm;