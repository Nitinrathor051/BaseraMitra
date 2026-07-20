import api from "./api";

const ownerService = {
  // Become Oapi.get(wner
  becomeOwner: async (formData) => {
    try {
      const { data } = await api.post(
        "/api/v1/owner/become-owner",
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
