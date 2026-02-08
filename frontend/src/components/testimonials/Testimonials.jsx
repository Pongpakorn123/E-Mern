import React from "react";
import "./testimonials.css";

const Testimonials = () => {
  const testimonialsData = [
    {
      id: 1,
      name: "Yai Keaw",
      position: "Student",
      message:
        "This platform helped me learn so effectively. The courses are amazing and the instructors are top-notch.",
      image:
        "https://i.pinimg.com/736x/8c/c3/27/8cc3272c4e7cef90b04a453b69ab6a33.jpg",
    },
    {
      id: 2,
      name: "Su Mate",
      position: "Student",
      message:
        "I've learned more here than in any other place. The interactive lessons and quizzes make learning enjoyable.",
      image:
        "https://i.pinimg.com/474x/f9/5d/01/f95d0171d743dff39b5a197d6ac801fb.jpg",
    },
    {
      id: 3,
      name: "Bai Bua",
      position: "Student",
      message:
        "This platform helped me learn so effectively. The courses are amazing and the instructors are top-notch.",
      image:
        "https://img.freepik.com/premium-vector/girl-holding-book-isolated-cartoon-character-elementary-school-student-with-backpack_71593-230.jpg",
    },
    {
      id: 4,
      name: "Som Chai",
      position: "Student",
      message:
        "I've learned more here than in any other place. The interactive lessons and quizzes make learning enjoyable.",
      image:
        "https://static.vecteezy.com/system/resources/previews/025/866/477/non_2x/cute-girl-student-point-cartoon-vector.jpg",
    },
  ];
  return (
    <section className="testimonials">
      <h2>What our students say</h2>
      <div className="testmonials-cards">
        {testimonialsData.map((e) => (
          <div className="testimonial-card" key={e.id}>
            <div className="student-image">
              <img src={e.image} alt="" />
            </div>
            <p className="message">{e.message}</p>
            <div className="info">
              <p className="name">{e.name}</p>
              <p className="position">{e.position}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
