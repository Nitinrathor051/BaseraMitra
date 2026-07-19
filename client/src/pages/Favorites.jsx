import { useEffect, useState } from "react";
import {
  Heart,
  Trash2,
  Home
} from "lucide-react";
import { toast } from "react-toastify";

import api from "../services/api";

import PropertyCard from "../components/PropertyCard";

import "../styles/Favorites.css";


const Favorites = () => {


  const [favorites,setFavorites] = useState([]);

  const [loading,setLoading] = useState(true);




  // Get Favorites

  const fetchFavorites = async()=>{


    try{


      const {data} = await api.get(
        "/api/v1/favorites"
      );


      setFavorites(
        (data.favorites || [])
          .map((favorite) => favorite.property)
          .filter(Boolean)
      );


    }
    catch(error){

      toast.error(
        error.response?.data?.message ||
        "Failed to load favorites"
      );

    }
    finally{

      setLoading(false);

    }

  };





  // Remove Favorite

  const removeFavorite = async(id)=>{


    try{


      await api.delete(
        `/api/v1/favorites/${id}`
      );


      setFavorites((prev)=>

        prev.filter(
          (item)=>
          item._id !== id
        )

      );



      toast.success(
        "Removed from favorites"
      );


    }
    catch(error){


      toast.error(
        error.response?.data?.message ||
        "Unable to remove favorite"
      );


    }

  };





  useEffect(()=>{


    fetchFavorites();


  },[]);






  return (

    <main className="favorites-page">



      <section className="favorites-header">


        <div className="container">


          <h1>

            <Heart size={38}/>

            My Favorites

          </h1>


          <p>
            Your saved properties in one place.
          </p>


        </div>


      </section>







      <section className="favorites-section">


        <div className="container">



        {

          loading ?


          (

            <p>
              Loading favorites...
            </p>

          )



          :



          favorites.length === 0 ?


          (

            <div className="empty-favorite">


              <Home size={45}/>


              <h2>
                No Favorites Yet
              </h2>


              <p>
                Save properties you like
                to view them here.
              </p>


            </div>


          )



          :



          <div className="favorite-grid">


          {

            favorites.map(
              (property)=>(


                <div
                  className="favorite-card"
                  key={property._id}
                >


                  <PropertyCard

                    property={property}

                  />



                  <button

                    className="remove-favorite"

                    onClick={()=>
                      removeFavorite(
                        property._id
                      )
                    }

                  >

                    <Trash2 size={17}/>

                    Remove

                  </button>



                </div>


              )
            )

          }


          </div>


        }



        </div>


      </section>




    </main>

  );

};


export default Favorites;
