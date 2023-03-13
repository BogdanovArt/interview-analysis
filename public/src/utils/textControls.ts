import { AtomNodeData } from "components/common/Inputs/Text/Extensions/types";
import { EditorID, escapeChars, selectionTypes, tags, trimChars } from "./consts";

export const isNode = (nodeTag: string = "") => {
  return tags.includes(nodeTag.toLowerCase());
};

export const isEditor = (node: Node) => {
  return (node as HTMLElement).id === EditorID;
};

export const isInside = (node: Node, parent: Node | HTMLElement) => {
  return parent.contains(node);
};

export const getRawText = (text: string) => {
  const reg = /[^а-яА-Яa-zA-Z0-9-_ ]/g;
  return text.trim().replace(reg, "");
};

export const autoSelection = () => {
  const selection = getSelection();
  const range = selection.getRangeAt(0);
  let type = selectionTypes.empty;
  let nodes: Node[] = [];

  try {
    getFullWord(range);

    nodes = getNodesInRange(range).filter((node) => !!node && isNode(node.nodeName));

    switch (true) {
      case isNode(range.startContainer.parentNode?.nodeName): // Atom at the start
        nodes = [range.startContainer.parentNode];
        type = selectionTypes.unit;
        selectNode(range.startContainer.parentNode);
        break;
      case isNode(range.endContainer.parentNode?.nodeName): // Atom at the end
        nodes = [range.endContainer.parentNode];
        type = selectionTypes.unit;
        selectNode(range.endContainer.parentNode);
        break;
      default:
        if (nodes.length) {
          type = selectionTypes.units;
        } else if (range.toString().includes("\n") || !range.toString()) {
          type = selectionTypes.empty;
        } else {
          type = selectionTypes.range;
        }
        break;
    }
  } catch (error) {
    console.info(error.message);
  }

  const Nodes = nodes as HTMLElement[];

  return { range, nodes: Nodes, type };
};

export const selectNode = (node: Node | HTMLElement) => {
  const selection = getSelection();
  if (selection && node) {
    const range = document.createRange();
    range.selectNodeContents(node);
    selection.removeAllRanges();
    selection.addRange(range);
  }
};

export const getNodesInRange = (range: Range, outer = false) => {
  const [start, end] = [range.startContainer, range.endContainer];

  if (start === end) {
    return [];
  }

  let node = start;
  const nodes = [];

  while (node && node !== end) {
    nodes.push((node = getNextNode(node)));
  }

  node = start;
  while (node && node !== range.commonAncestorContainer) {
    nodes.unshift(node);
    node = node.parentNode;
  }

  return nodes;
};

export const getNextNode = (node: Node) => {
  if (node.hasChildNodes()) {
    return node.firstChild;
  } else {
    while (node && !node.nextSibling) {
      node = node.parentNode;
    }
    if (!node) {
      return null;
    }
    return node.nextSibling;
  }
};

export const saveSelection = () => {
  if (window.getSelection) {
    const sel = getSelection();
    if (sel && sel.getRangeAt && sel.rangeCount) {
      return sel.getRangeAt(0);
    }
  }
  return null;
};

export const restoreSelection = (range: Range) => {
  if (range) {
    if (window.getSelection) {
      const sel = getSelection();
      if (sel) {
        sel.removeAllRanges();
        sel.addRange(range);
      }
    }
  }
};

export async function asyncForEach<T>(array: T[], callback: (entity: T) => Promise<void>) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index]);
  }
}

export const createUnitNode = (data: AtomNodeData) => {
  const { DOM_id, atom_type, atom_id, content, node_id, block_id } = data;
  const unit = document.createElement("unit-" + atom_type);
  unit.id = DOM_id;
  unit.dataset.atom_id = atom_id;
  unit.dataset.node_id = node_id;
  unit.dataset.atom_type = atom_type.toString();
  unit.dataset.nodeType = "atom";
  unit.dataset.block_id = block_id;
  unit.innerHTML = content;
  unit.contentEditable = "false";
  unit.className = "atom-node";
  return unit;
};

export const replaceNodeWithText = (node: HTMLElement) => {
  const range = document.createRange();
  range.selectNode(node);
  range.deleteContents();
  const text = document.createTextNode(node.innerText);
  range.insertNode(text);
};

export const replaceSelectionWithHtml = (element: HTMLElement): void => {
  let range;
  const selection = getSelection();
  if (selection && selection.getRangeAt(0)) {
    range = selection.getRangeAt(0);
    range.deleteContents();
    range.insertNode(element);
  }
};

export const getFullWord = (range: Range) => {
  const { startOffset, endOffset, startContainer, endContainer } = range;

  const startText = startContainer.textContent;
  const startMax = startText.length - 1;

  const endText = endContainer.textContent;
  const endMax = endText.length - 1;

  const lastSymbol = endText[endOffset - 1];
  const firstSymbol = startText[startOffset];

  let prevOffset: number, nextOffset: number;

  const prevOptions: SymbolSearchRules = isSymbolViable(firstSymbol)
    ? {
        direction: -1,
        nextSymbolPosition: "last",
        nextSymbolRule: "viable",
      }
    : {
        direction: 1,
        nextSymbolPosition: "first",
        nextSymbolRule: "viable",
      };

  prevOffset = getNextSymbolOffset({
    text: startText,
    offset: startOffset,
    max: startMax,
    ...prevOptions,
  });

  const nextOptions: SymbolSearchRules = isSymbolViable(lastSymbol)
    ? {
        nextSymbolRule: "viable",
        nextSymbolPosition: "last",
        direction: 1,
      }
    : {
        nextSymbolRule: "viable",
        nextSymbolPosition: "first",
        direction: -1,
      };

  nextOffset = getNextSymbolOffset({
    text: endText,
    max: endMax,
    offset: endOffset - 1,
    end: true,
    ...nextOptions,
  });

  // console.warn(prevOffset, nextOffset);

  range.setStart(startContainer, prevOffset);
  range.setEnd(endContainer, nextOffset);

  return range;
};

const isSymbolViable = (symbol: string) => {
  return !trimChars.includes(symbol);
};

type PositionRule = "first" | "last";
type ViabilityRule = "viable" | "nonviable";

interface SymbolSearchProps extends SymbolSearchRules {
  text: string;
  offset: number;
  max: number;
  min?: number;
  end?: boolean;
}

interface SymbolSearchRules {
  direction: 1 | -1;
  nextSymbolPosition?: PositionRule;
  nextSymbolRule?: ViabilityRule;
}

export const getNextSymbolOffset = (payload: SymbolSearchProps): number => {
  const { text, offset, direction, max, min, nextSymbolRule = "viable", nextSymbolPosition = "first", end } = payload;

  const currentIndex = offset;
  const nextIndex = offset + direction;

  const nextSymbol = text[nextIndex];
  const currentSymbol = text[offset];

  const delta = end ? 1 : 0;

  if (!nextSymbol) return currentIndex;

  if (nextIndex < min) {
    return min;
  }
  if (nextIndex > max) {
    return max;
  }

  const currentSymbolViable = isSymbolViable(currentSymbol);
  const nextSymbolViable = isSymbolViable(nextSymbol);

  switch (true) {
    case nextSymbolRule === "viable" && nextSymbolPosition === "first":
      return currentSymbolViable
        ? currentIndex + delta
        : nextSymbolViable
        ? nextIndex + delta
        : getNextSymbolOffset({ ...payload, offset: nextIndex });
    case nextSymbolRule === "viable" && nextSymbolPosition === "last":
      return !nextSymbolViable && currentSymbolViable
        ? currentIndex + delta
        : getNextSymbolOffset({ ...payload, offset: nextIndex });
    case nextSymbolRule === "nonviable" && nextSymbolPosition === "first":
      return !nextSymbolViable && currentSymbolViable
        ? currentIndex + delta
        : getNextSymbolOffset({ ...payload, offset: nextIndex });
    case nextSymbolRule === "nonviable" && nextSymbolPosition === "last":
      return nextSymbolViable && !currentSymbolViable
        ? currentIndex + delta
        : getNextSymbolOffset({ ...payload, offset: nextIndex });
    default:
      return nextIndex;
  }
};

type ExpandReturn = {
  newRange: Range;
  isEdge: boolean;
};

export const modifySelection = (direction: 1 | -1, move?: boolean) => {
  const selectionRange = saveSelection();
  const payload: ExpandReturn = {
    newRange: selectionRange,
    isEdge: false,
  };

  // let newOffset = 0;
  try {
    if (direction > 0) {
      const text = selectionRange.endContainer.textContent;
      const offset = move ? selectionRange.endOffset : selectionRange.endOffset;
      const newEnd = getNextSymbolOffset({
        text,
        max: text.length,
        direction,
        offset,
        nextSymbolPosition: "last",
        nextSymbolRule: "viable",
        end: true,
      });

      const addedText = text.slice(selectionRange.endOffset, newEnd);
      const clearedText = getRawText(addedText);

      if (clearedText?.length) {
        selectionRange.setEnd(selectionRange.endContainer, newEnd);
        if (move) {
          const newStart = getNextSymbolOffset({
            text,
            max: text.length,
            direction: -1,
            offset: newEnd,
            nextSymbolPosition: "last",
            nextSymbolRule: "viable",
          });
          selectionRange.setStart(selectionRange.endContainer, newStart);
        }
      } else {
        payload.isEdge = true;
      }
    } else {
      const text = selectionRange.startContainer.textContent;
      const offset = selectionRange.startOffset - 1;
      const newStart = getNextSymbolOffset({
        text,
        max: text.length,
        direction,
        offset,
        nextSymbolPosition: "last",
        nextSymbolRule: "viable",
      });

      const addedText = text.slice(newStart, selectionRange.startOffset);
      const clearedText = getRawText(addedText);

      if (clearedText?.length) {
        selectionRange.setStart(selectionRange.endContainer, newStart);
        if (move) {
          const newEnd = getNextSymbolOffset({
            text,
            max: text.length,
            direction: 1,
            offset: newStart,
            nextSymbolPosition: "last",
            nextSymbolRule: "viable",
            end: true,
          });
          selectionRange.setEnd(selectionRange.endContainer, newEnd);
        }
      } else {
        payload.isEdge = true;
      }
    }
    return payload;
  } catch (error) {
    console.info(error.message);
  }

  return payload;
};
