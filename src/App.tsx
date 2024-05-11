import {
  createBrowserRouter,
} from "react-router-dom";
import Chat from './components/Chat';

const App = createBrowserRouter([
  {
    path: "/",
    element: <Chat />,
  },
]);

export default App
