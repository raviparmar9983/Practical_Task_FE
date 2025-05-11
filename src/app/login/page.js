"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import useAuth from "../../hooks/useAuth";
import { useAuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { toast } from 'react-toastify';

const loginSchema = Yup.object().shape({
  email: Yup.string().required("Email or Phone number is required"),
  hash: Yup.string().min(6, "At least 6 characters").required("Password is required"),
});

export default function LoginPage() {
  const { login, loading, error } = useAuth();

  const { login: setAuthToken } = useAuthContext();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(loginSchema) });

  const onSubmit = async (data) => {
    try {
      const res = await login(data);
      if (res?.status && res.token?.accessToken) {
        setAuthToken(res.token.accessToken);
        router.push("/dashboard");
      } else {
        toast.error("Login Failed")
      }
    } catch (err) {
      toast.error(err);
      
    }
  };

  const signUp = () => {
    router.push("/register")
  }

  return (
    <div className="container mt-5" style={{ height: "80vh" }}>
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="card shadow">
            <div className="card-body p-4">
              <h2 className="text-center mb-4">Login</h2>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-3">
                  <input className="form-control" placeholder="Email" {...register("email")} />
                  {errors.email && <div className="text-danger small mt-1">{errors.email.message}</div>}
                </div>

                <div className="mb-3">
                  <input className="form-control" type="hash" placeholder="Password" {...register("hash")} />
                  {errors.hash && <div className="text-danger small mt-1">{errors.hash.message}</div>}
                </div>

                <button className="btn btn-primary w-100" disabled={loading}>
                  {loading ? (
                    <span>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Logging in...
                    </span>
                  ) : (
                    "Login"
                  )}
                </button>

                <div className="d-flex justify-content-between mt-3">
                  <p>New user?</p>
                  <p className="text-primary" onClick={signUp} style={{ cursor: "pointer" }}>Sign up</p>
                </div>

                {error && <div className="alert alert-danger mt-3 mb-0">{error}</div>}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
