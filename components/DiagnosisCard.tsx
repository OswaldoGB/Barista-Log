import React from 'react';
import { SensoryResult, Diagnosis, BrewConfig } from '../types';
import { CheckCircle, TrendingUp, TrendingDown } from 'lucide-react';
import { TRANSLATIONS, LABELS } from '../constants';

interface Props {
  result: SensoryResult;
  config: BrewConfig;
  lang: 'es' | 'en';
}

export const generateDiagnosis = (result: SensoryResult, config: BrewConfig, lang: 'es' | 'en'): Diagnosis => {
  const t = TRANSLATIONS[lang];
  const suggestions: string[] = [];
  let status: Diagnosis['status'] = 'Balanceado';

  // Heurística básica
  if (result.acidity >= 7 && result.sweetness <= 4) {
    status = 'Sub-extraído';
    suggestions.push(t.sugg_fine);
    suggestions.push(t.sugg_tempUp);
    suggestions.push(t.sugg_moreWater);
    suggestions.push(t.sugg_agitate);
  } 
  else if (result.bitterness >= 7 || (result.balance <= 4 && result.bitterness > result.acidity)) {
    status = 'Sobre-extraído';
    suggestions.push(t.sugg_coarse);
    suggestions.push(t.sugg_tempDown);
    suggestions.push(t.sugg_lessWater);
    suggestions.push(t.sugg_gentle);
  }
  else if (result.overallScore >= 8) {
    status = 'Excelente';
    suggestions.push(t.sugg_excellent);
  }

  return { status, suggestions };
};

const DiagnosisCard: React.FC<Props> = ({ result, config, lang }) => {
  const t = TRANSLATIONS[lang];
  const diagnosis = generateDiagnosis(result, config, lang);
  const displayStatus = LABELS.diagnosis[diagnosis.status][lang];
  
  if (diagnosis.status === 'Balanceado' || diagnosis.status === 'Excelente') {
    return (
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mt-4">
        <div className="flex items-center gap-2 mb-2">
          <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
          <h3 className="font-semibold text-green-800 dark:text-green-200">{t.diagnosisGood}</h3>
        </div>
        <p className="text-sm text-green-700 dark:text-green-300">
          {t.diagnosisGoodDesc}
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
          {t.detected}: {displayStatus}
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