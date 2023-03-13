import styles from "./Tips.module.scss";
import panelStyles from "../Inputs/Text/ControlPanel.module.scss";

interface TipProps {}
export const Tips: React.FC<TipProps> = ({}) => {
  return (
    <div className={styles.Tips}>
      <div style={{ flexBasis: "100%" }}>Управление с клавиатуры:</div>
      <div className={styles.TipsBlock}>
        <div className={[styles.TipsBlockLine, styles.TipsBlockHint].join(" ")}>Выбрать тип "атома":</div>
        <div className={styles.TipsBlockLine}>
          <span className={panelStyles.PanelHintKey}>Alt</span> + <span className={panelStyles.PanelHintKey}>1</span>,
          <span className={panelStyles.PanelHintKey}>2</span>,<span className={panelStyles.PanelHintKey}>3</span> ...
        </div>
      </div>

      <div className={styles.TipsBlock}>
        <div className={[styles.TipsBlockLine, styles.TipsBlockHint].join(" ")}>Создать / сохранить "атом"</div>
        <div className={styles.TipsBlockLine}>
          <span className={panelStyles.PanelHintKey}>Enter</span>
        </div>
      </div>

      <div className={styles.TipsBlock}>
        <div className={[styles.TipsBlockLine, styles.TipsBlockHint].join(" ")}>Удалить один или несколько "атомов"</div>
        <div className={styles.TipsBlockLine}>
          <span className={panelStyles.PanelHintKey}>Delete</span> /
          <span className={panelStyles.PanelHintKey}>Backspace</span>
        </div>
      </div>

      <div className={styles.TipsBlock}>
        <div className={[styles.TipsBlockLine, styles.TipsBlockHint].join(" ")}>Перемещение между словами: </div>
        <div className={styles.TipsBlockLine}>
          <span className={panelStyles.PanelHintKey}>Ctrl</span> + <span className={panelStyles.PanelHintKey}>◀</span>,
          <span className={panelStyles.PanelHintKey}>▶</span>
        </div>
      </div>

      <div className={styles.TipsBlock}>
        <div className={[styles.TipsBlockLine, styles.TipsBlockHint].join(" ")}>
          Расширить выделение:
        </div>
        <div className={styles.TipsBlockLine}>
          <span className={panelStyles.PanelHintKey}>Shift</span> + <span className={panelStyles.PanelHintKey}>◀</span>,
          <span className={panelStyles.PanelHintKey}>▶</span>
        </div>
      </div>

      <div className={styles.TipsBlock}>
        <div className={[styles.TipsBlockLine, styles.TipsBlockHint].join(" ")}>Перемещение между блоками:</div>
        <div className={styles.TipsBlockLine}>
          <span className={panelStyles.PanelHintKey}>Ctrl</span> + <span className={panelStyles.PanelHintKey}>▲</span>,
          <span className={panelStyles.PanelHintKey}>▼</span>
        </div>
      </div>
    </div>
  );
};
