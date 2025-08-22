import { createBrowserRouter } from 'react-router-dom';
import WelcomePage from '../components/WelcomePage';
import Layout from './Layout';
import { ModalProvider, Modal } from '../context/Modal';

export const router = createBrowserRouter([
  {
   
    path: "/",
    element: <Layout />,
    children: [
      
    ],
  },
  {
   
    path: "/welcome",
    element: (
      <ModalProvider>
        <WelcomePage />
        <Modal />
      </ModalProvider>
    ),
  },
]);
