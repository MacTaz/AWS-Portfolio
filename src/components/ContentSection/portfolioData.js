import lost_vid from "@/assets/VIDEOS/lost_vid.mp4";
import repurpose_vid from "@/assets/VIDEOS/repurpose_vid.mp4";
import taguan_vid from "@/assets/VIDEOS/taguan_vid.mp4";
import sampleimage from "@/assets/sampleimage.png";

import MGC_1 from "@/assets/IMAGES/MGC/MGC_1.png";
import MGC_2 from "@/assets/IMAGES/MGC/MGC_2.png";

import ARCUS_1 from "@/assets/IMAGES/AWS/ARCUS_1.png";
import ARCUS_2 from "@/assets/IMAGES/AWS/ARCUS_2.png";


import CONVERGE_1 from "@/assets/IMAGES/CONVERGE/CONVERGE_1.jpg";
import CONVERGE_2 from "@/assets/IMAGES/CONVERGE/CONVERGE_2.jpg";

export const projects = [
  {
    title: "lost.",
    description: "Lost is a first-person survival horror game made in Godot, heavily inspired by PS2-era horror and that old PSX look — low-poly models, warped textures, grainy visuals. You explore a dark, oppressive environment while being hunted by a relentless entity, a tall faceless figure inspired by Slenderman. Dynamic lighting, AI-driven enemy behavior, and sound design all come together to build that tense, retro survival horror feel.",
    video: lost_vid,
    githubUrl: "https://github.com/",
    itchUrl: "https://itch.io/",
    date: "2024",
  },
  {
    title: "RePurpose",
    description: "Led the development of RePurpose, a full-stack web application designed to connect donors with organizations through a category-based matching system. Built with secure user authentication and database management powered by Supabase, the platform provides a seamless and efficient donation experience while ensuring reliable data handling. The application was deployed on Vercel and managed using Git and GitHub, emphasizing scalability, maintainability, and collaborative software development practices.",
    video: repurpose_vid,
    githubUrl: "https://github.com/MacTaz/RePurpose",
    vercelUrl: "repurpose-murex.vercel.app",
    date: "2024",
  },
  {
    title: "Tagu-Taguan",
    description: "Tagu-Taguan is a 2D game made in Godot, heavily inspired by Filipino mythology and folklore. It's my first game built in the engine, so I kept the mechanics simple and leaned into that classic arcade feel — quick to pick up, easy to jump into, but still challenging to master. Expect creatures and imagery pulled straight from Filipino legends, wrapped in straightforward gameplay that focuses on fun over complexity.",
    video: taguan_vid,
    githubUrl: "https://github.com/MacTaz/Tagu-Taguan/",
    itchUrl: "https://bananabvnny.itch.io/tagu-taguan",
    date: "2024",
  },
  {
    title: "Cloud Website",
    description: "Cloud Resume Portfolio is a serverless personal site built on AWS, based on the Cloud Resume Challenge with a couple of my own twists thrown in. Instead of clicking through the AWS console, the entire infrastructure — S3, CloudFront, API Gateway, Lambda, DynamoDB, IAM — is defined and deployed through Terraform, so the whole stack can be torn down and rebuilt from code alone. On top of the usual visitor counter, I added a hidden admin analytics panel, gated behind a password-protected Lambda endpoint that verifies credentials server-side via AWS SSM Parameter Store, so nothing sensitive ever touches the frontend bundle. It's less about the resume itself and more about proving out a real, secure, infrastructure-as-code AWS pipeline from the ground up.",
    video: lost_vid,
    githubUrl: "https://github.com/MacTaz/AWS-Portfolio",
  },
];

export const education = [
  {
    title: "Bachelor of Computer Science",
    subtitle: "Data Science Specialization | Mapua University",
    date: "2024 – Ongoing",
    bullets: [
      "Dean Lister across multiple terms with a strong and sustained GWA.",
      "DOST S&T Undergraduate Scholarship, Recipient of the DOST Scholarship.",
      "Relevant Coursework: Data Structures & Algorithms, Discrete Mathematics, Data Science, Software Engineering, Operating Systems, Data Communication & Networking, Computer Architecture, Quantitative Methods, Automata Theory.",
    ],
  },
  {
    title: "Colegio De San Juan De Letran",
    subtitle: "Senior High School",
    bullets: ["Graduated with High Honors.", "Winning Best Research."],
  },
];

export const certifications = [
  {
    title: "AWS Certified Cloud Practitioner",
    subtitle: "Amazon Web Services",
    date: "2024",
    image: sampleimage,
  },
  {
    title: "DOST S&T Undergraduate Scholarship",
    subtitle: "Department of Science and Technology",
    date: "2024",
    image: sampleimage,
  },
  {
    title: "Converge Byte Forward Hackathon Certificate",
    subtitle: "Converge ICT Solutions",
    date: "2025",
    image: sampleimage,
  },
];

export const experience = [
  {
    title: "Corporate Secretary - AWS-SBG Arcus",
    subtitle: "Student Builder Group",
    date: "August 2026 - Present",
    bullets: [
      "Developed form automation systems for AWS-SBG Arcus, establishing the event proposal as a single source of truth to automate document generation and streamline workflows for future Corporate Secretaries.",
      "Managed the organization’s project proposals, post-event documentation, permits, and required paperwork, ensuring all administrative requirements were properly prepared, processed, and completed.",
    ],
    media: [
      { image: ARCUS_1 },
      { image: ARCUS_2 },
    ],
    stacked: true,
  },
  {
    title: "Internal Vice President - Mapua Game Consensus",
    subtitle: "Student Organization",
    date: "August 2024 - August 2025",
    description: "Led team meetings, events, and internal communications; demonstrated strong collaboration and organizational skills.",
    media: [
      { image: MGC_1 },
      { image: MGC_2 },
    ],
    stacked: true,
  },
  {
    title: "Converge Byte Forward Hackathon",
    subtitle: "National Hackathon | API, Database, and AI-focused",
    date: "August 2025",
    bullets: [
      "Developed SangAI, a web-based AI learning platform to improve digital literacy and export readiness of Philippine MSMEs through real-time AI guidance and localized mentorship.",
      "Integrated Converge AI APIs to deliver adaptive problem simulations that enhance user progression and confidence in digital skills.",
    ],
    media: [
      { image: CONVERGE_1 },
      { image: CONVERGE_2 },
    ],
    stacked: true,
  },
];

export const skillCategories = [
  {
    category: "Languages",
    items: ["JavaScript", "TypeScript", "Python", "Java", "C++", "C#", "SQL", "GDScript"],
  },
  {
    category: "Frontend",
    items: ["React", "HTML", "CSS", "Figma", "Wix"],
  },
  {
    category: "Backend",
    items: ["Node.js", "REST APIs", "Supabase"],
  },
  {
    category: "Cloud",
    items: ["AWS (S3, Lambda, IAM)", "Terraform", "GitHub Actions (CI/CD)", "Vercel", "Git", "Linux"],
  },
  {
    category: "Data Science",
    items: [
      "Pandas",
      "NumPy",
      "Scikit-learn",
      "TensorFlow",
      "PyTorch",
      "Jupyter Notebook",
      "Matplotlib",
      "Seaborn",
      "Tableau",
      "Power BI",
    ],
  },
  {
    category: "Other",
    items: ["Excel", "Cisco Packet Tracer", "Godot"],
  },
];

export const TABS = [
  { id: "projects", label: "Projects" },
  { id: "education", label: "Education" },
  { id: "experience", label: "Experience" },
];

export const contentMap = { projects, education, experience };
