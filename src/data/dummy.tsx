import { ResumeInfo } from "@/context/ResumeInfoContext";

const dummy: ResumeInfo = {
  firstName: "John",
  lastName: "Doe",
  jobTitle: "Full Stack Developer",
  address: "123 Main Street, New York, NY 10001",
  phone: "(555) 123-4567",
  email: "john.doe@example.com",
  themeColor: "#FF5733",
  summery:
    "Experienced Full Stack Developer with a passion for building scalable web applications. Proficient in React, Node.js, and cloud technologies. Strong problem-solving skills and a team player.",
  Experience: [
    {
      id: 1,
      title: "Senior Full Stack Developer",
      companyName: "Tech Corp",
      city: "San Francisco",
      state: "CA",
      startDate: "Jan 2022",
      endDate: "Present",
      currentlyWorking: true,
      workSummery:
        "<ul><li>Led development of microservices architecture</li><li>Improved application performance by 40%</li><li>Mentored junior developers</li></ul>",
    },
    {
      id: 2,
      title: "Full Stack Developer",
      companyName: "Startup Inc",
      city: "New York",
      state: "NY",
      startDate: "Jun 2019",
      endDate: "Dec 2021",
      currentlyWorking: false,
      workSummery:
        "<ul><li>Built RESTful APIs using Node.js and Express</li><li>Developed responsive React components</li><li>Implemented CI/CD pipelines</li></ul>",
    },
  ],
  education: [
    {
      id: 1,
      universityName: "University of Technology",
      degree: "Bachelor of Science",
      major: "Computer Science",
      startDate: "Sep 2015",
      endDate: "Jun 2019",
      description:
        "Graduated with honors. Dean's list for 4 consecutive semesters.",
    },
  ],
  skills: [
    { id: 1, name: "React", rating: 5 },
    { id: 2, name: "Node.js", rating: 4 },
    { id: 3, name: "TypeScript", rating: 4 },
    { id: 4, name: "Python", rating: 3 },
    { id: 5, name: "AWS", rating: 3 },
  ],
};

export default dummy;