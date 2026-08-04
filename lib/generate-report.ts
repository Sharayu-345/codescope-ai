import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface ReportProps {
  repoData: any;
  languageData: Record<string, number>;
  contributors: any[];
  commitData: any[];
  analysis: any;
}

export function generateReport({
  repoData,
  languageData,
  contributors,
  commitData,
  analysis,
}: ReportProps) {
  const doc = new jsPDF();

  doc.setFontSize(20);
  doc.text("CodeScope AI Repository Report", 14, 20);

  doc.setFontSize(12);
  doc.text(`Repository: ${repoData?.full_name ?? "-"}`, 14, 35);
  doc.text(`Owner: ${repoData?.owner?.login ?? "-"}`, 14, 43);
  doc.text(`Stars: ${repoData?.stargazers_count ?? 0}`, 14, 51);
  doc.text(`Forks: ${repoData?.forks_count ?? 0}`, 14, 59);
  doc.text(`Open Issues: ${repoData?.open_issues_count ?? 0}`, 14, 67);

  autoTable(doc, {
    startY: 78,
    head: [["Language", "Bytes"]],
    body: Object.entries(languageData || {}),
  });

  autoTable(doc, {
    startY: (doc as any).lastAutoTable.finalY + 10,
    head: [["Contributor", "Contributions"]],
    body: (contributors || []).map((c) => [
      c.login,
      c.contributions,
    ]),
  });

  autoTable(doc, {
    startY: (doc as any).lastAutoTable.finalY + 10,
    head: [["Recent Commits"]],
    body: (commitData || []).slice(0, 5).map((c) => [
      c.commit?.message || "-",
    ]),
  });

  let y = (doc as any).lastAutoTable.finalY + 15;

  doc.setFontSize(16);
  doc.text("AI Analysis", 14, y);

  y += 10;

  const addSection = (title: string, items: string[]) => {
    doc.setFontSize(13);
    doc.text(title, 14, y);
    y += 8;

    doc.setFontSize(11);

    (items || []).forEach((item) => {
      doc.text(`• ${item}`, 18, y);
      y += 7;
    });

    y += 5;
  };

  addSection("Architecture", analysis?.architecture || []);
  addSection("Code Quality", analysis?.codeQuality || []);
  addSection("Suggestions", analysis?.suggestions || []);
  addSection(
    "Interview Questions",
    analysis?.interviewQuestions || []
  );

  doc.save(
    `CodeScope_Report_${repoData?.name || "repository"}.pdf`
  );
}