import * as React from 'react';
import {connect} from 'react-redux';
import {AnyAction} from 'redux';
import {ThunkDispatch} from 'redux-thunk';

import {addProject, deleteProject, getProjectsData, IProjectData, changeProject} from 'store/projects';
import {IAppState} from 'store/rootReducers';

import common from '../Interviews/styles.module.scss';

type NewThunkDispatch = ThunkDispatch<any, null, AnyAction>; // add state type as first parameter

interface IProps {
  projectsGetter: () => Promise<any>;
  addProject: (name: string) => Promise<any>;
  deleteProject: (id: string) => Promise<any>;
  changeProject: (id: string, name: string) => Promise<any>;
  projects: IProjectData[];
}

class Projects extends React.Component<IProps> {

  addProject = () => {
    const name = prompt('Введите название проекта') || '';
    this.props.addProject(name)
      .then(() => {
        this.props.projectsGetter();
      })
      .catch((err) => {
        console.warn(err);
      });
  }

  deleteProject = (id: string) => {
    if (id) {
      this.props.deleteProject(id)
        .then(() => {
          this.props.projectsGetter();
        })
        .catch((err) => {
          console.warn(err);
        });
    }
  }

  changeProject = (id: string) => {
    if (id) {
      const name = prompt('Введите название проекта') || '';
      this.props.changeProject(id, name)
        .then(() => {
          this.props.projectsGetter();
        })
        .catch((err) => {
          console.warn(err);
        });
    }
  }

  openProject = (id?: string) => {
    if (id) {
      const props = this.props as any;
      props.history.push(props.match.path + '/' + id);
    }
  }

  componentDidMount(): void {
    // getter
    this.props.projectsGetter().then(() => null);
  }

  public render() {
    return (
      <div className={[common.Container].join(' ')}>

        { this.props.projects.map((project, ind) => {
          return (
            <div
              key={ind}
              className={common.Interview}
            >
              <span
                className={common.Title}
                onClick={() => this.openProject(project._id)}>
                {project.name || project.created}
              </span>
              <span
                className={[common.Edit, common.Button].join(' ')}
                onClick={() => this.changeProject(project._id)}
                title="Переименовать"
              >
                &#9999;
              </span>
              <span
                className={[common.Delete, common.Button].join(' ')}
                onClick={() => this.deleteProject(project._id)}
                title="Удалить"
              >
                &#10006;
              </span>
            </div>
          );
        })}
        <button
          className={common.New}
          onClick={this.addProject}
        >
          + Добавить проект
        </button>
      </div>
    );
  }
}

const mapStateToProps = (store: IAppState) => {
  return {
    projects: store.projectsState.data,
  };
};

const mapDispatchToProps = (dispatch: NewThunkDispatch) => {
  return {
    projectsGetter: () => dispatch(getProjectsData()),
    addProject: (name: string) => dispatch(addProject(name)),
    deleteProject: (id: string) => dispatch(deleteProject(id)),
    changeProject: (id: string, name: string) => dispatch(changeProject(id, name)),
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Projects);
