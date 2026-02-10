import { CoffeeBean, BrewRecipe, BrewMethod, ProcessType, RoastLevel } from './types';

export const METHODS: BrewMethod[] = ['V60', 'Origami', 'Kalita Wave', 'Aeropress', 'Prensa Francesa', 'Espresso', 'Chemex', 'Switch', 'Otro'];
export const ROAST_LEVELS: RoastLevel[] = ['Claro', 'Medio', 'Medio-Oscuro', 'Oscuro'];
export const PROCESSES: ProcessType[] = ['Lavado', 'Natural', 'Honey', 'Experimental', 'Anaeróbico', 'Maceración Carbónica'];

export const EMPTY_BEAN: CoffeeBean = {
  id: '',
  name: '',
  roaster: '',
  origin: '',
  process: 'Lavado',
  roastDate: '',
  roastLevel: 'Claro',
  isArchived: false,
  recipes: []
};

export const EMPTY_RECIPE: BrewRecipe = {
  id: '',
  date: new Date().toISOString(),
  config: {
    method: 'V60',
    dripper: '',
    filterType: 'Papel',
    grinderModel: '',
    grinderSetting: '',
    dose: 15,
    waterAmount: 240,
    temperature: 93,
    totalTime: '02:30',
  },
  technique: {
    bloomWater: 45,
    bloomTime: 30,
    pours: 2,
    notes: '',
  },
  result: {
    aroma: 5,
    acidity: 5,
    sweetness: 5,
    bitterness: 5,
    body: 5,
    balance: 5,
    clarity: 5,
    aftertaste: 5,
    flavorNotes: '',
    overallScore: 5,
    generalFeeling: '',
  },
  learning: {
    diagnosis: 'Balanceado',
    changesForNextTime: '',
    changesFromPrevious: '',
  }
};