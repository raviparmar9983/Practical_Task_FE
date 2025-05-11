"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useState, useRef } from "react";
import Image from "next/image";
import useAuth from "@/hooks/useAuth";
import { uploadProfilePic } from "@/services/authServices";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const registerSchema = Yup.object().shape({
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  phoneNumber: Yup.string()
    .matches(/^\d{10}$/, "Phone Number must be 10 digits")
    .required("Phone Number is required"),
  birthDate: Yup.date().nullable() .required().max(new Date(), "Birthdate cannot be in the future"),
  hash: Yup.string().min(6, "hash must be at least 6 characters").required("hash is required"),
  
});

export default function RegisterPage() {
  const { register: registerUser, loading, error } = useAuth();
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);
  const [picPath, setPicPath] = useState('')
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    trigger,
    reset,
  } = useForm({
    resolver: yupResolver(registerSchema),
    defaultValues:{
      birthDate:null
    }
  });

  const handleFileInputClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setValue("profilePic", e.target.files);
    trigger("profilePic");

    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result);
    reader.readAsDataURL(file);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await uploadProfilePic(formData)
      const path = response.data?.path
      setPicPath(path)
    } catch (error) {
      toast.error("Upload failed:", error);
    }
  };

  const onSubmit = async (data) => {
    try {

      const payload = {
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        email: data.email.trim().toLowerCase(),
        phoneNumber: data.phoneNumber.trim(),
        birthDate: new Date(data.birthDate).toISOString(),
        hash: data.hash,
        profilePic: picPath,
      };

      const response = await registerUser(payload);

      if (response) {
        reset();
        setPreview(null);
        router.push('/login')
      }
    } catch (err) {
    }
  };

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow-sm border-0">
            <div className="card-body p-4 p-md-5">
              <h2 className="text-center mb-4">Create Account</h2>

              {error && <div className="alert alert-danger mb-4">{typeof error === "string" ? error : "Registration failed. Please try again."}</div>}

              <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="firstName" className="form-label">
                      First Name
                    </label>
                    <input id="firstName" type="text" className={`form-control ${errors.firstName ? "is-invalid" : ""}`} placeholder="First Name" {...register("firstName")} />
                    {errors.firstName && <div className="invalid-feedback">{errors.firstName.message}</div>}
                  </div>

                  <div className="col-md-6 mb-3">
                    <label htmlFor="lastName" className="form-label">
                      Last Name
                    </label>
                    <input id="lastName" type="text" className={`form-control ${errors.lastName ? "is-invalid" : ""}`} placeholder="Last Name" {...register("lastName")} />
                    {errors.lastName && <div className="invalid-feedback">{errors.lastName.message}</div>}
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input id="email" type="email" className={`form-control ${errors.email ? "is-invalid" : ""}`} placeholder="example@email.com" {...register("email")} />
                  {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
                </div>

                <div className="mb-3">
                  <label htmlFor="phoneNumber" className="form-label">
                    phoneNumber Number
                  </label>
                  <input id="phoneNumber" type="tel" className={`form-control ${errors.phoneNumber ? "is-invalid" : ""}`} placeholder="Mobile Number" {...register("phoneNumber")} />
                  {errors.phoneNumber && <div className="invalid-feedback">{errors.phoneNumber.message}</div>}
                </div>

                <div className="mb-3">
                  <label htmlFor="birthDate" className="form-label">
                    Date of Birth
                  </label>
                  <input id="birthDate" type="date" className={`form-control ${errors.birthDate ? "is-invalid" : ""}`} {...register("birthDate")} />
                  {errors.birthDate && <div className="invalid-feedback">{errors.birthDate.message}</div>}
                </div>

                <div className="mb-3">
                  <label htmlFor="hash" className="form-label">
                    Password
                  </label>
                  <input id="hash" type="password" className={`form-control ${errors.hash ? "is-invalid" : ""}`} placeholder="At least 6 characters" {...register("hash")} />
                  {errors.hash && <div className="invalid-feedback">{errors.hash.message}</div>}
                </div>

                <div className="mb-4">
                  <label className="form-label">Profile Picture</label>
                  <input
                    type="file"
                    id="profilePic"
                    accept="image/*"
                    className="d-none"
                    ref={(e) => {
                      fileInputRef.current = e;
                      register("profilePic").ref(e);
                    }}
                    onChange={handleImageChange}
                  />

                  <div className="text-center">
                    <div className="d-inline-block position-relative" onClick={handleFileInputClick} style={{ cursor: "pointer" }}>
                      {preview ? (
                        <Image src={preview} alt="Preview" className="img-thumbnail" width={150} height={150} style={{ objectFit: "cover", borderRadius: "50%" }} />
                      ) : (
                        <div
                          className="d-flex flex-column align-items-center justify-content-center border rounded-circle"
                          style={{
                            width: "150px",
                            height: "150px",
                            backgroundColor: "#f8f9fa",
                          }}
                        >
                          <i className="bi bi-person-plus fs-1 text-secondary"></i>
                          <small className="text-muted">Click to upload</small>
                        </div>
                      )}
                    </div>
                    <button type="button" className="btn btn-outline-primary btn-sm mt-2" onClick={handleFileInputClick}>
                      {preview ? "Change Image" : "Select Image"}
                    </button>
                  </div>

                  {errors.profilePic && <div className="text-danger small mt-2 text-center">{errors.profilePic.message}</div>}
                </div>

                <button className="btn btn-primary w-100 py-2" type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>
                      Creating Account...
                    </>
                  ) : (
                    "Register"
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
