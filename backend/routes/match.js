const express = require('express');
const router = express.Router();
const Candidate = require('../models/Candidate');

// POST - Basic Skill Match
router.post('/', async (req, res) => {
  try {
    const { requiredSkills, minExperience, preferredSkills = [] } = req.body;

    const candidates = await Candidate.find({
      experience: { $gte: minExperience }
    });

    const results = candidates.map(candidate => {
      const skillsLower = candidate.skills.map(s => s.toLowerCase());
      const requiredLower = requiredSkills.map(s => s.toLowerCase());
      const preferredLower = preferredSkills.map(s => s.toLowerCase());

      const matchedRequired = requiredLower.filter(s => skillsLower.includes(s));
      const matchedPreferred = preferredLower.filter(s => skillsLower.includes(s));

      const requiredScore = requiredSkills.length > 0
        ? matchedRequired.length / requiredSkills.length
        : 0;

      const preferredBonus = preferredSkills.length > 0
        ? (matchedPreferred.length / preferredSkills.length) * 0.2
        : 0;

      const totalScore = Math.min(requiredScore + preferredBonus, 1);

      let matchLevel = 'Low';
      if (totalScore >= 0.8) matchLevel = 'High';
      else if (totalScore >= 0.5) matchLevel = 'Medium';

      return {
        _id: candidate._id,
        name: candidate.name,
        email: candidate.email,
        skills: candidate.skills,
        experience: candidate.experience,
        bio: candidate.bio,
        matchScore: Math.round(totalScore * 100),
        matchLevel,
        matchedSkills: matchedRequired.map(s =>
          candidate.skills.find(cs => cs.toLowerCase() === s) || s
        ),
        matchedPreferred: matchedPreferred.map(s =>
          candidate.skills.find(cs => cs.toLowerCase() === s) || s
        )
      };
    });

    const sorted = results.sort((a, b) => b.matchScore - a.matchScore);
    res.json({ success: true, results: sorted });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;