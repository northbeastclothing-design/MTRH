export interface TimelineItem {
  id: string;
  name: string;
  type: 'lifespan' | 'event';
  layer: 'biblical-patriarchs' | 'biblical-events' | 'sumerian-kings' | 'greek-mythology';
  start: number; // BCE is negative, CE is positive
  end?: number;  // Only for 'lifespan'
  description: string;
  source?: string;
  fatherId?: string; // For lineage tracking
  motherId?: string; // For mother lineage tracking
  spouseId?: string; // For spouse relationship tracking
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
  }
];
