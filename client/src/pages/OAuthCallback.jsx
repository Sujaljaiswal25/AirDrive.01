import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { Cloud, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { loginSuccess, loginFailure } from "../store/slices/authSlice";
import { authAPI } from "../services/auth.service";

const OAuthCallback = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      const token = searchParams.get("token");
      const error = searchParams.get("error");

      if (error) {
        toast.error(decodeURIComponent(error));
        dispatch(loginFailure(error));
        navigate("/login");
        return;
      }

      if (!token) {
        toast.error("No authentication token received");
        dispatch(loginFailure("No token received"));
        navigate("/login");
        return;
      }

      try {
        // Store the access token
        localStorage.setItem("accessToken", token);

        // Fetch user profile with the new token
        const response = await authAPI.getProfile();

        // Handle the response structure properly
        const userData = response.user || response.data?.user || response.data;

        if (!userData) {
          throw new Error("No user data received from profile API");
        }

        // Dispatch login success with user data and token
        dispatch(
          loginSuccess({
            user: userData,
            accessToken: token,
          })
        );

        toast.success("Successfully signed in with Google!");
        navigate("/dashboard");
      } catch (error) {
        console.error("OAuth callback error:", error);
        const errorMsg =
          error.response?.data?.message ||
          error.message ||
          "Failed to complete authentication";
        toast.error(errorMsg);
        dispatch(loginFailure(errorMsg));
        localStorage.removeItem("accessToken");
        navigate("/login");
      }
    };

    handleOAuthCallback();
  }, [searchParams, navigate, dispatch]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-bg via-dark-card to-dark-bg flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="text-center"
      >
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-accent-primary to-accent-secondary rounded-2xl shadow-dark-xl mb-6 relative">
          <Cloud className="w-10 h-10 text-white" />
        </div>

        <div className="flex items-center justify-center gap-3 mb-4">
          <Loader2 className="w-6 h-6 text-accent-primary animate-spin" />
          <h2 className="text-2xl font-bold text-dark-text-primary">
            Completing Sign In
          </h2>
        </div>

        <p className="text-dark-text-secondary">
          Please wait while we authenticate your account...
        </p>
      </motion.div>
    </div>
  );
};

export default OAuthCallback;
