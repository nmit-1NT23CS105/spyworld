export const CANONICAL_MOVIES = [
  {
    id: 'KGF',
    name: 'K.G.F',
    hero: 'Rocky Bhai',
    heroTitle: 'Sultan of Narachi',
    genre: 'Action / Crime',
    difficulty: '★★★★★',
    difficultyRating: 5,
    playTime: '10 - 15 Mins',
    endingsCount: 5,
    trailerId: 'Qah9sSIXJqk',
    theme: 'kgf-theme',
    tagline: 'Violence likes me!',
    oneLiner: 'Become the leader. Build your power. Choose your path.',
    shortDesc: 'Disguised as a slave, infiltrate the brutal gold mines of Narachi and free 20,000 workers.',
    characters: [
      { name: 'Rocky Bhai', role: 'Protagonist • Undisputed King' },
      { name: 'Garuda', role: 'Tyrant Overseer of Narachi' },
      { name: 'Reena', role: 'High Society Heiress' }
    ],
    scenes: [
      {
        act: 1,
        locationTime: 'NARACHI MINES • DAY',
        story: 'You enter the camp. A guard is about to whip an old blind man.',
        mission: 'Save the old man and take control.',
        choices: [
          { text: '⚔️ Face the guard and grab the whip.', effect: { health: 0, reputation: 10, risk: 10, courage: 8 } },
          { text: '🏃 Push the iron cart into the tower.', effect: { health: 0, reputation: 5, risk: -5, courage: 4 } },
          { text: '🧠 Whisper courage to the workers.', effect: { health: 0, trust: 10, risk: -10, intelligence: 6 } }
        ]
      },
      {
        act: 2,
        locationTime: 'OUTPOST TEA STALL • NOON',
        story: 'Fifteen armed guards surround you with iron crowbars.',
        mission: 'Defeat the guards without flinching.',
        choices: [
          { text: '⚔️ Strike first with a heavy kick.', effect: { health: -10, reputation: 12, risk: 15, courage: 10 } },
          { text: '🧠 Sip your hot tea and stare them down.', effect: { health: 0, reputation: 8, risk: 5, intelligence: 8 } },
          { text: '🏃 Flip the furnace to blind them.', effect: { health: 0, reputation: 6, risk: -10, intelligence: 6 } }
        ]
      },
      {
        act: 3,
        locationTime: 'WORKER BARRACKS • MIDNIGHT',
        story: 'You strike the heavy anvil. Five thousand workers watch in silence.',
        mission: 'Arm the workers for rebellion.',
        choices: [
          { text: '⚔️ Forge weapons and call for battle.', effect: { health: 0, trust: 15, reputation: 10, courage: 10 } },
          { text: '🧠 Cut the fortress power cables first.', effect: { health: 0, risk: -15, intelligence: 10 } },
          { text: '🏃 Ambush the night patrol silently.', effect: { health: -5, risk: -10, courage: 5 } }
        ]
      },
      {
        act: 4,
        locationTime: 'INNER CITADEL • RAIN',
        story: 'Searchlights sweep the stone walls. Sentinels guard the gate.',
        mission: 'Breach the citadel before sunrise.',
        choices: [
          { text: '🏃 Climb the 80-foot chain in the rain.', effect: { health: -5, risk: 10, courage: 10 } },
          { text: '⚔️ Take down the sentinel silently.', effect: { health: 0, risk: -5, intelligence: 8 } },
          { text: '🧠 Detonate the fuel depot.', effect: { health: -10, reputation: 15, risk: 20 } }
        ]
      },
      {
        act: 5,
        locationTime: 'KALI TEMPLE • DAWN',
        story: 'Garuda stands at the holy altar. His sword is raised.',
        mission: 'Defeat Garuda and free Narachi.',
        choices: [
          { text: '⚔️ Deliver the final strike at the altar.', effect: { health: -15, reputation: 25, courage: 20 } },
          { text: '🧠 Disarm Garuda using his own blade.', effect: { health: -5, reputation: 20, intelligence: 15 } },
          { text: '🔥 Roar across the mines: Salaam Rocky!', effect: { health: 0, trust: 25, reputation: 20 } }
        ]
      }
    ],
    endings: [
      { id: 'sultan', title: 'The Undisputed Sultan', type: 'Heroic Triumph', desc: 'Garuda falls. 20,000 workers roar your name. You become the King of Narachi.' },
      { id: 'shadow', title: 'The Shadow Monarch', type: 'Strategic Mastermind', desc: 'You rule from behind the curtain, keeping your power secret.' },
      { id: 'liberator', title: 'The People\'s Liberator', type: 'Rebel Champion', desc: 'You break the chains and return the gold to the working families.' },
      { id: 'martyr', title: 'The Golden Legend', type: 'Tragic Hero', desc: 'Wounded in battle, your final strike frees the oppressed forever.' },
      { id: 'iron', title: 'The Iron Conqueror', type: 'Ruthless Warlord', desc: 'Narachi becomes an impenetrable fortress feared by all.' }
    ]
  },

  {
    id: 'Baahubali',
    name: 'Baahubali',
    hero: 'Amarendra Baahubali',
    heroTitle: 'Prince of Mahishmati',
    genre: 'Epic / Action / Fantasy',
    difficulty: '★★★★★',
    difficultyRating: 5,
    playTime: '12 - 18 Mins',
    endingsCount: 6,
    trailerId: 'qD-6d8Wo3do',
    theme: 'baahubali-theme',
    tagline: 'Mahishmati is my breath!',
    oneLiner: 'Defend honor. Protect your people. Claim your destiny.',
    shortDesc: 'Stand beside Princess Devasena, defy corrupt nobles, and lead the charge against Bhallaladeva.',
    characters: [
      { name: 'Amarendra Baahubali', role: 'Protagonist • Beloved Prince' },
      { name: 'Princess Devasena', role: 'Warrior Princess of Kuntala' },
      { name: 'Kattappa', role: 'Loyal Commander & Uncle' },
      { name: 'Bhallaladeva', role: 'Usurper King' }
    ],
    scenes: [
      {
        act: 1,
        locationTime: 'KUNTALA GATES • DUSK',
        story: 'Bandits attack on horses. Devasena draws her bow beside you.',
        mission: 'Defend Kuntala alongside Devasena.',
        choices: [
          { text: '🏹 Fire three burning arrows together.', effect: { health: 0, reputation: 10, courage: 8 } },
          { text: '⚔️ Slash the waterwheel to flood the road.', effect: { health: 0, intelligence: 10, risk: -10 } },
          { text: '🛡️ Form an unbreakable shield wall.', effect: { health: 0, trust: 10, risk: -5 } }
        ]
      },
      {
        act: 2,
        locationTime: 'ROYAL COURT • NOON',
        story: 'Traitors insult Devasena in court. Bhallaladeva smiles on his throne.',
        mission: 'Protect royal honor in open court.',
        choices: [
          { text: '⚔️ Draw your sword and execute the traitor.', effect: { health: 0, reputation: 15, courage: 12, risk: 15 } },
          { text: '🧠 Remind the council of Sivagami\'s laws.', effect: { health: 0, trust: 10, intelligence: 10 } },
          { text: '🛡️ Disarm the royal guards barehanded.', effect: { health: 0, reputation: 8, courage: 8 } }
        ]
      },
      {
        act: 3,
        locationTime: 'PEASANT VILLAGE • DAY',
        story: 'An enraged temple elephant storms through the market.',
        mission: 'Calm the elephant and save villagers.',
        choices: [
          { text: '⚔️ Wrestle the beast barehanded.', effect: { health: -10, reputation: 15, courage: 12 } },
          { text: '🧠 Build a wooden barrier using timber.', effect: { health: 0, trust: 12, intelligence: 10 } },
          { text: '🏃 Lure the animal toward the river.', effect: { health: 0, risk: -10, intelligence: 8 } }
        ]
      },
      {
        act: 4,
        locationTime: 'MISTY FOREST • MIDNIGHT',
        story: 'Five hundred assassins surround you. Kattappa hesitates with his sword.',
        mission: 'Survive the midnight ambush.',
        choices: [
          { text: '⚔️ Spin with dual swords under the moon.', effect: { health: -10, reputation: 12, courage: 10 } },
          { text: '🔥 Set fire to the bamboo grove.', effect: { health: 0, risk: -15, intelligence: 10 } },
          { text: '🧠 Call Kattappa to fight beside you.', effect: { health: 0, trust: 20, courage: 8 } }
        ]
      },
      {
        act: 5,
        locationTime: 'PALACE WALLS • CLIMAX',
        story: 'Bhallaladeva charges on his bronze war chariot.',
        mission: 'Defeat Bhallaladeva and reclaim the throne.',
        choices: [
          { text: '⚔️ Clash barehanded atop the chariot.', effect: { health: -15, reputation: 25, courage: 20 } },
          { text: '🏃 Launch over the wall using palm trees.', effect: { health: -5, intelligence: 15, courage: 10 } },
          { text: '👑 Raise the golden flag of Mahishmati.', effect: { health: 0, trust: 25, reputation: 20 } }
        ]
      }
    ],
    endings: [
      { id: 'emperor', title: 'The Rightful Emperor', type: 'Righteous Sovereign', desc: 'You reclaim the golden throne alongside Devasena. Peace is restored.' },
      { id: 'strategist', title: 'The Royal Strategist', type: 'Tactical Triumph', desc: 'You expose the conspiracy with proof, saving the realm without bloodshed.' },
      { id: 'beloved', title: 'King of the Common Folk', type: 'People\'s Hero', desc: 'Ruling from the villages, your name becomes legendary among the people.' },
      { id: 'martyr', title: 'The Immortal Martyr', type: 'Noble Sacrifice', desc: 'Your sacrifice at the ramparts saves millions of innocent lives.' },
      { id: 'guardian', title: 'The Lone Guardian', type: 'Fortress Sentinel', desc: 'Your unbroken defense seals Mahishmati against all foreign enemies.' },
      { id: 'unifier', title: 'The Compassionate Unifier', type: 'Universal Peace', desc: 'You unite Mahishmati and Kuntala in lasting brotherhood.' }
    ]
  },

  {
    id: 'Pushpa',
    name: 'Pushpa',
    hero: 'Pushpa Raj',
    heroTitle: 'King of Seshachalam Forest',
    genre: 'Action / Crime',
    difficulty: '★★★★☆',
    difficultyRating: 4,
    playTime: '10 - 15 Mins',
    endingsCount: 5,
    trailerId: '1kVK0MZlbI4',
    theme: 'pushpa-theme',
    tagline: 'Thaggedhe Le!',
    oneLiner: 'Outsmart the law. Build an empire. Never bow down.',
    shortDesc: 'Smuggle red sandalwood, outsmart police barricades, and rise to rule the forest syndicate.',
    characters: [
      { name: 'Pushpa Raj', role: 'Protagonist • Sandalwood Kingpin' },
      { name: 'Srivalli', role: 'Soulmate' },
      { name: 'SP Shekhawat', role: 'Police Superintendent' }
    ],
    scenes: [
      {
        act: 1,
        locationTime: 'JUNGLE ROAD • MIDNIGHT',
        story: 'Police searchlights cut through mist. Armed jeeps block your timber lorry.',
        mission: 'Escape DSP Govindappa with the sandalwood.',
        choices: [
          { text: '🪓 Cut ropes to dump logs into the river.', effect: { health: 0, intelligence: 12, risk: -15, trust: 10 } },
          { text: '⚔️ Flip the lead police jeep into the ditch.', effect: { health: -5, reputation: 10, courage: 10, risk: 10 } },
          { text: '🏃 Signal workers to melt into dark trees.', effect: { health: 0, trust: 8, risk: -10 } }
        ]
      },
      {
        act: 2,
        locationTime: 'HIGHWAY CHECKPOST • NOON',
        story: 'Police inspect every car. You drive a giant milk tanker full of timber.',
        mission: 'Smuggle timber through the checkpost.',
        choices: [
          { text: '🧠 Offer police fresh milk and drive past.', effect: { health: 0, intelligence: 15, risk: -10 } },
          { text: '🏃 Smash through the spiked road barrier.', effect: { health: -10, reputation: 10, risk: 15 } },
          { text: '⚔️ Knock out the armed guards at the gate.', effect: { health: -5, courage: 10, reputation: 8 } }
        ]
      },
      {
        act: 3,
        locationTime: 'SYNDICATE MANSION • NIGHT',
        story: 'Boss Mangalam Srinu sits with 30 machete men. You take his chair.',
        mission: 'Seize control of the syndicate.',
        choices: [
          { text: '⚔️ Pin the chief hitman to the table.', effect: { health: -5, reputation: 15, courage: 12 } },
          { text: '🔥 Kick over the boiling oil cauldron.', effect: { health: 0, intelligence: 10, risk: -10 } },
          { text: '🧠 Demand your 4% cut: Thaggedhe Le!', effect: { health: 0, reputation: 12, trust: 10 } }
        ]
      },
      {
        act: 4,
        locationTime: 'SECRET WAREHOUSE • NIGHT',
        story: 'Jolly Reddy threatens your family. You enter his den with an axe.',
        mission: 'Break Jolly Reddy\'s power.',
        choices: [
          { text: '⚔️ Slam Jolly Reddy through his glass desk.', effect: { health: -5, reputation: 15, courage: 10 } },
          { text: '🪓 Chop the timber pillars to drop the roof.', effect: { health: 0, intelligence: 12, risk: -10 } },
          { text: '🧠 Lead Srivalli safely outside.', effect: { health: 0, trust: 15, courage: 8 } }
        ]
      },
      {
        act: 5,
        locationTime: 'FOREST CLIFF • CLIMAX',
        story: 'SP Shekhawat corners you at gunpoint. He orders you to salute him.',
        mission: 'Defeat Shekhawat and rule Seshachalam.',
        choices: [
          { text: '⚔️ Disarm Shekhawat and smash his pistol.', effect: { health: -10, reputation: 20, courage: 15 } },
          { text: '🧠 Brush your shoulder: Thaggedhe Le!', effect: { health: 0, reputation: 25, courage: 15 } },
          { text: '👑 Raise your axe before 5,000 workers.', effect: { health: 0, trust: 25, reputation: 20 } }
        ]
      }
    ],
    endings: [
      { id: 'emperor', title: 'The Syndicate Emperor', type: 'Undisputed Kingpin', desc: 'Pushpa controls the entire timber trade. Shekhawat bows.' },
      { id: 'phantom', title: 'The Forest Phantom', type: 'Stealth Master', desc: 'Moving like mist, Pushpa amasses wealth without spilling blood.' },
      { id: 'coolie', title: 'Champion of the Workers', type: 'People\'s Hero', desc: 'You guarantee fair wages and dignity for 5,000 coolie families.' },
      { id: 'tycoon', title: 'The Commerce Tycoon', type: 'Global Dynasty', desc: 'Exporting to global ports, you build an international trade empire.' },
      { id: 'wildfire', title: 'The Untamed Wildfire', type: 'Untamed Force', desc: 'You rule alone as the untamed fire of the Seshachalam mountains.' }
    ]
  },

  {
    id: 'RRR',
    name: 'RRR',
    hero: 'Komaram Bheem',
    heroTitle: 'Roar of the Forest',
    genre: 'Action / Historical Fiction',
    difficulty: '★★★★☆',
    difficultyRating: 4,
    playTime: '10 - 15 Mins',
    endingsCount: 5,
    trailerId: 'NgBoMJy386M',
    theme: 'rrr-theme',
    tagline: 'Rise, Roar, Revolt!',
    oneLiner: 'Fight for freedom. Stand with your brother. Roar for justice.',
    shortDesc: 'Capture wild tigers, storm the British Viceroy palace, and unite with Ram to free Malli.',
    characters: [
      { name: 'Komaram Bheem', role: 'Protagonist • Roar of the Forest' },
      { name: 'Alluri Sitarama Raju', role: 'Blood Brother & Marksman' },
      { name: 'Malli', role: 'Abducted Tribal Child' }
    ],
    scenes: [
      {
        act: 1,
        locationTime: 'DEEP JUNGLE • RAIN',
        story: 'A wild Bengal tiger leaps into the clearing. Teeth bared.',
        mission: 'Capture the tiger alive.',
        choices: [
          { text: '⚔️ Tackle the tiger barehanded.', effect: { health: -10, reputation: 12, courage: 15 } },
          { text: '🏃 Swing from banyan vine with a net.', effect: { health: 0, intelligence: 10, risk: -10 } },
          { text: '🧠 Stare down the beast into silence.', effect: { health: 0, courage: 10, trust: 8 } }
        ]
      },
      {
        act: 2,
        locationTime: 'BURNING BRIDGE • NOON',
        story: 'A train explodes on the bridge. A child is trapped over raging waters.',
        mission: 'Rescue the child alongside Ram.',
        choices: [
          { text: '🏃 Swing on the cable through flames.', effect: { health: -5, reputation: 12, courage: 12 } },
          { text: '⚔️ Hold the heavy iron rope against the current.', effect: { health: -5, trust: 15, courage: 10 } },
          { text: '🧠 Catch the child in mid-air with the flag.', effect: { health: 0, intelligence: 10, reputation: 10 } }
        ]
      },
      {
        act: 3,
        locationTime: 'VICEROY PALACE • NIGHT',
        story: 'You crash a truck through palace gates. Wild beasts leap out.',
        mission: 'Storm the palace and rescue Malli.',
        choices: [
          { text: '⚔️ Leap into guards with a burning torch.', effect: { health: -10, reputation: 15, courage: 15 } },
          { text: '🏃 Break Malli\'s cell with an iron rod.', effect: { health: 0, trust: 15, risk: -5 } },
          { text: '🔥 Direct the wild leopards into the garrison.', effect: { health: 0, intelligence: 12, risk: 10 } }
        ]
      },
      {
        act: 4,
        locationTime: 'PUBLIC SQUARE • NOON',
        story: 'Tied to iron chains. The whip cuts your back. Scott demands you kneel.',
        mission: 'Stand tall and refuse to bow.',
        choices: [
          { text: '🎵 Sing the roaring tribal freedom song.', effect: { health: -10, trust: 25, reputation: 20 } },
          { text: '⚔️ Snap the iron shackles with raw strength.', effect: { health: -5, courage: 20, reputation: 15 } },
          { text: '🧠 Look Scott dead in the eye without blinking.', effect: { health: 0, courage: 15, reputation: 12 } }
        ]
      },
      {
        act: 5,
        locationTime: 'ARMY BARRACKS • CLIMAX',
        story: 'You carry wounded Ram on your shoulders. Cavalry charge.',
        mission: 'Dismantle the British garrison.',
        choices: [
          { text: '⚔️ Spin with club while Ram fires rifles.', effect: { health: -10, reputation: 25, courage: 20 } },
          { text: '🔥 Kick dynamite into the weapon depot.', effect: { health: -5, intelligence: 15, reputation: 15 } },
          { text: '👑 Lead the united freedom fighters.', effect: { health: 0, trust: 25, reputation: 25 } }
        ]
      }
    ],
    endings: [
      { id: 'brothers', title: 'Brothers of Revolution', type: 'Historic Brotherhood', desc: 'Bheem and Ram fight as one. Malli is saved and freedom begins.' },
      { id: 'guardian', title: 'Guardian of the Forest', type: 'Forest Protector', desc: 'Returning Malli safely, you protect the Gond homeland forever.' },
      { id: 'tiger', title: 'The Tiger Champion', type: 'Living Myth', desc: 'Barehanded feats of strength dismantle the colonial garrison.' },
      { id: 'architect', title: 'The Architect of Freedom', type: 'Master Tactician', desc: 'Seizing the Governor\'s arsenal, you arm fighters across India.' },
      { id: 'anthem', title: 'The Immortal Roar', type: 'Eternal Anthem', desc: 'Your freedom anthem echoes in millions of hearts.' }
    ]
  },

  {
    id: 'Salaar',
    name: 'Salaar',
    hero: 'Deva',
    heroTitle: 'The Living Monster of Khansaar',
    genre: 'Action / Dark Thriller',
    difficulty: '★★★★★',
    difficultyRating: 5,
    playTime: '12 - 18 Mins',
    endingsCount: 5,
    trailerId: '4GPvYMKtrtI',
    theme: 'salaar-theme',
    tagline: 'When blood calls, kings bow.',
    oneLiner: 'Break the ceasefire. Protect your brother. Conquer Khansaar.',
    shortDesc: 'Awaken your fury to defend Varadha Raja Mannar and crush the rival armies in Khansaar.',
    characters: [
      { name: 'Deva (Salaar)', role: 'Protagonist • Feared Warrior' },
      { name: 'Varadha Raja Mannar', role: 'Brother & Mannar Prince' },
      { name: 'Aadhya', role: 'Protected Witness' }
    ],
    scenes: [
      {
        act: 1,
        locationTime: 'COAL YARD • NOON',
        story: 'Fifty hitmen arrive to kidnap Aadhya. Your mother gives a slight nod.',
        mission: 'End the ceasefire and crush the invaders.',
        choices: [
          { text: '⚔️ Crush the lead gunman against the crane.', effect: { health: 0, reputation: 12, courage: 12 } },
          { text: '🏃 Swing the crane hook into the jeeps.', effect: { health: 0, intelligence: 10, risk: -10 } },
          { text: '🛡️ Shelter Aadhya safely behind your back.', effect: { health: 0, trust: 15, risk: -5 } }
        ]
      },
      {
        act: 2,
        locationTime: 'KHANSAAR GATES • DUSK',
        story: 'You and Varadha drive through massive steel gates into Khansaar.',
        mission: 'Breach the fortified iron gates.',
        choices: [
          { text: '⚔️ Tear the steel entry barrier apart.', effect: { health: -5, reputation: 12, courage: 10 } },
          { text: '🧠 Drive the armored truck through the gate.', effect: { health: 0, intelligence: 10, risk: -5 } },
          { text: '👑 Stand with Varadha and draw blades.', effect: { health: 0, trust: 15, reputation: 10 } }
        ]
      },
      {
        act: 3,
        locationTime: 'SACRED ALTAR • MIDNIGHT',
        story: 'Cruel prince Narang abuses a captive. Red dye powder explodes in air.',
        mission: 'Punish Narang at the sacred shrine.',
        choices: [
          { text: '⚔️ Slash through bodyguards with curved scythes.', effect: { health: -10, reputation: 15, courage: 15 } },
          { text: '🔥 Grab Narang by the throat at the shrine.', effect: { health: 0, reputation: 12, courage: 12 } },
          { text: '🛡️ Break the chains and free the captives.', effect: { health: 0, trust: 15, risk: -10 } }
        ]
      },
      {
        act: 4,
        locationTime: 'COUNCIL HALL • DAY',
        story: 'Warlords pull out silenced pistols to execute Varadha.',
        mission: 'Silence the traitorous warlords.',
        choices: [
          { text: '⚔️ Slam a massive blade into the table.', effect: { health: 0, reputation: 20, courage: 15 } },
          { text: '🧠 Disarm three rival warlords at once.', effect: { health: -5, intelligence: 15, risk: -10 } },
          { text: '👑 Slam the Mannar royal seal onto the desk.', effect: { health: 0, trust: 20, reputation: 15 } }
        ]
      },
      {
        act: 5,
        locationTime: 'BLACK VALLEY • CLIMAX',
        story: 'Foreign mercenary tanks swarm the valley to destroy Varadha.',
        mission: 'Annihilate the mercenary army.',
        choices: [
          { text: '⚔️ Tear through the tank turret barehanded.', effect: { health: -15, reputation: 25, courage: 20 } },
          { text: '🔥 Fire heavy machine guns in slow motion.', effect: { health: -5, intelligence: 15, reputation: 20 } },
          { text: '👑 Place the golden crown upon Varadha\'s head.', effect: { health: 0, trust: 25, reputation: 25 } }
        ]
      }
    ],
    endings: [
      { id: 'sovereign', title: 'The Sovereign of Khansaar', type: 'Guardian Overlord', desc: 'You place the crown upon Varadha. Khansaar bows to your blade.' },
      { id: 'oathkeeper', title: 'The Silent Oathkeeper', type: 'Sacred Honor', desc: 'Fulfilling your childhood vow, you return in peace to your mother.' },
      { id: 'shadow', title: 'Shadow of the Ceasefire', type: 'Tactical Master', desc: 'You unmask the coup before a shot is fired, securing the realm.' },
      { id: 'warlord', title: 'The Blood Warlord', type: 'Wrath Incarnate', desc: 'You turn the mountains into a monument of your wrath.' },
      { id: 'legend', title: 'The Reluctant Legend', type: 'Mythic Silhouette', desc: 'You walk away into the midnight rain as an immortal legend.' }
    ]
  }
]
