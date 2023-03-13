import { useState, useRef, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RouteComponentProps } from "react-router";
import { Link } from "react-router-dom";

import { Breadcrumbs } from "components/common/UI/Breadcrumbs";
import { AtomicEditor } from "components/common/Inputs/Text/Editor";
import { SelectPayload } from "components/common/Inputs/Text/Extensions/types";
import { ControlPanel } from "components/common/Inputs/Text/ControlPanel";
import { Button } from "components/common/UI/Button";

import { Cloud } from "./blocks/Cloud";

import { resetInterview } from "store/interview";
import {
  addAtomNode,
  ChangeBlockPayload,
  changeTextBlock,
  changeTextBlocks,
  deleteAtomNodes,
  editAtomNode,
  editInterview,
  hardResetInterview,
  requestInterview,
} from "store/interview/actions";
import { getInterviewBlocks, getInterviewAtoms, getInterviewMetaData } from "store/interview/getters";

import { AtomNodeAddPayload, AtomNodeEditPayload } from "store/interview/types";
import { AtomNodeSchema, AtomSchema, ProjectSchema } from "store/projects/types";
import { AppDispatch } from "store/index";
import { routes } from "routes/enums";

import { AtomTypes, defaultCrumbs, selectionTypes } from "utils/consts";
import {
  autoSelection,
  createUnitNode,
  modifySelection,
  getRawText,
  isNode,
  replaceNodeWithText,
  replaceSelectionWithHtml,
  restoreSelection,
  saveSelection,
  selectNode,
  getNextSymbolOffset,
} from "utils/textControls";

import styles from "./Analysis.module.scss";
import { Tips } from "components/common/UI/Tips";

const allowedTypes = [selectionTypes.unit, selectionTypes.range];

let Atoms: AtomSchema[] = []; // I hope no one will ever see this... -__-

interface Params {
  id: string;
}

export const Analysis = (props: RouteComponentProps<Params>) => {
  const workspace = useRef<HTMLDivElement>(null);
  const cloud = useRef<HTMLDivElement>(null);

  const interview = useSelector(getInterviewMetaData);
  const blocks = useSelector(getInterviewBlocks);
  const atoms = useSelector(getInterviewAtoms);

  const [selectionData, setSelectionData] = useState<SelectPayload>(null);
  const [selectionRange, setSelectionRange] = useState<Range>(null);
  const [selectionContent, setSelectionContent] = useState("");
  const [userContent, setUserContent] = useState("");
  const [selectedAtomType, setSelectedAtomType] = useState(0);

  const [fetching, setFetching] = useState(false);

  const id = props.match.params.id;
  const project = interview.project_id as ProjectSchema;
  const crumbs = [
    ...defaultCrumbs,
    {
      title: project?.title,
      link: routes.project.replace(":project", project?._id),
    },
    {
      title: interview.title,
    },
  ];

  const showMenu = !!selectionContent && allowedTypes.includes(selectionData?.type);

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    Atoms = atoms;
  }, [atoms]);

  const selectionRestore = () => {
    if (selectionRange) restoreSelection(selectionRange);
  };

  const clearHandler = async () => {
    if (selectionData?.type === selectionTypes.unit || selectionData?.type === selectionTypes.units) {
      await removeNodes(selectionData?.nodes);
    }
  };

  const removeNodes = async (nodes: HTMLElement[]): Promise<void> => {
    setFetching(true);

    const nodeIDs: string[] = [];

    nodes.forEach((node) => {
      nodeIDs.push(node.dataset.node_id);
    });

    try {
      const removed = await dispatch(deleteAtomNodes(nodes));
      if (removed) {
        const blockIDs: string[] = [];

        nodes.forEach((node) => {
          replaceNodeWithText(node);
          const blockID = node.dataset.block_id;
          if (!blockIDs.includes(blockID)) {
            blockIDs.push(blockID);
          }
        });

        await saveTextBlocks(blockIDs);
      }
    } catch (error) {
      console.error(error);
    }

    setFetching(false);
  };

  const submitHandler = () => {
    if (
      selectedAtomType &&
      (selectionData?.type === selectionTypes.unit || selectionData?.type === selectionTypes.range)
    ) {
      selectionRestore();
      selectionToAtomNode();
      return;
    }
  };

  const saveTextBlocks = async (entities: Array<HTMLElement | string>) => {
    const Payload = entities.map((entity) => {
      const block = typeof entity === "string" ? document.getElementById(entity) : entity;

      if (!block) return;

      const children = block.getElementsByClassName("atom-node");

      const content = block.innerHTML;
      const nodes = Array.from(children).map((node) => node.id);

      return {
        _id: block.id,
        content,
        nodes,
      };
    });

    await dispatch(changeTextBlocks(Payload));
  };

  const getBubble = () => {
    const bubble: HTMLElement = selectionRange.commonAncestorContainer?.parentElement;
    return bubble.tagName === "BUBBLE" ? bubble : null;
  };

  const replaceCurrentAtom = async (node: HTMLElement) => {
    const payload: AtomNodeEditPayload = {
      _id: node.dataset.node_id as string,
      atom_id: node.dataset.atom_id as string,
      content: userContent || node.innerHTML,
      atom_type: selectedAtomType,
      interview_id: id,
      block_id: node.dataset.block_id,
    };

    setFetching(true);
    const res = await dispatch(editAtomNode(payload));

    if (res) {
      const newNodeData = {
        DOM_id: node.id,
        node_id: node.dataset.node_id,
        content: node.innerHTML,
        atom_type: selectedAtomType,
        atom_id: res.atom_id,
        block_id: node.dataset.block_id,
      };

      const newAtomNode = createUnitNode(newNodeData);

      node.parentElement.replaceChild(newAtomNode, node);

      await saveTextBlocks([node.dataset.block_id]);
      await emulatedNodeClick(newAtomNode.id);

      setFetching(false);
    }
  };

  const createAtomNode = async () => {
    const bubble = getBubble();

    const payload: AtomNodeAddPayload = {
      atom_type: selectedAtomType,
      DOM_id: "",
      interview_id: id,
      content: userContent || selectionContent,
      block_id: bubble?.id,
    };

    setFetching(true);
    const res = await dispatch(addAtomNode(payload));

    if (res) {
      const newAtomNodeData = {
        DOM_id: res.node._id,
        atom_type: res.atom.atom_type,
        content: selectionContent,
        atom_id: res.node.atom_id,
        node_id: res.node._id,
        block_id: res.node.block_id,
      };

      const newAtomNode = createUnitNode(newAtomNodeData);

      replaceSelectionWithHtml(newAtomNode);
      await saveTextBlocks([res.node.block_id]);
      await emulatedNodeClick(newAtomNode.id);

      setFetching(false);
    }
  };

  const selectionToAtomNode = async (): Promise<void> => {
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
    setFetching(false);
  };

  const userSelectHandler = (payload: SelectPayload, content: string = "") => {
    const selection = getSelection();
    const selectionContent = selection?.toString() || "";

    if (payload.type === selectionTypes.empty || !selectionContent) {
      resetState();
      return;
    }

    let userInput = content;
    let userType = 0;

    if (payload.type === selectionTypes.range) {
      userInput = selectionContent;
    }
    if (payload.type === selectionTypes.unit) {
      const atomBlock = payload.nodes[0];
      userType = parseInt(atomBlock.dataset.atom_type, 10);
      const unit = Atoms.find((atom) => atom._id === atomBlock.dataset.atom_id);

      if (unit) {
        userInput = unit.content;
      }
    }

    setSelectionData(payload);
    setSelectionRange(saveSelection());
    setSelectionContent(selectionContent);
    setSelectedAtomType(userType);
    setUserContent(userInput);

    // console.log("selection", selection.toString());
    // console.log(saveSelection().getBoundingClientRect());
  };

  const outsideClickHandler = (e: MouseEvent): any => {
    const isInWorkspace = workspace && workspace.current && workspace.current.contains(e.target as Node | null);
    const isInCloud = cloud && cloud.current && cloud.current.contains(e.target as Node | null);
    // const isCloud = cloud && cloud.current && cloud.current === e.target;

    if (isInCloud || isInWorkspace) {
      return;
    }

    resetState();
    getSelection().removeAllRanges();
    document.removeEventListener("click", outsideClickHandler);
  };

  const typeClickHandler = (type: number) => {
    setSelectedAtomType(type);
    // workspace.current.focus();
  };

  const keyPressHandler = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!e.ctrlKey) {
      e.preventDefault();
    }
    if (fetching) {
      e.preventDefault();
      console.warn("fetching data is in process");
      return;
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
          const unit = Object.values(AtomTypes).find((type) => type.id === parseInt(e.key, 10));
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

  const emulatedNodeClick = (id: string) => {
    const node = document.getElementById(id);

    const Payload = {
      type: selectionTypes.unit,
      nodes: [node],
    };

    setTimeout(() => {
      selectNode(node);
      userSelectHandler(Payload);
      node.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 0);
  };

  const atomClickHandler = (atom: AtomSchema) => {
    const NodeID = atom.nodes[0];
    if (Node) {
      emulatedNodeClick(NodeID as any as string);
    }
  };

  const nodeClickEmulation = (node: HTMLElement) => {
    selectNode(node);
    userSelectHandler({ nodes: [node], type: selectionTypes.unit });
  };

  const hardReset = async () => {
    await dispatch(hardResetInterview(id));
  };

  const reload = () => {
    dispatch(requestInterview({ id }));
  };

  const expand = (direction: 1 | -1) => {
    const { newRange } = modifySelection(direction);
    setUserContent(newRange.toString());
    setSelectionContent(newRange.toString());
  };

  const getParentBubble = (range: Range, level = 0): HTMLElement => {
    if (level > 3) return null;
    const parent = range.startContainer.parentElement;
    const tag = parent?.tagName;
    if (tag !== "BUBBLE") {
      return getParentBubble(range, level + 1);
    }
    return parent;
  };

  const moveFromBlock = (direction: -1 | 1) => {
    const bubble = getParentBubble(selectionRange);
    if (bubble) {
      switch (direction) {
        case -1:
          const previousBubble = bubble.previousElementSibling;
          if (previousBubble && previousBubble.lastChild) {
            moveFromUnit(direction, previousBubble.lastChild);
            previousBubble.scrollIntoView({ behavior: "smooth", block: "center" });
          }
          break;
        case 1:
          const nextBubble = bubble.nextElementSibling;
          if (nextBubble && nextBubble.firstChild) {
            moveFromUnit(direction, nextBubble.firstChild);
            nextBubble.scrollIntoView({ behavior: "smooth", block: "center" });
          }
          break;
      }
    }
  };

  const moveFromUnit = (direction: -1 | 1, container: Node) => {
    if (!container) {
      moveFromBlock(direction);
      return;
    }

    setSelectedAtomType(0);

    if (isNode(container?.nodeName)) {
      nodeClickEmulation(container as HTMLElement);
      return;
    }

    if (direction > 0) {
      const nextNode = container;
      const rawText = getRawText(nextNode?.textContent);

      switch (true) {
        case !!rawText:
          const text = nextNode.textContent;
          const max = text.length;
          const offset = 0;
          const newEnd = getNextSymbolOffset({
            text,
            max,
            offset,
            direction,
            nextSymbolPosition: "last",
            nextSymbolRule: "viable",
            end: true,
          });

          const newStart = getNextSymbolOffset({
            text,
            max,
            offset,
            direction,
            nextSymbolPosition: "first",
            nextSymbolRule: "viable",
          });

          selectionRange.setStart(nextNode, newStart);
          selectionRange.setEnd(nextNode, newEnd);

          setUserContent(selectionRange.toString());
          setSelectionContent(selectionRange.toString());
          setSelectionData({ nodes: [], type: selectionTypes.range });
          break;
        case !!nextNode:
          moveFromUnit(direction, nextNode.nextSibling);
          break;
        default:
          break;
      }
    } else {
      const nextNode = container;
      const rawText = getRawText(nextNode?.textContent);

      switch (true) {
        case !!rawText:
          const text = nextNode.textContent;
          const max = text.length;
          const offset = text.length - 1;
          const newStart = getNextSymbolOffset({
            text,
            max,
            offset,
            direction,
            nextSymbolPosition: "last",
            nextSymbolRule: "viable",
          });

          const newEnd = getNextSymbolOffset({
            text,
            max,
            offset,
            direction,
            nextSymbolPosition: "first",
            nextSymbolRule: "viable",
            end: true,
          });

          selectionRange.setStart(nextNode, newStart);
          selectionRange.setEnd(nextNode, newEnd);

          setUserContent(selectionRange.toString());
          setSelectionContent(selectionRange.toString());
          setSelectionData({ nodes: [], type: selectionTypes.range });
          break;
        case !!nextNode:
          moveFromUnit(direction, nextNode.previousSibling);
          break;
        default:
          break;
      }
    }
  };

  const move = (direction: -1 | 1) => {
    try {
      if (selectionData.type === selectionTypes.unit) {
        const startNode =
          direction > 0 ? selectionRange.endContainer.nextSibling : selectionRange.startContainer.previousSibling;
        moveFromUnit(direction, startNode);
      } else {
        const { newRange, isEdge } = modifySelection(direction, !!"move");

        if (isEdge) {
          switch (direction) {
            case 1:
              const nextAtom = newRange.endContainer.nextSibling as HTMLElement;
              if (nextAtom) {
                nodeClickEmulation(nextAtom);
              } else {
                moveFromBlock(direction);
              }
              break;
            case -1:
              const prevAtom = newRange.startContainer.previousSibling as HTMLElement;
              if (prevAtom) {
                nodeClickEmulation(prevAtom);
              } else {
                moveFromBlock(direction);
              }
              break;
          }
        } else {
          setSelectionContent(newRange.toString());
          setUserContent(newRange.toString());
        }
      }
    } catch (error) {
      console.info(error.message);
      resetState();
    }
  };

  useEffect(() => {
    if (showMenu) {
      document.addEventListener("click", outsideClickHandler);
    }
    return () => {
      document.removeEventListener("click", outsideClickHandler);
    };
  }, [showMenu]);

  useEffect(() => {
    dispatch(requestInterview({ id }));
    return () => {
      dispatch(resetInterview());
    };
  }, []);

  return (
    <div className={styles.Interview}>
      <Breadcrumbs list={crumbs} />
      <div className={styles.InterviewTitle}>
        {interview.title} - Анализ
        {/* <Button onClick={addTestTextBlock}>+T</Button> */}
        <Link to={routes.edit.replace(":id", id)} className={styles.InterviewLink}>
          Редактирование
        </Link>
      </div>
      <div className={styles.InterviewContent}>
        <div>
          <div ref={workspace} tabIndex={-1} className={styles.InterviewTextBlocks} onKeyUp={keyPressHandler}>
            <AtomicEditor blocks={blocks} onSelect={userSelectHandler} />
            <ControlPanel
              fetching={fetching}
              active={showMenu}
              data={selectionData}
              range={selectionRange}
              type={selectedAtomType}
              selectionContent={selectionContent}
              userContent={userContent}
              expand={expand}
              move={move}
              leap={(direction) => moveFromBlock(direction)}
              click={typeClickHandler}
              clear={clearHandler}
              input={inputHandler}
              submit={submitHandler}
              restore={selectionRestore}
            />
          </div>
        </div>
        <div className={styles.CloudWrapper}>
          <div ref={cloud} className={styles.Cloud}>
            <Cloud atoms={atoms} onSelect={atomClickHandler} />
            <Tips />
          </div>
        </div>
      </div>
    </div>
  );
};
