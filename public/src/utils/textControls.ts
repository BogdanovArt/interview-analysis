import { AtomNodeData } from "components/common/Inputs/Text/Extensions/types";
import { EditorID, escapeChars, selectionTypes, tags } from "./consts";

export const isAtom = (nodeTag: string) => {
  return tags.includes(nodeTag.toLowerCase());
};

export const isEditor = (node: Node) => {
  return (node as HTMLElement).id === EditorID;
};

export const isInside = (node: Node, parent: Node | HTMLElement) => {
  return parent.contains(node);
};

export const trimRange = (range: Range) => {
  const content = range.toString().split("");

  let [start, end] = [range.startContainer, range.endContainer];
  let [startOffset, endOffset] = [range.startOffset, range.endOffset];

  // console.log(start, end, startOffset, endOffset);

  for (let i = 0; i < content.length; i++) {
    const char = content[i];
    if (!escapeChars.includes(char)) {
      break;
    } else {
      startOffset++;
    }
  }

  for (let i = content.length - 1; i >= 0; i--) {
    const char = content[i];
    if (!escapeChars.includes(char)) {
      break;
    } else {
      endOffset--;
    }
  }

  // console.log(startOffset, endOffset);

  range.setStart(start, startOffset);
  range.setEnd(end, endOffset);
};

export const expandRange = (range: Range) => {
  let loopBreak = 0;

  let [start, end] = [range.startContainer, range.endContainer];
  let [startOffset, endOffset] = [range.startOffset, range.endOffset];
  const [startContent, endContent] = [start.textContent, end.textContent];

  const editor = document.getElementById(EditorID);

  if (!editor.contains(start) || !editor.contains(end)) {
    return;
  }

  while (
    !escapeChars.includes(startContent.charAt(startOffset - 1)) &&
    startOffset > 0 &&
    loopBreak < 1000
  ) {
    // console.log("expand left");
    loopBreak++;
    startOffset--;
  }

  while (
    !escapeChars.includes(endContent.charAt(endOffset)) &&
    endOffset < end.textContent.length &&
    loopBreak < 1000
  ) {
    // console.log("expand left");
    loopBreak++;
    endOffset++;
  }

  range.setStart(start, startOffset);
  range.setEnd(end, endOffset);
};

export const autoSelection = () => {
  const selection = getSelection();
  const range = selection.getRangeAt(0);
  let type = selectionTypes.empty;

  trimRange(range);
  expandRange(range);

  let nodes: Node[] = getNodesInRange(range).filter((node) =>
    !!node && isAtom(node.nodeName)
  );

  switch (true) {
    case isAtom(range.startContainer.parentNode?.nodeName): // Atom at the start
      nodes = [range.startContainer.parentNode];
      type = selectionTypes.unit;
      selectNode(range.startContainer.parentNode);
      break;
    case isAtom(range.endContainer.parentNode?.nodeName): // Atom at the end
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

  return { range, nodes, type };
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

export const asyncForEach = async (array: any[], callback: any) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index]);
  }
};

export const createUnitNode = (data: AtomNodeData) => {
  const { DOM_id, atom_type, atom_id, content, unit_id } = data;
  const unit = document.createElement("unit-" + atom_type);
  unit.id = DOM_id;
  unit.dataset.atom_id = atom_id;
  unit.dataset.unit_id = unit_id;
  unit.dataset.atom_type = atom_type.toString();
  unit.dataset.nodeType = "atom";
  unit.innerHTML = content;
  return unit;
};
