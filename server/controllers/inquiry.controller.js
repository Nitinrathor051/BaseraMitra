import Inquiry from "../models/Inquiry.js";
import Property from "../models/Property.js";


// ================= Send Inquiry (Customer) =================

export const sendInquiry = async (req, res) => {
  try {

    const { propertyId } = req.params;

    const {
      name,
      phone,
      message,
    } = req.body;


    // Check Property Exists

    const property = await Property.findById(propertyId);


    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found.",
      });
    }


    // Create Inquiry

    const inquiry = await Inquiry.create({

      customer: req.user._id,

      owner: property.owner,

      property: property._id,

      name,

      phone,

      message,

    });



    return res.status(201).json({

      success: true,

      message: "Inquiry sent successfully.",

      inquiry,

    });



  } catch (error) {


    return res.status(500).json({

      success: false,

      message: error.message,

    });


  }
};




// ================= Get Owner Inquiries =================

export const getOwnerInquiries = async (req, res) => {

  try {


    const inquiries = await Inquiry.find({

      owner: req.user._id,

    })
      .populate(
        "customer",
        "fullName email"
      )
      .populate(
        "property",
        "title price city"
      )
      .sort({
        createdAt: -1,
      });



    return res.status(200).json({

      success: true,

      count: inquiries.length,

      inquiries,

    });



  } catch (error) {


    return res.status(500).json({

      success: false,

      message: error.message,

    });


  }

};