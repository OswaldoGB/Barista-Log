export type RoastLevel = 'Claro' | 'Medio' | 'Medio-Oscuro' | 'Oscuro';
export type ProcessType = 'Lavado' | 'Natural' | 'Honey' | 'Experimental' | 'Anaeróbico' | 'Maceración Carbónica';
export type BrewMethod = 'V60' | 'Origami' | 'Kalita Wave' | 'Aeropress' | 'Prensa Francesa' | 'Espresso' | 'Chemex' | 'Switch' | 'Otro';
export type ExtractionDiagnosis = 'Sub-extraído' | 'Balanceado' | 'Sobre-extraído';

export interface PourStep {
  volume: number;
  time: number; // seconds cumulative
  type: 'Bloom' | 'Vertido';
}

// Parent Entity
export interface CoffeeBean {
  id: string;
  name: string;
  roaster: string;
  origin: string; // Country/Region
  farm?: string;
  altitude?: string;
  variety?: string;
  process: ProcessType | string;
  roastDate: string;
  openDate?: string;
  roastLevel: RoastLevel;
  notes?: string;
  isArchived: boolean;
  recipes: BrewRecipe[]; // Nested Recipes
}

export interface BrewConfig {
  method: BrewMethod;
  dripper?: string; // Specific model (e.g., Plastic V60 02)
  filterType: string;
  grinderModel: string;
  grinderSetting: string; // Changed to string to allow "2.4" or "20 clicks"
  dose: number; // grams
  waterAmount: number; // ml
  temperature: number; // Celsius
  totalTime: string; // mm:ss
}

export interface Technique {
  bloomWater: number; // ml
  bloomTime: number; // seconds
  pours: number; // count
  notes?: string;
}

export interface SensoryResult {
  aroma: number;
  acidity: number;
  sweetness: number;
  bitterness: number;
  body: number;
  clarity: number;
  balance: number;
  aftertaste: number; // Retrogusto
  flavorNotes: string;
  overallScore: number; // 1-10
  generalFeeling: string; // Text description
}

export interface LearningLog {
  diagnosis: ExtractionDiagnosis;
  changesForNextTime: string; // What to change
  changesFromPrevious: string; // What changed from last time
}

// Child Entity
export interface BrewRecipe {
  id: string;
  date: string;
  config: BrewConfig;
  technique: Technique;
  result: SensoryResult;
  learning: LearningLog;
}

export interface Diagnosis {
  status: 'Sub-extraído' | 'Balanceado' | 'Sobre-extraído' | 'Excelente';
  suggestions: string[];
}

export interface BrewLog extends BrewRecipe {
  profile: {
    name: string;
    roaster: string;
  };
}