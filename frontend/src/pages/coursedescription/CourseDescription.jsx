import React, { useEffect, useState } from "react";
import "./coursedescription.css";
import { useNavigate, useParams } from "react-router-dom";
import { CourseData } from "../../context/CourseContext";
import { UserData } from "../../context/UserContext";
import { server } from "../../main";
import axios from "axios";
import toast from "react-hot-toast";
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

      if (!token) {
        toast.error("Please login first");
        return;
      }

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
        description: "Course Purchase",
        order_id: data.order.id,

      
        handler: async function (response) {
          try {
            if (!id) {
              toast.error("Course ID missing");
              return;
            }

            const verify = await axios.post(
              `${server}/api/payment/verification`,
              {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                courseId: id,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            await fetchUser();
            await fetchCourses();
            await fetchMyCourse();

            toast.success(
              verify.data.message || "Payment Successful"
            );

            navigate(
              `/payment-success/${response.razorpay_payment_id}`
            );
          } catch (error) {
            toast.error(
              error.response?.data?.message ||
                "Payment verification failed"
            );
          } finally {
            setLoading(false);
          }
        },

        theme: {
          color: "#8a4baf",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
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
