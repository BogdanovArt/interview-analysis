export interface IUnitData {
  id: number;
  title: string;
  cssClass: string;
  htmlTag: string;
  keyCode: number;
}

export interface ITypes {
  [key: number]: IUnitData;
}

export const TypesData: ITypes = {
  1: {
    id: 1,
    title: 'Достижение',
    cssClass: 'unit-green',
    htmlTag: 'UNIT-1',
    keyCode: 49,
  },
  2: {
    id: 2,
    title: 'Радость',
    cssClass: 'unit-green',
    htmlTag: 'UNIT-2',
    keyCode: 50,
  },
  3: {
    id: 3,
    title: 'Боль',
    cssClass: 'unit-red',
    htmlTag: 'UNIT-3',
    keyCode: 51,
  },
  4: {
    id: 4,
    title: 'Страх',
    cssClass: 'unit-red',
    htmlTag: 'UNIT-4',
    keyCode: 52,
  },
  5: {
    id: 5,
    title: 'Работа',
    cssClass: 'unit-orange',
    htmlTag: 'UNIT-5',
    keyCode: 53,
  },
  6: {
    id: 6,
    title: 'Свойство +',
    cssClass: 'unit-blue',
    htmlTag: 'UNIT-6',
    keyCode: 54,
  },
  7: {
    id: 7,
    title: 'Свойство -',
    cssClass: 'unit-blue',
    htmlTag: 'UNIT-7',
    keyCode: 55,
  },
}

export const escapeChars = [
  ' ',
  '.',
  ',',
  ';',
  '?',
  '!',
  '(',
  ')',
  "'",
  '"'
];

 export const selectionTypes = {
  empty: 'Empty',
  range: 'Range',
  unit: 'Unit',
  units: 'Units'
}

export const tags = Object.values(TypesData).map(type => type.htmlTag);