import { get, set, del } from 'idb-keyval';
import type { Place, StudentPortfolio } from '../types';

const STORAGE_KEYS = {
  PLACES: 'meu-lugar-places',
  PORTFOLIO: 'meu-lugar-portfolio',
  SETTINGS: 'meu-lugar-settings'
};

export class StorageService {
  // Gerenciar lugares no localStorage
  static getPlaces(): Place[] {
    try {
      const places = localStorage.getItem(STORAGE_KEYS.PLACES);
      const parsedPlaces = places ? JSON.parse(places) : [];
      
      // Garantir compatibilidade com dados antigos - adicionar campos críticos se não existirem
      return parsedPlaces.map((place: Place) => ({
        ...place,
        whatWouldChange: place.whatWouldChange || '',
        criticalCharacteristics: place.criticalCharacteristics || undefined,
        spacePerception: place.spacePerception || undefined
      }));
    } catch (error) {
      console.error('Erro ao carregar lugares:', error);
      return [];
    }
  }

  static savePlaces(places: Place[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.PLACES, JSON.stringify(places));
    } catch (error) {
      console.error('Erro ao salvar lugares:', error);
    }
  }

  static addPlace(place: Place): void {
    const places = this.getPlaces();
    places.push(place);
    this.savePlaces(places);
  }

  static updatePlace(updatedPlace: Place): void {
    const places = this.getPlaces();
    const index = places.findIndex(p => p.id === updatedPlace.id);
    if (index !== -1) {
      places[index] = updatedPlace;
      this.savePlaces(places);
    }
  }

  static deletePlace(placeId: string): void {
    const places = this.getPlaces();
    const filteredPlaces = places.filter(p => p.id !== placeId);
    this.savePlaces(filteredPlaces);
  }

  // Gerenciar portfólio no localStorage
  static getPortfolio(): StudentPortfolio | null {
    try {
      const portfolio = localStorage.getItem(STORAGE_KEYS.PORTFOLIO);
      return portfolio ? JSON.parse(portfolio) : null;
    } catch (error) {
      console.error('Erro ao carregar portfólio:', error);
      return null;
    }
  }

  static savePortfolio(portfolio: StudentPortfolio): void {
    try {
      localStorage.setItem(STORAGE_KEYS.PORTFOLIO, JSON.stringify(portfolio));
    } catch (error) {
      console.error('Erro ao salvar portfólio:', error);
    }
  }

  // Gerenciar mídia no IndexedDB
  static async saveMedia(key: string, data: Blob): Promise<void> {
    try {
      await set(key, data);
    } catch (error) {
      console.error('Erro ao salvar mídia:', error);
      throw error;
    }
  }

  static async getMedia(key: string): Promise<Blob | null> {
    try {
      return await get(key) || null;
    } catch (error) {
      console.error('Erro ao carregar mídia:', error);
      return null;
    }
  }

  static async deleteMedia(key: string): Promise<void> {
    try {
      await del(key);
    } catch (error) {
      console.error('Erro ao deletar mídia:', error);
      throw error;
    }
  }

  // Exportar/Importar dados
  static exportData(): string {
    const places = this.getPlaces();
    const portfolio = this.getPortfolio();
    
    const exportData = {
      places,
      portfolio,
      exportDate: new Date().toISOString(),
      version: '1.0'
    };

    return JSON.stringify(exportData, null, 2);
  }

  static importData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      
      if (data.places && Array.isArray(data.places)) {
        this.savePlaces(data.places);
      }
      
      if (data.portfolio) {
        this.savePortfolio(data.portfolio);
      }
      
      return true;
    } catch (error) {
      console.error('Erro ao importar dados:', error);
      return false;
    }
  }

  // Limpar todos os dados
  static clearAllData(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.PLACES);
      localStorage.removeItem(STORAGE_KEYS.PORTFOLIO);
      localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    } catch (error) {
      console.error('Erro ao limpar dados:', error);
    }
  }

  // Gerar ID único
  static generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}
