import { useRef } from "react";
import { EditorID } from "utils/consts";

import {
  autoSelection,
} from "utils/textControls";

import styles from "./Editor.module.scss";

interface Props {
  id: number;
  initial?: string;
  readonly?: boolean;
  onSelect?: (payload: any) => void;
}

export const AtomicEditor = ({ initial, id, onSelect }: Props) => {
  const editor = useRef(null);

  const mouseUpHandler = () => {
    const { range, nodes, type } = autoSelection();

    const pl = {
      id,
      type,
      nodes,
    };

    onSelect(pl);
  };

  return (
    <div className={styles.Wrapper}>
      <div id="EDITOR" className={styles.Editor}>
        <div
          ref={editor}
          id={EditorID}
          data-id={id}
          data-type={"text-block"}
          className={styles.EditorWorkspace}
          dangerouslySetInnerHTML={{ __html: initial }}
          onDragStart={(e) => e.preventDefault()}
          onMouseUp={mouseUpHandler}
        />
      </div>
    </div>
  );
};
