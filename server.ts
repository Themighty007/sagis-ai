import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import cors from "cors";
import multer from "multer";
import { fileURLToPath } from "url";
import fs from "fs";
import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const upload = multer({ dest: 'uploads/' });

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

  // Storage for synthetic data
  const DATA_PATH = path.join(__dirname, "students.json");

  // Data Seeding Logic
  if (!fs.existsSync(DATA_PATH)) {
    const subjects = {
      Mathematics: ["Algebra", "Calculus", "Geometry"],
      Science: ["Physics", "Chemistry", "Biology"],
      English: ["Literature", "Grammar", "Creative Writing"],
      "Computer Science": ["Algorithms", "Data Structures", "Web Development"],
      History: ["Ancient Civilizations", "Modern Era", "Political Science"],
    };

    const firstNames = ["Arjun", "Zara", "Leo", "Maya", "Ithan", "Sasha", "Rohan", "Elena", "Kai", "Ananya", "Liam", "Chloe", "Noah", "Sofia", "James", "Emma", "Oliver", "Aria", "Lucas", "Mila", "Elias", "Layla", "Caleb", "Ivy", "Jasper", "Luna", "Finn", "Ruby", "Oscar", "Hazel"];
    const lastNames = ["Sharma", "Chen", "Gomez", "Kahn", "Patel", "Vogt", "Dixon", "Lee", "Müller", "Gupta", "Smith", "Wang", "Russo", "Murphy", "Joshi", "Das", "Lopez", "Kim", "Bauer", "Santana", "Miller", "Taylor", "White", "Harris", "Clark", "Lewis", "Walker", "Hall", "Allen", "Young"];

    const students = [];
    for (let i = 0; i < 30; i++) {
      const student = {
        id: `STU${1000 + i}`,
        name: `${firstNames[i]} ${lastNames[i]}`,
        scores: {},
        attendance: Math.floor(Math.random() * 20 + 80), // 80-100%
        intelligence: {
          average: 0,
          rank: 0,
          strongSubjects: [],
          weakSubjects: [],
          feedback: {}
        }
      };

      let totalScore = 0;
      let totalChapters = 0;

      Object.entries(subjects).forEach(([subject, chapters]) => {
        student.scores[subject] = {};
        chapters.forEach(chapter => {
          let bias = 0;
          if (subject === "Computer Science") bias = 10;
          if (subject === "Mathematics" && i % 4 === 0) bias = -20;
          const score = Math.min(100, Math.max(30, Math.floor(Math.random() * 40 + 50 + bias)));
          student.scores[subject][chapter] = score;
          totalScore += score;
          totalChapters++;
        });
      });

      student.intelligence.average = parseFloat((totalScore / totalChapters).toFixed(2));
      const subjectAvgs = Object.entries(student.scores).map(([subject, chapters]) => {
        const avg = Object.values(chapters).reduce((a: any, b: any) => a + b, 0) / 3;
        return { subject, avg };
      }).sort((a, b) => b.avg - a.avg);

      student.intelligence.strongSubjects = subjectAvgs.slice(0, 2).map(s => s.subject);
      student.intelligence.weakSubjects = subjectAvgs.slice(-2).map(s => s.subject);

      Object.entries(student.scores).forEach(([subject, chapters]) => {
        const sortedChapters = Object.entries(chapters).sort((a: any, b: any) => b[1] - a[1]);
        const strong = sortedChapters[0];
        const weak = sortedChapters[2];
        if (weak[1] < 60) {
          student.intelligence.feedback[subject] = `${student.name.split(' ')[0]} shows aptitude in ${strong[0]}, but ${weak[0]} needs immediate intervention.`;
        } else {
          student.intelligence.feedback[subject] = `Steady progress in ${subject}. focus on ${weak[0]} for mastery.`;
        }
      });
      students.push(student);
    }
    students.sort((a, b) => b.intelligence.average - a.intelligence.average);
    students.forEach((s, idx) => s.intelligence.rank = idx + 1);

    const subjectTotals: any = {};
    students.forEach(s => {
      Object.entries(s.scores).forEach(([subj, chapters]: [string, any]) => {
        if (!subjectTotals[subj]) subjectTotals[subj] = { sum: 0, cnt: 0 };
        Object.values(chapters).forEach((v: any) => {
          subjectTotals[subj].sum += v;
          subjectTotals[subj].cnt++;
        });
      });
    });
    const subPerformance = Object.entries(subjectTotals).map(([name, d]: [string, any]) => ({ name, avg: d.sum / d.cnt })).sort((a, b) => b.avg - a.avg);

    fs.writeFileSync(DATA_PATH, JSON.stringify({ 
      students, 
      classAnalytics: { 
        overallAverage: parseFloat((students.reduce((acc, s) => acc + s.intelligence.average, 0) / 30).toFixed(2)),
        subjectPerformance: subPerformance
      } 
    }, null, 2));
  }

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", system: "SAGIS AI" });
  });

  app.post("/api/groq-demo", async (req, res) => {
    const { scores } = req.body;
    try {
      const chatCompletion = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: "You are SAGIS AI, a specialized Student Growth Intelligence System. Provide a sharp, 2-sentence actionable insight based on the provided scores. Use a technical, clinical tone. Focus on the most extreme outlier in the scores."
          },
          {
            role: "user",
            content: `Analyze these student scores: ${JSON.stringify(scores)}`
          }
        ],
        model: "llama-3.3-70b-versatile",
      });
      res.json({ insight: chatCompletion.choices[0]?.message?.content });
    } catch (error) {
      console.error("Groq Demo Error:", error);
      res.status(500).json({ error: "Failed to generate AI insight" });
    }
  });

  app.get("/api/students", (req, res) => {
    if (fs.existsSync(DATA_PATH)) {
      const data = fs.readFileSync(DATA_PATH, "utf-8");
      res.json(JSON.parse(data));
    } else {
      res.json([]);
    }
  });

  app.post("/api/students", (req, res) => {
    const data = req.body;
    fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
    res.json({ success: true });
  });

  app.post("/api/upload", upload.single('file'), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    try {
      const fileData = fs.readFileSync(req.file.path, 'utf8');
      const jsonData = JSON.parse(fileData);
      fs.writeFileSync(DATA_PATH, JSON.stringify(jsonData, null, 2));
      fs.unlinkSync(req.file.path); // Clean up
      res.json({ success: true });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ error: "Failed to process uploaded file" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true, host: "0.0.0.0", port: PORT },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`SAGIS AI Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
