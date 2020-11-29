import React, { ReactElement } from "react";

import { Link } from "react-router-dom";

export function NavBar(): ReactElement {
  return (
    <>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/inventory">Inventory</Link>
          </li>
          <li>
            <Link to="/manufacturer">Manufacturer</Link>
          </li>
          <li>
            <Link to="/admin">Admin</Link>
          </li>
        </ul>
      </nav>
    </>
  );
}
