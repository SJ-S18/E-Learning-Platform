import React, { useState, useEffect } from "react";
import Layout from "../Utils/Layout";
import { useNavigate } from "react-router-dom";
import { CourseData } from "../../context/CourseContext";
import CourseCard from "../../components/CourseCard/CourseCard";
import "./admincourses.css";
import toast from "react-hot-toast";
import axios from "axios";
import { server } from "../../main";

const categories = [
  "Web Development",
  "App Development",
  "Game Development",
  "Data Science",
  "Artificial Intelligence",
];

const AdminCourses = ({ user }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/");
    }
  }, [user, navigate]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [createdBy, setCreatedBy] = useState("");
  const [duration, setDuration] = useState("");
  const [image, setImage] = useState(null);
  const [imagePrev, setImagePrev] = useState("");
  const [btnLoading, setBtnLoading] = useState(false);

  const { courses, fetchCourses } = CourseData();

  const changeImageHandler = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = () => {
      setImagePrev(reader.result);
      setImage(file);
    };
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setBtnLoading(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("price", price);
    formData.append("createdBy", createdBy);
    formData.append("duration", duration);
    formData.append("file", image);

    try {
      const { data } = await axios.post(
        `${server}/api/course/new`,
        formData,
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );

      toast.success(data.message);
      await fetchCourses();

      setTitle("");
      setDescription("");
      setCategory("");
      setPrice("");
      setCreatedBy("");
      setDuration("");
      setImage(null);
      setImagePrev("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setBtnLoading(false);
    }
  };

  return (
    <Layout>
      <div className="admin-courses">
        <div className="left">
          <h1>All Courses</h1>
          <div className="dashboard-content">
            {courses && courses.length > 0 ? (
              courses.map((course) => (
                <CourseCard key={course._id} course={course} />
              ))
            ) : (
              <p>No Courses Yet</p>
            )}
          </div>
        </div>

        <div className="right">
          <div className="course-form">
            <h2>Add Course</h2>
            <form onSubmit={submitHandler}>
              <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />

              <input
                type="text"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />

              <input
                type="number"
                placeholder="Price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />

              <input
                type="text"
                placeholder="Created By"
                value={createdBy}
                onChange={(e) => setCreatedBy(e.target.value)}
                required
              />

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>

              <input
                type="number"
                placeholder="Duration"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                required
              />

              <input type="file" onChange={changeImageHandler} required />
              {imagePrev && <img src={imagePrev} alt="preview" width={250} />}

              <button className="common-btn" disabled={btnLoading}>
                {btnLoading ? "Please Wait..." : "Add Course"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminCourses;
