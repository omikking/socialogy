# Secret Word Imposter

## Multiplayer Party Game — Complete Game & Website Specification

### 1. Game Overview

**Secret Word Imposter** is a multiplayer social-deduction word game for friends.

Each round has:

* 1 **Storyteller**
* 1 **Imposter**
* Remaining players are **Normal Players**

Every player has a personal set of **12 word cards**.

The Storyteller creates the round by selecting **two related secret words**:

* **Common Word** → shown to all Normal Players
* **Imposter Word** → shown only to the Imposter

The Imposter does **not** know that they are the Imposter.

The objective is:

* **Normal Players:** Find the Imposter.
* **Imposter:** Understand the situation and avoid being identified.
* **Storyteller:** Create a difficult enough pair of words that the Imposter has a realistic chance of surviving.

The game should feel like a combination of **word association, bluffing, deduction, and discussion**.

---

# 2. Example Game

There are 6 players:

* Alice
* Bob
* Charlie
* David
* Emma
* Frank

Suppose:

**Storyteller:** Alice

The system randomly chooses:

**Imposter:** David

Alice selects:

**Common Word:** Ocean
**Imposter Word:** River

The system secretly sends:

| Player  | Sees               |
| ------- | ------------------ |
| Alice   | Storyteller screen |
| Bob     | Ocean              |
| Charlie | Ocean              |
| David   | River              |
| Emma    | Ocean              |
| Frank   | Ocean              |

David does NOT see:

> "You are the Imposter."

Instead, he simply sees:

> **Your secret word is: RIVER**

This is important.

The game should not immediately tell the Imposter their role.

David has to figure out that something is different based on what happens during the round.

---

# 3. Player Limits

Recommended MVP:

**Minimum:** 4 players
**Maximum:** 10 players

Recommended:

**5–8 players**

Example:

### 6 Players

* 1 Storyteller
* 1 Imposter
* 4 Normal Players

### 8 Players

* 1 Storyteller
* 1 Imposter
* 6 Normal Players

There should always be exactly:

> **1 Storyteller + 1 Imposter**

per round.

---

# 4. Joining a Game

The website should have:

## Home Page

Two main options:

**Create Game**

**Join Game**

---

## Create Game

The host clicks:

> CREATE GAME

The server creates a unique room.

Example:

> `K7P4QX`

The host receives:

> **Game Code: K7P4QX**

They can share this code with friends.

---

## Join Game

A player enters:

**Game Code**

and:

**Player Name**

Example:

> Game Code: K7P4QX
> Name: Rahul

Then:

> JOIN GAME

The player enters the lobby.

---

# 5. Room Lobby

The lobby displays:

```text
SECRET WORD IMPOSTER

Room: K7P4QX

Players

● Rahul
● Aman
● Priya
● Neha
● Arjun
● Vikram

Waiting for host...

[ START GAME ]
```

Only the host can start the game.

The Start button should remain disabled until:

> Minimum 4 players have joined.

---

# 6. Player Identity

Each player should have:

```text
playerId
playerName
roomId
isHost
connectionStatus
score
```

The server should generate a unique `playerId`.

Do NOT use the player's name as the unique identifier.

Two players may technically have the same display name.

Example:

```text
playerId: 8c4f...
playerName: Rahul
```

---

# 7. Storyteller Selection

At the beginning of every round, the server randomly selects one player as Storyteller.

Example:

```text
Storyteller = Player C
```

The Storyteller should not always be the host.

The Storyteller should rotate between rounds.

Recommended:

### Round 1

Player A

### Round 2

Player B

### Round 3

Player C

etc.

This prevents one player from always controlling the game.

---

# 8. Imposter Selection

After the Storyteller is selected, the server randomly selects one of the **remaining players** as the Imposter.

The Storyteller cannot be the Imposter.

Example:

```text
Players: 6

Storyteller: Player A
Imposter: Player D
```

The Imposter selection must happen on the **server**.

Do not randomly select the Imposter in frontend JavaScript.

The client must never be trusted with role assignment.

---

# 9. Secret Information Rules

This is one of the most important parts of the game.

The server maintains:

```text
storytellerId
imposterId
commonWord
imposterWord
```

But these values must NOT be sent to everyone.

### Storyteller receives

```text
Role: Storyteller

Common Word: Ocean
Imposter Word: River
```

### Normal Player receives

```text
Your Secret Word:

OCEAN
```

### Imposter receives

```text
Your Secret Word:

RIVER
```

The Imposter should NOT receive:

```text
You are Imposter
```

The Normal Player should NOT receive:

```text
You are Normal Player
```

The frontend should only receive the minimum information required for that player.

---

# 10. Never Send All Secret Data to the Browser

This is critical.

Do NOT send this:

```json
{
  "storyteller": "player1",
  "imposter": "player4",
  "commonWord": "Ocean",
  "imposterWord": "River"
}
```

to every client.

Even if the UI hides it, a player could open:

```text
Developer Tools → Network → WebSocket
```

and discover the information.

Instead, the server should send player-specific data.

For example, to Player 2:

```json
{
  "type": "ROUND_SECRET",
  "role": "NORMAL",
  "secretWord": "Ocean"
}
```

To Player 4:

```json
{
  "type": "ROUND_SECRET",
  "role": "IMPOSTER",
  "secretWord": "River"
}
```

To Storyteller:

```json
{
  "type": "ROUND_SECRET",
  "role": "STORYTELLER",
  "commonWord": "Ocean",
  "imposterWord": "River"
}
```

This is a **server-side security requirement**.

---

# 11. The 12 Word Cards

Every player receives/accesses 12 word cards.

Example:

```text
1. Beach
2. Boat
3. Fish
4. Mountain
5. Storm
6. Blue
7. Travel
8. Wave
9. Island
10. Sand
11. Holiday
12. Ship
```

The player must select **one** card.

The selected card becomes that player's answer for the round.

---

# 12. Card Selection

The UI should show:

```text
Your Secret Word

OCEAN

Choose ONE word:

[ BEACH ]
[ BOAT ]
[ FISH ]
[ MOUNTAIN ]
[ STORM ]
[ BLUE ]
[ TRAVEL ]
[ WAVE ]
[ ISLAND ]
[ SAND ]
[ HOLIDAY ]
[ SHIP ]

              [ LOCK ANSWER ]
```

The player can change their selection until they click:

> LOCK ANSWER

After locking:

> **Your answer has been locked.**

They cannot change it.

---

# 13. Why the 12 Cards Matter

The 12 words should not be random every time.

There should be a curated word bank.

The game can eventually have:

### Easy Pack

Common, obvious associations.

### Medium Pack

More abstract associations.

### Hard Pack

Words with many possible interpretations.

### Funny Pack

Funny/unexpected associations.

### Custom Pack

Users create their own word lists.

For MVP, use a curated database.

---

# 14. Storyteller's Job

The Storyteller chooses two words.

They should be:

### Related

Example:

> Ocean / River

### But not identical

Avoid:

> Car / Automobile

### And not completely unrelated

Avoid:

> Ocean / Computer

The ideal relationship is:

> **Close enough for the Imposter to blend in, but different enough for Normal Players to identify unusual answers.**

---

# 15. Storyteller Difficulty

The Storyteller should intentionally control the difficulty.

### Easy

```text
Common: Ocean
Imposter: River
```

### Medium

```text
Common: Ocean
Imposter: Beach
```

### Hard

```text
Common: Ocean
Imposter: Vacation
```

The game should eventually provide a difficulty rating.

---

# 16. Round Flow

Every round follows this exact state machine:

```text
LOBBY
 ↓
ROLE_ASSIGNMENT
 ↓
SECRET_WORD
 ↓
CARD_SELECTION
 ↓
ANSWER_LOCKED
 ↓
ALL_ANSWERS_REVEALED
 ↓
DISCUSSION
 ↓
VOTING
 ↓
VOTE_LOCKED
 ↓
RESULT
 ↓
SCORING
 ↓
NEXT_ROUND
```

This state machine should be controlled by the server.

---

# 17. Answer Reveal

Once every player has locked their answer, the server reveals all selected words.

Example:

```text
ROUND ANSWERS

Rahul     → BEACH
Aman      → BOAT
Priya     → FISH
Neha      → BRIDGE
Arjun     → WAVE
Vikram    → SAND
```

The secret words are still hidden.

Players only see the selected answer cards.

---

# 18. Discussion

Now discussion begins.

Recommended timer:

**90 seconds**

Example:

```text
DISCUSSION

01:27

Discuss who you think received the different word.

[ CHAT ]
```

Players can talk using:

* Voice chat, if implemented
* Text chat
* External voice call such as Discord/WhatsApp

For MVP, I recommend **text chat or external voice** instead of building voice chat immediately.

---

# 19. Storyteller During Discussion

The Storyteller should **not reveal information**.

The Storyteller should not say:

> "I think Rahul is suspicious."

The Storyteller should not say:

> "Beach is definitely correct."

The Storyteller should primarily observe.

Otherwise the Storyteller can unintentionally reveal the answer.

Recommended rule:

> **Storyteller cannot participate in the discussion.**

They can see the discussion but cannot send messages during the discussion phase.

This is a major anti-leakage rule.

---

# 20. Voting

After discussion:

```text
WHO IS THE IMPOSTER?

○ Rahul
○ Aman
○ Priya
○ Neha
○ Arjun
○ Vikram
```

Players cannot vote for themselves.

The Storyteller does NOT vote.

Therefore, if there are 6 players:

* 1 Storyteller
* 1 Imposter
* 4 Normal Players

There are only:

> **4 votes**

---

# 21. Secret Voting

Votes must be secret.

Do NOT display:

```text
Rahul → Aman
Priya → Aman
Arjun → Neha
```

while voting is happening.

Instead show:

```text
3 / 4 players have voted
```

When everyone has voted:

> **REVEAL VOTES**

The server reveals all votes simultaneously.

This prevents vote-following.

---

# 22. Voting Result

Example:

```text
VOTE RESULTS

Aman     ███ 3
Neha     █ 1
Rahul    0
Priya    0
Arjun    0
Vikram   0
```

Then:

```text
THE IMPOSTER WAS:

AMAN
```

---

# 23. Important: What Does "Caught" Mean?

The Imposter is caught if:

> The player receiving the highest number of votes is the actual Imposter.

Example:

Actual Imposter:

> Aman

Votes:

```text
Aman 3
Neha 1
```

Aman is caught.

---

# 24. Tie Handling

This must be explicitly defined.

Suppose:

```text
Aman = 2
Neha = 2
```

and Aman is the Imposter.

I recommend:

> **The Imposter survives on a tie.**

Why?

Because Normal Players failed to reach a majority decision.

Therefore:

```text
Tie = Imposter survives
```

This also makes the game more exciting.

---

# 25. Scoring System

The scoring should reward all three important behaviors:

### Normal Players

Find the Imposter.

### Imposter

Survive.

### Storyteller

Create a successful difficult round.

Recommended scoring:

## If Imposter is caught

Correct Normal Player:

**+3 points**

Incorrect Normal Player:

**0 points**

Imposter:

**0 points**

Storyteller:

**0 points**

---

## If Imposter survives

Imposter:

**+4 points**

Storyteller:

**+4 points**

Normal Players:

**0 points**

This creates the hidden relationship:

> Storyteller + Imposter benefit from the Imposter surviving.

However, they do not know each other's identity.

---

# 26. Optional Difficulty Bonus

There is a potential problem.

If the Storyteller receives +4 every time the Imposter survives, the Storyteller might choose extremely similar words.

Therefore, later versions can add a difficulty system.

Example:

### Imposter gets 0 votes

Storyteller: +2
Imposter: +4

### Imposter gets 1 vote

Storyteller: +3
Imposter: +4

### Imposter gets 2 votes and survives

Storyteller: +5
Imposter: +5

This rewards the Storyteller for creating a close game.

For the first version, however, keep scoring simple:

> **Imposter survives → Storyteller +4, Imposter +4**

Playtesting can determine whether the difficulty bonus is necessary.

---

# 27. Round Score Example

Six players:

```text
Storyteller: Rahul
Imposter: Aman

Votes:

Aman = 2
Neha = 1
Priya = 1
```

Aman survives because there is no majority against him.

Scores:

```text
Rahul +4
Aman  +4

Neha  +0
Priya +0
Arjun +0
Vikram +0
```

---

# 28. Multi-Round Game

The game should not end after one round.

Recommended:

### 5 rounds

After every round:

* Storyteller changes.
* Imposter is randomly selected again.
* New secret words are selected.
* Everyone's score is retained.

At the end:

```text
FINAL SCORE

1. Rahul    21
2. Aman     18
3. Priya    15
4. Neha     13
5. Arjun    11
6. Vikram    9
```

Winner:

> **Rahul**

---

# 29. Storyteller Rotation

The Storyteller should rotate.

For example:

### Round 1

Rahul

### Round 2

Aman

### Round 3

Priya

### Round 4

Neha

### Round 5

Arjun

If there are more rounds than players, continue from the beginning.

The server should determine this.

Do not allow the host to manually select the Storyteller unless a special game mode is enabled.

---

# 30. Imposter Randomization

The Imposter must be independently randomized every round.

Important:

The previous Imposter should NOT automatically become a Normal Player because of rotation.

Example:

Round 1:

```text
Storyteller = Rahul
Imposter = Aman
```

Round 2:

```text
Storyteller = Aman
Imposter = Neha
```

This is valid.

The Imposter role should never be predictable.

---

# 31. Game Server Architecture

Recommended architecture:

```text
Frontend
   |
   | HTTPS / WebSocket
   |
Backend Server
   |
   ├── Room Manager
   ├── Game State Manager
   ├── Role Manager
   ├── Word Manager
   ├── Vote Manager
   └── Score Manager
```

Recommended technology for your implementation:

### Frontend

React / Next.js

### Backend

Node.js + TypeScript

### Real-time

WebSocket / Socket.IO

### Database

PostgreSQL

### ORM

Prisma

This makes the game state easier to manage than trying to run everything purely in the frontend.

---

# 32. Room State

The server should maintain something similar to:

```typescript
type Room = {
  id: string;
  code: string;
  hostId: string;

  players: Player[];

  roundNumber: number;
  maxRounds: number;

  gameState: GameState;

  storytellerId?: string;
  imposterId?: string;

  commonWord?: string;
  imposterWord?: string;

  answers: Answer[];
  votes: Vote[];

  scores: Record<string, number>;
};
```

---

# 33. Player State

```typescript
type Player = {
  id: string;
  name: string;

  isHost: boolean;

  score: number;

  connected: boolean;

  selectedCard?: string;
  answerLocked: boolean;
  voteLocked: boolean;
};
```

Never send the complete server-side Player object to the client if it contains secret information.

---

# 34. Game State

Use an explicit enum:

```typescript
enum GameState {
  LOBBY = "LOBBY",
  ROLE_ASSIGNMENT = "ROLE_ASSIGNMENT",
  SECRET_WORD = "SECRET_WORD",
  CARD_SELECTION = "CARD_SELECTION",
  REVEAL = "REVEAL",
  DISCUSSION = "DISCUSSION",
  VOTING = "VOTING",
  RESULTS = "RESULTS",
  SCOREBOARD = "SCOREBOARD",
  FINISHED = "FINISHED"
}
```

The server controls transitions.

Clients should never be able to say:

```text
startVoting()
```

and change the actual server state.

The client can only request an action.

The server decides whether the action is valid.

---

# 35. WebSocket Events

Example events:

```text
ROOM_CREATE
ROOM_JOIN
PLAYER_JOINED
PLAYER_LEFT

GAME_START
ROUND_START

ROLE_ASSIGNED
SECRET_WORD

CARD_SELECTED
CARD_LOCKED

ALL_CARDS_LOCKED
ANSWERS_REVEALED

DISCUSSION_START
DISCUSSION_END

VOTE_CAST
VOTE_LOCKED

ALL_VOTES_LOCKED
VOTES_REVEALED

ROUND_RESULT
SCORE_UPDATE

NEXT_ROUND
GAME_FINISHED
```

---

# 36. Server Validation

Every important action must be validated.

For example:

```text
Can this player vote?
```

Server checks:

* Is player in the room?
* Is game currently in VOTING state?
* Is player the Storyteller?
* Has player already voted?
* Is target a valid player?
* Is target the same player?
* Is the player voting for themselves?

Only then is the vote accepted.

---

# 37. Prevent Self-Voting

The server must reject:

```text
playerId === targetPlayerId
```

with:

```text
INVALID_VOTE
```

Do not rely only on disabling the player's own name in the UI.

A malicious client could manually send the request.

---

# 38. Prevent Multiple Votes

If:

```text
player.voteLocked === true
```

then another vote must be rejected.

This prevents:

```text
Vote → Change Vote → Vote Again
```

unless the game rules explicitly allow changing votes.

Recommended:

> Once locked, the vote cannot be changed.

---

# 39. Prevent Multiple Card Selections

Same rule:

```text
answerLocked === true
```

means the player cannot change their answer.

---

# 40. Timer Management

Timers should be controlled by the server.

Do NOT trust:

```javascript
setTimeout(...)
```

on the frontend as the actual game timer.

The server should store:

```text
phaseStartedAt
phaseEndsAt
```

Example:

```json
{
  "phase": "DISCUSSION",
  "phaseEndsAt": "2026-10-06T10:45:30Z"
}
```

The frontend only displays the countdown.

If a player refreshes the page, the server tells them how much time remains.

---

# 41. Reconnection

This is extremely important for a multiplayer website.

If a player accidentally refreshes:

```text
F5
```

they should NOT be removed from the game immediately.

Use:

```text
playerId
session token
room code
```

to reconnect them.

Example:

```text
Reconnecting...

✓ Reconnected
```

The server should restore their current game state.

---

# 42. If a Player Disconnects

Recommended behavior:

### Lobby

Player can leave normally.

### During Game

Give them:

**30 seconds**

to reconnect.

If they do not return:

> Mark player as disconnected.

The host can choose:

**Continue**

or

**End Game**

For MVP, automatically ending the game if too many players leave is acceptable.

---

# 43. Minimum Player Requirement

Before starting:

```text
players >= 4
```

If fewer than 4:

```text
Need at least 4 players to start.
```

Recommended maximum:

```text
10 players
```

---

# 44. Information Visibility Matrix

This should be explicitly implemented.

| Information           | Storyteller | Normal Player | Imposter |
| --------------------- | ----------- | ------------- | -------- |
| Common Word           | YES         | YES           | NO       |
| Imposter Word         | YES         | NO            | YES      |
| Their own secret word | YES*        | YES           | YES      |
| Their role            | YES         | NO            | NO       |
| Imposter identity     | YES         | NO            | NO       |
| Storyteller identity  | YES         | YES           | YES      |
| Selected answers      | YES         | YES           | YES      |
| Votes before reveal   | NO          | NO            | NO       |
| Final votes           | YES         | YES           | YES      |
| Scores                | YES         | YES           | YES      |

`*` Storyteller sees both words rather than having a normal secret word.

This table should become a major implementation rule.

---

# 45. Critical Security Rule

Never trust the frontend.

The frontend should never determine:

* Who is Imposter
* Who is Storyteller
* Which word belongs to whom
* Whether a player is caught
* Final score
* Whether voting is complete
* Whether a phase has ended

All of these must be determined by the server.

---

# 46. Score Calculation Must Be Server-Side

For example:

```typescript
if (imposterCaught) {
    correctPlayers.forEach(player => {
        player.score += 3;
    });
} else {
    imposter.score += 4;
    storyteller.score += 4;
}
```

The frontend only receives:

```text
SCORE_UPDATE
```

It should never calculate the official score.

---

# 47. Database Structure

Recommended tables:

### users

```text
id
displayName
createdAt
```

### rooms

```text
id
code
hostId
status
createdAt
```

### game_players

```text
id
roomId
userId
score
joinedAt
```

### rounds

```text
id
roomId
roundNumber
storytellerId
imposterId
commonWord
imposterWord
startedAt
endedAt
```

### answers

```text
id
roundId
playerId
word
lockedAt
```

### votes

```text
id
roundId
voterId
targetId
createdAt
```

Do not expose `imposterId`, `commonWord`, or `imposterWord` through a public API response.

---

# 48. Word Database

Create a word database such as:

```text
words
-----
id
word
category
difficulty
active
```

Example:

```text
Ocean
River
Beach
Mountain
Forest
Rain
Snow
Fire
Desert
Space
```

Later you can create word pairs:

```text
word_pairs
----------
id
wordA
wordB
difficulty
category
```

Example:

```text
Ocean | River | Easy
Ocean | Beach | Hard
Dog   | Wolf  | Medium
Coffee| Tea   | Easy
```

This allows the Storyteller to select appropriate pairs.

---

# 49. Better Storyteller Interface

Instead of making the Storyteller manually search through hundreds of words, provide:

```text
Choose Common Word

[ Search ]

Ocean
River
Mountain
Forest
...
```

Then:

```text
Choose Imposter Word

Recommended related words:

River
Beach
Wave
Island
Lake
```

This reduces bad combinations.

---

# 50. Prevent Bad Word Combinations

The server should eventually prevent:

```text
Ocean + Computer
```

unless a Hard/Custom mode is being used.

The word database can contain a similarity score:

```text
wordA
wordB
similarityScore
```

Example:

```text
Ocean / River = 0.82
Ocean / Beach = 0.91
Ocean / Computer = 0.04
```

Recommended range:

```text
0.50 – 0.90
```

for normal gameplay.

---

# 51. Anti-Cheat Rules

The game should prevent:

### Inspecting hidden role

Never send hidden role data unnecessarily.

### Changing answer after reveal

Server locks answers.

### Changing vote

Server locks votes.

### Voting after timer

Server rejects late votes.

### Sending votes for nonexistent players

Server validates target ID.

### Joining after round starts

Recommended:

> Players can join only during Lobby.

### Watching another player's screen

This cannot be completely prevented technically.

The game should therefore minimize the amount of sensitive information displayed.

---

# 52. Host Powers

The host can:

* Create room
* Start game
* End game
* Restart game
* Change number of rounds
* Choose word difficulty
* Remove a player from lobby

The host should NOT be able to:

* See the Imposter early
* Change the Imposter
* Change votes
* Change scores
* Change another player's secret word

Otherwise the host has too much power.

---

# 53. UI Pages

### Page 1 — Home

```text
SECRET WORD
IMPOSTER

[ CREATE GAME ]

[ JOIN GAME ]
```

### Page 2 — Create Game

```text
Game Settings

Players: 4–10
Rounds: 5
Difficulty: Medium

[ CREATE ROOM ]
```

### Page 3 — Join

```text
Game Code
[ K7P4QX ]

Your Name
[ Rahul ]

[ JOIN ]
```

### Page 4 — Lobby

Shows players and host controls.

### Page 5 — Secret Word

Shows player's private word.

### Page 6 — Card Selection

Shows 12 word cards.

### Page 7 — Answer Reveal

Shows everyone's selected words.

### Page 8 — Discussion

Timer + player list.

### Page 9 — Voting

Players select suspected Imposter.

### Page 10 — Result

Shows:

```text
THE IMPOSTER WAS...

AMAN
```

### Page 11 — Scoreboard

Shows current rankings.

### Page 12 — Final Result

Shows winner.

---

# 54. Mobile-First Design

The game should primarily work on:

* Mobile
* Tablet
* Desktop

The cards should be large enough to tap.

Recommended layout:

```text
┌─────────────────────┐
│ Secret Word: OCEAN  │
├─────────────────────┤
│                     │
│  BEACH      BOAT    │
│                     │
│  FISH       WAVE    │
│                     │
│  ISLAND     SHIP    │
│                     │
│  ...                │
│                     │
└─────────────────────┘
```

---

# 55. Game Experience

The game should always clearly show:

```text
ROUND 2 / 5
```

and:

```text
CURRENT PHASE:
DISCUSSION
```

The player should never wonder:

> "What am I supposed to do?"

Every phase should have exactly one primary action.

---

# 56. Recommended MVP

Do NOT build everything initially.

Build this first:

### MVP

1. Create room
2. Join using code
3. Player lobby
4. Host starts game
5. Random Storyteller
6. Random Imposter
7. Secret word distribution
8. 12 word cards
9. Card selection
10. Answer locking
11. Answer reveal
12. Discussion timer
13. Secret voting
14. Vote reveal
15. Imposter detection
16. Score calculation
17. Scoreboard
18. Multiple rounds
19. Reconnection
20. Final winner

This is enough for a playable first version.

---

# 57. Future Features

After the MVP works:

### Accounts

Players can create profiles.

### Friends

Add friends and invite them.

### Private rooms

Password-protected rooms.

### Public matchmaking

Find random players.

### Voice chat

Built-in voice discussion.

### Custom word packs

Players create their own words.

### Themes

Funny, Bollywood, movies, technology, animals, etc.

### Statistics

```text
Games Played
Imposter Wins
Normal Wins
Storyteller Wins
Average Score
```

### Achievements

Examples:

> Master Imposter
> Survived 10 rounds

> Detective
> Caught 20 imposters

> Master Storyteller
> Helped Imposters survive 10 times

---

# 58. Recommended Final Rules

For the first deployed version, use these rules:

**Players:** 4–10

**Storyteller:** 1

**Imposter:** 1

**Normal Players:** everyone else

**Cards:** 12 per player

**Storyteller:** selects Common Word + Imposter Word

**Imposter:** receives only Imposter Word

**Normal Players:** receive only Common Word

**Storyteller:** does not vote

**Storyteller:** does not participate in discussion

**Players:** choose exactly one card

**Cards:** locked after selection

**Discussion:** 90 seconds

**Voting:** secret

**Self-voting:** prohibited

**Vote changes:** prohibited after locking

**Tie:** Imposter survives

**Imposter caught:** Correct Normal Players +3

**Imposter survives:** Imposter +4, Storyteller +4

**Rounds:** 5

**Winner:** Highest total score

---

# 59. Most Important Design Principle

The game should never reveal more information than the player is supposed to know.

The server should always think:

> "What does THIS player need to know?"

rather than:

> "What information can I send to everyone?"

This principle is especially important because the game depends entirely on **hidden information**.

The frontend is only the interface.

The **server is the source of truth** for:

* Roles
* Words
* Cards
* Answers
* Votes
* Timers
* Scores
* Round state
* Winner

---

# 60. Complete Round Example

### Phase 1

```text
6 Players
```

### Phase 2

Server selects:

```text
Storyteller = Rahul
Imposter = Aman
```

### Phase 3

Storyteller chooses:

```text
Common Word = OCEAN
Imposter Word = RIVER
```

### Phase 4

Players receive:

```text
Rahul → Ocean + River
Aman → River
Priya → Ocean
Neha → Ocean
Arjun → Ocean
Vikram → Ocean
```

### Phase 5

Everyone chooses one of their 12 cards.

### Phase 6

Answers are revealed.

```text
Rahul → BEACH
Aman → BRIDGE
Priya → WAVE
Neha → FISH
Arjun → BOAT
Vikram → SAND
```

### Phase 7

90-second discussion.

### Phase 8

Normal players secretly vote.

```text
Priya → Aman
Neha → Aman
Arjun → Rahul
Vikram → Neha
```

### Phase 9

Result:

```text
Aman = 2 votes
Rahul = 1
Neha = 1
```

Aman is the actual Imposter.

But with only 4 voters, Aman does not have a majority.

Therefore:

> **Imposter survives.**

### Phase 10

Scores:

```text
Aman +4
Rahul +4
```

Everyone else:

```text
+0
```

### Phase 11

Next round.

Storyteller rotates.

New Imposter is randomly selected.

New words are selected.

The game continues.

---

# 61. Final Product Vision

The website should ultimately feel like:

> **"Get your friends into a room, share one code, and start playing within 30 seconds."**

The ideal user journey is:

```text
OPEN WEBSITE
      ↓
CREATE GAME
      ↓
SHARE 6-CHARACTER CODE
      ↓
FRIENDS JOIN
      ↓
START
      ↓
SECRET WORD
      ↓
CHOOSE 1 OF 12 WORDS
      ↓
REVEAL
      ↓
DISCUSS
      ↓
VOTE
      ↓
IMPOSTER REVEALED
      ↓
SCORE
      ↓
NEXT ROUND
      ↓
FINAL WINNER
```

The game should prioritize **fast rounds, hidden information, discussion, and replayability** rather than complicated UI.
