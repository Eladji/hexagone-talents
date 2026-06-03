import { useMemo, useState } from "react";

const SCORE_FILTERS = [
  { label: "Tous scores", value: 0 },
  { label: "80+", value: 80 },
  { label: "90+", value: 90 },
];

export function useCandidateFilters(candidates) {
  const [search, setSearch] = useState("");
  const [skill, setSkill] = useState("");
  const [minimumScore, setMinimumScore] = useState(0);

  const skillOptions = useMemo(() => getSkillOptions(candidates), [candidates]);

  const filteredCandidates = useMemo(() => {
    return candidates.filter((candidate) => {
      return matchesSearch(candidate, search) && matchesSkill(candidate, skill) && candidate.alignment_score >= minimumScore;
    });
  }, [candidates, minimumScore, search, skill]);

  function resetFilters() {
    setSearch("");
    setSkill("");
    setMinimumScore(0);
  }

  return {
    filteredCandidates,
    filters: {
      minimumScore,
      search,
      skill,
    },
    hasActiveFilters: Boolean(search || skill || minimumScore),
    resetFilters,
    scoreFilters: SCORE_FILTERS,
    setMinimumScore,
    setSearch,
    setSkill,
    skillOptions,
  };
}

function getSkillOptions(candidates) {
  const skillNames = candidates.flatMap((candidate) => candidate.skills.map(getSkillName));
  return [...new Set(skillNames)].sort();
}

function getSkillName(skill) {
  return skill.replace(/\s*\([^)]*\)\s*$/, "");
}

function matchesSearch(candidate, search) {
  const term = search.trim().toLowerCase();
  if (!term) return true;

  const content = [
    candidate.firstname,
    candidate.lastname,
    candidate.bio,
    ...candidate.skills,
  ].join(" ").toLowerCase();

  return content.includes(term);
}

function matchesSkill(candidate, skill) {
  if (!skill) return true;
  return candidate.skills.some((candidateSkill) => getSkillName(candidateSkill) === skill);
}
