import { TextField } from "@mui/material";

import { AtomTypes, selectionTypes } from "utils/consts";
import { SelectPayload } from "./Extensions/types";

import styles from "./ControlPanel.module.scss";

interface Props {
  active?: boolean;
  data: SelectPayload;
  type: number;
  selectionContent: string;
  userContent?: string;
  click?: (type: number) => void;
  submit?: () => void;
  clear?: () => void;
  restore?: () => void;
  input?: (str: string) => void;
}

export const ControlPanel = ({
  active,
  type,
  data,
  selectionContent,
  userContent = "",
  click = () => null,
  submit = () => null,
  clear = () => null,
  restore = () => null,
  input = () => null,
}: Props) => {
  const keyPressHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!!type && (e.key === "Enter" || e.key === "NumpadEnter")) {
      submit();
    }
  }
  return (
    <div className={[styles.Panel, active && styles.PanelActive].join(" ")}>
      <div className={styles.PanelSelection}>{selectionContent}</div>
      <div
        className={[styles.Margin, styles.InputWrapper].join(" ")}
        style={{ display: "flex", justifyContent: "stretch" }}
      >
        <TextField
          color="success"
          value={userContent}
          label={"Содержимое атома"}
          onBlur={() => restore()}
          onKeyPress={keyPressHandler}
          onChange={(e) => input(e.target.value)}
        />
      </div>
      <div className={[styles.Margin, styles.PanelButtons].join(" ")}>
        {Object.values(AtomTypes).map((AtomType) => (
          <button
            key={AtomType.id}
            data-type={AtomType.id}
            className={[
              styles.PanelButton,
              AtomType.id === type && styles.PanelButtonActive,
            ].join(" ")}
            onClick={() => click(AtomType.id)}
          >
            {AtomType.title}
          </button>
        ))}
        <button
          disabled={!type}
          className={[styles.PanelButton, styles.PanelButtonOk].join(" ")}
          onClick={() => submit()}
        >
          &#10004; Сохранить
        </button>
        <button
          disabled={data?.type !== selectionTypes.unit}
          className={[styles.PanelButton, styles.PanelButtonClear].join(" ")}
          onClick={() => clear()}
        >
          &#10006; Очистить
        </button>
      </div>
      <div className={[styles.PanelHint].join(" ")}>
        <div className={styles.PanelHintBlock}>
          <span className={styles.PanelHintKey}>&#8592;</span>
          <span className={styles.PanelHintKey}>&#8594;</span>
          <span className={styles.PanelHintKey}>1</span>
          <span className={styles.PanelHintKey}>2</span>
          ...
          <span className={styles.PanelHintKey}>
            {Object.values(AtomTypes).length}
          </span>
          - Выбрать тип
        </div>
        <div className={styles.PanelHintBlock}>
          <span className={styles.PanelHintKey}>Enter</span> - Сохранить атом
        </div>
        <div className={styles.PanelHintBlock}>
          <span className={styles.PanelHintKey}>Del</span>{" "}
          <span className={styles.PanelHintKey}>Backspace</span> - Очистить
          выделение
        </div>
      </div>
    </div>
  );
};
