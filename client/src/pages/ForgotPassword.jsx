import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { LockKeyhole, Mail, KeyRound } from "lucide-react";
import { toast } from "react-toastify";

import api from "../services/api";
import "../styles/auth.css";


const ForgotPassword = () => {

  const navigate = useNavigate();


  const [step, setStep] = useState(1);


  const [email, setEmail] = useState("");

  const [otp, setOtp] = useState("");

  const [newPassword, setNewPassword] =
  useState("");

  const [confirmPassword, setConfirmPassword] =
  useState("");


  const [loading, setLoading] =
  useState(false);






  // ================= Send OTP =================

  const handleSendOTP = async(e)=>{

    e.preventDefault();


    try{

      setLoading(true);


      const response =
      await api.post(

        "/api/v1/auth/forgot-password",

        {
          email
        }

      );



      if(response.data.success){


        toast.success(
          "OTP sent to your email"
        );


        setStep(2);


      }



    }

    catch(error){


      toast.error(

        error.response?.data?.message ||

        "Failed to send OTP"

      );


    }

    finally{

      setLoading(false);

    }


  };









  // ================= Verify OTP =================


  const handleVerifyOTP = async(e)=>{


    e.preventDefault();



    try{


      setLoading(true);



      const response =
      await api.post(

        "/api/v1/auth/verify-reset-otp",

        {

          email,

          otp

        }

      );





      if(response.data.success){


        toast.success(
          "OTP verified"
        );


        setStep(3);


      }



    }

    catch(error){


      toast.error(

        error.response?.data?.message ||

        "Invalid OTP"

      );


    }


    finally{

      setLoading(false);

    }


  };









  // ================= Reset Password =================


  const handleResetPassword = async(e)=>{


    e.preventDefault();




    if(newPassword !== confirmPassword){


      return toast.error(
        "Passwords do not match"
      );


    }





    try{


      setLoading(true);



      const response =
      await api.post(

        "/api/v1/auth/reset-password",

        {

          email,

          otp,

          newPassword

        }

      );





      if(response.data.success){


        toast.success(

          "Password reset successfully"

        );



        navigate("/login");


      }



    }


    catch(error){


      toast.error(

        error.response?.data?.message ||

        "Password reset failed"

      );


    }


    finally{

      setLoading(false);

    }


  };








  return (

    <section className="auth-page">


      <div className="auth-card">



        <div className="auth-header">


          <h1>
            Forgot Password
          </h1>


          <p>

            {
              step === 1

              ?

              "Enter your registered email"

              :

              step === 2

              ?

              "Enter OTP sent to your email"

              :

              "Create your new password"

            }

          </p>


        </div>







        {/* STEP 1 */}

        {
          step === 1 && (

          <form
            onSubmit={handleSendOTP}
            className="auth-form"
          >


            <div className="form-group">


              <label>
                Email Address
              </label>


              <input

                type="email"

                placeholder="Enter your email"

                value={email}

                onChange={(e)=>
                  setEmail(e.target.value)
                }

                required

              />


            </div>





            <button

              className="login-btn"

              disabled={loading}

            >

              <Mail size={18}/>


              {
                loading
                ?
                "Sending OTP..."
                :
                "Send OTP"
              }


            </button>



          </form>

          )

        }








        {/* STEP 2 */}

        {
          step === 2 && (

          <form

            onSubmit={handleVerifyOTP}

            className="auth-form"

          >


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

              className="login-btn"

              disabled={loading}

            >

              <KeyRound size={18}/>


              {
                loading
                ?
                "Verifying..."
                :
                "Verify OTP"
              }


            </button>



          </form>

          )

        }









        {/* STEP 3 */}

        {
          step === 3 && (

          <form

            onSubmit={handleResetPassword}

            className="auth-form"

          >


            <div className="form-group">


              <label>
                New Password
              </label>


              <input

                type="password"

                placeholder="Enter new password"

                value={newPassword}

                onChange={(e)=>
                  setNewPassword(e.target.value)
                }

                required

              />


            </div>






            <div className="form-group">


              <label>
                Confirm Password
              </label>


              <input

                type="password"

                placeholder="Confirm password"

                value={confirmPassword}

                onChange={(e)=>
                  setConfirmPassword(e.target.value)
                }

                required

              />


            </div>






            <button

              className="login-btn"

              disabled={loading}

            >


              <LockKeyhole size={18}/>


              {
                loading
                ?
                "Resetting..."
                :
                "Reset Password"
              }


            </button>




          </form>

          )

        }







        <div className="auth-footer">


          <p>

            Remember password?


            <Link to="/login">

              {" "}
              Login

            </Link>


          </p>


        </div>





      </div>


    </section>

  );

};


export default ForgotPassword;