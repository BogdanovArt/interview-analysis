import React, { MouseEventHandler } from "react";

import styles from "./Button.module.scss";

interface Props {
  tooltip?: string;
  dark?: boolean;
  error?: boolean;
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  children?: JSX.Element | JSX.Element[] | string;
}

export const Button = ({
  tooltip,
  disabled,
  children,
  dark,
  error,
  onClick,
}: Props) => {
  return (
    <button
      disabled={disabled}
      className={[
        styles.Button,
        dark && styles.ButtonDark,
        error && styles.ButtonError,
      ].join(" ")}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
