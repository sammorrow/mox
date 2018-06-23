module.exports ={ 
  questCards: [
  {name: 'Stalwart', description: 'Attack a Goblin Tribe with a Population of 3 or greater.', reward: 5},
  {name: 'Intrepid', description: 'When 10 or more tiles have been revealed (excluding ladder).', reward: 3},
  {name: 'Daring', description: 'Attack a Goblin Tribe with a Monster, or successfully attack the dragon.', reward: 4},
  {name: 'Fearless', description: 'Reveal a Dark tile with a Goblin Tribe on it, then attack the Tribe on the same encounter.', reward: 4},
  {name: 'Cunning', description: 'Collect a Dragon Gem.', reward: 3},
  {name: 'Bedecked', description: 'When you have two face-up treasure cards.', reward: 4},
  {name: 'Adventurous', description: 'Face 3 encounters, each on a different space, during one turn.', reward: 6},
  {name: 'Swift', description: 'Move 7 or more different spaces during one turn.', reward: 4},
  {name: 'Eagle-Eyed', description: 'Shoot another player with the Bow or Enchanted Bow.', reward: 3},
  {name: 'Persistent', description: 'When 3 Crystal tokens have been smashed.', reward: 4}
],
warCards: [
  {
    name: "Thirst",
    description: "We're starvinghungry! When's bellyfull time?",
    fangs: 3,
    bones: 2,
    eye: 1,
    monster: 1,
    secret: 0,
    rage: 0
  },
  {
    name: "Spite",
    description: "Let's make some troublefights.",
    fangs: 2,
    bones: 1,
    eye: 2,
    monster: 0,
    secret: 1,
    rage: 0
  },
  {
    name: "Consumption",
    description: "Onwardly, to the glorious afternap!",
    fangs: 1,
    bones: 3,
    eye: 2,
    monster: 1,
    secret: 0,
    rage: 0
  },
  {
    name: "Desolation",
    description: "Passawordalong - we're fighthunting fresh knight!",
    fangs: 1,
    bones: 2,
    eye: 2,
    monster: 1,
    secret: 1,
    rage: 0
  },
  {
    name: "Waste",
    description: "Here we come, quickish and scarylike",
    fangs: 2,
    bones: 1,
    eye: 3,
    monster: 0,
    secret: 1,
    rage: 0
  },
  {
    name: "Ruin",
    description: "Hurryfast, let's go-go-go- huntfighting!",
    fangs: 2,
    bones: 2,
    eye: 1,
    monster: 1,
    secret: 0,
    rage: 0
  },
  {
    name: "Hate",
    description: "No, YOU lookalike a leaf-eating elf-face, you elfing ELF-BABY!",
    fangs: 2,
    bones: 2,
    eye: 2,
    monster: 0,
    secret: 0,
    rage: 0
  },
  {
    name: "Fear",
    description: "What's that sound? You go tiptoe down the darkscary tunnel and take a look alonewise.",
    fangs: 1,
    bones: 1,
    eye: 1,
    monster: 1,
    secret: 2,
    rage: 0
  },
  {
    name: "Desperation",
    description: "These tunnelholes are ours - only crazyfools come here.",
    fangs: 0,
    bones: 0,
    eye: 0,
    monster: 3,
    secret: 3,
    rage: 1
  },
  {
    name: "Pain",
    description: "Oh, for a bowl of lizard soup like great-half-step-gobmommy used to make.",
    fangs: 1,
    bones: 1,
    eye: 1,
    monster: 0,
    secret: 0,
    rage: 1
  },
],
monsterCards: [
  {
    name: "Pet Frog",
    description: "Joinfollow our tribe! We got a mascot!",
    str: 0,
    text: "When the Population of this tribe reaches 4, ignore any further Goblin discs that would be added to it. Also, malaise does not decrease this Tribe's strength.",
    ambush: {
      str: 2,
      text: ""
    }
  },
  {
    name: "Ogre",
    str: 1,
    description: "CRUSHING TIME?",
    text: "This tribe gets +1 Strength.",
    ambush: {
      str: 4,
      text: "You must move to an adjacent, unoccupied non-Dark spacce. Then, place the Ogre's Monster token on the space which caused the ambush, with this card nearby. You must attack and defeat the Ogre to enter the space."
    }
  },
  {
    name: "Troll",
    str: 1,
    description: "Who's that clank-clanking over my bridge?",
    text: "This tribe gets +1 Strength.",
    ambush: {
      str: 4,
      text: "Place the Canyon tile if it is not already in play (even if you are not using Terrain tiles), then place the Troll's Monster token on the bridge space, with this card nearby. You must fight and defeat the Troll to cross."
    }
  },
  {
    name: "Golem",
    str: 0,
    description: "...I...OB-EY...",
    text: "This tribe can move through walls.",
    ambush: {
      str: 3,
      text: "You must move to an adjacent, unoccupied non-Dark spacce. Then, place the Ogre's Monster token on the space which caused the ambush, with this card nearby. You must attack and defeat the Ogre to enter the space."
    }
  },
  {
    name: "Gnome",
    str: 0,
    description: "Sneaky is as tricky does, grandpap always used to say!",
    text: "When this tribe uses the Reveal action, you may place its piece on a Dark tile with any Tribe's symbol. After this Tribe plunders a Treasure or Dragon Gem token, you may place its piece on an unoccupied Dark tile with any Tribe's symbol.",
    ambush: {
      str: 3,
      text: "Discard a treasure card at random."
    }
  },
  {
    name: "Wisp",
    str: 0,
    description: "...remember me... this way... can you see me ...? ... come on, I'll show you...",
    text: "When this Tribe is activated but before it takes an action, you may move the Knight up to 3 spaces in any direction. You may only do this if the Knight is visible to the Tribe, and only once per turn.",
    ambush: {
      str: 0,
      text: "Ignores Strength; always roll for hit."
    }
  },
  {
    name: "Bright Beetles",
    str: 0,
    description: "*clk-clk* *skitter*",
    text: "When this Tribe scatters, it loses one less Population. When this Tribe would lose Population by other effects, you may discard Bright Beetles to lose one less Population.",
    ambush: {
      str: 3,
      text: "Place Bright Beetles face-up near the Monster deck. Add +1 STR to the next Monster drawn, then discard Bright Beetles."
    }
  },
  {
    name: "Underworm",
    str: 1,
    description: "Walkstep without rhythm, and you won't attract the Waltz.",
    text: "When you activate this Tribe, during its movement it can move up to 2 tiles once in one diagonal direction, ignoring all tiles and walls in between",
    ambush: {
      str: 2,
      text: "Move diagonally to the nearest Dark tile (place one if needed) and then reveal the tile as part of the same Encounter."
    }
  },
  {
    name: "Blob",
    str: 0,
    description: "Gluuuuurrrggghh...",
    text: "If this Tribe uses the Attack action against the Knight, the Knight also loses 5 Grit.",
    ambush: {
      str: 3,
      text: "Lose 5 Grit."
    }
  },
  {
    name: "Flame Giant",
    str: 1,
    description: "Flee fire, foe fum... I smell the blood of a wandering knight.",
    text: "This Tribe gets +1 Strength.",
    ambush: {
      str: 4,
      text: "If your Strength is 3 or lower, you lose another Health."
    }
  }
],
secretCards: [
  {
    name: 'Secret Tunnels',
    text: 'During this turn, whenever you activate a revealed Tribe, you may immediately place its piece upon any unoccupied Dark tile. If you do so, you cannot move the Tribe by any other effect this turn, but it may still perform its action.',
    description: 'Come-along thisaway, sneakyline.'
  },
  {
    name: 'Cave-In',
    text: 'Collapse a number of tiles up to the Eye Tribe\'s population. You cannot collapse tiles containing other players or Crystal tokens.',
    description: 'Whoopsies.'
  },
  {
    name: 'Poison',
    text: 'The next time a tribe Attacks the Knight, she must discard an Action Point. If the Tribe\'s strength was greater than the Knight\'s by two or more, she discards 2 Action Points instead. She regains these Points upon entering the Entrance tile.',
    description: 'Oh ho ho ho, no, ollllld skinnaboys family recipe!'
  },
  {
    name: 'Leader',
    text: 'During overpopulation, you may prevent a Tribe from scattering',
    description: 'Followwchase me, my Tribegoblins! I\'ll lead us to dinnertime and the glorious afternap!'
  },
  {
    name: 'Goblin Ruby',
    text: 'On-going effect: -1 Perception. Once per turn, immediately after drawing War, Monster, or Secret cards, you may discard and redraw one card. Discard Goblin Ruby when any Tribe\'s population decreases to 0.',
    description: 'Ain\'t it the prettyshiniest thing you ever did see?'
  },
  {
    name: 'Blind Fury',
    text: 'Pick a Tribe. This turn, it may move through Lit tiles without losing Population.',
    description: 'What you all so scared of?'
  },
  {
    name: 'Fire Bomber',
    text: 'Pick a tribe. This turn, it gains +2 Strength and, after Attacking, decreases its population to 0.',
    description: 'I like it when hit goes tickticktickticktickBOOM.'
  },
  {
    name: 'Hex',
    text: 'Choose a player (X is the Eye tribe\'s population). Knight: Lose X Grit. Dragon: Discard X Power cards. Cave: Discard X Omen tokens. Thief: Decrease Stealth by X until the Goblins\' next turn.',
    description: 'Bubble, bubble, toil and... toil?'
  },
  {
    name: 'Trap',
    text: 'On-going effect (place this card face-up). When any Tribe is attacked, it gets +1 Strength and +1 Perception until the Attack resolves, then discard this card. When any Tribe is targeted by a Dragon power, you may discard this card to ignore that power.',
    description: 'Oh NO, the bigscary KNIGHT is coming! What are we poorwiddle helpless Gobbies gonna doooo?'
  },
  {
    name: 'Hiding Spots',
    text: 'A hidden Tribe may use the Attack action against the Knight if she is on or adjacent to an Ambush tile. During this action, do not apply any effects from Monster cards or other Secret cards.',
    description: 'Hushquiet! Time for some creepery.'
  }
]
}