# LearnWithMal Math Questions - Summary

## Overview
Created 4 JSON question files for math modules with a total of **196 questions** across 7 difficulty levels.

## Files Created

### 1. money.json (49 questions)
**Location:** `/src/data/questions/math/money.json`

- **Level 1**: Identify coins/notes (50¢, $1, $2, $5, $10, 20¢, 10¢)
- **Level 2**: Count coins (totaling money from multiple coins)
- **Level 3**: Read prices (realistic Singapore hawker prices)
  - Chicken rice: $4.50
  - Kopi: $1.50
  - Nasi lemak: $4.00
  - Roti prata: $2.50
  - Milo: $2.00
  - Laksa: $5.00
  - Char kway teow: $3.50
- **Level 4**: Pay exact amount (combination of coins/notes)
- **Level 5**: Calculate change (subtracting from payment)
- **Level 6**: Compare prices (cheaper vs more expensive)
- **Level 7**: Budget (can you buy multiple items with $X?)

**Features:**
- Audio field set for Level 1-2 coin amounts ("fifty cents", "twenty cents")
- Singapore-specific hawker food prices
- Age-appropriate for 18-year-old with ASD

### 2. time.json (49 questions)
**Location:** `/src/data/questions/math/time.json`

- **Level 1**: Read whole hours on clock (3:00, 6:00, 9:00, 12:00, 1:00, 5:00, 10:00)
- **Level 2**: Read half hours (2:30, 7:30, 10:30, 4:30, 1:30, 9:30, 6:30)
- **Level 3**: Read quarter hours (9:15, 3:45, 6:15, 12:45, 5:15, 8:45, 11:15)
- **Level 4**: Match digital time to clock face
- **Level 5**: Time words (morning, afternoon, evening, AM/PM)
- **Level 6**: Duration calculations (30 min, 1 hour, 2 hours)
- **Level 7**: Schedule reading (school timetable - English, Math, Cleaning, PE, Lunch, Dismissal, Assembly)

**Features:**
- `clockTime` field with {hours, minutes} for clock rendering
- Audio field with spoken time ("three o'clock", "seven thirty")
- Singapore school context
- Predictable, ASD-friendly layout

### 3. adding.json (49 questions)
**Location:** `/src/data/questions/math/adding.json`

- **Level 1**: Addition within 10 (3+4, 2+5, 1+6, 4+3, 2+3, 5+2, 1+4)
- **Level 2**: Addition within 20 (12+5, 8+7, 11+6, 9+8, 10+7, 13+4, 6+9)
- **Level 3**: Addition within 100 (25+13, 34+22, 45+15, 23+35, 32+24, 41+18, 52+21)
- **Level 4**: Addition with money ($2.50+$1.50, $3+$2, $4.50+$1.50, etc.)
- **Level 5**: Multiple addends (3+2+4, 5+5+5, 2+3+4, 1+2+3, 4+3+2, 6+3+1, 2+2+2)
- **Level 6**: Word problems - workplace (plates, cups, napkins, spoons, forks, bottles)
- **Level 7**: Word problems - shopping with Singapore hawker food prices

**Features:**
- Audio field for equations ("three plus four equals what?")
- Real-world context (workplace, shopping)
- Singapore prices for food items
- Scalable difficulty progression

### 4. subtracting.json (49 questions)
**Location:** `/src/data/questions/math/subtracting.json`

- **Level 1**: Subtraction within 10 (8-3, 7-2, 9-4, 6-2, 5-1, 10-5, 7-3)
- **Level 2**: Subtraction within 20 (15-7, 18-9, 13-5, 17-8, 14-6, 16-7, 12-4)
- **Level 3**: Subtraction within 100 (45-12, 67-25, 80-35, 56-23, 78-34, 92-41, 73-31)
- **Level 4**: Subtraction with money ($5-$2.50, $10-$3.50, $8-$4.50, etc.)
- **Level 5**: Calculate change (pay $10 for $4.50 item, etc.)
- **Level 6**: Word problems - workplace (chairs taken, bottles empty, napkins used)
- **Level 7**: Word problems - shopping (budget management with multiple purchases)

**Features:**
- Audio field for equations ("eight minus three equals what?")
- Real-world change calculations
- Singapore context and prices
- Progressive difficulty with word problems

## Data Structure

All questions follow this required format:
```json
{
  "id": "module_level_###",
  "module": "money|time|adding|subtracting",
  "level": 1-7,
  "type": "multipleChoice",
  "question": "...",
  "options": ["option1", "option2", "option3", "option4"],
  "correctAnswer": "...",
  "hint": "...",
  "tags": ["tag1", "tag2", ...]
}
```

Optional fields:
- `audio` - Spoken form when different from question text (e.g., "three plus four" for "3 + 4")
- `clockTime` - For time questions: `{"hours": 0-12, "minutes": 0-45}`

## Statistics

| Module | Questions | Per Level | Levels |
|--------|-----------|-----------|--------|
| money.json | 49 | 7 | 7 |
| time.json | 49 | 7 | 7 |
| adding.json | 49 | 7 | 7 |
| subtracting.json | 49 | 7 | 7 |
| **TOTAL** | **196** | **7** | **7** |

## Validation
✓ All 196 questions validated
✓ All required fields present
✓ Valid JSON syntax
✓ Consistent structure across all files
✓ Singapore context with hawker food prices
✓ Age-appropriate for 18-year-old with ASD
✓ Audio fields set for math equations and coin amounts
✓ clockTime fields for time-based questions

## Next Steps
1. Test locally: `npm run dev` → http://localhost:5173
2. Verify TTS output for audio fields
3. Verify clock rendering for time.json clockTime fields
4. Create English module questions (pronouns, greetings, asking for help)
5. Commit to git: `git add . && git commit -m "Add 196 math questions"`
6. Deploy to Vercel: `git push`
