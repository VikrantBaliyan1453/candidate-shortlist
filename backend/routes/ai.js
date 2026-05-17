const express = require('express');
const router = express.Router();
const Candidate = require('../models/Candidate');

// POST - AI Shortlisting using OpenRouter
router.post('/shortlist', async (req, res) => {
  try {
    const { requiredSkills, minExperience, preferredSkills = [] } = req.body;

    const candidates = await Candidate.find({
      experience: { $gte: minExperience }
    });

    if (candidates.length === 0) {
      return res.json({ success: true, aiResponse: 'No candidates found matching the experience criteria.' });
    }

    const candidateList = candidates.map((c, i) =>
      `${i + 1}. ${c.name} | Skills: ${c.skills.join(', ')} | Experience: ${c.experience} years | Bio: ${c.bio || 'N/A'}`
    ).join('\n');

    const prompt = `You are a smart HR recruiter AI. Analyze the following candidates and rank them.

Job Requirements:
- Required Skills: ${requiredSkills.join(', ')}
- Preferred Skills: ${preferredSkills.join(', ') || 'None'}
- Minimum Experience: ${minExperience} years

Candidates:
${candidateList}

Please:
1. Rank all candidates from best to worst fit
2. Give each a match percentage
3. Explain in 1-2 lines why each candidate is or isn't suitable
4. Highlight top 3 recommended candidates

Format your response clearly with candidate names and scores.`;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'Candidate Shortlisting System'
      },
      body: JSON.stringify({
        model: 'openai/gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1500
      })
    });

    const data = await response.json();

    if (data.error) {
      console.error('OpenRouter Error:', data.error);
      return res.status(500).json({ success: false, error: data.error.message });
    }

    const aiResponse = data.choices[0].message.content;
    res.json({ success: true, aiResponse, candidatesAnalyzed: candidates.length });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST - AI Interview Questions
router.post('/interview-questions', async (req, res) => {
  try {
    const { candidateId, jobRequirements } = req.body;
    const candidate = await Candidate.findById(candidateId);

    if (!candidate) {
      return res.status(404).json({ success: false, error: 'Candidate not found' });
    }

    const prompt = `Generate 5 targeted interview questions for this candidate:

Candidate: ${candidate.name}
Skills: ${candidate.skills.join(', ')}
Experience: ${candidate.experience} years
Bio: ${candidate.bio || 'N/A'}

Job Requirements: ${jobRequirements || 'General technical role'}

Generate practical, skill-specific questions. Format as a numbered list.`;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'Candidate Shortlisting System'
      },
      body: JSON.stringify({
        model: 'openai/gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 800
      })
    });

    const data = await response.json();

    if (data.error) {
      return res.status(500).json({ success: false, error: data.error.message });
    }

    const questions = data.choices[0].message.content;
    res.json({ success: true, questions, candidate: candidate.name });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;