import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

import { IconButton, Paper } from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import Edit from "@mui/icons-material/Edit";

import { Portal } from "components/common/Modal/Portal";

import {
  editProject,
  removeProject,
  requestProjects,
} from "store/projects/actions";

import { ProjectSchema } from "store/projects/types";

import { ProjectsModal } from "./ProjectsModal";

import styles from "./Project.module.scss";
import { routes } from "routes/enums";

export const Project = ({ project }: { project: ProjectSchema }) => {
  const [modal, setModal] = useState(false);

  const dispatch = useDispatch();

  const editHandler = async (title: string) => {
    await dispatch(editProject({ title, id: project._id }));
    resetState();
    dispatch(requestProjects());
  };

  const removeHandler = async () => {
    await dispatch(removeProject({ id: project._id }));
    resetState();
    dispatch(requestProjects());
  };

  const resetState = () => {
    setModal(false);
  };

  return (
    <div>
      <Paper elevation={2}>
        <div className={styles.Project}>
          <Link
            to={routes.project.replace(":project", project._id)}
            className={styles.ProjectTitle}
          >
            <div>{project.title}</div>
          </Link>
          <IconButton onClick={() => setModal(true)}>
            <Edit />
          </IconButton>
          <IconButton onClick={() => removeHandler()}>
            <DeleteIcon color="error" />
          </IconButton>
        </div>
      </Paper>

      <Portal>
        <ProjectsModal
          show={modal}
          title={`Изменить имя проекта "${project.title}"`}
          initial={project.title}
          label="Введите название проекта"
          onClose={resetState}
          onConfirm={editHandler}
        />
      </Portal>
    </div>
  );
};
