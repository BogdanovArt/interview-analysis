import { useEffect, useState, useRef, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, RouteComponentProps } from "react-router-dom";

import { Breadcrumbs } from "components/common/UI/Breadcrumbs";
import { BubblesEditor } from "components/common/Inputs/Text/BubblesEditor";

import { AppDispatch } from "store/index";
import { ProjectSchema } from "store/projects/types";
import { getInterviewAtoms, getInterviewBlocks, getInterviewMetaData } from "store/interview/getters";
import { requestInterview } from "store/interview/actions";
import { resetInterview } from "store/interview";

import { routes } from "routes/enums";
import { defaultCrumbs } from "utils/consts";

import overrides from "./Edit.module.scss";
import styles from "../Analysis/Analysis.module.scss";

interface Props {
  id: string;
}

export const Edit = (props: RouteComponentProps<Props>) => {
  const workspace = useRef(null);

  const interview = useSelector(getInterviewMetaData);
  const blocks = useSelector(getInterviewBlocks);
  const atoms = useSelector(getInterviewAtoms);

  const dispatch = useDispatch<AppDispatch>();

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

  useEffect(() => {
    dispatch(requestInterview({ id }));
    return () => {
      dispatch(resetInterview());
    };
  }, []);

  return (
    <div className={styles.Interview}>
      <div className={styles.Interview}>
        <Breadcrumbs list={crumbs} />

        <div className={styles.InterviewTitle}>
          {interview.title} - Редактирование
          <Link to={routes.interview.replace(":id", id)} className={styles.InterviewLink}>
            Анализ
          </Link>
        </div>
        <div className={[styles.InterviewContent, overrides.EditContent].join(" ")}>
          <div>
            <div ref={workspace} tabIndex={-1} className={styles.InterviewTextBlocks}>
              <BubblesEditor id={id} blocks={blocks} />
              {/* <AtomicEditor id={content.text.id} initial={content.text.text} /> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
