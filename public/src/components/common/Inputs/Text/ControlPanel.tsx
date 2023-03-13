import { useEffect, useRef, useState } from "react";
import { TextField } from "@mui/material";

import { AtomTypes, selectionTypes } from "utils/consts";
import { SelectPayload } from "./Extensions/types";

import styles from "./ControlPanel.module.scss";
import { IFrame } from "components/common/Modal/IFrame";
import { Input } from "../Input";
import { Button } from "components/common/UI/Button";
import { Tips } from "components/common/UI/Tips";

interface Props {
  fetching?: boolean;
  active?: boolean;
  data: SelectPayload;
  range?: Range;
  type: number;
  selectionContent: string;
  userContent?: string;
  click?: (type: number) => void;
  submit?: () => void;
  clear?: () => void;
  restore?: () => void;
  input?: (str: string) => void;
  focus?: () => void;
  blur?: () => void;
  expand?: (direction: number) => void;
  move?: (direction: number) => void;
  leap?: (direction: 1 | -1) => void;
}

export const ControlPanel = ({
  fetching = false,
  range,
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
  focus = () => null,
  blur = () => null,
  expand = () => null,
  move = () => null,
  leap = () => null,
}: Props) => {
  const [focused, setFocused] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const inputElement = useRef(null);

  const keyPressHandler = (e: React.KeyboardEvent<HTMLDocument>) => {
    // console.log("test", e);
    switch (e.key) {
      case "1":
      case "2":
      case "3":
      case "4":
      case "5":
      case "6":
      case "7":
        if (focused && !e.altKey) {
          break;
        }
        e.preventDefault();
        e.stopPropagation();
        const unit = Object.values(AtomTypes).find((type) => type.id === parseInt(e.key, 10));
        if (unit) {
          click(parseInt(e.key, 10));
        }
        break;
      case "Enter":
      case "NumpadEnter":
        submit();
        break;
      case "ArrowDown":
      case "ArrowUp":
        if (e.ctrlKey) {
          e.preventDefault();
          const direction = e.key === "ArrowDown" ? 1 : -1;
          leap(direction);
        }
        break;
      case "ArrowRight":
      case "ArrowLeft":
        const direction = e.key === "ArrowRight" ? 1 : -1;
        if (e.ctrlKey) {
          e.preventDefault();
          move(direction);
        } else if (e.shiftKey) {
          e.preventDefault();
          expand(direction);
        }
        break;
      default:
        break;
    }
  };

  const clickHandler = (id: number) => {
    click(id);
    focusInput();
  };

  const focusInput = () => {
    inputElement?.current.focus();
  };

  useEffect(() => {
    if (active) {
      inputElement?.current?.focus();
      setTimeout(() => {
        inputElement?.current?.select();
      }, 0);
    }
    setShowHint(false);
  }, [range, active]);

  return (
    <div className={[styles.Panel, active && styles.PanelActive, fetching && styles.PanelDisabled].join(" ")}>
      {showHint ? <Tips /> : null}
      <IFrame>
        <div tabIndex={1} className={styles.PanelContent} onKeyDown={keyPressHandler as any}>
          <div className={styles.PanelSelection}>{selectionContent}</div>
          <div
            className={[styles.Margin, styles.InputWrapper].join(" ")}
            style={{ display: "flex", justifyContent: "stretch" }}
          >
            <Input
              referrence={inputElement}
              placeholder="Содержимое атома"
              initial={userContent}
              // onEnter={submit}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              onChange={(name, value, type) => input(value)}
            />
          </div>
          <div className={[styles.Margin, styles.PanelButtons].join(" ")}>
            {Object.values(AtomTypes).map((AtomType) => (
              <button
                id={`button-${AtomType.id}`}
                key={AtomType.id}
                data-type={AtomType.id}
                className={[
                  styles.PanelButton,
                  styles.PanelButtonType,
                  AtomType.id === type && styles.PanelButtonActive,
                ].join(" ")}
                onClick={() => clickHandler(AtomType.id)}
              >
                <span className={styles.PanelButtonTitle}>{AtomType.title}</span>

                {/* <span className={styles.PanelButtonHint}>[Alt + {AtomType.id}]</span> */}
              </button>
            ))}
          </div>
          <div className={[styles.Margin, styles.PanelButtons].join(" ")}>
            <div className={styles.PanelHintBlock}>
              <span
                className={styles.PanelHintKey}
                style={{ cursor: "pointer" }}
                onClick={() => setShowHint(!showHint)}
              >
                💡
              </span>{" "}
              - Управление
            </div>
            <button
              id={`button-submit`}
              disabled={!type}
              className={[styles.PanelButton, styles.PanelButtonOk].join(" ")}
              onClick={() => submit()}
            >
              {/* <span className={styles.PanelButtonHint}>[Enter]</span> */}
              <span className={styles.PanelButtonTitle}>Сохранить</span>
            </button>
            <button
              disabled={data?.type !== selectionTypes.unit}
              className={[styles.PanelButton, styles.PanelButtonClear].join(" ")}
              onClick={() => clear()}
            >
              {/* <span className={styles.PanelButtonHint}>[Del]</span> */}
              {/* <span className={styles.PanelHintKey}>Del</span> */}
              <span className={styles.PanelButtonTitle}>Очистить</span>
            </button>
          </div>
        </div>
      </IFrame>
    </div>
  );
};
