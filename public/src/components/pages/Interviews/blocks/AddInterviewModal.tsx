import { useState, useEffect, ChangeEvent } from "react";
import { Button, TextField } from "@mui/material";

import { Modal } from "components/common/Modal/Modal";

import styles from "components/pages/Projects/blocks/ProjectsModal.module.scss";

interface Props {
  show: boolean;
  title?: string;
  label?: string;
  initial?: string;
  onClose?: () => void;
  onConfirm?: (name: string, content: string) => void;
}

export const AddModal = ({
  show,
  title,
  label,
  initial,
  onConfirm = () => null,
  onClose = () => null,
}: Props) => {
  const [name, setName] = useState(initial || "");
  const [content, setContent] = useState("");

  const confirmHandler = () => {
    onConfirm(name, stringToHtml(content));
  }

  const stringToHtml = (text: string) => {
    const array = text.split("\n");
    return array.join("\n \n ");
  };

  useEffect(() => {
    setName(initial || "");
    setContent("");
  }, [show]);

  return (
    <Modal title={title} show={show} onClose={onClose}>
      <div className={styles.ModalContent}>
        <TextField
          required
          color="success"
          value={name}
          label={"Введите название"}
          multiline
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          required
          color="success"
          value={content}
          label={"Введите текст интервью"}
          multiline
          minRows={4}
          maxRows={12}
          className={styles.TextField}
          onChange={(e) => setContent(e.target.value)}
        />
        <div className={styles.ModalControls}>
          <Button
            disabled={!name || !content}
            variant="contained"
            color="success"
            onClick={confirmHandler}
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
