// Shared career-stage resolution for the page, SEO metadata and education.
export function resolveProfile(profile) {
  if (!['undergraduate', 'graduate'].includes(profile.careerStage)) {
    throw new Error('profile.js → careerStage: choose "undergraduate" or "graduate".');
  }
  if (profile.careerStage === 'graduate') {
    if (!profile.graduationDate?.trim()) {
      throw new Error('profile.js → graduationDate: enter your actual completion month and year before selecting graduate.');
    }
    return { ...profile, ...profile.graduateProfile };
  }
  return profile;
}

export function resolveEducation(entries, profile) {
  return entries.map(entry => profile.careerStage === 'graduate' && entry.id === profile.degreeEntryId
    ? { ...entry, dates: `Completed ${profile.graduationDate}`, description: `Degree completed · ${profile.location}` }
    : entry);
}
