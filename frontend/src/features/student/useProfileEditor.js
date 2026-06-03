import { useEffect, useState } from "react";

const MAX_AVATAR_SIZE = 1_500_000;

export function useProfileEditor({ api, session, skills, profile, applySavedSkills, applySavedProfile, refreshProfile }) {
  const [profileFields, setProfileFields] = useState(getProfileFields(profile));
  const [selected, setSelected] = useState([{ skill_id: 1, weight: 50 }, { skill_id: 2, weight: 30 }, { skill_id: 3, weight: 20 }]);
  const [project, setProject] = useState({ title: "", description: "", associated_skill_ids: [1] });
  const [suggestion, setSuggestion] = useState("");
  const [profileError, setProfileError] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);

  const total = selected.reduce((sum, skill) => sum + Number(skill.weight || 0), 0);
  const profileSkills = profile?.skills || [];
  const selectedSkillIds = selected.map((skill) => skill.skill_id);
  const hasDuplicateSkills = new Set(selectedSkillIds).size !== selectedSkillIds.length;
  const hasInvalidWeight = selected.some((skill) => Number(skill.weight) <= 0 || Number(skill.weight) > 100);

  useEffect(() => {
    setProfileFields(getProfileFields(profile));
    if (!profile?.skills?.length) return;
    setSelected(profile.skills.map((skill) => ({ skill_id: skill.id, weight: skill.weight })));
    setProject((current) => ({
      ...current,
      associated_skill_ids: current.associated_skill_ids.some((skillId) => profile.skills.some((skill) => skill.id === skillId))
        ? current.associated_skill_ids
        : [profile.skills[0].id],
    }));
  }, [profile]);

  function updateProfileField(key, value) {
    setProfileFields((current) => ({ ...current, [key]: value }));
  }

  function updateSkill(index, key, value) {
    setSelected((current) => current.map((skill, itemIndex) => (itemIndex === index ? { ...skill, [key]: value } : skill)));
  }

  function uploadProfilePhoto(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    setProfileError("");
    if (!file.type.startsWith("image/")) return setProfileError("Veuillez choisir une image.");
    if (file.size > MAX_AVATAR_SIZE) return setProfileError("L'image doit faire moins de 1.5 Mo.");

    const reader = new FileReader();
    reader.onload = () => updateProfileField("avatar_url", reader.result);
    reader.onerror = () => setProfileError("Impossible de charger l'image.");
    reader.readAsDataURL(file);
  }

  async function saveProfile() {
    setSavingProfile(true);
    const result = await api.safe(null, () =>
      api.request("/student/profile", { method: "PUT", body: JSON.stringify({ student_id: session.user_id, ...profileFields }) })
    );
    if (result) {
      applySavedProfile(profileFields);
      await refreshProfile();
    }
    setSavingProfile(false);
  }

  function addSkillLine() {
    const nextSkill = skills.find((skill) => !selected.some((item) => item.skill_id === skill.id));
    if (!nextSkill) return;
    setSelected((current) => [...takeOnePointFromLargestWeight(current), { skill_id: nextSkill.id, weight: 1 }]);
  }

  function removeSkillLine(index) {
    setSelected((current) => {
      if (current.length <= 1) return current;
      const removedWeight = Number(current[index].weight || 0);
      return current
        .filter((_, itemIndex) => itemIndex !== index)
        .map((skill, itemIndex) => (itemIndex === 0 ? { ...skill, weight: Number(skill.weight) + removedWeight } : skill));
    });
  }

  async function saveSkills() {
    const result = await api.safe(null, () =>
      api.request("/student/skills", { method: "PUT", body: JSON.stringify({ student_id: session.user_id, skills: selected }) })
    );
    if (!result) return;

    const savedSkills = selected.map((item) => ({
      id: item.skill_id,
      name: skills.find((skill) => skill.id === item.skill_id)?.name || `Competence ${item.skill_id}`,
      weight: Number(item.weight),
    }));
    applySavedSkills(savedSkills);
    setProject((current) => ({
      ...current,
      associated_skill_ids: savedSkills.some((skill) => skill.id === current.associated_skill_ids[0]) ? current.associated_skill_ids : [savedSkills[0].id],
    }));
    await refreshProfile();
  }

  async function createProject() {
    const created = await api.safe(null, () =>
      api.request("/student/projects", { method: "POST", body: JSON.stringify({ ...project, student_id: session.user_id }) })
    );
    if (!created) return;
    setProject({ title: "", description: "", associated_skill_ids: [profileSkills[0].id || profileSkills[0].skill_id] });
    await refreshProfile();
  }

  async function suggestSkill() {
    const result = await api.safe(null, () =>
      api.request("/skills/suggest", { method: "POST", body: JSON.stringify({ student_id: session.user_id, skill_name: suggestion }) })
    );
    if (result) setSuggestion("");
  }

  return {
    profileFields, selected, project, suggestion, profileError, savingProfile, total, profileSkills,
    hasDuplicateSkills, hasInvalidWeight, canSaveSkills: total === 100 && !hasDuplicateSkills && !hasInvalidWeight,
    setProject, setSuggestion, updateProfileField, updateSkill, uploadProfilePhoto, saveProfile,
    addSkillLine, removeSkillLine, saveSkills, createProject, suggestSkill,
  };
}

function getProfileFields(profile) {
  return {
    firstname: profile?.firstname || "",
    lastname: profile?.lastname || "",
    bio: profile?.bio || "",
    email: profile?.email || "",
    phone: profile?.phone || "",
    avatar_url: profile?.avatar_url || "",
  };
}

function takeOnePointFromLargestWeight(skills) {
  const donorIndex = skills.reduce(
    (bestIndex, skill, index) => (Number(skill.weight || 0) > Number(skills[bestIndex].weight || 0) ? index : bestIndex),
    0
  );
  return skills.map((skill, index) => (index === donorIndex ? { ...skill, weight: Math.max(1, Number(skill.weight) - 1) } : skill));
}
