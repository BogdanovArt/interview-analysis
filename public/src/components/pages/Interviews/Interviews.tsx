import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RouteComponentProps } from "react-router-dom";
import { Button } from "@mui/material";

import Link from "@mui/icons-material/Link";
import Plus from "@mui/icons-material/Add";

import { Breadcrumbs } from "components/common/UI/Breadcrumbs";
import { Portal } from "components/common/Modal/Portal";
import { Modal } from "components/common/Modal/Modal";
import { Interview } from "./blocks/Interview";
import { AddModal } from "./blocks/AddInterviewModal";

import { AppDispatch } from "store/index";
import { setInterviewsData } from "store/interviews";
import { addInterview, editInterview, requestInterviews, requestUnbound } from "store/interviews/actions";
import { getInterviewsData } from "store/interviews/getters";
import { AddInterviewPayload } from "store/interviews/types";
import { InterviewSchema } from "store/interview/types";

import { defaultCrumbs } from "utils/consts";

import styles from "./Interviews.module.scss";

interface Params {
  project: string;
}

export const Interviews = (props: RouteComponentProps<Params>) => {
  const [addModal, setAddModal] = useState(false);
  const [unbound, setUnbound] = useState<InterviewSchema[]>([]);

  const content = useSelector(getInterviewsData);
  const dispatch: AppDispatch = useDispatch();

  const id = props.match.params.project;

  const bindHandler = async (unbound_id: string) => {
    const pl = { id: unbound_id, interview: { bind: id } };
    await dispatch(editInterview(pl));
    dispatch(requestInterviews({ id }));
    setUnbound([]);
    // console.log(unbound_id, "interview id");
  };

  const unboundHandler = async () => {
    const { data } = await dispatch(requestUnbound());
    if (data && data.length) {
      setUnbound(data);
    } else {
      alert("Не найдено интервью без привязки");
    }
  };

  const createHandler = async (name: string, source: string[], respondent?: string) => {
    // @TODO implement JSON / HTML(?) import.

    const payload: AddInterviewPayload = {
      title: name,
      project_id: id,
      respondent,
      source,
    };

    await dispatch(addInterview(payload));
    dispatch(requestInterviews({ id }));
    setAddModal(false);
  };

  useEffect(() => {
    if (id) dispatch(requestInterviews({ id }));
    return () => {
      dispatch(setInterviewsData(null));
    };
  }, []);

  if (!content) return null;

  return (
    <div className={styles.Interviews}>
      <Breadcrumbs list={[...defaultCrumbs, { title: content.title }]} />
      <div className={styles.InterviewsTitle}>{content.title}</div>
      <div className={styles.InterviewsList}>
        {content.interviews
          ? content.interviews.map((interview) => <Interview key={interview._id} interview={interview} />)
          : null}
      </div>
      <div className={styles.InterviewsControls}>
        <Button variant="contained" color="success" onClick={() => setAddModal(true)}>
          <Plus /> Новое интервью
        </Button>

        <Button variant="contained" color="success" onClick={unboundHandler}>
          <Link />
          Добавить из списка
        </Button>
      </div>
      <Portal>
        <AddModal show={addModal} title="Новое интервью" onClose={() => setAddModal(false)} onConfirm={createHandler} />
        <Modal show={!!unbound.length} title="Привязать интервью" onClose={() => setUnbound([])}>
          <div>
            {unbound.map((interview) => (
              <div key={interview._id} className={styles.InterviewsUnbound} onClick={() => bindHandler(interview._id)}>
                {interview.title}
              </div>
            ))}
          </div>
        </Modal>
      </Portal>
    </div>
  );
};
