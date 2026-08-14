import lost_vid from "@/assets/VIDEOS/lost_vid.mp4";
import repurpose_vid from "@/assets/VIDEOS/repurpose_vid.mp4";
import taguan_vid from "@/assets/VIDEOS/taguan_vid.mp4";
import sampleimage from "@/assets/sampleimage.png";

export const projects = [
  {
    title: "lost.",
    description: "Lost is a first-person survival horror game inspired by classic psychological horror experiences, where players must explore a dark, unsettling environment while evading a relentless entity. Developed using Unity, the game emphasizes immersive atmosphere, environmental storytelling, and suspense-driven gameplay through AI-powered enemy behavior, dynamic lighting, and sound design to create a tense and engaging player experience.",
    video: lost_vid,
    githubUrl: "https://github.com/",
    itchUrl: "https://itch.io/",
    date: "2024",
  },
  {
    title: "RePurpose",
    description: "Led the development of RePurpose, a full-stack web application designed to connect donors with organizations through a category-based matching system. Built with secure user authentication and database management powered by Supabase, the platform provides a seamless and efficient donation experience while ensuring reliable data handling. The application was deployed on Vercel and managed using Git and GitHub, emphasizing scalability, maintainability, and collaborative software development practices.",
    video: repurpose_vid,
    githubUrl: "https://github.com/",
    vercelUrl: "https://vercel.com/",
    date: "2024",
  },
  {
    title: "Tagu-Taguan",
    description: "Led the development of RePurpose, a full-stack web application designed to connect donors with organizations through a category-based matching system. Built with secure user authentication and database management powered by Supabase, the platform provides a seamless and efficient donation experience while ensuring reliable data handling. The application was deployed on Vercel and managed using Git and GitHub, emphasizing scalability, maintainability, and collaborative software development practices.",
    video: taguan_vid,
    githubUrl: "https://github.com/",
    itchUrl: "https://itch.io/",
    date: "2024",
  },
  {
    title: "Cloud Website",
    description: "Led the development of RePurpose, a full-stack web application designed to connect donors with organizations through a category-based matching system. Built with secure user authentication and database management powered by Supabase, the platform provides a seamless and efficient donation experience while ensuring reliable data handling. The application was deployed on Vercel and managed using Git and GitHub, emphasizing scalability, maintainability, and collaborative software development practices.",
    video: lost_vid,
    githubUrl: "https://github.com/",
    date: "2024",
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
      "Developed SangAI, a web-based AI learning platform to improve digital literacy and export readiness of Philippine MSMEs through real-time AI guidance and localized mentorship.",
      "Integrated Converge AI APIs to deliver adaptive problem simulations that enhance user progression and confidence in digital skills.",
    ],
    media: [
      { video: repurpose_vid },
      { video: lost_vid },
      { video: taguan_vid },
    ],
    stacked: true,
  },
  {
    title: "Internal Vice President - Mapua Game Consensus",
    subtitle: "Student Organization",
    date: "August 2024 - August 2025",
    description: "Led team meetings, events, and internal communications; demonstrated strong collaboration and organizational skills.",
    media: [
      { video: lost_vid },
      { video: repurpose_vid },
      { video: taguan_vid },
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
      { video: repurpose_vid },
      { video: lost_vid },
      { video: taguan_vid },
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
