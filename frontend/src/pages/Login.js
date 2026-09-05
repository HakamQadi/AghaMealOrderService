import { useNavigate } from "react-router-dom";
import { Lock, LogIn, Utensils, Phone } from "lucide-react";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import api from "../services/api";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useState } from "react";

const Login = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  // ✅ Validation Schema
  const validationSchema = Yup.object({
    phone: Yup.string()
      .required("Phone number is required")
      .matches(
        /^(077|078|079)\d{7,8}$/,
        "Phone must start with 077, 078, or 079"
      ),
    password: Yup.string().required("Password is required"),
  });

  const handleLogin = async (values, { setSubmitting }) => {
    setError("");

    try {
      const response = await api.post("/login", {
        phone: values.phone,
        password: values.password,
      });

      const { token, user } = response?.data ?? {};

      if (!token || !user?.name) {
        setError("Invalid login credentials.");
        return;
      }

      // This dashboard is staff-only. Without this check any customer account
      // could sign in, because the token itself is valid either way.
      if (user.role !== "admin") {
        setError("This account does not have dashboard access.");
        return;
      }

      localStorage.setItem("authToken", token);
      localStorage.setItem("username", user.name);
      navigate("/");
    } catch (err) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Login failed. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-cyan-500 to-emerald-500 rounded-2xl shadow-2xl mb-4 transform hover:scale-110 transition-all duration-300">
            <Utensils className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-200 to-cyan-400 bg-clip-text text-transparent mb-2">
            Food Admin
          </h1>
          <p className="text-slate-400 text-lg">
            Welcome back! Please login to continue.
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 p-8">
          <Formik
            initialValues={{ phone: "", password: "" }}
            validationSchema={validationSchema}
            onSubmit={handleLogin}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              isSubmitting,
            }) => (
              <Form className="space-y-6">
                <div>
                  <Input
                    label="Phone"
                    type="tel"
                    name="phone"
                    value={values.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    icon={Phone}
                    required
                  />
                  {errors.phone && touched.phone && (
                    <p className="text-red-400 text-sm mt-1">{errors.phone}</p>
                  )}
                </div>

                <div>
                  <Input
                    label="Password"
                    type="password"
                    name="password"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    icon={Lock}
                    required
                  />
                  {errors.password && touched.password && (
                    <p className="text-red-400 text-sm mt-1">
                      {errors.password}
                    </p>
                  )}
                </div>

                {error && (
                  <div className="bg-red-600/20 border border-red-500/30 rounded-xl p-4">
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                )}

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full"
                  disabled={isSubmitting}
                  icon={LogIn}
                >
                  {isSubmitting ? "Logging in..." : "Login"}
                </Button>
              </Form>
            )}
          </Formik>

          <div className="mt-6 text-center">
            {/* Not wired up yet — the API exposes /request-reset and
                /reset-password, but the dashboard has no screen for them. */}
            <button
              type="button"
              disabled
              title="Password reset is not available in the dashboard yet"
              className="text-cyan-400 text-sm transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-transparent border-0 p-0"
            >
              Forgot your password?
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-slate-500 text-sm">
            © 2025 Food Admin. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
