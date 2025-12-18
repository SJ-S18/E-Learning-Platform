import React from "react";
import "./courses.css";
import { CourseData } from "../../context/CourseContext";
import CourseCard from "../../components/CourseCard/CourseCard";

const Courses = () => {
  const { courses, loading } = CourseData();

  if (loading) {
    return (
      <div className="courses">
        <h2>Available Courses</h2>
        <p>Loading courses...</p>
      </div>
    );
  }

  return (
    <div className="courses">
      <h2>Available Courses</h2>

      <div className="course-container">
        {courses && courses.length > 0 ? (
          courses.map((course) => (
            <CourseCard key={course._id} course={course} />
          ))
        ) : (
          <p>No Courses Yet!</p>
        )}
      </div>
    </div>
  );
};

export default Courses;
