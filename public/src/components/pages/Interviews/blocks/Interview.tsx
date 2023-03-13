import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { IconButton, Paper } from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import Edit from "@mui/icons-material/Edit";
import LinkOff from "@mui/icons-material/LinkOff";

import { Portal } from "components/common/Modal/Portal";
import { ProjectsModal } from "components/pages/Projects/blocks/ProjectsModal";

import { routes } from "routes/enums";

import {
  editInterview,
  removeInterview,
  requestInterviews,
} from "store/interviews/actions";
import { InterviewSchema } from "store/interview/types";

import styles from "components/pages/Projects/blocks/Project.module.scss";

interface Props {
  interview: InterviewSchema;
}

export const Interview = ({ interview }: Props) => {
  const [modal, setModal] = useState(false);

  const dispatch = useDispatch();

  const unbindHandler = async () => {
    await dispatch(
      editInterview({ id: interview._id, interview: { unbind: true } })
    );
    dispatch(requestInterviews({ id: interview.project_id as string }));
  };

  const deleteHandler = async () => {
    if (confirm("Действительно удалить интервью ?")) {
      await dispatch(removeInterview({ id: interview._id }));
      dispatch(requestInterviews({ id: interview.project_id as string }));
    }
  };

  const editHandler = async (name: string) => {
    await dispatch(
      editInterview({ id: interview._id, interview: { title: name } })
    );
    dispatch(requestInterviews({ id: interview.project_id as string }));
    setModal(false);
  };

  return (
    <div>
      <Paper elevation={2}>
        <div className={styles.Project}>
          <Link
            to={routes.interview.replace(":id", interview._id)}
            className={styles.ProjectTitle}
          >
            <div>{interview.title}</div>
          </Link>
          <IconButton onClick={() => setModal(true)}>
            <Edit />
          </IconButton>
          <IconButton onClick={unbindHandler}>
            <LinkOff />
          </IconButton>
          <IconButton onClick={deleteHandler}>
            <DeleteIcon color="error" />
          </IconButton>
        </div>
      </Paper>
      <Portal>
        <ProjectsModal
          show={modal}
          title="Изменить название интервью"
          initial={interview.title}
          onClose={() => setModal(false)}
          onConfirm={editHandler}
        />
      </Portal>
    </div>
  );
};
