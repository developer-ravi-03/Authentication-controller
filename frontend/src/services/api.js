const API_BASE = "/api/auth";

const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE}${endpoint}`;

  const config = {
    credentials: "include", // Send cookies with requests
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  };

  if (options.body && typeof options.body === "object") {
    config.body = JSON.stringify(options.body);
  }

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Something went wrong");
    }

    return data;
  } catch (error) {
    // console.error("API Request Error:", error);
    throw error;
  }
};

export const authAPI = {
  // Request OTP for email verification
  requestOTP: (email) => {
    return apiRequest("/request-otp", {
      method: "POST",
      body: { email },
    });
  },

  // Verify OTP
  verifyOTP: (email, otp) => {
    return apiRequest("/verify-otp", {
      method: "POST",
      body: { email, otp },
    });
  },

  // Sign up user
  signup: (name, email, password) => {
    return apiRequest("/signup", {
      method: "POST",
      body: { name, email, password },
    });
  },

  // Login user
  login: (email, password) => {
    return apiRequest("/login", {
      method: "POST",
      body: { email, password },
    });
  },

  // Logout user
  logout: () => {
    return apiRequest("/logout", {
      method: "POST",
    });
  },

  // Refresh token
  refreshToken: () => {
    return apiRequest("/refresh-token", {
      method: "POST",
    });
  },

  // Get user profile
  getProfile: () => {
    return apiRequest("/profile", {
      method: "GET",
    });
  },
};
