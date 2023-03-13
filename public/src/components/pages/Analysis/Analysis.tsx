import { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RouteComponentProps } from "react-router";

import { Breadcrumbs } from "components/common/UI/Breadcrumbs";
import { AtomicEditor } from "components/common/Inputs/Text/Editor";
import { SelectPayload } from "components/common/Inputs/Text/Extensions/types";
import { ControlPanel } from "components/common/Inputs/Text/ControlPanel";

import { initialState, setAnalysis } from "store/analysis";
import {
  addAtom,
  deleteAtom,
  editAnalysis,
  editAtom,
  requestAnalysis,
} from "store/analysis/actions";
import {
  getAnalysisContent,
  getAnalysisMetaData,
} from "store/analysis/getters";

import { AtomSchema } from "store/projects/types";
import { AppDispatch } from "store/index";

import { AtomTypes, defaultCrumbs, selectionTypes } from "utils/consts";
import {
  asyncForEach,
  createUnitNode,
  isAtom,
  restoreSelection,
  saveSelection,
  selectNode,
} from "utils/textControls";

import { routes } from "routes/enums";

import styles from "./Analysis.module.scss";
import { AtomAddPayload, AtomEditPayload } from "store/analysis/types";
import { Cloud } from "./blocks/Cloud";

const allowedTypes = [selectionTypes.unit, selectionTypes.range];

interface Params {
  id: string;
}

export const Analysis = (props: RouteComponentProps<Params>) => {
  const workspace = useRef<HTMLDivElement>(null);
  const cloud = useRef<HTMLDivElement>(null);

  const interview = useSelector(getAnalysisMetaData);
  const content = useSelector(getAnalysisContent);

  const [selectionData, setSelectionData] = useState<SelectPayload>(null);
  const [selectionRange, setSelectionRange] = useState(null);
  const [selectionContent, setSelectionContent] = useState("");
  const [userContent, setUserContent] = useState("");
  const [selectedAtomType, setSelectedAtomType] = useState(0);

  const [selectedAtom, setSelectedAtom] = useState<AtomSchema | null>(null);

  const id = props.match.params.id;
  const crumbs = [
    ...defaultCrumbs,
    {
      title: interview.project_id?.name,
      link: routes.project.replace(":project", interview.project_id?._id),
    },
    {
      title: interview.title,
    },
  ];

  const showMenu =
    !!selectionContent && allowedTypes.includes(selectionData?.type);

  const dispatch = useDispatch<AppDispatch>();

  const selectionRestore = () => {
    if (selectionRange) restoreSelection(selectionRange);
  };

  const clearHandler = async () => {
    if (
      selectionData?.type === selectionTypes.unit ||
      selectionData?.type === selectionTypes.units
    ) {
      await removeAtoms(selectionData?.nodes);
    }
  };

  const removeAtoms = async (nodes: HTMLElement[]): Promise<void> => {
    await asyncForEach(nodes, async (node: HTMLElement) => {
      if (node && isAtom(node.nodeName)) {
        const DOM_id = node.id as string;
        const _id = node.dataset.unit_id as string;
        const atom_id = node.dataset.atom_id as string;

        const payload = { DOM_id, _id, atom_id };

        const res = await dispatch(deleteAtom(payload));
        if (res?.success) {
          replaceNodeWithText(node);
        }
      }
    });

    await saveContent();
    resetState();
  };

  const submitHandler = () => {
    if (
      selectedAtomType &&
      (selectionData?.type === selectionTypes.unit ||
        selectionData?.type === selectionTypes.range)
    ) {
      selectionRestore();
      selectionToAtom();
      return;
    }
  };

  const saveContent = async () => {
    const textBlock = document.getElementById("editor-text-block");
    const payload = {
      _id: id,
      content: {
        text: {
          id: parseInt(textBlock?.dataset.id, 10),
          text: textBlock.innerHTML,
        },
        atoms: [] as AtomSchema[],
      },
    };
    await dispatch(editAnalysis(payload));
  };

  const replaceCurrentAtom = async (node: HTMLElement) => {
    const payload: AtomEditPayload = {
      _id: node.dataset.unit_id as string,
      atom_id: node.dataset.atom_id as string,
      content: userContent || node.innerHTML,
      atom_type: selectedAtomType,
      interview_id: id,
    };

    const res = await dispatch(editAtom(payload));

    if (res) {
      const newNodeData = {
        DOM_id: node.id,
        unit_id: node.dataset.unit_id,
        content: node.innerHTML,
        atom_type: selectedAtomType,
        atom_id: res.atom_id,
      };

      const newAtomNode = createUnitNode(newNodeData);
      node.parentElement.replaceChild(newAtomNode, node);
      await saveContent();
      resetState();
      // const newSelectionData = { ...selectionData };
      // newSelectionData.nodes = [newAtomNode];
      // setSelectionData(newSelectionData);
      // workspace.current.focus();
      // selectNode(newAtomNode);
      // restoreSelection(selectionRange);
    }
  };

  const createAtomNode = async () => {
    const textBlockId = [
      props.match.params.id,
      selectedAtomType,
      Date.now(),
    ].join("-");
    const payload: AtomAddPayload = {
      atom_type: selectedAtomType,
      DOM_id: textBlockId,
      interview_id: id,
      content: userContent || selectionContent,
    };

    const res = await dispatch(addAtom(payload));

    if (res) {
      const newAtomData = {
        DOM_id: textBlockId,
        atom_type: res.atom.atom_type,
        content: selectionContent,
        atom_id: res.node.atom_id,
        unit_id: res.node._id,
      };

      const newAtomNode = createUnitNode(newAtomData);
      replaceSelectionWithHtml(newAtomNode);
      await saveContent();
      resetState();
    }
  };

  const selectionToAtom = async (): Promise<void> => {
    switch (selectionData?.type) {
      case selectionTypes.unit:
        const atomNode = selectionData?.nodes[0];
        if (atomNode) {
          replaceCurrentAtom(atomNode);
        }
        break;
      case selectionTypes.range:
        createAtomNode();
        break;
      default:
        break;
    }
  };

  const arrowHandler = (forward: boolean) => {
    let type = selectedAtomType;
    const total = Object.values(AtomTypes).length;
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
    setSelectedAtomType(type);
  };

  const resetState = () => {
    setSelectionData(null);
    setSelectionRange(null);
    setSelectionContent("");
    setUserContent("");
    setSelectedAtomType(0);
  };

  const userSelectHandler = (payload: SelectPayload) => {
    if (
      payload.type === selectionTypes.empty ||
      getSelection().toString().includes("\n")
    ) {
      resetState();
      return;
    }

    const selection = getSelection();
    const selectionContent = selection ? selection.toString() : "";
    let userInput = "";
    let userType = 0;

    if (payload.type === selectionTypes.range) {
      userInput = selectionContent;
    }
    if (payload.type === selectionTypes.unit) {
      const atomBlock = payload.nodes[0];
      userType = parseInt(atomBlock.dataset.atom_type, 10);
      const unit = content.atoms.find(
        (atom) => atom._id === atomBlock.dataset.atom_id
      );
      if (unit) {
        userInput = unit.content;
      }
    }

    setSelectionData(payload);
    setSelectionRange(saveSelection);
    setSelectionContent(selectionContent);
    setSelectedAtomType(userType);
    setUserContent(userInput);
  };

  const outsideClickHandler = (e: MouseEvent): any => {
    const isInWorkspace =
      workspace &&
      workspace.current &&
      workspace.current.contains(e.target as Node | null);
    const isInCloud =
      cloud && cloud.current && cloud.current.contains(e.target as Node | null);
    
    if (isInCloud || isInWorkspace) {
      return;
    }

    resetState();
    getSelection().removeAllRanges();
    workspace?.current?.blur();
    document.removeEventListener("click", outsideClickHandler);
  };

  const typeClickHandler = (type: number) => {
    setSelectedAtomType(type);
    workspace.current.focus();
  };

  const focusHandler = () => {
    document.addEventListener("click", outsideClickHandler);
  };

  const keyPressHandler = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!e.ctrlKey) {
      e.preventDefault();
    }
    if (workspace.current && workspace.current === document.activeElement) {
      switch (e.key) {
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
        case "7":
          const unit = Object.values(AtomTypes).find(
            (type) => type.id === parseInt(e.key, 10)
          );
          if (unit) {
            setSelectedAtomType(parseInt(e.key, 10));
          }
          break;
        case "Enter":
        case "NumpadEnter":
          submitHandler();
          break;
        case "Backspace":
        case "Delete":
          clearHandler();
          break;
        case "ArrowLeft":
          arrowHandler(false);
          break;
        case "ArrowRight":
          arrowHandler(true);
          break;
        default:
          break;
      }
    }
  };

  const inputHandler = (input: string) => {
    setUserContent(input);
  };

  const replaceNodeWithText = (node: HTMLElement) => {
    const range = document.createRange();
    range.selectNode(node);
    range.deleteContents();
    const text = document.createTextNode(node.innerText);
    range.insertNode(text);
  };

  const replaceSelectionWithHtml = (element: HTMLElement): void => {
    let range;
    const selection = getSelection();
    if (selection && selection.getRangeAt(0)) {
      range = selection.getRangeAt(0);
      range.deleteContents();
      range.insertNode(element);
    }
  };

  const atomClickHandler = (atom: AtomSchema) => {
    const Node = atom.nodes[0];
    if (Node) {
      const DOMNode = document.getElementById(Node.DOM_id);
      const Payload = {
        type: selectionTypes.unit,
        nodes: [DOMNode],
      };
      setTimeout(() => {
        workspace.current.focus();
        selectNode(DOMNode);
        userSelectHandler(Payload);
      }, 0);
    }
  };

  useEffect(() => {
    console.log("content rerender");
  }, [content]);

  useEffect(() => {
    dispatch(requestAnalysis({ id }));
    return () => {
      document.removeEventListener("click", outsideClickHandler);
      dispatch(setAnalysis(initialState));
    };
  }, []);

  return (
    <div className={styles.Analysis}>
      <Breadcrumbs list={crumbs} />

      <div className={styles.AnalysisTitle}>{interview.title}</div>
      <div className={styles.AnalysisContent}>
        <div>
          <div
            ref={workspace}
            tabIndex={-1}
            className={styles.AnalysisTextBlocks}
            onFocus={focusHandler}
            onKeyUp={keyPressHandler}
          >
            <AtomicEditor
              id={content.text.id}
              initial={content.text.text}
              onSelect={userSelectHandler}
            />
            <ControlPanel
              active={showMenu}
              data={selectionData}
              type={selectedAtomType}
              selectionContent={selectionContent}
              userContent={userContent}
              click={typeClickHandler}
              clear={clearHandler}
              input={inputHandler}
              submit={submitHandler}
              restore={selectionRestore}
            />
          </div>
        </div>
        <div>
          <div ref={cloud} className={styles.Cloud}>
            {/* <button onClick={() => saveContent()}>SYNC</button> */}
            <Cloud atoms={content.atoms} onSelect={atomClickHandler} />
          </div>
        </div>
      </div>
    </div>
  );
};
