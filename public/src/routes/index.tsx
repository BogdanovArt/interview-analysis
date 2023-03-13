import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";

import { Interviews } from "components//pages/Interviews/Interviews";
import { Projects } from "components/pages/Projects/Projects";
import { Analysis } from "components/pages/Analysis/Analysis";
import { Edit } from "components/pages/Edit/Edit";


import { routes } from "./enums";

const Guard = () => <Redirect to={routes.projects} />;

const Routes = [
  {
    component: Guard,
    path: "/",
  },
  {
    component: Projects,
    path: routes.projects,
  },
  {
    component: Edit,
    path: routes.edit,
  },
  {
    component: Interviews,
    path: routes.project,
  },
  {
    component: Analysis,
    path: routes.interview,
  }
];


export const Router = () => {
  return (
    <BrowserRouter>
      <Switch>
        {Routes.map((route, ind) => <Route key={ind} exact {...route} />)}
      </Switch>
    </BrowserRouter>
  );
};
