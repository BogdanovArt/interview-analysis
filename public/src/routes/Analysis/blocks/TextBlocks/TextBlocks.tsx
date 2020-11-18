import * as React from 'react';
import {TextBlock} from "./blocks";
import {AtomI, TextBlockI, SelectionArguments} from "../../interfaces";

import styles from "./styles.module.scss";

interface Props {
  blocks: TextBlockI[];
  atoms: AtomI[];
  selectionHandler: (sel: SelectionArguments) => void;
}
export class TextBlocks extends React.Component<Props, any> {
  public renderTextBlocks = (blocks: TextBlockI[] | null) => {
    if (blocks) {
      return blocks.map((block) => {
        return (<TextBlock
          key={block.id}
          block={block}
          atoms={this.props.atoms}
          selectionHandler={this.props.selectionHandler}
        />);
      })
    } else {
      return null;
    }
  }
  render(): React.ReactNode {
    return (
      <div className={styles.TextBlocks}>
        {this.renderTextBlocks(this.props.blocks)}
      </div>
    );
  }
}