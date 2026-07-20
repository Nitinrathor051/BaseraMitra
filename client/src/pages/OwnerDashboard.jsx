// OwnerDashboard.jsx (Part 1/2)

import { useEffect, useState } from "react";

import {
  User,
  MessageSquare,
  Edit,
  Trash2,
  Plus,
} from "lucide-react";

import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";

import "../styles/OwnerDashboard.css";


const OwnerDashboard = () => {

  const { user } = useAuth();

  const [properties, setProperties] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);


  const fetchProperties = async () => {
    try {

      const { data } = await api.get(
        "/api/v1/properties/my-properties"
      );

      setProperties(
        data.properties || []
      );

    } catch (error) {

      console.log(
        "Property error:",
        error.message
      );

    }
  };


  const fetchInquiries = async () => {
    try {

      const { data } = await api.get(
        "/api/v1/inquiries"
      );

      setInquiries(
        data.inquiries || []
      );

    } catch (error) {

      console.log(
        "Inquiry error:",
        error.message
      );

    }
  };


  const deleteProperty = async (id) => {

    try {

      await api.delete(
        `/api/v1/properties/${id}`
      );


      setProperties((prev) =>
        prev.filter(
          (item) => item._id !== id
        )
      );


      toast.success(
        "Property deleted successfully"
      );


    } catch (error) {

      toast.error(
        "Delete failed"
      );

    }

  };


  useEffect(() => {

    const loadDashboard = async () => {

      await Promise.all([
        fetchProperties(),
        fetchInquiries()
      ]);

      setLoading(false);

    };


    loadDashboard();

  }, []);



  if (loading) {

    return (
      <p className="owner-loading">
        Loading dashboard...
      </p>
    );

  }



  return (

    <main className="owner-dashboard">

      <div className="container">


        <div className="owner-dashboard-header">

          <div>

            <h1>
              Welcome, {user?.fullName}
            </h1>

            <p>
              Manage your properties and customer inquiries.
            </p>

          </div>


          <Link
            to="/add-property"
            className="owner-add-btn"
          >

            <Plus size={18} />

            Add Property

          </Link>


        </div>


        <div className="owner-profile-card">

          <div className="owner-profile-icon">

            <User size={35} />

          </div>


          <div>

            <h3>
              {user?.fullName}
            </h3>

            <p>
              {user?.email}
            </p>


            <span>
              Verified Owner
            </span>


          </div>

        </div>

        <section className="owner-dashboard-block">


          <div className="owner-block-title">

            <h2>
              My Properties
            </h2>


            <span>
              {properties.length} Listings
            </span>


          </div>



          <div className="owner-property-grid">


            {
              properties.length === 0 ? (

                <p>
                  No properties added yet.
                </p>


              ) : (


                properties.map((property) => (


                  <div
                    className="owner-property-card"
                    key={property._id}
                  >


                    <img
                      src={
                        property.images?.[0]?.url ||
                        "/placeholder.jpg"
                      }
                      alt="property"
                    />


                    <div>


                      <h3>
                        {property.title}
                      </h3>


                      <p>
                        {property.city}, {property.state}
                      </p>



                      <div className="owner-property-extra">


                        <p>
                          {property.propertyType}
                        </p>


                        <p>
                          {property.listingType}
                        </p>


                        <p>
                          ₹ {property.price?.toLocaleString("en-IN")}
                        </p>


                      </div>




                      <div className="owner-actions">


                        <Link
                          to={`/edit-property/${property._id}`}
                        >

                          <Edit size={15} />

                          Edit

                        </Link>




                        <button
                          onClick={() =>
                            deleteProperty(property._id)
                          }
                        >

                          <Trash2 size={15} />

                          Delete

                        </button>


                      </div>


                    </div>


                  </div>


                ))


              )

            }


          </div>


        </section>





        <section className="owner-dashboard-block">


          <div className="owner-block-title">


            <h2>
              Received Inquiries
            </h2>


            <span>
              {inquiries.length}
            </span>


          </div>




          {
            inquiries.length === 0 ? (


              <div className="owner-empty-card">


                <MessageSquare size={35} />


                <h3>
                  No inquiries yet
                </h3>


                <p>
                  Customer inquiries will appear here.
                </p>


              </div>


            ) : (


              <div className="owner-inquiry-grid">


                {
                  inquiries.map((item) => (


                    <div
                      className="owner-inquiry-card"
                      key={item._id}
                    >


                      <div className="owner-inquiry-property">


                        <img
                          src={
                            item.property?.images?.[0]?.url ||
                            "/placeholder.jpg"
                          }
                          alt="property"
                        />


                        <div>


                          <h3>
                            {item.property?.title || "Property"}
                          </h3>


                          <p>
                            📍 {item.property?.city}
                            {item.property?.state &&
                              `, ${item.property.state}`
                            }
                          </p>


                          <p>
                            🏡 {item.property?.propertyType || "Property"}
                          </p>


                          <p>
                            ₹ {
                              item.property?.price
                                ? item.property.price.toLocaleString("en-IN")
                                : "Price unavailable"
                            }
                          </p>


                        </div>


                      </div>





                      <div className="owner-inquiry-details">


                        <h3>
                          Customer Details
                        </h3>


                        <p>
                          👤 {item.name || "Customer"}
                        </p>


                        <p>
                          📧 {
                            item.customer?.email ||
                            "Email unavailable"
                          }
                        </p>


                        <p>
                          📞 {
                            item.phone ||
                            "Not Available"
                          }
                        </p>


                        <p>
                          💬 {
                            item.message ||
                            "No message"
                          }
                        </p>


                        <small>

                          📅{" "}

                          {
                            new Date(item.createdAt)
                              .toLocaleString(
                                "en-IN",
                                {
                                  day:"2-digit",
                                  month:"short",
                                  year:"numeric",
                                  hour:"2-digit",
                                  minute:"2-digit",
                                  hour12:true
                                }
                              )
                          }

                        </small>


                      </div>


                    </div>


                  ))

                }


              </div>


            )

          }


        </section>


      </div>


    </main>

  );

};


export default OwnerDashboard;