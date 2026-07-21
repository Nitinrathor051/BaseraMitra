import { useEffect, useState } from "react";
import {
  Link,
  NavLink,
  useNavigate,
} from "react-router-dom";

import {
  Menu,
  X,
  ChevronDown,
} from "lucide-react";

import {
  motion,
  AnimatePresence,
} from "framer-motion";

import { useAuth } from "../context/AuthContext";

import logo from "../assets/baseramitralogo.png";

import "../styles/Navbar.css";

const publicLinks = [
  {
    name: "Home",
    path: "/",
  },
  {
    name: "Buy",
    path: "/buy",
  },
  {
    name: "Rent",
    path: "/rent",
  },
  {
    name: "About",
    path: "/about",
  },
  {
    name: "Contact",
    path: "/contact",
  },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);

  const [profileOpen, setProfileOpen] =
    useState(false);

  const [scrolled, setScrolled] =
    useState(false);

  const navigate = useNavigate();

  const {
    user,
    isAuthenticated,
    logout,
  } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener(
      "scroll",
      handleScroll
    );

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll
      );
    };
  }, []);

  const handleLogout = () => {
    logout();

    setOpen(false);

    setProfileOpen(false);

    navigate("/login");
  };

  return (
    <header
      className={
        scrolled
          ? "navbar scrolled"
          : "navbar"
      }
    >
      <div className="navbar-container">
        {/* Logo */}

        <Link
          to="/"
          className="navbar-logo"
        >
          <img
            src={logo}
            alt="BaseraMitra"
          />
        </Link>
{/* Desktop Navigation */}

<nav className="desktop-menu">

  {publicLinks.map((item) => (
    <NavLink
      key={item.name}
      to={item.path}
      className={({isActive}) =>
        isActive
          ? "active"
          : ""
      }
    >
      {item.name}
    </NavLink>
  ))}


  {/* Customer Only */}

  {isAuthenticated &&
    user?.role === "customer" && (

    <NavLink
      to="/become-owner"
      className={({isActive}) =>
        isActive
          ? "active"
          : ""
      }
    >
      List Your Property
    </NavLink>

  )}



  {/* Owner Only */}

  {isAuthenticated &&
    user?.role === "owner" && (

    <NavLink
      to="/add-property"
      className={({isActive}) =>
        isActive
          ? "active"
          : ""
      }
    >
      Add Property
    </NavLink>

  )}


</nav>
        {/* Right Side */}
        <div className="navbar-actions">
          {isAuthenticated ? (
            <div className="profile-wrapper">
              <button
                className="profile-btn"
                onClick={() =>
                  setProfileOpen(!profileOpen)
                }
              >
                <span>
                  {user?.fullName}
                </span>

                <ChevronDown size={18} />
              </button>

              {profileOpen && (
                <div className="profile-dropdown">

                  {/* Customer Dashboard */}

                  <Link
                    to="/customer-dashboard"
                    onClick={() =>
                      setProfileOpen(false)
                    }
                  >
                    Customer Dashboard
                  </Link>

                  {/* Owner Dashboard */}

                  {user?.role === "owner" && (
                    <Link
                      to="/owner-dashboard"
                      onClick={() =>
                        setProfileOpen(false)
                      }
                    >
                      Owner Dashboard
                    </Link>
                  )}

                  <button
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="login-link"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="btn-primary"
              >
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}

        <button
          className="mobile-menu-btn"
          onClick={() =>
            setOpen(!open)
          }
        >
          {open ? (
            <X size={26} />
          ) : (
            <Menu size={26} />
          )}
        </button>

      </div>

      {/* Mobile Menu Starts */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{
              opacity: 0,
              height: 0,
            }}
            animate={{
              opacity: 1,
              height: "auto",
            }}
            exit={{
              opacity: 0,
              height: 0,
            }}
            transition={{
              duration: 0.25,
            }}
            className="mobile-menu"
          >
{/* Public Links */}

{publicLinks.map((item) => (

  <NavLink
    key={item.name}
    to={item.path}
    onClick={() =>
      setOpen(false)
    }
  >
    {item.name}
  </NavLink>

))}



{/* Customer Only */}

{isAuthenticated &&
  user?.role === "customer" && (

  <NavLink
    to="/become-owner"
    onClick={() =>
      setOpen(false)
    }
  >
    List Your Property
  </NavLink>

)}




{/* Owner Only */}

{isAuthenticated &&
  user?.role === "owner" && (

  <NavLink
    to="/add-property"
    onClick={() =>
      setOpen(false)
    }
  >
    Add Property
  </NavLink>

)}

            {/* Customer Dashboard */}

            {isAuthenticated && (
              <NavLink
                to="/customer-dashboard"
                onClick={() =>
                  setOpen(false)
                }
              >
                Customer Dashboard
              </NavLink>
            )}

            {/* Owner Dashboard */}

            {isAuthenticated &&
              user?.role === "owner" && (
                <NavLink
                  to="/owner-dashboard"
                  onClick={() =>
                    setOpen(false)
                  }
                >
                  Owner Dashboard
                </NavLink>
              )}

            {!isAuthenticated && (
              <>
                <Link
                  to="/login"
                  onClick={() =>
                    setOpen(false)
                  }
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="btn-primary"
                  onClick={() =>
                    setOpen(false)
                  }
                >
                  Register
                </Link>
              </>
            )}

            {isAuthenticated && (
              <button
                onClick={handleLogout}
              >
                Logout
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;