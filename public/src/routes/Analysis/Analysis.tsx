import React, {RefObject} from 'react';
import {connect} from 'react-redux';
import {AnyAction} from 'redux';
import {ThunkDispatch} from 'redux-thunk';
import {Link} from 'react-router-dom';

import {IAppState} from 'store/rootReducers';
import {
  getAnalysisData,
  setAnalysisData,
  IAnalysisState,
  changeAtom,
  changeBlock,
  addAtom,
  deleteAtom
} from "store/analysis";

import {IProjectData} from 'store/projects';
import {AtomI, TextBlockI, SelectionArguments} from "./interfaces";

import {
  selectNode,
  createUnitNode,
  getInnerRangeNodes,
  getOuterRangeNodes,
  ForEach,
  saveSelection,
  restoreSelection, toNumber
} from "utils";
import {Atoms, TextBlocks} from "./blocks";
import {ControlPanel} from "./blocks/ControlPanel";
import {selectionTypes, TypesData} from "utils/enums";

import styles from './styles.module.scss';
import unitStyles from './blocks/TextBlocks/blocks/TextBlock/styles.module.scss';

type NewThunkDispatch = ThunkDispatch<IAnalysisState, null, AnyAction>;

interface IProps {
  data: IAnalysisState;
  project?: IProjectData;
  analysisGetter: any;
  analysisSetter: any;
  atomAdd: (data: AtomI) => Promise<any>;
  atomDelete: (data: AtomI) => Promise<any>;
  atomChange: (data: AtomI) => Promise<any>;
  blockSetter: (data: TextBlockI) => Promise<any>;
}

interface IState {
  selectionRange: Range | null;
  selectionData: SelectionArguments | null;
  sourceInput: string;
  userInput: string;
  userType: number;
}

interface PageProps {
  match: {
    params: {
      id?: string;
    };
  };
}

class Analysis extends React.Component<IProps & PageProps, IState> {
  workspace: RefObject<HTMLDivElement> = React.createRef();

  // @TODO save selection position in placeholder Element, then remove when selection is back

  public state: IState = {
    selectionData: null,
    selectionRange: null,
    sourceInput: '',
    userInput: '',
    userType: 0
  }
  componentDidMount(): void {
    this.props.analysisGetter(this.props.match.params.id);
  }

  resetState = (): void => {
    this.setState({
      selectionRange: null,
      selectionData: null,
      sourceInput: '',
      userInput: '',
      userType: 0,
    });
  }

  restoreSelection = (): void => {
    const range = this.state.selectionRange;
    if (range) restoreSelection(range);
  }

  keyPressHandler = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!e.ctrlKey) {
      e.preventDefault();
    }
    if (this.workspace.current && this.workspace.current === document.activeElement) {
      switch (e.keyCode) {
        case 49:
        case 50:
        case 51:
        case 52:
        case 53:
        case 54:
        case 55:
          const unit = Object.values(TypesData).find(type => type.keyCode === e.keyCode);
          if (unit) {
            this.setState({ userType: unit.id });
          }
          break;
        case 13:
          this.enterHandler();
          break;
        case 46:
        case 8:
          this.deleteHandler();
          break;
        case 37:
          this.arrowHandler(false);
          break;
        case 39:
          this.arrowHandler(true);
          break;
        default:
          break;
      }
    }
  }

  inputHandler = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    this.setState({
      userInput: (e.target as HTMLInputElement).value
    });
  }

  cloudUnitClickHandler = (unit: AtomI) => {
    const id = unit.text_block_ids ? unit.text_block_ids[0] : '';
    const textUnit = document.getElementById(id);
    if (textUnit) {
      selectNode(textUnit);
      const textBlock = this.getTextBlock(textUnit);
      if (textBlock) {
        const range = saveSelection();
        const sel = getSelection();
        const content = sel ? sel.toString() : '';
        const selectionData = {
          nodes: [textUnit],
          text: textBlock,
          type: selectionTypes.unit,
          id: textBlock.dataset.id || 0
        }
        const pl = {
          selectionRange: range,
          selectionData,
          sourceInput: content,
          userInput: unit.content,
          userType: unit.atom_type as number
        }
        this.setState(pl);
      }
    }
  }

  enterHandler = async () => {
    const { userType, selectionData } = this.state;
    if (
      userType &&
      selectionData &&
      (selectionData.type === selectionTypes.unit || selectionData.type === selectionTypes.range)
    ) {
      this.restoreSelection();
      await this.selectionToAtom();
    }
  }

  deleteHandler = async () => {
    const { selectionData } = this.state;
    if (
      selectionData &&
      (selectionData.type === selectionTypes.unit || selectionData.type === selectionTypes.units)
    ) {
      await this.clearAtomsFromSelection();
    }
  }

  arrowHandler = (forward: boolean) => {
    let type = this.state.userType;
    const total = Object.values(TypesData).length;
    if (forward) {
      if (type < total) {
        type++;
      } else {
        type = 1;
      }
    } else {
      if (type > 1) {
        type--;
      } else {
        type = total;
      }
    }
    this.setState({ userType: type });
  }

  selectionHandler = (payload: SelectionArguments): void => {
    if (payload.type !== selectionTypes.empty) {
      const range = saveSelection();
      const sel = getSelection();
      const content = sel ? sel.toString() : '';
      const pl = {
        selectionRange: range,
        selectionData: payload,
        sourceInput: content,
        userInput: '',
        userType: 0
      }
      if (payload.type === selectionTypes.range) {
        pl.userInput = content;
      }
      if (payload.type === selectionTypes.unit) {
        const textBlock = payload.nodes[0]
        pl.userType = toNumber(textBlock.dataset.type);
        const unit = this.props.data.content.atoms.find(atom =>  atom._id === textBlock.dataset.unit_id );
        if (unit) {
          pl.userInput = unit.content;
        }
      }
      this.setState(pl);
    } else {
      this.resetState();
    }
  }

  typeClickHandler = (userType: number) => {
    this.setState({ userType }, () => {
      this.workspace.current && this.workspace.current.focus();
      // this.restoreSelection();
    });
  }

  outsideClickHandler = (e: MouseEvent): void => {
    const workspace = this.workspace;
    if (workspace && workspace.current && !workspace.current.contains(e.target as Node | null)) {
      this.resetState();
      const selection = getSelection();
      selection && selection.removeAllRanges();
      (this.workspace.current as HTMLElement).blur();
      document.removeEventListener("click", this.outsideClickHandler);
    }
  }

  workspaceFocusHandler = (): void => {
    document.addEventListener("click", this.outsideClickHandler);
  }

  getTextBlock = (node: HTMLElement): HTMLElement | null => {
    if (node) {
      const isTextBlock = node.nodeName === 'DIV' && node.dataset.type === 'text-block';
      if (isTextBlock) {
        return node;
      } else if (node.parentElement) {
        return this.getTextBlock(node.parentElement);
      }
    }
    return null;
  }

  saveData = (): void => {
    this.props.analysisSetter(this.props.match.params.id, this.props.data);
  }

  clearAtomsFromSelection = async (): Promise<void> => {
    const sel = getSelection();
    if (sel && sel.type === selectionTypes.range) {
      const rng = sel.getRangeAt(0);
      const nodes = getOuterRangeNodes(rng);
      await this.removeAtoms(nodes);
      await this.saveBlocks();
      this.resetState();
    }
  }

  selectionToAtom = async (type: number = this.state.userType): Promise<void> => {
    const sel = getSelection();

    if (sel && sel.type === selectionTypes.range) {
      const inside = sel.focusNode === sel.anchorNode;
      const nodes = getInnerRangeNodes(sel.getRangeAt(0));

      if (nodes.length === 1 && nodes[0].innerText === sel.toString()) {
        await this.replaceAtom(nodes[0], type);
        return;
      }

      if (!inside) {
        return;
      }

      await this.createAtom(type, sel);
      await this.saveBlocks();
    }
  }

  createAtom = async (type: number, selection: Selection): Promise<void> => {

    const atomId = [this.props.match.params.id, type, Date.now()].join('-');
    const atom = {
      atom_type: type,
      id: atomId,
      content: this.state.userInput || selection.toString(),
    };
    const unit = await this.props.atomAdd(atom);

    const unitData = {
      id: atomId,
      type,
      content: selection.toString(),
      unit_id: unit._id,
      className: [unitStyles[TypesData[type].cssClass], unitStyles.atom].join(' ')
    }
    const atomElement = createUnitNode(unitData);
    this.replaceSelectionWithHtml(atomElement);
    await this.saveBlocks();

    setTimeout(() => {
      this.saveData();
      this.resetState();
      // const createdNode = document.getElementById(atomId) as Node;
      // selectNode(createdNode);
    }, 0);
  }

  replaceAtom = async (node: HTMLElement, type: number): Promise<void> => {
    const id = node.dataset.id as string;
    const _id = node.dataset.unit_id as string;
    const userInput = this.state.userInput || node.innerHTML;
    const res = await this.props.atomChange({
      _id,
      id,
      atom_type: type,
      content: userInput
    });

    const unitData = {
      id,
      type,
      content: node.innerHTML,
      unit_id: (res && res.new) ? res.new._id : _id,
      className: [unitStyles[TypesData[type].cssClass], unitStyles.atom].join(' ')
    }
    const newNode = createUnitNode(unitData);
    (node as any).parentElement.replaceChild(newNode, node);

    await this.saveBlocks();
    setTimeout(() => {
      const createdNode = document.getElementById(id) as Node;
      selectNode(createdNode);
      this.saveData();
    }, 0);
  }

  removeAtoms = async (nodes: HTMLElement[]): Promise<void> => {
    const sel = getSelection();
    if (sel) {
      await ForEach(nodes, async (node: HTMLElement) => {
        if (node) {
          const _id = node.dataset.unit_id as string;
          const id = node.id as string;
          const content = node.innerText;
          const type = parseInt(node.dataset.type as string, 10);
          this.replaceNodeWithText(node);
          await this.props.atomDelete({ _id, id, content, atom_type: type });
        }
      });
      await this.saveBlocks();
      this.saveData();
    }
  }

  replaceNodeWithText = (node: HTMLElement): void => {
    const range = document.createRange();
    range.selectNode(node);
    range.deleteContents();
    const text = document.createTextNode(node.innerText);
    range.insertNode(text);
  }

  replaceSelectionWithHtml = (element: HTMLElement): void => {
    let range;
    const selection = getSelection();
    if (selection && selection.getRangeAt(0)) {
      range = selection.getRangeAt(0);
      range.deleteContents();
      range.insertNode(element);
    }
  }

  saveBlocks = async (): Promise<void> => {
    const TextBlock = this.state.selectionData && this.state.selectionData.text;
    if (TextBlock) {
      const block = {
        id: TextBlock.dataset.id as string,
        text: TextBlock.innerHTML
      }
      await this.props.blockSetter(block);
    }
  }

  public render() {
    const { data, project } = this.props;
    const { blocks, atoms } = data.content;
    return (
      <div className={[styles.Container].join(' ')}>
        <div className={styles.BreadCrumbs}>
          <Link to='/projects/'>
            <span>Проекты</span>
          </Link>
          <span>/</span>
          <Link to={'/projects/' + (project ? project._id : '')}>
            <span>{project ? project.name : ''}</span>
          </Link>
          <span>/</span>
          <span>{data.title}</span>
        </div>
        { data.title ? <h2>{data.title}</h2> : ''}
        <div
          ref={this.workspace}
          className={[styles.workspace].join(' ')} data-ref={'wrapper'}
          tabIndex={-1}
          onKeyUp={this.keyPressHandler}
          onFocus={this.workspaceFocusHandler}
        >
          <TextBlocks
            blocks={blocks}
            atoms={atoms}
            selectionHandler={this.selectionHandler}
          />
          { (atoms && atoms.length) ? <Atoms atoms={atoms} finder={this.cloudUnitClickHandler} /> : null }
          <ControlPanel
            data={this.state.selectionData}
            sourceInput={this.state.sourceInput}
            userInput={this.state.userInput}
            userType={this.state.userType}
            submit={this.enterHandler}
            onTypeClick={this.typeClickHandler}
            clearAtomsFromSelection={this.clearAtomsFromSelection}
            restoreSelection={this.restoreSelection}
            inputHandler={this.inputHandler}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (store: IAppState) => {
  return {
    data: store.analysisState,
    project: store.analysisState.project_id
  };
};

const mapDispatchToProps = (dispatch: NewThunkDispatch) => {
  return {
    analysisGetter: (id: string) => dispatch(getAnalysisData(id)),
    analysisSetter: (id: string, data: IAnalysisState) => dispatch(setAnalysisData(id, data)),
    atomAdd: (data: AtomI) => dispatch(addAtom(data)),
    atomChange: (data: AtomI) => dispatch(changeAtom(data)),
    atomDelete: (data: AtomI) => dispatch(deleteAtom(data)),
    blockSetter: (data: TextBlockI) => dispatch(changeBlock(data)),
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Analysis);
