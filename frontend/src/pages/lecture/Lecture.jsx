import React, { useEffect, useState, useRef } from "react";
import "./lecture.css";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { server } from "../../main";
import Loading from "../../components/loading/Loading";
import toast from "react-hot-toast";
import { TiTick } from "react-icons/ti";

const Lecture = ({ user }) => {
  const { id: courseId } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef(null);

  const token = localStorage.getItem("token");

  const [lectures, setLectures] = useState([]);
  const [lecture, setLecture] = useState(null);

  const [loading, setLoading] = useState(true);
  const [lecLoading, setLecLoading] = useState(false);
  const [show, setShow] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [video, setVideo] = useState(null);
  const [videoPrev, setVideoPrev] = useState("");
  const [btnLoading, setBtnLoading] = useState(false);

  const [completed, setCompleted] = useState(0);
  const [completedLec, setCompletedLec] = useState(0);
  const [lectLength, setLectLength] = useState(0);
  const [progress, setProgress] = useState([]);

  const [maxTime, setMaxTime] = useState(0);

  /* ================= FETCH ================= */

  const fetchLectures = async () => {
    try {
      const { data } = await axios.get(
        `${server}/api/lectures/${courseId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setLectures(data.lectures || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchLecture = async (lectureId) => {
    setLecLoading(true);
    try {
      const { data } = await axios.get(
        `${server}/api/lecture/${lectureId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setLecture(data.lecture);
      setMaxTime(0);
    } catch (err) {
      console.log(err);
    } finally {
      setLecLoading(false);
    }
  };

  const fetchProgress = async () => {
    try {
      const { data } = await axios.get(
        `${server}/api/user/progress?course=${courseId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCompleted(data.courseProgressPercentage || 0);
      setCompletedLec(data.completedLectures || 0);
      setLectLength(data.allLectures || 0);
      setProgress(data.progress || []);
    } catch (err) {
      console.log(err);
    }
  };

  /* ================= ADD LECTURE ================= */

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!video) return toast.error("Please select a video");

    setBtnLoading(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("video", video);

    try {
      const { data } = await axios.post(
        `${server}/api/admin/course/${courseId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(data.message);
      setShow(false);
      setTitle("");
      setDescription("");
      setVideo(null);
      setVideoPrev("");
      fetchLectures();
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload failed");
    } finally {
      setBtnLoading(false);
    }
  };

  /* ================= DELETE ================= */

  const deleteHandler = async (lectureId) => {
    if (!window.confirm("Delete this lecture?")) return;

    try {
      const { data } = await axios.delete(
        `${server}/api/admin/lecture/${lectureId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(data.message);
      fetchLectures();
    } catch (err) {
      toast.error(err.response?.data?.message);
    }
  };

  /* ================= VIDEO CONTROL ================= */

  const handleTimeUpdate = () => {
    const current = videoRef.current?.currentTime || 0;
    if (current > maxTime) setMaxTime(current);
  };

  const handleSeeking = () => {
    if (videoRef.current.currentTime > maxTime) {
      videoRef.current.currentTime = maxTime;
    }
  };

  const addProgress = async (lectureId) => {
    try {
      await axios.post(
        `${server}/api/user/progress?course=${courseId}&lectureId=${lectureId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchProgress();
    } catch (err) {
      console.log(err);
    }
  };

  /* ================= EFFECT ================= */

  useEffect(() => {
    if (!token) {
      toast.error("Please login again");
      navigate("/login");
      return;
    }

    fetchLectures();
    fetchProgress();
  }, [courseId]);

  /* ================= RENDER ================= */

  if (loading) return <Loading />;

  return (
    <>
      <div className="progress">
        Lecture completed - {completedLec} / {lectLength}
        <br />
        <progress value={completed} max={100}></progress>{" "}
        {Number(completed).toFixed(2)} %
      </div>

      <div className="lecture-page">
        <div className="left">
          {lecLoading ? (
            <Loading />
          ) : lecture?.video ? (
            <>
              <video
                ref={videoRef}
                src={lecture.video}
                width="100%"
                controls
                autoPlay
                onEnded={() => addProgress(lecture._id)}
                onTimeUpdate={handleTimeUpdate}
                onSeeking={handleSeeking}
                controlsList="nodownload noremoteplayback"
                disablePictureInPicture
              />
              <h1>{lecture.title}</h1>
              <h3>{lecture.description}</h3>
            </>
          ) : (
            <h1>Please select a lecture</h1>
          )}
        </div>

        <div className="right">
          {user?.role === "admin" && (
            <button className="common-btn" onClick={() => setShow(!show)}>
              {show ? "Close" : "Add Lecture +"}
            </button>
          )}

          {show && (
            <form className="lecture-form" onSubmit={submitHandler}>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
                required
              />
              <input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description"
                required
              />
              <input
                type="file"
                accept="video/*"
                required
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (!file) return;

                  const maxSize = 500 * 1024 * 1024; // 100MB

                  if (file.size > maxSize) {
                    toast.error("File too large! Maximum size is 100MB");
                    return;
                  }
                  setVideo(file);
                  setVideoPrev(URL.createObjectURL(file));
                }}
              />
              {videoPrev && <video src={videoPrev} width={250} controls />}
              <button disabled={btnLoading} className="common-btn">
                {btnLoading ? "Uploading..." : "Add"}
              </button>
            </form>
          )}

          {lectures.length > 0 ? (
            lectures.map((lec, i) => (
              <div key={lec._id}>
                <div
                  className={`lecture-number ${lecture?._id === lec._id ? "active" : ""
                    }`}
                  onClick={() => fetchLecture(lec._id)}
                >
                  {i + 1}. {lec.title}
                  {progress?.[0]?.completedLectures?.includes(lec._id) && (
                    <TiTick style={{ color: "green" }} />
                  )}
                </div>

                {user?.role === "admin" && (
                  <button
                    className="common-btn"
                    style={{ background: "red" }}
                    onClick={() => deleteHandler(lec._id)}
                  >
                    Delete
                  </button>
                )}
              </div>
            ))
          ) : (
            <p>No Lectures Yet</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Lecture;
