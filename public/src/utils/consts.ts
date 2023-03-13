import { AtomTypesData } from "components/common/Inputs/Text/Extensions/types";

export const defaultError =
  "При запросе на сервер произошла ошибка, или сервер вернул некорректные данные";

export const defaultCrumbs = [
  {
    title: "Проекты",
    link: "/projects",
  },
];

export const AtomTypes: AtomTypesData = {
  1: {
    id: 1,
    title: "Достижение",
    cssClass: "unit-green",
    htmlTag: "unit-1",
  },
  2: {
    id: 2,
    title: "Радость",
    cssClass: "unit-green",
    htmlTag: "unit-2",
  },
  3: {
    id: 3,
    title: "Боль",
    cssClass: "unit-red",
    htmlTag: "unit-3",
  },
  4: {
    id: 4,
    title: "Страх",
    cssClass: "unit-red",
    htmlTag: "unit-4",
  },
  5: {
    id: 5,
    title: "Работа",
    cssClass: "unit-orange",
    htmlTag: "unit-5",
  },
  6: {
    id: 6,
    title: "Свойство +",
    cssClass: "unit-blue",
    htmlTag: "unit-6",
  },
  7: {
    id: 7,
    title: "Свойство -",
    cssClass: "unit-blue",
    htmlTag: "unit-7",
  },
};

export const escapeChars = [" ", ".", ",", ";", "?", "!", "(", ")", "'", '"', "—", "\n"];

export const selectionTypes = {
  empty: "Empty",
  range: "Range",
  unit: "Unit",
  units: "Units",
};

export const EditorID = "editor-text-block";

export const tags = Object.values(AtomTypes).map(type => type.htmlTag);