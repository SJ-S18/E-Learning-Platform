import React, { useEffect, useState } from "react";
import "./coursedescription.css";
import { useNavigate, useParams } from "react-router-dom";
import { CourseData } from "../../context/CourseContext";
import { server } from "../../main";
import axios from "axios";
import toast from "react-hot-toast";
import { UserData } from "../../context/UserContext";
import Loading from "../../components/loading/Loading";

const CourseDescription = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const { fetchUser } = UserData();
  const { fetchCourse, course, fetchCourses, fetchMyCourse } = CourseData();

  useEffect(() => {
    fetchCourse(id);
  }, [id]);

  const checkoutHandler = async () => {
    try {
      const token = localStorage.getItem("token");
      setLoading(true);

      const { data } = await axios.post(
        `${server}/api/course/checkout/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const options = {
        key: "rzp_test_Rsmdzod85hjkRU",
        amount: data.order.amount,
        currency: "INR",
        name: "E-Learning",
        description: "Learn with us",
        order_id: data.order.id,

        handler: async function (response) {
          try {
            const verify = await axios.post(
              `${server}/api/verification/${id}`,
              response,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            await fetchUser();
            await fetchCourses();
            await fetchMyCourse();

            toast.success(verify.data.message);
            navigate(`/payment-success/${response.razorpay_payment_id}`);
          } catch (err) {
            toast.error(err.response?.data?.message || "Payment failed");
          } finally {
            setLoading(false);
          }
        },

        theme: { color: "#8a4baf" },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      toast.error("Checkout failed");
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  return (
    course && (
      <div className="course-description">
        <div className="course-header">
          <img
            src={`${server}/${course.image}`}
            alt={course.title}
            className="course-image"
          />
          <div className="course-info">
            <h2>{course.title}</h2>
            <p>Instructor: {course.createdBy}</p>
            <p>Duration: {course.duration} weeks</p>
          </div>
        </div>

        <p>{course.description}</p>
        <p>Course Price: ₹{course.price}</p>

        {user && user.subscription?.includes(course._id) ? (
          <button
            onClick={() => navigate(`/course/study/${course._id}`)}
            className="common-btn"
          >
            Study
          </button>
        ) : (
          <button onClick={checkoutHandler} className="common-btn">
            Buy Now
          </button>
        )}
      </div>
    )
  );
};

export default CourseDescription;
