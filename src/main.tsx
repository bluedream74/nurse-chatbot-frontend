import ReactDOM from 'react-dom/client'
import {
  RouterProvider,
} from "react-router-dom";
import { Provider } from 'react-redux';
import { store } from './store'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <Provider store={store}>
    <RouterProvider router={App} />
  </Provider>
)
