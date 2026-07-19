import { Routes, Route } from "react-router-dom";

import App from "../App";

import Home from "../pages/Home";
import Properties from "../pages/Properties";
import Buy from "../pages/Buy";
import Rent from "../pages/Rent";
import About from "../pages/About";
import Contact from "../pages/Contact";

import Login from "../pages/Login";
import Register from "../pages/Register";
import ForgotPassword from "../pages/ForgotPassword";

import PropertyDetails from "../pages/PropertyDetails";


import CustomerDashboard from "../pages/CustomerDashboard";
import Favorites from "../pages/Favorites";
import BecomeOwner from "../pages/BecomeOwner";


import OwnerDashboard from "../pages/OwnerDashboard";
import AddProperty from "../pages/AddProperty";

import ProtectedRoute from "../components/ProtectedRoute";



const AppRoutes = () => {

  return (

    <Routes>

      <Route path="/" element={<App />}>


        {/* ==========================
            PUBLIC ROUTES
        ========================== */}


        <Route
          index
          element={<Home />}
        />


        <Route
          path="properties"
          element={<Properties />}
        />


        <Route
          path="buy"
          element={<Buy />}
        />


        <Route
          path="rent"
          element={<Rent />}
        />



        <Route
          path="property/:id"
          element={<PropertyDetails />}
        />



        <Route
          path="about"
          element={<About />}
        />


        <Route
          path="contact"
          element={<Contact />}
        />



        <Route
          path="login"
          element={<Login />}
        />



        <Route
          path="register"
          element={<Register />}
        />



        {/* Forgot Password */}

        <Route
          path="forgot-password"
          element={<ForgotPassword />}
        />






        {/* ==========================
            CUSTOMER ROUTES
        ========================== */}


        <Route
          path="customer-dashboard"
          element={
            <ProtectedRoute role="customer">
              <CustomerDashboard />
            </ProtectedRoute>
          }
        />



        <Route
          path="favorites"
          element={
            <ProtectedRoute>
              <Favorites />
            </ProtectedRoute>
          }
        />



        <Route
          path="become-owner"
          element={
            <ProtectedRoute role="customer">
              <BecomeOwner />
            </ProtectedRoute>
          }
        />







        {/* ==========================
            OWNER ROUTES
        ========================== */}



        <Route
          path="owner-dashboard"
          element={
            <ProtectedRoute role="owner">
              <OwnerDashboard />
            </ProtectedRoute>
          }
        />




        <Route
          path="add-property"
          element={
            <ProtectedRoute role="owner">
              <AddProperty />
            </ProtectedRoute>
          }
        />



        <Route
          path="edit-property/:id"
          element={
            <ProtectedRoute role="owner">
              <AddProperty />
            </ProtectedRoute>
          }
        />



      </Route>

    </Routes>

  );

};


export default AppRoutes;