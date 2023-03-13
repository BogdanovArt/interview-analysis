import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Button } from "@mui/material";
import Plus from "@mui/icons-material/Add";

import { Portal } from "components/common/Modal/Portal";

import {
  addProject,
  requestProjects,
} from "store/projects/actions";
import { getPageData } from "store/projects/getters";

import { Project } from "./blocks/Project";
import { ProjectsModal } from "./blocks/ProjectsModal";

import styles from "./Projects.module.scss";

export const Projects = () => {
  const content = useSelector(getPageData);
  const dispatch = useDispatch();

  const [modal, setModal] = useState(false);

  const addHandler = async (title: string) => {
    await dispatch(addProject({ title }));
    dispatch(requestProjects());
    resetState();
  };

  const resetState = () => {
    setModal(false);
  };

  useEffect(() => {
    dispatch(requestProjects());
  }, []);

  return (
    <div className={styles.Projects}>
      <div className={styles.ProjectsTitle}>Проекты</div>
      <div className={styles.ProjectsList}>
        {content.map((project) => (
          <Project key={project._id} project={project} />
        ))}
      </div>
      <Button
        variant="contained"
        color="success"
        onClick={() => setModal(true)}
      >
        <Plus />  Добавить
      </Button>
      <Portal>
        <ProjectsModal
          show={modal}
          title="Добавить проект"
          label="Введите название проекта"
          onClose={resetState}
          onConfirm={addHandler}
        />
      </Portal>
    </div>
  );
};
