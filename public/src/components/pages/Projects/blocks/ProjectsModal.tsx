import { useState, useEffect } from "react";
import { Button, TextField } from "@mui/material";

import { Modal } from "components/common/Modal/Modal";

import styles from "./ProjectsModal.module.scss";
import { ChangeEvent } from "react";

interface Props {
  show: boolean;
  title?: string;
  label?: string;
  initial?: string;
  onClose?: () => void;
  onConfirm?: (title: string) => void;
}

export const ProjectsModal = ({
  show,
  title,
  label,
  initial,
  onConfirm = () => null,
  onClose = () => null,
}: Props) => {
  const [name, setName] = useState(initial || "");

  const changeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  useEffect(() => {
    setName(initial || "");
  }, [show]);

  return (
    <Modal title={title} show={show} onClose={onClose}>
      <div className={styles.ModalContent}>
        <TextField
          required
          color="success"
          value={name}
          label={label || "Введите название"}
          multiline
          onChange={changeHandler}
        />
        <div className={styles.ModalControls}>
          <Button
            disabled={!name}
            variant="contained"
            color="success"
            onClick={() => onConfirm(name)}
          >
            ok
          </Button>

          <Button variant="contained" color="error" onClick={() => onClose()}>
            отмена
          </Button>
        </div>
      </div>
    </Modal>
  );
};
