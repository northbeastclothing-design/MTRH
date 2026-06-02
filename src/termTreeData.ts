export interface TranslationInfo {
  lang: string;
  original: string;
  translit: string;
  meaning: string;
}

export interface TermNode {
  id: string;
  name: string;
  description: string;
  parentId?: string;
  layer?: string;       // Matches keys in LAYER_CONFIG
  timelineId?: string;  // Matches ids in TIMELINE_ITEMS
  mapFeatureId?: string;// Optional specific map feature ID if available
  translations?: TranslationInfo[];
  relatedIds?: string[]; // Cross-linked related terms
  bibleVerses?: string[]; // Optional scripture quotes
}

export const TERM_TREE_DATA: TermNode[] = [
  // ==========================================
  // ROOT LEVEL CATEGORIES
  // ==========================================
  {
    id: 'biblical-enc',
    name: 'Biblical & Enochian Space',
    description: 'Ancient Hebrew history, watchmen, nephilim bloodlines, catastrophic events, and pre-flood texts.',
    relatedIds: ['ancient-texts', 'megaliths', 'underworld']
  },
  {
    id: 'ufos-anomalies',
    name: 'UFOs & Anomalies',
    description: 'Aerial phenomena, declassified files, crop circles, and physical anomalies associated with unexplained intelligence.',
    relatedIds: ['dumbs', 'google-blurred', 'ley-lines']
  },
  {
    id: 'cryptids-hauntings',
    name: 'Cryptids & Hauntings',
    description: 'Elusive biological creatures and spiritual/paranormal geographic hot spots.',
    relatedIds: ['underworld', 'national-parks', 'burial-mounds']
  },
  {
    id: 'ancient-sites',
    name: 'Ancient Sites & Megaliths',
    description: 'Physical ruins, burial mounds, rock art, and lost technologies left behind by prior civilizations.',
    relatedIds: ['biblical-enc', 'ley-lines', 'burial-mounds']
  },
  {
    id: 'earth-energies',
    name: 'Earth Energies & Operations',
    description: 'Geomagnetic ley lines, deep underground military facilities, and impact anomalies.',
    relatedIds: ['ufos-anomalies', 'dumbs', 'google-blurred']
  },

  // ==========================================
  // BRANCH 1: BIBLICAL & ENOCHIAN
  // ==========================================
  {
    id: 'biblical-figures',
    parentId: 'biblical-enc',
    name: 'Biblical Figures',
    description: 'Key historical patriarchs and historical personalities mentioned in the biblical record.',
    layer: 'Biblical Figures'
  },
  {
    id: 'adam-eve',
    parentId: 'biblical-figures',
    name: 'Adam & Eve',
    description: 'The first humans described in Genesis, whose lineage marks the starting point of biblical genealogy.',
    timelineId: 'adam',
    translations: [
      { lang: 'Hebrew', original: 'אָדָם', translit: 'Adam', meaning: 'Man / Red Soil' },
      { lang: 'Hebrew', original: 'חַוָּה', translit: 'Chavah', meaning: 'Living One / Mother of All Living' }
    ],
    relatedIds: ['great-flood', 'creation-evt'],
    bibleVerses: [
      "So God created mankind in his own image, in the image of God he created them; male and female he created them. — Genesis 1:27",
      "The Lord God took the man and put him in the Garden of Eden to work it and take care of it. — Genesis 2:15"
    ]
  },
  {
    id: 'enoch',
    parentId: 'biblical-figures',
    name: 'Enoch',
    description: 'The seventh patriarch from Adam. According to scripture, he walked with God and was translated directly to heaven. Associated with ancient astronomical secrets.',
    timelineId: 'enoch',
    translations: [
      { lang: 'Hebrew', original: 'חֲנוֹךְ', translit: 'Ḥanōkh', meaning: 'Dedicated / Initiated' }
    ],
    relatedIds: ['watchers', 'mt-hermon', 'book-of-enoch'],
    bibleVerses: [
      "Enoch walked faithfully with God; then he was no more, because God took him away. — Genesis 5:24",
      "By faith Enoch was taken from this life, so that he did not experience death... For before he was taken, he was commended as one who pleased God. — Hebrews 11:5"
    ]
  },
  {
    id: 'noah-fig',
    parentId: 'biblical-figures',
    name: 'Noah',
    description: 'Constructed the Ark that preserved human and animal life during the global deluge. Lived through the transition from the antediluvian to postdiluvian worlds.',
    timelineId: 'noah',
    translations: [
      { lang: 'Hebrew', original: 'נֹחַ', translit: 'Noach', meaning: 'Rest / Comfort' }
    ],
    relatedIds: ['great-flood', 'noahs-ark-find', 'gilgamesh-text'],
    bibleVerses: [
      "Noah was a righteous man, blameless among the people of his time, and he walked faithfully with God. — Genesis 6:9",
      "By faith Noah, when warned about things not yet seen, in holy fear built an ark to save his family... — Hebrews 11:7"
    ]
  },
  {
    id: 'abraham-fig',
    parentId: 'biblical-figures',
    name: 'Abraham',
    description: 'The patriarch called by God from Ur of the Chaldeans into Canaan. Patriarch of the Covenant.',
    timelineId: 'abraham',
    translations: [
      { lang: 'Hebrew', original: 'אַבְרָהָם', translit: 'Avraham', meaning: 'Father of Multitudes' }
    ],
    relatedIds: ['cave-machpelah', 'sodom-gomorrah-evt'],
    bibleVerses: [
      "The Lord had said to Abram, 'Go from your country, your people and your father's household to the land I will show you. I will make you into a great nation...' — Genesis 12:1-2"
    ]
  },
  {
    id: 'nimrod-fig',
    parentId: 'biblical-figures',
    name: 'Nimrod',
    description: 'A great-grandson of Noah. Described as a "mighty hunter before the Lord" and credited with establishing the first post-flood empire, including Babel.',
    timelineId: 'nimrod',
    translations: [
      { lang: 'Hebrew', original: 'נִמְרוֹד', translit: 'Nimrod', meaning: 'We Shall Rebel' }
    ],
    relatedIds: ['babel-evt', 'gilgamesh-text'],
    bibleVerses: [
      "Cush was the father of Nimrod, who became a mighty warrior on the earth. He was a mighty hunter before the Lord... The first centers of his kingdom were Babylon, Uruk, Akkad and Kalneh, in Shinar. — Genesis 10:8-10"
    ]
  },

  {
    id: 'nephilim-br',
    parentId: 'biblical-enc',
    name: 'Nephilim & Giants',
    description: 'The offspring of the Watchers (sons of God) and human women, described as "mighty men of old, men of renown."',
    layer: 'Nephilim',
    translations: [
      { lang: 'Hebrew', original: 'נְפִילִים', translit: 'Nefilim', meaning: 'Fallen Ones / Giants' },
      { lang: 'Greek', original: 'Γίγαντες', translit: 'Gigantes', meaning: 'Earth-born' }
    ],
    relatedIds: ['watchers', 'mounds', 'megaliths'],
    bibleVerses: [
      "The Nephilim were on the earth in those days—and also afterward—when the sons of God went to the daughters of humans and had children by them. They were the heroes of old, men of renown. — Genesis 6:4",
      "We saw the Nephilim there (the descendants of Anak come from the Nephilim). We seemed like grasshoppers in our own eyes, and we looked the same to them. — Numbers 13:33"
    ]
  },
  {
    id: 'watchers',
    parentId: 'nephilim-br',
    name: 'The Watchers',
    description: 'A class of angels (specifically described in the Book of Enoch) who descended to earth on Mount Hermon and taught humanity forbidden arts.',
    translations: [
      { lang: 'Hebrew', original: 'עִירִין', translit: 'Irin', meaning: 'Sentinels / Wakeful Ones' }
    ],
    relatedIds: ['enoch', 'mt-hermon', 'book-of-enoch'],
    bibleVerses: [
      "For if God did not spare angels when they sinned, but sent them to hell, putting them in chains of darkness to be held for judgment... — 2 Peter 2:4",
      "And the angels who did not keep their positions of authority but abandoned their proper dwelling—these he has kept in darkness, bound with everlasting chains for judgment on the great Day. — Jude 1:6"
    ]
  },
  {
    id: 'goliath',
    parentId: 'nephilim-br',
    name: 'Goliath of Gath',
    description: 'The champion giant of the Philistines, slain by David. He represented the remnants of the giant clans of Canaan.',
    translations: [
      { lang: 'Hebrew', original: 'גָּλְיָת', translit: 'Golyat', meaning: 'Exile / Conspicuous' }
    ],
    relatedIds: ['biblical-figures'],
    bibleVerses: [
      "A champion named Goliath, who was from Gath, came out of the Philistine camp. His height was six cubits and a span. — 1 Samuel 17:4"
    ]
  },
  {
    id: 'og-bashan',
    parentId: 'nephilim-br',
    name: 'Og of Bashan',
    description: 'An Amorite king described in Deuteronomy as the last of the Rephaim (giants). His iron bedstead was famously preserved for its immense size.',
    translations: [
      { lang: 'Hebrew', original: 'עוֹג', translit: 'Og', meaning: 'Gigantic / Round' }
    ],
    relatedIds: ['enochian-sites', 'megaliths'],
    bibleVerses: [
      "Og king of Bashan was the last of the Rephaim. His bed was decorated with iron and was more than nine cubits long and four cubits wide... — Deuteronomy 3:11"
    ]
  },

  {
    id: 'enochian-sites',
    parentId: 'biblical-enc',
    name: 'Enochian Sites & Peaks',
    description: 'Geographic markers closely associated with Enochian lore and the landing of the Watchers.',
    layer: 'Enochian Sites'
  },
  {
    id: 'mt-hermon',
    parentId: 'enochian-sites',
    name: 'Mount Hermon',
    description: 'The highest peak in the Levant. In Enochian texts, it is the exact location where the 200 Watchers swore mutual pacts to take wives and descend among men.',
    translations: [
      { lang: 'Hebrew', original: 'הַר חֶרְמוֹν', translit: 'Har Chermon', meaning: 'Sanctuary / Consecrated Peak' }
    ],
    relatedIds: ['watchers', 'ley-lines']
  },
  {
    id: 'cave-machpelah',
    parentId: 'enochian-sites',
    name: 'Cave of Machpelah',
    description: 'The burial site of Abraham, Sarah, Isaac, Rebekah, Jacob, and Leah. Rumored to hold tunnels leading deep into the Earth.',
    relatedIds: ['abraham-fig'],
    bibleVerses: [
      "So the field and the cave in it were deeded to Abraham by the Hittites as a burial place. — Genesis 23:20"
    ]
  },

  {
    id: 'biblical-events',
    parentId: 'biblical-enc',
    name: 'Biblical Events',
    description: 'Catastrophic events and cosmological milestones recorded in antiquity.',
    layer: 'Biblical Events'
  },
  {
    id: 'creation-evt',
    parentId: 'biblical-events',
    name: 'The Creation',
    description: 'The framing event of Genesis 1, marking the ordering of the cosmos.',
    timelineId: 'evt-creation',
    bibleVerses: [
      "In the beginning God created the heavens and the earth. — Genesis 1:1"
    ]
  },
  {
    id: 'great-flood',
    parentId: 'biblical-events',
    name: 'The Great Flood',
    description: 'A global deluge sent to wipe out the corruption of the pre-flood world, including the Nephilim. Paralleled across dozens of global cultural mythologies.',
    timelineId: 'evt-great-flood',
    translations: [
      { lang: 'Hebrew', original: 'מַבּוּל', translit: 'Mabbul', meaning: 'Deluge / Destruction' },
      { lang: 'Greek', original: 'Κατακλυσμός', translit: 'Kataklysmos', meaning: 'Inundation / Wash Down' }
    ],
    relatedIds: ['noah-fig', 'noahs-ark-find', 'gilgamesh-text', 'gobekli-tepe'],
    bibleVerses: [
      "Every living thing on the face of the earth was wiped out; people and animals and the creatures that move along the ground and the birds of the air were wiped from the earth. Only Noah was left, and those with him in the ark. — Genesis 7:23"
    ]
  },
  {
    id: 'babel-evt',
    parentId: 'biblical-events',
    name: 'Tower of Babel',
    description: 'A post-flood project led by Nimrod in the plains of Shinar to build a tower reaching into heaven, resulting in the confusion of tongues.',
    timelineId: 'evt-tower-babel',
    relatedIds: ['nimrod-fig', 'ancient-texts'],
    bibleVerses: [
      "Come, let us build ourselves a city, with a tower that reaches to the heavens, so that we may make a name for ourselves; otherwise we will be scattered over the face of the whole earth. — Genesis 11:4"
    ]
  },

  {
    id: 'biblical-finds',
    parentId: 'biblical-enc',
    name: 'Biblical Finds',
    description: 'Archaeological discoveries and artifacts reinforcing or validating biblical historical accounts.',
    layer: 'Biblical Finds'
  },
  {
    id: 'ark-covenant',
    parentId: 'biblical-finds',
    name: 'Ark of the Covenant',
    description: 'The sacred chest containing the tablets of the Law, Aaron\'s rod, and manna. Described as possessing immense electrical and spiritual power.',
    translations: [
      { lang: 'Hebrew', original: 'אֲרוֹן הַבְּרִית', translit: 'Aron HaBerit', meaning: 'Chest of the Covenant' }
    ],
    relatedIds: ['mt-hermon', 'ancient-sites'],
    bibleVerses: [
      "Have them make an ark of acacia wood—two and a half cubits long, a cubit and a half wide, and a cubit and a half high. Overlay it with pure gold, both inside and out... — Exodus 25:10-11"
    ]
  },
  {
    id: 'noahs-ark-find',
    parentId: 'biblical-finds',
    name: "Noah's Ark",
    description: 'The legendary vessel that survived the global deluge. Historically searched for in the Ararat mountain range.',
    relatedIds: ['noah-fig', 'great-flood'],
    bibleVerses: [
      "Make yourself an ark of gopher wood. Make rooms in the ark, and cover it inside and out with pitch. — Genesis 6:14"
    ]
  },

  // ==========================================
  // BRANCH 2: UFOS & ANOMALIES
  // ==========================================
  {
    id: 'ufo-sightings-br',
    parentId: 'ufos-anomalies',
    name: 'U.F.O. Sightings',
    description: 'Unidentified Flying Objects or Aerial Phenomena sightings that defy explanation.',
    layer: 'U.F.O. Sightings'
  },
  {
    id: 'roswell-incident',
    parentId: 'ufo-sightings-br',
    name: 'Roswell Crash (1947)',
    description: 'The famous crash of a mysterious object in Roswell, New Mexico, initially reported as a "flying disc" and later retracting to a weather balloon.',
    relatedIds: ['area-51', 'dumbs']
  },
  {
    id: 'foo-fighters',
    parentId: 'ufo-sightings-br',
    name: 'Foo Fighters (WWII)',
    description: 'Glowing metallic spheres and lights reported by Allied and Axis pilots during World War II, showing intelligent maneuvers and tracking aircraft.',
    relatedIds: ['ufos-anomalies']
  },
  {
    id: 'crop-circles-br',
    parentId: 'ufos-anomalies',
    name: 'Crop Circles',
    description: 'Complex geometrical patterns pressed into agricultural fields, exhibiting changes in crop nodes and magnetic anomalies.',
    layer: 'Crop Circles'
  },
  {
    id: 'chilbolton',
    parentId: 'crop-circles-br',
    name: 'Chilbolton Message',
    description: 'A crop circle pattern matching a response to the SETI Arecibo message, appearing near the Chilbolton radio telescope in 2001.',
    relatedIds: ['ufos-anomalies']
  },
  {
    id: 'julia-set',
    parentId: 'crop-circles-br',
    name: 'Julia Set (Stonehenge)',
    description: 'A massive fractal crop circle that appeared in broad daylight within a 45-minute window near Stonehenge in 1996.',
    relatedIds: ['stonehenge']
  },

  // ==========================================
  // BRANCH 3: CRYPTIDS & HAUNTINGS
  // ==========================================
  {
    id: 'bigfoot-br',
    parentId: 'cryptids-hauntings',
    name: 'Bigfoot / Sasquatch',
    description: 'Large, hairy, bipedal ape-like hominids reported across forested regions.',
    layer: 'Bigfoot Sightings'
  },
  {
    id: 'sasquatch-nw',
    parentId: 'bigfoot-br',
    name: 'Pacific Sasquatch',
    description: 'The standard North American wild man, frequently associated with dense forests, tree knocks, and giant footprints.',
    relatedIds: ['national-parks']
  },
  {
    id: 'yeti-himalayas',
    parentId: 'bigfoot-br',
    name: 'Yeti (Abominable Snowman)',
    description: 'The Himalayan version of the bipedal hominid, rooted in local Sherpa mythology and tracked by Western explorers.',
    relatedIds: ['cryptids-hauntings']
  },
  {
    id: 'cryptid-sightings-br',
    parentId: 'cryptids-hauntings',
    name: 'Cryptid Sightings',
    description: 'Sightings of other legendary or undiscovered creatures whose existence is not confirmed by conventional zoology.',
    layer: 'Cryptid Sightings',
    translations: [
      { lang: 'Greek', original: 'Κρυπτός', translit: 'Kryptos', meaning: 'Hidden / Concealed' }
    ]
  },
  {
    id: 'mothman',
    parentId: 'cryptid-sightings-br',
    name: 'Mothman',
    description: 'A winged, red-eyed humanoid creature sighted in Point Pleasant, West Virginia, historically associated with impending disasters.',
    relatedIds: ['ufos-anomalies']
  },
  {
    id: 'nessie',
    parentId: 'cryptid-sightings-br',
    name: 'Loch Ness Monster',
    description: 'A large aquatic cryptid rumored to inhabit Loch Ness in Scotland, often described as resembling a prehistoric plesiosaur.',
    relatedIds: ['cryptids-hauntings']
  },
  {
    id: 'hauntings-br',
    parentId: 'cryptids-hauntings',
    name: 'Ghosts & Hauntings',
    description: 'Reports of paranormal occurrences, residual energy, or spirits tied to specific geographic battlefields or buildings.',
    layer: 'Ghosts & Hauntings'
  },
  {
    id: 'gettysburg',
    parentId: 'hauntings-br',
    name: 'Gettysburg Battlefield',
    description: 'Site of the bloodiest battle of the American Civil War, now known for intense residual hauntings and phantom echoes.',
    relatedIds: ['cryptids-hauntings']
  },
  {
    id: 'underworld',
    parentId: 'cryptids-hauntings',
    name: 'Underworld Entrances',
    description: 'Caverns, underground systems, or structural passages rumored to lead deep into hollow earth tunnels.',
    layer: 'Underworld Entrances',
    translations: [
      { lang: 'Greek', original: 'Ἅιδης', translit: 'Haides', meaning: 'Unseen Realm / Hades' },
      { lang: 'Hebrew', original: 'שְׁאוֹλ', translit: 'Sheol', meaning: 'Abode of the Dead' }
    ],
    relatedIds: ['mt-shasta', 'derinkuyu', 'dumbs']
  },
  {
    id: 'mt-shasta',
    parentId: 'underworld',
    name: 'Mount Shasta',
    description: 'A volcanic peak in northern California. Regarded by occultists as an Earth chakra and rumored to contain the subterranean city of Telos.',
    relatedIds: ['ley-lines', 'bigfoot-br']
  },
  {
    id: 'derinkuyu',
    parentId: 'underworld',
    name: 'Derinkuyu Underground City',
    description: 'An ancient multi-level underground city in Turkey, large enough to shelter 20,000 people along with livestock and food stores.',
    relatedIds: ['ancient-sites', 'megaliths']
  },

  // ==========================================
  // BRANCH 4: ANCIENT SITES & MEGALITHS
  // ==========================================
  {
    id: 'megaliths',
    parentId: 'ancient-sites',
    name: 'Megalithic Structures',
    description: 'Massive, precision-engineered stone monuments built in antiquity using stones of immense weight.',
    layer: 'Megaliths',
    translations: [
      { lang: 'Greek', original: 'Μέγας Λίθος', translit: 'Megas Lithos', meaning: 'Large Stone' }
    ],
    relatedIds: ['stonehenge', 'pyramids', 'gobekli-tepe']
  },
  {
    id: 'stonehenge',
    parentId: 'megaliths',
    name: 'Stonehenge',
    description: 'A prehistoric circle of standing stones in Wiltshire, England, aligned with solar solstices. Rumored in myths to have been built by giants.',
    relatedIds: ['julia-set', 'ley-lines']
  },
  {
    id: 'pyramids',
    parentId: 'megaliths',
    name: 'Great Pyramid of Giza',
    description: 'The oldest of the Seven Wonders of the Ancient World. Built with extreme mathematical and astronomical precision.',
    relatedIds: ['ley-lines', 'ancient-texts']
  },
  {
    id: 'gobekli-tepe',
    parentId: 'megaliths',
    name: 'Göbekli Tepe',
    description: 'The oldest known temple complex in the world, dating to ~9600 BC. Features massive T-shaped stone pillars carved with wild animals.',
    relatedIds: ['great-flood', 'watchers']
  },

  {
    id: 'mounds',
    parentId: 'ancient-sites',
    name: 'Burial Mounds & Earthworks',
    description: 'Artificial hills and structural earthworks built by ancient cultures, often aligned with astronomical events.',
    layer: 'Burial Mounds'
  },
  {
    id: 'serpent-mound',
    parentId: 'mounds',
    name: 'Serpent Mound (Ohio)',
    description: 'The largest prehistoric effigy mound in the world, representing a winding snake eating an oval object. Aligned with solstices and equinoxes.',
    relatedIds: ['ley-lines', 'nephilim-br']
  },

  {
    id: 'petroglyphs-br',
    parentId: 'ancient-sites',
    name: 'Petroglyphs & Cave Art',
    description: 'Images carved or painted onto rock walls, frequently depicting strange humanoid figures, spirals, and entities.',
    layer: 'Petroglyphs',
    translations: [
      { lang: 'Greek', original: 'Πέτρογλυφος', translit: 'Petroglyphos', meaning: 'Carved Stone' }
    ]
  },
  {
    id: 'newspaper-rock',
    parentId: 'petroglyphs-br',
    name: 'Newspaper Rock (Utah)',
    description: 'A rock panel containing hundreds of petroglyphs carved by Anasazi, Fremont, and Ute peoples, featuring strange six-toed humanoids and horned figures.',
    relatedIds: ['nephilim-br']
  },
  {
    id: 'cave-drawings-br',
    parentId: 'ancient-sites',
    name: 'Cave Drawings',
    description: 'Prehistoric paintings inside deep caverns, dating back to the Ice Age.',
    layer: 'Cave Drawings'
  },

  {
    id: 'ancient-texts',
    parentId: 'ancient-sites',
    name: 'Ancient Texts & Tablets',
    description: 'Written records from ancient civilizations that preserve historical memories of floods, giants, and celestial deities.',
    layer: 'Ancient Texts'
  },
  {
    id: 'book-of-enoch',
    parentId: 'ancient-texts',
    name: 'Book of Enoch',
    description: 'An ancient Jewish religious work ascribed to Enoch. It contains unique descriptions of the fall of the Watchers, their breeding with humans to create Nephilim, and detailed astronomical grids.',
    relatedIds: ['enoch', 'watchers', 'mt-hermon']
  },
  {
    id: 'gilgamesh-text',
    parentId: 'ancient-texts',
    name: 'Epic of Gilgamesh',
    description: 'A Mesopotamian epic poem containing the Sumerian story of the Great Flood survived by Utnapishtim, bearing strong similarities to the Genesis narrative.',
    relatedIds: ['great-flood', 'noah-fig', 'nimrod-fig']
  },

  {
    id: 'archaeological-finds-br',
    parentId: 'ancient-sites',
    name: 'Archaeological Finds',
    description: 'Physical objects and artifacts discovered during excavations that challenge historical timelines.',
    layer: 'Archaeological Finds'
  },

  // ==========================================
  // BRANCH 5: EARTH ENERGIES & OPERATIONS
  // ==========================================
  {
    id: 'ley-lines-br',
    parentId: 'earth-energies',
    name: 'Ley Lines & Planetary Grids',
    description: 'Hypothetical straight alignments of ancient megalithic sites, sacred places, and earth energy currents.',
    layer: 'Ley Lines'
  },
  {
    id: 'st-michaels-line',
    parentId: 'ley-lines-br',
    name: "St. Michael's Ley Line",
    description: 'A straight alignment of St. Michael churches across southern England, intersecting major megalithic nodes like Glastonbury.',
    relatedIds: ['stonehenge']
  },

  {
    id: 'dumbs',
    parentId: 'earth-energies',
    name: "D.U.M.B.'s",
    description: 'Deep Underground Military Bases alleged to exist across the United States, connected by high-speed subterranean rail lines.',
    layer: "D.U.M.B.'s"
  },
  {
    id: 'dulce-base',
    parentId: 'dumbs',
    name: 'Dulce Base (New Mexico)',
    description: 'A rumored subterranean facility under Archuleta Mesa, alleged to house joint military-extraterrestrial genetic operations.',
    relatedIds: ['underworld', 'roswell-incident']
  },
  {
    id: 'area-51',
    parentId: 'dumbs',
    name: 'Area 51 (Groom Lake)',
    description: 'The legendary classified US Air Force installation in Nevada, famous for developing advanced stealth aircraft and associated UFO folklore.',
    relatedIds: ['roswell-incident', 'google-blurred']
  },

  {
    id: 'google-blurred',
    parentId: 'earth-energies',
    name: 'Google Maps Blurs',
    description: 'Secret, blurred, or pixelated locations on digital maps, indicating high-security installations or anomalies.',
    layer: 'Blurred on Google Maps'
  },
  {
    id: 'haarp-facility',
    parentId: 'google-blurred',
    name: 'HAARP Facility (Alaska)',
    description: 'The High-frequency Active Auroral Research Program ionospheric heater, frequently linked in conspiracy space to weather modification and earth energies.',
    relatedIds: ['ley-lines-br']
  },

  {
    id: 'craters-br',
    parentId: 'earth-energies',
    name: 'Meteor Impact Craters',
    description: 'Scars of ancient space impacts, some of which triggered global extinction events or localized magnetic anomalies.',
    layer: 'Meteor Impact Craters'
  },
  {
    id: 'chicxulub',
    parentId: 'craters-br',
    name: 'Chicxulub Crater',
    description: 'The massive impact crater buried under the Yucatan peninsula, responsible for the Cretaceous-Paleogene extinction event.',
    relatedIds: ['earth-energies']
  },

  {
    id: 'national-parks',
    parentId: 'earth-energies',
    name: 'National Parks & Anomalies',
    description: 'Protected federal reserves that overlay magnetic anomalies, cave networks, and unexplained disappearances (Missing 411 cases).',
    layer: 'National Parks & Reserves'
  },
  {
    id: 'grand-canyon-cave',
    parentId: 'national-parks',
    name: 'Grand Canyon Egyptian Caves',
    description: 'A rumored discovery reported in a 1909 newspaper article detailing massive underground caverns containing Egyptian-style artifacts and mummies.',
    relatedIds: ['underworld', 'megaliths']
  }
];
