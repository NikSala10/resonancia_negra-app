import { createBrowserRouter } from 'react-router';
import Loading from './pages/Loading';
import Home from './pages/Home';
import PathDecision from './pages/PathDecision';
import Context from './pages/Context';
import Game from './pages/Game';
import Podium from './pages/Podium';
import Ending from './pages/Ending';
import Retos from './pages/Retos';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Loading,
  },
  {
    path: '/home',
    Component: Home,
  },
  {
    path: '/path-decision',
    Component: PathDecision,
  },
  {
    path: '/context',
    Component: Context,
  },
  {
    path: '/game',
    Component: Game,
  },
  {
    path: '/podium',
    Component: Podium,
  },
  {
    path: '/end',
    Component: Ending,
  },
  {
    path: '/retos',
    Component: Retos,
  },
]);
