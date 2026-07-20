// src/pages/Properties.jsx (Part 1/2)

import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import api from "../services/api";

import PropertyCard from "../components/PropertyCard";

import { useAuth } from "../context/AuthContext";

import "../styles/Properties.css";



const Properties = () => {


    const [searchParams] = useSearchParams();



    const search =
    searchParams.get("search") || "";



    const propertyType =
    searchParams.get("propertyType") || "";




    const {
        isAuthenticated
    } = useAuth();





    const [properties,setProperties] = useState([]);



    const [favoriteIds,setFavoriteIds] = useState([]);



    const [loading,setLoading] = useState(true);








    // ============================
    // GET ALL PROPERTIES
    // ============================


    const fetchProperties = async()=>{


        try{


            const {data}=await api.get(

                "/properties",

                {

                    params:{

                        ...(search && {
                            search
                        }),


                        ...(propertyType && {
                            propertyType
                        })

                    }

                }

            );



            setProperties(

                data.properties || []

            );



        }

        catch(error){


            console.log(

                "Properties error:",

                error.message

            );


        }

        finally{


            setLoading(false);


        }


    };









    // ============================
    // GET USER FAVORITES
    // ============================


    const fetchFavorites = async()=>{


        if(!isAuthenticated)
            return;



        try{


            const {data}=await api.get(

                "/favorites"

            );



            const ids =

            data.favorites?.map(

                item =>
                item.property._id

            ) || [];



            setFavoriteIds(ids);



        }

        catch(error){


            console.log(

                "Favorite error:",

                error.message

            );


        }


    };









    useEffect(()=>{


        fetchProperties();


    },[search,propertyType]);








    useEffect(()=>{


        fetchFavorites();


    },[isAuthenticated]);









    return (


        <main className="properties-page">





            {/* ==========================
                    HEADER
            ========================== */}



            <section className="listing-header">


                <div className="container">


                    <h1>

                        Explore Properties

                    </h1>



                    <p>

                        Find verified properties
                        for buying and renting.

                    </p>


                </div>


            </section>
            {/* ==========================
                    PROPERTY LIST
            ========================== */}



            <section className="property-section">


                <div className="container">





                    <div className="listing-title">



                        <h2>

                            All Properties

                        </h2>





                        <span>

                            {properties.length} Properties

                        </span>



                    </div>









                    <div className="property-grid">





                        {


                        loading ?





                        (

                            <p>

                                Loading properties...

                            </p>


                        )







                        :







                        properties.length === 0 ?





                        (


                            <p>

                                No properties available.

                            </p>



                        )









                        :







                        properties.map(


                            (property)=>(



                                <PropertyCard



                                    key={

                                        property._id

                                    }



                                    property={

                                        property

                                    }





                                    favoriteIds={

                                        favoriteIds

                                    }





                                    setFavoriteIds={

                                        setFavoriteIds

                                    }





                                />



                            )


                        )





                        }






                    </div>






                </div>


            </section>









        </main>


    );


};




export default Properties;