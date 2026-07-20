import { useEffect, useState } from "react";

import {
  User,
  Heart,
  MessageSquare,
  Mail,
  Phone,
} from "lucide-react";

import { Link } from "react-router-dom";

import api from "../services/api";

import { useAuth } from "../context/AuthContext";

import PropertyCard from "../components/PropertyCard";

import "../styles/CustomerDashboard.css";


const CustomerDashboard = () => {


  const { user } = useAuth();



  const [favorites, setFavorites] = useState([]);

  const [loading, setLoading] = useState(true);




  // =====================================
  // GET CUSTOMER FAVORITES
  // =====================================


  const fetchFavorites = async () => {

    try {


      const { data } = await api.get(
        "/favorites"
      );


      setFavorites(
        data.favorites || []
      );


    } catch (error) {


      console.log(
        "Favorite fetch error:",
        error.message
      );


    } finally {


      setLoading(false);


    }

  };





  // =====================================
  // UPDATE FAVORITE STATE
  // =====================================


  const updateFavoriteIds = (updater) => {


    setFavorites((prev) => {


      const currentIds =
        prev.map(
          item => item.property._id
        );



      const updatedIds =
        typeof updater === "function"
        ? updater(currentIds)
        : updater;




      return prev.filter(

        item =>

        updatedIds.includes(
          item.property._id
        )

      );


    });


  };







  // =====================================
  // LOAD DATA
  // =====================================


  useEffect(() => {


    fetchFavorites();


  }, []);






  return (


    <main className="customer-dashboard">


      {/* PROFILE SECTION */}


      <section className="customer-section">


        <div className="container">


          <div className="customer-profile-card">


            <div className="customer-profile-icon">

              <User size={35}/>

            </div>





            <div className="customer-profile-info">


              <h2>

                {user?.fullName}

              </h2>





              <p>

                <Mail size={15}/>

                {user?.email}

              </p>





              <p>

                <Phone size={15}/>

                {user?.phone || "Phone not added"}

              </p>





              <span className="customer-role-badge">

                Customer

              </span>



            </div>



          </div>


        </div>


      </section>






      {/* FAVORITES SECTION */}



      <section className="customer-section">


        <div className="container">



          <div className="customer-section-title">


            <h2>

              My Favorite Properties

            </h2>




            <span>

              {favorites.length} Saved

            </span>



          </div>





          <div className="customer-property-grid">


            {
              loading ? (


                <p>

                  Loading favorites...

                </p>



              ) : favorites.length === 0 ? (


                <div className="customer-empty-card">


                  <Heart size={40}/>



                  <h3>

                    No Favorites Yet

                  </h3>




                  <p>

                    Save properties you like and they will appear here.

                  </p>




                  <Link to="/properties">

                    Explore Properties

                  </Link>



                </div>



              ) : (
                                favorites
                .slice(0,6)
                .map((item)=>(


                  <PropertyCard


                    key={
                      item.property._id
                    }



                    property={
                      item.property
                    }




                    favoriteIds={

                      favorites.map(

                        fav =>

                        fav.property._id

                      )

                    }




                    setFavoriteIds={

                      updateFavoriteIds

                    }


                  />


                ))


              )


            }



          </div>



        </div>


      </section>







      {/* INQUIRY SECTION */}



      <section className="customer-section">


        <div className="container">



          <div className="customer-section-title">


            <h2>

              My Inquiries

            </h2>


          </div>







          <div className="customer-empty-card">


            <MessageSquare size={40}/>





            <h3>

              Inquiry Feature Coming Soon

            </h3>






            <p>

              Your property inquiries and owner responses will appear here.

            </p>





          </div>




        </div>


      </section>






    </main>


  );


};



export default CustomerDashboard;