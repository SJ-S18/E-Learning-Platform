import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { server } from "../main";

const CourseContext = createContext();

export const CourseContextProvider = ({ children }) => {
  const [courses, setCourses] = useState([]);
  const [course, setCourse] = useState(null);     
  const [mycourse, setMyCourse] = useState([]);   
  const [loading, setLoading] = useState(true);

 
  async function fetchCourses() {
    try {
      const { data } = await axios.get(`${server}/api/course/all`);
      setCourses(data.courses || []);
    } catch (error) {
      console.log("Fetch courses error:", error);
    }
  }

 
  async function fetchCourse(id) {
    try {
      const { data } = await axios.get(`${server}/api/course/${id}`);
      setCourse(data.course || null);
    } catch (error) {
      console.log("Fetch course error:", error);
    }
  }

 
  async function fetchMyCourse() {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const { data } = await axios.get(`${server}/api/mycourse`, {
        headers: {
          token,
        },
      });
      setMyCourse(data.courses || []);
    } catch (error) {
      console.log("Fetch my course error:", error);
    }
  }

  useEffect(() => {
    fetchCourses();
    fetchMyCourse();
    setLoading(false);
  }, []);

  return (
    <CourseContext.Provider
      value={{
        courses,
        course,
        mycourse,
        loading,
        fetchCourses,
        fetchCourse,
        fetchMyCourse,
      }}
    >
      {children}
    </CourseContext.Provider>
  );
};

export const CourseData = () => useContext(CourseContext);
