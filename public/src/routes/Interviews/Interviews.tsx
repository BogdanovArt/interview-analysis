import * as React from 'react';
import {connect} from 'react-redux';
import {AnyAction} from 'redux';
import {Link} from 'react-router-dom';
import {ThunkDispatch} from 'redux-thunk';
import Axios from 'axios';

import {IAppState} from 'store/rootReducers';
import {createInterview, deleteInterview, getInterviewsData, IInterviewData, IInterviewState, changeInterview} from 'store/interviews';
import {textBreaker} from 'utils';
import {AnalysisDataI} from 'store/analysis';

import {ListModal} from './blocks';
import styles from './styles.module.scss';
import common from '../Analysis/styles.module.scss';

type NewThunkDispatch = ThunkDispatch<IInterviewState, null, AnyAction>;

interface IProps {
  title?: string;
  interviewsGetter: (id: string) => Promise<any>;
  deleteInterview: (id: string) => Promise<any>;
  changeInterview: (id: string, data: any) => Promise<any>;
  createInterview: ({title, project_id, content}: { title: string; content: AnalysisDataI; project_id: string }) => Promise<any>;
  interviews: IInterviewData[];
}

interface IState {
  showModal: boolean;
  modalData: IInterviewData[];
}

class Interviews extends React.Component<IProps, IState> {

  public state = {
    showModal: false,
    modalData: []
  }

  deleteInterview = (id?: string) => {
    if (id) {
      this.props.deleteInterview(id)
        .then(() => {
          this.getInterviews();
        })
        .catch((err) => {
          console.warn(err);
        });
    }
  }

  changeInterview = (id: string) => {
    const title = prompt('Введите название');    
    this.props.changeInterview(id, { title })
      .then(() => {
        this.getInterviews();
      })
      .catch((err) => {
        console.warn(err);
      });
  }

  unbindInterview = (id: string) => {   
    this.props.changeInterview(id, { unbind: true })
      .then(() => {
        this.getInterviews();
      })
      .catch((err) => {
        console.warn(err);
      });
  }

  bindInterview = (id: string) => { 
    const project = (this.props as any).match.params.project;
    this.props.changeInterview(id, { bind: project })
      .then(() => {
        this.getInterviews();
        this.closeModal();
      })
      .catch((err) => {
        console.warn(err);
      });
  }

  openInterview = (id?: string) => {
    if (id) {
      (this.props as any).history.push('/interviews/' + id);
    }
  }

  addInterview = () => {
    const input = prompt('Вставьте контент (текст или JSON)');
    const title = prompt('Введите название');
    const project_id = (this.props as any).match.params.project;
    let content;
    if (input) {
      try {
        content = JSON.parse(input);
        if (content.atoms && content.atoms.length && content.atoms[0].type) {
          content.atoms = content.atoms.map((atom: any) => {
            return {
              atom_type: atom.type,
              content: atom.content,
              id: atom.id
            }
          })
        }
      } catch (err) {
        content = {
          blocks: textBreaker(input),
          atoms: []
        };
      }
      if (content) {
        this.props.createInterview({ 
            title: title || '',
            content,
            project_id
          })
          .then((res) => {
            const { data } = res.data;
            if (data) {
              const id = data._id;
              if (id) {
                (this.props as any).history.push('/interviews/' + id);
              }
            }
          })
          .catch((err) => {
            console.warn(err);
          });
      }
    } else {
      alert('Необходимо заполнить поле контент')
    }

  }

  getInterviews = () => {
    this.props.interviewsGetter((this.props as any).match.params.project);
  }

  openModal = () => {
    Axios({
      url: '/api/interviews',
      method: 'GET'
    })
    .then((res) => {
      console.log(res.data);
      this.setState({
        showModal: true,
        modalData: res.data,
      })
    })
    .catch(err => {
      console.warn(err);
    })
  }

  closeModal = () => {
    this.setState({
      showModal: false
    })
  }
  
  renderInterviewModal = () => {
    return this.state.showModal
      ? (
        <ListModal
          close={this.closeModal}
          list={this.state.modalData}
          bind={this.bindInterview}
        />
      )
      : null;
  }

  componentDidMount(): void {
    this.getInterviews();
  }

  public render() {
    const interviews = this.props.interviews;
    return (
      <div className={[styles.Container].join(' ')}>
         <div className={common.BreadCrumbs}>
          <Link to='/projects'>
            <span>Проекты</span>
          </Link>
          <span>/</span>
          <span>{this.props.title}</span>
        </div>
        { this.props.title ? <h2>{this.props.title}</h2> : ''}
        { interviews.map((el, ind) => {
          return (
            <div
              key={ind}
              className={styles.Interview}
            >
              <span
                className={styles.Title}
                onClick={() => this.openInterview(el._id)}>
                {el.title || el.date}
              </span>
              <span
                className={[styles.Edit, styles.Button].join(' ')}
                onClick={() => this.changeInterview(el._id as string)}
                title="Переименовать"
              >
                &#9999;
              </span>

              <span
                className={[styles.Delete, styles.Button].join(' ')}
                onClick={() => this.unbindInterview(el._id as string)}
                title="Отвязать"
              >
                &#8764;
              </span>
              <span
                className={[styles.Delete, styles.Button].join(' ')}
                onClick={() => this.deleteInterview(el._id)}
                title="Удалить"
              >
                &#10006;
              </span>
            </div>
          );
        }) }
        <button
          className={styles.New}
          onClick={this.addInterview}
        >
          + Новое интервью
        </button>
        <button
          className={styles.New}
          onClick={this.openModal}
        >
          + Добавить
        </button>
        { this.renderInterviewModal() }
      </div>
    );
  }
}

const mapStateToProps = (store: IAppState) => {
  return {
    interviews: store.interviewsState.interviews,
    title: store.interviewsState.name
  };
};

const mapDispatchToProps = (dispatch: NewThunkDispatch) => {
  return {
    interviewsGetter: (id: string) => dispatch(getInterviewsData(id)),
    deleteInterview: (id: string) => dispatch(deleteInterview(id)),
    changeInterview: (id: string, data: any) => dispatch(changeInterview(id, data)),
    createInterview: ({ title, project_id, content }: { title: string; content: AnalysisDataI; project_id: string }) => dispatch(createInterview({ title, content, project_id })),
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Interviews);
