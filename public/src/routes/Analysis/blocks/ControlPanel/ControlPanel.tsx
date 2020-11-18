import React from 'react';
import {SelectionArguments} from "routes/Analysis/interfaces";

import styles from './styles.module.scss';
import {selectionTypes, TypesData} from "utils/enums";

interface Props {
  data: SelectionArguments | null;
  sourceInput: string;
  userInput: string;
  userType: number;
  submit: () => Promise<void>;
  onTypeClick: (type: number) => void;
  clearAtomsFromSelection: () => Promise<void>;
  restoreSelection: () => void;
  inputHandler: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

interface State {
  types: {
    [key: string]: {
      title: string;
    };
  }
}

export class ControlPanel extends React.Component<Props, State> {
  public state: State = {
    types: {
      1: { title: 'type 1' },
      2: { title: 'type 2' },
      3: { title: 'type 3' },
      4: { title: 'type 4' }
    }
  }
  keyUpHandler = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.keyCode === 13) {
      this.props.submit();
    }
  }
  render(): React.ReactNode {
    const { data, userInput, userType, onTypeClick, clearAtomsFromSelection, restoreSelection, inputHandler, submit } = this.props;
    const enableButtons = data && (data.type === selectionTypes.range || data.type === selectionTypes.unit);
    return (
      <div className={[styles.ControlPanel, (!data && styles.hidden)].join(' ')}>
        <span>{this.props.sourceInput}</span>
        <input
          type="text"
          disabled={!enableButtons}
          value={userInput}
          onBlur={restoreSelection}
          onChange={() => null}
          onInput={inputHandler}
          onKeyUp={this.keyUpHandler}
        />
        <div>
          {Object.values(TypesData).map((type) => {
            return (
              <button
                key={type.id}
                disabled={!enableButtons}
                onClick={() => onTypeClick(type.id)}
                className={[
                  styles.TypeButton,
                  styles[type.cssClass],
                  (type.id === userType && styles.Current)
                ].join(' ')}
              >
                {type.title}
              </button>
            )
          })}
          <button
            disabled={!enableButtons}
            className={[styles.TypeButton, styles.OkButton].join(' ')}
            onClick={() => submit()}
          >
            &#10004; Сохранить
          </button>
          <button
            disabled={!data || data.type === selectionTypes.range}
            className={[styles.TypeButton, styles.ClearButton].join(' ')}
            onClick={clearAtomsFromSelection}
          >
            &#10006; Очистить
          </button>
        </div>
      </div>
    );
  }
}