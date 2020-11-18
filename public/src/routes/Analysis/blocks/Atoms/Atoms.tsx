import React from 'react';
import { AtomI } from "../../interfaces";

import styles from './styles.module.scss';
import {TypesData} from "utils/enums";

interface Props {
  atoms: AtomI[];
  finder: (unit: AtomI) => void;
}

export class Atoms extends React.Component<Props, any> {
  getFilteredTypes = (array: AtomI[], type: number) => {
    return array.filter(el => el && el.atom_type === type);
  }
  getGroupedAtoms = () => {
    const types = Object.values(TypesData);
    return types.map(type => {
      return { atoms: this.getFilteredTypes(this.props.atoms, type.id), type: type.id };
    });
  }
  copyAtoms = () => {
    const text = this.collectAtoms();
    if (text) {
      const tempInput = document.createElement('TEXTAREA') as HTMLInputElement;
      document.body.appendChild(tempInput);
      tempInput.value = text;
      tempInput.select();
      document.execCommand('copy');
      document.body.removeChild(tempInput);
    } else {
      alert('Нет данных для копирования')
    }
  }

  collectAtoms = () => {
    const groups = this.getGroupedAtoms();
    if (groups.length) {
      return groups.map((grp) => {
        return grp.atoms.map((atm) => {
          return atm.content.trim();
        }).join('\n');
      }).join('\n \n');
    }
  }

  renderAtoms = (atoms: AtomI[]) => {
    return atoms.map((atom: AtomI) =>
      <span
        key={atom._id}
        className={styles.Atom}
        title={atom.content}
        onClick={() => this.props.finder(atom)}
      >
        { atom.content }
      </span> );
  }
  renderMolecules = (atoms: AtomI[], type: number) => {
    const unitData = TypesData[type];
    return atoms.length
      ? <div key={type} className={[styles.Molecule, styles[unitData.cssClass]].join(' ')}>
          <span className={styles.Heading}>{unitData.title}</span>
          { this.renderAtoms(atoms) }
        </div>
      : null;
  }

  render() {
    const groups = this.getGroupedAtoms();
    return(
      <div className={styles.Cell}>
        { groups.map(group => this.renderMolecules(group.atoms, group.type)) }
        <button className={styles.Copy} onClick={this.copyAtoms}>Копировать</button>
      </div>

    );
  }
}