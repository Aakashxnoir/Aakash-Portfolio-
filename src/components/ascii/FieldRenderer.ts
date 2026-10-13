import {
  RAMP,
  buildAtlas,
  drawValues,
  fitSurface,
  type Atlas,
  type Surface,
  type Theme,
} from "./engine";
import { fields, type FieldId } from "./fields";

/** Draws one generative field into a canvas (on screen or off screen). */
export class FieldRenderer {
  private surface!: Surface;
  private text!: Atlas;
  private accent!: Atlas;
  private values = new Float32Array(0);

  constructor(
    readonly canvas: HTMLCanvasElement,
    private readonly field: FieldId,
    private readonly fontSize: number,
    private theme: Theme,
  ) {}

  /** Lays the grid out again; pass a size for off-screen canvases. */
  resize(size?: { width: number; height: number }) {
    this.surface = fitSurface(this.canvas, this.fontSize, 1.15, size);
    this.values = new Float32Array(this.surface.cols * this.surface.rows);
    this.buildAtlases();
  }

  setTheme(theme: Theme) {
    this.theme = theme;
    this.buildAtlases();
  }

  private buildAtlases() {
    this.text = buildAtlas(this.surface, RAMP, this.theme.text, this.theme.font);
    this.accent = buildAtlas(this.surface, RAMP, this.theme.accent, this.theme.font);
  }

  render(time: number) {
    const { cols, rows, cw, ch } = this.surface;
    const aspect = (cols * cw) / (rows * ch);
    const cell = 2 / rows;
    const frame = fields[this.field](time, aspect, cell);
    const values = this.values;
    for (let row = 0; row < rows; row++) {
      const y = ((row + 0.5) / rows) * 2 - 1;
      for (let col = 0; col < cols; col++) {
        const x = (((col + 0.5) / cols) * 2 - 1) * aspect;
        values[row * cols + col] = frame(x, y);
      }
    }
    drawValues(this.surface, values, this.text, this.accent);
  }
}
