import { useEffect, useState, useRef, useMemo, DragEventHandler, ClipboardEventHandler } from "react";
import { useDispatch } from "react-redux";
import { editInterviewContent } from "store/interview/actions";

import { TextBlockSchema } from "store/projects/types";

import { Bubble } from "./Bubble";

import styles from "./BubblesEditor.module.scss";

interface Props {
  id: string;
  blocks: TextBlockSchema[];
}

export interface Bubble {
  index: number;
  content: string;
}

export const BubblesEditor = ({ id, blocks }: Props) => {
  const src = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();

  const removeArtifacts = (parent: HTMLElement) => {
    const spanArtifacts = parent.getElementsByTagName("span");

    Array.from(spanArtifacts).forEach((artifact) => {
      const content = document.createTextNode(artifact.innerHTML.replace(/&nbsp;/g, " "));
      artifact.parentElement.replaceChild(content, artifact);
    });

    return parent;
  };

  const saveHandler = async () => {
    const bubbles = src.current.getElementsByTagName("bubble");

    removeArtifacts(src.current);

    const Payload: TextBlockSchema[] = [];

    Array.from(bubbles).forEach((bubble: HTMLElement) => {
      const block = blocks.find((el) => el._id === bubble.id);

      const blockNodes = bubble.getElementsByClassName("atom-node");
      const nodes = Array.from(blockNodes) as HTMLElement[];
      const nodeIDs = nodes.map((node) => node.id);

      const newBlock = Payload.find((chunk) => chunk._id === bubble.id);

      let TextBlock: TextBlockSchema | null = {
        _id: newBlock ? "" : block._id,
        content: bubble.innerHTML,
        source: bubble.innerText,
        interview_id: id,
        order: newBlock ? null : block.order,
        nodes: nodeIDs,
      };

      Payload.push(TextBlock);
    });

    // console.warn(Payload);

    await dispatch(editInterviewContent({ blocks: Payload, id }));
    clearEditHistory();
    // window.location.reload();
  };

  const extractTextFromHTMLString = (html: string) => {
    const parser = new DOMParser();
    const parsed = parser.parseFromString(html, "text/html");

    const extractedText = parsed.documentElement.innerText.replace(/\n/g, "");
    return extractedText;
  };

  const clearEditHistory = () => {
    src.current.innerHTML = src.current.innerHTML;
  };

  const dragEventsHandler: DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
  };

  const clipBoardEventsHandler: ClipboardEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    const html = e.clipboardData.getData("text/html");
    const text = extractTextFromHTMLString(html);

    document.execCommand("insertHTML", false, text);
  };

  const content = useMemo(() => {
    return blocks.map((block) => `<bubble id=${block._id}>${block.content}</bubble>`).join("\n\n");
  }, [blocks]);

  return (
    <div>
      <div className={styles.Controls}>
        <button className={styles.Button} onClick={saveHandler}>
          Сохранить
        </button>
      </div>
      {/* <div className={styles.Bubbles}>{renderBubbles()}</div> */}
      <div
        ref={src}
        className={styles.Editor}
        contentEditable
        dangerouslySetInnerHTML={{ __html: content }}
        onDrop={dragEventsHandler}
        onDragStart={dragEventsHandler}
        onPaste={clipBoardEventsHandler}
      />
    </div>
  );
};
