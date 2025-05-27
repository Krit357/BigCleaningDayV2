import { useState } from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import { Link, Outlet } from "react-router-dom";
import "./SlideBar.css";
import { BiSolidLeftArrow, BiSolidRightArrow } from "react-icons/bi";

const SlideBar = () => {
  const [isOpen, setIsOpen] = useState(true);

  const toggle = () => {
    setIsOpen(!isOpen);
  };
  return (
    <div className={`toggle-btn ${isOpen ? "open" : "close"}`}>
      <button className="close-btn" onClick={toggle}>
        {isOpen ? <BiSolidLeftArrow /> : <BiSolidRightArrow />}
      </button>
      <aside className={isOpen ? "open" : "close"}>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="cleaning-Office">Cleaning Office</Link>
          </li>
          <li>
            <Link to="monthly-schedule">Monthly Schedule</Link>
          </li>
          <li>
            <Link to="qr-Generator" isOpen={isOpen}>
              qr-Generator
            </Link>
          </li>
        </ul>
      </aside>

      <main className={`main ${isOpen ? "has-sidebar" : "full-width"}`}>
        <Outlet context={{ isOpen, toggle }} />
      </main>
    </div>
  );
};

export default SlideBar;
