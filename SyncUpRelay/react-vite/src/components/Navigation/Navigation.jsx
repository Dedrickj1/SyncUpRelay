import { NavLink } from "react-router-dom";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";

function Navigation() {
  return (
    <nav className="navigation-bar">
      <div className="nav-left">
        <NavLink to="/">Home</NavLink>
      </div>

      <div className="nav-center">
        <ProfileButton />
      </div>

      <div className="nav-right">
        {/* You can add other links here later */}
      </div>
    </nav>
  );
}

export default Navigation;
