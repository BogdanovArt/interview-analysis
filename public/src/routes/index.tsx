import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";

import { Interviews } from "components//pages/Interviews/Interviews";
import { Projects } from "components/pages/Projects/Projects";


import { routes } from "./enums";
import { Analysis } from "components/pages/Analysis/Analysis";

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
