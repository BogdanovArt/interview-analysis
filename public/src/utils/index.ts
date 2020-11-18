import {TextBlockI} from "routes/Analysis/interfaces";
import {escapeChars, tags} from "./enums";

export const textBreaker = (str: string, result: TextBlockI[] = []): TextBlockI[] => {
  const index = str.indexOf('\n');
  if (index > -1) {
    const chunk = {
      id: result.length,
      text: str.substring(0, index).trim(),
    };
    const leftOver = str.substr(index + 1);
    result.push(chunk);
    textBreaker(leftOver, result);
  } else {
    result.push({
      id: result.length,
      text: str,
    });
  }
  return result;
};

export const saveState = (data: any) => {
  localStorage.setItem('analysis_data', JSON.stringify(data));
}

export const selectNode = (node: Node) => {
  const selection = getSelection();
  if (selection && node) {
    const range = document.createRange();
    range.selectNodeContents(node);
    selection.removeAllRanges();
    selection.addRange(range);
  }
}
interface UnitData {
  id: string;
  type: number;
  content: string;
  unit_id?: string;
  className: string;
}

export const createUnitNode = (data: UnitData) => {
  const { id, type, content, unit_id, className } = data;
  const unit = document.createElement('unit-' + type);
  unit.className = className;
  unit.id = id;
  unit.dataset.unit_id = unit_id;
  unit.dataset.type = type.toString();
  unit.dataset.nodeType = 'atom';
  unit.innerHTML = content;
  return unit;
}

export const getFullWordSelection = (sel: Selection | null) => {
  if (sel && sel.type !== 'None') {
    const rng = sel.getRangeAt(0);
    if (
      rng.endContainer.nodeName !== 'DIV'
      && rng.startContainer.nodeName !== 'DIV'
    ) {
      expandSelectionBackward(rng);
      expandSelectionForward(rng);
    }
  }
}

export const expandSelectionBackward = (rng: Range) => {
  const content = rng.toString();
  const offset = rng.startOffset - 1;
  const isBlockStart = offset <= -1;
  const isStart = escapeChars.find((char) => char === content.charAt(0));
  if (isStart) {
    rng.setStart(rng.startContainer, rng.startOffset + 1);
    return;
  };
  if (!isBlockStart) {
    rng.setStart(rng.startContainer, offset);
    expandSelectionBackward(rng);    
  }
}


export const expandSelectionForward = (rng: Range) => {
  const content = rng.toString();
  const offset = rng.endOffset + 1;
  const end = rng.endContainer ;
  const maxOffset = end.nodeType === 3 ? (end as Text).length : (end as HTMLElement).innerText.length;
  const isEnd = escapeChars.find((char) => char === content.charAt(content.length - 1));
  if (isEnd) {
    rng.setEnd(end, rng.endOffset - 1);
    return;
  }
  if (offset <= maxOffset) {
    rng.setEnd(end, offset);
    expandSelectionForward(rng);
  }
}

export const getNodeInSelection = () => {
  const selection = getSelection();
  if (selection) {
    const el = selection.focusNode ? selection.focusNode.parentNode : null;
    if (el && (el as any).dataset.nodeType === 'atom') {
      return getOuterRangeNodes(selection.getRangeAt(0))[0];
    }
  }
  return null;
}

export const getInnerRangeNodes = (range: Range) => {
  return getNodesInRange(range);
}

export const getOuterRangeNodes = (range: Range): HTMLElement[] => {
  return getNodesInRange(range, true);
}

export const getNodesInRange = (range: Range, outer = false) => {
  const start = range.startContainer;
  const end = range.endContainer;
  const nodes = [];
  let node;
  if (outer) {
    const parentNode = start.parentNode;
    if (parentNode && tags.includes(parentNode.nodeName)) {
      nodes.push(parentNode);
    }
  }

  for (node = start; node; node = getNextNode(node)) {
    if (node && node.dataset && (node as any).dataset.nodeType === 'atom') {
      nodes.push(node);
    }
    if (node === end) {
      break;
    }
  }

  return nodes;
}

export const getNextNode = (node: any) => {
  if (node.firstChild) {
    return node.firstChild;
  }
  while (node) {
    if (node.nextSibling) {
      return node.nextSibling;
    }
    node = node.parentNode;
  }
}

export const ForEach = async (array: any[], callback: any) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index]);
  }
}

export const saveSelection = () => {
  if (window.getSelection) {
    const sel = getSelection();
    if (sel && sel.getRangeAt && sel.rangeCount) {
      return sel.getRangeAt(0);
    }
  }
  return null;
}

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
}

export const toNumber = (data: any) => {
  if (typeof data === 'string') {
    return parseInt(data, 10);
  } else if (typeof data === 'number') {
    return data;
  }
  return 0;
}