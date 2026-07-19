import { Link } from "react-router-dom";
import { Mail, MapPin } from "lucide-react";

import { useAuth } from "../context/AuthContext";

import logo from "../assets/baseramitralogo.png";

import "../styles/footer.css";

const Footer = () => {

    const {
        user,
        isAuthenticated
    } = useAuth();

    return (

        <footer className="footer">

            <div className="footer-container">

                {/* Main Footer */}

                <div className="footer-grid">

                    {/* Brand */}

                    <div className="footer-brand">

                        <Link to="/">

                            <img
                                src={logo}
                                alt="BaseraMitra"
                            />

                        </Link>

                        <p>

                            BaseraMitra is a modern real estate platform
                            helping users discover verified properties for
                            buying and renting with trust, simplicity and
                            transparency.

                        </p>

                    </div>





                    {/* Pages */}

                    <div className="footer-column">

                        <h3>
                            Pages
                        </h3>

                        <Link to="/">
                            Home
                        </Link>

                        <Link to="/buy">
                            Buy
                        </Link>

                        <Link to="/rent">
                            Rent
                        </Link>

                        <Link to="/about">
                            About
                        </Link>

                        <Link to="/contact">
                            Contact
                        </Link>

                    </div>





                    {/* Account */}

                    <div className="footer-column">

                        <h3>
                            Account
                        </h3>

                        {

                            !isAuthenticated ? (

                                <>

                                    <Link to="/login">
                                        Login
                                    </Link>

                                    <Link to="/register">
                                        Register
                                    </Link>

                                </>

                            ) : user?.role === "customer" ? (

                                <>

                                    <Link to="/customer-dashboard">
                                        Dashboard
                                    </Link>

                                    <Link to="/become-owner">
                                        List Your Property
                                    </Link>

                                </>

                            ) : (

                                <>

                                    <Link to="/add-property">
                                        Add Property
                                    </Link>
                                    <Link to="/customer-dashboard">
                                        Customer Dashboard
                                    </Link>
                                    <Link to="/owner-dashboard">
                                        Owner Dashboard
                                    </Link>                   
                                    

                                </>

                            )

                        }

                    </div>





                    {/* Contact */}

                    <div className="footer-column">

                        <h3>
                            Contact
                        </h3>

                        <div className="footer-contact">

                            <MapPin size={18} />

                            <span>
                                Gwalior, Madhya Pradesh, India
                            </span>

                        </div>

                        <div className="footer-contact">

                            <Mail size={18} />

                            <span>
                                baseramitra@gmail.com
                            </span>

                        </div>

                    </div>

                </div>





                {/* Bottom */}

                <div className="footer-bottom">

                    <p>

                        © {new Date().getFullYear()} BaseraMitra.
                        All rights reserved.

                    </p>

                    <p>

                        Built with MERN Stack

                    </p>

                </div>

            </div>

        </footer>

    );

};

export default Footer;