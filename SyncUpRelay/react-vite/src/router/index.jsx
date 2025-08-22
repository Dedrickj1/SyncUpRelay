import { createBrowserRouter } from 'react-router-dom';
import WelcomePage from '../components/WelcomePage';
import LoginFormPage from '../components/LoginFormPage';
import SignupFormPage from '../components/SignupFormPage';
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
  {
    path: "login",
    element: <LoginFormPage />,
  },
  {
    path: "signup",
    element: <SignupFormPage />,
  },
]);