import React from 'react';
import { SensoryResult, Diagnosis, BrewConfig } from '../types';
import { CheckCircle, TrendingUp, TrendingDown } from 'lucide-react';

interface Props {
  result: SensoryResult;
  config: BrewConfig;
}

export const generateDiagnosis = (result: SensoryResult, config: BrewConfig): Diagnosis => {
  const suggestions: string[] = [];
  let status: Diagnosis['status'] = 'Balanceado';

  // Heurística básica para Filtrados
  // Alta Acidez + Baja Dulzura = Ácido/Sub-extraído
  if (result.acidity >= 7 && result.sweetness <= 4) {
    status = 'Sub-extraído';
    suggestions.push('Moler más fino (aumentar superficie de contacto).');
    suggestions.push('Subir la temperatura del agua.');
    suggestions.push('Usar más agua (aumentar ratio).');
    suggestions.push('Agitar más durante el bloom.');
  } 
  // Alto Amargor + Retrogusto Seco = Astringente/Sobre-extraído
  else if (result.bitterness >= 7 || (result.balance <= 4 && result.bitterness > result.acidity)) {
    status = 'Sobre-extraído';
    suggestions.push('Moler más grueso.');
    suggestions.push('Bajar la temperatura del agua.');
    suggestions.push('Usar menos agua (disminuir ratio).');
    suggestions.push('Verter más suavemente para reducir turbulencia.');
  }
  // Rango ideal
  else if (result.overallScore >= 8) {
    status = 'Excelente';
    suggestions.push('¡Gran extracción! Intenta replicar la receta exactamente para confirmar consistencia.');
  }

  return { status, suggestions };
};

const DiagnosisCard: React.FC<Props> = ({ result, config }) => {
  const diagnosis = generateDiagnosis(result, config);
  
  if (diagnosis.status === 'Balanceado' || diagnosis.status === 'Excelente') {
    return (
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mt-4">
        <div className="flex items-center gap-2 mb-2">
          <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
          <h3 className="font-semibold text-green-800 dark:text-green-200">¡Muy buen balance!</h3>
        </div>
        <p className="text-sm text-green-700 dark:text-green-300">
          Tus puntajes sensoriales indican una taza bien extraída.
        </p>
      </div>
    );
  }

  const isUnder = diagnosis.status === 'Sub-extraído';

  return (
    <div className={`rounded-lg p-4 mt-4 border ${isUnder ? 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800' : 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'}`}>
      <div className="flex items-center gap-2 mb-3">
        {isUnder ? <TrendingDown className="w-5 h-5 text-yellow-600" /> : <TrendingUp className="w-5 h-5 text-red-600" />}
        <h3 className={`font-semibold ${isUnder ? 'text-yellow-800 dark:text-yellow-200' : 'text-red-800 dark:text-red-200'}`}>
          Detectado: {diagnosis.status}
        </h3>
      </div>
      
      <ul className="space-y-1">
        {diagnosis.suggestions.map((s, i) => (
          <li key={i} className="text-sm flex items-start gap-2 text-gray-700 dark:text-gray-300">
             <span className="mt-1.5 block w-1.5 h-1.5 rounded-full bg-gray-400 flex-shrink-0" />
             <span>{s}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DiagnosisCard;