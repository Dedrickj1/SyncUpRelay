import { NavLink } from "react-router-dom";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";

function Navigation() {
  return (
    <nav className="navigation-bar">
      <div className="nav-left">
        
        <NavLink to="/welcome">SyncUpRelay</NavLink>
      </div>

      <div className="nav-center">
      
      </div>

      <div className="nav-right">
        <ProfileButton />
      </div>
    </nav>
  );
}

export default Navigation;
