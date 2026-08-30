import { Chord, ChordFile, ChordTreeNode } from './model/chord.model';
import { ActionInfo, KeymapCategory } from './model/keymap.model';

export type ActionLookup = Record<number, Partial<ActionInfo>>;

export function buildActionLookup(categories: KeymapCategory[]): ActionLookup {
  const lookup: ActionLookup = {};
  categories.forEach((category) => {
    Object.entries(category.actions).forEach(([actionCode, action]) => {
      lookup[+actionCode] = action;
    });
  });
  return lookup;
}

// Reference: https://github.com/CharaChorder/DeviceManager/blob/45682f0d1adddb0d689285e284d309123028f22d/src/lib/serial/chord.ts
function serializeActions(actions: number[]): bigint {
  let native = 0n;
  for (let i = 1; i <= actions.length; i++) {
    native |=
      BigInt(actions[actions.length - i] & 0x3ff) << BigInt((12 - i) * 10);
  }
  return native;
}

/** Hashes chord actions the same way CCOS does, used to resolve parent/child chord chains. */
export function hashChordActions(actions: number[]): number {
  const chord = new Uint8Array(16);
  const view = new DataView(chord.buffer);
  const serialized = serializeActions(actions);
  view.setBigUint64(0, serialized & 0xffff_ffff_ffff_ffffn, true);
  view.setBigUint64(8, serialized >> 64n, true);
  let hash = 2166136261;
  for (let i = 0; i < 16; i++) {
    hash = Math.imul(hash ^ view.getUint8(i), 16777619);
  }
  if ((hash & 0xff) === 0xff) {
    hash ^= 0xff;
  }
  return hash & 0x3fff_ffff;
}

export function getParentHashFromChordAction(actions: number[]): number | null {
  if (actions[3] !== 0) {
    return null;
  }
  const parentHash = actions
    .slice(0, 3)
    .reduce((a, b, i) => a | (b << (i * 10)), 0);
  return parentHash === 0 ? null : parentHash;
}

export function getInputFromChordAction(actions: number[]): number[] {
  const input = actions[3] !== 0 ? actions : actions.slice(3);
  return input.filter((code) => code !== 0);
}

export function convertChordFileToChords(chordFile: ChordFile): Chord[] {
  return chordFile.chords.map(([actions, output]) => ({
    id: hashChordActions(actions),
    parentId: getParentHashFromChordAction(actions),
    input: getInputFromChordAction(actions),
    actions,
    output,
  }));
}

export function convertChordsToChordTreeNodes(
  chords: Chord[],
  parentId: number | null = null,
  level = 0
): ChordTreeNode[] {
  return chords
    .filter((chord) => chord.parentId === parentId)
    .map((chord) => ({
      ...chord,
      level,
      children: convertChordsToChordTreeNodes(chords, chord.id, level + 1),
    }));
}

export function flattenChordTreeNodes(nodes: ChordTreeNode[]): ChordTreeNode[] {
  return nodes.reduce((acc, node) => {
    acc.push(node);
    acc.push(...flattenChordTreeNodes(node.children));
    return acc;
  }, [] as ChordTreeNode[]);
}

function getActionLabel(code: number, actionLookup: ActionLookup): string {
  const info = actionLookup[code];
  return info?.display ?? info?.id ?? `<${code}>`;
}

function isLiteralOutputChar(code: number, actionLookup: ActionLookup) {
  if (code < 32 || code > 126) {
    return false;
  }
  return actionLookup[code]?.printable !== false;
}

/** Renders a chord as TCCL-style `input + input = output` text (see the tccode project). */
export function convertChordToTcclParts(
  chord: Pick<Chord, 'input' | 'output'>,
  actionLookup: ActionLookup
): { input: string; output: string } {
  const input = chord.input
    .map((code) => getActionLabel(code, actionLookup))
    .join(' + ');
  const output = chord.output
    .map((code) =>
      isLiteralOutputChar(code, actionLookup)
        ? String.fromCharCode(code)
        : `<${getActionLabel(code, actionLookup)}>`
    )
    .join('');
  return { input, output };
}
