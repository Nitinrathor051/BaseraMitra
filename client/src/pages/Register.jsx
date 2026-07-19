import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, UserPlus } from "lucide-react";
import { toast } from "react-toastify";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";

import "../styles/Auth.css";


const Register = () => {

  const navigate = useNavigate();

  const { register, loading } = useAuth();



  const [showPassword, setShowPassword] =
  useState(false);


  const [showConfirmPassword, setShowConfirmPassword] =
  useState(false);



  const [showOTP, setShowOTP] =
  useState(false);



  const [otp, setOtp] =
  useState("");



  const [registeredEmail, setRegisteredEmail] =
  useState("");





  const [formData, setFormData] = useState({

    fullName:"",

    email:"",

    phone:"",

    password:"",

    confirmPassword:"",

  });







  const handleChange = (e)=>{


    setFormData((prev)=>({

      ...prev,

      [e.target.name]:e.target.value

    }));

  };








  // ================= Register =================


  const handleSubmit = async(e)=>{


    e.preventDefault();




    if(
      formData.password !== 
      formData.confirmPassword
    ){

      return toast.error(
        "Passwords do not match"
      );

    }







    const result = await register({

      fullName:formData.fullName,

      email:formData.email,

      phone:formData.phone,

      password:formData.password,

    });








    if(result.success){


      toast.success(

        result.message ||
        "OTP sent to your email"

      );



      setRegisteredEmail(

        formData.email

      );



      setShowOTP(true);



    }

    else{


      toast.error(

        result.message

      );


    }



  };









  // ================= Verify OTP =================


  const handleVerifyOTP = async()=>{


    try{


      const response =
      await api.post(

        "/api/v1/auth/verify-email",

        {

          email:registeredEmail,

          otp

        }

      );





      if(response.data.success){


        toast.success(

          "Email verified successfully"

        );



        navigate("/login");


      }



    }

    catch(error){


      toast.error(

        error.response?.data?.message ||

        "OTP verification failed"

      );


    }


  };








  return (

    <section className="auth-page">

      <div className="auth-card">


        <div className="auth-header">

          <h1>

          {
            showOTP
            ?
            "Verify Email"
            :
            "Create Account"
          }

          </h1>



          <p>

          {
            showOTP

            ?

            "Enter OTP sent to your email"

            :

            "Create your BaseraMitra account"

          }

          </p>


        </div>





        {!showOTP ? (

        <form
        onSubmit={handleSubmit}
        className="auth-form"
        >
                    <div className="form-group">

            <label>
              Full Name
            </label>


            <input

              type="text"

              name="fullName"

              placeholder="Enter your full name"

              value={formData.fullName}

              onChange={handleChange}

              required

            />

          </div>






          <div className="form-group">

            <label>
              Email Address
            </label>


            <input

              type="email"

              name="email"

              placeholder="Enter your email"

              value={formData.email}

              onChange={handleChange}

              required

            />


          </div>







          <div className="form-group">

            <label>
              Mobile Number
            </label>


            <input

              type="tel"

              name="phone"

              placeholder="Enter your mobile number"

              value={formData.phone}

              onChange={handleChange}

              maxLength={10}

              required

            />


          </div>







          <div className="form-group">

            <label>
              Password
            </label>


            <div className="password-box">


              <input

                type={
                  showPassword
                  ?
                  "text"
                  :
                  "password"
                }

                name="password"

                placeholder="Create password"

                value={formData.password}

                onChange={handleChange}

                required

              />



              <button

                type="button"

                onClick={() =>
                  setShowPassword(!showPassword)
                }

              >

                {
                  showPassword

                  ?

                  <EyeOff size={20}/>

                  :

                  <Eye size={20}/>

                }


              </button>


            </div>


          </div>







          <div className="form-group">

            <label>
              Confirm Password
            </label>


            <div className="password-box">


              <input

                type={
                  showConfirmPassword
                  ?
                  "text"
                  :
                  "password"
                }

                name="confirmPassword"

                placeholder="Confirm password"

                value={
                  formData.confirmPassword
                }

                onChange={handleChange}

                required

              />



              <button

                type="button"

                onClick={() =>
                  setShowConfirmPassword(
                    !showConfirmPassword
                  )
                }

              >

                {
                  showConfirmPassword

                  ?

                  <EyeOff size={20}/>

                  :

                  <Eye size={20}/>

                }


              </button>


            </div>


          </div>







          <button

            type="submit"

            className="login-btn"

            disabled={loading}

          >


            <UserPlus size={18}/>


            {
              loading
              ?
              "Creating Account..."
              :
              "Register"
            }


          </button>





        </form>



        ) : (





        <div className="auth-form">


          <div className="form-group">


            <label>
              Enter OTP
            </label>



            <input

              type="text"

              placeholder="Enter 6 digit OTP"

              value={otp}

              onChange={(e)=>
                setOtp(e.target.value)
              }

              maxLength={6}

              required

            />


          </div>






          <button

            type="button"

            className="login-btn"

            onClick={handleVerifyOTP}

          >

            Verify Email

          </button>






        </div>



        )}








        <div className="auth-footer">


          {
            !showOTP && (

            <p>

              Already have an account?


              <Link to="/login">

                {" "}
                Login

              </Link>


            </p>

            )

          }



        </div>



      </div>


    </section>

  );


};


export default Register;