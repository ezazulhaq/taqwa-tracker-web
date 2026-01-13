import { Component, ChangeDetectionStrategy, signal, computed, effect, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { TitleComponent } from '../../../shared/title/title.component';
import { WordSearchLevel, WordSearchState, Cell, WordSearchWord } from './word-search.model';
import { WORD_SEARCH_LEVELS } from './word-search.data';

@Component({
  selector: 'app-word-search',
  imports: [CommonModule, TitleComponent],
  templateUrl: './word-search.component.html',
  styleUrl: './word-search.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: "app-bg"
  }
})
export class WordSearchComponent {
  // Platform detection for SSR compatibility
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  // Config
  private readonly ARABIC_ALPHABET = 'ابتثجحخدذرزسشصضطظعغفقكلمنوهي';

  // Screen size detection
  public readonly windowWidth = signal<number>(this.isBrowser ? window.innerWidth : 1024);
  private resizeTimeout: any = null;

  // Dynamic grid size based on screen width
  public readonly dynamicGridSize = computed(() => {
    const width = this.windowWidth();
    if (width < 640) return 8;  // Mobile
    if (width < 1024) return 10; // Tablet
    return 12; // Desktop
  });

  // State
  public readonly state = signal<WordSearchState>({
    currentLevelId: 0, // 0 means selection screen
    levels: WORD_SEARCH_LEVELS,
    grid: [],
    selectionStart: null,
    currentSelection: [],
    currentWords: [],
    foundWords: [],
    isGameComplete: false,
    score: 0
  });

  // Computed
  public readonly currentLevel = computed(() => {
    const id = this.state().currentLevelId;
    return this.state().levels.find(l => l.id === id) || null;
  });

  public readonly isSelectionActive = computed(() => this.state().currentSelection.length > 0);

  constructor() {
    // Setup resize listener
    if (this.isBrowser) {
      window.addEventListener('resize', this.handleResize.bind(this));
    }

    // Effect to regenerate grid when screen size changes during active game
    effect(() => {
      const gridSize = this.dynamicGridSize();
      const currentState = this.state();

      // Only regenerate if game is active and grid size actually changed
      if (currentState.currentLevelId > 0 && currentState.grid.length > 0 && currentState.grid.length !== gridSize) {
        // Regenerate grid with new size while preserving game state
        const newGrid = this.generateGrid(gridSize, currentState.currentWords);

        // Re-mark found words in the new grid
        if (currentState.foundWords.length > 0) {
          this.reapplyFoundWords(newGrid, currentState.currentWords, currentState.foundWords);
        }

        this.state.update(s => ({
          ...s,
          grid: newGrid,
          currentSelection: [],
          selectionStart: null
        }));
      }
    });
  }

  // Methods

  /** Handle window resize with debouncing */
  private handleResize() {
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
    }
    this.resizeTimeout = setTimeout(() => {
      if (this.isBrowser) {
        this.windowWidth.set(window.innerWidth);
      }
    }, 300);
  }

  /** Start a specific level */
  public startLevel(levelId: number) {
    const level = this.state().levels.find(l => l.id === levelId);
    if (!level) return;

    // Pick 5 random words from the level's pool
    const pool = [...level.words];
    const sessionWords: WordSearchWord[] = [];
    for (let i = 0; i < 5 && pool.length > 0; i++) {
      const randomIndex = Math.floor(Math.random() * pool.length);
      sessionWords.push(pool.splice(randomIndex, 1)[0]);
    }

    // Use dynamic grid size instead of level.gridSize
    const gridSize = this.dynamicGridSize();

    this.state.update(s => ({
      ...s,
      currentLevelId: levelId,
      currentWords: sessionWords,
      grid: this.generateGrid(gridSize, sessionWords),
      foundWords: [],
      isGameComplete: false,
      score: 0,
      currentSelection: [],
      selectionStart: null
    }));
  }

  /** Back to level selection */
  public reset() {
    this.state.update(s => ({
      ...s,
      currentLevelId: 0,
      currentWords: [],
      grid: [],
      foundWords: [],
      isGameComplete: false
    }));
  }

  /** Grid Generation Logic */
  private generateGrid(size: number, words: WordSearchWord[]): Cell[][] {
    let grid: Cell[][] = Array(size).fill(null).map((_, row) =>
      Array(size).fill(null).map((_, col) => ({
        row,
        col,
        value: '',
        selected: false,
        found: false
      }))
    );

    // 1. Place words
    // Sort words by length (longest first) to reduce collision chances
    const wordsToPlace = [...words].sort((a, b) => b.arabic.length - a.arabic.length);

    for (const word of wordsToPlace) {
      this.placeWordInGrid(grid, word.arabic);
    }

    // 2. Fill empty cells
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (!grid[r][c].value) {
          grid[r][c].value = this.getRandomArabicLetter();
        }
      }
    }

    return grid;
  }

  /**
   * Re-mark found words in a newly generated grid
   */
  private reapplyFoundWords(grid: Cell[][], words: WordSearchWord[], foundWords: string[]) {
    for (const foundWord of foundWords) {
      const word = words.find(w => w.arabic === foundWord);
      if (!word) continue;

      // Search for the word in the new grid
      const wordCells = this.findWordInGrid(grid, word.arabic);
      if (wordCells.length > 0) {
        // Mark cells as found
        wordCells.forEach(cell => {
          grid[cell.row][cell.col].found = true;
        });
      }
    }
  }

  /**
   * Find a word in the grid and return its cell positions
   */
  private findWordInGrid(grid: Cell[][], word: string): Cell[] {
    const size = grid.length;
    const directions = [
      [0, 1],   // Horizontal
      [1, 0],   // Vertical
      [1, 1],   // Diagonal
      [0, -1],  // Horizontal reverse
      [-1, 0],  // Vertical reverse
      [-1, -1], // Diagonal reverse
    ];

    // Search all positions and directions
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        for (const [dr, dc] of directions) {
          const cells = this.checkWordAtPosition(grid, word, row, col, dr, dc);
          if (cells.length > 0) {
            return cells;
          }
        }
      }
    }
    return [];
  }

  /**
   * Check if a word exists at a specific position and direction
   */
  private checkWordAtPosition(grid: Cell[][], word: string, startRow: number, startCol: number, dr: number, dc: number): Cell[] {
    const size = grid.length;
    const cells: Cell[] = [];

    for (let i = 0; i < word.length; i++) {
      const r = startRow + (i * dr);
      const c = startCol + (i * dc);

      // Check bounds
      if (r < 0 || r >= size || c < 0 || c >= size) {
        return [];
      }

      // Check if letter matches
      if (grid[r][c].value !== word[i]) {
        return [];
      }

      cells.push(grid[r][c]);
    }

    return cells;
  }

  private placeWordInGrid(grid: Cell[][], word: string): boolean {
    const size = grid.length;
    const directions = [
      [0, 1],   // Horizontal
      [1, 0],   // Vertical
      [1, 1],   // Diagonal
      [0, -1],  // Horizontal reverse
      [-1, 0],  // Vertical reverse
    ];

    // Try finding a valid spot
    let placed = false;
    let attempts = 0;
    while (!placed && attempts < 100) {
      const dir = directions[Math.floor(Math.random() * directions.length)];
      const startRow = Math.floor(Math.random() * size);
      const startCol = Math.floor(Math.random() * size);

      if (this.canPlaceWord(grid, word, startRow, startCol, dir[0], dir[1])) {
        // Place it
        for (let i = 0; i < word.length; i++) {
          const r = startRow + (i * dir[0]);
          const c = startCol + (i * dir[1]);
          grid[r][c].value = word[i];
        }
        placed = true;
      }
      attempts++;
    }
    return placed;
  }

  private canPlaceWord(grid: Cell[][], word: string, row: number, col: number, dr: number, dc: number): boolean {
    const size = grid.length;

    // Check bounds
    const endRow = row + (word.length - 1) * dr;
    const endCol = col + (word.length - 1) * dc;

    if (endRow < 0 || endRow >= size || endCol < 0 || endCol >= size) return false;

    // Check collisions
    for (let i = 0; i < word.length; i++) {
      const r = row + (i * dr);
      const c = col + (i * dc);
      const cell = grid[r][c];

      // Valid if empty or matching letter
      if (cell.value !== '' && cell.value !== word[i]) {
        return false;
      }
    }
    return true;
  }

  private getRandomArabicLetter(): string {
    return this.ARABIC_ALPHABET[Math.floor(Math.random() * this.ARABIC_ALPHABET.length)];
  }

  /** Interaction Handlers */

  public onCellDown(cell: Cell) {
    if (this.state().isGameComplete) return;

    this.state.update(s => ({
      ...s,
      selectionStart: cell,
      currentSelection: [cell]
    }));
    this.updateSelectionHighlight([cell]);
  }

  public onCellEnter(cell: Cell) {
    // Only process if we are currently dragging (selectionStart is set)
    const s = this.state();
    if (!s.selectionStart || s.isGameComplete) return;

    // Calculate line from start to current
    const start = s.selectionStart;
    const end = cell;

    const newSelection = this.getCellsLine(start, end, s.grid);
    if (newSelection.length > 0) {
      this.state.update(prev => ({
        ...prev,
        currentSelection: newSelection
      }));
      this.updateSelectionHighlight(newSelection);
    }
  }

  public handleTouchMove(event: TouchEvent) {
    if (this.state().isGameComplete) return;

    // Prevent scrolling while playing
    if (this.state().selectionStart) {
      event.preventDefault();
    }

    const touch = event.touches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    const cellElement = element?.closest('.cell');

    if (cellElement) {
      const row = parseInt(cellElement.getAttribute('data-row') || '-1');
      const col = parseInt(cellElement.getAttribute('data-col') || '-1');

      if (row >= 0 && col >= 0) {
        const cell = this.state().grid[row][col];
        this.onCellEnter(cell);
      }
    }
  }

  public handleMouseMove(event: MouseEvent) {
    if (this.state().isGameComplete || !this.state().selectionStart) return;

    // Check if primary button is held down (buttons=1)
    if (event.buttons !== 1) {
      this.onCellUp(); // Safety release if button was released outside window
      return;
    }

    const element = document.elementFromPoint(event.clientX, event.clientY);
    const cellElement = element?.closest('.cell');

    if (cellElement) {
      const row = parseInt(cellElement.getAttribute('data-row') || '-1');
      const col = parseInt(cellElement.getAttribute('data-col') || '-1');

      if (row >= 0 && col >= 0) {
        const cell = this.state().grid[row][col];
        this.onCellEnter(cell);
      }
    }
  }

  public onCellUp() {
    const s = this.state();
    if (!s.selectionStart || s.isGameComplete) return;

    // Validate selection
    const selectedWord = s.currentSelection.map(c => c.value).join('');
    const reversedWord = s.currentSelection.map(c => c.value).reverse().join('');

    // Check both normal and reverse direction (since user can drag either way)
    const matchedWord = s.currentWords.find(
      w => (w.arabic === selectedWord || w.arabic === reversedWord) && !s.foundWords.includes(w.arabic)
    );

    if (matchedWord) {
      // Success!
      // Mark cells as found
      const newGrid = [...s.grid];
      s.currentSelection.forEach(cell => {
        newGrid[cell.row][cell.col].found = true;
      });

      const newFoundWords = [...s.foundWords, matchedWord.arabic];
      const isComplete = newFoundWords.length === s.currentWords.length;

      this.state.update(prev => ({
        ...prev,
        grid: newGrid,
        foundWords: newFoundWords,
        score: prev.score + (matchedWord.arabic.length * 10),
        isGameComplete: isComplete,
        selectionStart: null,
        currentSelection: []
      }));
    } else {
      // Clear selection
      this.state.update(prev => ({
        ...prev,
        selectionStart: null,
        currentSelection: []
      }));
    }

    // Clear highlights
    this.updateSelectionHighlight([]);
  }

  /** 
   * Updates visual 'selected' state of cells without committing
   */
  private updateSelectionHighlight(selection: Cell[]) {
    // We update the grid merely to update visuals. 
    // This could be optimized but for small grids it's fine.

    // 1. Reset all 'selected' but keep 'found'
    this.state.update(s => {
      const newGrid = s.grid.map(row =>
        row.map(cell => ({ ...cell, selected: false }))
      );

      // 2. Mark new selection
      selection.forEach(sel => {
        if (newGrid[sel.row] && newGrid[sel.row][sel.col]) {
          newGrid[sel.row][sel.col].selected = true;
        }
      });

      return { ...s, grid: newGrid };
    });
  }

  /**
   * Returns a line of cells between start and end if they are aligned
   * (horizontal, vertical, or diagonal). Otherwise returns just [end] (or empty).
   */
  private getCellsLine(start: Cell, end: Cell, grid: Cell[][]): Cell[] {
    const dRow = end.row - start.row;
    const dCol = end.col - start.col;

    // Check alignment
    if (dRow === 0 && dCol === 0) return [start];

    // Horizontal
    if (dRow === 0) {
      const step = dCol > 0 ? 1 : -1;
      const cells: Cell[] = [];
      for (let c = 0; Math.abs(c) <= Math.abs(dCol); c += step) {
        cells.push(grid[start.row][start.col + c]);
      }
      return cells;
    }

    // Vertical
    if (dCol === 0) {
      const step = dRow > 0 ? 1 : -1;
      const cells: Cell[] = [];
      for (let r = 0; Math.abs(r) <= Math.abs(dRow); r += step) {
        cells.push(grid[start.row + r][start.col]);
      }
      return cells;
    }

    // Diagonal
    if (Math.abs(dRow) === Math.abs(dCol)) {
      const stepR = dRow > 0 ? 1 : -1;
      const stepC = dCol > 0 ? 1 : -1;
      const cells: Cell[] = [];
      for (let i = 0; i <= Math.abs(dRow); i++) {
        cells.push(grid[start.row + (i * stepR)][start.col + (i * stepC)]);
      }
      return cells;
    }

    // Invalid drag (not a straight line), act as if we just hovered
    // Ideally we might want to just return nothing or snap to valid line.
    // For simplicity, let's behave like valid start to end but it won't be straight
    // Actually, good UX is usually to snap to the closest valid axis or do nothing.
    return [];
  }

  // Helper for template to check if word found
  public isWordFound(arabic: string): boolean {
    return this.state().foundWords.includes(arabic);
  }
}
