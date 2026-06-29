export interface TimelineItem {
  id: string;
  name: string;
  type: 'lifespan' | 'event';
  layer: 'biblical-patriarchs' | 'biblical-events' | 'sumerian-kings' | 'greek-mythology' | 'merovingian-bloodlines' | 'royal-bloodlines' | 'enochian-lore' | 'future-prophecy' | 'secret-gov-programs' | 'ancient-civilizations' | 'alchemy-occult' | 'illuminati-bloodlines' | 'black-nobility' | 'nasa-space';
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
    id: 'job_patriarch',
    name: 'Job',
    type: 'lifespan',
    layer: 'biblical-patriarchs',
    start: -2100,
    end: -1900,
    description: 'A righteous man tested by Satan, who maintained his faith in God despite losing his wealth, health, and children.',
    source: 'Book of Job'
  },
  {
    id: 'melchizedek',
    name: 'Melchizedek',
    type: 'lifespan',
    layer: 'biblical-patriarchs',
    start: -2080,
    end: -2000,
    description: 'King of Salem and priest of God Most High who blessed Abraham. A mysterious figure referenced as a prefigurement of Christ.',
    source: 'Genesis 14:18-20, Psalm 110:4, Hebrews 7'
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
    id: 'lot',
    name: 'Lot',
    type: 'lifespan',
    layer: 'biblical-patriarchs',
    start: -1980,
    end: -1890,
    description: 'Nephew of Abraham who settled in Sodom and was rescued by angels before its destruction.',
    source: 'Genesis 11-19'
  },
  {
    id: 'hagar',
    name: 'Hagar',
    type: 'lifespan',
    layer: 'biblical-patriarchs',
    start: -1930,
    end: -1860,
    description: 'Egyptian handmaid of Sarah, second wife of Abraham, and mother of Ishmael.',
    source: 'Genesis 16, 21',
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
    id: 'miriam',
    name: 'Miriam',
    type: 'lifespan',
    layer: 'biblical-patriarchs',
    start: -1534,
    end: -1407,
    description: 'Prophetess and elder sister of Moses and Aaron who helped lead the Israelites during the Exodus.',
    source: 'Exodus 15, Numbers 12'
  },
  {
    id: 'aaron',
    name: 'Aaron',
    type: 'lifespan',
    layer: 'biblical-patriarchs',
    start: -1529,
    end: -1406,
    description: 'Elder brother of Moses, first High Priest of Israel, and spokesman during the Exodus.',
    source: 'Exodus, Numbers'
  },
  {
    id: 'moses',
    name: 'Moses',
    type: 'lifespan',
    layer: 'biblical-patriarchs',
    start: -1526,
    end: -1406,
    description: 'The prophet, leader, and lawgiver who led the Israelites out of Egypt, received the Ten Commandments, and authored the Torah.',
    source: 'Exodus, Leviticus, Numbers, Deuteronomy'
  },
  {
    id: 'joshua',
    name: 'Joshua',
    type: 'lifespan',
    layer: 'biblical-patriarchs',
    start: -1496,
    end: -1386,
    description: 'Moses\' assistant and successor who led the Israelite tribes in the conquest of Canaan.',
    source: 'Book of Joshua'
  },
  {
    id: 'caleb',
    name: 'Caleb',
    type: 'lifespan',
    layer: 'biblical-patriarchs',
    start: -1486,
    end: -1400,
    description: 'One of the twelve spies sent by Moses into Canaan, who along with Joshua brought back a favorable report.',
    source: 'Numbers 13-14, Joshua 14'
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
    id: 'deborah_judge',
    name: 'Deborah',
    type: 'lifespan',
    layer: 'biblical-patriarchs',
    start: -1250,
    end: -1180,
    description: 'Prophetess and the only female Judge of Israel, who rallied the tribes against Canaanite oppression.',
    source: 'Judges 4-5'
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
    id: 'gideon',
    name: 'Gideon',
    type: 'lifespan',
    layer: 'biblical-patriarchs',
    start: -1190,
    end: -1150,
    description: 'A judge of Israel who defeated a massive Midianite army with only 300 men.',
    source: 'Judges 6-8'
  },
  {
    id: 'samson',
    name: 'Samson',
    type: 'lifespan',
    layer: 'biblical-patriarchs',
    start: -1118,
    end: -1078,
    description: 'A legendary Nazirite judge of Israel endowed with supernatural strength to fight the Philistines.',
    source: 'Judges 13-16'
  },
  {
    id: 'samuel_prophet',
    name: 'Samuel',
    type: 'lifespan',
    layer: 'biblical-patriarchs',
    start: -1105,
    end: -1015,
    description: 'The last Judge and first of the major prophets of Israel, who anointed Kings Saul and David.',
    source: '1 Samuel'
  },
  {
    id: 'saul_king',
    name: 'King Saul',
    type: 'lifespan',
    layer: 'biblical-patriarchs',
    start: -1080,
    end: -1010,
    description: 'The first King of the United Kingdom of Israel, whose reign ended in tragedy at Mount Gilboa.',
    source: '1 Samuel 9-31'
  },
  {
    id: 'jonathan',
    name: 'Jonathan',
    type: 'lifespan',
    layer: 'biblical-patriarchs',
    start: -1060,
    end: -1010,
    description: 'Eldest son of King Saul and close friend of King David, known for his bravery and loyalty.',
    source: '1 Samuel 14-31',
    fatherId: 'saul_king'
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
    id: 'nathan_prophet',
    name: 'Nathan',
    type: 'lifespan',
    layer: 'biblical-patriarchs',
    start: -1010,
    end: -950,
    description: 'Prophet who served during the reigns of David and Solomon, delivering God\'s covenant promise and rebuking David.',
    source: '2 Samuel 7, 12, 1 Kings 1'
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
    id: 'absalom',
    name: 'Absalom',
    type: 'lifespan',
    layer: 'biblical-patriarchs',
    start: -1005,
    end: -967,
    description: 'Third son of King David, celebrated for his beauty but who led a rebellion against his father.',
    source: '2 Samuel 13-18',
    fatherId: 'david_pat'
  },
  {
    id: 'jeroboam_i',
    name: 'King Jeroboam I',
    type: 'lifespan',
    layer: 'biblical-patriarchs',
    start: -975,
    end: -910,
    description: 'The first king of the northern Kingdom of Israel after the split, who set up golden calves at Bethel and Dan.',
    source: '1 Kings 11-14'
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
    id: 'ahab_king',
    name: 'King Ahab',
    type: 'lifespan',
    layer: 'biblical-patriarchs',
    start: -900,
    end: -852,
    description: 'King of Israel who ruled with his wife Jezebel. He was denounced by the prophet Elijah for his wickedness.',
    source: '1 Kings 16-22',
    spouseId: 'jezebel_queen'
  },
  {
    id: 'jezebel_queen',
    name: 'Jezebel',
    type: 'lifespan',
    layer: 'biblical-patriarchs',
    start: -890,
    end: -841,
    description: 'Phoenician princess, wife of King Ahab, who introduced Baal worship to Israel and persecuted the prophets of God.',
    source: '1 Kings 16 - 2 Kings 9',
    spouseId: 'ahab_king'
  },
  {
    id: 'elijah',
    name: 'Elijah',
    type: 'lifespan',
    layer: 'biblical-patriarchs',
    start: -900,
    end: -849,
    description: 'A major prophet of Israel who opposed Ahab and Jezebel, performed miracles, and was taken to heaven in a whirlwind.',
    source: '1 Kings 17 - 2 Kings 2'
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
    id: 'elisha',
    name: 'Elisha',
    type: 'lifespan',
    layer: 'biblical-patriarchs',
    start: -870,
    end: -790,
    description: 'Prophet who succeeded Elijah, receiving a double portion of his spirit and performing numerous miracles.',
    source: '1 Kings 19, 2 Kings 2-13'
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
    id: 'jonah',
    name: 'Jonah',
    type: 'lifespan',
    layer: 'biblical-patriarchs',
    start: -810,
    end: -750,
    description: 'Prophet who was swallowed by a great fish after fleeing God\'s command to preach repentance to Nineveh.',
    source: 'Book of Jonah, 2 Kings 14:25'
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
    id: 'isaiah',
    name: 'Isaiah',
    type: 'lifespan',
    layer: 'biblical-patriarchs',
    start: -760,
    end: -681,
    description: 'Major prophet of Judah who prophesied during the reigns of Uzziah, Jotham, Ahaz, and Hezekiah, foretelling the Messiah.',
    source: 'Book of Isaiah, 2 Kings 19-20'
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
    id: 'jeremiah',
    name: 'Jeremiah',
    type: 'lifespan',
    layer: 'biblical-patriarchs',
    start: -650,
    end: -570,
    description: 'Major prophet known as the "Weeping Prophet," who witnessed and prophesied the Fall of Jerusalem and the Babylonian Exile.',
    source: 'Book of Jeremiah, Lamentations'
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
    id: 'ezekiel',
    name: 'Ezekiel',
    type: 'lifespan',
    layer: 'biblical-patriarchs',
    start: -622,
    end: -570,
    description: 'Priest and prophet exiled to Babylon, known for his vivid apocalyptic visions of the chariot-throne and the dry bones.',
    source: 'Book of Ezekiel'
  },
  {
    id: 'daniel_prophet',
    name: 'Daniel',
    type: 'lifespan',
    layer: 'biblical-patriarchs',
    start: -620,
    end: -538,
    description: 'Prophet and statesman in Babylon and Persia, renowned for his wisdom, interpretation of dreams, and the lions\' den.',
    source: 'Book of Daniel'
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
    id: 'esther_queen',
    name: 'Queen Esther',
    type: 'lifespan',
    layer: 'biblical-patriarchs',
    start: -510,
    end: -450,
    description: 'Jewish queen of Persia who risked her life to save her people from a genocidal plot by Haman.',
    source: 'Book of Esther'
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
    id: 'ezra',
    name: 'Ezra',
    type: 'lifespan',
    layer: 'biblical-patriarchs',
    start: -480,
    end: -440,
    description: 'Priest, scribe, and religious leader who returned from exile and helped re-establish the law in Jerusalem.',
    source: 'Book of Ezra'
  },
  {
    id: 'nehemiah',
    name: 'Nehemiah',
    type: 'lifespan',
    layer: 'biblical-patriarchs',
    start: -473,
    end: -403,
    description: 'Governor of Persian Judea who led the rebuilding of Jerusalem\'s walls and enacted religious reforms.',
    source: 'Book of Nehemiah'
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
    id: 'herod_great',
    name: 'Herod the Great',
    type: 'lifespan',
    layer: 'biblical-patriarchs',
    start: -73,
    end: -4,
    description: 'Roman-appointed client king of Judea who expanded the Second Temple and ordered the execution of male infants in Bethlehem.',
    source: 'Matthew 2, Josephus'
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
    id: 'john_baptist',
    name: 'John the Baptist',
    type: 'lifespan',
    layer: 'biblical-patriarchs',
    start: -7,
    end: 29,
    description: 'Prophet who preached repentance and prepared the way for Jesus Christ, whom he baptized in the Jordan River.',
    source: 'Gospels'
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
    id: 'stephen_martyr',
    name: 'Stephen',
    type: 'lifespan',
    layer: 'biblical-patriarchs',
    start: 1,
    end: 34,
    description: 'A deacon in the early Church and the first Christian martyr, stoned to death under Saul\'s approval.',
    source: 'Acts 6-7'
  },
  {
    id: 'james_apostle',
    name: 'James the Apostle',
    type: 'lifespan',
    layer: 'biblical-patriarchs',
    start: 1,
    end: 44,
    description: 'Son of Zebedee and brother of John the Apostle. The first of the twelve apostles to be martyred.',
    source: 'Gospels, Acts 12:2'
  },
  {
    id: 'james_brother',
    name: 'James the Just',
    type: 'lifespan',
    layer: 'biblical-patriarchs',
    start: 1,
    end: 62,
    description: 'Brother of Jesus, leader of the early Church in Jerusalem, and author of the Epistle of James. Martyred in 62 AD.',
    source: 'Gospels, Acts 15, Galatians 1:19',
    fatherId: 'joseph_pat',
    motherId: 'mary_pat'
  },
  {
    id: 'luke_evangelist',
    name: 'Luke the Evangelist',
    type: 'lifespan',
    layer: 'biblical-patriarchs',
    start: 1,
    end: 84,
    description: 'Physician, companion of Paul, and author of the Gospel of Luke and the Book of Acts.',
    source: 'Colossians 4:14, Acts'
  },
  {
    id: 'matthew_apostle',
    name: 'Matthew the Apostle',
    type: 'lifespan',
    layer: 'biblical-patriarchs',
    start: 1,
    end: 74,
    description: 'Former tax collector called to be one of the twelve apostles, and author of the Gospel of Matthew.',
    source: 'Gospels'
  },
  {
    id: 'martha_bethany',
    name: 'Martha of Bethany',
    type: 'lifespan',
    layer: 'biblical-patriarchs',
    start: 1,
    end: 70,
    description: 'Sister of Mary and Lazarus of Bethany, known for her hospitality and dialogue with Jesus.',
    source: 'Luke 10, John 11-12'
  },
  {
    id: 'barnabas',
    name: 'Barnabas',
    type: 'lifespan',
    layer: 'biblical-patriarchs',
    start: 1,
    end: 61,
    description: 'A Cypriot Jew and early Christian missionary who traveled with Paul and introduced him to the Apostles.',
    source: 'Acts 4, 9, 11-15'
  },
  {
    id: 'jude_brother',
    name: 'Jude',
    type: 'lifespan',
    layer: 'biblical-patriarchs',
    start: 2,
    end: 80,
    description: 'Brother of Jesus and James the Just, and author of the Epistle of Jude.',
    source: 'Matthew 13:55, Jude',
    fatherId: 'joseph_pat',
    motherId: 'mary_pat'
  },
  {
    id: 'mary_bethany',
    name: 'Mary of Bethany',
    type: 'lifespan',
    layer: 'biblical-patriarchs',
    start: 3,
    end: 72,
    description: 'Sister of Martha and Lazarus of Bethany, who sat at Jesus\' feet to listen to His teaching.',
    source: 'Luke 10, John 11-12'
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
    id: 'lazarus',
    name: 'Lazarus of Bethany',
    type: 'lifespan',
    layer: 'biblical-patriarchs',
    start: 5,
    end: 65,
    description: 'Brother of Mary and Martha, raised from the dead by Jesus after being in the tomb for four days.',
    source: 'John 11-12'
  },
  {
    id: 'mark_evangelist',
    name: 'Mark the Evangelist',
    type: 'lifespan',
    layer: 'biblical-patriarchs',
    start: 5,
    end: 68,
    description: 'Companion of Peter and Paul, and author of the Gospel of Mark.',
    source: 'Acts 12, 1 Peter 5:13'
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
  {
    id: 'timothy_bishop',
    name: 'Timothy',
    type: 'lifespan',
    layer: 'biblical-patriarchs',
    start: 17,
    end: 97,
    description: 'Paul\'s close companion, co-worker, and recipient of the pastoral epistles, later Bishop of Ephesus.',
    source: 'Acts 16, Pauline Epistles'
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
    isPeopleGroup: true,
    subLabel: 'Possible Nephilim Bloodline',
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
    layer: 'ancient-civilizations',
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
    layer: 'ancient-civilizations',
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
    layer: 'ancient-civilizations',
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
    layer: 'ancient-civilizations',
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
    layer: 'ancient-civilizations',
    start: -2100,
    end: -1400,
    description: 'The ancient cave-dwelling inhabitants of Mount Seir (Edom) before being dispossessed and succeeded by the descendants of Esau (Edomites).',
    source: 'Genesis 14:6, 36:20-30, Deuteronomy 2:12',
    isPeopleGroup: true,
    subLabel: 'Possible Nephilim Bloodline',
  },
  {
    id: 'avim',
    name: 'Avim',
    type: 'lifespan',
    layer: 'ancient-civilizations',
    start: -2100,
    end: -1400,
    description: 'The early inhabitants of southwest Canaan (near Gaza) who dwelt in villages as far as Hazerim, later destroyed and replaced by the Caphtorim (Philistines).',
    source: 'Deuteronomy 2:23, Joshua 13:3',
    isPeopleGroup: true,
    subLabel: 'Possible Nephilim Bloodline',
  },
  {
    id: 'perizzites',
    name: 'Perizzites',
    type: 'lifespan',
    layer: 'ancient-civilizations',
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
    layer: 'ancient-civilizations',
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
      id: 'ahnenerbe-founded',
      name: 'SS Ahnenerbe Established',
      type: 'event',
      layer: 'secret-gov-programs',
      start: 1935,
      description: 'Heinrich Himmler establishes the SS Ahnenerbe research institute to conduct archaeological, historical, and esoteric expeditions investigating Aryan ancestral heritage and occult artifacts.',
      source: 'Nuremberg Trial Records'
    },
    {
      id: 'die-glocke-development',
      name: 'Die Glocke (The Bell) Development',
      type: 'event',
      layer: 'secret-gov-programs',
      start: 1944,
      description: 'The alleged development of the top-secret Nazi anti-gravity and quantum physics device Die Glocke (The Bell) near the Wenceslaus mine on the Polish border.',
      source: 'SS Trial Records'
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
      id: 'deep-freeze-expedition',
      name: 'Project Deep Freeze Starts',
      type: 'event',
      layer: 'secret-gov-programs',
      start: 1955,
      description: 'The U.S. Navy launches Project Deep Freeze, establishing permanent military-supported scientific bases in Antarctica under Admiral Richard E. Byrd.',
      source: 'U.S. Navy Antarctic Journals'
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
      id: 'project-pegasus-event',
      name: 'Project Pegasus (Time Travel Research)',
      type: 'event',
      layer: 'secret-gov-programs',
      start: 1968,
      description: 'DARPA and the CIA allegedly launch Project Pegasus, researching child-based teleportation and time travel using Nikola Tesla\'s physical files.',
      source: 'Whistleblower Testimony'
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
    },
    {
      id: 'evt-golem-prague',
      name: 'The Golem of Prague',
      type: 'event',
      layer: 'alchemy-occult',
      start: 1580,
      description: 'Rabbi Loew ben Bezalel of Prague allegedly animates a clay Golem using Kabbalistic rituals and Hebrew letters to protect the Jewish community.',
      source: 'Jewish Folklore & Esoterica'
    },
    {
      id: 'evt-theosophy-society',
      name: 'Theosophical Society Founded',
      type: 'event',
      layer: 'alchemy-occult',
      start: 1875,
      description: 'Helena Blavatsky and others found the Theosophical Society in New York, popularizing modern esotericism and the belief in the Great White Lodge.',
      source: 'Theosophical History Archives'
    },
    {
      id: 'timeline-egyptian-civilization',
      name: 'Ancient Egyptians',
      type: 'lifespan',
      layer: 'ancient-civilizations',
      start: -3100,
      end: -30,
      description: 'The civilization of ancient Egypt, famous for its grand dynastic history, royal pyramids of Giza, hieroglyphic writing, and esoteric mystery schools.',
      source: 'Egyptian Chronology',
      isPeopleGroup: true
    },
    {
      id: 'timeline-tribe-of-judah',
      name: 'Tribe of Judah',
      type: 'lifespan',
      layer: 'ancient-civilizations',
      start: -1800,
      end: 70,
      description: 'The southern kingdom and lineage of Israel descended from Jacob\'s son Judah, which produced the royal line of David and maintained its identity through the Babylonian Exile up to the Roman destruction of Jerusalem.',
      source: 'Biblical Chronicles',
      isPeopleGroup: true
    },
    {
      id: 'timeline-sumerian-civilization',
      name: 'Sumerian Civilization',
      type: 'lifespan',
      layer: 'ancient-civilizations',
      start: -4500,
      end: -1900,
      description: 'The first urban civilization in historical Mesopotamia, responsible for the development of cuneiform script, early mathematical systems, and complex ziggurats.',
      source: 'Near Eastern Archaeology',
      isPeopleGroup: true
    },
    {
      id: 'timeline-edomites',
      name: 'Edomites',
      type: 'lifespan',
      layer: 'ancient-civilizations',
      start: -1800,
      end: 100,
      description: 'The descendants of Esau who settled in the rugged sandstone peaks of Mount Seir, establishing a kingdom noted for its strategic trade routes and mountain strongholds.',
      source: 'Levantine Archaeological Records',
      isPeopleGroup: true
    },
    {
      id: 'timeline-philistines',
      name: 'Philistines',
      type: 'lifespan',
      layer: 'ancient-civilizations',
      start: -1200,
      end: -604,
      description: 'A seafaring people group originating from the Aegean who established a powerful pentapolis along the coast of southern Canaan, frequently warring with the early Israelite tribes.',
      source: 'Levantine Archaeology',
      isPeopleGroup: true
    },
    {
      id: 'knights-templar-founded',
      name: 'Knights Templar Founded',
      type: 'event',
      layer: 'alchemy-occult',
      start: 1119,
      description: 'Hugues de Payens and eight other French knights establish the Poor Fellow-Soldiers of Christ and of the Temple of Solomon (Knights Templar) at the Temple Mount in Jerusalem.',
      source: 'Crusade Chronology'
    },
    {
      id: 'knights-hospitaller-founded',
      name: 'Knights Hospitaller Recognized',
      type: 'event',
      layer: 'alchemy-occult',
      start: 1113,
      description: 'Pope Paschal II issues the papal bull Pie Postulatio Voluntatis, officially recognizing the Order of Knights of the Hospital of Saint John of Jerusalem under Blessed Gerard.',
      source: 'Vatican Archives'
    },
    {
      id: 'john-dee',
      name: 'John Dee',
      type: 'lifespan',
      layer: 'alchemy-occult',
      start: 1527,
      end: 1608,
      description: 'Elizabethan mathematician, astronomer, and occultist who served as court adviser to Queen Elizabeth I, devoting his later years to alchemical research and Enochian spirit communication.',
      source: 'Historical Biographies'
    },
    {
      id: 'john-dee-mortlake',
      name: 'John Dee\'s Enochian Channelings',
      type: 'event',
      layer: 'alchemy-occult',
      start: 1582,
      description: 'John Dee and medium Edward Kelley begin their famous "spirit actions" at Mortlake, claiming to receive a celestial language and system of magic directly from angels.',
      source: 'Dee\'s Spiritual Diaries'
    },
    {
      id: 'illuminati-founded',
      name: 'Bavarian Illuminati Founded',
      type: 'event',
      layer: 'alchemy-occult',
      start: 1776,
      description: 'Adam Weishaupt, professor of canon law, founds the Order of the Illuminati in Ingolstadt, Bavaria, seeking to combat state tyranny and religious control over society.',
      source: 'Bavarian Historical Records'
    },
    {
      id: 'lucis-trust-founded',
      name: 'Lucifer Publishing Company Founded',
      type: 'event',
      layer: 'alchemy-occult',
      start: 1922,
      description: 'Alice and Foster Bailey establish the Lucifer Publishing Company (later renamed Lucis Trust) in New York City to publish Bailey\'s channeled esoteric teachings.',
      source: 'Lucis Trust Official History'
    },
    {
      id: 'robert-maxwell',
      name: 'Robert Maxwell',
      type: 'lifespan',
      layer: 'alchemy-occult',
      start: 1923,
      end: 1991,
      description: 'British media tycoon, Member of Parliament, and owner of Pergamon Press, whose life and mysterious death off his yacht have been linked to intelligence agencies and global networks.',
      source: 'Historical Biographies'
    },
    {
      id: 'maxwell-pergamon',
      name: 'Maxwell Acquires Pergamon Press',
      type: 'event',
      layer: 'alchemy-occult',
      start: 1951,
      description: 'Robert Maxwell acquires control of Pergamon Press, building it into a global scientific publishing giant and establishing its headquarters at Headington Hill Hall in Oxford.',
      source: 'Corporate Publishing Records'
    },
    // ==========================================
    // 13 ILLUMINATI BLOODLINES (NEPHILIM LINES)
    // ==========================================
    {
      id: 'bloodline-rothschild',
      name: 'Rothschild Bloodline',
      type: 'lifespan',
      layer: 'illuminati-bloodlines',
      start: 1744,
      end: 2026,
      description: 'An international banking dynasty founded by Mayer Amschel Rothschild in Frankfurt. The family established houses across Europe, becoming the central focus of global financial and power conspiracy theories.',
      source: 'Fritz Springmeier - Bloodlines of the Illuminati',
      isPeopleGroup: true,
      subLabel: 'Possible Nephilim Bloodline'
    },
    {
      id: 'bloodline-rockefeller',
      name: 'Rockefeller Bloodline',
      type: 'lifespan',
      layer: 'illuminati-bloodlines',
      start: 1839,
      end: 2026,
      description: 'An ultra-wealthy American banking and industrial family founded by John D. Rockefeller (Standard Oil). Associated with global institutions, educational foundations, and theories of globalist governance.',
      source: 'Fritz Springmeier - Bloodlines of the Illuminati',
      isPeopleGroup: true,
      subLabel: 'Possible Nephilim Bloodline'
    },
    {
      id: 'bloodline-astor',
      name: 'Astor Bloodline',
      type: 'lifespan',
      layer: 'illuminati-bloodlines',
      start: 1763,
      end: 2026,
      description: 'Famous for John Jacob Astor, who became America\'s first multi-millionaire through the fur trade and real estate. Associated with massive land holdings, political influence, and elite secret societies.',
      source: 'Fritz Springmeier - Bloodlines of the Illuminati',
      isPeopleGroup: true,
      subLabel: 'Possible Nephilim Bloodline'
    },
    {
      id: 'bloodline-bundy',
      name: 'Bundy Bloodline',
      type: 'lifespan',
      layer: 'illuminati-bloodlines',
      start: 1800,
      end: 2026,
      description: 'An influential American family closely connected to the US government, military-industrial complex, and key intelligence circles, notably represented by national security advisor McGeorge Bundy.',
      source: 'Fritz Springmeier - Bloodlines of the Illuminati',
      isPeopleGroup: true,
      subLabel: 'Possible Nephilim Bloodline'
    },
    {
      id: 'bloodline-collins',
      name: 'Collins Bloodline',
      type: 'lifespan',
      layer: 'illuminati-bloodlines',
      start: 1630,
      end: 2026,
      description: 'An old American family dating back to the Salem witch trials. Esoterically rumored to possess ancient occult lineages and strong connections to hidden secret societies in the United States.',
      source: 'Fritz Springmeier - Bloodlines of the Illuminati',
      isPeopleGroup: true,
      subLabel: 'Possible Nephilim Bloodline'
    },
    {
      id: 'bloodline-dupont',
      name: 'DuPont Bloodline',
      type: 'lifespan',
      layer: 'illuminati-bloodlines',
      start: 1802,
      end: 2026,
      description: 'A prominent industrial dynasty that began with gunpowder manufacture and expanded into chemical dominance. Associated with massive corporate power, military contracting, and political lobbying.',
      source: 'Fritz Springmeier - Bloodlines of the Illuminati',
      isPeopleGroup: true,
      subLabel: 'Possible Nephilim Bloodline'
    },
    {
      id: 'bloodline-freeman',
      name: 'Freeman Bloodline',
      type: 'lifespan',
      layer: 'illuminati-bloodlines',
      start: 1700,
      end: 2026,
      description: 'A key family within the US political, intelligence, and legal apparatus, frequently linked to high-ranking members of the judiciary, government advisory posts, and esoteric fraternities.',
      source: 'Fritz Springmeier - Bloodlines of the Illuminati',
      isPeopleGroup: true,
      subLabel: 'Possible Nephilim Bloodline'
    },
    {
      id: 'bloodline-kennedy',
      name: 'Kennedy Bloodline',
      type: 'lifespan',
      layer: 'illuminati-bloodlines',
      start: 1888,
      end: 2026,
      description: 'An iconic American political dynasty. Despite their tragic public history, alternative theories suggest their prominence is tied to bloodline networks and the struggle for global influence.',
      source: 'Fritz Springmeier - Bloodlines of the Illuminati',
      isPeopleGroup: true,
      subLabel: 'Possible Nephilim Bloodline'
    },
    {
      id: 'bloodline-li',
      name: 'Li Bloodline',
      type: 'lifespan',
      layer: 'illuminati-bloodlines',
      start: 1850,
      end: 2026,
      description: 'A powerful Asian dynasty representing wealth and industrial power, often linked in esoteric narratives to Chinese secret societies (Triads) and international finance.',
      source: 'Fritz Springmeier - Bloodlines of the Illuminati',
      isPeopleGroup: true,
      subLabel: 'Possible Nephilim Bloodline'
    },
    {
      id: 'bloodline-onassis',
      name: 'Onassis Bloodline',
      type: 'lifespan',
      layer: 'illuminati-bloodlines',
      start: 1906,
      end: 2026,
      description: 'A shipping empire founded by Aristotle Onassis, which gained massive global influence and connected with other elite bloodlines, including the Kennedys.',
      source: 'Fritz Springmeier - Bloodlines of the Illuminati',
      isPeopleGroup: true,
      subLabel: 'Possible Nephilim Bloodline'
    },
    {
      id: 'bloodline-russell',
      name: 'Russell Bloodline',
      type: 'lifespan',
      layer: 'illuminati-bloodlines',
      start: 1823,
      end: 2026,
      description: 'Associated with the founding of the Russell Trust Association (which runs Yale\'s Skull and Bones society) and early missionary movements. Linked to opium trade wealth and political networks.',
      source: 'Fritz Springmeier - Bloodlines of the Illuminati',
      isPeopleGroup: true,
      subLabel: 'Possible Nephilim Bloodline'
    },
    {
      id: 'bloodline-vanduyn',
      name: 'Van Duyn Bloodline',
      type: 'lifespan',
      layer: 'illuminati-bloodlines',
      start: 1700,
      end: 2026,
      description: 'A family of Dutch origin linked in alternative history to banking networks, mental control experiments, and the implementation of social engineering projects.',
      source: 'Fritz Springmeier - Bloodlines of the Illuminati',
      isPeopleGroup: true,
      subLabel: 'Possible Nephilim Bloodline'
    },
    {
      id: 'bloodline-merovingian',
      name: 'Merovingian Bloodline (13th Line)',
      type: 'lifespan',
      layer: 'illuminati-bloodlines',
      start: 450,
      end: 2026,
      description: 'The ancient Frankish royal dynasty from whom the other bloodlines claim royal legitimacy. Associated in esoteric lore with the Holy Grail and direct descent from early biblical lineages.',
      source: 'Fritz Springmeier - Bloodlines of the Illuminati',
      isPeopleGroup: true,
      subLabel: 'Possible Nephilim Bloodline'
    },
    // ==========================================
    // 13 BLACK NOBILITY FAMILIES (VATICAN LINES)
    // ==========================================
    {
      id: 'nobility-medici',
      name: 'De Medici Bloodline',
      type: 'lifespan',
      layer: 'black-nobility',
      start: 1300,
      end: 2026,
      description: 'The dominant Italian banking family and political dynasty of Florence that rose to fame under Cosimo de\' Medici. They produced four popes and two queens of France, wielding immense religious and financial influence.',
      source: 'Vatican & Papal Historical Records',
      isPeopleGroup: true,
      subLabel: 'Possible Nephilim Bloodline'
    },
    {
      id: 'nobility-farnese',
      name: 'Farnese Bloodline',
      type: 'lifespan',
      layer: 'black-nobility',
      start: 1100,
      end: 2026,
      description: 'An influential Italian ducal family of Parma and Rome. Notably produced Pope Paul III, who authorized the founding of the Society of Jesus (Jesuits) and initiated the Counter-Reformation.',
      source: 'Vatican & Papal Historical Records',
      isPeopleGroup: true,
      subLabel: 'Possible Nephilim Bloodline'
    },
    {
      id: 'nobility-massimo',
      name: 'Massimo Bloodline',
      type: 'lifespan',
      layer: 'black-nobility',
      start: 1012,
      end: 2026,
      description: 'One of the oldest Roman patrician families, traditionally claiming descent from the ancient Roman Fabia gens. Long-standing members of the Black Nobility, serving as high advisors in the Papal court.',
      source: 'Vatican & Papal Historical Records',
      isPeopleGroup: true,
      subLabel: 'Possible Nephilim Bloodline'
    },
    {
      id: 'nobility-colonna',
      name: 'Colonna Bloodline',
      type: 'lifespan',
      layer: 'black-nobility',
      start: 1000,
      end: 2026,
      description: 'A powerful Roman princely family that produced Pope Martin V and key military leaders. Renowned for their historic centuries-long rivalry with the Orsini family for control of Rome and the papacy.',
      source: 'Vatican & Papal Historical Records',
      isPeopleGroup: true,
      subLabel: 'Possible Nephilim Bloodline'
    },
    {
      id: 'nobility-pallavicini',
      name: 'Pallavicini Bloodline',
      type: 'lifespan',
      layer: 'black-nobility',
      start: 1100,
      end: 2026,
      description: 'An ancient Italian noble dynasty of Genoese and Lombard origin, holding massive estates and banking interests in Italy and Austria. Linked to high-ranking Vatican diplomacy and finance.',
      source: 'Vatican & Papal Historical Records',
      isPeopleGroup: true,
      subLabel: 'Possible Nephilim Bloodline'
    },
    {
      id: 'nobility-torlonia',
      name: 'Torlonia Bloodline',
      type: 'lifespan',
      layer: 'black-nobility',
      start: 1750,
      end: 2026,
      description: 'A Roman noble family of French origin that amassed spectacular wealth in the 18th century through banking, administrative control of Vatican land holdings, and monopolistic contracts.',
      source: 'Vatican & Papal Historical Records',
      isPeopleGroup: true,
      subLabel: 'Possible Nephilim Bloodline'
    },
    {
      id: 'nobility-saxegotha',
      name: 'Saxe-Coburg-Gotha Bloodline',
      type: 'lifespan',
      layer: 'black-nobility',
      start: 1826,
      end: 2026,
      description: 'A highly successful German dynastic house whose members married into and inherited multiple European thrones, establishing reign over the United Kingdom, Belgium, Portugal, and Bulgaria.',
      source: 'European Royal Registries',
      isPeopleGroup: true,
      subLabel: 'Possible Nephilim Bloodline'
    },
    {
      id: 'nobility-cavendish',
      name: 'Cavendish Bloodline',
      type: 'lifespan',
      layer: 'black-nobility',
      start: 1350,
      end: 2026,
      description: 'One of the wealthiest and most influential English aristocratic families, holding the title of Duke of Devonshire. In alternative history narratives, they are linked to the Kennedy lineage.',
      source: 'British Peerage Records',
      isPeopleGroup: true,
      subLabel: 'Possible Nephilim Bloodline'
    },
    {
      id: 'nobility-windsor',
      name: 'Windsor Bloodline',
      type: 'lifespan',
      layer: 'black-nobility',
      start: 1917,
      end: 2026,
      description: 'The official reigning house of the United Kingdom, created in 1917 by King George V renaming the British branch of Saxe-Coburg-Gotha to distance the monarchy from its German roots during World War I.',
      source: 'British Royal Archives',
      isPeopleGroup: true,
      subLabel: 'Possible Nephilim Bloodline'
    },
    {
      id: 'nobility-romanov',
      name: 'Romanov Bloodline',
      type: 'lifespan',
      layer: 'black-nobility',
      start: 1613,
      end: 2026,
      description: 'The imperial dynasty that ruled Russia for over three centuries. Renowned for their vast wealth and territorial expansion, their sudden overthrow in 1917 is a focal point of globalist conspiracy theories.',
      source: 'Imperial Russian Archives',
      isPeopleGroup: true,
      subLabel: 'Possible Nephilim Bloodline'
    },
    {
      id: 'nobility-habsburg',
      name: 'Habsburg Bloodline',
      type: 'lifespan',
      layer: 'black-nobility',
      start: 1000,
      end: 2026,
      description: 'One of the most powerful and far-reaching royal houses in European history, supplying Holy Roman Emperors, Spanish monarchs, and Austrian emperors. Famous for consolidating power through strategic intermarriage.',
      source: 'European Royal Registries',
      isPeopleGroup: true,
      subLabel: 'Possible Nephilim Bloodline'
    },
    {
      id: 'nobility-plantagenet',
      name: 'Plantagenet Bloodline',
      type: 'lifespan',
      layer: 'black-nobility',
      start: 1154,
      end: 2026,
      description: 'A French-origin royal dynasty that ruled England from the 12th to the late 15th century. They oversaw major historical turning points, including the signing of the Magna Carta and the Hundred Years\' War.',
      source: 'English Royal Chronologies',
      isPeopleGroup: true,
      subLabel: 'Possible Nephilim Bloodline'
    },
    {
      id: 'taoism-founded',
      name: 'Life of Laozi (Taoism)',
      type: 'lifespan',
      layer: 'ancient-civilizations',
      start: -601,
      end: -531,
      description: 'Ancient Chinese philosopher and writer, reputed author of the Tao Te Ching and founder of Taoism.',
      source: 'Historical Chronology'
    },
    {
      id: 'buddhism-founded',
      name: 'Life of Buddha (Siddhartha Gautama)',
      type: 'lifespan',
      layer: 'ancient-civilizations',
      start: -563,
      end: -483,
      description: 'Founder of Buddhism, whose teachings on enlightenment and liberation from Samsara influenced spiritual traditions throughout Asia and later Western esotericism.',
      source: 'Historical Chronology'
    },
    {
      id: 'coral-castle-construction',
      name: 'Coral Castle Construction',
      type: 'lifespan',
      layer: 'alchemy-occult',
      start: 1923,
      end: 1951,
      description: 'Edward Leedskalnin single-handedly constructs Coral Castle in Florida, allegedly using ancient levitation or anti-gravity secrets.',
      source: 'Historical Records'
    },
    {
      id: 'operation-fishbowl',
      name: 'Operation Fishbowl',
      type: 'event',
      layer: 'secret-gov-programs',
      start: 1962,
      description: 'High-altitude nuclear tests over Johnston Atoll, theorized in alternative science as attempts to probe or breach the Earth\'s dome/firmament.',
      source: 'Declassified Military Records'
    },
    {
      id: 'gateway-process',
      name: 'The Gateway Process Report',
      type: 'event',
      layer: 'secret-gov-programs',
      start: 1983,
      description: 'U.S. Army/CIA report assessing the Monroe Institute\'s Hemi-Sync training for altered states of consciousness, astral projection, and remote viewing.',
      source: 'Declassified CIA Archives'
    },
    {
      id: 'kandahar-giant-event',
      name: 'The Kandahar Giant Encounter',
      type: 'event',
      layer: 'secret-gov-programs',
      start: 2002,
      description: 'A rumored encounter in Kandahar, Afghanistan where a U.S. Army squad reportedly engaged and killed a 13-foot red-haired giant inside a mountain cave. The giant\'s remains were allegedly airlifted away and classified.',
      source: 'Military Whistleblower Records'
    },
    {
      id: 'pythagoras-lifespan',
      name: 'Life of Pythagoras',
      type: 'lifespan',
      layer: 'alchemy-occult',
      start: -570,
      end: -495,
      description: 'Life of Pythagoras, Greek philosopher, mystic, mathematician, and founder of Pythagoreanism who taught reincarnation and sacred geometry.',
      source: 'Diogenes Laërtius'
    },
    {
      id: 'socrates-lifespan',
      name: 'Life of Socrates',
      type: 'lifespan',
      layer: 'alchemy-occult',
      start: -470,
      end: -399,
      description: 'Life of Socrates, classical Athenian philosopher whose dialectical method of inquiry laid the foundations of Western philosophy.',
      source: 'Plato\'s Dialogues'
    },
    {
      id: 'plato-lifespan',
      name: 'Life of Plato',
      type: 'lifespan',
      layer: 'alchemy-occult',
      start: -428,
      end: -348,
      description: 'Life of Plato, student of Socrates, founder of the Academy, and recorder of the Atlantis legend in Timaeus and Critias.',
      source: 'Plato\'s Dialogues'
    },
    {
      id: 'aristotle-lifespan',
      name: 'Life of Aristotle',
      type: 'lifespan',
      layer: 'alchemy-occult',
      start: -384,
      end: -322,
      description: 'Life of Aristotle, classical Greek philosopher, student of Plato, and tutor to Alexander the Great who founded the Lyceum.',
      source: 'Metaphysics'
    },
    {
      id: 'francis-bacon-lifespan',
      name: 'Life of Sir Francis Bacon',
      type: 'lifespan',
      layer: 'alchemy-occult',
      start: 1561,
      end: 1626,
      description: 'Life of Sir Francis Bacon, English philosopher, Rosicrucian visionary, and pioneer of the empirical scientific method.',
      source: 'Historical Biographies'
    },
    {
      id: 'manly-p-hall-lifespan',
      name: 'Life of Manly P. Hall',
      type: 'lifespan',
      layer: 'alchemy-occult',
      start: 1901,
      end: 1990,
      description: 'Life of Manly P. Hall, prominent esoteric author who published The Secret Teachings of All Ages and founded the PRS.',
      source: 'PRS Archives'
    },
    {
      id: 'hinduism-origins',
      name: 'Origins of Vedic Hinduism',
      type: 'event',
      layer: 'ancient-civilizations',
      start: -1500,
      description: 'The composition of the Rigveda, marking the formalization of early Vedic Hinduism in the Indus Valley.',
      source: 'Rigveda Chronicles'
    },
    {
      id: 'zoroastrianism-origins',
      name: 'Teachings of Zoroaster',
      type: 'event',
      layer: 'ancient-civilizations',
      start: -1000,
      description: 'The spiritual teachings of Zoroaster (Zarathustra) in ancient Persia, introducing cosmic dualism.',
      source: 'Avestan Records'
    },
    {
      id: 'gnosticism-origins',
      name: 'Nag Hammadi Library Burial',
      type: 'event',
      layer: 'alchemy-occult',
      start: 340,
      description: 'Scribes bury the Gnostic Gospels in a jar near Nag Hammadi, Egypt, preserving early esoteric Christian teachings from orthodox censorship.',
      source: 'Nag Hammadi Codices'
    },
    {
      id: 'rosicrucianism-origins',
      name: 'Publication of Fama Fraternitatis',
      type: 'event',
      layer: 'alchemy-occult',
      start: 1614,
      description: 'The publication of the first Rosicrucian Manifesto in Germany, announcing the secret Order of the Rose Cross.',
      source: 'Fama Fraternitatis'
    },
    {
      id: 'catholicism-history',
      name: 'Apostolic Foundation of Catholicism',
      type: 'event',
      layer: 'alchemy-occult',
      start: 33,
      description: 'Commissioning of Saint Peter as the head of the church in Rome, establishing the lineage of the papacy.',
      source: 'Roman Catholic Historical Annals'
    },
    {
      id: 'mormonism-origins',
      name: 'Translation of the Book of Mormon',
      type: 'event',
      layer: 'alchemy-occult',
      start: 1827,
      description: 'Joseph Smith receives the golden plates on the Hill Cumorah from the Angel Moroni, translating them to publish the Book of Mormon.',
      source: 'LDS Church Historical Archives'
    },
    {
      id: 'jpl-founded-event',
      name: 'Jet Propulsion Laboratory Founded',
      type: 'event',
      layer: 'nasa-space',
      start: 1936,
      description: 'Occultist and rocket scientist Jack Parsons, along with Frank Malina and the Caltech \'Suicide Squad,\' begins early rocket testing that leads to the establishment of JPL.',
      source: 'JPL Historical Records / Strange Angel'
    },
    {
      id: 'nasa-founded-event',
      name: 'NASA Officially Established',
      type: 'event',
      layer: 'nasa-space',
      start: 1958,
      description: 'President Dwight D. Eisenhower signs the National Aeronautics and Space Act, establishing NASA as a civilian space agency absorbing NACA and military rocket groups.',
      source: 'National Aeronautics and Space Act of 1958'
    },
    {
      id: 'apollo-11-landing-event',
      name: 'Apollo 11 Moon Landing',
      type: 'event',
      layer: 'nasa-space',
      start: 1969,
      description: 'Astronauts Neil Armstrong and Buzz Aldrin land the Apollo Lunar Module on the Moon, a historic feat that alternative researchers study for anomalous broadcast transmissions, shadows, and Masonic symbolic gestures.',
      source: 'NASA Mission Logs / Apollo 11 Press Kit'
    },
    {
      id: 'project-mercury-start',
      name: 'Project Mercury',
      type: 'lifespan',
      layer: 'nasa-space',
      start: 1958,
      end: 1963,
      description: 'The first U.S. human spaceflight program, designed to put an astronaut into Earth orbit and safely recover them.',
      source: 'NASA Project Mercury History Office'
    },
    {
      id: 'project-gemini-start',
      name: 'Project Gemini',
      type: 'lifespan',
      layer: 'nasa-space',
      start: 1961,
      end: 1966,
      description: 'The second human spaceflight program, focused on developing orbital rendezvous, docking, and extravehicular activity (EVA) techniques.',
      source: 'NASA Gemini Program Summaries'
    },
    {
      id: 'project-apollo-start',
      name: 'Project Apollo',
      type: 'lifespan',
      layer: 'nasa-space',
      start: 1961,
      end: 1972,
      description: 'NASA\'s historic lunar landing program, which succeeded in landing the first humans on the Moon in 1969. Heavily analyzed for potential anomalies.',
      source: 'NASA Apollo Mission Logs'
    },
    {
      id: 'artemis-program-event',
      name: 'Artemis I Lunar Mission',
      type: 'event',
      layer: 'nasa-space',
      start: 2022,
      description: 'The uncrewed Artemis I flight test launches from Cape Canaveral, performing a lunar flyby and returning to Earth, marking the official operational debut of the SLS and Orion spacecraft.',
      source: 'NASA Mission Reports'
    },
    {
      id: 'paracas-geoglyphs-event',
      name: 'Paracas Hillside Geoglyphs Etched',
      type: 'event',
      layer: 'ancient-civilizations',
      start: -400,
      description: 'The Paracas culture designs and carves humanoid geoglyphs onto hillsides in the Ica valley, predating the Nazca Lines by centuries.',
      source: 'Paracas Culture Archaeological Overviews'
    },
    {
      id: 'palpa-geoglyphs-event',
      name: 'Palpa Valley Geoglyphs Designed',
      type: 'event',
      layer: 'ancient-civilizations',
      start: -200,
      description: 'Ancient artists etch giant geometric figures and the famous Paracas Family geoglyph onto the hillsides and mountaintops of the Palpa Valley.',
      source: 'UNESCO World Heritage Registration'
    },
    {
      id: 'chi-rho-vision-event',
      name: 'Constantines Chi Rho Vision',
      type: 'event',
      layer: 'biblical-events',
      start: 312,
      description: 'Roman Emperor Constantine the Great reports a vision of the Chi Rho symbol in the sky before the Battle of Milvian Bridge, leading to his victory and conversion.',
      source: 'Life of Constantine (Eusebius)'
    },
    {
      id: 'project-sun-streak-event',
      name: 'Project Sun Streak Initiated',
      type: 'event',
      layer: 'secret-gov-programs',
      start: 1985,
      description: 'The DIA initiates Project Sun Streak to study declassified remote viewing and psychic intelligence, carrying forward the work of Grill Flame.',
      source: 'Declassified DIA Records'
    },
    {
      id: 'plutarch-writing-event',
      name: 'Plutarch Writing at Delphi',
      type: 'event',
      layer: 'greek-mythology',
      start: 100,
      description: 'Greek essayist and priest Plutarch writes his Parallel Lives and Moralia at Delphi, documenting anomalies like aerial shields and early lunar habitability theories.',
      source: 'Plutarch Moralia'
    },
    {
      id: 'vimanas-mahabharata-event',
      name: 'Vimana Epoch of Sanskrit Epics',
      type: 'event',
      layer: 'ancient-civilizations',
      start: -3000,
      description: 'Prehistoric flying palaces and chariots called Vimanas are recorded in Sanskrit epics during the Kurukshetra War epoch in ancient India.',
      source: 'Mahabharata Sanskrit Epics'
    },
    {
      id: 'canyon-de-chelly-dwellings-event',
      name: 'Anasazi Cliff Construction',
      type: 'event',
      layer: 'ancient-civilizations',
      start: 1100,
      description: 'Anasazi Builders construct the White House Cliff Dwellings in Canyon de Chelly, Arizona, creating stone architecture linked to subterranean Hopi legends.',
      source: 'National Park Service Archeology Reports'
    },
    {
      id: 'ugle-foundation-event',
      name: 'Foundation of Premier Grand Lodge',
      type: 'event',
      layer: 'alchemy-occult',
      start: 1717,
      description: 'Four London taverns unite to form the Premier Grand Lodge of England, establishing modern organised Freemasonry.',
      source: 'Masonic Constitutions of 1723'
    },
    {
      id: 'detroit-masonic-temple-event',
      name: 'Detroit Masonic Temple Dedication',
      type: 'event',
      layer: 'alchemy-occult',
      start: 1926,
      description: 'The Detroit Masonic Temple, the largest Masonic temple in the world, is formally dedicated on Temple Avenue, featuring massive Gothic and Masonic architecture.',
      source: 'Detroit Historical Records'
    },
    {
      id: 'cern-lhc-startup-event',
      name: 'Large Hadron Collider Startup',
      type: 'event',
      layer: 'secret-gov-programs',
      start: 2008,
      description: 'The Large Hadron Collider at CERN goes online near Geneva, launching a new era of particle collisions and experimental space-time anomalies research.',
      source: 'CERN Laboratory Logs'
    },
    {
      id: 'ssc-abandonment-event',
      name: 'SSC Super Collider Cancelled',
      type: 'event',
      layer: 'secret-gov-programs',
      start: 1993,
      description: 'The United States Congress cancels construction of the massive Superconducting Super Collider in Waxahachie, Texas, leaving 14 miles of tunnels abandoned.',
      source: 'Congressional Record'
    },
        {
      id: 'saint-john-vianney-exhumation-event',
      name: 'St. John Vianney Exhumed Incorrupt',
      type: 'event',
      layer: 'biblical-events',
      start: 1904,
      description: 'The body of Saint John Vianney, the Curé dArs, is exhumed during the canonization process and found fully incorrupt.',
      source: 'Ars-sur-Formans Archives'
    },
    {
      id: 'saint-silvan-martyrdom-event',
      name: 'Martyrdom of Saint Silvan',
      type: 'event',
      layer: 'biblical-events',
      start: 350,
      description: 'Saint Silvan of Alexandria is martyred. His body, which exhibits complete resistance to decomposition, is later placed in Dubrovnik.',
      source: 'Dubrovnik Cathedral Historical Records'
    },
    {
      id: 'saint-charbel-light-event',
      name: 'Mystical Light Over Charbel Tomb',
      type: 'event',
      layer: 'biblical-events',
      start: 1898,
      description: 'Following the death of Saint Charbel Makhlouf, a brilliant white light glows over his tomb in Annaya for 45 days, prompting exhumation.',
      source: 'Monastery of Saint Maron Annals'
    },
    {
      id: 'saint-teresa-ecstasy-event',
      name: 'St. Teresa Ecstasy Vision',
      type: 'event',
      layer: 'biblical-events',
      start: 1559,
      description: 'Saint Teresa of Avila experiences her famous transverberation vision, where an angel pierces her heart with a golden lance of divine love.',
      source: 'Autobiography of St. Teresa'
    },
{
      id: 'saint-francis-stigmata-event',
      name: 'St. Francis Receives Stigmata',
      type: 'event',
      layer: 'biblical-events',
      start: 1224,
      description: 'Saint Francis of Assisi receives the stigmata (crucifixion wounds of Christ) on Mount La Verna, the first recorded case in history.',
      source: 'Life of Saint Francis (Bonaventure)'
    },
    {
      id: 'saint-joan-of-arc-victory-event',
      name: 'Joan of Arc Relieves Orléans',
      type: 'event',
      layer: 'biblical-events',
      start: 1429,
      description: 'Joan of Arc, guided by mystical voices, leads French forces to victory at the Siege of Orléans, changing the course of the Hundred Years War.',
      source: 'French Royal Chronicles'
    },
    {
      id: 'saint-anthony-tomb-event',
      name: 'St. Anthony Tongue Incorrupt',
      type: 'event',
      layer: 'biblical-events',
      start: 1263,
      description: 'Thirty years after death, Saint Anthony of Paduas tomb is opened. His body is dust, but his tongue is found perfectly fresh and glistening.',
      source: 'Padua Basilica Records'
    },
    {
      id: 'saint-bernadette-exhumation-event',
      name: 'St. Bernadette Exhumation',
      type: 'event',
      layer: 'biblical-events',
      start: 1909,
      description: 'Thirty years after her death, Saint Bernadette of Soubirous is exhumed in Nevers, France, and her body is found completely intact and incorrupt.',
      source: 'Lourdes Medical Committee'
    },
    {
      id: 'saint-padre-pio-stigmata-event',
      name: 'Padre Pio Receives Stigmata',
      type: 'event',
      layer: 'biblical-events',
      start: 1918,
      description: 'Padre Pio receives the visible stigmata wounds during prayer in the choir of San Giovanni Rotondo, which remained open and bleeding for 50 years.',
      source: 'Capuchin Convent Logs'
    },
    {
      id: 'saint-catherine-medal-event',
      name: 'Miraculous Medal Visions',
      type: 'event',
      layer: 'biblical-events',
      start: 1830,
      description: 'Saint Catherine Labouré receives visions of the Virgin Mary in Paris, instructing her to strike and distribute the Miraculous Medal.',
      source: 'Rue du Bac Chapel Archives'
    },
    {
      id: 'saint-rita-death-event',
      name: 'Death of Saint Rita',
      type: 'event',
      layer: 'biblical-events',
      start: 1457,
      description: 'Saint Rita of Cascia dies. Her body immediately begins to emit a sweet fragrance and shows complete resistance to decomposition, remaining incorrupt.',
      source: 'Augustinian Cascia Archives'
    },
    {
      id: 'wernher-von-braun-event',
      name: 'von Braun Named MSFC Director',
      type: 'event',
      layer: 'nasa-space',
      start: 1960,
      description: 'Wernher von Braun is appointed the first Director of the Marshall Space Flight Center at Huntsville, Alabama, leading the development of the Saturn V moon rocket.',
      source: 'NASA Marshall History Office'
    },
    {
      id: 'elon-musk-event',
      name: 'SpaceX Founded by Elon Musk',
      type: 'event',
      layer: 'nasa-space',
      start: 2002,
      description: 'Elon Musk establishes SpaceX in Hawthorne, California, to revolutionize space transport and enable the colonization of Mars.',
      source: 'SpaceX Mission Statements'
    },
    {
      id: 'jeff-bezos-event',
      name: 'Blue Origin Founded by Jeff Bezos',
      type: 'event',
      layer: 'nasa-space',
      start: 2000,
      description: 'Jeff Bezos establishes Blue Origin in Kent, Washington, to develop reusable rocket engines and suborbital spaceflight technologies.',
      source: 'Blue Origin Mission Records'
    },
    {
      id: 'robert-bigelow-event',
      name: 'Bigelow Aerospace Founded',
      type: 'event',
      layer: 'nasa-space',
      start: 1999,
      description: 'Robert Bigelow establishes Bigelow Aerospace to manufacture expandable space habitat designs based on NASA transhab technology.',
      source: 'Bigelow Corporate History'
    },
    {
      id: 'apollo-7-event',
      name: 'Apollo 7 Mission',
      type: 'event',
      layer: 'nasa-space',
      start: 1968,
      description: 'The first crewed mission of the Apollo program, testing the Command and Service Module in Earth orbit.',
      source: 'NASA Mission Reports'
    },
    {
      id: 'apollo-8-event',
      name: 'Apollo 8 Mission',
      type: 'event',
      layer: 'nasa-space',
      start: 1968,
      description: 'The first crewed spacecraft to reach and orbit the Moon, returning safely to Earth.',
      source: 'NASA Historical Data Book'
    },
    {
      id: 'apollo-9-event',
      name: 'Apollo 9 Mission',
      type: 'event',
      layer: 'nasa-space',
      start: 1969,
      description: 'The first crewed flight test of the complete Apollo spacecraft, including the Lunar Module, in Earth orbit.',
      source: 'NASA Mission Summary'
    },
    {
      id: 'apollo-10-event',
      name: 'Apollo 10 Mission',
      type: 'event',
      layer: 'nasa-space',
      start: 1969,
      description: 'The dress rehearsal for the first Moon landing, descending the Lunar Module to within 8.4 nautical miles of the surface.',
      source: 'NASA Mission Logs'
    },
    {
      id: 'apollo-12-event',
      name: 'Apollo 12 Mission',
      type: 'event',
      layer: 'nasa-space',
      start: 1969,
      description: 'The second crewed lunar landing, executing a precision touchdown in the Ocean of Storms.',
      source: 'NASA Mission Logs'
    },
    {
      id: 'apollo-13-event',
      name: 'Apollo 13 Mission',
      type: 'event',
      layer: 'nasa-space',
      start: 1970,
      description: 'An oxygen tank explosion en route to the Moon aborts the landing, forcing a dramatic rescue mission.',
      source: 'Rogers Commission Report'
    },
    {
      id: 'apollo-14-event',
      name: 'Apollo 14 Mission',
      type: 'event',
      layer: 'nasa-space',
      start: 1971,
      description: 'The third successful crewed lunar landing, piloted by Alan Shepard who hit golf balls on the Moon.',
      source: 'NASA Mission Logs'
    },
    {
      id: 'apollo-15-event',
      name: 'Apollo 15 Mission',
      type: 'event',
      layer: 'nasa-space',
      start: 1971,
      description: 'The first J-mission, utilizing the Lunar Roving Vehicle to explore the Hadley-Apennine region.',
      source: 'NASA Mission Logs'
    },
    {
      id: 'apollo-16-event',
      name: 'Apollo 16 Mission',
      type: 'event',
      layer: 'nasa-space',
      start: 1972,
      description: 'The fifth crewed lunar landing, exploring the Descartes Highlands.',
      source: 'NASA Mission Logs'
    },
    {
      id: 'apollo-17-event',
      name: 'Apollo 17 Mission',
      type: 'event',
      layer: 'nasa-space',
      start: 1972,
      description: 'The final mission of the Apollo lunar landing program, featuring geologist Harrison Schmitt.',
      source: 'NASA Mission Logs'
    },
    {
      id: 'spacex-falcon-heavy-event',
      name: 'Falcon Heavy Demonstration',
      type: 'event',
      layer: 'nasa-space',
      start: 2018,
      description: 'SpaceX launches the Falcon Heavy Demonstration, sending a Tesla Roadster and Starman into heliocentric orbit.',
      source: 'SpaceX Mission Data'
    },
    {
      id: 'spacex-crew-dragon-event',
      name: 'Crew Dragon Demo-2',
      type: 'event',
      layer: 'nasa-space',
      start: 2020,
      description: 'SpaceX launches the first crewed private spacecraft to the International Space Station, restoring domestic crewed flight capability.',
      source: 'NASA/SpaceX Press Kit'
    },
    {
      id: 'spacex-starship-event',
      name: 'Starship flight tests',
      type: 'event',
      layer: 'nasa-space',
      start: 2023,
      description: 'SpaceX begins orbital flight tests of the fully reusable, super-heavy Starship rocket from Starbase.',
      source: 'SpaceX Development Logs'
    },
    {
      id: 'blue-origin-new-glenn-event',
      name: 'New Glenn Rocket Launch',
      type: 'event',
      layer: 'nasa-space',
      start: 2025,
      description: 'Blue Origin launches its heavy-lift New Glenn rocket from Launch Complex 36 at Cape Canaveral.',
      source: 'Blue Origin Launch Reports'
    },
    // --- ESOTERIC/OCCULT TIMELINE ITEMS ---
    {
      id: 'amalantrah-working-event',
      name: 'Amalantrah Working',
      type: 'event',
      layer: 'alchemy-occult',
      start: 1918,
      description: 'Aleister Crowley performs a series of magical workings in New York City, opening a spiritual portal and drawing the likeness of an extraterrestrial-like intelligence named Lam.',
      source: 'The Equinox / Thelemic Records'
    },
    {
      id: 'scientology-founded-event',
      name: 'Church of Scientology Founded',
      type: 'event',
      layer: 'alchemy-occult',
      start: 1954,
      description: 'L. Ron Hubbard officially establishes the Church of Scientology in Los Angeles, developing his spiritual technology of Dianetics and the concept of the immortal Thetan.',
      source: 'Scientology Archives / Religious History Studies'
    },
    {
      id: 'l-ron-hubbard-lifespan',
      name: 'L. Ron Hubbard',
      type: 'lifespan',
      layer: 'alchemy-occult',
      start: 1911,
      end: 1986,
      description: 'American writer, founder of Scientology, and former associate of Jack Parsons with whom he conducted the famous Babalon Working rituals in Pasadena.',
      source: 'Historical Biographies'
    },
    {
      id: 'kenneth-grant-lifespan',
      name: 'Kenneth Grant',
      type: 'lifespan',
      layer: 'alchemy-occult',
      start: 1924,
      end: 2011,
      description: 'English occultist, disciple of Aleister Crowley, and head of the Typhonian O.T.O. who integrated cosmic horror and Lovecraftian mythos into Western esotericism.',
      source: 'Typhonian Order Archives'
    },
    {
      id: 'hp-lovecraft-lifespan',
      name: 'H.P. Lovecraft',
      type: 'lifespan',
      layer: 'alchemy-occult',
      start: 1890,
      end: 1937,
      description: 'Influential author of cosmic horror and the Cthulhu Mythos, whose descriptions of ancient alien deities became highly integrated into modern esoteric traditions.',
      source: 'Historical Biographies'
    },
    {
      id: 'peter-levenda-lifespan',
      name: 'Peter Levenda',
      type: 'lifespan',
      layer: 'alchemy-occult',
      start: 1950,
      description: 'American historian and author who documented the connections between occultism, intelligence networks, and historical conspiracies.',
      source: 'Occult History Literature'
    },
    // --- MYTHS & LEGENDS TIMELINE ITEMS ---
    {
      id: 'robin-hood-legends-era',
      name: 'Robin Hood Legends',
      type: 'event',
      layer: 'greek-mythology',
      start: 1200,
      description: 'The era of the legendary archer and outlaw Robin Hood and his Merry Men in Sherwood Forest, fighting the corruption of the Sheriff of Nottingham.',
      source: 'Medieval Ballads'
    },
    {
      id: 'arthurian-legend-era',
      name: 'Reign of King Arthur',
      type: 'event',
      layer: 'greek-mythology',
      start: 500,
      description: 'The legendary reign of King Arthur at Camelot, established by the prophecies of Merlin and guarded by the Knights of the Round Table.',
      source: 'Geoffrey of Monmouth'
    },
    {
      id: 'tomb-king-arthur-discovered',
      name: 'Claimed Discovery of King Arthur\'s Tomb',
      type: 'event',
      layer: 'greek-mythology',
      start: 1191,
      description: 'Monks at Glastonbury Abbey claim to discover the oak coffin and graves of King Arthur and Queen Guinevere, marked by a lead cross declaring the site as Avalon.',
      source: 'Glastonbury Abbey Chronicles'
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
  'job_patriarch': { lng: 35.600, lat: 30.300, locationName: 'Land of Uz', category: 'Biblical Figures' },
  'melchizedek': { lng: 35.235, lat: 31.778, locationName: 'Salem (Jerusalem)', category: 'Biblical Figures' },
  'abraham': { lng: 35.111, lat: 31.524, locationName: 'Hebron (Tomb of the Patriarchs)', category: 'Biblical Figures' },
  'sarah': { lng: 35.111, lat: 31.524, locationName: 'Hebron (Tomb of the Patriarchs)', category: 'Biblical Figures' },
  'lot': { lng: 35.450, lat: 31.050, locationName: 'Sodom / Zoar', category: 'Biblical Figures' },
  'hagar': { lng: 34.792, lat: 31.244, locationName: 'Wilderness of Beersheba', category: 'Biblical Figures' },
  'isaac': { lng: 34.792, lat: 31.244, locationName: 'Beersheba', category: 'Biblical Figures' },
  'rebekah': { lng: 35.111, lat: 31.524, locationName: 'Hebron (Tomb of the Patriarchs)', category: 'Biblical Figures' },
  'jacob': { lng: 35.222, lat: 31.936, locationName: 'Bethel', category: 'Biblical Figures' },
  'leah': { lng: 35.111, lat: 31.524, locationName: 'Hebron (Tomb of the Patriarchs)', category: 'Biblical Figures' },
  'rachel': { lng: 35.202, lat: 31.711, locationName: 'Rachel\'s Tomb (Bethlehem)', category: 'Biblical Figures' },
  'joseph': { lng: 31.820, lat: 30.610, locationName: 'Goshen (Egypt)', category: 'Biblical Figures' },
  'miriam': { lng: 34.422, lat: 30.638, locationName: 'Kadesh Barnea', category: 'Biblical Figures' },
  'aaron': { lng: 35.412, lat: 30.317, locationName: 'Mount Hor', category: 'Biblical Figures' },
  'moses': { lng: 35.725, lat: 31.767, locationName: 'Mount Nebo', category: 'Biblical Figures' },
  'joshua': { lng: 35.289, lat: 32.056, locationName: 'Shiloh', category: 'Biblical Figures' },
  'caleb': { lng: 35.111, lat: 31.524, locationName: 'Hebron', category: 'Biblical Figures' },
  'deborah_judge': { lng: 35.390, lat: 32.686, locationName: 'Mount Tabor', category: 'Biblical Figures' },
  'gideon': { lng: 35.302, lat: 32.549, locationName: 'Spring of Harod', category: 'Biblical Figures' },
  'samson': { lng: 34.896, lat: 31.810, locationName: 'Timnah', category: 'Biblical Figures' },
  'samuel_prophet': { lng: 35.216, lat: 31.890, locationName: 'Ramah', category: 'Biblical Figures' },
  'saul_king': { lng: 35.231, lat: 31.823, locationName: 'Gibeah', category: 'Biblical Figures' },
  'jonathan': { lng: 35.231, lat: 31.823, locationName: 'Gibeah', category: 'Biblical Figures' },
  'david': { lng: 35.235, lat: 31.773, locationName: 'City of David (Jerusalem)', category: 'Biblical Figures' },
  'david_pat': { lng: 35.235, lat: 31.773, locationName: 'City of David (Jerusalem)', category: 'Biblical Figures' },
  'absalom': { lng: 35.239, lat: 31.777, locationName: 'Tomb of Absalom (Jerusalem)', category: 'Biblical Figures' },
  'nathan_prophet': { lng: 35.235, lat: 31.778, locationName: 'Jerusalem', category: 'Biblical Figures' },
  'solomon': { lng: 35.235, lat: 31.778, locationName: 'Jerusalem', category: 'Biblical Figures' },
  'solomon_pat': { lng: 35.235, lat: 31.778, locationName: 'Jerusalem', category: 'Biblical Figures' },
  'jeroboam_i': { lng: 35.277, lat: 32.213, locationName: 'Shechem', category: 'Biblical Figures' },
  'ahab_king': { lng: 35.189, lat: 32.276, locationName: 'Samaria', category: 'Biblical Figures' },
  'jezebel_queen': { lng: 35.326, lat: 32.559, locationName: 'Jezreel', category: 'Biblical Figures' },
  'elijah': { lng: 35.018, lat: 32.744, locationName: 'Mount Carmel', category: 'Biblical Figures' },
  'elisha': { lng: 35.451, lat: 32.339, locationName: 'Abel-meholah', category: 'Biblical Figures' },
  'jonah': { lng: 43.150, lat: 36.360, locationName: 'Nineveh', category: 'Biblical Figures' },
  'isaiah': { lng: 35.235, lat: 31.778, locationName: 'Jerusalem', category: 'Biblical Figures' },
  'jeremiah': { lng: 35.260, lat: 31.815, locationName: 'Anathoth', category: 'Biblical Figures' },
  'ezekiel': { lng: 44.422, lat: 32.536, locationName: 'Babylon (River Chebar)', category: 'Biblical Figures' },
  'daniel_prophet': { lng: 48.241, lat: 32.189, locationName: 'Susa (Persia)', category: 'Biblical Figures' },
  'esther_queen': { lng: 48.241, lat: 32.189, locationName: 'Susa (Persia)', category: 'Biblical Figures' },
  'ezra': { lng: 35.235, lat: 31.778, locationName: 'Jerusalem', category: 'Biblical Figures' },
  'nehemiah': { lng: 35.235, lat: 31.778, locationName: 'Jerusalem', category: 'Biblical Figures' },
  'herod_great': { lng: 35.241, lat: 31.666, locationName: 'Herodium (Judea)', category: 'Biblical Figures' },
  'john_baptist': { lng: 35.557, lat: 31.897, locationName: 'Jordan River', category: 'Biblical Figures' },
  'jesus': { lng: 35.300, lat: 32.702, locationName: 'Nazareth', category: 'Biblical Figures' },
  'mary_magdalene': { lng: 35.503, lat: 32.825, locationName: 'Magdala', category: 'Biblical Figures' },
  'mary-magdalene': { lng: 35.503, lat: 32.825, locationName: 'Magdala', category: 'Biblical Figures' },
  'stephen_martyr': { lng: 35.235, lat: 31.778, locationName: 'Jerusalem', category: 'Biblical Figures' },
  'james_apostle': { lng: 35.235, lat: 31.778, locationName: 'Jerusalem', category: 'Biblical Figures' },
  'james_brother': { lng: 35.235, lat: 31.778, locationName: 'Jerusalem', category: 'Biblical Figures' },
  'jude_brother': { lng: 35.300, lat: 32.702, locationName: 'Galilee', category: 'Biblical Figures' },
  'barnabas': { lng: 33.366, lat: 35.166, locationName: 'Cyprus', category: 'Biblical Figures' },
  'mark_evangelist': { lng: 29.918, lat: 31.200, locationName: 'Alexandria', category: 'Biblical Figures' },
  'luke_evangelist': { lng: 36.150, lat: 36.200, locationName: 'Antioch', category: 'Biblical Figures' },
  'matthew_apostle': { lng: 35.530, lat: 32.810, locationName: 'Capernaum', category: 'Biblical Figures' },
  'timothy_bishop': { lng: 27.341, lat: 37.941, locationName: 'Ephesus', category: 'Biblical Figures' },
  'lazarus': { lng: 35.258, lat: 31.772, locationName: 'Bethany', category: 'Biblical Figures' },
  'martha_bethany': { lng: 35.258, lat: 31.772, locationName: 'Bethany', category: 'Biblical Figures' },
  'mary_bethany': { lng: 35.258, lat: 31.772, locationName: 'Bethany', category: 'Biblical Figures' },

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
  'rephaim': { lng: 35.972, lat: 32.837, locationName: 'Ashtaroth Karnaim (Bashan)', category: 'Ancient People Groups' },
  'anakim': { lng: 35.110, lat: 31.527, locationName: 'Hebron (Kiriath-Arba)', category: 'Ancient People Groups' },
  'emim': { lng: 35.727, lat: 31.636, locationName: 'Shaveh Kiriathaim (Moab)', category: 'Ancient People Groups' },
  'zamzummim': { lng: 35.930, lat: 31.950, locationName: 'Land of Ammon', category: 'Ancient People Groups' },
  'horites': { lng: 35.480, lat: 30.320, locationName: 'Mount Seir (Edom)', category: 'Ancient People Groups' },
  'avim': { lng: 34.450, lat: 31.500, locationName: 'Gaza (Hazerim)', category: 'Ancient People Groups' },
  'perizzites': { lng: 35.263, lat: 32.062, locationName: 'Hill Country of Ephraim', category: 'Ancient People Groups' },
  'kenites': { lng: 35.125, lat: 31.280, locationName: 'Wilderness of Arad', category: 'Ancient People Groups' },
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

  // The Occult Locations
  'nicolas-flamel': { lng: 2.353333, lat: 48.863333, locationName: 'House of Nicolas Flamel (Paris, France)', category: 'The Occult' },
  'evt-flamel-stone': { lng: 2.353333, lat: 48.863333, locationName: 'House of Nicolas Flamel (Paris, France)', category: 'The Occult' },
  'isaac-newton': { lng: -0.630278, lat: 52.809167, locationName: 'Woolsthorpe Manor (Lincolnshire, England)', category: 'The Occult' },
  'evt-newton-alchemy': { lng: 0.118, lat: 52.205, locationName: 'Trinity College (Cambridge, England)', category: 'The Occult' },
  'evt-newton-emerald-tablet': { lng: -0.630278, lat: 52.809167, locationName: 'Woolsthorpe Manor (Lincolnshire, England)', category: 'The Occult' },
  'evt-golden-dawn-founded': { lng: -0.1278, lat: 51.5074, locationName: 'London, England', category: 'The Occult' },
  'aleister-crowley': { lng: -4.437222, lat: 57.265278, locationName: 'Boleskine House (Loch Ness, Scotland)', category: 'The Occult' },
  'evt-crowley-boleskine': { lng: -4.437222, lat: 57.265278, locationName: 'Boleskine House (Loch Ness, Scotland)', category: 'The Occult' },
  'evt-book-of-the-law': { lng: 31.2357, lat: 30.0444, locationName: 'Cairo, Egypt', category: 'The Occult' },
  'jack-parsons': { lng: -118.156111, lat: 34.133333, locationName: 'Parsons Residence (Pasadena, California)', category: 'The Occult' },
  'evt-babalon-working': { lng: -118.156111, lat: 34.133333, locationName: 'Parsons Residence (Pasadena, California)', category: 'The Occult' },
  'abbey-of-thelema': { lng: 14.030556, lat: 38.031944, locationName: 'Abbey of Thelema (Cefalù, Sicily)', category: 'The Occult' },
  'evt-golem-prague': { lng: 14.418611, lat: 50.090000, locationName: 'Old-New Synagogue (Prague, Czech Republic)', category: 'The Occult' },
  'evt-theosophy-society': { lng: -74.0060, lat: 40.7128, locationName: 'New York City, New York', category: 'The Occult' },
  'john-dee': { lng: -0.270, lat: 51.469, locationName: 'Mortlake (London, England)', category: 'The Occult' },
  'john-dee-mortlake': { lng: -0.270, lat: 51.469, locationName: 'Mortlake (London, England)', category: 'The Occult' },
  'knights-templar-founded': { lng: 35.235, lat: 31.778, locationName: 'Temple Mount (Jerusalem)', category: 'The Occult' },
  'knights-hospitaller-founded': { lng: 35.2294, lat: 31.7772, locationName: 'Muristan (Jerusalem)', category: 'The Occult' },
  'illuminati-founded': { lng: 11.4244, lat: 48.7667, locationName: 'Ingolstadt, Bavaria, Germany', category: 'The Occult' },
  'lucis-trust-founded': { lng: -73.9669, lat: 40.7516, locationName: '866 United Nations Plaza (New York, NY)', category: 'The Occult' },
  'robert-maxwell': { lng: -1.2335, lat: 51.7589, locationName: 'Headington Hill Hall (Oxford, England)', category: 'The Occult' },
  'maxwell-pergamon': { lng: -1.2335, lat: 51.7589, locationName: 'Headington Hill Hall (Oxford, England)', category: 'The Occult' },
  
  // Ancient Civilizations / People Groups
  'timeline-egyptian-civilization': { lng: 31.1342, lat: 29.9792, locationName: 'Great Pyramids of Giza (Egypt)', category: 'Ancient People Groups' },
  'timeline-tribe-of-judah': { lng: 35.0998, lat: 31.5298, locationName: 'Judean Hills (Hebron, Israel)', category: 'Ancient People Groups' },
  'timeline-sumerian-civilization': { lng: 46.12, lat: 31.32, locationName: 'Ur & Eridu (Sumerian Heartland)', category: 'Ancient People Groups' },
  'timeline-edomites': { lng: 35.44, lat: 30.32, locationName: 'Mount Seir (Edomite Territory)', category: 'Ancient People Groups' },
  'timeline-philistines': { lng: 34.50, lat: 31.66, locationName: 'Ashkelon (Philistine Pentapolis)', category: 'Ancient People Groups' },
  
  // 13 Illuminati Bloodlines
  'bloodline-rothschild': { lng: 8.6872, lat: 50.1119, locationName: 'Judengasse Ancestral House (Frankfurt, Germany)', category: 'The Occult' },
  'bloodline-rockefeller': { lng: -73.9787, lat: 40.7587, locationName: 'Rockefeller Plaza (New York City, USA)', category: 'The Occult' },
  'bloodline-astor': { lng: -73.9856, lat: 40.7484, locationName: 'Waldorf-Astoria / Astor Estates (New York City, USA)', category: 'The Occult' },
  'bloodline-bundy': { lng: -77.0365, lat: 38.8977, locationName: 'Bundy Family Offices (Washington D.C., USA)', category: 'The Occult' },
  'bloodline-collins': { lng: -70.8967, lat: 42.5195, locationName: 'Collins Family Homestead (Salem, Massachusetts, USA)', category: 'The Occult' },
  'bloodline-dupont': { lng: -75.5786, lat: 39.7707, locationName: 'DuPont Gunpowder Mills & Estates (Wilmington, Delaware, USA)', category: 'The Occult' },
  'bloodline-freeman': { lng: -71.0589, lat: 42.3601, locationName: 'Freeman Family Estate (Boston, Massachusetts, USA)', category: 'The Occult' },
  'bloodline-kennedy': { lng: -70.3014, lat: 41.6303, locationName: 'Kennedy Compound (Hyannis Port, Massachusetts, USA)', category: 'The Occult' },
  'bloodline-li': { lng: 114.1601, lat: 22.2798, locationName: 'Cheung Kong Center (Hong Kong)', category: 'The Occult' },
  'bloodline-onassis': { lng: 20.7378, lat: 38.6925, locationName: 'Skorpios Island (Ionian Sea, Greece)', category: 'The Occult' },
  'bloodline-russell': { lng: -72.9298, lat: 41.3082, locationName: 'Skull and Bones Tomb (New Haven, Connecticut, USA)', category: 'The Occult' },
  'bloodline-vanduyn': { lng: 4.3007, lat: 52.0705, locationName: 'Van Duyn Ancestral Estates (The Hague, Netherlands)', category: 'The Occult' },
  'bloodline-merovingian': { lng: 3.3886, lat: 50.6056, locationName: 'Tomb of Childeric I (Tournai, Belgium)', category: 'The Occult' },
  
  // Black Nobility Families
  'nobility-medici': { lng: 11.2558, lat: 43.7731, locationName: 'Medici Palace (Florence, Italy)', category: 'The Occult' },
  'nobility-farnese': { lng: 12.4706, lat: 41.8947, locationName: 'Palazzo Farnese (Rome, Italy)', category: 'The Occult' },
  'nobility-massimo': { lng: 12.4739, lat: 41.8972, locationName: 'Palazzo Massimo alle Colonne (Rome, Italy)', category: 'The Occult' },
  'nobility-colonna': { lng: 12.4839, lat: 41.8986, locationName: 'Palazzo Colonna (Rome, Italy)', category: 'The Occult' },
  'nobility-pallavicini': { lng: 12.4878, lat: 41.8986, locationName: 'Palazzo Pallavicini-Rospigliosi (Rome, Italy)', category: 'The Occult' },
  'nobility-torlonia': { lng: 12.4797, lat: 41.8936, locationName: 'Villa Torlonia / Torlonia Banking House (Rome, Italy)', category: 'The Occult' },
  'nobility-saxegotha': { lng: 10.7042, lat: 50.9489, locationName: 'Friedenstein Palace (Gotha, Germany)', category: 'The Occult' },
  'nobility-cavendish': { lng: -1.6217, lat: 53.2275, locationName: 'Chatsworth House (Derbyshire, England)', category: 'The Occult' },
  'nobility-windsor': { lng: -0.6044, lat: 51.4839, locationName: 'Windsor Castle (Berkshire, England)', category: 'The Occult' },
  'nobility-romanov': { lng: 30.3158, lat: 59.9398, locationName: 'Winter Palace (St. Petersburg, Russia)', category: 'The Occult' },
  'nobility-habsburg': { lng: 16.3634, lat: 48.2065, locationName: 'Hofburg Palace (Vienna, Austria)', category: 'The Occult' },
  'nobility-plantagenet': { lng: 0.2017, lat: 47.2003, locationName: 'Fontevraud Abbey (Anjou, France)', category: 'The Occult' },
  'taoism-founded': { lng: 115.378, lat: 33.876, locationName: 'Luyi County, Henan, China', category: 'Ancient People Groups' },
  'buddhism-founded': { lng: 84.9912, lat: 24.6951, locationName: 'Bodh Gaya, Bihar, India', category: 'Ancient People Groups' },
  'coral-castle-construction': { lng: -80.444305, lat: 25.500556, locationName: 'Coral Castle (Homestead, Florida)', category: 'Megaliths / Structures' },
  'operation-fishbowl': { lng: -169.5292, lat: 16.7375, locationName: 'Johnston Atoll, Pacific Ocean', category: 'Secret Government Programs' },
  'gateway-process': { lng: -78.5085, lat: 38.0293, locationName: 'The Monroe Institute (Faber, Virginia)', category: 'Secret Government Programs' },
  'kandahar-giant-event': { lng: 65.7372, lat: 31.6289, locationName: 'Kandahar Cave (Kandahar, Afghanistan)', category: 'Secret Government Programs' },
  'ahnenerbe-founded': { lng: 13.4050, lat: 52.5200, locationName: 'Ahnenerbe Headquarters (Berlin, Germany)', category: 'Secret Government Programs' },
  'die-glocke-development': { lng: 16.5011, lat: 50.6278, locationName: 'Wenceslaus Mine (Ludwikowice Kłodzkie, Poland)', category: 'Secret Government Programs' },
  'deep-freeze-expedition': { lng: 0.0, lat: -90.0, locationName: 'Amundsen-Scott South Pole Station (Antarctica)', category: 'Secret Government Programs' },
  'project-pegasus-event': { lng: -122.3321, lat: 47.6062, locationName: 'Seattle Portal Station (Seattle, Washington)', category: 'Secret Government Programs' },
  'pythagoras-lifespan': { lng: 17.1292, lat: 39.0814, locationName: 'Pythagoras School (Crotone, Italy)', category: 'The Occult' },
  'socrates-lifespan': { lng: 23.7275, lat: 37.9838, locationName: 'Athens, Greece', category: 'The Occult' },
  'plato-lifespan': { lng: 23.7144, lat: 37.9942, locationName: 'Plato\'s Academy (Athens, Greece)', category: 'The Occult' },
  'aristotle-lifespan': { lng: 23.7441, lat: 37.9731, locationName: 'Aristotle\'s Lyceum (Athens, Greece)', category: 'The Occult' },
  'francis-bacon-lifespan': { lng: -0.3582, lat: 51.7533, locationName: 'Tomb of Sir Francis Bacon (St Albans, UK)', category: 'The Occult' },
  'manly-p-hall-lifespan': { lng: -118.2831, lat: 34.1164, locationName: 'Philosophical Research Society (Los Angeles, CA)', category: 'The Occult' },
  'hinduism-origins': { lng: 68.1256, lat: 27.3292, locationName: 'Indus Valley (Origins of Hinduism)', category: 'The Occult' },
  'zoroastrianism-origins': { lng: 54.3733, lat: 31.8814, locationName: 'Yazd Fire Temple (Yazd, Iran)', category: 'The Occult' },
  'gnosticism-origins': { lng: 32.2356, lat: 26.0528, locationName: 'Nag Hammadi Caves (Egypt)', category: 'The Occult' },
  'rosicrucianism-origins': { lng: 8.7153, lat: 49.4106, locationName: 'Heidelberg Castle (Heidelberg, Germany)', category: 'The Occult' },
  'catholicism-history': { lng: 12.4534, lat: 41.9029, locationName: 'Vatican City (Rome, Italy)', category: 'The Occult' },
  'mormonism-origins': { lng: -77.2244, lat: 43.0167, locationName: 'Hill Cumorah (Manchester, NY)', category: 'The Occult' },
  'jpl-founded-event': { lng: -118.1702, lat: 34.1996, locationName: 'Jet Propulsion Laboratory (Pasadena, CA)', category: 'NASA / Space' },
  'nasa-founded-event': { lng: -77.0161, lat: 38.8831, locationName: 'NASA Headquarters (Washington, D.C.)', category: 'NASA / Space' },
  'apollo-11-landing-event': { lng: -80.6077, lat: 28.5721, locationName: 'Kennedy Space Center (Cape Canaveral, FL)', category: 'NASA / Space' },
  'project-mercury-start': { lng: -80.6077, lat: 28.5721, locationName: 'Cape Canaveral Space Force Station (FL)', category: 'NASA / Space' },
  'project-gemini-start': { lng: -80.6077, lat: 28.5721, locationName: 'Cape Canaveral Space Force Station (FL)', category: 'NASA / Space' },
  'project-apollo-start': { lng: -80.6077, lat: 28.5721, locationName: 'Kennedy Space Center (Cape Canaveral, FL)', category: 'NASA / Space' },
  'artemis-program-event': { lng: -80.6041, lat: 28.6272, locationName: 'Launch Complex 39B (Cape Canaveral, FL)', category: 'NASA / Space' },
  'paracas-geoglyphs-event': { lng: -75.1844, lat: -14.5828, locationName: 'Llipata Hillside Geoglyphs (Ica, Peru)', category: 'Archaeological Finds' },
  'palpa-geoglyphs-event': { lng: -75.1472, lat: -14.5298, locationName: 'Palpa Valley Geoglyphs (Palpa, Peru)', category: 'Archaeological Finds' },
  'chi-rho-vision-event': { lng: 12.4729, lat: 41.9358, locationName: 'Milvian Bridge (Rome, Italy)', category: 'Religion' },
  'project-sun-streak-event': { lng: -76.7325, lat: 39.1118, locationName: 'Fort Meade (Maryland, USA)', category: 'Secret Government Programs' },
  'plutarch-writing-event': { lng: 22.5011, lat: 38.4824, locationName: 'Sanctuary of Apollo (Delphi, Greece)', category: 'Myths / Legends' },
  'vimanas-mahabharata-event': { lng: 76.8197, lat: 29.9695, locationName: 'Kurukshetra War Site (Haryana, India)', category: 'Myths / Legends' },
  'canyon-de-chelly-dwellings-event': { lng: -109.5383, lat: 36.1553, locationName: 'Canyon de Chelly National Monument (Arizona, USA)', category: 'Archaeological Finds' },
  'ugle-foundation-event': { lng: -0.1213, lat: 51.5152, locationName: 'Freemasons Hall (London, UK)', category: 'Masonic Lodges' },
  'detroit-masonic-temple-event': { lng: -83.0598, lat: 42.3418, locationName: 'Detroit Masonic Temple (Detroit, USA)', category: 'Masonic Lodges' },
  'cern-lhc-startup-event': { lng: 6.0557, lat: 46.2330, locationName: 'CERN Large Hadron Collider (Geneva, Switzerland)', category: 'Hadron Colliders' },
  'ssc-abandonment-event': { lng: -96.8486, lat: 32.3951, locationName: 'Superconducting Super Collider Tunnels (Waxahachie, USA)', category: 'Hadron Colliders' },
  'saint-francis-stigmata-event': { lng: 12.6056, lat: 43.0744, locationName: 'Basilica of St. Francis (Assisi, Italy)', category: 'Religion' },
  'saint-john-vianney-exhumation-event': { lng: 4.8219, lat: 45.9926, locationName: 'Basilica of Ars (Ars-sur-Formans, France)', category: 'Religion' },
  'saint-silvan-martyrdom-event': { lng: 18.1105, lat: 42.6409, locationName: 'Church of St. Blaise (Dubrovnik, Croatia)', category: 'Religion' },
  'saint-charbel-light-event': { lng: 35.7031, lat: 34.0847, locationName: 'Monastery of St. Maron (Annaya, Lebanon)', category: 'Religion' },
  'saint-teresa-ecstasy-event': { lng: -5.5137, lat: 40.8252, locationName: 'Convento de la Anunciacion (Alba de Tormes, Spain)', category: 'Religion' },
  'saint-joan-of-arc-victory-event': { lng: 1.0993, lat: 49.4431, locationName: 'Rouen (Joan of Arc Martyrdom, France)', category: 'Religion' },
  'saint-anthony-tomb-event': { lng: 11.8800, lat: 45.4014, locationName: 'Basilica of St. Anthony (Padua, Italy)', category: 'Religion' },
  'saint-bernadette-exhumation-event': { lng: 3.1633, lat: 46.9934, locationName: 'Espace Bernadette Soubirous (Nevers, France)', category: 'Religion' },
  'saint-padre-pio-stigmata-event': { lng: 15.7032, lat: 41.7073, locationName: 'Sanctuary of St. Pio (San Giovanni Rotondo, Italy)', category: 'Religion' },
  'saint-catherine-medal-event': { lng: 2.3242, lat: 48.8508, locationName: 'Miraculous Medal Chapel (Paris, France)', category: 'Religion' },
  'saint-rita-death-event': { lng: 13.0135, lat: 42.7161, locationName: 'Basilica of Santa Rita (Cascia, Italy)', category: 'Religion' },
  'wernher-von-braun-event': { lng: -86.6534, lat: 34.7119, locationName: 'U.S. Space & Rocket Center (Huntsville, AL)', category: 'NASA / Space' },
  'elon-musk-event': { lng: -118.3278, lat: 33.9207, locationName: 'SpaceX HQ (Hawthorne, CA)', category: 'NASA / Space' },
  'jeff-bezos-event': { lng: -122.2370, lat: 47.3802, locationName: 'Blue Origin HQ (Kent, WA)', category: 'NASA / Space' },
  'robert-bigelow-event': { lng: -115.1102, lat: 36.2415, locationName: 'Bigelow Aerospace HQ (Las Vegas, NV)', category: 'NASA / Space' },
  'apollo-7-event': { lng: -80.5612, lat: 28.5218, locationName: 'Launch Complex 34 (Cape Canaveral, FL)', category: 'NASA / Space' },
  'apollo-8-event': { lng: -80.6041, lat: 28.6083, locationName: 'Launch Complex 39A (Cape Canaveral, FL)', category: 'NASA / Space' },
  'apollo-9-event': { lng: -80.6041, lat: 28.6083, locationName: 'Launch Complex 39A (Cape Canaveral, FL)', category: 'NASA / Space' },
  'apollo-10-event': { lng: -80.6041, lat: 28.6083, locationName: 'Launch Complex 39A (Cape Canaveral, FL)', category: 'NASA / Space' },
  'apollo-12-event': { lng: -80.6041, lat: 28.6083, locationName: 'Launch Complex 39A (Cape Canaveral, FL)', category: 'NASA / Space' },
  'apollo-13-event': { lng: -80.6041, lat: 28.6083, locationName: 'Launch Complex 39A (Cape Canaveral, FL)', category: 'NASA / Space' },
  'apollo-14-event': { lng: -80.6041, lat: 28.6083, locationName: 'Launch Complex 39A (Cape Canaveral, FL)', category: 'NASA / Space' },
  'apollo-15-event': { lng: -80.6041, lat: 28.6083, locationName: 'Launch Complex 39A (Cape Canaveral, FL)', category: 'NASA / Space' },
  'apollo-16-event': { lng: -80.6041, lat: 28.6083, locationName: 'Launch Complex 39A (Cape Canaveral, FL)', category: 'NASA / Space' },
  'apollo-17-event': { lng: -80.6041, lat: 28.6083, locationName: 'Launch Complex 39A (Cape Canaveral, FL)', category: 'NASA / Space' },
  'spacex-falcon-heavy-event': { lng: -80.6041, lat: 28.6083, locationName: 'Launch Complex 39A (Cape Canaveral, FL)', category: 'NASA / Space' },
  'spacex-crew-dragon-event': { lng: -80.6041, lat: 28.6083, locationName: 'Launch Complex 39A (Cape Canaveral, FL)', category: 'NASA / Space' },
  'spacex-starship-event': { lng: -97.1558, lat: 25.9972, locationName: 'SpaceX Starbase (Boca Chica, TX)', category: 'NASA / Space' },
  'blue-origin-new-glenn-event': { lng: -80.5393, lat: 28.4716, locationName: 'Launch Complex 36 (Cape Canaveral, FL)', category: 'NASA / Space' },
  'amalantrah-working-event': { lng: -73.9712, lat: 40.7831, locationName: 'Central Park West (New York City, NY)', category: 'The Occult' },
  'scientology-founded-event': { lng: -118.2437, lat: 34.0522, locationName: 'Los Angeles, CA', category: 'The Occult' },
  'l-ron-hubbard-lifespan': { lng: -118.1565, lat: 34.1350, locationName: 'Pasadena Agape Lodge (Pasadena, CA)', category: 'The Occult' },
  'kenneth-grant-lifespan': { lng: -0.1278, lat: 51.5074, locationName: 'London, England', category: 'The Occult' },
  'hp-lovecraft-lifespan': { lng: -71.4128, lat: 41.8240, locationName: 'Providence, RI', category: 'The Occult' },
  'peter-levenda-lifespan': { lng: -73.9712, lat: 40.7831, locationName: 'New York City, NY', category: 'The Occult' },
  'robin-hood-legends-era': { lng: -1.0772, lat: 53.2045, locationName: 'Sherwood Forest (Nottinghamshire, England)', category: 'Myths / Legends' },
  'arthurian-legend-era': { lng: -4.7600, lat: 50.6672, locationName: 'Tintagel Castle (Cornwall, England)', category: 'Myths / Legends' },
  'tomb-king-arthur-discovered': { lng: -2.7161, lat: 51.1462, locationName: 'Glastonbury Abbey (Somerset, England)', category: 'Myths / Legends' }
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
