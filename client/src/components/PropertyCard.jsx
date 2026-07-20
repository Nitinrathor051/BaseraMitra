import { Link, useNavigate } from "react-router-dom";

import {
  MapPin,
  Heart,
  Home,
  IndianRupee
} from "lucide-react";

import {
  toast
} from "react-toastify";

import {
  useState
} from "react";

import {
  useAuth
} from "../context/AuthContext";

import api from "../services/api";

import "../styles/property-card.css";





const PropertyCard = ({
  property,
  favoriteIds = [],
  setFavoriteIds
}) => {


  const navigate = useNavigate();



  const {
    isAuthenticated
  } = useAuth();



  const [saving,setSaving] = useState(false);





  const isFavorite =
  favoriteIds.includes(
    property._id
  );








  const handleFavorite = async(e)=>{


    // Stop card click behaviour

    e.preventDefault();

    e.stopPropagation();




    if(!isAuthenticated){

      navigate("/login");

      return;

    }




    if(saving)
      return;





    try{


      setSaving(true);





      if(isFavorite){



        await api.delete(

          `/favorites/${property._id}`

        );




        setFavoriteIds?.(

          prev =>

          prev.filter(

            id =>

            id !== property._id

          )

        );




        toast.success(

          "Removed from favorites"

        );



      }

      else{



        await api.post(

          `/favorites/${property._id}`

        );




        setFavoriteIds?.(

          prev =>

          [

            ...prev,

            property._id

          ]

        );




        toast.success(

          "Added to favorites"

        );



      }




    }

    catch(error){



      toast.error(

        error.response?.data?.message ||

        "Unable to update favorite"

      );



    }

    finally{


      setSaving(false);


    }


  };









return (



<div className="property-card">









{/* =========================
      IMAGE
========================= */}



<div className="property-image">





<img

src={

property.images?.[0]?.url ||

"/placeholder.jpg"

}

alt={property.title}

/>







<button


type="button"


className={

isFavorite

?

"favorite-btn active"

:

"favorite-btn"

}



onClick={handleFavorite}


disabled={saving}


aria-label="favorite property"



>



<Heart

size={18}

fill={

isFavorite

?

"currentColor"

:

"none"

}


/>


</button>







</div>









{/* =========================
      CONTENT
========================= */}



<div className="property-content">





<h3>

{property.title}

</h3>







<div className="property-location">


<MapPin size={16}/>



<span>

{property.city}, {property.state}

</span>



</div>









<h4>


<IndianRupee size={17}/>



{property.price?.toLocaleString("en-IN")}





{

property.listingType === "rent"

&&


<small>

/month

</small>


}



</h4>











<div className="property-info">





<span>

<Home size={15}/>


{property.propertyType}


</span>







<span>

{property.area} sq.ft


</span>







<span>

{property.listingType}


</span>





</div>









<Link


to={`/property/${property._id}`}


className="view-btn"



>


View Details



</Link>








</div>








</div>


);


};



export default PropertyCard;