import api from "./api";

const ownerService = {
  // Become Owner
  becomeOwner: async (formData) => {
    try {
      const { data } = await api.post(
        "/owner/become-owner",
        formData
      );

      return {
        success: true,
        message: data.message,
        owner: data.owner,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Failed to create owner account.",
      };
    }
  },
};

export default ownerService;
