import React, { useState, useEffect, useRef } from "react";

import editor from "./Editor.module.scss";
import bubble from "./Bubble.module.scss";
import { allowedKeys } from "utils/consts";

interface Props {
  active?: boolean;
  id?: string;
  index: number;
  content: string;
  setNodes: (nodes: HTMLElement[]) => void;
  merge: (index: number, content: string, direction: number) => void;
  change: (index: number, content?: string, create?: string) => void;
  add: (index: number, content?: string) => void;
  remove: (index: number) => void;
}

export const Bubble = ({
  id,
  index,
  active,
  content,
  change = () => null,
  add = () => null,
  remove = () => null,
  merge = () => null,
  setNodes = () => null,
}: Props) => {
  const bubbleElement = useRef(null);
  const [focus, setFocus] = useState(false);
  const [atoms, setAtoms] = useState([]);

  const type = index % 2;

  const getAtoms = () => {
    const children = bubbleElement?.current.children;
    return children.length ? Array.from(children) : [];
  };

  const removeAtoms = () => {
    setNodes(atoms);
    atoms.forEach((atom: HTMLDivElement) => {
      atom.replaceWith(atom.innerText);
    });
  };

  const pasteHandler = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text/plain");
    document.execCommand("insertHTML", false, text);
    console.log("paste", text, e.clipboardData.getData("text/plain"));
  };

  const copyHandler = (e: React.ClipboardEvent) => {
    console.log("copy", e, e.clipboardData.getData("text/plain"));
  };

  const cutHandler = (e: React.ClipboardEvent) => {
    console.log("cut", e.clipboardData.getData("text/plain"));
  };

  const test = (e: any) => {
    // change(index, e.target.innerHTML);
  };

  const blurBubble = () => {
    setFocus(false);
    setTimeout(() => {
      bubbleElement?.current.blur();
    }, 0);
  };

  const focusHandler = (e: React.FocusEvent<HTMLDivElement>) => {
    setAtoms(getAtoms());
    setFocus(true);
  };

  const blurHandler = (e: React.FocusEvent<HTMLDivElement>) => {
    change(index, bubbleElement.current.innerHTML);
    setAtoms(getAtoms());
    setFocus(false);
  };

  const checkEditPermission = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (atoms.length && !allowedKeys.includes(e.key)) {
      const access = confirm(
        "Редактирование блока удалит все его атомы. Продолжить ?"
      );
      if (!access) {
        e.preventDefault();
        e.stopPropagation();
        blurBubble();
      } else {
        removeAtoms();
      }
    }
  };

  const keyHandler = (e: React.KeyboardEvent<HTMLDivElement>) => {
    // console.log(e);
    checkEditPermission(e);
    switch (e.key) {
      case "Backspace":
      case "Delete":
        const removed = removeHandler(e.key);
        if (removed) {
          e.stopPropagation();
          e.preventDefault();
        }
        break;
      case "Enter":
      case "NumpadEnter":
        // console.log(e, selection.anchorNode, selection.focusNode);
        enterHandler();
        e.stopPropagation();
        e.preventDefault();
        break;
      default:
        break;
    }
  };

  const enterHandler = () => {
    const selection = getSelection();
    const range = selection.getRangeAt(0);

    const bubble = range.commonAncestorContainer;

    const pre = document.createRange();
    pre.setStart(bubble, 0);
    pre.setEnd(bubble, range.endOffset);

    const post = document.createRange();
    post.setStart(bubble, range.endOffset);
    post.setEnd(bubble, (bubble as any).length);

    const currentContent = pre.toString();
    const newContent = post.toString();

    change(index, currentContent, newContent);

    setTimeout(() => {
      bubbleElement?.current.nextSibling?.focus();
    }, 0);
  };

  const removeHandler = (key: string) => {
    const selection = getSelection();
    const range = selection.getRangeAt(0);

    const bubble = range.commonAncestorContainer;
    const text = bubble.textContent;

    const isStart =
      range.collapsed &&
      (!range.startOffset || (range.startOffset === 1 && text[0] === " "));
    const isEnd = range.collapsed && range.endOffset === text.trim().length;

    // console.log("what again", isStart, isEnd, bubble, text[0], text[1]);

    if (key === "Delete" && isEnd) {
      let block = false;
      try {
        const nextBlockNodes = Array.from(bubbleElement?.current.nextSibling.children);
        block = !!nextBlockNodes.length;
      } catch (err) {
        console.error(err);
      }
      if (block) return;
      
      bubbleElement?.current.nextSibling?.focus();
      merge(index, text, 1);
      return true;
    }

    if (key === "Backspace" && isStart) {
      
      let block = false;
      try {
        const nextBlockNodes = Array.from(bubbleElement?.current.previousSibling.children);
        block = !!nextBlockNodes.length;
      } catch (err) {
        console.error(err);
      }
      if (block) return;

      bubbleElement?.current.previousSibling?.focus();
      merge(index, text, -1);
      return true;
    }
  };

  useEffect(() => {
    if (!active) {
      // cancel changes
    }
  }, [active]);

  return (
    <div
      ref={bubbleElement}
      contentEditable
      dangerouslySetInnerHTML={{ __html: content }}
      className={bubble.Bubble}
      data-type={type.toString()}
      onCut={cutHandler}
      onCopy={copyHandler}
      onPaste={pasteHandler}
      onFocus={focusHandler}
      onBlur={blurHandler}
      onKeyDown={keyHandler}
      onInput={test}
    >
      {/* <div>{JSON.stringify(content)}</div> */}
    </div>
  );
};
