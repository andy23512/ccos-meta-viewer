// Reference: https://github.com/CharaChorder/DeviceManager/blob/45682f0d1adddb0d689285e284d309123028f22d/src/lib/serial/chord.ts
export interface ChordFile {
  charaVersion: number;
  type: string;
  chords: [number[], number[]][];
}

export interface Chord {
  id: number;
  parentId: number | null;
  input: number[];
  actions: number[];
  output: number[];
}

export interface ChordTreeNode extends Chord {
  level: number;
  children: ChordTreeNode[];
}
