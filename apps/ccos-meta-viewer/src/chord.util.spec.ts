import {
  buildActionLookup,
  convertChordFileToChords,
  convertChordsToChordTreeNodes,
  convertChordToTcclParts,
  flattenChordTreeNodes,
  getInputFromChordAction,
  getParentHashFromChordAction,
  hashChordActions,
} from './chord.util';
import { ChordFile } from './model/chord.model';
import { KeymapCategory } from './model/keymap.model';

const pad = (...codes: number[]) => [
  ...Array(12 - codes.length).fill(0),
  ...codes,
];

// Expected hashes were computed with an independent implementation (Python)
describe('hashChordActions', () => {
  it('matches known values', () => {
    expect(hashChordActions([])).toBe(694753541);
    expect(hashChordActions(pad())).toBe(694753541);
    expect(hashChordActions(pad(46))).toBe(738073254);
    expect(hashChordActions(pad(97, 98))).toBe(698864859);
  });

  it('fits in 30 bits', () => {
    expect(hashChordActions(pad(1023, 1023, 1023))).toBeLessThanOrEqual(
      0x3fff_ffff
    );
  });
});

describe('getParentHashFromChordAction', () => {
  it('returns null for a chord without a parent', () => {
    expect(getParentHashFromChordAction(pad(97, 98))).toBeNull();
  });

  it('returns null when the parent part is empty', () => {
    expect(
      getParentHashFromChordAction([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
    ).toBeNull();
  });

  it('decodes the parent hash from the first three actions', () => {
    const hash = 738073254;
    const parts = [hash & 0x3ff, (hash >> 10) & 0x3ff, (hash >> 20) & 0x3ff];
    expect(
      getParentHashFromChordAction([...parts, 0, 0, 0, 0, 0, 0, 0, 97, 98])
    ).toBe(hash);
  });
});

describe('getInputFromChordAction', () => {
  it('drops zero padding', () => {
    expect(getInputFromChordAction(pad(97, 98))).toEqual([97, 98]);
  });

  it('keeps all actions when there is no parent slot', () => {
    expect(
      getInputFromChordAction([1, 2, 3, 4, 5, 0, 0, 0, 0, 0, 0, 6])
    ).toEqual([1, 2, 3, 4, 5, 6]);
  });
});

describe('chord tree', () => {
  const parentActions = pad(97, 98);
  const parentHash = hashChordActions(parentActions);
  const childActions = [
    parentHash & 0x3ff,
    (parentHash >> 10) & 0x3ff,
    (parentHash >> 20) & 0x3ff,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    99,
  ];
  const file: ChordFile = {
    charaVersion: 1,
    type: 'chords',
    chords: [
      [childActions, [65]],
      [parentActions, [66]],
      [pad(46), [67]],
    ],
  };

  it('converts a chord file', () => {
    const chords = convertChordFileToChords(file);
    expect(chords.map((c) => c.input)).toEqual([[99], [97, 98], [46]]);
    expect(chords[0].parentId).toBe(parentHash);
    expect(chords[1].id).toBe(parentHash);
    expect(chords[1].parentId).toBeNull();
  });

  it('nests children under their parent', () => {
    const nodes = convertChordsToChordTreeNodes(convertChordFileToChords(file));
    expect(nodes.map((n) => n.level)).toEqual([0, 0]);
    const parent = nodes.find((n) => n.id === parentHash);
    expect(parent?.children).toHaveLength(1);
    expect(parent?.children[0].level).toBe(1);
    expect(parent?.children[0].output).toEqual([65]);
  });

  it('flattens parents before their children', () => {
    const nodes = convertChordsToChordTreeNodes(convertChordFileToChords(file));
    expect(flattenChordTreeNodes(nodes).map((n) => n.output)).toEqual([
      [66],
      [65],
      [67],
    ]);
  });

  it('drops chords whose parent is missing', () => {
    const orphan = convertChordFileToChords({
      ...file,
      chords: [file.chords[0]],
    });
    expect(convertChordsToChordTreeNodes(orphan)).toEqual([]);
  });
});

describe('buildActionLookup', () => {
  it('flattens categories into a code lookup', () => {
    const categories = [
      { actions: { 97: { id: 'a' } } },
      { actions: { 46: { id: 'period' } } },
    ] as unknown as KeymapCategory[];
    expect(buildActionLookup(categories)).toEqual({
      97: { id: 'a' },
      46: { id: 'period' },
    });
  });
});

describe('convertChordToTcclParts', () => {
  const lookup = {
    46: { display: '.' },
    1001: { display: 'ARPEGGIATE' },
    544: { id: 'JOIN' },
    10: { printable: false },
  };

  it('joins inputs with + and uses display, id or the raw code', () => {
    expect(
      convertChordToTcclParts({ input: [46, 1001, 544, 7], output: [] }, lookup)
        .input
    ).toBe('. + ARPEGGIATE + JOIN + <7>');
  });

  it('prints printable ASCII output literally and wraps the rest', () => {
    expect(
      convertChordToTcclParts(
        { input: [], output: [104, 105, 544, 10] },
        lookup
      ).output
    ).toBe('hi<JOIN><<10>>');
  });
});
