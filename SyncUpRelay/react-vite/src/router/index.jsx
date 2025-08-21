import { createBrowserRouter } from 'react-router-dom';
import WelcomePage from '../components/WelcomePage';
import LoginFormPage from '../components/LoginFormPage';
import SignupFormPage from '../components/SignupFormPage';
import Layout from './Layout';
import { ModalProvider, Modal } from '../context/Modal'; // 1. Import ModalProvider and Modal

export const router = createBrowserRouter([
  {
    // This is the main application layout route
    path: "/",
    element: <Layout />,
    children: [
      // Your main app components will be rendered here via the Outlet
    ],
  },
  {
    // This is the new, separate route for your welcome page
    path: "/welcome",
    // 2. Wrap the WelcomePage with the ModalProvider
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