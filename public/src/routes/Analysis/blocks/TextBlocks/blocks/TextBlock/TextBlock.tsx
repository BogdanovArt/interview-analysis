import React, {RefObject} from 'react';
import {AtomI, TextBlockI, SelectionArguments} from "routes/Analysis/interfaces";

import {selectNode, getFullWordSelection, getNodeInSelection, getOuterRangeNodes} from "utils";
import {selectionTypes, tags} from 'utils/enums';

import styles from './styles.module.scss';

interface Props {
  block: TextBlockI;
  atoms: AtomI[];
  selectionHandler: (sel: SelectionArguments) => void;
}

export class TextBlock extends React.Component<Props, any> {
  text: RefObject<HTMLDivElement> = React.createRef();
  selectHandler = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const pl: SelectionArguments = {
      id: this.props.block.id,
      type: selectionTypes.empty,
      text: this.text.current as HTMLDivElement,
      nodes: []
    };
    const selection = getSelection() as Selection;
    const node = getNodeInSelection();
    if (node && !selection.toString()) {
      selectNode(node);
    }
    const range = selection.getRangeAt(0);
    const nodes = getOuterRangeNodes(range);
    const anchor = selection.anchorNode;
    const isAtom = anchor && !!tags.find((el) => anchor.nodeName === el);

    if (isAtom && !!node) {
      pl.type = selectionTypes.unit;
      pl.nodes = [node as HTMLElement];
    } else if (!isAtom) {
      getFullWordSelection(selection);
      if (!!selection.toString()) {
        if (!nodes.length) {
          pl.type = selectionTypes.range;
        } else if (!!selection.toString()) {
          pl.type = selectionTypes.units;
          pl.nodes = nodes;
        }
      }
    }

    // console.table({ isAtom, node: !!node, length: nodes.length, selection: !!selection.toString(), detectedType: pl.type });
    this.props.selectionHandler(pl);
  }

  render(): React.ReactNode {
    const { block } = this.props;
    return (
      <div>
        <div
          ref={this.text}
          data-id={block.id}
          data-type={'text-block'}
          className={styles['text-block']}
          dangerouslySetInnerHTML={{__html:block.text}}
          onMouseUp={this.selectHandler}
          onDragStart={(e) => e.preventDefault()}
        />
      </div>
    );
  }
}