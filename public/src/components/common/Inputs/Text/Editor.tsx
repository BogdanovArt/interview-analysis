import { useMemo, useRef } from "react";

import { TextBlockSchema } from "store/projects/types";
import { EditorID, selectionTypes } from "utils/consts";

import { autoSelection } from "utils/textControls";

import styles from "./Editor.module.scss";

interface Props {
  blocks: TextBlockSchema[];
  readonly?: boolean;
  onSelect?: (payload: any) => void;
}

export const AtomicEditor = ({ blocks, onSelect = () => null }: Props) => {
  const editor = useRef(null);

  const mouseUpHandler = () => {
    const { range, nodes, type } = autoSelection();

    const pl = {
      type,
      nodes,
    };

    setTimeout(() => {
      // is to fix selection "resetting" after clicking on already selected text native browser behaviour
      onSelect(pl);
    }, 0);
  };

  const content = useMemo(() => {
    return blocks.map((block) => `<bubble id=${block._id}>${block.content}</bubble>`).join("\n\n");
  }, [blocks]);

  return (
    <div className={styles.Wrapper}>
      <div id="EDITOR" className={styles.Editor}>
        <div
          ref={editor}
          id={EditorID}
          data-type={"text-block"}
          className={styles.EditorWorkspace}
          dangerouslySetInnerHTML={{ __html: content }}
          onDragStart={(e) => e.preventDefault()}
          onMouseUp={mouseUpHandler}
        />
      </div>
    </div>
  );
};
