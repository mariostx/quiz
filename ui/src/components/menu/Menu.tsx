import React, { FC } from "react";
import { Link } from "react-router-dom";
import "./style.scss";

const Menu: FC = () => {
  return <div className="menu">
    <div>
        <Link className="link" to="/quiz">Quiz Game</Link>
        <Link className="link" to="/question/new">Question Editor</Link>
    </div>
    <div className="justify-end">
      <div className="menu-item">Signup</div>
      <div className="menu-item">Login</div>
    </div>
  </div>;
};

export default Menu;
