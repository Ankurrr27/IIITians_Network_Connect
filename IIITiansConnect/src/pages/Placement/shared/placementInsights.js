export function formatLpa(value) {
  const numericValue = Number(value || 0);
  return `${numericValue.toFixed(numericValue >= 10 ? 0 : 1)} LPA`;
}

function getMedian(values = []) {
  const cleaned = values
    .map((value) => Number(value || 0))
    .filter((value) => Number.isFinite(value))
    .sort((a, b) => a - b);

  if (!cleaned.length) {
    return 0;
  }

  const middle = Math.floor(cleaned.length / 2);

  if (cleaned.length % 2 === 0) {
    return (cleaned[middle - 1] + cleaned[middle]) / 2;
  }

  return cleaned[middle];
}

export function summarizePlacementYear(yearData) {
  if (!yearData?.placements?.length) {
    return null;
  }

  const summary = yearData.placements.reduce(
    (accumulator, row) => {
      const totalStudents = Number(row.totalStudents || 0);
      const studentsPlaced = Number(row.studentsPlaced || 0);
      const highestPackage = Number(row.highestPackage || 0);
      const averagePackage = Number(row.averagePackage || 0);
      const placementPercentage = Number(row.placementPercentage || 0);

      accumulator.totalStudents += totalStudents;
      accumulator.studentsPlaced += studentsPlaced;
      accumulator.weightedAverage += averagePackage * Math.max(totalStudents, 1);
      accumulator.weightedAverageBase += Math.max(totalStudents, 1);
      accumulator.highestPackage = Math.max(
        accumulator.highestPackage,
        highestPackage
      );
      accumulator.highestPlacementPercentage = Math.max(
        accumulator.highestPlacementPercentage,
        placementPercentage
      );
      accumulator.branchAveragePackages.push(averagePackage);

      if (
        !accumulator.topBranch ||
        placementPercentage > accumulator.topBranch.placementPercentage
      ) {
        accumulator.topBranch = {
          branch: row.branch,
          placementPercentage,
        };
      }

      return accumulator;
    },
    {
      totalStudents: 0,
      studentsPlaced: 0,
      highestPackage: 0,
      highestPlacementPercentage: 0,
      weightedAverage: 0,
      weightedAverageBase: 0,
      branchAveragePackages: [],
      topBranch: null,
    }
  );

  const placementRate = summary.totalStudents
    ? (summary.studentsPlaced / summary.totalStudents) * 100
    : 0;

  return {
    year: yearData.year,
    totalStudents: summary.totalStudents,
    studentsPlaced: summary.studentsPlaced,
    highestPackage: summary.highestPackage,
    averagePackage: summary.weightedAverageBase
      ? summary.weightedAverage / summary.weightedAverageBase
      : 0,
    medianPackage: getMedian(summary.branchAveragePackages),
    placementRate,
    highestPlacementPercentage: summary.highestPlacementPercentage,
    branchCount: yearData.placements.length,
    topBranch: summary.topBranch,
  };
}

export function summarizeAllYears(yearlyPlacements = []) {
  return [...yearlyPlacements]
    .map((yearBlock) => summarizePlacementYear(yearBlock))
    .filter(Boolean)
    .sort((a, b) => b.year - a.year);
}

export function summarizePlacementCollection(placements = []) {
  return placements
    .map((placement) => {
      const latestYear = [...(placement.yearlyPlacements || [])].sort(
        (a, b) => b.year - a.year
      )[0];
      const summary = summarizePlacementYear(latestYear);

      if (!summary || !placement.college?.name) {
        return null;
      }

      return {
        id: placement._id,
        collegeName: placement.college.name,
        collegeLocation: placement.college.location || "",
        collegeLogo: placement.college.logo || "/fallback-college.png",
        year: summary.year,
        highestPackage: summary.highestPackage,
        averagePackage: summary.averagePackage,
        medianPackage: summary.medianPackage,
        placementRate: summary.placementRate,
        highestPlacementPercentage: summary.highestPlacementPercentage,
        topBranch: summary.topBranch,
      };
    })
    .filter(Boolean)
    .sort((a, b) => {
      if (b.highestPackage !== a.highestPackage) {
        return b.highestPackage - a.highestPackage;
      }

      return b.placementRate - a.placementRate;
    });
}

export function buildPlacementFaqs({ data, yearData, summaries = [] }) {
  if (!data || !yearData) {
    return [
      {
        question: "How should I read placement data on this page?",
        answer:
          "Start with the latest-year snapshot, then compare branch-wise packages and placement rates. The page is meant to help you understand patterns, not just chase one number.",
      },
      {
        question: "Why can one branch have a higher package but lower placement rate?",
        answer:
          "Higher packages often come from a smaller set of roles or companies, while placement rate reflects how broadly students across a branch were placed.",
      },
      {
        question: "Should I compare colleges only by highest package?",
        answer:
          "No. Look at highest package, average package, branch-wise placement rate, and how consistently the college has performed across years.",
      },
    ];
  }

  const selectedSummary = summarizePlacementYear(yearData);
  const previousSummary =
    summaries.find((item) => item.year < selectedSummary?.year) || null;
  const placementRateDelta = previousSummary
    ? selectedSummary.placementRate - previousSummary.placementRate
    : 0;

  return [
    {
      question: `What does ${data.college?.name || "this college"} placement look like in ${yearData.year}?`,
      answer: `${selectedSummary.studentsPlaced} out of ${selectedSummary.totalStudents} students were placed across ${selectedSummary.branchCount} branches, giving an overall placement rate of ${selectedSummary.placementRate.toFixed(
        1
      )}%.`,
    },
    {
      question: `Which branch is leading in ${yearData.year}?`,
      answer: selectedSummary.topBranch
        ? `${selectedSummary.topBranch.branch} currently leads with a placement rate of ${selectedSummary.topBranch.placementPercentage.toFixed(
            1
          )}%.`
        : "No branch-level leader could be determined from the available data.",
    },
    {
      question: "How strong are the packages this year?",
      answer: `The highest package reported is ${formatLpa(
        selectedSummary.highestPackage
      )}, while the weighted average package across recorded branches is ${formatLpa(
        selectedSummary.averagePackage
      )}.`,
    },
    {
      question: "Is the trend improving compared with previous years?",
      answer: previousSummary
        ? `Compared with ${previousSummary.year}, the placement rate has ${
            placementRateDelta >= 0 ? "improved" : "shifted down"
          } by ${Math.abs(placementRateDelta).toFixed(
            1
          )} percentage points. Use this together with branch-level results for a more balanced view.`
        : "There is not enough older data on this page yet to compare the current year against a previous year.",
    },
  ];
}
