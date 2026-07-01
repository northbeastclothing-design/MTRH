// Archaeological and Biblical discoveries data
export interface ArchaeologicalFind {
  id: string;
  name: string;
  category: 'Archaeological Finds' | 'Biblical Discoveries' | 'Cryptid Sightings' | 'Giants & Nephilim' | 'Ancient People Groups' | 'Rock Art & Cave Paintings' | 'Megaliths / Structures' | 'Burial Mounds';
  type: 'Point';
  coordinates: {
    lng: number;
    lat: number;
  };
  date: number;
  displayDate: string;
  description: string;
  source: string;
  images: string[];
  socialLink?: string;
  subLabel?: string;
}

export const ARCHAEOLOGICAL_FINDS_DATA: ArchaeologicalFind[] = [
  // ==================== ARCHAEOLOGICAL FINDS ====================
  {
    id: "archaeology-rosetta-stone",
    name: "The Rosetta Stone",
    category: "Archaeological Finds",
    type: "Point",
    coordinates: { lng: 30.3978, lat: 31.4016 }, // Rashīd (Rosetta), Egypt
    date: -196,
    displayDate: "196 BC (Found 1799 AD)",
    description: "The Rosetta Stone is a granodiorite stele inscribed with three versions of a decree issued in Memphis in 196 BC on behalf of King Ptolemy V. Because it presents the same text in Ancient Egyptian hieroglyphs, Demotic script, and Ancient Greek, it provided the vital key to modern translation and decipherment of Egyptian hieroglyphs.",
    source: "British Museum / Historical Records",
    images: ["https://upload.wikimedia.org/wikipedia/commons/2/23/Rosetta_Stone.JPG"]
  },
  {
    id: "archaeology-antikythera-mechanism",
    name: "Antikythera Mechanism",
    category: "Archaeological Finds",
    type: "Point",
    coordinates: { lng: 23.3139, lat: 35.8647 }, // Antikythera, Greece
    date: -100,
    displayDate: "c. 100 BC (Found 1901 AD)",
    description: "An ancient Greek hand-powered analog computer and orrery used to predict astronomical positions and eclipses for calendar and astrological purposes. Discovered in a shipwreck, its complex gear mechanics predated similar European clockwork technology by over 1,500 years.",
    source: "National Archaeological Museum, Athens",
    images: ["https://upload.wikimedia.org/wikipedia/commons/c/c8/Antikythera_Fragment_A_%28Front%29.webp"]
  },
  {
    id: "archaeology-tutankhamun-tomb",
    name: "Tomb of Tutankhamun (KV62)",
    category: "Archaeological Finds",
    type: "Point",
    coordinates: { lng: 32.6014, lat: 25.7408 }, // Valley of the Kings, Egypt
    date: -1323,
    displayDate: "1323 BC (Found 1922 AD)",
    description: "The virtually intact royal tomb of the 18th-dynasty Pharaoh Tutankhamun, discovered by British archaeologist Howard Carter. It contained over 5,000 pristine artifacts, including the iconic solid gold death mask, nested sarcophagi, gilded chariots, and royal treasures.",
    source: "Grand Egyptian Museum / Historical Records",
    images: ["https://upload.wikimedia.org/wikipedia/commons/2/27/CairoEgMuseumTaaMaskMostlyPhotographed.jpg"]
  },
  {
    id: "archaeology-mohenjo-daro",
    name: "Mohenjo-daro Ruins",
    category: "Megaliths / Structures",
    type: "Point",
    coordinates: { lng: 68.1299, lat: 27.3292 }, // Sindh, Pakistan
    date: -2500,
    displayDate: "c. 2500 BC (Excavated 1920s AD)",
    description: "One of the largest settlements of the ancient Indus Valley Civilization, featuring sophisticated civil engineering and urban planning. The city possessed an organized grid layout, brick buildings, covered wastewater drains, public baths, and a large central granary, with no evidence of palaces or royal monuments.",
    source: "UNESCO World Heritage Site / Archaeological Survey of India",
    images: ["https://upload.wikimedia.org/wikipedia/commons/0/03/Mohenjodaro_-_view_of_the_stupa_mound.JPG"]
  },
  {
    id: "archaeology-olmec-colossal-heads",
    name: "Olmec Colossal Heads",
    category: "Megaliths / Structures",
    type: "Point",
    coordinates: { lng: -94.0375, lat: 18.0069 }, // La Venta, Mexico
    date: -900,
    displayDate: "c. 900 BC (Found 1862 AD)",
    description: "Massive, distinctive stone sculptures carved from large basalt boulders, depicting human heads with realistic facial features and helmet-like headdresses. Weighing up to 40 tons, these monuments represent the rulers of the Mesoamerican Olmec civilization and were transported miles from their volcanic quarry sources.",
    source: "La Venta Museum-Park / Archaeological Records",
    images: ["https://upload.wikimedia.org/wikipedia/commons/3/31/San_Lorenzo_Monument_4_crop.jpg"]
  },
  {
    id: "archaeology-library-ashurbanipal",
    name: "Library of Ashurbanipal (Nineveh)",
    category: "Archaeological Finds",
    type: "Point",
    coordinates: { lng: 43.1558, lat: 36.3653 }, // Nineveh, Mosul, Iraq
    date: -650,
    displayDate: "c. 650 BC (Found 1849 AD)",
    description: "A collection of over 30,000 clay tablets and fragments containing royal inscriptions, letters, administrative documents, and literary texts. It famously contains the Epic of Gilgamesh, the oldest surviving epic masterpiece of human literature, compiled by King Ashurbanipal of Assyria.",
    source: "British Museum excavations / Nineveh archives",
    images: ["https://upload.wikimedia.org/wikipedia/commons/8/8b/Library_of_Ashurbanipal.jpg"]
  },
  {
    id: "archaeology-altamira-cave",
    name: "Cave of Altamira paintings",
    category: "Rock Art & Cave Paintings",
    type: "Point",
    coordinates: { lng: -4.1194, lat: 43.3769 }, // Santillana del Mar, Spain
    date: -18000,
    displayDate: "c. 18,000 - 14,000 BC (Found 1879 AD)",
    description: "A Paleolithic cave containing high-quality multi-colored paintings and charcoal drawings of wild mammals and human hands. The discovery revolutionized theories of prehistoric art, showing that early human cave dwellers possessed highly developed artistic and abstract capabilities.",
    source: "Altamira National Museum and Research Center",
    images: ["https://upload.wikimedia.org/wikipedia/commons/8/8b/9_Bisonte_Magdaleniense_pol%C3%ADcromo.jpg"]
  },
  {
    id: "archaeology-varna-necropolis",
    name: "Varna Eneolithic Necropolis",
    category: "Archaeological Finds",
    type: "Point",
    coordinates: { lng: 27.8767, lat: 43.2144 }, // Varna, Bulgaria
    date: -4560,
    displayDate: "c. 4560 BC (Found 1972 AD)",
    description: "An ancient burial site containing the Varna Gold Treasure, which is widely recognized as the oldest gold jewelry and gold artifacts ever processed by humanity. The site demonstrates the early development of social hierarchies, metalworking, and complex religious beliefs in European prehistory.",
    source: "Varna Archaeological Museum",
    images: ["https://upload.wikimedia.org/wikipedia/commons/9/9b/Or_de_Varna_-_N%C3%A9cropole.jpg"]
  },
  {
    id: "archaeology-terracotta-army",
    name: "Terracotta Army of Emperor Qin Shi Huang",
    category: "Archaeological Finds",
    type: "Point",
    coordinates: { lng: 109.2783, lat: 34.3813 }, // Xi'an, China
    date: -210,
    displayDate: "c. 210 BC (Found 1974 AD)",
    description: "An extraordinary collection of terracotta sculptures depicting the armies of Qin Shi Huang, the first Emperor of China. The figures, including warriors, chariots, and horses, were buried with the emperor in 210–209 BC with the purpose of protecting him in his afterlife.",
    source: "Emperor Qinshihuang's Mausoleum Site Museum",
    images: ["https://upload.wikimedia.org/wikipedia/commons/8/88/51714-Terracota-Army.jpg"]
  },
  {
    id: "archaeology-machu-picchu",
    name: "Lost Citadel of Machu Picchu",
    category: "Megaliths / Structures",
    type: "Point",
    coordinates: { lng: -72.5450, lat: -13.1631 }, // Machu Picchu, Peru
    date: 1450,
    displayDate: "c. 1450 AD (Scientific Discovery 1911 AD)",
    description: "A 15th-century Inca citadel located in the Eastern Cordillera of southern Peru on a 2,430-meter mountain ridge. Built around 1450 at the height of the Inca Empire under Emperor Pachacuti, it was abandoned a century later during the Spanish Conquest and lay hidden from the outside world until scientific reveal in 1911.",
    source: "UNESCO World Heritage Centre",
    images: ["https://upload.wikimedia.org/wikipedia/commons/e/eb/Machu_Picchu%2C_Peru.jpg"]
  },
  {
    id: "archaeology-pompeii",
    name: "Ruins of Pompeii",
    category: "Archaeological Finds",
    type: "Point",
    coordinates: { lng: 14.4850, lat: 40.7508 }, // Pompeii, Italy
    date: 79,
    displayDate: "79 AD (Excavated 1748 AD)",
    description: "An ancient Roman city near modern Naples that was completely buried under 4 to 6 meters of volcanic ash and pumice during the catastrophic eruption of Mount Vesuvius in AD 79. The airtight seal preserved buildings, frescoes, mosaics, and plaster casts of victims in astonishing detail.",
    source: "Pompeii Archaeological Park",
    images: ["https://upload.wikimedia.org/wikipedia/commons/c/c0/Mount_Vesuvius_from_Pompeii.jpg"]
  },
  {
    id: "archaeology-sutton-hoo",
    name: "Sutton Hoo Ship Burial",
    category: "Archaeological Finds",
    type: "Point",
    coordinates: { lng: 1.3435, lat: 52.0898 }, // Suffolk, England
    date: 625,
    displayDate: "c. 625 AD (Found 1939 AD)",
    description: "The site of two 6th- and early 7th-century cemeteries. One contained an undisturbed ship burial including a wealth of Anglo-Saxon artifacts of outstanding historical and artistic significance, including the iconic ceremonial iron helmet, gold buckles, and Byzantine silver.",
    source: "National Trust / British Museum",
    images: ["https://upload.wikimedia.org/wikipedia/commons/2/26/Sutton_Hoo_helmet_reconstructed.jpg"]
  },
  {
    id: "archaeology-lascaux",
    name: "Lascaux Cave Paintings",
    category: "Rock Art & Cave Paintings",
    type: "Point",
    coordinates: { lng: 1.1681, lat: 45.0538 }, // Montignac, France
    date: -15000,
    displayDate: "c. 15,000 BC (Found 1940 AD)",
    description: "A complex of caves in southwestern France famous for its Paleolithic cave paintings. The drawings, primarily of large animals matching local fossils, represent some of the most detailed and well-preserved examples of prehistoric human art ever discovered.",
    source: "International Cave Art Archives",
    images: ["https://upload.wikimedia.org/wikipedia/commons/1/1e/Lascaux_painting.jpg"]
  },
  {
    id: "archaeology-knossos",
    name: "Minoan Palace of Knossos",
    category: "Megaliths / Structures",
    type: "Point",
    coordinates: { lng: 25.1631, lat: 35.2978 }, // Crete, Greece
    date: -1900,
    displayDate: "c. 1900 BC (Excavated 1900 AD)",
    description: "The monumental ruins of Knossos Palace represent the political and cultural heart of the Bronze Age Minoan civilization. Sir Arthur Evans' excavations uncovered columns, frescoes, and a sprawling layout that historical traditions connect to the mythic Labyrinth of King Minos and the Minotaur.",
    source: "Hellenic Ministry of Culture",
    images: ["https://upload.wikimedia.org/wikipedia/commons/5/5b/Palace_of_Knossos.jpg"]
  },
  
  // ==================== BIBLICAL DISCOVERIES ====================
  {
    id: "archaeology-shroud-of-turin",
    name: "The Shroud of Turin",
    category: "Biblical Discoveries",
    type: "Point",
    coordinates: { lng: 7.6857, lat: 45.0728 }, // Turin Cathedral, Italy
    date: 1354,
    displayDate: "c. 1354 AD (Earliest historical record)",
    description: "A length of linen cloth housed in Turin, Italy, bearing the faint double image of a man showing signs of severe physical trauma matching the biblical description of Roman crucifixion. While radiocarbon dating has sparked intense debate, alternative studies argue the linen contains unique pollen and coin prints from 1st-century Judaea.",
    source: "Archdiocese of Turin / Shroud Research Groups",
    images: ["https://upload.wikimedia.org/wikipedia/commons/2/23/Turin_shroud_positive_and_negative_displaying_original_color_information_708_x_465_pixels_94_KB.jpg"]
  },
  {
    id: "archaeology-noahs-ark-ararat",
    name: "Noah's Ark Search (Durupinar Site)",
    category: "Biblical Discoveries",
    type: "Point",
    coordinates: { lng: 44.2750, lat: 39.4406 }, // Mount Ararat, Turkey
    date: 1959,
    displayDate: "1959 AD (First Aerial Sighting)",
    description: "A 150-meter-long boat-shaped formation located in the Tendürek mountains near Mount Ararat, discovered by a Turkish military pilot. While mainstream geologists view it as a natural syncline, expeditions claim ground-penetrating radar scans reveal regular iron bracket anomalies and fossilized timber rib patterns matching the Ark's dimensions.",
    source: "Turkish Ministry of Culture & Tourism / Noah's Ark Search",
    images: ["https://upload.wikimedia.org/wikipedia/commons/1/1a/The_Structure_Claimed_to_be_the_Noah%27s_Ark_near_the_Mount_Ararat_in_Turkey.jpg"]
  },
  {
    id: "archaeology-ark-of-covenant-axum",
    name: "Ark of the Covenant Sanctuary (Axum)",
    category: "Biblical Discoveries",
    type: "Point",
    coordinates: { lng: 38.7186, lat: 14.1299 }, // Axum, Ethiopia
    date: 1000,
    displayDate: "c. 1000 BC (Tradition Timeline)",
    description: "The Chapel of the Tablet at the Church of Our Lady Mary of Zion in Axum, Ethiopia. Local tradition holds that the Ark of the Covenant was brought to Ethiopia by Menelik I, the son of King Solomon and the Queen of Sheba, and has been guarded continuously by a succession of celibate monks who never leave the sanctuary.",
    source: "Ethiopian Orthodox Tewahedo Church Archive",
    images: ["https://upload.wikimedia.org/wikipedia/commons/b/bc/ET_Axum_asv2018-01_img31_StMary_of_Zion_Church.jpg"]
  },
  {
    id: "archaeology-sodom-gomorrah",
    name: "Sodom & Gomorrah Site (Tall el-Hammam)",
    category: "Biblical Discoveries",
    type: "Point",
    coordinates: { lng: 35.6738, lat: 31.8402 }, // Jordan Valley, Jordan
    date: -1650,
    displayDate: "c. 1650 BC (Excavations 2005-Present)",
    description: "Excavations at Tall el-Hammam have uncovered a major Middle Bronze Age city destroyed by a sudden, catastrophic high-heat event. Findings of melted pottery, bubbling pottery shards, pulverized brickwork, and a soot-rich charcoal layer suggest a cosmic airburst (similar to the Tunguska event) matching the biblical account of Sodom's fiery end.",
    source: "Tehep Archaeological Project / Scientific Reports",
    images: ["https://upload.wikimedia.org/wikipedia/commons/1/12/Tall_el-Hammam_Excavation-Jordan_Valley.jpg"]
  },
  {
    id: "archaeology-hezekiahs-tunnel-inscription",
    name: "Hezekiah's Tunnel Inscription",
    category: "Biblical Discoveries",
    type: "Point",
    coordinates: { lng: 35.2361, lat: 31.7725 }, // Gihon Spring, Jerusalem
    date: -701,
    displayDate: "c. 701 BC (Found 1880 AD)",
    description: "An ancient Paleo-Hebrew inscription carved into the wall of Hezekiah's Tunnel, celebrating the moment when two teams of stone excavators, digging from opposite ends, successfully met in the center. The tunnel was dug to secure Jerusalem's water supply during the Assyrian siege led by Sennacherib, confirming 2 Kings 20.",
    source: "Istanbul Archaeology Museum",
    images: ["https://upload.wikimedia.org/wikipedia/commons/a/af/Siloam_Inscription_2.jpg"]
  },
  {
    id: "archaeology-garden-tomb",
    name: "The Garden Tomb",
    category: "Biblical Discoveries",
    type: "Point",
    coordinates: { lng: 35.2299, lat: 31.7824 }, // Jerusalem, Israel
    date: -600,
    displayDate: "c. 600 BC (Discovered 1867 AD)",
    description: "A rock-cut tomb located outside the city walls of Jerusalem. Unearthed in 1867, it was proposed by British General Charles Gordon as the actual site of Golgotha and the tomb of Joseph of Arimathea. It features a channel in the ground for a rolling stone, matching the Gospel descriptions of Jesus' resurrection site.",
    source: "The Garden Tomb Association, London",
    images: ["https://upload.wikimedia.org/wikipedia/commons/7/7c/Jerusalem_Garden_Tomb_%2843300924231%29.jpg"]
  },
  {
    id: "archaeology-dead-sea-scrolls",
    name: "The Dead Sea Scrolls",
    category: "Biblical Discoveries",
    type: "Point",
    coordinates: { lng: 35.4597, lat: 31.7411 }, // Qumran Caves, West Bank
    date: -150,
    displayDate: "c. 150 BC - 70 AD (Found 1946 AD)",
    description: "Ancient Jewish religious manuscripts found in the Qumran Caves near the Dead Sea. They include the oldest surviving manuscripts of entire books of the Hebrew Bible (excluding Esther), biblical commentaries, and sectarian texts, providing unprecedented insight into Second Temple Judaism.",
    source: "Israel Museum, Jerusalem",
    images: ["https://upload.wikimedia.org/wikipedia/commons/a/a6/Dead_Sea_Scrolls.jpg"]
  },
  {
    id: "archaeology-tel-dan-stele",
    name: "Tel Dan 'House of David' Stele",
    category: "Biblical Discoveries",
    type: "Point",
    coordinates: { lng: 35.6525, lat: 33.2483 }, // Tel Dan, Israel
    date: -830,
    displayDate: "c. 830 BC (Found 1993 AD)",
    description: "A fragmented basalt stele discovered in northern Israel. Written in Old Aramaic, it records victories over Israel by a king of Aram-Damascus. Crucially, the inscription contains the words 'Beit David' (House of David), representing the first extra-biblical historical validation of King David's dynasty.",
    source: "Israel Museum, Jerusalem",
    images: ["https://upload.wikimedia.org/wikipedia/commons/4/40/JRSLM_300116_Tel_Dan_Stele_01.jpg"]
  },
  {
    id: "archaeology-cyrus-cylinder",
    name: "The Cyrus Cylinder",
    category: "Biblical Discoveries",
    type: "Point",
    coordinates: { lng: 44.4208, lat: 32.5430 }, // Babylon, Iraq
    date: -539,
    displayDate: "539 BC (Found 1879 AD)",
    description: "An ancient clay cylinder inscribed in Akkadian cuneiform by Cyrus the Great of Persia. It describes his conquest of Babylon and his policy of repatriating displaced peoples and restoring their temples, which directly corroborates the Biblical decree in the Book of Ezra allowing the Jews to return and rebuild Jerusalem.",
    source: "British Museum",
    images: ["https://upload.wikimedia.org/wikipedia/commons/e/e5/Cyrus_Cylinder_front.jpg"]
  },
  {
    id: "archaeology-ketef-hinnom",
    name: "Ketef Hinnom Silver Scrolls",
    category: "Biblical Discoveries",
    type: "Point",
    coordinates: { lng: 35.2267, lat: 31.7686 }, // Jerusalem, Israel
    date: -600,
    displayDate: "c. 600 BC (Found 1979 AD)",
    description: "Two tiny rolled silver scrolls discovered in a tomb chamber at Ketef Hinnom. Once unrolled and deciphered using advanced imaging, they were found to contain the Priestly Blessing from Numbers 6:24-26. They are the oldest surviving fragments of a biblical text ever discovered, predating the Dead Sea Scrolls by 300+ years.",
    source: "Israel Museum, Jerusalem",
    images: ["https://upload.wikimedia.org/wikipedia/commons/7/70/KetefHinom.jpg"]
  },
  {
    id: "archaeology-pilate-stone",
    name: "The Pilate Stone",
    category: "Biblical Discoveries",
    type: "Point",
    coordinates: { lng: 34.8925, lat: 32.5081 }, // Caesarea Maritima, Israel
    date: 30,
    displayDate: "c. 30 AD (Found 1961 AD)",
    description: "A damaged block of carved limestone found at Caesarea Maritima. The latin inscription clearly mentions 'Pontius Pilatus, Prefect of Judaea,' who dedicated a building in honor of Emperor Tiberius. It is the first physical archaeological artifact confirming the existence and title of Pontius Pilate.",
    source: "Israel Museum, Jerusalem",
    images: ["https://upload.wikimedia.org/wikipedia/commons/e/e1/Pilate_Inscription.JPG"]
  },
  {
    id: "archaeology-pool-of-siloam",
    name: "The Pool of Siloam",
    category: "Biblical Discoveries",
    type: "Point",
    coordinates: { lng: 35.2348, lat: 31.7702 }, // City of David, Jerusalem
    date: -700,
    displayDate: "c. 700 BC (Excavated 2004 AD)",
    description: "A rock-cut pool on the southern slope of the City of David, fed by the Gihon Spring. Initially built by King Hezekiah in the 8th century BC to secure the city's water supply, it was later expanded in the Second Temple era. It is famously referenced in the Gospel of John as the location where Jesus healed a blind man.",
    source: "City of David Archaeological Site",
    images: ["https://upload.wikimedia.org/wikipedia/commons/8/80/City_of_David_-_Pool_of_Siloam_IMG_5931.JPG"]
  },
  {
    id: "archaeology-mesha-stele",
    name: "The Mesha Stele (Moabite Stone)",
    category: "Biblical Discoveries",
    type: "Point",
    coordinates: { lng: 35.7836, lat: 31.5003 }, // Dhiban, Jordan
    date: -840,
    displayDate: "c. 840 BC (Found 1868 AD)",
    description: "A basalt monument erected by King Mesha of Moab. The Moabite inscription describes how Moab was oppressed by Omri, King of Israel, and how Mesha threw off Israelite rule. It contains direct references to Israel, the House of David, and Yahweh, corroborating and supplementing accounts in 2 Kings 3.",
    source: "Louvre Museum, Paris",
    images: ["https://upload.wikimedia.org/wikipedia/commons/7/7b/P1120870_Louvre_st%C3%A8le_de_M%C3%A9sha_AO5066_rwk.JPG"]
  },
  {
    id: "archaeology-house-of-peter",
    name: "House of Peter at Capernaum",
    category: "Biblical Discoveries",
    type: "Point",
    coordinates: { lng: 35.5752, lat: 32.8812 }, // Capernaum, Israel
    date: 50,
    displayDate: "1st Century AD (Excavated 1968 AD)",
    description: "A first-century residential house in Capernaum, over which an early Christian octagonal church was later built in the 5th century. Early graffiti scratched into the plaster of the house walls mentions Jesus, Peter, and Christian symbols, supporting the historic tradition that this was the home of Simon Peter.",
    source: "Capernaum Archaeological Excavations",
    images: ["https://upload.wikimedia.org/wikipedia/commons/8/86/Capernaum%2C_Israel_10.jpg"]
  },
  {
    id: "archaeology-winged-serpents-buto",
    name: "Winged Serpent Boneyard of Buto",
    category: "Cryptid Sightings",
    type: "Point",
    coordinates: { lng: 32.0900, lat: 30.6100 }, // Wadi Tumilat / Sinai border pass, Egypt
    date: -450,
    displayDate: "c. 450 BC (Reported by Herodotus)",
    description: "A narrow mountain pass situated opposite the ancient city of Buto, described by the Greek historian Herodotus. He reported seeing massive heaps of bones and spines belonging to winged serpents that flew from Arabia toward Egypt every spring, only to be intercepted and destroyed by ibises. The creatures were described as bat-winged, serpentine, and resembling water snakes.",
    source: "Herodotus, Histories (Book II.75) / @classical_presbyterian",
    images: ["https://www.instagram.com/p/DZLsVsaOGIf/media/?size=l"],
    socialLink: "https://www.instagram.com/p/DZLsVsaOGIf/"
  },
  {
    id: "archaeology-alexander-dragon-abisarus",
    name: "King Abisarus' Serpent Cavern",
    category: "Cryptid Sightings",
    type: "Point",
    coordinates: { lng: 73.7300, lat: 32.9300 }, // Jhelum River region, Punjab, Pakistan
    date: -330,
    displayDate: "330 BC (Reported by Alexander the Great)",
    description: "During Alexander the Great's invasion of India, his army encountered a massive, sacred serpent living in a cavern in the territory of King Abisarus. Recorded by Claudius Aelianus (On Animals) and Alexander's lieutenant Onesicritus, the creature was revered as a god by local inhabitants. When the passing army disturbed the cavern, the serpent reportedly emerged, hissing and snorting violently, with eyes described as the size of Macedonian shields.",
    source: "Aelian, On the Nature of Animals (Book XV) / @classical_presbyterian",
    images: ["https://www.instagram.com/p/DY_IpTVOaiJ/media/?size=l"],
    socialLink: "https://www.instagram.com/p/DY_IpTVOaiJ/"
  },
  {
    id: "archaeology-ethiopian-dragons",
    name: "Ethiopian Giant Dragons",
    category: "Cryptid Sightings",
    type: "Point",
    coordinates: { lng: 39.5000, lat: 9.0000 }, // Highlands of Ethiopia
    date: -250,
    displayDate: "c. 250 BC (Reported)",
    description: "According to Roman author Claudius Aelianus (On Animals), ancient Greek rulers imported massive live dragons from Ethiopia. Aelian described Ethiopia as a land renowned for giant serpents, noting they were the largest in the known world and were occasionally captured for exhibition in the courts of Hellenistic Egypt.",
    source: "Aelian, On the Nature of Animals (Book II.21) / @classical_presbyterian",
    images: ["https://www.instagram.com/p/DZGlPQtlfjY/media/?size=l"],
    socialLink: "https://www.instagram.com/p/DZGlPQtlfjY/"
  },
  {
    id: "archaeology-dos-palmas-winged-serpent",
    name: "Dos Palmas Winged Serpent Encounter",
    category: "Cryptid Sightings",
    type: "Point",
    coordinates: { lng: -115.8271, lat: 33.5089 }, // Riverside County, California, USA
    date: 1882,
    displayDate: "1882 AD (Encounter)",
    description: "An 1882 report published in the Los Angeles Times described a bizarre encounter in the Colorado Desert where a Southern Pacific train was intercepted by a 30-foot-long winged, serpent-like creature near Dos Palmas. Witnesses reported that the train collided with the beast, triggering a violent attack where the creature broke windows and shook the passenger cars before flying away.",
    source: "Los Angeles Times (1882) / @classical_presbyterian",
    images: ["https://www.instagram.com/p/DYBJEK6Cefe/media/?size=l"],
    socialLink: "https://www.instagram.com/p/DYBJEK6Cefe/"
  },
  // ==================== GIANTS & NEPHILIM ====================
  {
    id: "archaeology-noblesville-giant",
    name: "8 ft 7 in Giant Skeleton - Noblesville, Indiana",
    category: "Giants & Nephilim",
    type: "Point",
    coordinates: { lng: -86.0139, lat: 40.0456 },
    date: 1921,
    displayDate: "1921 AD (Found)",
    description: "A group of boys digging along the banks of the White River in Noblesville, Indiana, unearthed the skeleton of an exceptionally tall individual estimated to be eight feet seven inches in height. The skull was reported to be of massive proportions, with local doctors examining the remains.",
    source: "Noblesville Ledger (1921) / Travis Roy @giants_of_ancientamerica",
    images: []
  },
  {
    id: "archaeology-crittenden-giant",
    name: "12 ft Giant in Stone Sarcophagus - Crittenden, Arizona",
    category: "Giants & Nephilim",
    type: "Point",
    coordinates: { lng: -110.7634, lat: 31.5473 },
    date: 1891,
    displayDate: "1891 AD (Found)",
    description: "In 1891, a massive stone coffin or sarcophagus was discovered in Crittenden, Arizona, containing the remains of a giant human skeleton estimated to be twelve feet tall. The discovery included unique artifacts and reported anatomical details like six toes on each foot.",
    source: "Arizona Citizen (1891) / Travis Roy @giants_of_ancientamerica",
    images: []
  },
  {
    id: "archaeology-san-diego-mummy",
    name: "8 ft 4 in Giant Mummy - San Diego, California",
    category: "Giants & Nephilim",
    type: "Point",
    coordinates: { lng: -117.1611, lat: 32.7157 },
    date: 1895,
    displayDate: "1895 AD (Found)",
    description: "In 1895, a petrified giant mummy measuring eight feet four inches tall was discovered in a cave near San Diego, California. The mummy was later purchased by the Smithsonian Institution for exhibition before later being scrutinized under claims of being an elaborate hoax made of gelatin and leather.",
    source: "San Diego Union (1895) / Travis Roy @giants_of_ancientamerica",
    images: ["https://upload.wikimedia.org/wikipedia/commons/4/43/The_San_Diego_Giant.png"]
  },
  {
    id: "archaeology-mount-morris-giant",
    name: "Giant Skeleton in Mound - Mount Morris, New York",
    category: "Giants & Nephilim",
    type: "Point",
    coordinates: { lng: -77.8789, lat: 42.7239 },
    date: 1811,
    displayDate: "1811 AD (Found)",
    description: "Workmen unearthing an Indian mound measuring 100 feet in diameter and 8 to 10 feet high on the site of Mount Morris discovered the skeletal remains of a giant of enormous size. The mound also contained rude medals, a pipe, and other historical artifacts.",
    source: "A History of Livingston County, New York (1824) / Travis Roy @giants_of_ancientamerica",
    images: []
  },
  {
    id: "archaeology-baltimore-giant",
    name: "7 ft Indian Skeleton - Baltimore, Maryland",
    category: "Giants & Nephilim",
    type: "Point",
    coordinates: { lng: -76.6122, lat: 39.2904 },
    date: 1897,
    displayDate: "1897 AD (Found)",
    description: "The Maryland Academy of Sciences received the skeletal remains of a prehistoric Indian estimated to stand over seven feet tall. The bones were unearthed during local excavations in Maryland and displayed at the academy.",
    source: "Baltimore American (1897) / Travis Roy @giants_of_ancientamerica",
    images: []
  },
  {
    id: "archaeology-reinersville-giant",
    name: "8 ft 7 in Giant Skeleton - Reinersville, Ohio",
    category: "Giants & Nephilim",
    type: "Point",
    coordinates: { lng: -81.7051, lat: 39.6973 },
    date: 1898,
    displayDate: "1898 AD (Found)",
    description: "An archaeological discovery near Reinersville in Morgan County, Ohio, revealed a giant skeleton measuring eight feet seven inches in length. The remains were found in an ancient burial mound, representing one of the largest skeletons documented in the state.",
    source: "Ohio Science Annual (1898) / Travis Roy @giants_of_ancientamerica",
    images: []
  },
  {
    id: "archaeology-centerburg-giants",
    name: "7 ft Skeletons - Centerburg, Ohio",
    category: "Giants & Nephilim",
    type: "Point",
    coordinates: { lng: -82.6982, lat: 40.3048 },
    date: 1885,
    displayDate: "1885 AD (Found)",
    description: "Workmen in Centerburg, Licking County, Ohio, uncovered multiple skeletons measuring over seven feet long in a burial mound. Licking County has long been recognized as a major site for Indian mounds and prehistoric artifacts.",
    source: "New York Times (1885) / Travis Roy @giants_of_ancientamerica",
    images: []
  },
  {
    id: "archaeology-port-costa-giant",
    name: "7 ft Giant Skeleton - Port Costa, California",
    category: "Giants & Nephilim",
    type: "Point",
    coordinates: { lng: -122.1841, lat: 38.0469 },
    date: 1911,
    displayDate: "1911 AD (Found)",
    description: "Assistant Curator William Altmann of the Golden Gate Park Memorial Museum discovered a giant skeleton measuring over seven feet tall in Port Costa, California. The find included pottery and artifacts, challenging previous theories about the region's indigenous history.",
    source: "Oakland Tribune (1911) / Travis Roy @giants_of_ancientamerica",
    images: []
  },
  {
    id: "archaeology-petersburg-giant",
    name: "9 ft Giant in Stone Grave - Petersburg, Kentucky",
    category: "Giants & Nephilim",
    type: "Point",
    coordinates: { lng: -84.8472, lat: 39.0664 },
    date: 1886,
    displayDate: "1886 AD (Found)",
    description: "An excavation for a new building in Petersburg, Kentucky, revealed a peculiar prehistoric stone and clay cement grave containing a giant human skeleton measuring fully nine feet in length.",
    source: "Daily Northwestern (1886) / Travis Roy @giants_of_ancientamerica",
    images: []
  },
  {
    id: "archaeology-mora-giant",
    name: "9 ft Giant Skeleton - Mora, Minnesota",
    category: "Giants & Nephilim",
    type: "Point",
    coordinates: { lng: -93.2941, lat: 45.8739 },
    date: 1897,
    displayDate: "1897 AD (Found)",
    description: "While excavating with a steam shovel near Mora, Minnesota, workers unearthed the skeleton of a nine-foot-tall giant. Along with the bones, they discovered a large copper spear with a point measuring 10 inches in length.",
    source: "Syracuse Daily Standard (1897) / Travis Roy @giants_of_ancientamerica",
    images: []
  },
  {
    id: "archaeology-guadalupe-giant",
    name: "12 ft Giant Skeletons - Guadalupe, New Mexico",
    category: "Giants & Nephilim",
    type: "Point",
    coordinates: { lng: -104.9167, lat: 34.9167 },
    date: 1902,
    displayDate: "1902 AD (Found)",
    description: "A report in the New York Times detailed the discovery of a race of giant skeletons in Guadalupe, New Mexico, with some bones belonging to individuals estimated at twelve feet tall. The unearthing prompted archaeological plans for further exploration.",
    source: "New York Times (1902) / Travis Roy @giants_of_ancientamerica",
    images: []
  },
  {
    id: "archaeology-colorado-river-giants",
    name: "8-9 ft Giants in Caves - Colorado River Desert",
    category: "Giants & Nephilim",
    type: "Point",
    coordinates: { lng: -114.5000, lat: 34.0000 },
    date: 1947,
    displayDate: "1947 AD (Found)",
    description: "Reports emerged of the discovery of 32 caves within a 180-square-mile desert area along the Nevada-California-Arizona border, containing the remains of ancient 8-to-9-foot-tall giants dressed in strange skins and costumes.",
    source: "Nevada News (1947) / Travis Roy @giants_of_ancientamerica",
    images: []
  },
  {
    id: "archaeology-georgia-dunes-giants",
    name: "7 ft Giant Skeletons in Sand Dunes - Georgia Coast",
    category: "Giants & Nephilim",
    type: "Point",
    coordinates: { lng: -81.3800, lat: 31.1500 },
    date: 1936,
    displayDate: "1936 AD (Found)",
    description: "Archaeologists uncovered a prehistoric race of giant skeletons, all ranging from six-and-one-half to seven feet in height, buried within sand dunes along the coast of Georgia.",
    source: "Salt Lake Tribune (1936) / Travis Roy @giants_of_ancientamerica",
    images: []
  },
  {
    id: "archaeology-iowa-mound-giant",
    name: "7 ft 6 in Giant Skeleton - Iowa",
    category: "Giants & Nephilim",
    type: "Point",
    coordinates: { lng: -93.6000, lat: 41.6000 },
    date: 1925,
    displayDate: "1925 AD (Found)",
    description: "A skeleton of a giant who stood seven feet six inches tall was unearthed from an ancient mound in Iowa.",
    source: "Oakland Tribune (1925) / Travis Roy @giants_of_ancientamerica",
    images: []
  },
  {
    id: "archaeology-missouri-giant-1926",
    name: "7 ft 2 in Giant Skeleton - Missouri",
    category: "Giants & Nephilim",
    type: "Point",
    coordinates: { lng: -92.2000, lat: 38.5000 },
    date: 1926,
    displayDate: "1926 AD (Found)",
    description: "Reports from Missouri described the discovery of a giant skeleton of an individual measuring slightly over seven feet two inches in height.",
    source: "Oakland Tribune (1926) / Travis Roy @giants_of_ancientamerica",
    images: []
  },
  {
    id: "archaeology-andrews-settlement-giant",
    name: "7-8 ft Giant in Pyramidal Mound - Andrews Settlement, Pennsylvania",
    category: "Giants & Nephilim",
    type: "Point",
    coordinates: { lng: -77.9000, lat: 41.8500 },
    date: 1886,
    displayDate: "1886 AD (Found)",
    description: "While hunting towards an Irish settlement, W.H. Scoville discovered a pyramidal mound walled at the base with stone. Excavation revealed the remains of a giant human skeleton estimated to be between seven and eight feet long, buried alongside the skeleton of a dog.",
    source: "Potter County Historical Reports (1886) / Travis Roy @giants_of_ancientamerica",
    images: []
  },
  {
    id: "archaeology-lake-michigan-mounds-giant",
    name: "7-8 ft Giant Skeletons - Lake Michigan Mounds",
    category: "Giants & Nephilim",
    type: "Point",
    coordinates: { lng: -86.2300, lat: 43.0600 },
    date: 1902,
    displayDate: "1902 AD (Found)",
    description: "A newspaper report documented the discovery of fields of ancient burial mounds along Lake Michigan, which yielded multiple giant skeletons measuring between seven and eight feet in height.",
    source: "Historical Press Records (1902) / Travis Roy @giants_of_ancientamerica",
    images: []
  },
  {
    id: "archaeology-mayan-copan",
    name: "Mayan Ruins of Copán & Tikal",
    category: "Megaliths / Structures",
    type: "Point",
    coordinates: { lng: -89.1411, lat: 14.8383 },
    date: -2000,
    displayDate: "c. 2000 BC - 1697 AD",
    description: "The major ancient cities of the Mayan civilization, including Tikal, Copán, and Chichen Itza, featuring monumental stone step-pyramids, astronomical observatories, and complex hieroglyphic texts. Mayan myths detail a dark underworld labyrinth named Xibalba.",
    source: "UNESCO World Heritage Sites",
    images: ["https://upload.wikimedia.org/wikipedia/commons/0/06/Tikal_Temple1_2006_08_11.JPG"]
  },
  {
    id: "archaeology-aztec-tenochtitlan",
    name: "Tenochtitlan (Aztec Capital)",
    category: "Megaliths / Structures",
    type: "Point",
    coordinates: { lng: -99.1332, lat: 19.4326 },
    date: 1325,
    displayDate: "1325 - 1521 AD",
    description: "The capital of the Aztec Empire, built on an island in Lake Texcoco. Its heart was the Templo Mayor, a massive double-pyramid temple dedicated to Huitzilopochtli and Tlaloc. Aztec legends speak of a prehistoric race of giants called Quinamentin who built the ancient pyramids.",
    source: "INAH Mexico / Historical Archives",
    images: ["https://upload.wikimedia.org/wikipedia/commons/1/19/Templo_Mayor_50.jpg"]
  },
  {
    id: "archaeology-hopi-mesa",
    name: "Hopi Oraibi Mesa",
    category: "Archaeological Finds",
    type: "Point",
    coordinates: { lng: -110.5982, lat: 35.8764 },
    date: 1100,
    displayDate: "c. 1100 AD - Present",
    description: "Old Oraibi on Third Mesa is one of the oldest continuously inhabited communities in North America. Hopi oral traditions speak of subterranean survival guided by the friendly 'Ant People' during a past world-ending cataclysm.",
    source: "National Register of Historic Places / Hopi History",
    images: ["https://upload.wikimedia.org/wikipedia/commons/6/6d/A_distant_view_in_the_Hopi_pueblo_of_Oraibi_from_the_southwest%2C_Arizona%2C_ca.1898_%28CHS-4594%29.jpg"]
  },
  {
    id: "archaeology-moundbuilders-cahokia",
    name: "Cahokia Mounds (Mound Builders Capital)",
    category: "Burial Mounds",
    type: "Point",
    coordinates: { lng: -90.0633, lat: 38.6539 },
    date: 1050,
    displayDate: "c. 600 - 1400 AD (Peak c. 1050 AD)",
    description: "The largest pre-columbian settlement north of Mexico, featuring Monks Mound, a colossal earthen pyramid covering 14 acres. Cahokia served as the ceremonial and political heart of the Mississippian culture, whose construction is associated in later settler journals with the discovery of giant human skeletons.",
    source: "Cahokia Mounds State Historic Site",
    images: ["https://upload.wikimedia.org/wikipedia/commons/2/2d/Monks_Mound_in_July.JPG"]
  },
  {
    id: "archaeology-sumer-ur",
    name: "Ancient Ur & Eridu Ruins",
    category: "Megaliths / Structures",
    type: "Point",
    coordinates: { lng: 46.1030, lat: 30.9630 },
    date: -3800,
    displayDate: "c. 3800 - 500 BC",
    description: "The archaeological remains of Ur and Eridu, key urban centers of the ancient Sumerian civilization. Ur is home to the famous Great Ziggurat of Ur, a monumental stepped pyramid temple dedicated to the moon god Nanna.",
    source: "UNESCO World Heritage Sites / British Museum Excavations",
    images: ["https://upload.wikimedia.org/wikipedia/commons/6/6b/Ziggarat_of_Ur_001.jpg"]
  },
  {
    id: "archaeology-mount-seir-petra",
    name: "Petra & Mount Seir",
    category: "Megaliths / Structures",
    type: "Point",
    coordinates: { lng: 35.4444, lat: 30.3286 },
    date: -400,
    displayDate: "c. 400 BC - 100 AD",
    description: "The spectacular rock-cut rose red city of Petra, carved directly into the sandstone canyons of Mount Seir. Historically the capital of the Nabataeans, this strategic stronghold lies in the ancestral territory of the Edomites.",
    source: "UNESCO World Heritage Sites",
    images: ["https://upload.wikimedia.org/wikipedia/commons/2/2f/Treasury_petra_crop.jpeg"]
  },
  {
    id: "archaeology-ashkelon-philistines",
    name: "Archaeological Site of Ashkelon",
    category: "Archaeological Finds",
    type: "Point",
    coordinates: { lng: 34.5492, lat: 31.6622 },
    date: -1200,
    displayDate: "c. 1200 - 604 BC",
    description: "The ancient seaport of Ashkelon, one of the five major cities of the Philistine Pentapolis. Excavations have uncovered extensive Bronze and Iron Age structures, including the first-ever discovered Philistine cemetery.",
    source: "Leon Levy Expedition to Ashkelon / Harvard Museum",
    images: ["https://upload.wikimedia.org/wikipedia/commons/c/ce/Restored_Canaanite_city_gate_of_Ashkelon_%2814341997262%29.jpg"]
  },
  {
    id: "archaeology-kodachrome-handprints",
    name: "Indian Cave Hand Marks - Kodachrome Basin State Park, Utah",
    category: "Rock Art & Cave Paintings",
    type: "Point",
    coordinates: { lng: -111.9840, lat: 37.5218 },
    date: -1000,
    displayDate: "Prehistoric (Indian Cave)",
    description: "Over 100 deep hand-shaped impressions, known as petrosomatoglyphs, pressed into the soft Entrada Sandstone of Indian Cave along the Panorama Trail. Unlike carved petroglyphs, these indentations were formed by centuries of individuals repeatedly rubbing or pressing their hands into the fragile rock, wearing down the sand grains to leave deep, smooth finger and palm grooves.",
    source: "Utah State Parks / @freetherabbitspodcast",
    images: ["https://www.instagram.com/p/DZK35-UDYJa/media/?size=l"],
    socialLink: "https://www.instagram.com/p/DZK35-UDYJa/"
  },
  {
    id: "archaeology-og-bashan",
    name: "Kingdom of Bashan (King Og's Stronghold) - Golan Heights / Syria",
    category: "Giants & Nephilim",
    type: "Point",
    coordinates: { lng: 36.1030, lat: 32.6140 },
    date: -1406,
    displayDate: "c. 1406 BC",
    description: "The historical territory of Bashan, ruled by King Og, the last of the giant Rephaim. According to scripture, Moses and the Israelites conquered his kingdom, which was famous for its colossal basalt megaliths, 'cities with high walls, gates, and bars,' and his massive iron bedstead.",
    source: "Numbers 21, Deuteronomy 3, Free The Rabbits Podcast",
    images: ["https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/127303_ghost_wheel_golan_heights_PikiWiki_Israel.jpg/1280px-127303_ghost_wheel_golan_heights_PikiWiki_Israel.jpg"],
    subLabel: "Possible Nephilim Bloodline"
  },
  {
    id: "archaeology-sihon-heshbon",
    name: "City of Heshbon (King Sihon's Capital) - Jordan",
    category: "Giants & Nephilim",
    type: "Point",
    coordinates: { lng: 35.8110, lat: 31.8310 },
    date: -1406,
    displayDate: "c. 1406 BC",
    description: "The ancient capital city of Heshbon, ruled by Sihon, King of the Amorites. Sihon refused to let the Israelites pass through his territory, leading to his defeat. The Amorite giants are historically noted in scripture for their cedar-like height and oak-like strength.",
    source: "Numbers 21, Deuteronomy 2, Amos 2:9, Free The Rabbits Podcast",
    images: ["https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Tell_Hesban_%28Column%29.jpg/1280px-Tell_Hesban_%28Column%29.jpg"],
    subLabel: "Possible Nephilim Bloodline"
  },
  {
    id: "archaeology-zuzim-ham",
    name: "Ancient Region of Ham (Zuzim Stronghold) - Jordan",
    category: "Giants & Nephilim",
    type: "Point",
    coordinates: { lng: 35.8500, lat: 32.2200 },
    date: -1900,
    displayDate: "c. 1900 BC",
    description: "The biblical region of Ham (Transjordan), inhabited by the Zuzim, an ancient tribe of giant stature. They were defeated during the War of the Kings by Chedorlaomer. They are often identified with the Ammonite giant tribe called Zamzummim.",
    source: "Genesis 14:5, Deuteronomy 2:20, Free The Rabbits Podcast",
    images: ["https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Mount_Nebo_BW_6.JPG/1280px-Mount_Nebo_BW_6.JPG"],
    subLabel: "Possible Nephilim Bloodline"
  },
  {
    id: "archaeology-arba-hebron",
    name: "Kiriath-Arba (City of Arba) - Hebron",
    category: "Giants & Nephilim",
    type: "Point",
    coordinates: { lng: 35.0998, lat: 31.5298 },
    date: -1450,
    displayDate: "c. 1450 BC",
    description: "The ancient city of Hebron, originally called Kiriath-Arba after Arba, the greatest man among the giant Anakim. Arba founded the city, which became a stronghold of his giant descendants (Ahiman, Sheshai, and Talmai) before Caleb conquered it.",
    source: "Joshua 14:15, Joshua 15:13-14, Free The Rabbits Podcast",
    images: ["https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Hebron_Cave_of_the_Patriarchs.jpg/1280px-Hebron_Cave_of_the_Patriarchs.jpg"],
    subLabel: "Possible Nephilim Bloodline"
  },
  {
    id: "archaeology-rapha-gath",
    name: "Valley of Rephaim & Gath (Rapha Stronghold) - Israel",
    category: "Giants & Nephilim",
    type: "Point",
    coordinates: { lng: 34.8500, lat: 31.7000 },
    date: -1000,
    displayDate: "c. 1000 BC",
    description: "Gath of the Philistines, the ancestral home of Rapha, the progenitor of the giants of Gath. From this lineage came Goliath, Ishbi-Benob, Saph, Lahmi, and the unnamed giant with 24 fingers and toes who fought against King David and his mighty men.",
    source: "2-Samuel-21:16-22, 1-Chronicles-20:4-8, Free The Rabbits Podcast",
    images: ["https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Tel-Tsafit-206.jpg/1280px-Tel-Tsafit-206.jpg"],
    subLabel: "Possible Nephilim Bloodline"
  },
  {
    id: "archaeology-amorite-giants",
    name: "Amorite Giant Territories - Jordan Valley",
    category: "Giants & Nephilim",
    type: "Point",
    coordinates: { lng: 35.6000, lat: 31.9000 },
    date: -1450,
    displayDate: "c. 1450 BC",
    description: "The ancient mountain territories inhabited by the Amorites. Described by the prophet Amos as possessing height like the height of the cedars and strength like the oaks, the Amorites were key giant-like adversaries during the Israelite conquest.",
    source: "Amos 2:9, Numbers 13:29, Free The Rabbits Podcast",
    images: ["https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Cuneiform_Clay_Tablets_from_Amorite_Kingdom_of_Mari%2C_1st_Half_of_2nd_Mill._BC.jpg/1280px-Cuneiform_Clay_Tablets_from_Amorite_Kingdom_of_Mari%2C_1st_Half_of_2nd_Mill._BC.jpg"],
    subLabel: "Possible Nephilim Bloodline"
  },
  {
    id: "archaeology-goliath-gath",
    name: "Goliath of Gath (Giant Champion Site) - Tel es-Safi",
    category: "Giants & Nephilim",
    type: "Point",
    coordinates: { lng: 34.8467, lat: 31.6997 },
    date: -1010,
    displayDate: "c. 1010 BC",
    description: "The historical ruins of Gath (Tel es-Safi), home of Goliath, the 9-foot-tall Philistine champion slain by David. Archaeological excavations at Gath have unearthed massive Iron Age fortification walls and an early Philistine inscription bearing names etymologically similar to Goliath.",
    source: "1 Samuel 17, Tel es-Safi Excavation Reports, Free The Rabbits Podcast",
    images: ["https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Cafit030.jpg/1280px-Cafit030.jpg"],
    subLabel: "Possible Nephilim Bloodline"
  },
  {
    id: "archaeology-book-of-giants-hermon",
    name: "Dead Sea Caves (Book of Giants Discovery) - Qumran",
    category: "Giants & Nephilim",
    type: "Point",
    coordinates: { lng: 35.4597, lat: 31.7411 },
    date: -2348,
    displayDate: "Pre-Flood Era (Found 1947 AD)",
    description: "The Qumran caves where the apocryphal 'Book of Giants' was discovered. This manuscript names specific pre-Flood giant hybrids—Ohyah, Hahyah, and Mahway—detailing their giant activities, messenger missions to Enoch, and prophetic dreams regarding their doom in the upcoming Flood.",
    source: "Dead Sea Scrolls Qumran Cave 4, Free The Rabbits Podcast",
    images: ["https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Qumran.jpeg/1280px-Qumran.jpeg"],
    subLabel: "Possible Nephilim Bloodline"
  }
];
