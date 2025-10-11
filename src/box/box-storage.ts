// Box storage utility for tracking opened boxes
const BOX_STORAGE_KEY = 'pokepixel_opened_boxes';

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
  private getOpenedBoxes(): Set<string> {
    try {
      const stored = localStorage.getItem(BOX_STORAGE_KEY);
      if (!stored) return new Set();
      
      const data: OpenedBoxData[] = JSON.parse(stored);
      return new Set(data.map(item => item.boxId));
    } catch (error) {
      console.warn('Failed to load opened boxes from localStorage:', error);
      return new Set();
    }
  }

  private saveOpenedBoxes(openedBoxes: Set<string>): void {
    try {
      const now = Date.now();
      const data: OpenedBoxData[] = Array.from(openedBoxes).map(boxId => ({
        boxId,
        openedAt: now
      }));
      localStorage.setItem(BOX_STORAGE_KEY, JSON.stringify(data));
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
    return openedBoxes.has(id);
  }

  public markBoxAsOpened(boxId: BoxId): void {
    const openedBoxes = this.getOpenedBoxes();
    const id = this.generateBoxId(boxId);
    openedBoxes.add(id);
    this.saveOpenedBoxes(openedBoxes);
  }

  public clearAllOpenedBoxes(): void {
    try {
      localStorage.removeItem(BOX_STORAGE_KEY);
    } catch (error) {
      console.warn('Failed to clear opened boxes from localStorage:', error);
    }
  }

  public getOpenedBoxesCount(): number {
    return this.getOpenedBoxes().size;
  }
}

// Export singleton instance
export const boxStorage = new BoxStorage();