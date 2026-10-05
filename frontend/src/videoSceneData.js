// Centralized Video Scene and Branching Configuration for RE:ACT Video-First Game
export const VIDEO_SCENE_REGISTRY = {
  // ==========================================
  // KGF CHAPTERS
  // ==========================================
  KGF_S01: {
    id: 'KGF_S01',
    movieCode: 'KGF',
    act: 1,
    sceneNumber: 1,
    title: 'ACT 1: THE NARACHI ARRIVAL & WHIP SHOWDOWN',
    description: 'You enter Narachi disguised as a slave. An overseer raises an iron-barbed whip above a fallen blind elder.',
    videoUrl: '/videos/kgf/scene-01.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=1400&auto=format&fit=crop&q=80',
    duration: 22.0,
    decisionPoint: 16.5,
    mission: 'Protect the fallen elder and assert undisputed dominance in Narachi.',
    location: 'Narachi Death Camp • Main Shovel Quarry',
    heroDialogue: 'Violence, violence, violence... I don\'t like it. I avoid! But violence likes me!',
    status: 'COMING_SOON',
    choices: [
      {
        id: 'kgf_s01_fight',
        label: 'FIGHT',
        text: 'Step between the whip and catch the lash barehanded.',
        actionType: 'FIGHT',
        riskLevel: 'HIGH',
        nextSceneId: 'KGF_S02_FIGHT',
        consequenceSummary: 'You caught the barbed iron whip barehanded. 200 slaves stared in stunned silence.'
      },
      {
        id: 'kgf_s01_stunt',
        label: 'STUNT',
        text: 'Kick the heavy iron ore cart straight into the watchtower.',
        actionType: 'STUNT',
        riskLevel: 'MEDIUM',
        nextSceneId: 'KGF_S02_STUNT',
        consequenceSummary: 'The heavy iron cart shattered the watchtower timbers, scattering armed guards.'
      },
      {
        id: 'kgf_s01_rally',
        label: 'RALLY',
        text: 'Whisper courage to the silent workers and ignite the spark of rebellion.',
        actionType: 'RALLY',
        riskLevel: 'LOW',
        nextSceneId: 'KGF_S02_RALLY',
        consequenceSummary: 'You hoisted the elder upright. A tremor of defiance ran through the silent crowd.'
      }
    ]
  },

  KGF_S02_FIGHT: {
    id: 'KGF_S02_FIGHT',
    movieCode: 'KGF',
    act: 2,
    sceneNumber: 1,
    title: 'ACT 2: OVERSEERS TEA STALL STANDOFF',
    description: 'You sit calmly at the guards\' private tea stall. Fifteen armed overseers encircle you with crowbars.',
    videoUrl: '/videos/kgf/scene-02-fight.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1400&auto=format&fit=crop&q=80',
    duration: 20.0,
    decisionPoint: 14.8,
    mission: 'Defeat the 15 overseers without dropping your glass of hot tea.',
    location: 'Narachi Outpost • Overseers Tea Stall',
    heroDialogue: 'If you think you are bad, I am your dad!',
    status: 'COMING_SOON',
    choices: [
      {
        id: 'kgf_s02_strike',
        label: 'FIGHT',
        text: 'Deliver a bone-crushing kick to the lead overseer into the furnace.',
        actionType: 'FIGHT',
        riskLevel: 'HIGH',
        nextSceneId: 'KGF_S03_FORGE',
        consequenceSummary: 'Your boots slammed the overseer through the furnace wall in slow-motion.'
      },
      {
        id: 'kgf_s02_sip',
        label: 'ATTITUDE',
        text: 'Sip hot tea slowly and stare down their trembling weapons.',
        actionType: 'ATTITUDE',
        riskLevel: 'LOW',
        nextSceneId: 'KGF_S03_FORGE',
        consequenceSummary: 'Your cold gaze made the frontline guards drop their crowbars in fear.'
      },
      {
        id: 'kgf_s02_spin',
        label: 'STUNT',
        text: 'Spin the iron shovel whirlwind, disarming four guards at once.',
        actionType: 'STUNT',
        riskLevel: 'MEDIUM',
        nextSceneId: 'KGF_S03_FORGE',
        consequenceSummary: 'You swept the iron shovel 360 degrees, disarming four guards in one blow.'
      }
    ]
  },

  KGF_S02_STUNT: {
    id: 'KGF_S02_STUNT',
    movieCode: 'KGF',
    act: 2,
    sceneNumber: 2,
    title: 'ACT 2: CHAOS AT THE BROKEN OUTPOST',
    description: 'Guards rush from all barracks. You navigate the dusty wreckage of the collapsed tower.',
    videoUrl: '/videos/kgf/scene-02-stunt.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1400&auto=format&fit=crop&q=80',
    duration: 19.0,
    decisionPoint: 14.0,
    mission: 'Incite chaos to steal master keys to the weapon barracks.',
    location: 'Narachi Perimeter • Broken Watchtower',
    heroDialogue: 'A lion doesn\'t need an invitation to enter his own forest.',
    status: 'COMING_SOON',
    choices: [
      {
        id: 'kgf_s02_keys',
        label: 'STEALTH',
        text: 'Snatch the armory keys from the captain\'s belt in the smoke.',
        actionType: 'STEALTH',
        riskLevel: 'MEDIUM',
        nextSceneId: 'KGF_S03_FORGE',
        consequenceSummary: 'You slipped through the smoke and secured the iron master keys.'
      },
      {
        id: 'kgf_s02_overrun',
        label: 'RALLY',
        text: 'Signal the quarry workers to swarm the fallen outpost.',
        actionType: 'RALLY',
        riskLevel: 'HIGH',
        nextSceneId: 'KGF_S03_FORGE',
        consequenceSummary: 'Workers charged forward with shovels, claiming the outpost.'
      }
    ]
  },

  KGF_S02_RALLY: {
    id: 'KGF_S02_RALLY',
    movieCode: 'KGF',
    act: 2,
    sceneNumber: 3,
    title: 'ACT 2: UNDERGROUND ALLIANCE IN THE QUARRY',
    description: 'You meet the leaders of the 20,000 enslaved workers in the deep mine shafts.',
    videoUrl: '/videos/kgf/scene-02-rally.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1400&auto=format&fit=crop&q=80',
    duration: 21.0,
    decisionPoint: 15.0,
    mission: 'Unite the workers and prepare for midnight weapon production.',
    location: 'Deep Mine Shaft 04 • Underworld Tunnel',
    heroDialogue: 'Guns don\'t shoot people. Courage shoots people!',
    status: 'COMING_SOON',
    choices: [
      {
        id: 'kgf_s02_inspire',
        label: 'RALLY',
        text: 'Swear an oath to free every mother and child before tomorrow\'s sun.',
        actionType: 'RALLY',
        riskLevel: 'LOW',
        nextSceneId: 'KGF_S03_FORGE',
        consequenceSummary: '5,000 workers raised their calloused hands, pledging their loyalty.'
      },
      {
        id: 'kgf_s02_sabotage',
        label: 'PLAN',
        text: 'Map the underground dynamite stores and fortress tunnels.',
        actionType: 'PLAN',
        riskLevel: 'LOW',
        nextSceneId: 'KGF_S03_FORGE',
        consequenceSummary: 'You acquired a complete schematic of Garuda\'s secret routes.'
      }
    ]
  },

  KGF_S03_FORGE: {
    id: 'KGF_S03_FORGE',
    movieCode: 'KGF',
    act: 3,
    sceneNumber: 1,
    title: 'ACT 3: SLEDGEHAMMER FORGE IN WORKER BARRACKS',
    description: 'In pitch darkness, you slam a giant sledgehammer against the anvil to forge iron crowbars into weapons.',
    videoUrl: '/videos/kgf/scene-03.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=1400&auto=format&fit=crop&q=80',
    duration: 23.0,
    decisionPoint: 17.0,
    mission: 'Arm the workers and prepare the infiltration into Garuda\'s Citadel.',
    location: 'Narachi Worker Barracks • Midnight Forge',
    heroDialogue: 'Fear was your master yesterday. Today, your master is courage!',
    status: 'COMING_SOON',
    choices: [
      {
        id: 'kgf_s03_chain',
        label: 'STUNT',
        text: 'Scale the 80-foot stone fortress wall on iron chains in the rain.',
        actionType: 'STUNT',
        riskLevel: 'HIGH',
        nextSceneId: 'KGF_S04_CITADEL',
        consequenceSummary: 'You gripped the freezing iron chain and leaped into the midnight pouring rain.'
      },
      {
        id: 'kgf_s03_stealth',
        label: 'STEALTH',
        text: 'Cut high-voltage camp power cables to cloak the fortress in darkness.',
        actionType: 'STEALTH',
        riskLevel: 'LOW',
        nextSceneId: 'KGF_S04_CITADEL',
        consequenceSummary: 'Sparks erupted across Narachi as every searchlight died in complete blackness.'
      },
      {
        id: 'kgf_s03_blast',
        label: 'PLAN',
        text: 'Rig dynamite at the main guard depot to draw Garuda\'s sentinels away.',
        actionType: 'PLAN',
        riskLevel: 'HIGH',
        nextSceneId: 'KGF_S04_CITADEL',
        consequenceSummary: 'A thunderous explosion rocked the eastern quarry, clearing your entry route.'
      }
    ]
  },

  KGF_S04_CITADEL: {
    id: 'KGF_S04_CITADEL',
    movieCode: 'KGF',
    act: 4,
    sceneNumber: 1,
    title: 'ACT 4: CITADEL INFILTRATION AT MIDNIGHT',
    description: 'Garuda\'s elite guards patrol the blood-stained courtyard. You reach the doors of the inner Maa Kali temple altar.',
    videoUrl: '/videos/kgf/scene-04.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1400&auto=format&fit=crop&q=80',
    duration: 22.0,
    decisionPoint: 16.0,
    mission: 'Breach the inner temple before Garuda\'s human sacrifice ceremony begins.',
    location: 'Garuda\'s Citadel • Temple Courtyard',
    heroDialogue: 'Tell Garuda that death has walked inside his house.',
    status: 'COMING_SOON',
    choices: [
      {
        id: 'kgf_s04_breach',
        label: 'FIGHT',
        text: 'Kick open the massive teakwood temple doors and charge the altar.',
        actionType: 'FIGHT',
        riskLevel: 'HIGH',
        nextSceneId: 'KGF_S05_CLIMAX',
        consequenceSummary: 'The heavy iron-studded doors crashed off their hinges in thunderous slow-motion.'
      },
      {
        id: 'kgf_s04_shadow',
        label: 'STEALTH',
        text: 'Execute Garuda\'s personal guard from the temple rooftop rafters.',
        actionType: 'STEALTH',
        riskLevel: 'MEDIUM',
        nextSceneId: 'KGF_S05_CLIMAX',
        consequenceSummary: 'You landed silently behind the high altar, blade coated in sacred red dye.'
      }
    ]
  },

  KGF_S05_CLIMAX: {
    id: 'KGF_S05_CLIMAX',
    movieCode: 'KGF',
    act: 5,
    sceneNumber: 1,
    title: 'ACT 5: GRAND CLIMAX: KALI TEMPLE SACRIFICE SHOWDOWN',
    description: 'Garuda stands at the holy sacrificial stone with his broad curved sword. 20,000 slaves watch in breathless silence.',
    videoUrl: '/videos/kgf/scene-05.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1400&auto=format&fit=crop&q=80',
    duration: 28.0,
    decisionPoint: 20.0,
    mission: 'Strike down tyrant Garuda and fulfill your mother\'s golden promise!',
    location: 'Maa Kali Sacred Temple • Altar of Narachi',
    heroDialogue: 'Salaam Rocky Bhai! The world belongs to the one who takes it!',
    status: 'COMING_SOON',
    choices: [
      {
        id: 'kgf_climax_decapitate',
        label: 'FIGHT',
        text: 'Parry Garuda\'s curved sword and deliver the fatal strike at the altar.',
        actionType: 'FIGHT',
        riskLevel: 'EXTREME',
        nextSceneId: 'KGF_END_SULTAN',
        consequenceSummary: 'Garuda\'s sword fell from his grip. A single lightning strike severed the tyrant\'s head.'
      },
      {
        id: 'kgf_climax_disarm',
        label: 'PLAN',
        text: 'Disarm Garuda using his own chains and expose his cowardice to his men.',
        actionType: 'PLAN',
        riskLevel: 'HIGH',
        nextSceneId: 'KGF_END_SHADOW',
        consequenceSummary: 'Garuda dropped to his knees in humiliation before his own guards.'
      },
      {
        id: 'kgf_climax_roar',
        label: 'RALLY',
        text: 'Raise the crimson cloth and roar \'SALAAM ROCKY BHAI!\' with the 20,000 workers.',
        actionType: 'RALLY',
        riskLevel: 'MEDIUM',
        nextSceneId: 'KGF_END_LIBERATOR',
        consequenceSummary: '20,000 freed slaves echoed the war cry that shattered Narachi\'s curse forever.'
      }
    ]
  },

  // ==========================================
  // BAAHUBALI CHAPTER 1
  // ==========================================
  BAAHUBALI_S01: {
    id: 'BAAHUBALI_S01',
    movieCode: 'BAAHUBALI',
    act: 1,
    sceneNumber: 1,
    title: 'ACT 1: THE AMBUSH AT KUNTALA GATES',
    description: '200 Pindari cavalry attack with flaming arrows. Princess Devasena draws her bow beside you.',
    videoUrl: '/videos/baahubali/scene-01.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=1400&auto=format&fit=crop&q=80',
    duration: 24.0,
    decisionPoint: 17.5,
    mission: 'Defend Kuntala Kingdom alongside Princess Devasena.',
    location: 'Kuntala Courtyard • Burning Wooden Bridges',
    heroDialogue: 'Mahishmati is my breath! The kingdom will never fall while Baahubali draws breath!',
    status: 'COMING_SOON',
    choices: [
      {
        id: 'bhu_s01_arrows',
        label: 'FIGHT',
        text: 'Loose triple burning arrows simultaneously into the cavalry vanguard.',
        actionType: 'FIGHT',
        riskLevel: 'HIGH',
        nextSceneId: 'BAAHUBALI_S02',
        consequenceSummary: 'Three flaming arrows pinned the bandit warlord to his chariot.'
      },
      {
        id: 'bhu_s01_flood',
        label: 'STUNT',
        text: 'Sever the giant waterwheel rope with a single slash to flood the road.',
        actionType: 'STUNT',
        riskLevel: 'LOW',
        nextSceneId: 'BAAHUBALI_S02',
        consequenceSummary: 'A wall of water crashed across the bridge, sweeping the cavalry away.'
      },
      {
        id: 'bhu_s01_phalanx',
        label: 'RALLY',
        text: 'Form an impenetrable golden shield wall alongside Princess Devasena.',
        actionType: 'RALLY',
        riskLevel: 'LOW',
        nextSceneId: 'BAAHUBALI_S02',
        consequenceSummary: 'Devasena smiled as your shields deflected a hail of 50 flaming arrows.'
      }
    ]
  },

  // ==========================================
  // PUSHPA CHAPTER 1
  // ==========================================
  PUSHPA_S01: {
    id: 'PUSHPA_S01',
    movieCode: 'PUSHPA',
    act: 1,
    sceneNumber: 1,
    title: 'ACT 1: THE SESHACHALAM FOREST POLICE CONVOY',
    description: 'DSP Govindappa\'s armed police convoy surrounds your loaded timber lorry in the midnight mist.',
    videoUrl: '/videos/pushpa/scene-01.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1511497584788-87676104235f?w=1400&auto=format&fit=crop&q=80',
    duration: 22.0,
    decisionPoint: 16.0,
    mission: 'Outsmart DSP Govindappa and safeguard the red sandalwood lorry.',
    location: 'Deep Seshachalam Forest • Mist Valley',
    heroDialogue: 'Pushpa... Pushpa Raj. Thaggedhe le! (I will never bow down!)',
    status: 'COMING_SOON',
    choices: [
      {
        id: 'psh_s01_axe',
        label: 'FIGHT',
        text: 'Hurl your steel axe into the police jeep tire and overturn their convoy.',
        actionType: 'FIGHT',
        riskLevel: 'HIGH',
        nextSceneId: 'PUSHPA_S02',
        consequenceSummary: 'The lead police jeep flipped into the ravine as workers cheered in the mist.'
      },
      {
        id: 'psh_s01_river',
        label: 'STUNT',
        text: 'Cut lorry tie-ropes to dump 3 tons of sandalwood logs into the rushing river.',
        actionType: 'STUNT',
        riskLevel: 'MEDIUM',
        nextSceneId: 'PUSHPA_S02',
        consequenceSummary: 'The logs vanished downstream under water; Govindappa found an empty lorry.'
      },
      {
        id: 'psh_s01_swag',
        label: 'ATTITUDE',
        text: 'Slide your right shoulder, light a matchstick, and dare them to shoot.',
        actionType: 'ATTITUDE',
        riskLevel: 'LOW',
        nextSceneId: 'PUSHPA_S02',
        consequenceSummary: 'Your icy stare froze Govindappa\'s trigger finger in total hesitation.'
      }
    ]
  },

  // ==========================================
  // RRR CHAPTER 1
  // ==========================================
  RRR_S01: {
    id: 'RRR_S01',
    movieCode: 'RRR',
    act: 1,
    sceneNumber: 1,
    title: 'ACT 1: THE TIGER\'S ROAR IN THE MIST',
    description: 'A ferocious 300kg wild Bengal tiger leaps into the torrential rain clearing. You face the beast barehanded.',
    videoUrl: '/videos/rrr/scene-01.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1400&auto=format&fit=crop&q=80',
    duration: 23.0,
    decisionPoint: 17.0,
    mission: 'Capture the wild tiger barehanded to prepare the rescue raid for Malli.',
    location: 'Deep Jungle Outside Delhi • Torrential Rain',
    heroDialogue: 'The roar of this forest will never be silenced by the British Empire!',
    status: 'COMING_SOON',
    choices: [
      {
        id: 'rrr_s01_tackle',
        label: 'FIGHT',
        text: 'Charge barehanded and tackle the roaring tiger in the muddy clearing.',
        actionType: 'FIGHT',
        riskLevel: 'HIGH',
        nextSceneId: 'RRR_S02',
        consequenceSummary: 'You locked your arms around the great beast, subduing its roar with superhuman power.'
      },
      {
        id: 'rrr_s01_net',
        label: 'STUNT',
        text: 'Swing from the giant banyan vine to trap the tiger inside the heavy rope net.',
        actionType: 'STUNT',
        riskLevel: 'MEDIUM',
        nextSceneId: 'RRR_S02',
        consequenceSummary: 'You descended like lightning, securing the tiger safely for the Delhi assault.'
      }
    ]
  },

  // ==========================================
  // SALAAR CHAPTER 1
  // ==========================================
  SALAAR_S01: {
    id: 'SALAAR_S01',
    movieCode: 'SALAAR',
    act: 1,
    sceneNumber: 1,
    title: 'ACT 1: THE COAL YARD CEASEFIRE BREACH',
    description: 'Fifty heavily armed Khansaar hitmen surround the coal yard to kidnap Aadhya. Your mother gives you the nod that ends the ceasefire.',
    videoUrl: '/videos/salaar/scene-01.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=1400&auto=format&fit=crop&q=80',
    duration: 23.0,
    decisionPoint: 17.0,
    mission: 'Awaken the monster inside you and protect Aadhya.',
    location: 'Tinsukia Coal Yard • Black Soot Railyard',
    heroDialogue: 'Do not let my hands touch the metal. Because if they do, no one leaves alive.',
    status: 'COMING_SOON',
    choices: [
      {
        id: 'slr_s01_pillar',
        label: 'FIGHT',
        text: 'Step through the coal dust and crush the lead assassin against the iron crane pillar.',
        actionType: 'FIGHT',
        riskLevel: 'HIGH',
        nextSceneId: 'SALAAR_S02',
        consequenceSummary: 'A single barehanded strike dented the industrial steel pillar, silencing the gang.'
      },
      {
        id: 'slr_s01_hook',
        label: 'STUNT',
        text: 'Grab the heavy crane hook chain and swing it through their armored jeeps.',
        actionType: 'STUNT',
        riskLevel: 'MEDIUM',
        nextSceneId: 'SALAAR_S02',
        consequenceSummary: 'The 2-ton industrial hook sheared through the armored jeeps like tin.'
      }
    ]
  }
}

export function getClientSceneFallback(sceneId, movieCode) {
  if (sceneId && VIDEO_SCENE_REGISTRY[sceneId]) {
    return VIDEO_SCENE_REGISTRY[sceneId]
  }
  const code = (movieCode || 'KGF').toUpperCase()
  const key = `${code}_S01`
  return VIDEO_SCENE_REGISTRY[key] || VIDEO_SCENE_REGISTRY['KGF_S01']
}
