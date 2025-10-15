// Box storage utility for tracking opened boxes
const BOX_STORAGE_KEY = 'pokepixel_opened_boxes';

// Cooldown periods in milliseconds
const COOLDOWN_PERIODS = {
  static: 15 * 60 * 1000, // 1 hour for static boxes
  dynamic: 0 // No cooldown for dynamic boxes
};

export interface BoxId {
  mapId: string;
  x: number;
  y: number;
  type: 'static' | 'dynamic';
}

export interface OpenedBoxData {
  boxId: string;
  openedAt: number;
}

class BoxStorage {
  private getOpenedBoxes(): OpenedBoxData[] {
    try {
      const stored = localStorage.getItem(BOX_STORAGE_KEY);
      if (!stored) return [];
      
      const data: OpenedBoxData[] = JSON.parse(stored);
      return data;
    } catch (error) {
      console.warn('Failed to load opened boxes from localStorage:', error);
      return [];
    }
  }

  private saveOpenedBoxes(openedBoxes: OpenedBoxData[]): void {
    try {
      localStorage.setItem(BOX_STORAGE_KEY, JSON.stringify(openedBoxes));
    } catch (error) {
      console.warn('Failed to save opened boxes to localStorage:', error);
    }
  }

  public generateBoxId(boxId: BoxId): string {
    return `${boxId.mapId}_${boxId.x}_${boxId.y}_${boxId.type}`;
  }

  public isBoxOpened(boxId: BoxId): boolean {
    const openedBoxes = this.getOpenedBoxes();
    const id = this.generateBoxId(boxId);
    
    const boxData = openedBoxes.find(item => item.boxId === id);
    if (!boxData) {
      return false;
    }
    
    // Check if the box is still on cooldown
    const cooldownPeriod = COOLDOWN_PERIODS[boxId.type] || 0;
    const timeElapsed = Date.now() - boxData.openedAt;
    
    // If cooldown period has passed, remove the box from storage and return false
    if (timeElapsed >= cooldownPeriod) {
      this.removeBoxFromStorage(id);
      return false;
    }
    
    // Box is still on cooldown
    return true;
  }

  public markBoxAsOpened(boxId: BoxId): void {
    const openedBoxes = this.getOpenedBoxes();
    const id = this.generateBoxId(boxId);
    
    // Remove any existing entry for this box
    const filteredBoxes = openedBoxes.filter(item => item.boxId !== id);
    
    // Add the new entry
    filteredBoxes.push({
      boxId: id,
      openedAt: Date.now()
    });
    
    this.saveOpenedBoxes(filteredBoxes);
  }

  private removeBoxFromStorage(boxId: string): void {
    const openedBoxes = this.getOpenedBoxes();
    const filteredBoxes = openedBoxes.filter(item => item.boxId !== boxId);
    this.saveOpenedBoxes(filteredBoxes);
  }

  public clearAllOpenedBoxes(): void {
    try {
      localStorage.removeItem(BOX_STORAGE_KEY);
    } catch (error) {
      console.warn('Failed to clear opened boxes from localStorage:', error);
    }
  }

  public getOpenedBoxesCount(): number {
    return this.getOpenedBoxes().length;
  }
}

// Export singleton instance
export const boxStorage = new BoxStorage();