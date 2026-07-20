import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
  MapPin,
  Heart,
  IndianRupee,
  Home,
  Send
} from "lucide-react";

import { toast } from "react-toastify";

import api from "../services/api";

import { useAuth } from "../context/AuthContext";

import "../styles/property-details.css";



const PropertyDetails = () => {


  const { id } = useParams();

  const navigate = useNavigate();



  const {
    isAuthenticated
  } = useAuth();





  const [property,setProperty] = useState(null);

  const [loading,setLoading] = useState(true);


  const [activeImage,setActiveImage] = useState(0);



  const [favorite,setFavorite] = useState(false);

  const [savingFavorite,setSavingFavorite] = useState(false);



  const [inquirySent,setInquirySent] = useState(false);



  const [inquiry,setInquiry] = useState({

    name:"",
    phone:"",
    message:""

  });



  const [sending,setSending] = useState(false);





  // ===============================
  // FETCH PROPERTY
  // ===============================


  const fetchProperty = async()=>{


    try{


      const {data}=await api.get(
        `/properties/${id}`
      );


      setProperty(
        data.property
      );


    }
    catch(error){

      toast.error(
        "Property not found"
      );

    }
    finally{

      setLoading(false);

    }


  };







  // ===============================
  // CHECK FAVORITE
  // ===============================


  const checkFavorite = async()=>{


    if(!isAuthenticated)
      return;



    try{


      const {data}=await api.get(
        "/favorites"
      );



      const exists =
      data.favorites?.some(
        item =>
        item.property._id === id
      );



      setFavorite(exists);



    }
    catch(error){

      console.log(error.message);

    }


  };







  useEffect(()=>{


    fetchProperty();


  },[id]);






  useEffect(()=>{


    checkFavorite();


  },[isAuthenticated,id]);









  // ===============================
  // FAVORITE
  // ===============================


  const handleFavorite = async()=>{


    if(!isAuthenticated){

      navigate("/login");

      return;

    }



    if(savingFavorite)
      return;




    try{


      setSavingFavorite(true);



      if(favorite){


        await api.delete(
          `/favorites/${id}`
        );


        setFavorite(false);


        toast.success(
          "Removed from favorites"
        );


      }

      else{


        await api.post(
          `/favorites/${id}`
        );


        setFavorite(true);


        toast.success(
          "Added to favorites"
        );


      }



    }
    catch(error){


      toast.error(
        error.response?.data?.message ||
        "Favorite update failed"
      );


    }
    finally{

      setSavingFavorite(false);

    }


  };








  // ===============================
  // INQUIRY
  // ===============================


  const handleInquiry = async(e)=>{


    e.preventDefault();



    if(!isAuthenticated){

      navigate("/login");

      return;

    }



    try{


      setSending(true);



      const {data}=await api.post(

        `/inquiries/${id}`,

        inquiry

      );



      toast.success(

        data.message ||
        "Inquiry sent successfully"

      );



      setInquirySent(true);



      setInquiry({

        name:"",
        phone:"",
        message:""

      });



    }
    catch(error){


      toast.error(

        error.response?.data?.message ||
        "Inquiry failed"

      );


    }
    finally{

      setSending(false);

    }


  };







  if(loading)
    return <p>Loading...</p>;



  if(!property)
    return <p>Property not found</p>;







return (

<main className="property-details">







{/* ===============================
      FULL WIDTH IMAGE GALLERY
================================ */}


<section className="details-gallery">



<div className="details-image">


<img

src={
property.images?.[activeImage]?.url ||
"/placeholder.jpg"
}

alt={property.title}

/>





<button


className={

favorite

?

"details-favorite-btn active"

:

"details-favorite-btn"

}


onClick={handleFavorite}


disabled={savingFavorite}


>


<Heart

size={20}

fill={
favorite
?
"currentColor"
:
"none"
}

/>


</button>



</div>








<div className="image-thumbnails">


{

property.images?.map(

(image,index)=>(


<img

key={index}

src={image.url}

alt="property"

onClick={()=>


setActiveImage(index)


}


/>


)


)

}



</div>






</section>







{/* ===============================
      DETAILS + INQUIRY LAYOUT
================================ */}


<section className="details-layout">





{/* LEFT CONTENT */}


<div className="details-info">



<h1>

{property.title}

</h1>





<div className="location">

<MapPin size={18}/>

{property.city}, {property.state}

</div>





<h2>


<IndianRupee size={20}/>


{property.price?.toLocaleString("en-IN")}



{

property.listingType==="rent" &&

<small>
/month
</small>

}


</h2>





<div className="basic-info">


<span>

<Home size={16}/>

{property.propertyType}

</span>



<span>

{property.area} sq.ft

</span>



<span>

{property.listingType}

</span>


</div>





<p>

{property.description}

</p>





{/* OWNER BOX MOVED HERE */}


<div className="owner-box">


<h3>

Property Owner

</h3>


<p>

👤 {property.owner?.fullName || "Verified Owner"}

</p>


<small>

Contact details are shared after inquiry.

</small>


</div>



</div>
{/* RIGHT SIDEBAR - INQUIRY */}

<div className="details-sidebar">



<div className="inquiry-box">


<h3>

Send Inquiry

</h3>






{

inquirySent ?


<div className="success-box">


✅ Inquiry already sent.


<br/>


Owner will contact you soon.


</div>



:



<form onSubmit={handleInquiry}>


<input

placeholder="Your Name"

value={inquiry.name}

onChange={
e=>
setInquiry({

...inquiry,

name:e.target.value

})
}

/>





<input

placeholder="Phone Number"

value={inquiry.phone}

onChange={
e=>
setInquiry({

...inquiry,

phone:e.target.value

})
}

/>





<textarea

placeholder="Message"

value={inquiry.message}

onChange={
e=>
setInquiry({

...inquiry,

message:e.target.value

})
}

/>





<button

disabled={sending}

>


<Send size={17}/>


{

sending

?

"Sending..."

:

"Send Inquiry"

}


</button>



</form>


}





</div>





</div>





</section>





</main>


);


};



export default PropertyDetails;