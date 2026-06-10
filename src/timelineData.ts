export interface TimelineItem {
  id: string;
  name: string;
  type: 'lifespan' | 'event';
  layer: 'biblical-patriarchs' | 'biblical-events' | 'sumerian-kings' | 'greek-mythology' | 'merovingian-bloodlines' | 'royal-bloodlines' | 'enochian-lore' | 'future-prophecy' | 'secret-gov-programs' | 'ancient-civilizations' | 'alchemy-occult';
  start: number; // BCE is negative, CE is positive
  end?: number;  // Only for 'lifespan'
  description: string;
  source?: string;
  fatherId?: string; // For lineage tracking
  motherId?: string; // For mother lineage tracking
  spouseId?: string; // For spouse relationship tracking
  isPeopleGroup?: boolean;
  subLabel?: string;
}

export const TIMELINE_ITEMS: TimelineItem[] = [
  // ==========================================
  // BIBLICAL PATRIARCHS (GENEALOGY / FAMILY TREE)
  // ==========================================
  {
    id: 'adam',
    name: 'Adam',
    type: 'lifespan',
    layer: 'biblical-patriarchs',
    start: -4004,
    end: -3074,
    description: 'The first human created by God. Lived 930 years.',
    source: 'Genesis 5:3-5',
    spouseId: 'eve'
  },
  {
    id: 'eve',
    name: 'Eve',
    type: 'lifespan',
    layer: 'biblical-patriarchs',
    start: -4004,
    end: -3074,
    description: 'The first woman, created by God from Adam\'s rib. Mother of Cain, Abel, Seth, and others.',
    source: 'Genesis 2:21-25, 3:20',
    spouseId: 'adam'
  },
  {
    id: 'cain',
    name: 'Cain',
    type: 'lifespan',
    layer: 'biblical-patriarchs',
    start: -3900,
    end: -3100,
    description: 'Eldest son of Adam and Eve. Slew his brother Abel and was marked by God.',
    source: 'Genesis 4:1-16',
    fatherId: 'adam',
    motherId: 'eve'
  },
  {
    id: 'abel',
    name: 'Abel',
    type: 'lifespan',
    layer: 'biblical-patriarchs',
    start: -3890,
    end: -3760,
    description: 'Second son of Adam and Eve. A keeper of sheep whose offering was accepted by God, slain by Cain out of jealousy.',
    source: 'Genesis 4:2-8',
    fatherId: 'adam',
    motherId: 'eve'
  },
  {
    id: 'seth',
    name: 'Seth',
    type: 'lifespan',
    layer: 'biblical-patriarchs',
    start: -3874,
    end: -2962,
    description: 'Third son of Adam and Eve, born after Abel was killed. Lived 912 years.',
    source: 'Genesis 5:6-8',
    fatherId: 'adam',
    motherId: 'eve'
  },
  {
    id: 'enosh',
    name: 'Enosh',
    type: 'lifespan',
    layer: 'biblical-patriarchs',
    start: -3769,
    end: -2864,
    description: 'Son of Seth. During his time, people began to call upon the name of the Lord. Lived 905 years.',
    source: 'Genesis 5:9-11',
    fatherId: 'seth'
  },
  {
    id: 'kenan',
    name: 'Kenan',
    type: 'lifespan',
    layer: 'biblical-patriarchs',
    start: -3679,
    end: -2769,
    description: 'Son of Enosh. Lived 910 years.',
    source: 'Genesis 5:12-14',
    fatherId: 'enosh'
  },
  {
    id: 'mahalalel',
    name: 'Mahalalel',
    type: 'lifespan',
    layer: 'biblical-patriarchs',
    start: -3609,
    end: -2714,
    description: 'Son of Kenan. Lived 895 years.',
    source: 'Genesis 5:15-17',
    fatherId: 'kenan'
  },
  {
    id: 'jared',
    name: 'Jared',
    type: 'lifespan',
    layer: 'biblical-patriarchs',
    start: -3544,
    end: -2582,
    description: 'Son of Mahalalel. Lived 962 years.',
    source: 'Genesis 5:18-20',
    fatherId: 'mahalalel'
  },
  {
    id: 'enoch',
    name: 'Enoch',
    type: 'lifespan',
    layer: 'biblical-patriarchs',
    start: -3382,
    end: -3017,
    description: 'Son of Jared. Walked faithfully with God, then he was no more, because God took him away. Lived 365 years before translation.',
    source: 'Genesis 5:21-24',
    fatherId: 'jared'
  },
  {
    id: 'methuselah',
    name: 'Methuselah',
    type: 'lifespan',
    layer: 'biblical-patriarchs',
    start: -3317,
    end: -2348,
    description: 'Son of Enoch. The longest-lived human in biblical records. Died in the year of the Great Flood. Lived 969 years.',
    source: 'Genesis 5:25-27',
    fatherId: 'enoch'
  },
  {
    id: 'lamech',
    name: 'Lamech',
    type: 'lifespan',
    layer: 'biblical-patriarchs',
    start: -3130,
    end: -2353,
    description: 'Son of Methuselah and father of Noah. Lived 777 years.',
    source: 'Genesis 5:28-31',
    fatherId: 'methuselah'
  },
  {
    id: 'noah',
    name: 'Noah',
    type: 'lifespan',
    layer: 'biblical-patriarchs',
    start: -2948,
    end: -1998,
    description: 'Builder of the Ark who survived the Great Flood that cleansed the Earth. Lived 950 years.',
    source: 'Genesis 5:32, 9:28-29',
    fatherId: 'lamech'
  },
  {
    id: 'shem',
    name: 'Shem',
    type: 'lifespan',
    layer: 'biblical-patriarchs',
    start: -2446,
    end: -1846,
    description: 'Son of Noah, ancestor of the Semitic peoples. Survived the Flood. Lived 600 years.',
    source: 'Genesis 11:10-11',
    fatherId: 'noah'
  },
  {
    id: 'ham',
    name: 'Ham',
    type: 'lifespan',
    layer: 'biblical-patriarchs',
    start: -2444,
    end: -1904,
    description: 'Son of Noah, father of Cush, Egypt, Put, and Canaan. Survived the Flood. Lived approximately 540 years (historical estimate).',
    source: 'Genesis 10:6',
    fatherId: 'noah'
  },
  {
    id: 'japheth',
    name: 'Japheth',
    type: 'lifespan',
    layer: 'biblical-patriarchs',
    start: -2448,
    end: -1908,
    description: 'Son of Noah, ancestor of the maritime and northern nations. Survived the Flood. Lived approximately 540 years (historical estimate).',
    source: 'Genesis 10:2-5',
    fatherId: 'noah'
  },
  {
    id: 'cush',
    name: 'Cush',
    type: 'lifespan',
    layer: 'biblical-patriarchs',
    start: -2346,
    end: -1846,
    description: 'Eldest son of Ham, father of Nimrod. Ancestor of the land of Cush (Nubia/Ethiopia). Lived approximately 500 years.',
    source: 'Genesis 10:6-8',
    fatherId: 'ham'
  },
  {
    id: 'nimrod',
    name: 'Nimrod',
    type: 'lifespan',
    layer: 'biblical-patriarchs',
    start: -2250,
    end: -2150,
    description: 'Son of Cush. Described as a "mighty hunter before the Lord" and the ruler of Babel, Erech, Accad, and Calneh in Shinar.',
    source: 'Genesis 10:8-10',
    fatherId: 'cush'
  },
  {
    id: 'arpachshad',
    name: 'Arpachshad',
    type: 'lifespan',
    layer: 'biblical-patriarchs',
    start: -2346,
    end: -1908,
    description: 'Son of Shem, born two years after the Flood. Lived 438 years.',
    source: 'Genesis 11:12-13',
    fatherId: 'shem'
  },
  {
    id: 'shelah',
    name: 'Shelah',
    type: 'lifespan',
    layer: 'biblical-patriarchs',
    start: -2311,
    end: -1878,
    description: 'Son of Arpachshad. Lived 433 years.',
    source: 'Genesis 11:14-15',
    fatherId: 'arpachshad'
  },
  {
    id: 'eber',
    name: 'Eber',
    type: 'lifespan',
    layer: 'biblical-patriarchs',
    start: -2281,
    end: -1817,
    description: 'Son of Shelah. Ancestor of the Hebrews. Lived 464 years.',
    source: 'Genesis 11:16-17',
    fatherId: 'shelah'
  },
  {
    id: 'peleg',
    name: 'Peleg',
    type: 'lifespan',
    layer: 'biblical-patriarchs',
    start: -2247,
    end: -2008,
    description: 'Son of Eber. Named Peleg because "in his days the earth was divided" (associated with the Tower of Babel dispersion). Lived 239 years.',
    source: 'Genesis 11:18-19',
    fatherId: 'eber'
  },
  {
    id: 'reu',
    name: 'Reu',
    type: 'lifespan',
    layer: 'biblical-patriarchs',
    start: -2217,
    end: -1978,
    description: 'Son of Peleg. Lived 239 years.',
    source: 'Genesis 11:20-21',
    fatherId: 'peleg'
  },
  {
    id: 'serug',
    name: 'Serug',
    type: 'lifespan',
    layer: 'biblical-patriarchs',
    start: -2185,
    end: -1955,
    description: 'Son of Reu. Lived 230 years.',
    source: 'Genesis 11:22-23',
    fatherId: 'reu'
  },
  {
    id: 'nahor_pat',
    name: 'Nahor',
    type: 'lifespan',
    layer: 'biblical-patriarchs',
    start: -2155,
    end: -2007,
    description: 'Son of Serug and grandfather of Abraham. Lived 148 years.',
    source: 'Genesis 11:24-25',
    fatherId: 'serug'
  },
  {
    id: 'terah',
    name: 'Terah',
    type: 'lifespan',
    layer: 'biblical-patriarchs',
    start: -2126,
    end: -1921,
    description: 'Son of Nahor and father of Abraham. Set out from Ur of the Chaldeans but settled in Harran. Lived 205 years.',
    source: 'Genesis 11:26-32',
    fatherId: 'nahor_pat'
  },
  {
    id: 'abraham',
    name: 'Abraham',
    type: 'lifespan',
    layer: 'biblical-patriarchs',
    start: -1996,
    end: -1821,
    description: 'Patriarch of Israel, called by God from Ur to go to Canaan. Patriarch of the Covenant. Lived 175 years.',
    source: 'Genesis 12-25',
    fatherId: 'terah',
    spouseId: 'sarah'
  },
  {
    id: 'sarah',
    name: 'Sarah',
    type: 'lifespan',
    layer: 'biblical-patriarchs',
    start: -1986,
    end: -1859,
    description: 'Wife of Abraham and mother of Isaac. Lived 127 years.',
    source: 'Genesis 17:17, 23:1',
    spouseId: 'abraham'
  },
  {
    id: 'ishmael',
    name: 'Ishmael',
    type: 'lifespan',
    layer: 'biblical-patriarchs',
    start: -1910,
    end: -1773,
    description: 'Eldest son of Abraham (with Hagar). Father of the Ishmaelites. Lived 137 years.',
    source: 'Genesis 16:16, 25:17',
    fatherId: 'abraham'
  },
  {
    id: 'isaac',
    name: 'Isaac',
    type: 'lifespan',
    layer: 'biblical-patriarchs',
    start: -1896,
    end: -1716,
    description: 'Son of Abraham and Sarah, born in their old age. Father of Jacob and Esau. Lived 180 years.',
    source: 'Genesis 21-35',
    fatherId: 'abraham',
    motherId: 'sarah',
    spouseId: 'rebekah'
  },
  {
    id: 'rebekah',
    name: 'Rebekah',
    type: 'lifespan',
    layer: 'biblical-patriarchs',
    start: -1876,
    end: -1756,
    description: 'Wife of Isaac and mother of Jacob and Esau.',
    source: 'Genesis 24-27',
    spouseId: 'isaac'
  },
  {
    id: 'esau',
    name: 'Esau',
    type: 'lifespan',
    layer: 'biblical-patriarchs',
    start: -1836,
    end: -1690,
    description: 'Eldest son of Isaac and Rebekah, twin brother of Jacob. Founder of the Edomites.',
    source: 'Genesis 25-36',
    fatherId: 'isaac',
    motherId: 'rebekah'
  },
  {
    id: 'jacob',
    name: 'Jacob',
    type: 'lifespan',
    layer: 'biblical-patriarchs',
    start: -1836,
    end: -1689,
    description: 'Son of Isaac, renamed Israel. Father of the twelve patriarchs of the Tribes of Israel. Lived 147 years.',
    source: 'Genesis 25-49',
    fatherId: 'isaac',
    motherId: 'rebekah',
    spouseId: 'leah'
  },
  {
    id: 'leah',
    name: 'Leah',
    type: 'lifespan',
    layer: 'biblical-patriarchs',
    start: -1820,
    end: -1700,
    description: 'First wife of Jacob and mother of Reuben, Simeon, Levi, Judah, Issachar, and Zebulun.',
    source: 'Genesis 29-33, 49:31',
    spouseId: 'jacob'
  },
  {
    id: 'rachel',
    name: 'Rachel',
    type: 'lifespan',
    layer: 'biblical-patriarchs',
    start: -1818,
    end: -1745,
    description: 'Beloved second wife of Jacob and mother of Joseph and Benjamin. Died in childbirth.',
    source: 'Genesis 29-35',
    spouseId: 'jacob'
  },
  {
    id: 'judah',
    name: 'Judah',
    type: 'lifespan',
    layer: 'biblical-patriarchs',
    start: -1801,
    end: -1682,
    description: 'Fourth son of Jacob and Leah. Ancestor of the Tribe of Judah, from whom the kings of Judah and Jesus descend. Lived 119 years.',
    source: 'Genesis 29:35, 49:8-12',
    fatherId: 'jacob',
    motherId: 'leah'
  },
  {
    id: 'levi',
    name: 'Levi',
    type: 'lifespan',
    layer: 'biblical-patriarchs',
    start: -1803,
    end: -1666,
    description: 'Third son of Jacob and Leah. Ancestor of the priestly Levite tribe. Lived 137 years.',
    source: 'Genesis 29:34, Exodus 6:16',
    fatherId: 'jacob',
    motherId: 'leah'
  },
  {
    id: 'joseph',
    name: 'Joseph',
    type: 'lifespan',
    layer: 'biblical-patriarchs',
    start: -1745,
    end: -1635,
    description: 'Favored son of Jacob, sold into slavery in Egypt, became Vizier under Pharaoh, and saved his family from famine. Lived 110 years.',
    source: 'Genesis 37-50',
    fatherId: 'jacob',
    motherId: 'rachel'
  },
  {
    id: 'benjamin',
    name: 'Benjamin',
    type: 'lifespan',
    layer: 'biblical-patriarchs',
    start: -1745,
    end: -1635,
    description: 'Twelfth and youngest son of Jacob (with Rachel). Brother of Joseph. Lived approximately 110 years.',
    source: 'Genesis 35:16-18, 43-45',
    fatherId: 'jacob',
    motherId: 'rachel'
  },

  // ==========================================
  // BIBLICAL EVENTS & KINGS
  // ==========================================
  {
    id: 'evt-creation',
    name: 'The Creation',
    type: 'event',
    layer: 'biblical-events',
    start: -4004,
    description: 'The creation of the heavens and the earth according to Genesis, marking year 0 Anno Mundi in biblical chronology.',
    source: 'Genesis 1'
  },
  {
    id: 'evt-enoch-trans',
    name: 'Enoch Translated',
    type: 'event',
    layer: 'biblical-events',
    start: -3017,
    description: 'Enoch was translated to heaven by God without experiencing physical death.',
    source: 'Genesis 5:24'
  },
  {
    id: 'evt-adam-death',
    name: 'Death of Adam',
    type: 'event',
    layer: 'biblical-events',
    start: -3074,
    description: 'The death of the first man, Adam, at 930 years of age.',
    source: 'Genesis 5:5'
  },
  {
    id: 'evt-great-flood',
    name: 'The Great Flood',
    type: 'event',
    layer: 'biblical-events',
    start: -2348,
    description: 'A global deluge sent by God to cleanse corruption, survived only by Noah and his family in the Ark.',
    source: 'Genesis 6-9'
  },
  {
    id: 'evt-tower-babel',
    name: 'Tower of Babel',
    type: 'event',
    layer: 'biblical-events',
    start: -2247,
    description: 'Humanity attempts to build a tower to the heavens. God confuses their languages and scatters them across the earth.',
    source: 'Genesis 11:1-9'
  },
  {
    id: 'evt-abraham-canaan',
    name: 'Abraham Enters Canaan',
    type: 'event',
    layer: 'biblical-events',
    start: -1921,
    description: 'At age 75, Abraham obeys God\'s call to leave Harran and journey to the promised land of Canaan.',
    source: 'Genesis 12:4'
  },
  {
    id: 'evt-sodom-gomorrah',
    name: 'Destruction of Sodom',
    type: 'event',
    layer: 'biblical-events',
    start: -1897,
    description: 'Sodom, Gomorrah, and the cities of the plain are destroyed by fire and brimstone from heaven due to wickedness.',
    source: 'Genesis 19'
  },
  {
    id: 'evt-binding-isaac',
    name: 'Binding of Isaac',
    type: 'event',
    layer: 'biblical-events',
    start: -1871,
    description: 'God commands Abraham to sacrifice his son Isaac on Mount Moriah; Abraham is stopped by an angel at the last second.',
    source: 'Genesis 22'
  },
  {
    id: 'evt-joseph-sold',
    name: 'Joseph Sold to Egypt',
    type: 'event',
    layer: 'biblical-events',
    start: -1728,
    description: 'Joseph is sold by his jealous brothers to Ishmaelite merchants for twenty shekels of silver, who take him to Egypt.',
    source: 'Genesis 37:28'
  },
  {
    id: 'evt-israel-egypt',
    name: 'Jacob Enters Egypt',
    type: 'event',
    layer: 'biblical-events',
    start: -1706,
    description: 'Jacob and his entire family migrate from Canaan to Goshen in Egypt to escape a severe seven-year famine.',
    source: 'Genesis 46'
  },
  {
    id: 'evt-exodus',
    name: 'The Exodus from Egypt',
    type: 'event',
    layer: 'biblical-events',
    start: -1491,
    description: 'The Israelites escape Egyptian bondage under Moses, following the Ten Plagues and the parting of the Red Sea.',
    source: 'Exodus 12-14'
  },
  {
    id: 'evt-sinai-law',
    name: 'Giving of the Law',
    type: 'event',
    layer: 'biblical-events',
    start: -1491,
    description: 'God speaks the Ten Commandments to Moses and the assembly of Israel at Mount Sinai, establishing the Mosaic Covenant.',
    source: 'Exodus 19-20'
  },
  {
    id: 'evt-jericho',
    name: 'Battle of Jericho',
    type: 'event',
    layer: 'biblical-events',
    start: -1451,
    description: 'After crossing the Jordan River, the walls of Jericho collapse after the Israelite army marches around them carrying the Ark.',
    source: 'Joshua 6'
  },
  {
    id: 'reign-saul',
    name: 'Reign of King Saul',
    type: 'lifespan',
    layer: 'biblical-events',
    start: -1050,
    end: -1010,
    description: 'The reign of the first King of the United Kingdom of Israel.',
    source: '1 Samuel 10-31'
  },
  {
    id: 'reign-david',
    name: 'Reign of King David',
    type: 'lifespan',
    layer: 'biblical-events',
    start: -1010,
    end: -970,
    description: 'Reign of King David, builder of Jerusalem and conqueror of the Philistines. Golden age of Israel.',
    source: '2 Samuel, 1 Kings 1-2'
  },
  {
    id: 'reign-solomon-temple',
    name: 'Solomon\'s Temple Construction',
    type: 'lifespan',
    layer: 'biblical-events',
    start: -966,
    end: -959,
    description: 'The building of the First Temple in Jerusalem on Mount Moriah by King Solomon, taking seven years.',
    source: '1 Kings 6'
  },
  {
    id: 'evt-split-kingdom',
    name: 'Split of the Kingdom',
    type: 'event',
    layer: 'biblical-events',
    start: -930,
    description: 'Following Solomon\'s death, Israel divides into the Northern Kingdom (Israel) and Southern Kingdom (Judah).',
    source: '1 Kings 12'
  },
  {
    id: 'evt-fall-samaria',
    name: 'Assyrian Captivity (Israel)',
    type: 'event',
    layer: 'biblical-events',
    start: -722,
    description: 'Samaria falls to the Assyrian Empire under Sargon II, leading to the exile of the ten northern tribes (Lost Tribes).',
    source: '2 Kings 17'
  },
  {
    id: 'evt-fall-jerusalem',
    name: 'Babylonian Captivity (Judah)',
    type: 'event',
    layer: 'biblical-events',
    start: -586,
    description: 'Jerusalem is besieged and destroyed by Nebuchadnezzar II of Babylon. Solomon\'s Temple is burned and the Jews exiled.',
    source: '2 Kings 25'
  },
  {
    id: 'evt-temple-rebuilt',
    name: 'Decree of Cyrus & Return',
    type: 'event',
    layer: 'biblical-events',
    start: -536,
    description: 'Cyrus the Great of Persia conquers Babylon and decrees that the Jewish exiles may return to Jerusalem to rebuild the Temple.',
    source: 'Ezra 1'
  },
  {
    id: 'evt-christ-birth',
    name: 'Birth of Jesus Christ',
    type: 'event',
    layer: 'biblical-events',
    start: -4,
    description: 'The birth of Jesus in Bethlehem, Judea, marking the pivot point of the Western calendar.',
    source: 'Luke 2, Matthew 1-2'
  },
  {
    id: 'evt-crucifixion',
    name: 'Crucifixion & Resurrection',
    type: 'event',
    layer: 'biblical-events',
    start: 30,
    description: 'The crucifixion, burial, and reported resurrection of Jesus Christ in Jerusalem under Pontius Pilate.',
    source: 'Gospels'
  },

  // ==========================================
  // SUMERIAN KINGS LIST (LEGENDARY ANCIENT REIGNS)
  // ==========================================
  {
    id: 'skl-alulim',
    name: 'Alulim of Eridu',
    type: 'lifespan',
    layer: 'sumerian-kings',
    start: -241200,
    end: -212400,
    description: 'The first king of the first city, Eridu. Legendary reign of 28,800 years before the flood.',
    source: 'Sumerian Kings List (Eridu)'
  },
  {
    id: 'skl-alalngar',
    name: 'Alalngar of Eridu',
    type: 'lifespan',
    layer: 'sumerian-kings',
    start: -212400,
    end: -176400,
    description: 'The second king of Eridu. Reigned for 36,000 years.',
    source: 'Sumerian Kings List (Eridu)'
  },
  {
    id: 'skl-enmenluana',
    name: 'En-men-lu-ana of Bad-tibira',
    type: 'lifespan',
    layer: 'sumerian-kings',
    start: -176400,
    end: -133200,
    description: 'King of Bad-tibira. Recorded as having the longest reign on the Kings List: 43,200 years.',
    source: 'Sumerian Kings List (Bad-tibira)'
  },
  {
    id: 'skl-enmengalana',
    name: 'En-men-gal-ana of Bad-tibira',
    type: 'lifespan',
    layer: 'sumerian-kings',
    start: -133200,
    end: -104400,
    description: 'King of Bad-tibira. Reigned for 28,800 years.',
    source: 'Sumerian Kings List (Bad-tibira)'
  },
  {
    id: 'skl-dumuzid-shep',
    name: 'Dumuzid the Shepherd',
    type: 'lifespan',
    layer: 'sumerian-kings',
    start: -104400,
    end: -68400,
    description: 'Sumerian culture hero and king of Bad-tibira, later divinized as the god of fertility and agriculture. Reigned 36,000 years.',
    source: 'Sumerian Kings List (Bad-tibira)'
  },
  {
    id: 'skl-ensipad-zian-anna',
    name: 'En-sipad-zian-anna of Larag',
    type: 'lifespan',
    layer: 'sumerian-kings',
    start: -68400,
    end: -39600,
    description: 'King of Larag. Reigned for 28,800 years.',
    source: 'Sumerian Kings List (Larag)'
  },
  {
    id: 'skl-enmendurana',
    name: 'En-men-dur-ana of Sippar',
    type: 'lifespan',
    layer: 'sumerian-kings',
    start: -39600,
    end: -18600,
    description: 'King of Sippar. In legend, he was summoned to heaven by the gods Shamash and Adad and taught the secrets of divination. Reigned 21,000 years.',
    source: 'Sumerian Kings List (Sippar)'
  },
  {
    id: 'skl-ubarautu',
    name: 'Ubara-Tutu of Shuruppak',
    type: 'lifespan',
    layer: 'sumerian-kings',
    start: -18600,
    end: -2348,
    description: 'The last antediluvian king of Sumer, ruling in Shuruppak. Father of the Sumerian flood survivor Ziusudra. Reigned for 16,252 years until the flood swept over.',
    source: 'Sumerian Kings List (Shuruppak)'
  },
  {
    id: 'skl-jushur',
    name: 'Jushur of Kish',
    type: 'lifespan',
    layer: 'sumerian-kings',
    start: -2348,
    end: -1148,
    description: 'The first king of the Kish Dynasty after the Great Flood. Reigned for a legendary 1,200 years.',
    source: 'Sumerian Kings List (First Kish)'
  },
  {
    id: 'skl-lugalbanda',
    name: 'Lugalbanda of Uruk',
    type: 'lifespan',
    layer: 'sumerian-kings',
    start: -2200,
    end: -1000,
    description: 'Second king of Uruk, deified ancestor and father of Gilgamesh. Legend states he reigned for 1,200 years.',
    source: 'Sumerian Kings List (First Uruk)'
  },
  {
    id: 'skl-enmerkar',
    name: 'Enmerkar of Uruk',
    type: 'lifespan',
    layer: 'sumerian-kings',
    start: -2300,
    end: -1880,
    description: 'Builder of Uruk, famous for demanding tribute from Aratta, leading to the confusion of speech (similar to Babel). Reigned 420 years.',
    source: 'Sumerian Kings List (First Uruk)'
  },
  {
    id: 'skl-gilgamesh',
    name: 'Gilgamesh of Uruk',
    type: 'lifespan',
    layer: 'sumerian-kings',
    start: -2600,
    end: -2474,
    description: 'King of Uruk, hero of the Epic of Gilgamesh, searcher for immortality. Reigned for 126 years in the Kings List. Historically dated to ~2600 BC.',
    source: 'Sumerian Kings List (First Uruk)'
  },

  // ==========================================
  // GREEK MYTHOLOGY (CHRONOLOGICAL MILESTONES)
  // ==========================================
  {
    id: 'gk-cecrops',
    name: 'King Cecrops of Athens',
    type: 'lifespan',
    layer: 'greek-mythology',
    start: -1556,
    end: -1506,
    description: 'Legendary first King of Athens, depicted as half-man and half-serpent. Founded the Cecropia citadel.',
    source: 'Parian Chronicle / Apollodorus'
  },
  {
    id: 'gk-deucalion-flood',
    name: 'Deucalion\'s Flood',
    type: 'event',
    layer: 'greek-mythology',
    start: -1528,
    description: 'The Greek flood myth. Zeus sends a deluge to destroy humanity; Deucalion and Pyrrha survive in a chest, landing on Mt. Parnassus.',
    source: 'Parian Chronicle / Ovid'
  },
  {
    id: 'gk-cadmus-thebes',
    name: 'Cadmus Founds Thebes',
    type: 'event',
    layer: 'greek-mythology',
    start: -1518,
    description: 'Phoenician prince Cadmus, searcher of Europa, follows a cow to Boeotia and founds the Cadmea (Thebes) after slaying a dragon.',
    source: 'Parian Chronicle / Herodotus'
  },
  {
    id: 'gk-minos-crete',
    name: 'Reign of King Minos',
    type: 'lifespan',
    layer: 'greek-mythology',
    start: -1450,
    end: -1400,
    description: 'Reign of King Minos of Crete, builder of the Labyrinth, jailer of the Minotaur, founder of the Cretan thalassocracy.',
    source: 'Ancient Chronographers / Diodorus'
  },
  {
    id: 'gk-perseus-mycenae',
    name: 'Perseus Founds Mycenae',
    type: 'event',
    layer: 'greek-mythology',
    start: -1300,
    description: 'Slayer of Medusa, Perseus founds the city of Mycenae, building its walls with the help of the Cyclopes.',
    source: 'Pausanias / Apollodorus'
  },
  {
    id: 'gk-heracles-labors',
    name: 'Labors of Heracles',
    type: 'lifespan',
    layer: 'greek-mythology',
    start: -1260,
    end: -1220,
    description: 'The era of Heracles (Hercules) and his Twelve Labors performed for King Eurystheus of Mycenae.',
    source: 'Apollodorus / Diodorus'
  },
  {
    id: 'gk-theseus-athens',
    name: 'Theseus in Athens',
    type: 'lifespan',
    layer: 'greek-mythology',
    start: -1230,
    end: -1210,
    description: 'Reign of Theseus, slayer of the Minotaur, unifier of Attica, and hero of Athens.',
    source: 'Plutarch\'s Lives'
  },
  {
    id: 'gk-argonauts',
    name: 'Voyage of the Argonauts',
    type: 'event',
    layer: 'greek-mythology',
    start: -1225,
    description: 'Jason and his crew of heroes (including Heracles, Orpheus, Castor, Pollux) sail the Argo to Colchis to retrieve the Golden Fleece.',
    source: 'Apollonius Rhodius'
  },
  {
    id: 'gk-seven-thebes',
    name: 'Seven Against Thebes',
    type: 'event',
    layer: 'greek-mythology',
    start: -1213,
    description: 'The mythological war between the sons of Oedipus (Polynices and Eteocles) for the throne of Thebes.',
    source: 'Apollodorus / Sophocles'
  },
  {
    id: 'gk-trojan-war',
    name: 'The Trojan War',
    type: 'lifespan',
    layer: 'greek-mythology',
    start: -1194,
    end: -1184,
    description: 'The ten-year siege of Troy by the coalition of Greek states led by Agamemnon to retrieve Helen. Concluded by the Trojan Horse.',
    source: 'Eratosthenes / Homer\'s Iliad'
  },
  {
    id: 'gk-odyssey-wander',
    name: 'Wanderings of Odysseus',
    type: 'lifespan',
    layer: 'greek-mythology',
    start: -1184,
    end: -1174,
    description: 'The ten-year voyage of Odysseus to return home to Ithaca after the fall of Troy, encountering cyclopes, sirens, and gods.',
    source: 'Homer\'s Odyssey'
  },
  {
    id: 'gk-rome-founded',
    name: 'Founding of Rome',
    type: 'event',
    layer: 'greek-mythology',
    start: -753,
    description: 'Romulus and Remus, descendants of the Trojan hero Aeneas, found the city of Rome on the Palatine Hill.',
    source: 'Varro Chronology / Livy'
  },

  // ==========================================
  // EXTENDED BIBLICAL PATRIARCHS (Jacob to Jesus and early church)
  // ==========================================
  {
    id: 'perez',
    name: 'Perez',
    type: 'lifespan',
    layer: 'biblical-patriarchs',
    start: -1738,
    end: -1600,
    description: 'Son of Judah and Tamar, twin brother of Zerah. Ancestor of King David and Jesus Christ.',
    source: 'Genesis 38:29, Ruth 4:18',
    fatherId: 'judah'
  },
  {
    id: 'hezron',
    name: 'Hezron',
    type: 'lifespan',
    layer: 'biblical-patriarchs',
    start: -1715,
    end: -1590,
    description: 'Son of Perez. Traveled with Jacob into Egypt.',
    source: 'Genesis 46:12, Ruth 4:18',
    fatherId: 'perez'
  },
  {
    id: 'ram_pat',
    name: 'Ram',
    type: 'lifespan',
    layer: 'biblical-patriarchs',
    start: -1670,
    end: -1560,
    description: 'Son of Hezron. Mentioned in the genealogy of King David.',
    source: 'Ruth 4:19, 1 Chronicles 2:9',
    fatherId: 'hezron'
  },
  {
    id: 'amminadab',
    name: 'Amminadab',
    type: 'lifespan',
    layer: 'biblical-patriarchs',
    start: -1600,
    end: -1500,
    description: 'Son of Ram. Father of Nahshon and Elisheba (wife of Aaron).',
    source: 'Ruth 4:19, Exodus 6:23',
    fatherId: 'ram_pat'
  },
  {
    id: 'nahshon',
    name: 'Nahshon',
    type: 'lifespan',
    layer: 'biblical-patriarchs',
    start: -1530,
    end: -1450,
    description: 'Son of Amminadab, leader of the tribe of Judah during the Exodus and wilderness wanderings.',
    source: 'Numbers 1:7, Ruth 4:20',
    fatherId: 'amminadab'
  },
  {
    id: 'salmon',
    name: 'Salmon',
    type: 'lifespan',
    layer: 'biblical-patriarchs',
    start: -1470,
    end: -1380,
    description: 'Son of Nahshon. Traditional husband of Rahab and father of Boaz.',
    source: 'Ruth 4:20, Matthew 1:5',
    fatherId: 'nahshon',
    spouseId: 'rahab'
  },
  {
    id: 'rahab',
    name: 'Rahab',
    type: 'lifespan',
    layer: 'biblical-patriarchs',
    start: -1450,
    end: -1370,
    description: 'Woman of Jericho who assisted Joshua\'s spies and married Salmon, entering the lineage of David and Jesus.',
    source: 'Joshua 2, Matthew 1:5',
    spouseId: 'salmon'
  },
  {
    id: 'boaz',
    name: 'Boaz',
    type: 'lifespan',
    layer: 'biblical-patriarchs',
    start: -1380,
    end: -1290,
    description: 'Wealthy landowner of Bethlehem who married Ruth. Lived in the era of the Judges.',
    source: 'Ruth 2-4',
    fatherId: 'salmon',
    motherId: 'rahab',
    spouseId: 'ruth'
  },
  {
    id: 'ruth',
    name: 'Ruth',
    type: 'lifespan',
    layer: 'biblical-patriarchs',
    start: -1390,
    end: -1300,
    description: 'Moabite woman who remained loyal to her mother-in-law Naomi, married Boaz, and became the great-grandmother of David.',
    source: 'Book of Ruth',
    spouseId: 'boaz'
  },
  {
    id: 'obed',
    name: 'Obed',
    type: 'lifespan',
    layer: 'biblical-patriarchs',
    start: -1290,
    end: -1200,
    description: 'Son of Boaz and Ruth. Father of Jesse and grandfather of King David.',
    source: 'Ruth 4:21-22',
    fatherId: 'boaz',
    motherId: 'ruth'
  },
  {
    id: 'jesse',
    name: 'Jesse',
    type: 'lifespan',
    layer: 'biblical-patriarchs',
    start: -1190,
    end: -1100,
    description: 'Son of Obed, farmer of Bethlehem, and father of eight sons including King David.',
    source: '1 Samuel 16, Ruth 4:22',
    fatherId: 'obed'
  },
  {
    id: 'david_pat',
    name: 'King David',
    type: 'lifespan',
    layer: 'biblical-patriarchs',
    start: -1040,
    end: -970,
    description: 'The second King of Israel, shepherd, author of the Psalms, and ancestor of the Messianic lineage. Lived 70 years.',
    source: '1 Samuel 16 - 1 Kings 2',
    fatherId: 'jesse',
    spouseId: 'bathsheba'
  },
  {
    id: 'bathsheba',
    name: 'Bathsheba',
    type: 'lifespan',
    layer: 'biblical-patriarchs',
    start: -1030,
    end: -975,
    description: 'Wife of Uriah, then of King David, and mother of King Solomon.',
    source: '2 Samuel 11-12, 1 Kings 1-2',
    spouseId: 'david_pat'
  },
  {
    id: 'solomon_pat',
    name: 'King Solomon',
    type: 'lifespan',
    layer: 'biblical-patriarchs',
    start: -990,
    end: -931,
    description: 'Third King of Israel, renowned for wisdom, builder of the First Temple in Jerusalem. Lived 59 years.',
    source: '1 Kings 1-11',
    fatherId: 'david_pat',
    motherId: 'bathsheba'
  },
  {
    id: 'rehoboam',
    name: 'King Rehoboam',
    type: 'lifespan',
    layer: 'biblical-patriarchs',
    start: -972,
    end: -914,
    description: 'Son of Solomon. His harsh policies led to the revolt of the ten tribes and the split of the United Kingdom.',
    source: '1 Kings 12-14',
    fatherId: 'solomon_pat'
  },
  {
    id: 'abijah',
    name: 'King Abijah',
    type: 'lifespan',
    layer: 'biblical-patriarchs',
    start: -950,
    end: -911,
    description: 'The second King of Judah. Reigned for three years.',
    source: '1 Kings 15, 2 Chronicles 13',
    fatherId: 'rehoboam'
  },
  {
    id: 'asa',
    name: 'King Asa',
    type: 'lifespan',
    layer: 'biblical-patriarchs',
    start: -930,
    end: -870,
    description: 'Third King of Judah. Commenced religious reforms and ruled for 41 years.',
    source: '1 Kings 15, 2 Chronicles 14-16',
    fatherId: 'abijah'
  },
  {
    id: 'jehoshaphat',
    name: 'King Jehoshaphat',
    type: 'lifespan',
    layer: 'biblical-patriarchs',
    start: -908,
    end: -848,
    description: 'Fourth King of Judah. Formed an alliance with the northern kingdom of Israel. Reigned 25 years.',
    source: '1 Kings 22, 2 Chronicles 17-20',
    fatherId: 'asa'
  },
  {
    id: 'jehoram',
    name: 'King Jehoram',
    type: 'lifespan',
    layer: 'biblical-patriarchs',
    start: -882,
    end: -841,
    description: 'Fifth King of Judah. Married Athaliah, daughter of Ahab and Jezebel, introducing pagan worship. Reigned 8 years.',
    source: '2 Kings 8, 2 Chronicles 21',
    fatherId: 'jehoshaphat'
  },
  {
    id: 'ahaziah',
    name: 'King Ahaziah',
    type: 'lifespan',
    layer: 'biblical-patriarchs',
    start: -864,
    end: -841,
    description: 'Sixth King of Judah. Reigned for only one year before being slain by Jehu.',
    source: '2 Kings 8-9, 2 Chronicles 22',
    fatherId: 'jehoram'
  },
  {
    id: 'joash',
    name: 'King Joash',
    type: 'lifespan',
    layer: 'biblical-patriarchs',
    start: -843,
    end: -796,
    description: 'Seventh King of Judah, crowned at age seven after hiding from Athaliah. Repaired the Temple. Reigned 40 years.',
    source: '2 Kings 11-12, 2 Chronicles 24',
    fatherId: 'ahaziah'
  },
  {
    id: 'amaziah',
    name: 'King Amaziah',
    type: 'lifespan',
    layer: 'biblical-patriarchs',
    start: -821,
    end: -767,
    description: 'Eighth King of Judah. Defeated the Edomites but was later assassinated. Reigned 29 years.',
    source: '2 Kings 14, 2 Chronicles 25',
    fatherId: 'joash'
  },
  {
    id: 'uzziah',
    name: 'King Uzziah',
    type: 'lifespan',
    layer: 'biblical-patriarchs',
    start: -799,
    end: -740,
    description: 'Ninth King of Judah. Struck with leprosy for offering incense in the Temple. Reigned 52 years.',
    source: '2 Kings 15, 2 Chronicles 26',
    fatherId: 'amaziah'
  },
  {
    id: 'jotham',
    name: 'King Jotham',
    type: 'lifespan',
    layer: 'biblical-patriarchs',
    start: -773,
    end: -732,
    description: 'Tenth King of Judah. Built the Upper Gate of the Temple. Reigned 16 years.',
    source: '2 Kings 15, 2 Chronicles 27',
    fatherId: 'uzziah'
  },
  {
    id: 'ahaz',
    name: 'King Ahaz',
    type: 'lifespan',
    layer: 'biblical-patriarchs',
    start: -755,
    end: -715,
    description: 'Eleventh King of Judah. Renowned for wickedness and sacrificing his sons. Reigned 16 years.',
    source: '2 Kings 16, 2 Chronicles 28',
    fatherId: 'jotham'
  },
  {
    id: 'hezekiah',
    name: 'King Hezekiah',
    type: 'lifespan',
    layer: 'biblical-patriarchs',
    start: -739,
    end: -687,
    description: 'Twelfth King of Judah. Reorganized Temple worship and constructed Siloam Tunnel to resist Assyria. Reigned 29 years.',
    source: '2 Kings 18-20, 2 Chronicles 29-32',
    fatherId: 'ahaz'
  },
  {
    id: 'manasseh',
    name: 'King Manasseh',
    type: 'lifespan',
    layer: 'biblical-patriarchs',
    start: -709,
    end: -643,
    description: 'Thirteenth King of Judah. The longest-reigning Judean monarch (55 years), known for cruelty but repented in captivity.',
    source: '2 Kings 21, 2 Chronicles 33',
    fatherId: 'hezekiah'
  },
  {
    id: 'amon',
    name: 'King Amon',
    type: 'lifespan',
    layer: 'biblical-patriarchs',
    start: -664,
    end: -640,
    description: 'Fourteenth King of Judah, assassinated by his own servants after a brief two-year reign.',
    source: '2 Kings 21, 2 Chronicles 33',
    fatherId: 'manasseh'
  },
  {
    id: 'josiah',
    name: 'King Josiah',
    type: 'lifespan',
    layer: 'biblical-patriarchs',
    start: -648,
    end: -609,
    description: 'Fifteenth King of Judah. Enacted massive religious reforms after rediscovering the Book of the Law. Reigned 31 years.',
    source: '2 Kings 22-23, 2 Chronicles 34-35',
    fatherId: 'amon'
  },
  {
    id: 'jehoiakim',
    name: 'King Jehoiakim',
    type: 'lifespan',
    layer: 'biblical-patriarchs',
    start: -634,
    end: -598,
    description: 'Sixteenth King of Judah. Carried away captive by Nebuchadnezzar. Reigned 11 years.',
    source: '2 Kings 23-24, 2 Chronicles 36',
    fatherId: 'josiah'
  },
  {
    id: 'jeconiah',
    name: 'King Jeconiah',
    type: 'lifespan',
    layer: 'biblical-patriarchs',
    start: -616,
    end: -561,
    description: 'Seventeenth King of Judah. Exiled to Babylon where he was eventually released from prison in old age.',
    source: '2 Kings 24-25, 2 Chronicles 36',
    fatherId: 'jehoiakim'
  },
  {
    id: 'shealtiel',
    name: 'Shealtiel',
    type: 'lifespan',
    layer: 'biblical-patriarchs',
    start: -590,
    end: -530,
    description: 'Son of King Jeconiah. Born in Babylonian captivity.',
    source: '1 Chronicles 3:17, Matthew 1:12',
    fatherId: 'jeconiah'
  },
  {
    id: 'zerubbabel',
    name: 'Zerubbabel',
    type: 'lifespan',
    layer: 'biblical-patriarchs',
    start: -560,
    end: -490,
    description: 'Grandson of Jeconiah. Headed the first return of exiles from Babylon and laid the foundations of the Second Temple.',
    source: 'Ezra 3, Haggai 1, Matthew 1:12',
    fatherId: 'shealtiel'
  },
  {
    id: 'abiud',
    name: 'Abiud',
    type: 'lifespan',
    layer: 'biblical-patriarchs',
    start: -510,
    end: -440,
    description: 'Son of Zerubbabel. Mentioned in the Messianic genealogy of Matthew.',
    source: 'Matthew 1:13',
    fatherId: 'zerubbabel'
  },
  {
    id: 'eliakim',
    name: 'Eliakim',
    type: 'lifespan',
    layer: 'biblical-patriarchs',
    start: -470,
    end: -400,
    description: 'Son of Abiud. Part of the post-exile genealogy of Jesus Christ.',
    source: 'Matthew 1:13',
    fatherId: 'abiud'
  },
  {
    id: 'azor',
    name: 'Azor',
    type: 'lifespan',
    layer: 'biblical-patriarchs',
    start: -430,
    end: -360,
    description: 'Son of Eliakim, mentioned in the lineage of Joseph.',
    source: 'Matthew 1:13-14',
    fatherId: 'eliakim'
  },
  {
    id: 'zadok_pat',
    name: 'Zadok',
    type: 'lifespan',
    layer: 'biblical-patriarchs',
    start: -390,
    end: -320,
    description: 'Son of Azor. Ancestor of Jesus.',
    source: 'Matthew 1:14',
    fatherId: 'azor'
  },
  {
    id: 'achim',
    name: 'Achim',
    type: 'lifespan',
    layer: 'biblical-patriarchs',
    start: -350,
    end: -280,
    description: 'Son of Zadok. Ancestor of Jesus.',
    source: 'Matthew 1:14',
    fatherId: 'zadok_pat'
  },
  {
    id: 'eliud',
    name: 'Eliud',
    type: 'lifespan',
    layer: 'biblical-patriarchs',
    start: -310,
    end: -240,
    description: 'Son of Achim. Ancestor of Jesus.',
    source: 'Matthew 1:14-15',
    fatherId: 'achim'
  },
  {
    id: 'eleazar_pat',
    name: 'Eleazar',
    type: 'lifespan',
    layer: 'biblical-patriarchs',
    start: -270,
    end: -200,
    description: 'Son of Eliud. Ancestor of Jesus.',
    source: 'Matthew 1:15',
    fatherId: 'eliud'
  },
  {
    id: 'matthan',
    name: 'Matthan',
    type: 'lifespan',
    layer: 'biblical-patriarchs',
    start: -230,
    end: -160,
    description: 'Son of Eleazar. Grandfather of Joseph.',
    source: 'Matthew 1:15',
    fatherId: 'eleazar_pat'
  },
  {
    id: 'jacob_pat',
    name: 'Jacob of Nazareth',
    type: 'lifespan',
    layer: 'biblical-patriarchs',
    start: -190,
    end: -120,
    description: 'Son of Matthan and father of Joseph the carpenter.',
    source: 'Matthew 1:15-16',
    fatherId: 'matthan'
  },
  {
    id: 'joseph_pat',
    name: 'Joseph of Nazareth',
    type: 'lifespan',
    layer: 'biblical-patriarchs',
    start: -45,
    end: 18,
    description: 'Husband of Mary, foster-father of Jesus Christ, carpenter of Nazareth.',
    source: 'Matthew 1, Luke 2',
    fatherId: 'jacob_pat',
    spouseId: 'mary_pat'
  },
  {
    id: 'mary_pat',
    name: 'Virgin Mary',
    type: 'lifespan',
    layer: 'biblical-patriarchs',
    start: -25,
    end: 45,
    description: 'Mother of Jesus Christ, highly favored by God.',
    source: 'Luke 1-2, Matthew 1',
    spouseId: 'joseph_pat'
  },
  {
    id: 'jesus',
    name: 'Jesus Christ',
    type: 'lifespan',
    layer: 'biblical-patriarchs',
    start: -4,
    end: 30,
    description: 'The central figure of Christianity, the Son of God, and the Messiah in Christian theology.',
    source: 'Gospels',
    fatherId: 'joseph_pat',
    motherId: 'mary_pat'
  },
  {
    id: 'mary_magdalene',
    name: 'Mary Magdalene',
    type: 'lifespan',
    layer: 'biblical-patriarchs',
    start: 3,
    end: 63,
    description: 'Faithful disciple of Jesus Christ, witness to His crucifixion and burial, and the first to witness His resurrection.',
    source: 'Gospels'
  },
  {
    id: 'peter_apostle',
    name: 'Peter the Apostle',
    type: 'lifespan',
    layer: 'biblical-patriarchs',
    start: -1,
    end: 67,
    description: 'Leader of the early Church, chief of the Apostles, martyred in Rome under Nero.',
    source: 'Gospels, Acts'
  },
  {
    id: 'paul_apostle',
    name: 'Paul the Apostle',
    type: 'lifespan',
    layer: 'biblical-patriarchs',
    start: 5,
    end: 67,
    description: 'Apostle to the Gentiles, author of many epistles, martyred in Rome.',
    source: 'Acts, Pauline Epistles'
  },
  {
    id: 'john_apostle',
    name: 'John the Apostle',
    type: 'lifespan',
    layer: 'biblical-patriarchs',
    start: 6,
    end: 100,
    description: 'The beloved disciple, author of the Gospel of John and Revelation, exiled on Patmos.',
    source: 'Gospels, Revelation'
  },

  // ==========================================
  // MEROVINGIAN BLOODLINES (400 - 800 AD)
  // ==========================================
  {
    id: 'sarah_damaris',
    name: 'Sarah Damaris',
    type: 'lifespan',
    layer: 'merovingian-bloodlines',
    start: 33,
    end: 100,
    description: 'In alternative historical legends, the daughter of Jesus and Mary Magdalene who fled to Gaul, forming the traditional foundation of the Merovingian lineage.',
    source: 'Holy Blood, Holy Grail / Lore',
    fatherId: 'jesus',
    motherId: 'mary_magdalene'
  },
  {
    id: 'faramund',
    name: 'Faramund',
    type: 'lifespan',
    layer: 'merovingian-bloodlines',
    start: 370,
    end: 427,
    description: 'Semi-legendary first king of the Salian Franks, traditional ancestor of the Merovingian kings.',
    source: 'Liber Historiae Francorum',
    motherId: 'sarah_damaris' // Traditional spiritual/secret lineage connection
  },
  {
    id: 'chlodio',
    name: 'Chlodio the Long-Haired',
    type: 'lifespan',
    layer: 'merovingian-bloodlines',
    start: 395,
    end: 447,
    description: 'King of the Salian Franks at Dispargum. Captured Tournai and Cambrai from the Romans.',
    source: 'Gregory of Tours',
    fatherId: 'faramund'
  },
  {
    id: 'merovech',
    name: 'Merovech',
    type: 'lifespan',
    layer: 'merovingian-bloodlines',
    start: 415,
    end: 457,
    description: 'The legendary founder of the Merovingian dynasty, said to have been born of a sea monster Quinotaur.',
    source: 'Gregory of Tours',
    fatherId: 'chlodio'
  },
  {
    id: 'childeric_i',
    name: 'Childeric I',
    type: 'lifespan',
    layer: 'merovingian-bloodlines',
    start: 437,
    end: 481,
    description: 'Merovingian King of the Salian Franks. Allied with Romans against Visigoths. His rich tomb was found in 1653.',
    source: 'Gregory of Tours',
    fatherId: 'merovech'
  },
  {
    id: 'clovis_i',
    name: 'King Clovis I',
    type: 'lifespan',
    layer: 'merovingian-bloodlines',
    start: 466,
    end: 511,
    description: 'First King of all the Franks, united the tribes, defeated the Romans at Soissons, and converted to Catholicism.',
    source: 'Gregory of Tours',
    fatherId: 'childeric_i',
    spouseId: 'clotilde'
  },
  {
    id: 'clotilde',
    name: 'Queen Clotilde',
    type: 'lifespan',
    layer: 'merovingian-bloodlines',
    start: 475,
    end: 545,
    description: 'Burgundian princess, wife of Clovis I, who successfully persuaded her husband to convert to Christianity.',
    source: 'Gregory of Tours',
    spouseId: 'clovis_i'
  },
  {
    id: 'chlothar_i',
    name: 'Chlothar I',
    type: 'lifespan',
    layer: 'merovingian-bloodlines',
    start: 497,
    end: 561,
    description: 'King of the Franks. Re-united the Frankish realms after his brothers died. Lived 64 years.',
    source: 'Gregory of Tours',
    fatherId: 'clovis_i',
    motherId: 'clotilde'
  },
  {
    id: 'chilperic_i',
    name: 'Chilperic I',
    type: 'lifespan',
    layer: 'merovingian-bloodlines',
    start: 539,
    end: 584,
    description: 'King of Neustria. Famous for his fierce feuds with his brother Sigebert and Queen Brunhilda.',
    source: 'Gregory of Tours',
    fatherId: 'chlothar_i'
  },
  {
    id: 'chlothar_ii',
    name: 'Chlothar II the Great',
    type: 'lifespan',
    layer: 'merovingian-bloodlines',
    start: 584,
    end: 629,
    description: 'King of Neustria, later sole King of the Franks. Promulgated the Edict of Paris.',
    source: 'Gregory of Tours',
    fatherId: 'chilperic_i'
  },
  {
    id: 'dagobert_i',
    name: 'King Dagobert I',
    type: 'lifespan',
    layer: 'merovingian-bloodlines',
    start: 603,
    end: 639,
    description: 'The last Merovingian king to wield real power. Built the Basilica of Saint-Denis.',
    source: 'Gesta Dagoberti',
    fatherId: 'chlothar_ii'
  },
  {
    id: 'clovis_ii',
    name: 'Clovis II',
    type: 'lifespan',
    layer: 'merovingian-bloodlines',
    start: 633,
    end: 657,
    description: 'King of Neustria and Burgundy, ruled under the regency of his mother and Mayor of the Palace Erchinoald.',
    source: 'Gregory of Tours',
    fatherId: 'dagobert_i'
  },
  {
    id: 'childeric_ii',
    name: 'Childeric II',
    type: 'lifespan',
    layer: 'merovingian-bloodlines',
    start: 653,
    end: 675,
    description: 'King of Austrasia, Neustria, and Burgundy. Assassinated during a hunting trip.',
    source: 'Gregory of Tours',
    fatherId: 'clovis_ii'
  },
  {
    id: 'dagobert_ii',
    name: 'King Dagobert II',
    type: 'lifespan',
    layer: 'merovingian-bloodlines',
    start: 650,
    end: 679,
    description: 'Assassinated Merovingian king. In alternative lore, his survival and lineage form the foundation of the Priory of Sion.',
    source: 'Gregory of Tours / Lore',
    fatherId: 'childeric_ii'
  },

  // ==========================================
  // ROYAL BLOODLINES (750 - 2026 AD)
  // ==========================================
  {
    id: 'charlemagne',
    name: 'Charlemagne',
    type: 'lifespan',
    layer: 'royal-bloodlines',
    start: 742,
    end: 814,
    description: 'King of the Franks, Lombards, and Emperor of the Romans. United Western Europe. Father of Europe.',
    source: 'Einhard\'s Life of Charlemagne',
    fatherId: 'dagobert_ii' // Connected back to Merovingian lineage
  },
  {
    id: 'judith_flanders',
    name: 'Judith of Flanders',
    type: 'lifespan',
    layer: 'royal-bloodlines',
    start: 844,
    end: 870,
    description: 'Granddaughter of Charlemagne, Queen of Wessex by marriage, ancestor of the English royal line.',
    source: 'Anglo-Saxon Chronicle',
    fatherId: 'charlemagne' // Tracing path simplify
  },
  {
    id: 'alfred_the_great',
    name: 'Alfred the Great',
    type: 'lifespan',
    layer: 'royal-bloodlines',
    start: 849,
    end: 899,
    description: 'King of the Anglo-Saxons, defender of England against the Vikings, and promoter of literacy. Lived 50 years.',
    source: 'Asser\'s Life of King Alfred',
    motherId: 'judith_flanders' // Tracing path connection
  },
  {
    id: 'edward_elder',
    name: 'Edward the Elder',
    type: 'lifespan',
    layer: 'royal-bloodlines',
    start: 874,
    end: 924,
    description: 'King of the Anglo-Saxons, conquered Danish-held territories in East Anglia and the Midlands.',
    source: 'Anglo-Saxon Chronicle',
    fatherId: 'alfred_the_great'
  },
  {
    id: 'edmund_i',
    name: 'Edmund I',
    type: 'lifespan',
    layer: 'royal-bloodlines',
    start: 921,
    end: 946,
    description: 'King of the English, conquered Strathclyde and established political control over northern realms.',
    source: 'Anglo-Saxon Chronicle',
    fatherId: 'edward_elder'
  },
  {
    id: 'edgar_peaceful',
    name: 'Edgar the Peaceful',
    type: 'lifespan',
    layer: 'royal-bloodlines',
    start: 943,
    end: 975,
    description: 'King of the English. His reign marked the apex of Anglo-Saxon unity and peace.',
    source: 'Anglo-Saxon Chronicle',
    fatherId: 'edmund_i'
  },
  {
    id: 'aethelred_unready',
    name: 'Æthelred the Unready',
    type: 'lifespan',
    layer: 'royal-bloodlines',
    start: 966,
    end: 1016,
    description: 'King of the English. Paid Danegeld to buy off Viking raiders; reign plagued by Danish incursions.',
    source: 'Anglo-Saxon Chronicle',
    fatherId: 'edgar_peaceful'
  },
  {
    id: 'edmund_ironside',
    name: 'Edmund Ironside',
    type: 'lifespan',
    layer: 'royal-bloodlines',
    start: 990,
    end: 1016,
    description: 'King of the English. Led fierce resistance against Danish King Cnut, earning the nickname Ironside.',
    source: 'Anglo-Saxon Chronicle',
    fatherId: 'aethelred_unready'
  },
  {
    id: 'edward_exile',
    name: 'Edward the Exile',
    type: 'lifespan',
    layer: 'royal-bloodlines',
    start: 1016,
    end: 1057,
    description: 'Son of Edmund Ironside. Fled to Hungary during Cnut\'s reign and returned to England late in life.',
    source: 'Anglo-Saxon Chronicle',
    fatherId: 'edmund_ironside'
  },
  {
    id: 'margaret_scotland',
    name: 'Margaret of Scotland',
    type: 'lifespan',
    layer: 'royal-bloodlines',
    start: 1045,
    end: 1093,
    description: 'English princess, Queen of Scotland, canonized saint who introduced Catholic reforms to Scotland.',
    source: 'Life of Saint Margaret',
    fatherId: 'edward_exile',
    spouseId: 'malcolm_iii'
  },
  {
    id: 'malcolm_iii',
    name: 'Malcolm III of Scotland',
    type: 'lifespan',
    layer: 'royal-bloodlines',
    start: 1031,
    end: 1093,
    description: 'King of Scots, overthrew Macbeth, married Margaret of Scotland.',
    source: 'Chronicles of Scotland',
    spouseId: 'margaret_scotland'
  },
  {
    id: 'matilda_scotland',
    name: 'Matilda of Scotland',
    type: 'lifespan',
    layer: 'royal-bloodlines',
    start: 1080,
    end: 1118,
    description: 'Daughter of Malcolm III and Margaret, Queen of England, married King Henry I.',
    source: 'William of Malmesbury',
    fatherId: 'malcolm_iii',
    motherId: 'margaret_scotland',
    spouseId: 'henry_i'
  },
  {
    id: 'henry_i',
    name: 'King Henry I',
    type: 'lifespan',
    layer: 'royal-bloodlines',
    start: 1068,
    end: 1135,
    description: 'King of England, son of William the Conqueror, consolidated royal administration.',
    source: 'Orderic Vitalis',
    fatherId: 'william_conqueror',
    spouseId: 'matilda_scotland'
  },
  {
    id: 'william_conqueror',
    name: 'William the Conqueror',
    type: 'lifespan',
    layer: 'royal-bloodlines',
    start: 1028,
    end: 1087,
    description: 'Duke of Normandy, conquered England in 1066, built the Tower of London, compiled Domesday Book.',
    source: 'William of Poitiers'
  },
  {
    id: 'empress_matilda',
    name: 'Empress Matilda',
    type: 'lifespan',
    layer: 'royal-bloodlines',
    start: 1102,
    end: 1167,
    description: 'Daughter of Henry I, Holy Roman Empress, claimant to the English throne during "The Anarchy" civil war.',
    source: 'Gesta Stephani',
    fatherId: 'henry_i',
    motherId: 'matilda_scotland'
  },
  {
    id: 'henry_ii',
    name: 'King Henry II',
    type: 'lifespan',
    layer: 'royal-bloodlines',
    start: 1133,
    end: 1189,
    description: 'First Plantagenet King of England, ruled vast Angevin Empire, clashed with Thomas Becket.',
    source: 'Chronicles of Henry II',
    motherId: 'empress_matilda'
  },
  {
    id: 'king_john',
    name: 'King John (Lackland)',
    type: 'lifespan',
    layer: 'royal-bloodlines',
    start: 1166,
    end: 1216,
    description: 'King of England, sealed Magna Carta at Runnymede under pressure from rebel barons.',
    source: 'Roger of Wendover',
    fatherId: 'henry_ii'
  },
  {
    id: 'henry_iii',
    name: 'King Henry III',
    type: 'lifespan',
    layer: 'royal-bloodlines',
    start: 1207,
    end: 1272,
    description: 'King of England, rebuilt Westminster Abbey, faced Simon de Montfort\'s parliament reforms.',
    source: 'Matthew Paris',
    fatherId: 'king_john'
  },
  {
    id: 'edward_i',
    name: 'King Edward I (Longshanks)',
    type: 'lifespan',
    layer: 'royal-bloodlines',
    start: 1239,
    end: 1307,
    description: 'King of England, conquered Wales, fought William Wallace in Scotland, established Model Parliament.',
    source: 'Chronicles of Edward I',
    fatherId: 'henry_iii'
  },
  {
    id: 'edward_ii',
    name: 'King Edward II',
    type: 'lifespan',
    layer: 'royal-bloodlines',
    start: 1284,
    end: 1327,
    description: 'King of England, defeated at Bannockburn, deposed by his wife Isabella and Roger Mortimer.',
    source: 'Vita Edwardi Secundi',
    fatherId: 'edward_i'
  },
  {
    id: 'edward_iii',
    name: 'King Edward III',
    type: 'lifespan',
    layer: 'royal-bloodlines',
    start: 1312,
    end: 1377,
    description: 'King of England. Claimed French crown, starting Hundred Years\' War. Created Order of the Garter.',
    source: 'Jean Froissart\'s Chronicles',
    fatherId: 'edward_ii'
  },
  {
    id: 'john_of_gaunt',
    name: 'John of Gaunt',
    type: 'lifespan',
    layer: 'royal-bloodlines',
    start: 1340,
    end: 1399,
    description: 'Duke of Lancaster, son of Edward III, ancestor of Lancaster kings and Beaufort line.',
    source: 'Froissart\'s Chronicles',
    fatherId: 'edward_iii'
  },
  {
    id: 'john_beaufort',
    name: 'John Beaufort, 1st Earl of Somerset',
    type: 'lifespan',
    layer: 'royal-bloodlines',
    start: 1373,
    end: 1410,
    description: 'Eldest son of John of Gaunt and Katherine Swynford, legitimized by Richard II.',
    source: 'Official Records',
    fatherId: 'john_of_gaunt'
  },
  {
    id: 'somerset_pat',
    name: 'John Beaufort, 1st Duke of Somerset',
    type: 'lifespan',
    layer: 'royal-bloodlines',
    start: 1404,
    end: 1444,
    description: 'Military commander in France, father of Margaret Beaufort.',
    source: 'War Records',
    fatherId: 'john_beaufort'
  },
  {
    id: 'margaret_beaufort',
    name: 'Lady Margaret Beaufort',
    type: 'lifespan',
    layer: 'royal-bloodlines',
    start: 1443,
    end: 1509,
    description: 'Matriarch of the House of Tudor, mother of King Henry VII. Major figure in Wars of the Roses.',
    source: 'Tudor Biographies',
    fatherId: 'somerset_pat'
  },
  {
    id: 'henry_vii',
    name: 'King Henry VII',
    type: 'lifespan',
    layer: 'royal-bloodlines',
    start: 1457,
    end: 1509,
    description: 'First Tudor King, won crown at Bosworth Field, ended Wars of the Roses by marrying Elizabeth of York.',
    source: 'Polydore Vergil',
    motherId: 'margaret_beaufort'
  },
  {
    id: 'henry_viii',
    name: 'King Henry VIII',
    type: 'lifespan',
    layer: 'royal-bloodlines',
    start: 1491,
    end: 1547,
    description: 'King of England, broke from Rome to establish Church of England, married six times. Rule of reform.',
    source: 'Edward Hall\'s Chronicle',
    fatherId: 'henry_vii'
  },
  {
    id: 'elizabeth_i',
    name: 'Queen Elizabeth I',
    type: 'lifespan',
    layer: 'royal-bloodlines',
    start: 1533,
    end: 1603,
    description: 'The Virgin Queen. Defeated Spanish Armada, presided over Elizabethan golden age of literature.',
    source: 'William Camden',
    fatherId: 'henry_viii'
  },
  {
    id: 'mary_queen_of_scots',
    name: 'Mary, Queen of Scots',
    type: 'lifespan',
    layer: 'royal-bloodlines',
    start: 1542,
    end: 1587,
    description: 'Queen of Scotland, claimant to English throne, executed by Elizabeth I.',
    source: 'George Buchanan',
    fatherId: 'henry_viii' // Tracing path simplify
  },
  {
    id: 'james_vi_i',
    name: 'King James I & VI',
    type: 'lifespan',
    layer: 'royal-bloodlines',
    start: 1566,
    end: 1625,
    description: 'Union of Crowns (Scotland & England), commissioned King James Bible translation.',
    source: 'State Papers',
    motherId: 'mary_queen_of_scots'
  },
  {
    id: 'elizabeth_stuart',
    name: 'Elizabeth Stuart (Bohemia)',
    type: 'lifespan',
    layer: 'royal-bloodlines',
    start: 1596,
    end: 1662,
    description: 'The Winter Queen of Bohemia, daughter of James I, grandmother of King George I.',
    source: 'Letters of Elizabeth Stuart',
    fatherId: 'james_vi_i'
  },
  {
    id: 'sophia_hanover',
    name: 'Sophia of Hanover',
    type: 'lifespan',
    layer: 'royal-bloodlines',
    start: 1630,
    end: 1714,
    description: 'Electress of Hanover, declared heiress of Great Britain by Act of Settlement 1701.',
    source: 'Memoirs of Sophia',
    motherId: 'elizabeth_stuart'
  },
  {
    id: 'george_i',
    name: 'King George I',
    type: 'lifespan',
    layer: 'royal-bloodlines',
    start: 1660,
    end: 1727,
    description: 'First Hanoverian King of Great Britain. Did not speak fluent English, relied on Cabinet government.',
    source: 'Ragnhild Hatton',
    motherId: 'sophia_hanover'
  },
  {
    id: 'george_ii',
    name: 'King George II',
    type: 'lifespan',
    layer: 'royal-bloodlines',
    start: 1683,
    end: 1760,
    description: 'Last British monarch to lead an army in battle (Dettingen). Reigned 33 years.',
    source: 'Lord Hervey\'s Memoirs',
    fatherId: 'george_i'
  },
  {
    id: 'frederick_prince',
    name: 'Frederick, Prince of Wales',
    type: 'lifespan',
    layer: 'royal-bloodlines',
    start: 1707,
    end: 1751,
    description: 'Eldest son of George II, pre-deceased his father; father of King George III.',
    source: 'Court Journals',
    fatherId: 'george_ii'
  },
  {
    id: 'george_iii',
    name: 'King George III',
    type: 'lifespan',
    layer: 'royal-bloodlines',
    start: 1738,
    end: 1820,
    description: 'King during American Revolution and Napoleonic Wars. Longest-reigning king (59 years).',
    source: 'Letters of George III',
    fatherId: 'frederick_prince'
  },
  {
    id: 'edward_kent',
    name: 'Prince Edward, Duke of Kent',
    type: 'lifespan',
    layer: 'royal-bloodlines',
    start: 1767,
    end: 1820,
    description: 'Fourth son of George III, military commander in Canada, father of Queen Victoria.',
    source: 'Royal Archives',
    fatherId: 'george_iii'
  },
  {
    id: 'queen_victoria',
    name: 'Queen Victoria',
    type: 'lifespan',
    layer: 'royal-bloodlines',
    start: 1819,
    end: 1901,
    description: 'Empress of India. Her reign of 63 years marked the expansion of the British Empire. Grandmother of Europe.',
    source: 'Queen Victoria\'s Journals',
    fatherId: 'edward_kent'
  },
  {
    id: 'edward_vii',
    name: 'King Edward VII',
    type: 'lifespan',
    layer: 'royal-bloodlines',
    start: 1841,
    end: 1910,
    description: 'First monarch of House of Saxe-Coburg and Gotha (later Windsor), fostered entente cordiale.',
    source: 'Philip Magnus',
    motherId: 'queen_victoria'
  },
  {
    id: 'george_v',
    name: 'King George V',
    type: 'lifespan',
    layer: 'royal-bloodlines',
    start: 1865,
    end: 1936,
    description: 'King during WWI. Changed royal house name to Windsor. Inaugurated Christmas broadcasts.',
    source: 'Harold Nicolson',
    fatherId: 'edward_vii'
  },
  {
    id: 'george_vi',
    name: 'King George VI',
    type: 'lifespan',
    layer: 'royal-bloodlines',
    start: 1895,
    end: 1952,
    description: 'King during WWII. Symbol of national resolve after his brother abdicated. Lived 56 years.',
    source: 'John Wheeler-Bennett',
    fatherId: 'george_v'
  },
  {
    id: 'queen_elizabeth_ii',
    name: 'Queen Elizabeth II',
    type: 'lifespan',
    layer: 'royal-bloodlines',
    start: 1926,
    end: 2022,
    description: 'Britain\'s longest-reigning monarch (70 years), oversaw post-war transition and Commonwealth growth.',
    source: 'Official Records',
    fatherId: 'george_vi'
  },
  {
    id: 'king_charles_iii',
    name: 'King Charles III',
    type: 'lifespan',
    layer: 'royal-bloodlines',
    start: 1948,
    end: 2026,
    description: 'Current reigning Monarch of the United Kingdom and Commonwealth realms, crowned in 2023.',
    source: 'Official Records',
    motherId: 'queen_elizabeth_ii'
  },
  // ==========================================
  // ENOCHIAN LORE (WATCHERS & GIANTS)
  // ==========================================
  {
    id: 'watcher_descent',
    name: 'Descent of the Watchers',
    type: 'event',
    layer: 'enochian-lore',
    start: -3400,
    description: 'According to the Book of Enoch, 200 angels (Watchers) led by Semjaza descended upon Mount Hermon, swearing an oath to take human wives and teach them forbidden secrets.',
    source: 'Book of Enoch 6'
  },
  {
    id: 'semjaza',
    name: 'Semjaza (Watcher Leader)',
    type: 'lifespan',
    layer: 'enochian-lore',
    start: -3400,
    end: -2950,
    description: 'Leader of the 200 Watchers. He taught humans root-cuttings and enchantments. Later bound by Michael in the valleys of the earth.',
    source: 'Book of Enoch 6-8'
  },
  {
    id: 'azazel',
    name: 'Azazel (Watcher Leader)',
    type: 'lifespan',
    layer: 'enochian-lore',
    start: -3400,
    end: -3000,
    description: 'A chief Watcher who taught men to make weapons, armor, and metallurgy, and women to paint their eyes and use dyes and cosmetics, corrupting humanity.',
    source: 'Book of Enoch 8, 10'
  },
  {
    id: 'enoch_ascension',
    name: 'Translation of Enoch',
    type: 'event',
    layer: 'enochian-lore',
    start: -3017,
    description: 'At the age of 365, Enoch was taken by God (translated) and walked with Him. He ascended to heaven, where he recorded the secrets of creation and the judgment of the Watchers.',
    source: 'Genesis 5:24, Book of Enoch'
  },
  {
    id: 'nephilim_era',
    name: 'The Nephilim Giants',
    type: 'lifespan',
    layer: 'enochian-lore',
    start: -3300,
    end: -2348,
    description: 'The gigantic offspring of the union between the Watchers and human daughters. They consumed the labor of men and filled the earth with violence, leading to the divine decree of the Flood.',
    source: 'Genesis 6:4, Book of Enoch 7',
    fatherId: 'semjaza'
  },
  {
    id: 'rephaim',
    name: 'Rephaim',
    type: 'lifespan',
    layer: 'biblical-patriarchs',
    start: -2100,
    end: -1000,
    description: 'An ancient race of giants who inhabited Canaan, Bashan, and Moab. Associated with King Og of Bashan and the valley of Rephaim.',
    source: 'Genesis 14:5, Deuteronomy 2:11, 3:11',
    isPeopleGroup: true,
    subLabel: 'Possible Nephilim Bloodline'
  },
  {
    id: 'anakim',
    name: 'Anakim',
    type: 'lifespan',
    layer: 'biblical-patriarchs',
    start: -1900,
    end: -1400,
    description: 'A formidable race of giants descended from Anak. They inhabited the hill country of Canaan, particularly Hebron (Kiriath-Arba).',
    source: 'Numbers 13:22, Deuteronomy 2:10-11, Joshua 14:15',
    isPeopleGroup: true,
    subLabel: 'Possible Nephilim Bloodline'
  },
  {
    id: 'emim',
    name: 'Emim',
    type: 'lifespan',
    layer: 'biblical-patriarchs',
    start: -2100,
    end: -1400,
    description: 'An ancient giant people who originally inhabited the land of Moab. Described as "a people great, and many, and tall, as the Anakim."',
    source: 'Genesis 14:5, Deuteronomy 2:10-11',
    isPeopleGroup: true,
    subLabel: 'Possible Nephilim Bloodline'
  },
  {
    id: 'zamzummim',
    name: 'Zamzummim',
    type: 'lifespan',
    layer: 'biblical-patriarchs',
    start: -2100,
    end: -1400,
    description: 'An ancient giant tribe also known as Zuzim, who inhabited the region of Ammon. Described as "a people great, and many, and tall, as the Anakim."',
    source: 'Genesis 14:5, Deuteronomy 2:20-21',
    isPeopleGroup: true,
    subLabel: 'Possible Nephilim Bloodline'
  },
  {
    id: 'horites',
    name: 'Horites',
    type: 'lifespan',
    layer: 'biblical-patriarchs',
    start: -2100,
    end: -1400,
    description: 'The ancient cave-dwelling inhabitants of Mount Seir (Edom) before being dispossessed and succeeded by the descendants of Esau (Edomites).',
    source: 'Genesis 14:6, 36:20-30, Deuteronomy 2:12',
    isPeopleGroup: true
  },
  {
    id: 'avim',
    name: 'Avim',
    type: 'lifespan',
    layer: 'biblical-patriarchs',
    start: -2100,
    end: -1400,
    description: 'The early inhabitants of southwest Canaan (near Gaza) who dwelt in villages as far as Hazerim, later destroyed and replaced by the Caphtorim (Philistines).',
    source: 'Deuteronomy 2:23, Joshua 13:3',
    isPeopleGroup: true
  },
  {
    id: 'perizzites',
    name: 'Perizzites',
    type: 'lifespan',
    layer: 'biblical-patriarchs',
    start: -2089,
    end: -950,
    description: 'A Canaanite people group who lived in the forested hill country of Ephraim and Judah. Mentioned regularly as inhabitants of the Promised Land.',
    source: 'Genesis 13:7, 15:20, Joshua 17:15, 1 Kings 9:20',
    isPeopleGroup: true
  },
  {
    id: 'kenites',
    name: 'Kenites',
    type: 'lifespan',
    layer: 'biblical-patriarchs',
    start: -1900,
    end: -700,
    description: 'A nomadic clan of metalworkers allied with Israel. Jethro, the father-in-law of Moses, was a Kenite. They inhabited the Wilderness of Arad.',
    source: 'Genesis 15:19, Judges 1:16, 4:11, 1 Samuel 15:6',
    isPeopleGroup: true
  },
  // ==========================================
  // FUTURE PROPHECY (BOOK OF REVELATION)
  // ==========================================
  {
    id: 'rev_tribulation',
    name: 'The Tribulation Period',
    type: 'lifespan',
    layer: 'future-prophecy',
    start: 2100,
    end: 2107,
    description: 'A 7-year eschatological period of global distress and divine judgments, marked by the opening of the seven seals, seven trumpets, and seven bowls of wrath.',
    source: 'Revelation 6-16'
  },
  {
    id: 'rev_two_witnesses',
    name: 'The Two Witnesses',
    type: 'lifespan',
    layer: 'future-prophecy',
    start: 2100,
    end: 2103,
    description: 'Two prophetic witnesses who preach in Jerusalem with power over nature, are killed by the Beast, and rise back to heaven after three and a half days.',
    source: 'Revelation 11:3-12'
  },
  {
    id: 'rev_antichrist',
    name: 'Rise of the Beast (Antichrist)',
    type: 'lifespan',
    layer: 'future-prophecy',
    start: 2103,
    end: 2107,
    description: 'The final 3.5 years (42 months) of the Tribulation where the Beast rules the earth, wages war against the saints, and enforces the Mark of the Beast.',
    source: 'Revelation 13'
  },
  {
    id: 'rev_second_coming',
    name: 'The Second Coming of Christ',
    type: 'event',
    layer: 'future-prophecy',
    start: 2107,
    description: 'Christ returns in glory with the armies of heaven on white horses, defeats the beast and the false prophet, and binds Satan in the abyss.',
    source: 'Revelation 19'
  },
  {
    id: 'rev_millennial_reign',
    name: 'The Millennial Reign',
    type: 'lifespan',
    layer: 'future-prophecy',
    start: 2107,
    end: 3107,
    description: 'A 1,000-year golden age of peace and righteousness where Christ reigns on earth with His saints, and the earth is filled with the knowledge of God.',
    source: 'Revelation 20:1-6'
  },
  {
    id: 'rev_final_judgment',
    name: 'The Great White Throne Judgment',
    type: 'event',
    layer: 'future-prophecy',
    start: 3107,
    description: 'Satan is cast into the Lake of Fire. All the dead, great and small, stand before the Great White Throne and are judged according to their works.',
    source: 'Revelation 20:11-15'
  },
  {
    id: 'rev_new_jerusalem',
    name: 'New Heaven, Earth & New Jerusalem',
    type: 'lifespan',
    layer: 'future-prophecy',
    start: 3108,
    end: 3500,
    description: 'God wipes away all tears. The holy city, New Jerusalem, descends out of heaven from God as a bride adorned for her husband, establishing eternity.',
    source: 'Revelation 21-22'
  },
  {
    id: 'operation-paperclip',
    name: 'Operation Paperclip',
    type: 'lifespan',
    layer: 'secret-gov-programs',
    start: 1945,
    end: 1959,
    description: 'A secret program of the Joint Intelligence Objectives Agency in which more than 1,600 German scientists, engineers, and technicians were recruited to the U.S. for government employment.',
    source: 'National Archives (NARA)'
  },
  {
    id: 'majestic-12',
    name: 'Majestic 12',
    type: 'event',
    layer: 'secret-gov-programs',
    start: 1947,
    description: 'A conspiracy theory regarding a secret committee of scientists, military leaders, and government officials formed by President Harry S. Truman to investigate alien spacecraft.',
    source: 'FBI Conspiratorial Archives'
  },
  {
    id: 'project-blue-book',
    name: 'Project Blue Book',
    type: 'lifespan',
    layer: 'secret-gov-programs',
    start: 1952,
    end: 1969,
    description: 'The systematic study of unidentified flying objects (UFOs) conducted by the United States Air Force, analyzing over 12,000 reports of aerial anomalies.',
    source: 'U.S. Air Force Records'
  },
  {
    id: 'project-mkultra',
    name: 'Project MKUltra',
    type: 'lifespan',
    layer: 'secret-gov-programs',
    start: 1953,
    end: 1973,
    description: 'A clandestine CIA mind control and chemical interrogation program utilizing drugs, sensory deprivation, and hypnosis on unwitting subjects.',
    source: 'CIA Declassified Archives'
  },
  {
    id: 'operation-northwoods',
    name: 'Operation Northwoods',
    type: 'event',
    layer: 'secret-gov-programs',
    start: 1962,
    description: 'A proposed false flag operation against Cuba, planning staged acts of terrorism on U.S. soil to justify military intervention, which was rejected by President John F. Kennedy.',
    source: 'Joint Chiefs of Staff Memorandums'
  },
  {
    id: 'montauk-project',
    name: 'Montauk Project',
    type: 'lifespan',
    layer: 'secret-gov-programs',
    start: 1970,
    end: 1983,
    description: 'A conspiracy theory alleging a series of secret United States government projects at Camp Hero, Montauk, Long Island, focused on exotic physics, time travel, and mind control.',
    source: 'Camp Hero Logs'
  },
  {
    id: 'project-stargate',
    name: 'Project Stargate',
    type: 'lifespan',
    layer: 'secret-gov-programs',
    start: 1978,
    end: 1995,
    description: 'A declassified U.S. Army unit established to investigate the potential of psychic phenomena, specifically remote viewing, for military and intelligence espionage.',
    source: 'DIA Declassified Documents'
  },
  {
    id: 'philadelphia-experiment',
    name: 'The Philadelphia Experiment',
    type: 'event',
    layer: 'secret-gov-programs',
    start: 1943,
    description: 'A rumored military experiment in which the destroyer escort USS Eldridge was allegedly rendered completely invisible and teleported from Philadelphia, Pennsylvania, to Norfolk, Virginia.',
    source: 'Fringe Physics Literature'
  },
  {
    id: 'operation-mockingbird',
    name: 'Operation Mockingbird',
    type: 'lifespan',
    layer: 'secret-gov-programs',
    start: 1951,
    end: 1976,
    description: 'A clandestine CIA campaign launched in the early 1950s to influence domestic and foreign media, recruiting leading American journalists into a network to present intelligence propaganda.',
    source: 'Church Committee Reports'
  },
  {
    id: 'operation-sea-spray',
    name: 'Operation Sea-Spray',
    type: 'event',
    layer: 'secret-gov-programs',
    start: 1950,
    description: 'A secret U.S. Navy biological warfare experiment in which the bacteria Serratia marcescens was sprayed over the San Francisco Bay Area to study vulnerability to biological attacks, causing multiple infections.',
    source: 'U.S. Senate Subcommittee Hearings'
  },
  {
    id: 'project-sunshine',
    name: 'Project Sunshine',
    type: 'lifespan',
    layer: 'secret-gov-programs',
    start: 1953,
    end: 1959,
    description: 'A clandestine research project by the AEC and USAF to determine the effects of radioactive fallout on human tissue, notoriously gathering baby tissue and bones without parental consent.',
    source: 'Atomic Energy Commission Records'
  },
  {
    id: 'project-horizon',
    name: 'Project Horizon',
    type: 'event',
    layer: 'secret-gov-programs',
    start: 1959,
    description: 'A secret military study proposing the establishment of a manned, fortified military outpost on the Moon to facilitate defense, communications, and space surveillance.',
    source: 'U.S. Department of the Army Declassified Files'
  },
  {
    id: 'project-iceworm',
    name: 'Project Iceworm',
    type: 'lifespan',
    layer: 'secret-gov-programs',
    start: 1959,
    end: 1967,
    description: 'A secret U.S. Army program to build a massive network of mobile nuclear missile launch sites under the Greenland ice sheet under the cover of Camp Century\'s scientific base.',
    source: 'Danish Foreign Policy Institute Reports'
  },
  {
    id: 'project-plowshare',
    name: 'Project Plowshare',
    type: 'lifespan',
    layer: 'secret-gov-programs',
    start: 1957,
    end: 1973,
    description: 'A program designed to utilize "peaceful nuclear explosions" for massive construction projects, such as digging canals, artificial harbors, and blasting mountain passes.',
    source: 'Lawrence Livermore National Laboratory Archives'
  },
  {
    id: 'project-1794',
    name: 'Project 1794',
    type: 'event',
    layer: 'secret-gov-programs',
    start: 1956,
    description: 'A secret military aeronautical development project with Avro Canada to build a supersonic, vertical take-off and landing (VTOL) flying saucer designed to intercept bombers.',
    source: 'Declassified USAF Records (Released 2012)'
  },
  {
    id: 'operation-gladio',
    name: 'Operation Gladio',
    type: 'lifespan',
    layer: 'secret-gov-programs',
    start: 1956,
    end: 1990,
    description: 'A clandestine NATO stay-behind network set up during the Cold War to organize armed resistance in the event of a Soviet invasion, which allegedly engaged in false flag operations.',
    source: 'Italian Parliamentary Investigations'
  },
  {
    id: 'operation-lac',
    name: 'Operation LAC',
    type: 'lifespan',
    layer: 'secret-gov-programs',
    start: 1957,
    end: 1958,
    description: 'A series of chemical warfare dispersal tests conducted by the U.S. Army, spraying zinc cadmium sulfide over vast areas of the United States to test dispersion patterns.',
    source: 'National Research Council Review'
  },
  {
    id: 'operation-chase',
    name: 'Operation CHASE',
    type: 'lifespan',
    layer: 'secret-gov-programs',
    start: 1964,
    end: 1970,
    description: 'A U.S. military program of disposing of chemical weapons and conventional munitions by loading them onto old cargo ships and deliberately sinking them in the deep Atlantic Ocean.',
    source: 'U.S. Navy Declassified Reports'
  },
  {
    id: 'operation-highjump',
    name: 'Operation Highjump',
    type: 'lifespan',
    layer: 'secret-gov-programs',
    start: 1946,
    end: 1947,
    description: 'A massive 1946–1947 US Navy expedition to Antarctica led by Admiral Richard E. Byrd, which reportedly encountered advanced disc-shaped aircraft.',
    source: 'Declassified Admiral Byrd Logs'
  },
  {
    id: 'timeline-mayan-civilization',
    name: 'Mayan Civilization',
    type: 'lifespan',
    layer: 'ancient-civilizations',
    start: -2000,
    end: 1697,
    description: 'Mesoamerican civilization noted for its logo-syllabic script, art, architecture, mathematics, calendar, and astronomical system.',
    source: 'Historical Chronology',
    isPeopleGroup: true
  },
  {
    id: 'timeline-aztec-civilization',
    name: 'Aztec Civilization',
    type: 'lifespan',
    layer: 'ancient-civilizations',
    start: 1300,
    end: 1521,
    description: 'Mesoamerican empire centered in the Valley of Mexico, building Tenochtitlan and leaving massive monuments like the Sun and Moon pyramids.',
    source: 'Mesoamerican History',
    isPeopleGroup: true
  },
  {
    id: 'timeline-hopi-tribe',
    name: 'Hopi Tribe',
    type: 'lifespan',
    layer: 'ancient-civilizations',
    start: 500,
    end: 2026,
    description: 'Native American nation in northeastern Arizona, descended from the Ancestral Puebloans, preserving ancient oral histories of subterranean migrations and Kachina guides.',
    source: 'Indigenous Oral Traditions',
    isPeopleGroup: true
  },
    {
      id: 'timeline-mound-builders',
      name: 'The Mound Builders',
      type: 'lifespan',
      layer: 'ancient-civilizations',
      start: -3500,
      end: 1500,
      description: 'Various pre-columbian Native American societies (Adena, Hopewell, Mississippian) who built massive earthen mounds for burial, residential, and ceremonial use.',
      source: 'Smithsonian Archaeological Records',
      isPeopleGroup: true
    },
    {
      id: 'nicolas-flamel',
      name: 'Nicolas Flamel',
      type: 'lifespan',
      layer: 'alchemy-occult',
      start: 1330,
      end: 1418,
      description: 'French scribe and manuscript seller who gained a posthumous reputation as a legendary alchemist who succeeded in creating the Philosopher\'s Stone.',
      source: 'Historical Alchemical Records'
    },
    {
      id: 'evt-flamel-stone',
      name: 'Nicolas Flamel\'s Stone Creation',
      type: 'event',
      layer: 'alchemy-occult',
      start: 1382,
      description: 'Nicolas Flamel allegedly succeeds in the transmutation of mercury into silver, and later gold, using the Philosopher\'s Stone.',
      source: 'Esoteric Legend'
    },
    {
      id: 'isaac-newton',
      name: 'Sir Isaac Newton',
      type: 'lifespan',
      layer: 'alchemy-occult',
      start: 1643,
      end: 1727,
      description: 'English physicist, mathematician, and alchemist who spent a vast portion of his life translating and studying alchemical manuscripts (such as the Emerald Tablet) and esoteric biblical prophecy.',
      source: 'Cambridge Newton Papers'
    },
    {
      id: 'evt-newton-alchemy',
      name: 'Newton\'s Alchemical Lab Studies',
      type: 'event',
      layer: 'alchemy-occult',
      start: 1669,
      description: 'Isaac Newton begins extensive private alchemical experiments at Cambridge, running a private lab in Trinity College.',
      source: 'Cambridge Newton Papers'
    },
    {
      id: 'evt-newton-emerald-tablet',
      name: 'Newton Translates Emerald Tablet',
      type: 'event',
      layer: 'alchemy-occult',
      start: 1680,
      description: 'Isaac Newton translates the Emerald Tablet of Hermes Trismegistus, leaving behind a famous English translation detailing "As above, so below."',
      source: 'Newton Alchemical Manuscripts'
    },
    {
      id: 'evt-golden-dawn-founded',
      name: 'Hermetic Order of the Golden Dawn',
      type: 'event',
      layer: 'alchemy-occult',
      start: 1888,
      description: 'The Hermetic Order of the Golden Dawn is founded in London, establishing a secret society dedicated to the study of the occult, Hermeticism, Kabbalah, and ceremonial magic.',
      source: 'Golden Dawn Historical Records'
    },
    {
      id: 'aleister-crowley',
      name: 'Aleister Crowley',
      type: 'lifespan',
      layer: 'alchemy-occult',
      start: 1875,
      end: 1947,
      description: 'English occultist, ceremonial magician, and novelist who founded the religion of Thelema, famously known as the Great Beast 666.',
      source: 'Occult Biography Archive'
    },
    {
      id: 'evt-crowley-boleskine',
      name: 'Crowley Purchases Boleskine House',
      type: 'event',
      layer: 'alchemy-occult',
      start: 1899,
      description: 'Aleister Crowley purchases Boleskine House to perform the six-month Sacred Magic of Abramelin the Mage ritual to contact his Holy Guardian Angel.',
      source: 'The Confessions of Aleister Crowley'
    },
    {
      id: 'evt-book-of-the-law',
      name: 'Reception of Liber AL vel Legis',
      type: 'event',
      layer: 'alchemy-occult',
      start: 1904,
      description: 'Aleister Crowley receives the "Book of the Law" in Cairo, Egypt, channeled from a discarnate entity named Aiwass, establishing the Law of Thelema: "Do what thou wilt."',
      source: 'Thelema Holy Books'
    },
    {
      id: 'jack-parsons',
      name: 'Jack Parsons',
      type: 'lifespan',
      layer: 'alchemy-occult',
      start: 1914,
      end: 1952,
      description: 'American rocket propulsion researcher, co-founder of JPL, and O.T.O. occultist who collaborated with L. Ron Hubbard in the Babalon Working sex magic rituals.',
      source: 'Strange Angel (George Pendle)'
    },
    {
      id: 'evt-babalon-working',
      name: 'The Babalon Working',
      type: 'event',
      layer: 'alchemy-occult',
      start: 1946,
      description: 'Jack Parsons and L. Ron Hubbard perform the Babalon Working, a series of sex magic rituals in Pasadena intended to manifest the divine feminine archetype on Earth.',
      source: 'Agape Lodge Records / Parsons Journal'
    }
  ];

export interface TimelineLocation {
  lng: number;
  lat: number;
  locationName: string;
  category?: string;
}

export const TIMELINE_LOCATIONS: Record<string, TimelineLocation> = {
  // Biblical Patriarchs (Figures)
  'adam': { lng: 47.432, lat: 31.015, locationName: 'Garden of Eden', category: 'Biblical Figures' },
  'eve': { lng: 47.432, lat: 31.015, locationName: 'Garden of Eden', category: 'Biblical Figures' },
  'cain': { lng: 49.500, lat: 32.000, locationName: 'Land of Nod', category: 'Biblical Figures' },
  'abel': { lng: 47.432, lat: 31.015, locationName: 'Garden of Eden', category: 'Biblical Figures' },
  'seth': { lng: 47.432, lat: 31.015, locationName: 'Garden of Eden', category: 'Biblical Figures' },
  'enoch': { lng: 35.794, lat: 33.318, locationName: 'Mount Hermon', category: 'Biblical Figures' },
  'noah': { lng: 44.290, lat: 39.702, locationName: 'Mount Ararat', category: 'Biblical Figures' },
  'abraham': { lng: 35.111, lat: 31.524, locationName: 'Hebron (Tomb of the Patriarchs)', category: 'Biblical Figures' },
  'sarah': { lng: 35.111, lat: 31.524, locationName: 'Hebron (Tomb of the Patriarchs)', category: 'Biblical Figures' },
  'isaac': { lng: 34.792, lat: 31.244, locationName: 'Beersheba', category: 'Biblical Figures' },
  'rebekah': { lng: 35.111, lat: 31.524, locationName: 'Hebron (Tomb of the Patriarchs)', category: 'Biblical Figures' },
  'jacob': { lng: 35.222, lat: 31.936, locationName: 'Bethel', category: 'Biblical Figures' },
  'leah': { lng: 35.111, lat: 31.524, locationName: 'Hebron (Tomb of the Patriarchs)', category: 'Biblical Figures' },
  'rachel': { lng: 35.202, lat: 31.711, locationName: 'Rachel\'s Tomb (Bethlehem)', category: 'Biblical Figures' },
  'joseph': { lng: 31.820, lat: 30.610, locationName: 'Goshen (Egypt)', category: 'Biblical Figures' },
  'moses': { lng: 35.725, lat: 31.767, locationName: 'Mount Nebo', category: 'Biblical Figures' },
  'joshua': { lng: 35.289, lat: 32.056, locationName: 'Shiloh', category: 'Biblical Figures' },
  'david': { lng: 35.235, lat: 31.773, locationName: 'City of David (Jerusalem)', category: 'Biblical Figures' },
  'solomon': { lng: 35.235, lat: 31.778, locationName: 'Jerusalem', category: 'Biblical Figures' },
  'jesus': { lng: 35.300, lat: 32.702, locationName: 'Nazareth', category: 'Biblical Figures' },
  'mary-magdalene': { lng: 35.503, lat: 32.825, locationName: 'Magdala', category: 'Biblical Figures' },

  // Biblical Events
  'evt-creation': { lng: 47.432, lat: 31.015, locationName: 'Garden of Eden', category: 'Biblical Events' },
  'evt-enoch-trans': { lng: 35.794, lat: 33.318, locationName: 'Mount Hermon', category: 'Biblical Events' },
  'evt-adam-death': { lng: 35.111, lat: 31.524, locationName: 'Hebron', category: 'Biblical Events' },
  'evt-great-flood': { lng: 44.290, lat: 39.702, locationName: 'Mount Ararat', category: 'Biblical Events' },
  'evt-tower-babel': { lng: 44.422, lat: 32.536, locationName: 'Babylon', category: 'Biblical Events' },
  'evt-abraham-canaan': { lng: 35.277, lat: 32.213, locationName: 'Shechem', category: 'Biblical Events' },
  'evt-sodom-gomorrah': { lng: 35.534, lat: 31.254, locationName: 'Sodom & Gomorrah', category: 'Biblical Events' },
  'evt-binding-isaac': { lng: 35.235, lat: 31.778, locationName: 'Mount Moriah', category: 'Biblical Events' },
  'evt-joseph-sold': { lng: 35.244, lat: 32.413, locationName: 'Dothan', category: 'Biblical Events' },
  'evt-israel-egypt': { lng: 31.820, lat: 30.610, locationName: 'Goshen', category: 'Biblical Events' },
  'evt-exodus': { lng: 33.860, lat: 28.980, locationName: 'Red Sea Crossing', category: 'Biblical Events' },
  'evt-sinai-law': { lng: 33.975, lat: 28.539, locationName: 'Mount Sinai', category: 'Biblical Events' },
  'evt-jericho': { lng: 35.444, lat: 31.870, locationName: 'Jericho', category: 'Biblical Events' },
  'reign-saul': { lng: 35.231, lat: 31.823, locationName: 'Gibeah', category: 'Biblical Events' },
  'reign-david': { lng: 35.235, lat: 31.773, locationName: 'City of David', category: 'Biblical Events' },
  'reign-solomon-temple': { lng: 35.235, lat: 31.778, locationName: 'Temple Mount', category: 'Biblical Events' },
  'evt-split-kingdom': { lng: 35.277, lat: 32.213, locationName: 'Shechem', category: 'Biblical Events' },
  'evt-fall-samaria': { lng: 35.189, lat: 32.276, locationName: 'Samaria', category: 'Biblical Events' },
  'evt-fall-jerusalem': { lng: 35.235, lat: 31.778, locationName: 'Jerusalem', category: 'Biblical Events' },
  'evt-temple-rebuilt': { lng: 35.235, lat: 31.778, locationName: 'Temple Mount', category: 'Biblical Events' },
  'evt-christ-birth': { lng: 35.201, lat: 31.704, locationName: 'Bethlehem', category: 'Biblical Events' },
  'evt-crucifixion': { lng: 35.229, lat: 31.778, locationName: 'Golgotha', category: 'Biblical Events' },

  // Enochian Lore
  'semjaza': { lng: 35.794, lat: 33.318, locationName: 'Mount Hermon', category: 'Enochian Sites' },
  'azazel': { lng: 35.350, lat: 31.650, locationName: 'Desert of Dudael', category: 'Enochian Sites' },
  'enoch_ascension': { lng: 35.794, lat: 33.318, locationName: 'Mount Hermon', category: 'Enochian Sites' },
  'nephilim_era': { lng: 35.730, lat: 32.900, locationName: 'Og\'s Kingdom (Golan)', category: 'Giants & Nephilim' },
  'rephaim': { lng: 35.972, lat: 32.837, locationName: 'Ashtaroth Karnaim (Bashan)', category: 'Biblical Figures' },
  'anakim': { lng: 35.110, lat: 31.527, locationName: 'Hebron (Kiriath-Arba)', category: 'Biblical Figures' },
  'emim': { lng: 35.727, lat: 31.636, locationName: 'Shaveh Kiriathaim (Moab)', category: 'Biblical Figures' },
  'zamzummim': { lng: 35.930, lat: 31.950, locationName: 'Land of Ammon', category: 'Biblical Figures' },
  'horites': { lng: 35.480, lat: 30.320, locationName: 'Mount Seir (Edom)', category: 'Biblical Figures' },
  'avim': { lng: 34.450, lat: 31.500, locationName: 'Gaza (Hazerim)', category: 'Biblical Figures' },
  'perizzites': { lng: 35.263, lat: 32.062, locationName: 'Hill Country of Ephraim', category: 'Biblical Figures' },
  'kenites': { lng: 35.125, lat: 31.280, locationName: 'Wilderness of Arad', category: 'Biblical Figures' },
  // Future Prophecies
  'rev_tribulation': { lng: 35.235, lat: 31.778, locationName: 'Jerusalem (Temple Mount)', category: 'Biblical Events' },
  'rev_two_witnesses': { lng: 35.235, lat: 31.778, locationName: 'Jerusalem (Old City)', category: 'Biblical Events' },
  'rev_antichrist': { lng: 44.422, lat: 32.536, locationName: 'Babylon (Euphrates River)', category: 'Biblical Events' },
  'rev_second_coming': { lng: 35.184, lat: 32.585, locationName: 'Valley of Megiddo (Armageddon)', category: 'Biblical Events' },
  'rev_millennial_reign': { lng: 35.235, lat: 31.778, locationName: 'New Jerusalem / Earth', category: 'Biblical Events' },
  'rev_final_judgment': { lng: 35.235, lat: 31.778, locationName: 'Cosmic Throne (Jerusalem)', category: 'Biblical Events' },
  'rev_new_jerusalem': { lng: 35.235, lat: 31.778, locationName: 'New Jerusalem', category: 'Biblical Events' },
  // Secret Government Programs
  'project-mkultra': { lng: -77.164, lat: 38.948, locationName: 'Langley, Virginia', category: 'Secret Government Programs' },
  'project-stargate': { lng: -76.741, lat: 39.113, locationName: 'Fort Meade, Maryland', category: 'Secret Government Programs' },
  'operation-paperclip': { lng: -86.586, lat: 34.730, locationName: 'Huntsville, Alabama', category: 'Secret Government Programs' },
  'project-blue-book': { lng: -84.054, lat: 39.814, locationName: 'Wright-Patterson AFB, Ohio', category: 'Secret Government Programs' },
  'majestic-12': { lng: -77.036, lat: 38.907, locationName: 'Washington D.C.', category: 'Secret Government Programs' },
  'operation-northwoods': { lng: -77.036, lat: 38.907, locationName: 'Washington D.C. (Pentagon)', category: 'Secret Government Programs' },
  'montauk-project': { lng: -71.864, lat: 41.062, locationName: 'Camp Hero, Montauk, New York', category: 'Secret Government Programs' },
  'philadelphia-experiment': { lng: -75.174, lat: 39.897, locationName: 'Philadelphia Naval Shipyard', category: 'Secret Government Programs' },
  'operation-mockingbird': { lng: -77.036, lat: 38.907, locationName: 'Washington D.C. (CIA HQ / Media Hubs)', category: 'Secret Government Programs' },
  'operation-sea-spray': { lng: -122.419, lat: 37.774, locationName: 'San Francisco, California', category: 'Secret Government Programs' },
  'project-sunshine': { lng: -87.629, lat: 41.878, locationName: 'Chicago, Illinois (Argonne National Lab)', category: 'Secret Government Programs' },
  'project-horizon': { lng: -86.640, lat: 34.681, locationName: 'Redstone Arsenal, Alabama', category: 'Secret Government Programs' },
  'project-iceworm': { lng: -61.137, lat: 77.178, locationName: 'Camp Century, Greenland', category: 'Secret Government Programs' },
  'project-plowshare': { lng: -116.046, lat: 37.136, locationName: 'Nevada Test Site', category: 'Secret Government Programs' },
  'project-1794': { lng: -79.638, lat: 43.684, locationName: 'Malton, Ontario, Canada', category: 'Secret Government Programs' },
  'operation-gladio': { lng: 12.496, lat: 41.902, locationName: 'Rome, Italy (NATO Command)', category: 'Secret Government Programs' },
  'operation-lac': { lng: -90.199, lat: 38.627, locationName: 'St. Louis, Missouri (Core Test Area)', category: 'Secret Government Programs' },
  'operation-chase': { lng: -76.008, lat: 36.850, locationName: 'Atlantic Ocean (Out of Norfolk, VA)', category: 'Secret Government Programs' },
  'operation-highjump': { lng: 135.0, lat: -82.8628, locationName: 'Ross Ice Shelf, Antarctica', category: 'Secret Government Programs' },

  // Alchemy / Occult Locations
  'nicolas-flamel': { lng: 2.353333, lat: 48.863333, locationName: 'House of Nicolas Flamel (Paris, France)', category: 'Alchemy / Occult' },
  'evt-flamel-stone': { lng: 2.353333, lat: 48.863333, locationName: 'House of Nicolas Flamel (Paris, France)', category: 'Alchemy / Occult' },
  'isaac-newton': { lng: -0.630278, lat: 52.809167, locationName: 'Woolsthorpe Manor (Lincolnshire, England)', category: 'Alchemy / Occult' },
  'evt-newton-alchemy': { lng: 0.118, lat: 52.205, locationName: 'Trinity College (Cambridge, England)', category: 'Alchemy / Occult' },
  'evt-newton-emerald-tablet': { lng: -0.630278, lat: 52.809167, locationName: 'Woolsthorpe Manor (Lincolnshire, England)', category: 'Alchemy / Occult' },
  'evt-golden-dawn-founded': { lng: -0.1278, lat: 51.5074, locationName: 'London, England', category: 'Alchemy / Occult' },
  'aleister-crowley': { lng: -4.437222, lat: 57.265278, locationName: 'Boleskine House (Loch Ness, Scotland)', category: 'Alchemy / Occult' },
  'evt-crowley-boleskine': { lng: -4.437222, lat: 57.265278, locationName: 'Boleskine House (Loch Ness, Scotland)', category: 'Alchemy / Occult' },
  'evt-book-of-the-law': { lng: 31.2357, lat: 30.0444, locationName: 'Cairo, Egypt', category: 'Alchemy / Occult' },
  'jack-parsons': { lng: -118.156111, lat: 34.133333, locationName: 'Parsons Residence (Pasadena, California)', category: 'Alchemy / Occult' },
  'evt-babalon-working': { lng: -118.156111, lat: 34.133333, locationName: 'Parsons Residence (Pasadena, California)', category: 'Alchemy / Occult' },
  'abbey-of-thelema': { lng: 14.030556, lat: 38.031944, locationName: 'Abbey of Thelema (Cefalù, Sicily)', category: 'Alchemy / Occult' }
};

export interface Waypoint {
  lng: number;
  lat: number;
  locationName: string;
  description: string;
  year?: number;       // Approximate biblical year (negative for BC, positive for AD)
  displayDate?: string; // Human readable date label
}

export interface TravelPath {
  figureId: string;
  name: string;
  waypoints: Waypoint[];
}

export const BIBLICAL_TRAVEL_PATHS: Record<string, TravelPath> = {
  'abraham': {
    figureId: 'abraham',
    name: 'Abraham',
    waypoints: [
      { lng: 46.104, lat: 30.963, locationName: 'Ur of the Chaldees', year: -2166, displayDate: 'c. 2166 BC', description: 'Saul / Abram is born in Ur, an ancient Sumerian city-state.' },
      { lng: 39.029, lat: 36.864, locationName: 'Haran', year: -2091, displayDate: 'c. 2091 BC', description: 'Settles in Haran with his father Terah; receives the Call of God to travel to Canaan.' },
      { lng: 35.277, lat: 32.213, locationName: 'Shechem', year: -2090, displayDate: 'c. 2090 BC', description: 'Enters Canaan, builds his first altar to God under the oak of Moreh.' },
      { lng: 35.222, lat: 31.936, locationName: 'Bethel', year: -2089, displayDate: 'c. 2089 BC', description: 'Builds another altar and pitches his tent between Bethel and Ai.' },
      { lng: 31.235, lat: 30.044, locationName: 'Egypt', year: -2088, displayDate: 'c. 2088 BC', description: 'Flees to Egypt due to a severe famine in the land of Canaan.' },
      { lng: 35.111, lat: 31.524, locationName: 'Hebron (Tomb of the Patriarchs)', year: -1991, displayDate: 'c. 1991 BC', description: 'Settles in Hebron, builds an altar at the Oaks of Mamre, buys the cave of Machpelah for burial.' }
    ]
  },
  'jacob': {
    figureId: 'jacob',
    name: 'Jacob',
    waypoints: [
      { lng: 34.792, lat: 31.244, locationName: 'Beersheba', year: -2006, displayDate: 'c. 2006 BC', description: 'Born in Beersheba, the son of Isaac and Rebekah.' },
      { lng: 35.222, lat: 31.936, locationName: 'Bethel (Jacob\'s Ladder)', year: -1929, displayDate: 'c. 1929 BC', description: 'Flees his brother Esau. Dreams of a ladder reaching to heaven and names the place Bethel.' },
      { lng: 39.029, lat: 36.864, locationName: 'Haran', year: -1929, displayDate: 'c. 1929 BC', description: 'Arrives in Paddan-Aram (Haran), works 14 years for Laban to marry Rachel and Leah, and amasses wealth.' },
      { lng: 35.717, lat: 32.183, locationName: 'Penuel', year: -1909, displayDate: 'c. 1909 BC', description: 'Wrestles with an angel overnight, has his name changed to Israel, and reconciles with Esau.' },
      { lng: 35.277, lat: 32.213, locationName: 'Shechem', year: -1908, displayDate: 'c. 1908 BC', description: 'Settles temporarily, buys a plot of land, and builds an altar.' },
      { lng: 35.222, lat: 31.936, locationName: 'Bethel', year: -1906, displayDate: 'c. 1906 BC', description: 'Returns to Bethel on God\'s command, purges foreign gods from his household.' },
      { lng: 35.111, lat: 31.524, locationName: 'Hebron', year: -1886, displayDate: 'c. 1886 BC', description: 'Reunites with his father Isaac, who dies and is buried here.' },
      { lng: 31.820, lat: 30.610, locationName: 'Goshen (Egypt)', year: -1876, displayDate: 'c. 1876 BC', description: 'Moves his entire family to Egypt during a severe famine, settling in the fertile land of Goshen.' },
      { lng: 35.111, lat: 31.524, locationName: 'Hebron (Tomb of the Patriarchs)', year: -1859, displayDate: 'c. 1859 BC', description: 'Dies in Egypt; his sons carry his body back to Canaan to be buried in the Cave of Machpelah.' }
    ]
  },
  'moses': {
    figureId: 'moses',
    name: 'Moses',
    waypoints: [
      { lng: 31.820, lat: 30.610, locationName: 'Goshen (Egypt)', year: -1526, displayDate: 'c. 1526 BC', description: 'Born in Egypt, hidden in a bulrush basket, and raised in Pharaoh\'s palace.' },
      { lng: 35.000, lat: 28.500, locationName: 'Midian', year: -1486, displayDate: 'c. 1486 BC', description: 'Flees Egypt after slaying an Egyptian taskmaster. Lives as a shepherd for 40 years.' },
      { lng: 33.975, lat: 28.539, locationName: 'Mount Sinai (Horeb)', year: -1446, displayDate: 'c. 1446 BC', description: 'Encounters the burning bush, receives God\'s command to free the Israelites, and later returns to receive the Ten Commandments.' },
      { lng: 33.860, lat: 28.980, locationName: 'Red Sea & Wilderness of Paran', year: -1446, displayDate: 'c. 1446 BC', description: 'Leads the Israelites across the Red Sea, wandering the wilderness for 40 years due to disobedience.' },
      { lng: 35.725, lat: 31.767, locationName: 'Mount Nebo', year: -1406, displayDate: 'c. 1406 BC', description: 'Views the Promised Land from the summit, dies at the age of 120, and is buried by God.' }
    ]
  },
  'jesus': {
    figureId: 'jesus',
    name: 'Jesus',
    waypoints: [
      { lng: 35.201, lat: 31.704, locationName: 'Bethlehem', year: 2, displayDate: 'c. 2 BC', description: 'Born in a manger; visited by shepherds and the Magi.' },
      { lng: 31.235, lat: 30.044, locationName: 'Egypt', year: 3, displayDate: 'c. 3 BC', description: 'Taken by Joseph and Mary to escape King Herod\'s Massacre of the Innocents.' },
      { lng: 35.300, lat: 32.702, locationName: 'Nazareth', year: 4, displayDate: 'c. 4 BC', description: 'Grows up and lives in Nazareth as a carpenter\'s son until His ministry begins.' },
      { lng: 35.557, lat: 31.897, locationName: 'Jordan River', year: 27, displayDate: 'c. 27 AD', description: 'Baptized by John the Baptist, marked by the Holy Spirit descending like a dove.' },
      { lng: 35.530, lat: 32.810, locationName: 'Sea of Galilee (Capernaum)', year: 28, displayDate: 'c. 28-32 AD', description: 'Establishes His ministry headquarters in Capernaum, calls His disciples, performs miracles, and preaches.' },
      { lng: 35.229, lat: 31.778, locationName: 'Jerusalem (Golgotha)', year: 33, displayDate: '33 AD', description: 'Enters in triumph (Palm Sunday), is crucified outside the city walls, and rises from the dead on the third day.' }
    ]
  },
  'paul_apostle': {
    figureId: 'paul_apostle',
    name: 'Paul the Apostle',
    waypoints: [
      { lng: 34.897, lat: 36.917, locationName: 'Tarsus', year: 5, displayDate: 'c. 5 AD', description: 'Born Saul of Tarsus, a Roman citizen trained in strict Pharisaic law.' },
      { lng: 35.235, lat: 31.778, locationName: 'Jerusalem', year: 25, displayDate: 'c. 25 AD', description: 'Studies under Gamaliel, witnesses and approves of the stoning of Stephen.' },
      { lng: 36.291, lat: 33.513, locationName: 'Damascus Road', year: 34, displayDate: 'c. 34 AD', description: 'Blinded by a vision of Jesus, converts to Christianity, and begins preaching.' },
      { lng: 36.150, lat: 36.200, locationName: 'Antioch', year: 44, displayDate: 'c. 44 AD', description: 'Spends a year teaching with Barnabas; believers are first called "Christians" here.' },
      { lng: 33.366, lat: 35.166, locationName: 'First Missionary Journey', year: 46, displayDate: 'c. 46-48 AD', description: 'Sails to Cyprus and travels through Asia Minor (Galatia) establishing churches.' },
      { lng: 23.727, lat: 37.983, locationName: 'Second & Third Journeys', year: 50, displayDate: 'c. 50-58 AD', description: 'Travels to Europe: Philippi, Thessalonica, Athens (Mars Hill), Corinth, and Ephesus.' },
      { lng: 12.496, lat: 41.902, locationName: 'Rome', year: 67, displayDate: '67 AD', description: 'Appeals to Caesar, arrives in chains, is imprisoned, writes many epistles, and is martyred.' }
    ]
  }
};
