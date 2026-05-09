const subjects = {
  Mathematics: ["Algebra", "Calculus", "Geometry"],
  Science: ["Physics", "Chemistry", "Biology"],
  English: ["Literature", "Grammar", "Creative Writing"],
  "Computer Science": ["Algorithms", "Data Structures", "Web Development"],
  History: ["Ancient Civilizations", "Modern Era", "Political Science"],
};

const firstNames = ["Arjun", "Zara", "Leo", "Maya", "Ithan", "Sasha", "Rohan", "Elena", "Kai", "Ananya", "Liam", "Chloe", "Noah", "Sofia", "James", "Emma", "Oliver", "Aria", "Lucas", "Mila", "Elias", "Layla", "Caleb", "Ivy", "Jasper", "Luna", "Finn", "Ruby", "Oscar", "Hazel"];
const lastNames = ["Sharma", "Chen", "Gomez", "Kahn", "Patel", "Vogt", "Dixon", "Lee", "Müller", "Gupta", "Smith", "Wang", "Russo", "Murphy", "Joshi", "Das", "Lopez", "Kim", "Bauer", "Santana", "Miller", "Taylor", "White", "Harris", "Clark", "Lewis", "Walker", "Hall", "Allen", "Young"];

function generateData() {
  const students = [];
  
  for (let i = 0; i < 30; i++) {
    const student = {
      id: `STU${1000 + i}`,
      name: `${firstNames[i]} ${lastNames[i]}`,
      scores: {},
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
        // Bias scores slightly per subject to create patterns
        let bias = 0;
        if (subject === "Computer Science") bias = 10;
        if (subject === "Mathematics" && i % 3 === 0) bias = -15; // some students struggle with math

        const score = Math.min(100, Math.max(30, Math.floor(Math.random() * 40 + 50 + bias)));
        student.scores[subject][chapter] = score;
        totalScore += score;
        totalChapters++;
      });
    });

    student.intelligence.average = parseFloat((totalScore / totalChapters).toFixed(2));
    
    // Sort subjects by average
    const subjectAverages = Object.entries(student.scores).map(([subject, chapters]) => {
      const avg = Object.values(chapters).reduce((a, b) => a + b, 0) / 3;
      return { subject, avg };
    }).sort((a, b) => b.avg - a.avg);

    student.intelligence.strongSubjects = subjectAverages.slice(0, 2).map(s => s.subject);
    student.intelligence.weakSubjects = subjectAverages.slice(-2).map(s => s.subject);

    // Generate feedback
    Object.entries(student.scores).forEach(([subject, chapters]) => {
      const sortedChapters = Object.entries(chapters).sort((a, b) => b[1] - a[1]);
      const strong = sortedChapters[0];
      const weak = sortedChapters[2];

      if (weak[1] < 60) {
          student.intelligence.feedback[subject] = `${student.name.split(' ')[0]} is showing strength in ${strong[0]} (${strong[1]}), but the score in ${weak[0]} (${weak[1]}) indicates a core conceptual gap. Focused remediation in this area is critical.`;
      } else if (weak[1] < 80) {
          student.intelligence.feedback[subject] = `Solid performance in ${subject}. To advance from ${weak[1]} in ${weak[0]}, implementing targeted practice sets for higher-order problem solving is recommended.`;
      } else {
          student.intelligence.feedback[subject] = `Exceptional mastery in ${subject}. ${student.name.split(' ')[0]} is ready for advanced enrichment and peer mentorship roles.`;
      }
    });

    students.push(student);
  }

  // Calculate Ranks
  students.sort((a, b) => b.intelligence.average - a.intelligence.average);
  students.forEach((s, idx) => s.intelligence.rank = idx + 1);

  // Global Analytics
  const classAnalytics = {
      overallAverage: parseFloat((students.reduce((acc, s) => acc + s.intelligence.average, 0) / 30).toFixed(2)),
      subjectPerformance: {},
      strongestSubject: "",
      weakestSubject: "",
      strongestChapter: "",
      weakestChapter: ""
  };

  const subjectTotals = {};
  const chapterTotals = {};

  students.forEach(s => {
      Object.entries(s.scores).forEach(([subj, chapters]) => {
          if (!subjectTotals[subj]) subjectTotals[subj] = { sum: 0, count: 0 };
          Object.entries(chapters).forEach(([chap, score]) => {
              const fullChap = `${subj}: ${chap}`;
              if (!chapterTotals[fullChap]) chapterTotals[fullChap] = { sum: 0, count: 0 };
              subjectTotals[subj].sum += score;
              subjectTotals[subj].count++;
              chapterTotals[fullChap].sum += score;
              chapterTotals[fullChap].count++;
          });
      });
  });

  const subjectAvgs = Object.entries(subjectTotals).map(([name, data]) => ({ name, avg: data.sum / data.count }))
      .sort((a, b) => b.avg - a.avg);
  const chapterAvgs = Object.entries(chapterTotals).map(([name, data]) => ({ name, avg: data.sum / data.count }))
      .sort((a, b) => b.avg - a.avg);

  classAnalytics.subjectPerformance = subjectAvgs;
  classAnalytics.strongestSubject = subjectAvgs[0].name;
  classAnalytics.weakestSubject = subjectAvgs[subjectAvgs.length - 1].name;
  classAnalytics.strongestChapter = chapterAvgs[0].name;
  classAnalytics.weakestChapter = chapterAvgs[chapterAvgs.length - 1].name;

  return { students, classAnalytics };
}

const data = generateData();
import fs from 'fs';
fs.writeFileSync('./students.json', JSON.stringify(data, null, 2));
console.log('Generated 30 student profiles with intelligence metadata.');
