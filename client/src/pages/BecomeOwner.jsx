import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Camera,
  Home,
  Building2,
  UserCheck,
} from "lucide-react";
import { toast } from "react-toastify";

import { useAuth } from "../context/AuthContext";
import ownerService from "../services/ownerService";

import "../styles/BecomeOwner.css";

const BecomeOwner = () => {
  const navigate = useNavigate();

  const { user, refreshUser } = useAuth();

  const [loading, setLoading] = useState(false);

  const [preview, setPreview] = useState("");

  const [formData, setFormData] = useState({
    profileImage: null,
    address: "",
    city: "",
    state: "",
    pincode: "",
    ownerType: "individual",
    about: "",
  });

  // ==========================
  // INPUT CHANGE
  // ==========================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================
  // IMAGE CHANGE
  // ==========================

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      return toast.error("Please select a valid image.");
    }

    if (file.size > 5 * 1024 * 1024) {
      return toast.error("Image size must be less than 5 MB.");
    }

    setFormData((prev) => ({
      ...prev,
      profileImage: file,
    }));

    setPreview(URL.createObjectURL(file));
  };

  // ==========================
  // SUBMIT
  // ==========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.profileImage)
      return toast.error("Profile image is required.");

    if (formData.address.trim().length < 5)
      return toast.error("Address is required.");

    if (formData.city.trim().length < 2)
      return toast.error("City is required.");

    if (formData.state.trim().length < 2)
      return toast.error("State is required.");

    if (!/^[0-9]{6}$/.test(formData.pincode))
      return toast.error("Invalid pincode.");

    try {
      setLoading(true);

      const data = new FormData();

      data.append("profileImage", formData.profileImage);
      data.append("address", formData.address);
      data.append("city", formData.city);
      data.append("state", formData.state);
      data.append("pincode", formData.pincode);
      data.append("ownerType", formData.ownerType);
      data.append("about", formData.about);

      const result = await ownerService.becomeOwner(data);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);

      await refreshUser();

      navigate("/owner-dashboard", {
        replace: true,
      });
    } catch (error) {
      toast.error(error.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="owner-page">

      {/* ==========================
          HERO
      ========================== */}

      <section className="owner-hero">
        <div className="container owner-hero-content">

          <span className="owner-badge">
            Become a Property Owner
          </span>

          <h1>Start Listing Your Properties</h1>

          <p>
            Upgrade your customer account and publish verified
            properties on BaseraMitra with just a few details.
          </p>

        </div>
      </section>

      {/* ==========================
          FORM
      ========================== */}

      <section className="owner-form-section">
        <div className="container">

          <div className="owner-card">

            <form
              onSubmit={handleSubmit}
              className="owner-form"
            >

              {/* ACCOUNT */}

              <div className="owner-section">

                <h3>
                  <UserCheck size={18} />
                  Account Information
                </h3>

                <div className="owner-grid">

                  <div className="owner-field">
                    <label>Full Name</label>

                    <input
                      type="text"
                      value={user?.fullName || ""}
                      readOnly
                    />
                  </div>

                  <div className="owner-field">
                    <label>Email Address</label>

                    <input
                      type="email"
                      value={user?.email || ""}
                      readOnly
                    />
                  </div>

                  <div className="owner-field owner-full">
                    <label>Mobile Number</label>

                    <input
                      type="text"
                      value={user?.phone || ""}
                      readOnly
                    />
                  </div>

                </div>

              </div>

              {/* OWNER DETAILS */}

              <div className="owner-section">

                <h3>
                  <Home size={18} />
                  Owner Information
                </h3>

                <div className="owner-field">

                  <label>Profile Picture</label>

                  <label className="owner-upload-box">

                    {preview ? (
                      <img
                        src={preview}
                        alt="Preview"
                        className="owner-preview"
                      />
                    ) : (
                      <>
                        <Camera size={28} />

                        <span>Upload Profile Picture</span>

                        <small>
                          JPG / PNG (Max 5MB)
                        </small>
                      </>
                    )}

                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={handleImageChange}
                    />

                  </label>

                </div>
                                <div className="owner-field">
                  <label>Address</label>

                  <textarea
                    name="address"
                    rows={3}
                    placeholder="Enter your complete address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="owner-grid">

                  <div className="owner-field">
                    <label>City</label>

                    <input
                      type="text"
                      name="city"
                      placeholder="Enter city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="owner-field">
                    <label>State</label>

                    <input
                      type="text"
                      name="state"
                      placeholder="Enter state"
                      value={formData.state}
                      onChange={handleChange}
                      required
                    />
                  </div>

                </div>

                <div className="owner-grid">

                  <div className="owner-field">
                    <label>Pincode</label>

                    <input
                      type="text"
                      name="pincode"
                      maxLength={6}
                      placeholder="6 Digit Pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="owner-field">
                    <label>Owner Type</label>

                    <select
                      name="ownerType"
                      value={formData.ownerType}
                      onChange={handleChange}
                    >
                      <option value="individual">
                        Individual
                      </option>

                      <option value="broker">
                        Broker
                      </option>

                      <option value="builder">
                        Builder
                      </option>
                    </select>
                  </div>

                </div>

                <div className="owner-field">
                  <label>About (Optional)</label>

                  <textarea
                    name="about"
                    rows={3}
                    placeholder="Tell customers something about yourself..."
                    value={formData.about}
                    onChange={handleChange}
                  />
                </div>

              </div>

              <button
                type="submit"
                className="owner-submit-btn"
                disabled={loading}
              >
                <Building2 size={18} />

                {loading
                  ? "Creating Owner Account..."
                  : "Create Owner Account"}
              </button>

            </form>

          </div>

        </div>
      </section>

    </main>
  );
};

export default BecomeOwner;