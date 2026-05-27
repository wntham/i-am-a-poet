import { Router } from 'express'
import Anthropic from '@anthropic-ai/sdk'

const router = Router()

const STYLE_RULES = {
  Haiku: 'Exactly 3 lines. Line 1: 5 syllables. Line 2: 7 syllables. Line 3: 5 syllables. No title.',
  Sonnet: '14 lines of iambic pentameter. Rhyme scheme: ABAB CDCD EFEF GG (Shakespearean). No title.',
  Limerick: '5 lines. Rhyme scheme AABBA. Lines 1, 2, 5 are longer (anapestic, ~8 syllables). Lines 3, 4 are shorter (~5 syllables). No title.',
  Villanelle: '19 lines: 5 tercets (ABA rhyme) followed by a closing quatrain (ABAA). Line 1 and line 3 of the first tercet serve as alternating refrains throughout. No title.',
  Ode: 'At least 10 lines. Elevated diction. Opens with an apostrophe address to its subject. Stanzas of 4–8 lines. No title.',
}

const STYLE_POETS = {
  Haiku: 'Matsuo Bashō, Yosa Buson, Kobayashi Issa',
  Sonnet: 'Shakespeare, John Donne, Edmund Spenser',
  Limerick: 'Edward Lear',
  Villanelle: 'Ernest Dowson, W. E. Henley',
  Ode: 'John Keats, Percy Bysshe Shelley, William Wordsworth',
}

const VALID_STYLES = Object.keys(STYLE_RULES)
const VALID_MOODS = ['Whimsical', 'Jubilant', 'Wistful', 'Unmoored', 'Reverie']

router.post('/', async (req, res) => {
  const { style, mood } = req.body

  if (!VALID_STYLES.includes(style)) {
    return res.status(400).json({ error: `Invalid style. Must be one of: ${VALID_STYLES.join(', ')}` })
  }
  if (!VALID_MOODS.includes(mood)) {
    return res.status(400).json({ error: `Invalid mood. Must be one of: ${VALID_MOODS.join(', ')}` })
  }

  const client = new Anthropic()

  const systemPrompt = `You are a poet working strictly within the tradition of pre-1927 literary movements. You emulate the style of: ${STYLE_POETS[style]}.

Generate one original ${style} poem with a ${mood} mood.

STRUCTURAL REQUIREMENTS — you must follow these exactly:
${STYLE_RULES[style]}

CONTENT RULES:
- All poems must be wholly original — do not quote or reproduce any existing work
- No explicit violence or sexual content
- Mood should infuse the imagery, word choice, and rhythm throughout

Return only the poem text. No explanatory text before or after. No title. No attribution.`

  try {
    const message = await client.messages.create({
      model: 'claude-opus-4-7',
      max_tokens: 1024,
      messages: [
        { role: 'user', content: `Write a ${style} poem with a ${mood} mood.` },
      ],
      system: systemPrompt,
    })

    const poem = message.content[0]?.text?.trim()
    if (!poem) throw new Error('Empty response from model')

    res.json({ poem, style, mood })
  } catch (err) {
    if (err.status === 429) {
      return res.status(429).json({ error: 'Rate limit reached — please try again in a moment.' })
    }
    console.error('Poem generation error:', err.message)
    res.status(500).json({ error: 'Failed to generate poem. Please try again.' })
  }
})

export default router
