import { AtomSchema } from "store/projects/types";
import { copyToClipboard } from "utils/index";
import { AtomTypes } from "utils/consts";

import styles from "./Cloud.module.scss";

interface Props {
  atoms: AtomSchema[];
  onSelect: (atom: AtomSchema) => void;
}

export const Cloud = ({ atoms, onSelect }: Props) => {
  const getClipboardData = () => {
    const Atoms = Object.values(AtomTypes).map((AtomType) => {
      const Group = atoms.filter((atom) => atom.atom_type === AtomType.id);
      const chunk = Group.map((atom) => atom.content);
      chunk.unshift(AtomType.title);
      return chunk.join("\n");
    });
    copyToClipboard(Atoms.join("\n\n"));
    alert("Данные успешно скопированы");
  };

  const RenderGroups = () => {
    const Groups = Object.values(AtomTypes).map((AtomType) => {
      const Atoms = atoms.filter((atom) => atom.atom_type === AtomType.id);
      if (Atoms.length) {
        return (
          <div
            key={AtomType.id}
            data-type="group"
            data-group_type={AtomType.id}
            className={styles.CloudGroup}
          >
            <div className={styles.CloudGroupLabel}>{AtomType.title}</div>
            {Atoms.map((Atom) => (
              <div
                key={Atom._id}
                data-atom_type={AtomType.id}
                data-type="atom"
                className={styles.GroupAtom}
                onClick={() => onSelect(Atom)}
              >
                {Atom.content}
              </div>
            ))}
          </div>
        );
      }
      return null;
    });
    return <div className={styles.CloudGroups}>{Groups}</div>;
  };

  return (
    <div className={styles.Cloud}>
      {RenderGroups()}
      {atoms.length ? (
        <button className={styles.CloudButton} onClick={getClipboardData}>
          Копировать
        </button>
      ) : null}
    </div>
  );
};
