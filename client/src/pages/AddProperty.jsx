// ================================
// AddProperty.jsx (Part 1/4)
// ================================

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import {
  Home,
  Building2,
  IndianRupee,
  MapPin,
  ImagePlus,
  FileText,
  Loader2,
} from "lucide-react";

import api from "../services/api";
import "../styles/AddProperty.css";

const PROPERTY_TYPES = [
  "house",
  "apartment",
  "room",
  "villa",
  "shop",
  "office",
  "pg",
  "plot",
];

const LISTING_TYPES = [
  "rent",
  "buy",
];

const INITIAL_FORM = {
  title: "",
  listingType: "rent",
  propertyType: "house",
  price: "",
  area: "",
  address: "",
  city: "",
  state: "",
  description: "",
};

const AddProperty = () => {
  const navigate = useNavigate();

  const { id } = useParams();

  const isEditMode = Boolean(id);

  const [loading, setLoading] = useState(false);

  const [pageLoading, setPageLoading] =
    useState(isEditMode);

  const [formData, setFormData] =
    useState(INITIAL_FORM);

  const [selectedImages, setSelectedImages] = useState([]);

  const [previewImages, setPreviewImages] =
    useState([]);

  const [existingImages, setExistingImages] =
    useState([]);

  // ===========================================
  // Fetch Property (Edit Mode)
  // ===========================================

  useEffect(() => {
    if (!isEditMode) return;

    fetchProperty();
  }, [id]);

  const fetchProperty = async () => {
    try {
      setPageLoading(true);

      const { data } = await api.get(
        `/properties/${id}`
      );

      const property = data.property;

      setFormData({
        title: property.title || "",

        listingType:
          property.listingType || "rent",

        propertyType:
          property.propertyType || "house",

        price: property.price || "",

        area: property.area || "",

        address: property.address || "",

        city: property.city || "",

        state: property.state || "",

        description:
          property.description || "",
      });

      setExistingImages(
        property.images || []
      );
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to load property."
      );

      navigate("/my-properties");
    } finally {
      setPageLoading(false);
    }
  };
  // ===========================================
// Input Change
// ===========================================

const handleChange = (e) => {
  const { name, value } = e.target;

  setFormData((prev) => ({
    ...prev,
    [name]: value,
  }));
};

// ===========================================
// Image Upload
// ===========================================

const handleImageChange = (e) => {

  const files = Array.from(e.target.files);


  const totalImages =
    selectedImages.length + files.length;


  // Maximum 5 images

  if (totalImages > 5) {

    toast.error(
      "You can select maximum 5 images."
    );

    e.target.value = "";

    return;

  }


  // Image validation

  const invalidFile = files.find(
    (file) =>
      !file.type.startsWith("image/")
  );


  if (invalidFile) {

    toast.error(
      "Only image files are allowed."
    );

    e.target.value = "";

    return;

  }


  // Add new images with old images

  setSelectedImages((prev)=>[
    ...prev,
    ...files
  ]);


  setPreviewImages((prev)=>[
    ...prev,
    ...files.map((file)=>
      URL.createObjectURL(file)
    )
  ]);


  e.target.value = "";

};

// ===========================================
// Remove Selected Image
// ===========================================

const removeSelectedImage = (index) => {

  setSelectedImages((prev) =>
    prev.filter((_, i) => i !== index)
  );

  setPreviewImages((prev) =>
    prev.filter((_, i) => i !== index)
  );

};

// ===========================================
// Validation
// ===========================================

const validateForm = () => {
  if (formData.title.trim().length < 3) {
    toast.error(
      "Title must be at least 3 characters."
    );
    return false;
  }

  if (!formData.listingType) {
    toast.error("Select listing type.");
    return false;
  }

  if (!formData.propertyType) {
    toast.error("Select property type.");
    return false;
  }

  if (!formData.price || Number(formData.price) <= 0) {
    toast.error("Enter valid price.");
    return false;
  }

  if (!formData.area || Number(formData.area) <= 0) {
    toast.error("Enter valid area.");
    return false;
  }

  if (formData.address.trim().length < 5) {
    toast.error("Address is required.");
    return false;
  }

  if (formData.city.trim().length < 2) {
    toast.error("City is required.");
    return false;
  }

  if (formData.state.trim().length < 2) {
    toast.error("State is required.");
    return false;
  }

  if (
    formData.description &&
    formData.description.length > 1000
  ) {
    toast.error(
      "Description cannot exceed 1000 characters."
    );
    return false;
  }
  if(!isEditMode){

if(
selectedImages.length < 2 ||
selectedImages.length > 5
){

toast.error(
"Select 2 to 5 property images."
);

return false;

}

}
  return true;
};

// ===========================================
// Build FormData
// ===========================================

const buildFormData = () => {
  const data = new FormData();

  data.append("title", formData.title);

  data.append(
    "listingType",
    formData.listingType
  );

  data.append(
    "propertyType",
    formData.propertyType
  );

  data.append("price", formData.price);

  data.append("area", formData.area);

  data.append("address", formData.address);

  data.append("city", formData.city);

  data.append("state", formData.state);

  data.append(
    "description",
    formData.description
  );

  selectedImages.forEach((image) => {
  data.append("images", image);
});

  return data;
};
// ===========================================
// Submit Property
// ===========================================

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validateForm()) return;

  try {
    setLoading(true);

    const data = buildFormData();

    let response;

    if (isEditMode) {
      response = await api.put(
        `/properties/${id}`,
        data,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );
    } else {
      response = await api.post(
        "/properties",
        data,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );
    }

    toast.success(response.data.message);

    navigate("/owner-dashboard");
  } catch (error) {
    toast.error(
      error.response?.data?.message ||
        "Something went wrong."
    );
  } finally {
    setLoading(false);
  }
};

// ===========================================
// Loading Screen
// ===========================================

if (pageLoading) {
  return (
    <section className="add-property-page loading-page">
      <Loader2
        className="spin"
        size={40}
      />
      <p>Loading Property...</p>
    </section>
  );
}

// ===========================================
// JSX
// ===========================================

return (
  <section className="add-property-page">
    <div className="add-property-card">
      <div className="page-header">
        <h1>
          {isEditMode
            ? "Edit Property"
            : "Add Property"}
        </h1>

        <p>
          {isEditMode
            ? "Update your property details."
            : "List your property on BaseraMitra."}
        </p>
      </div>

      <form
        className="property-form"
        onSubmit={handleSubmit}
      >
        {/* Basic Information */}

        <div className="form-section">
          <h3>
            <Home size={18} />
            Basic Information
          </h3>

          <div className="form-group">
            <label>Property Title</label>

            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Property Title"
            />
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label>
                Listing Type
              </label>

              <select
                name="listingType"
                value={
                  formData.listingType
                }
                onChange={
                  handleChange
                }
              >
                {LISTING_TYPES.map(
                  (type) => (
                    <option
                      key={type}
                      value={type}
                    >
                      {type
                        .charAt(0)
                        .toUpperCase() +
                        type.slice(
                          1
                        )}
                    </option>
                  )
                )}
              </select>
            </div>

            <div className="form-group">
              <label>
                Property Type
              </label>

              <select
                name="propertyType"
                value={
                  formData.propertyType
                }
                onChange={
                  handleChange
                }
              >
                {PROPERTY_TYPES.map(
                  (type) => (
                    <option
                      key={type}
                      value={type}
                    >
                      {type
                        .charAt(0)
                        .toUpperCase() +
                        type.slice(
                          1
                        )}
                    </option>
                  )
                )}
              </select>
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label>
                Price
              </label>

              <div className="input-icon">
                <IndianRupee
                  size={18}
                />

                <input
                  type="number"
                  name="price"
                  value={
                    formData.price
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Price"
                />
              </div>
            </div>

            <div className="form-group">
              <label>
                Area (sq.ft)
              </label>

              <input
                type="number"
                name="area"
                value={
                  formData.area
                }
                onChange={
                  handleChange
                }
                placeholder="Area"
              />
            </div>
          </div>
        </div>

        {/* Location */}

        <div className="form-section">
          <h3>
            <MapPin size={18} />
            Location
          </h3>

          <div className="form-group">
            <label>Address</label>

            <textarea
              rows={3}
              name="address"
              value={
                formData.address
              }
              onChange={
                handleChange
              }
              placeholder="Complete Address"
            />
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label>City</label>

              <input
                type="text"
                name="city"
                value={
                  formData.city
                }
                onChange={
                  handleChange
                }
              />
            </div>

            <div className="form-group">
              <label>State</label>

              <input
                type="text"
                name="state"
                value={
                  formData.state
                }
                onChange={
                  handleChange
                }
              />
            </div>
          </div>
        </div>

                {/* Images */}

        <div className="form-section">
          <h3>
            <ImagePlus size={18} />
            Property Images
          </h3>

          <div className="form-group">
            <label>
              Upload Images
              {!isEditMode && " (Minimum 2)"}
            </label>

            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
            />
          </div>

          {existingImages.length > 0 && (
            <div className="image-preview-grid">
              {existingImages.map((image, index) => (
                <div
                  className="image-card"
                  key={index}
                >
                  <img
                    src={image.url}
                    alt="Property"
                  />
                </div>
              ))}
            </div>
          )}

          {previewImages.length > 0 && (

<div className="image-preview-grid">

{
previewImages.map(
(image,index)=>(

<div
className="image-card"
key={index}
>


<img
src={image}
alt="preview"
/>


<button
type="button"
className="remove-image"
onClick={()=>removeSelectedImage(index)}
>

×

</button>


</div>

))
}

</div>

)}
        </div>

        {/* Description */}

        <div className="form-section">
          <h3>
            <FileText size={18} />
            Description
          </h3>

          <div className="form-group">
            <textarea
              rows={6}
              name="description"
              placeholder="Write a detailed property description..."
              value={formData.description}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Buttons */}

        <div className="form-actions">
          <button
            type="button"
            className="secondary-btn"
            onClick={() =>
              navigate("/my-properties")
            }
          >
            Cancel
          </button>

          <button
            type="submit"
            className="primary-btn"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2
                  size={18}
                  className="spin"
                />
                {isEditMode
                  ? "Updating..."
                  : "Publishing..."}
              </>
            ) : (
              <>
                <Building2 size={18} />
                {isEditMode
                  ? "Update Property"
                  : "Add Property"}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  </section>
);

};

export default AddProperty;