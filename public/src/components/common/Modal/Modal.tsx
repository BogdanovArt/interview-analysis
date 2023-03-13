import styles from "./Modal.module.scss";

interface Props {
  show?: boolean;
  title?: string;
  children?: JSX.Element | null;
  onClose?: () => void;
}

export function Modal({ show, onClose = () => null, title = "", children = null }: Props) {
  return show ? (
    <div className={styles.Container}>
      <div className={styles.Overlay} onClick={onClose}></div>
      <div className={styles.Content}>
        <div className={styles.Header}>
          <div className={styles.Title}>{title}</div>
          <div className={styles.Close} onClick={onClose}>
            <svg
              width="10"
              height="10"
              viewBox="0 0 10 10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4.75 4.75L8.5 1M4.75 4.75L1 1M4.75 4.75L1 8.5M4.75 4.75L8.5 8.5"
                strokeWidth="2"
              />
            </svg>
          </div>
        </div>
        {children}
      </div>
    </div>
  ) : null;
}
