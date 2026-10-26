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
    images: ["https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Marble_bust_of_Herodotos_MET_DT11742_%28cropped%29.jpg/1280px-Marble_bust_of_Herodotos_MET_DT11742_%28cropped%29.jpg"],
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
    images: ["https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/The_Dragon_of_India_from_Cosmographia_%281544%29_by_Sebastian_M%C3%BCnster.jpg/1280px-The_Dragon_of_India_from_Cosmographia_%281544%29_by_Sebastian_M%C3%BCnster.jpg"],
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
    images: ["https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Ethiopian_St._George_And_The_Dragon_-_Detail_%282848032429%29.jpg/1280px-Ethiopian_St._George_And_The_Dragon_-_Detail_%282848032429%29.jpg"],
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
    images: ["https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/Dos_Palmas_Preserve_Area_of_Critical_Environmental_Concern%2C_California_%2815473839010%29.jpg/1280px-Dos_Palmas_Preserve_Area_of_Critical_Environmental_Concern%2C_California_%2815473839010%29.jpg"],
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
    images: ["https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Indian_Cave_in_Kodachrome_Basin_State_Park.jpg/1280px-Indian_Cave_in_Kodachrome_Basin_State_Park.jpg"],
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
  },
  {
    id: "archaeology-choquequirao",
    name: "Choquequirao Citadel - Cusco Region, Peru",
    category: "Archaeological Finds",
    type: "Point",
    coordinates: { lng: -72.8732, lat: -13.3950 },
    date: 1535,
    displayDate: "c. 1535 AD",
    description: "Known as the sister city of Machu Picchu, Choquequirao ('Cradle of Gold') is a remote Incan citadel perched high on the Salkantay mountain range above the Apurímac River. Featuring massive stone terracing, ceremonial plazas, and white llama stone mosaics.",
    source: "Ministerio de Cultura del Perú",
    images: ["https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Choquequirao_Salkantay.jpg/500px-Choquequirao_Salkantay.jpg"]
  },
  {
    id: "archaeology-guanches-guimar",
    name: "Pyramids of Guímar & Guanche Mummy Sites - Tenerife, Canary Islands",
    category: "Ancient People Groups",
    type: "Point",
    coordinates: { lng: -16.4137, lat: 28.3228 },
    date: 1400,
    displayDate: "Pre-Conquest (15th Century)",
    description: "The Guanches were the indigenous berber-descended inhabitants of the Canary Islands who built stepped rectangular lava stone pyramids at Guímar and practiced elaborate mummification. Spanish chroniclers described them as tall, red-haired, blue-eyed islanders with unique oral traditions.",
    source: "Ethnographic Park Pyramids of Guímar",
    images: ["https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Pyramids_of_Guimar_Tenerife.jpg/500px-Pyramids_of_Guimar_Tenerife.jpg"]
  },
  {
    id: "archaeology-lanse-aux-meadows",
    name: "L'Anse aux Meadows Viking Settlement - Newfoundland, Canada",
    category: "Archaeological Finds",
    type: "Point",
    coordinates: { lng: -55.5342, lat: 51.5956 },
    date: 1000,
    displayDate: "c. 1000 AD",
    description: "The confirmed Norse settlement site in North America established around 1000 AD by Leif Erikson. Excavations unearthed sod-walled longhouses, a smithy, timber workshops, and iron rivets, confirming European presence in the Americas nearly 500 years before Columbus.",
    source: "Parks Canada & UNESCO",
    images: ["https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/L%27Anse_aux_Meadows_Reconstruction_1.jpg/500px-L%27Anse_aux_Meadows_Reconstruction_1.jpg"]
  },
  {
    id: "archaeology-kensington-runestone",
    name: "Kensington Runestone Finding Site - Solem, Minnesota, USA",
    category: "Archaeological Finds",
    type: "Point",
    coordinates: { lng: -95.6983, lat: 45.8142 },
    date: 1362,
    displayDate: "1362 AD (Found 1898)",
    description: "A 200-pound greywacke stone slab carved with Runic inscriptions unearthed by Swedish farmer Olof Ohman in 1898. The inscription describes a expedition of 8 Goths and 22 Norwegians exploring North America in 1362 AD.",
    source: "Runestone Museum, Alexandria MN",
    images: ["https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Kensington_runestone_front.jpg/500px-Kensington_runestone_front.jpg"]
  },
  {
    id: "archaeology-newark-earthworks",
    name: "Newark Earthworks - Newark, Ohio, USA",
    category: "Burial Mounds",
    type: "Point",
    coordinates: { lng: -82.4283, lat: 40.0417 },
    date: 100,
    displayDate: "c. 100 - 400 AD",
    description: "The largest geometric earthwork complex built by the Hopewell culture in North America, encompassing thousands of acres of octagons, circles, and parallel embankments. Serves as a monumental lunar observatory tracking the 18.6-year lunar standstill cycle.",
    source: "UNESCO World Heritage Site",
    images: [
      "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/03/Newark_Earthworks_Wall_and_Moat.jpg/1280px-Newark_Earthworks_Wall_and_Moat.jpg",
      "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/96/Newark_Great_Circle_Central_Mound.jpg/1280px-Newark_Great_Circle_Central_Mound.jpg"
    ]
  },
  {
    id: "archaeology-dinosaur-national-monument",
    name: "Dinosaur Quarry Wall - Jensen, Utah, USA",
    category: "Archaeological Finds",
    type: "Point",
    coordinates: { lng: -109.3039, lat: 40.4419 },
    date: -150000000,
    displayDate: "Jurassic Period (~150 Ma)",
    description: "A world-famous fossil quarry wall featuring over 1,500 exposed fossilized dinosaur bones embedded directly in the rock face, including Allosaurus, Stegosaurus, Diplodocus, and Camarasaurus.",
    source: "National Park Service",
    images: ["https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Dinosaur_Quarry_Exhibit_Hall.jpg/500px-Dinosaur_Quarry_Exhibit_Hall.jpg"]
  },
  {
    id: "archaeology-shanidar-cave",
    name: "Shanidar Cave Neanderthal Burial Site - Kurdistan, Iraq",
    category: "Archaeological Finds",
    type: "Point",
    coordinates: { lng: 44.2155, lat: 36.8322 },
    date: -65000,
    displayDate: "c. 65,000 BC",
    description: "Famous cave site where the remains of ten Neanderthals were discovered. Includes 'Shanidar 4', the famous 'Flower Burial' where soil samples revealed pollen grains from wild flowers placed on the deceased, demonstrating ritualistic burial practices.",
    source: "Cambridge University Archaeological Field Reports",
    images: ["https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Shanidar_Cave_Entrance.jpg/500px-Shanidar_Cave_Entrance.jpg"]
  },
  {
    id: "archaeology-ubaid-lizardmen",
    name: "Ubaid Lizardmen Statues Site - Ur & Eridu, Iraq",
    category: "Rock Art & Cave Paintings",
    type: "Point",
    coordinates: { lng: 46.1031, lat: 30.9631 },
    date: -4500,
    displayDate: "c. 4500 - 4000 BC",
    description: "Pre-Sumerian clay figurines unearthed at Al\'Ubaid, Ur, and Eridu depicting humanoid figures with reptilian lizard faces, elongated skulls, and almond eyes, often holding infants or wearing ceremonial shoulder guards.",
    source: "British Museum Department of Middle East Antiquities",
    images: ["https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Ubaid_Lizard_Figurine_BM.jpg/500px-Ubaid_Lizard_Figurine_BM.jpg"]
  },
  {
    id: "archaeology-vigeland-lizardmen",
    name: "Vigeland Park Human-Reptile Sculptures - Oslo, Norway",
    category: "Megaliths / Structures",
    type: "Point",
    coordinates: { lng: 10.7011, lat: 59.9270 },
    date: 1943,
    displayDate: "1924 - 1943 AD",
    description: "Gustav Vigeland's monumental sculpture park featuring over 200 granite and bronze figures. Notable sculptures depict humans wrestling with reptilian beasts, lizards coiling around human figures, and the central Monolith carved from a single massive granite block.",
    source: "Vigeland Museum, Oslo",
    images: ["https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Vigeland_Park_Monolith_Oslo.jpg/500px-Vigeland_Park_Monolith_Oslo.jpg"]
  },
  {
    id: "archaeology-fra-mauro-map",
    name: "Fra Mauro Mappa Mundi - Venice, Italy",
    category: "Archaeological Finds",
    type: "Point",
    coordinates: { lng: 12.3387, lat: 45.4336 },
    date: 1450,
    displayDate: "c. 1450 AD",
    description: "Housed in the Biblioteca Marciana, the Fra Mauro map is a masterpiece of medieval cartography commissioned by King Afonso V of Portugal. Oriented south-up, it accurately depicts Asia, Africa, and Europe before the European age of discovery.",
    source: "Biblioteca Nazionale Marciana",
    images: ["https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/FraMauroDetailedMap.jpg/500px-FraMauroDetailedMap.jpg"]
  },
  {
    id: "archaeology-lusitania-wreck",
    name: "RMS Lusitania Shipwreck - Off Old Head of Kinsale, Ireland",
    category: "Archaeological Finds",
    type: "Point",
    coordinates: { lng: -8.5492, lat: 51.4167 },
    date: 1915,
    displayDate: "May 7, 1915",
    description: "The ocean liner RMS Lusitania was torpedoed by German U-boat U-20, sinking in just 18 minutes and killing 1,198 passengers. The event dramatically shifted US public sentiment toward entering World War I amidst long-standing controversies over secret munitions cargo.",
    source: "Irish National Monuments Service Shipwreck Inventory",
    images: ["https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Lusitania_sinking.jpg/500px-Lusitania_sinking.jpg"]
  },
  {
    id: "archaeology-dealey-plaza",
    name: "Dealey Plaza JFK Site - Dallas, Texas, USA",
    category: "Archaeological Finds",
    type: "Point",
    coordinates: { lng: -96.8083, lat: 32.7786 },
    date: 1963,
    displayDate: "November 22, 1963",
    description: "The site of the assassination of US President John F. Kennedy on November 22, 1963. Encompassing the Texas School Book Depository, the Grassy Knoll, and the Triple Underpass, it remains the focal point of modern historical debate.",
    source: "The Sixth Floor Museum at Dealey Plaza",
    images: ["https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Dealey_Plaza_Dallas_Texas.jpg/500px-Dealey_Plaza_Dallas_Texas.jpg"]
  },
  {
    id: "archaeology-ales-stenar",
    name: "Ale's Stones (Ales Stenar) - Kåseberga, Sweden",
    category: "Megaliths / Structures",
    type: "Point",
    coordinates: { lng: 14.0576, lat: 55.3826 },
    date: 600,
    displayDate: "c. 600 CE",
    description: "Fifty-nine boulders laid out as a 67-metre stone ship on a clifftop above the Baltic. Officially a Nordic Iron Age monument, yet its axis catches the midsummer sunrise and midwinter sunset with a precision that whispers of the same solar priesthood behind Stonehenge. Researchers of the pre-Flood world see a boat of stone sailing toward the heavens: a memory, in rock, of the Ark and of the Watchers who taught men to read the sky.",
    source: "Swedish National Heritage Board / Megalithic Survey Records",
    images: ["https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Ales_Stenar_from_pole_camera.jpg/1280px-Ales_Stenar_from_pole_camera.jpg"]
  },
  {
    id: "archaeology-nuku-hiva-tiki",
    name: "Nuku Hiva Tiki Statues - Marquesas Islands",
    category: "Megaliths / Structures",
    type: "Point",
    coordinates: { lng: -140.13333333, lat: -8.86666667 },
    date: 1000,
    displayDate: "c. 900-1200 CE",
    description: "Dozens of squat stone figures with swollen heads, enormous staring eyes and bodies unlike any later Polynesian art stand in the ceremonial me'ae of Nuku Hiva. Islanders carved them at the very founding of the settlement, roughly a thousand years ago. Alternative researchers point to the oversized craniums and reptilian eyes as a sculpted record of the beings the islanders met, or descended from: the same 'gods' remembered across the Pacific as giants who came down from the sky.",
    source: "Marquesan Archaeological Surveys / Pacific Oral Histories",
    images: ["https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Karta_FP_Marquesa_isl.PNG/330px-Karta_FP_Marquesa_isl.PNG"]
  },
  {
    id: "archaeology-kuelap",
    name: "Kuélap Fortress of the Chachapoya - Amazonas, Peru",
    category: "Megaliths / Structures",
    type: "Point",
    coordinates: { lng: -77.9271134, lat: -6.426295 },
    date: 500,
    displayDate: "c. 500 CE",
    description: "More than four hundred circular stone houses crowd inside a wall that rises nineteen metres on a cloud-forest ridge, built by the fair-skinned 'Cloud Warriors' of the Chachapoya. The Incas conquered it; the Spanish barely noticed it; mainstream history still can't say who the Chachapoya really were. The chroniclers' descriptions of tall, light-haired people and the mummies found in cliff-face tombs feed the theory of a lost lineage that fled into the Andes after the dispersion of Babel.",
    source: "Peruvian Ministry of Culture / Spanish Colonial Chronicles",
    images: ["https://thumb.wikimedia.org/wikipedia/commons/thumb/3/35/Kuelap_-_Ao%C3%BBt_2007_-_05.jpg/1280px-Kuelap_-_Ao%C3%BBt_2007_-_05.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"]
  },
  {
    id: "archaeology-monte-sierpe",
    name: "Monte Sierpe 'Band of Holes' - Pisco Valley, Peru",
    category: "Megaliths / Structures",
    type: "Point",
    coordinates: { lng: -75.87516, lat: -13.710486 },
    date: 1300,
    displayDate: "c. 1300 CE",
    description: "Roughly 5,200 pits, each about a metre wide, march in a precise serpentine band for 1.5 kilometres across a hillside above the Pisco Valley. Archaeologists guess at storage, tribute accounting or defence, but no one has found a single artefact to settle it. From the air the line reads like a coded strip, a tally stick for giants, or the spine of the serpent the site is named for.",
    source: "Peruvian Archaeological Surveys / Aerial Photography Archives",
    images: ["https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f8/Faixa_de_Buracos_-_Linhas_de_Nazca_-_Peru_-_Band_of_Holes_-_4_-_panoramio.jpg/330px-Faixa_de_Buracos_-_Linhas_de_Nazca_-_Peru_-_Band_of_Holes_-_4_-_panoramio.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"]
  },
  {
    id: "archaeology-tlos",
    name: "Tlos 'Melted' Acropolis - Lycia, Türkiye",
    category: "Megaliths / Structures",
    type: "Point",
    coordinates: { lng: 29.42079444, lat: 36.55253611 },
    date: -2000,
    displayDate: "c. 2000 BCE",
    description: "One of the oldest cities of Lycia, said in Greek legend to be the home of the winged horse Pegasus and the hero Bellerophon. Its rock-cut tombs and fortress walls show surfaces that look flowed and vitrified rather than weathered. Old-world researchers read Tlos as a casualty of a cataclysm of fire that the official timeline has no room for, the kind of judgement the prophets describe raining on cities that had gone the way of the Nephilim.",
    source: "Lycian Archaeological Surveys / Classical Geographers",
    images: ["https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f8/Tlos_Stadium_4152.jpg/1280px-Tlos_Stadium_4152.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"]
  },
  {
    id: "archaeology-dara",
    name: "Dara-Anastasiupolis Rock-Cut City - Mardin, Türkiye",
    category: "Megaliths / Structures",
    type: "Point",
    coordinates: { lng: 40.94111111, lat: 37.17777778 },
    date: 505,
    displayDate: "505 CE",
    description: "A Byzantine frontier fortress carved straight down into the bedrock of northern Mesopotamia: cisterns the size of cathedrals, a necropolis cut into cliffs, galleries that run under the whole town. The outer walls appear slumped and melted while the chambers inside are crisp and intact. Theorists ask what kind of heat deforms a fortress from the outside without touching its heart, and whether the history of the 'builders' was simply re-dated to the emperor who repaired it.",
    source: "Turkish Ministry of Culture / Byzantine Military Chronicles",
    images: ["https://thumb.wikimedia.org/wikipedia/commons/thumb/6/65/Dara_P1030851_20080424091200.JPG/1280px-Dara_P1030851_20080424091200.JPG?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"]
  },
  {
    id: "archaeology-hejin-fortress",
    name: "Hejin 'Melted' Fortress Ruins - Shanxi, China",
    category: "Megaliths / Structures",
    type: "Point",
    coordinates: { lng: 110.7114, lat: 35.5967 },
    date: -1000,
    displayDate: "Undated (pre-dynastic?)",
    description: "Along the Yellow River in Hejin, Shanxi, stand earthen fortress walls whose outer faces look poured and run like candle wax, while interior rooms remain square and sharp. No dynasty claims to have built them. Mudflood and old-world researchers treat Hejin as one more witness to a vanished civilisation erased from the record, its ruins baked by a heat the chronicles chose not to describe.",
    source: "Field Footage (X) / Old World Research Community",
    images: ["https://x.com/i/status/2079887739223196003", "https://pbs.twimg.com/amplify_video_thumb/2079887375128313856/img/SEHg2sxf9bjqHBSj.jpg", "https://x.com/i/status/2079875452810772629", "https://pbs.twimg.com/ext_tw_video_thumb/1874470209135820800/pu/img/N3cNMOyfEscc9bjC.jpg"]
  },
  {
    id: "archaeology-chronicle-of-georgia",
    name: "The Chronicle of Georgia Monument - Tbilisi, Georgia",
    category: "Megaliths / Structures",
    type: "Point",
    coordinates: { lng: 44.810438, lat: 41.770503 },
    date: 1985,
    displayDate: "1985 CE",
    description: "Sixteen pillars up to thirty-five metres tall rise over the Tbilisi Sea, carved by Zurab Tsereteli with Georgia's kings and queens on their upper registers and the life of Christ beneath them. Begun under the Soviets and never officially finished, it looks less like a modern sculpture than a gate left standing from an older age. Visitors call it the 'Georgian Stonehenge'; the carving of the Crucifixion on a Soviet-era monument is a quiet act of defiance hidden in plain sight.",
    source: "Georgian National Tourism Administration",
    images: ["https://thumb.wikimedia.org/wikipedia/commons/thumb/6/63/Photos_taken_during_HGN_workshop_in_Tbilisi_in_May_2024_5.jpg/1280px-Photos_taken_during_HGN_workshop_in_Tbilisi_in_May_2024_5.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"]
  },
  {
    id: "archaeology-mount-nemrut",
    name: "Mount Nemrut Colossal Heads - Commagene, Türkiye",
    category: "Megaliths / Structures",
    type: "Point",
    coordinates: { lng: 38.74083333, lat: 37.98055556 },
    date: -62,
    displayDate: "62 BCE",
    description: "On a 2,100-metre summit King Antiochus I of Commagene raised a tumulus of crushed stone flanked by enthroned colossi of himself seated among Zeus, Apollo, Heracles and the goddess of Commagene. Their heads, each the height of a man, now sit toppled in the gravel. Antiochus declared himself the equal of the gods and had his horoscope carved in a stone lion: the same claim that got the Watchers' offspring destroyed, repeated by a king who wanted to be worshipped on a mountain.",
    source: "UNESCO World Heritage Catalog / Commagene Inscriptions",
    images: ["https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a3/Mount_Nemrut_-_East_Terrace_%284961323529%29.jpg/1280px-Mount_Nemrut_-_East_Terrace_%284961323529%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"]
  },
  {
    id: "archaeology-heracleion",
    name: "Sunken Thonis-Heracleion & Its Sphinx - Abu Qir Bay, Egypt",
    category: "Archaeological Finds",
    type: "Point",
    coordinates: { lng: 30.12888889, lat: 31.31277778 },
    date: -800,
    displayDate: "c. 800 BCE (submerged by c. 800 CE)",
    description: "For two thousand years Thonis-Heracleion existed only in Herodotus and Diodorus; then in 2000 divers found it ten metres under Abu Qir Bay with its temples, colossal statues and a sphinx still lying on the seabed. The city sank when its liquefied clay foundations gave way. A whole metropolis swallowed by water and forgotten is exactly the kind of event the legends of Atlantis and the Flood preserve, and Heracleion proves such cities are not myth.",
    source: "European Institute for Underwater Archaeology (IEASM)",
    images: ["https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2d/Canopus_menouthis_herakleion.jpg/330px-Canopus_menouthis_herakleion.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail", "https://x.com/i/status/2078331267670761979", "https://pbs.twimg.com/ext_tw_video_thumb/2018026567742713856/pu/img/wfN6XUCFpS3614iD.jpg"]
  },
  {
    id: "archaeology-santa-cristina-well",
    name: "Sacred Well of Santa Cristina (Nuragic) - Paulilatino, Sardinia",
    category: "Megaliths / Structures",
    type: "Point",
    coordinates: { lng: 8.7756, lat: 40.0646 },
    date: -1100,
    displayDate: "c. 1100 BCE",
    description: "A keyhole-shaped stair of perfectly cut basalt descends to a well whose corbelled dome is open to the sky through a small aperture. At the equinoxes the sun reaches the water; every 18.6 years the moon's light falls straight down the shaft. The Nuragic builders left no writing, yet they engineered a lunar observatory in a well three thousand years ago, with a precision that the 'Bronze Age shepherds' of the textbooks should not have possessed.",
    source: "Sardinian Archaeological Superintendency",
    images: ["https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b2/Santa_Cristina_Pozzo_Sacro_Esterno_5849.JPG/1280px-Santa_Cristina_Pozzo_Sacro_Esterno_5849.JPG?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail"]
  },
  {
    id: "archaeology-eupalinos-tunnel",
    name: "Tunnel of Eupalinos - Samos, Greece",
    category: "Archaeological Finds",
    type: "Point",
    coordinates: { lng: 26.93, lat: 37.694 },
    date: -550,
    displayDate: "c. 550 BCE",
    description: "A kilometre-long aqueduct driven through a mountain from both ends at once, meeting in the middle with an error of a few centimetres, in the sixth century BCE. Herodotus called it one of the three wonders of the Greek world. The geometry needed to do this was not supposed to exist for another two hundred years; either Eupalinos was a genius without peer, or he was working from knowledge much older than Greece.",
    source: "Herodotus, Histories III.60 / Greek Archaeological Service",
    images: ["https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0a/Eupalinian_aqueduct.JPG/1280px-Eupalinian_aqueduct.JPG?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"]
  },
  {
    id: "archaeology-vishaps",
    name: "Armenian Vishaps (Dragon Stones) - Geghama Mountains, Armenia",
    category: "Megaliths / Structures",
    type: "Point",
    coordinates: { lng: 44.75, lat: 40.275 },
    date: -2000,
    displayDate: "c. 2000 BCE",
    description: "Up to five metres tall and eight tons each, these monoliths stand beside high mountain springs carved as fish, bulls' hides and serpents. A survey of 115 of them found they were deliberately placed above the water sources of the plains below. Armenian legend calls them dragon stones, planted where the vishap, the dragon of the deep, was bound: the serpent of Eden pinned at the headwaters, exactly where a people who remembered the Flood would put it.",
    source: "Armenian Institute of Archaeology / Yerevan State University Survey",
    images: ["https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f6/Vishap02.jpg/1280px-Vishap02.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"]
  },
  {
    id: "archaeology-sakafuneishi",
    name: "Sakafune-ishi Carved Stone - Asuka, Japan",
    category: "Megaliths / Structures",
    type: "Point",
    coordinates: { lng: 135.82072222, lat: 34.47130556 },
    date: 650,
    displayDate: "7th century CE",
    description: "A five-metre granite slab on a hilltop in Japan's ancient capital, cut with shallow basins joined by straight channels, like a circuit board or a distillation bench. Later scholars decided it was for brewing sake; it isn't. Along with the nearby Masuda-no-Iwafune 'rock ship', Asuka's carved monoliths point to a technology, or a ritual chemistry, the official chronicles never explain.",
    source: "Nara Prefecture Cultural Heritage Office",
    images: ["https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5a/%E9%85%92%E8%88%B9%E7%9F%B3%E9%81%BA%E8%B7%A1%E9%85%92%E8%88%B9%E7%9F%B3.JPG/1280px-%E9%85%92%E8%88%B9%E7%9F%B3%E9%81%BA%E8%B7%A1%E9%85%92%E8%88%B9%E7%9F%B3.JPG?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail"]
  },
  {
    id: "archaeology-lomas-rishi",
    name: "Lomas Rishi Cave - Barabar Hills, India",
    category: "Megaliths / Structures",
    type: "Point",
    coordinates: { lng: 85.06452778, lat: 25.00644444 },
    date: -250,
    displayDate: "c. 250 BCE",
    description: "A sanctuary hollowed from a single granite hill with walls polished to a mirror finish that still rings like a bell when struck. Its ogee entrance imitates timber architecture in solid rock, carved supposedly with iron chisels in the age of Ashoka. The acoustics and the glass-smooth surfaces have convinced many that the Barabar caves were not cut by hand at all, but by a lost technique of working stone the ancient world shared from Egypt to India.",
    source: "Archaeological Survey of India",
    images: ["https://thumb.wikimedia.org/wikipedia/commons/thumb/2/25/Lomas_Rishi_entrance.jpg/1280px-Lomas_Rishi_entrance.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"]
  },
  {
    id: "archaeology-rosalila",
    name: "Rosalila Temple (Buried Intact) - Copán, Honduras",
    category: "Archaeological Finds",
    type: "Point",
    coordinates: { lng: -89.1425, lat: 14.8375 },
    date: 571,
    displayDate: "571 CE",
    description: "The Maya did not demolish this temple when they outgrew it; they wrapped it in a thick layer of plaster and buried it whole inside a larger pyramid, stucco masks and red paint untouched. Archaeologists tunnelling into Structure 16 found it in 1989 as it was left twelve centuries ago. A god-house entombed with such care is a reminder that these cities worshipped something they feared to offend, and the sealed temple is its coffin.",
    source: "Copán Archaeological Project / UNESCO",
    images: ["https://thumb.wikimedia.org/wikipedia/commons/thumb/2/26/Rosalila_Temple_Museum_in_Copan.jpg/1280px-Rosalila_Temple_Museum_in_Copan.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail"]
  },
  {
    id: "archaeology-waru-waru",
    name: "Waru Waru Raised Fields - Lake Titicaca, Peru",
    category: "Megaliths / Structures",
    type: "Point",
    coordinates: { lng: -70.02805556, lat: -15.78361111 },
    date: -300,
    displayDate: "c. 300 BCE",
    description: "Seen from a drone, the altiplano around Titicaca is combed into thousands of raised beds and canals, a hydraulic machine that stored the day's heat in water to beat the night frost at 3,800 metres. Modern agronomists only understood how it worked in the 1980s. Whoever engineered the lake basin, the same builders tied to Tiwanaku and Puma Punku, farmed with a science the Inca inherited and the conquistadors dismissed.",
    source: "Andean Agricultural Archaeology Programme",
    images: ["https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c9/Waru_waru_moderno.JPG/330px-Waru_waru_moderno.JPG?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"]
  },
  {
    id: "archaeology-sabu-disk",
    name: "The Disk of Sabu - Saqqara, Egypt",
    category: "Archaeological Finds",
    type: "Point",
    coordinates: { lng: 31.2164, lat: 29.8711 },
    date: -3000,
    displayDate: "c. 3000 BCE (1st Dynasty)",
    description: "A tri-lobed dish of fragile schist, sixty centimetres across, lifted from the tomb of Prince Sabu in 1936. Egyptology files it as a lamp stand or a lotus bowl. It looks like a turbine, an impeller or a flywheel carved by someone copying a machine they had seen but could not build, and it dates to the first dynasty, when, by the official story, the Egyptians had only just discovered copper.",
    source: "Egyptian Museum, Cairo / W.B. Emery Excavation Reports",
    images: ["https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b4/Disk_of_Sabu.jpg/1280px-Disk_of_Sabu.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail"]
  },
  {
    id: "archaeology-colossus-apennines",
    name: "Colossus of the Apennines - Villa Demidoff, Italy",
    category: "Megaliths / Structures",
    type: "Point",
    coordinates: { lng: 11.3047, lat: 43.8614 },
    date: 1580,
    displayDate: "1580 CE",
    description: "A ten-metre giant crouches over a pond in a Medici garden north of Florence, brick and stone fused into a mountain-god with rooms and a fireplace inside his body, so that in winter smoke poured from his nostrils. Giambologna is credited with building him in 1580. For those who collect the giants on the earth in those days, the Colossus is the Renaissance remembering, in the only language it was allowed, what once walked the Apennines.",
    source: "Parco Mediceo di Pratolino / Florentine Archives",
    images: ["https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d1/Apennine_Colossus_panorama_%2881988p%29.jpg/1280px-Apennine_Colossus_panorama_%2881988p%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail"]
  },
  {
    id: "archaeology-galgano-sword",
    name: "Saint Galgano's Sword in the Stone - Montesiepi, Italy",
    category: "Archaeological Finds",
    type: "Point",
    coordinates: { lng: 11.1555, lat: 43.1525 },
    date: 1180,
    displayDate: "1180 CE",
    description: "A Tuscan knight who renounced war in 1180 drove his sword into a rock to make a cross to pray before, and it is still there, under glass in a round chapel on the hill. Metallurgists at the University of Pavia dated the blade to the twelfth century and found the rock encases it to the hilt. The real Excalibur was never pulled out of the stone; it was put in, as a sign that the age of the sword had ended for one man who answered the call.",
    source: "University of Pavia Metallurgical Analysis / Abbey of San Galgano Records",
    images: ["https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a4/San_Galgano_Spada_nella_roccia.JPG/1280px-San_Galgano_Spada_nella_roccia.JPG?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail"]
  },
  {
    id: "archaeology-domus-de-janas",
    name: "Grutta 'e Janas (Fairy Houses) - Sardinia, Italy",
    category: "Megaliths / Structures",
    type: "Point",
    coordinates: { lng: 8.951, lat: 40.085 },
    date: -3400,
    displayDate: "c. 3400-2700 BCE",
    description: "More than three thousand chambers cut into Sardinian cliffs, with carved doorways, false ceilings imitating wooden beams and bulls' horns in red ochre on the walls. The islanders have always called them domus de janas, the houses of the fairies, small beings who were there before men. The folk memory of a prior, non-human race living in the rock is the same one the Bible attributes to the generations before the Flood.",
    source: "Sardinian Archaeological Superintendency / Folklore Archives",
    images: ["https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b8/Putifigari%2C_necropoli_di_Monte_Siseri_%2820%29.jpg/1280px-Putifigari%2C_necropoli_di_Monte_Siseri_%2820%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"]
  },
  {
    id: "archaeology-giants-tomb-san-cosimo",
    name: "Giants' Tomb of San Cosimo - Gonnosfanadiga, Sardinia",
    category: "Megaliths / Structures",
    type: "Point",
    coordinates: { lng: 8.6472, lat: 39.4886 },
    date: -1400,
    displayDate: "c. 1400 BCE",
    description: "One of more than three hundred surviving 'tombe dei giganti', long gallery graves fronted by a horned forecourt and a carved portal stele, that the Nuragic people spread across Sardinia. Local tradition never called them anything but the graves of giants, and bones of unusual size reported by nineteenth-century diggers have conveniently vanished. The island of the nuraghi is one of the densest giant-lore landscapes in Europe.",
    source: "Sardinian Archaeological Superintendency / 19th-Century Excavation Reports",
    images: ["https://thumb.wikimedia.org/wikipedia/commons/thumb/9/95/Foto_aerea_della_tomba_Tomba_dei_Giganti_%22Sa_Domu_%27e_S%27Orku2_in_territorio_di_Siddi._La_tomba_risale_al_periodo_nuragico.jpg/1280px-Foto_aerea_della_tomba_Tomba_dei_Giganti_%22Sa_Domu_%27e_S%27Orku2_in_territorio_di_Siddi._La_tomba_risale_al_periodo_nuragico.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"]
  },
  {
    id: "archaeology-pietravairano-theater",
    name: "San Nicola Theatre-Temple - Pietravairano, Italy",
    category: "Archaeological Finds",
    type: "Point",
    coordinates: { lng: 14.16666667, lat: 41.33333333 },
    date: -150,
    displayDate: "2nd century BCE (found 2000)",
    description: "A Samnite-Roman theatre and temple terraced into a mountainside above Campania, invisible until a paraglider spotted the outline in 2000. Two thousand years of farmers walked over it without seeing it. If a whole sanctuary could hide within sight of Naples until the twenty-first century, consider how much of the old world is still under the fields, waiting for the right angle of light.",
    source: "Campania Archaeological Superintendency",
    images: ["https://thumb.wikimedia.org/wikipedia/commons/thumb/0/08/Pietravairano.jpg/1280px-Pietravairano.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"]
  },
  {
    id: "archaeology-ark-of-bukhara",
    name: "Ark of Bukhara Citadel - Bukhara, Uzbekistan",
    category: "Megaliths / Structures",
    type: "Point",
    coordinates: { lng: 64.41027778, lat: 39.77777778 },
    date: 500,
    displayDate: "c. 5th century CE",
    description: "A mudbrick mountain in the centre of one of the oldest cities on the Silk Road, rebuilt so many times that its earliest layers reach back before Islam, before Alexander, into the fog of the first Sogdian kings. The emirs ruled from it until the Red Army shelled it in 1920. Legend ties its foundation to the hero Siyavush of the Shahnameh, which makes the Ark a fortress built on a myth older than its own name.",
    source: "Uzbek Academy of Sciences / Shahnameh Traditions",
    images: ["https://thumb.wikimedia.org/wikipedia/commons/thumb/6/69/Ark_of_Bukhara_2023.9.jpg/1280px-Ark_of_Bukhara_2023.9.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"]
  },
  {
    id: "archaeology-yediler-monastery",
    name: "Yediler Monastery Ruins - Lake Bafa, Türkiye",
    category: "Archaeological Finds",
    type: "Point",
    coordinates: { lng: 27.41666667, lat: 37.5 },
    date: 800,
    displayDate: "c. 8th-9th century CE",
    description: "Byzantine monks built the Monastery of the Seven Brothers among the granite boulders of Mount Latmos, painting the Crucifixion onto the underside of a natural rock shelter. The cells and chapels are wedged between stones the size of houses, as if the monks were hiding their worship inside a giant's rockfall. It is Christianity surviving in the wilderness, in the same way the prophets did, out of reach of the empire that claimed to protect it.",
    source: "Turkish Ministry of Culture / Latmos Surveys",
    images: ["https://thumb.wikimedia.org/wikipedia/commons/thumb/a/ae/Yediler_Manast%C4%B1r%C4%B1_Genel_G%C3%B6r%C3%BCn%C3%BCm.jpg/1280px-Yediler_Manast%C4%B1r%C4%B1_Genel_G%C3%B6r%C3%BCn%C3%BCm.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail"]
  },
  {
    id: "archaeology-sumela-monastery",
    name: "Sümela Monastery - Trabzon, Türkiye",
    category: "Megaliths / Structures",
    type: "Point",
    coordinates: { lng: 39.65833333, lat: 40.69 },
    date: 386,
    displayDate: "386 CE",
    description: "A Greek Orthodox monastery glued to a sheer cliff three hundred metres above the Altındere valley, founded in 386 by two Athenian monks who followed an icon of the Virgin said to have been painted by Luke. The question the guidebooks skip is why anyone would build here at all, and whether the ledge was cut and the rock-face chambers hollowed by builders long before the monks arrived to sanctify them.",
    source: "Turkish Ministry of Culture / Pontic Greek Chronicles",
    images: ["https://thumb.wikimedia.org/wikipedia/commons/thumb/d/db/Sumela_From_Across_Valley.JPG/1280px-Sumela_From_Across_Valley.JPG?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"]
  },
  {
    id: "archaeology-agia-sofia-cave-kythira",
    name: "Agia Sofia Cave Church - Kythira, Greece",
    category: "Archaeological Finds",
    type: "Point",
    coordinates: { lng: 22.9975, lat: 36.2575 },
    date: 1250,
    displayDate: "13th century CE",
    description: "On the island where Aphrodite was said to have risen from the sea, a cave of stalactites was consecrated to Holy Wisdom, its antechamber frescoed with saints in the thirteenth century. Pagan shrine, hermit's refuge, then church: the sequence repeats at caves across the Mediterranean. The deep places of the earth were worshipped in long before they were blessed, and the frescoes are a seal set over an older door.",
    source: "Greek Ministry of Culture / Kythira Speleological Records",
    images: ["https://thumb.wikimedia.org/wikipedia/commons/thumb/f/fe/Agia_Sofia_cave%2C_Kythira.JPG/1280px-Agia_Sofia_cave%2C_Kythira.JPG?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail"]
  },
  {
    id: "archaeology-aztec-sun-stone",
    name: "Aztec Sun Stone (Calendar Stone) - Mexico City, Mexico",
    category: "Archaeological Finds",
    type: "Point",
    coordinates: { lng: -99.1875, lat: 19.42611111 },
    date: 1500,
    displayDate: "c. 1500 CE",
    description: "A 24-ton basalt disk carved under Moctezuma II, with the sun god Tonatiuh at its heart, tongue out as a sacrificial knife, ringed by the four previous worlds that ended in jaguars, wind, fire and flood. The Spanish buried it face down in the plaza to kill its power; it resurfaced in 1790. It is a cosmology of repeated destructions, the Aztec memory of the same catastrophes Genesis records, carved by a people who believed the sun needed blood to keep rising.",
    source: "Museo Nacional de Antropología, Mexico City",
    images: ["https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/Monolito_de_la_Piedra_del_Sol.jpg/1280px-Monolito_de_la_Piedra_del_Sol.jpg"]
  },
  {
    id: "archaeology-man-mound",
    name: "Man Mound (Human Effigy Earthwork) - Sauk County, Wisconsin",
    category: "Burial Mounds",
    type: "Point",
    coordinates: { lng: -89.6718, lat: 43.4886 },
    date: 1000,
    displayDate: "c. 750-1200 CE",
    description: "The only surviving human-shaped effigy mound in North America, 214 feet long, striding west with horned headgear, built by the Late Woodland mound people. A road cut off its legs in 1905. The horned figure is a recurring image across the effigy-mound country of Wisconsin, and the Ho-Chunk say the mounds were raised to honour the spirit beings who came before. Horned giants striding across the land are not a new idea to anyone who has read Genesis 6.",
    source: "Sauk County Historical Society / National Historic Landmark Nomination",
    images: ["https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4f/Man_Mound.jpg/1280px-Man_Mound.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"]
  },
  {
    id: "archaeology-nazca-168-geoglyphs",
    name: "168 New Nazca Geoglyphs (Yamagata Survey) - Nazca, Peru",
    category: "Megaliths / Structures",
    type: "Point",
    coordinates: { lng: -75.13, lat: -14.739 },
    date: -200,
    displayDate: "c. 500 BCE-500 CE (found 2022)",
    description: "A Yamagata University team using drones and AI added 168 previously unknown figures to the Nazca catalogue in 2022: humanoids, birds, cats, a snake, mostly small and clustered along ancient paths. The desert is still giving up drawings after a century of study, which means the known Nazca Lines are only the ones large enough for a plane to notice. The sky-gods these were drawn for had a much more detailed picture book than we did.",
    source: "Yamagata University Nazca Institute (2022)",
    images: ["https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/L%C3%ADneas_de_Nazca%2C_Nazca%2C_Per%C3%BA%2C_2015-07-29%2C_DD_49.JPG/1280px-L%C3%ADneas_de_Nazca%2C_Nazca%2C_Per%C3%BA%2C_2015-07-29%2C_DD_49.JPG"]
  },
  {
    id: "archaeology-nazca-stone-circles",
    name: "Nazca Geometric Geoglyphs & Stone Circles - Nazca Desert, Peru",
    category: "Megaliths / Structures",
    type: "Point",
    coordinates: { lng: -75.17, lat: -14.7 },
    date: -200,
    displayDate: "c. 500 BCE-500 CE",
    description: "Beyond the famous hummingbird and monkey, aerial explorers keep finding geometry in the pampa: concentric squares, a 'compass rose', interlocking triangles like a Hindu yantra, and at least eight rings of stone that look for all the world like crop circles frozen in the desert. Sacred geometry drawn at a scale only the sky can read, by people who, the official line says, never left the ground.",
    source: "Aerial Survey Footage (Weird Old World) / Nazca Research Archives",
    images: ["https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/L%C3%ADneas_de_Nazca%2C_Nazca%2C_Per%C3%BA%2C_2015-07-29%2C_DD_49.JPG/1280px-L%C3%ADneas_de_Nazca%2C_Nazca%2C_Per%C3%BA%2C_2015-07-29%2C_DD_49.JPG", "https://x.com/i/status/2073776414231515341", "https://pbs.twimg.com/amplify_video_thumb/2073593538005127168/img/q-PUPA_McpusBM8l.jpg", "https://x.com/i/status/2075945999390974240", "https://pbs.twimg.com/amplify_video_thumb/2075944867960692736/img/HqJ14gj52OKfgMOO.jpg"]
  },
  {
    id: "archaeology-cerro-el-cono",
    name: "Cerro El Cono 'Amazon Pyramid' - Ucayali, Peru",
    category: "Megaliths / Structures",
    type: "Point",
    coordinates: { lng: -74.0736, lat: -7.2753 },
    date: -10000,
    displayDate: "Undated",
    description: "A 400-metre cone rises alone out of the flat Peruvian Amazon, so symmetrical that the Shipibo and Asháninka revere it as a sacred mountain and travellers call it a pyramid swallowed by the jungle. Geologists say volcanic plug; nobody has excavated it. In a region where lidar keeps revealing lost cities under the canopy, a perfect pyramid-shaped hill is at least worth a second look. (Pin placed at the Sierra del Divisor reference point; the cone itself has no published coordinates.)",
    source: "Sierra del Divisor National Park / Indigenous Oral Tradition",
    images: ["https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Acerc%C3%A1ndose_a_%22El_Cono%22_-_panoramio.jpg/1280px-Acerc%C3%A1ndose_a_%22El_Cono%22_-_panoramio.jpg"]
  },
  {
    id: "archaeology-bashplemi-tablet",
    name: "Bashplemi Lake Basalt Tablet - Dmanisi, Georgia",
    category: "Archaeological Finds",
    type: "Point",
    coordinates: { lng: 44.35, lat: 41.33 },
    date: -1000,
    displayDate: "c. 1000 BCE (found 2021)",
    description: "A basalt slab pulled from a lakeshore near Dmanisi carries sixty characters in thirty-nine distinct signs that match no known script, drilled and scored with a precision tool. It appears to be a numbered list: a tally, a calendar, or a lineage. An unknown writing system from the Caucasus, the land the Table of Nations places directly in the path of Noah's sons, is the sort of find that gets quietly filed rather than announced.",
    source: "Georgian National Academy of Sciences (2024)",
    images: ["https://pbs.twimg.com/media/HM6qN1bbYAAiZlk.jpg"]
  },
  {
    id: "archaeology-kudurru",
    name: "Babylonian Kudurru Boundary Stones - Sippar, Iraq",
    category: "Archaeological Finds",
    type: "Point",
    coordinates: { lng: 44.2522, lat: 33.0588 },
    date: -1150,
    displayDate: "c. 1150 BCE",
    description: "Black limestone stelae recording royal land grants, their upper registers carved with the symbols of the gods, sun, moon, Venus, the scorpion, the serpent, who would curse anyone moving the boundary. A legal deed and a divine threat in one object. The same star-gods the kudurru invokes are the 'host of heaven' the prophets condemned Israel for worshipping, and the stones show exactly what that worship looked like.",
    source: "British Museum / Louvre Mesopotamian Collections",
    images: ["https://thumb.wikimedia.org/wikipedia/commons/thumb/6/6c/Caillou_Michaux_CdM.jpg/1280px-Caillou_Michaux_CdM.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"]
  },
  {
    id: "archaeology-merneptah-stele",
    name: "Merneptah Stele ('Israel Stele') - Thebes, Egypt",
    category: "Biblical Discoveries",
    type: "Point",
    coordinates: { lng: 32.61027778, lat: 25.72055556 },
    date: -1208,
    displayDate: "c. 1208 BCE",
    description: "On a black granite victory stele Pharaoh Merneptah boasts that 'Israel is laid waste, its seed is no more.' It is the earliest mention of Israel outside the Bible, and it puts a people by that name in Canaan by 1208 BCE, already settled enough to be worth destroying. The pharaoh meant it as an obituary. Three thousand years later his empire is dust and the people he wrote off still carry the name.",
    source: "Egyptian Museum, Cairo / Flinders Petrie (1896)",
    images: ["https://thumb.wikimedia.org/wikipedia/commons/thumb/0/09/Merneptah_Steli_%28cropped%29.jpg/1280px-Merneptah_Steli_%28cropped%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"]
  },
  {
    id: "archaeology-frankfurt-silver-amulet",
    name: "Frankfurt Silver Inscription (Earliest Christian Text North of the Alps)",
    category: "Biblical Discoveries",
    type: "Point",
    coordinates: { lng: 8.6378, lat: 50.1542 },
    date: 250,
    displayDate: "c. 230-270 CE",
    description: "A silver foil rolled inside an amulet, buried with a man outside Roman Frankfurt around 250 CE and unrolled by CT scan in 2024. Eighteen lines, in Latin, confess Jesus Christ as Son of God and quote Philippians: 'every knee shall bow.' No pagan gods, no magic names, just the gospel, worn against the body in the years when confessing it was a capital offence.",
    source: "Frankfurt Archaeological Museum / Leibniz Centre for Archaeology (2024)",
    images: ["https://thumb.wikimedia.org/wikipedia/commons/thumb/b/bb/Hagios_hagios_hagios_20241222_155425.jpg/1280px-Hagios_hagios_hagios_20241222_155425.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"]
  },
  {
    id: "archaeology-cyprus-wheeled-stands",
    name: "Cypriot Bronze Wheeled Stands (1 Kings 7) - Enkomi & Kourion, Cyprus",
    category: "Biblical Discoveries",
    type: "Point",
    coordinates: { lng: 33.95, lat: 35.17 },
    date: -1200,
    displayDate: "c. 1200 BCE",
    description: "Bronze stands on four wheels with openwork panels of lions, oxen and cherubim, cast in Cyprus in the twelfth century BCE and now in the British Museum. First Kings 7 describes Hiram of Tyre making ten bronze wheeled stands for Solomon's Temple with exactly those decorations. Critics called the Temple account a later fiction; the stands show the craft, the imagery and the Phoenician workshops were real and precisely as the text describes.",
    source: "British Museum / 1 Kings 7:27-37",
    images: ["https://thumb.wikimedia.org/wikipedia/commons/thumb/3/37/Cypriot_bronze_wheeled_stand_with_an_animal_frieze_on_the_ring_and_figures_in_the_side_panels.jpg/1280px-Cypriot_bronze_wheeled_stand_with_an_animal_frieze_on_the_ring_and_figures_in_the_side_panels.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail"]
  },
  {
    id: "archaeology-sea-peoples",
    name: "The Sea Peoples & the Bronze Age Collapse - Medinet Habu, Egypt",
    category: "Biblical Discoveries",
    type: "Point",
    coordinates: { lng: 32.6, lat: 25.72 },
    date: -1177,
    displayDate: "c. 1177 BCE",
    description: "Around 1177 BCE a confederation of sea-borne raiders, the Peleset, Sherden, Shekelesh and others, burned the Hittite empire, Ugarit and the Mycenaean palaces and were only stopped on the Nile delta by Ramesses III, who carved the battle on his temple at Medinet Habu. The Peleset settled the coast and became the Philistines of Goliath and Samson. The Bible's giants-in-the-land narrative begins exactly where Egypt's records of the invasion leave off.",
    source: "Medinet Habu Reliefs / Egyptian Royal Annals",
    images: ["https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b6/Medinet_Habu_Ramses_III._Tempel_Nordostwand_Abzeichnung_01.jpg/1280px-Medinet_Habu_Ramses_III._Tempel_Nordostwand_Abzeichnung_01.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"]
  },
  {
    id: "archaeology-abydos-king-list",
    name: "Abydos King List of Seti I - Abydos, Egypt",
    category: "Biblical Discoveries",
    type: "Point",
    coordinates: { lng: 31.9192, lat: 26.1844 },
    date: -1290,
    displayDate: "c. 1290 BCE",
    description: "Seventy-six cartouches of pharaohs from Menes to Seti I carved in the Temple of Seti at Abydos, the official memory of Egypt as the priests wanted it. Hatshepsut, Akhenaten and the Amarna kings are simply missing, erased from the lineage. A king list that openly edits out inconvenient rulers is a lesson in how every dynasty, ancient and modern, curates its past, and why the records that survive are never the whole story.",
    source: "Temple of Seti I, Abydos / Egyptological Chronologies",
    images: ["https://thumb.wikimedia.org/wikipedia/commons/thumb/d/de/C%2BB-Egypt-Fig9-SetiIAbydosKingList.PNG/500px-C%2BB-Egypt-Fig9-SetiIAbydosKingList.PNG?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"]
  },
  {
    id: "archaeology-quinametzin-giants",
    name: "The Quinametzin Giants of the Previous Sun - Cholula, Mexico",
    category: "Giants & Nephilim",
    type: "Point",
    coordinates: { lng: -98.3, lat: 19.06 },
    date: -1000,
    displayDate: "Mythic (Aztec chronicles, 16th c.)",
    description: "The Aztecs taught that the world before ours belonged to the Quinametzin, giants who raised the pyramids of Teotihuacan and Cholula and were wiped out when the sun of that age was destroyed. Spanish friars recorded Tlaxcalans digging up enormous bones as proof, and Cortés was shown a femur the height of a man. A giant race that built the great monuments and was annihilated by a world-ending judgement is Genesis 6 told in Nahuatl.",
    source: "Fernando de Alva Ixtlilxóchitl, Historia de la nación chichimeca / Bernal Díaz del Castillo",
    images: ["https://thumb.wikimedia.org/wikipedia/commons/thumb/e/ed/Quinametzin.jpg/500px-Quinametzin.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"]
  },
  {
    id: "archaeology-fomorians",
    name: "The Fomorians - Tory Island, Donegal, Ireland",
    category: "Giants & Nephilim",
    type: "Point",
    coordinates: { lng: -8.235, lat: 55.265 },
    date: -2000,
    displayDate: "Mythic (Irish Mythological Cycle)",
    description: "Ireland's first monstrous race: sea-giants who held the island before the gods of the Tuatha Dé Danann, ruled from a glass tower on Tory Island by Balor of the evil eye, and were broken at the second battle of Moytura. The monks who wrote the lore down placed them, pointedly, as descendants of Ham after the Flood. A race of giants from across the sea, half-divine and hostile, defeated in a war of gods: it is the Nephilim story with an Atlantic accent.",
    source: "Lebor Gabála Érenn (Book of Invasions) / Cath Maige Tuired",
    images: ["https://thumb.wikimedia.org/wikipedia/commons/thumb/6/69/The_Fomors_-_Duncan_1912.png/500px-The_Fomors_-_Duncan_1912.png?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"]
  },
  {
    id: "archaeology-gigantes-pallene",
    name: "The Gigantes & the Gigantomachy - Pallene (Kassandra), Greece",
    category: "Giants & Nephilim",
    type: "Point",
    coordinates: { lng: 23.4, lat: 40.05 },
    date: -1200,
    displayDate: "Mythic (Greek)",
    description: "Born from the blood of the castrated Uranus falling on the Earth, the Gigantes rose against Olympus from the plain of Phlegra on the Pallene peninsula, hurling mountains until Heracles and the gods buried them under volcanoes. Classical writers said the giants' bones were still being dug out of Pallene. A race born of a divine wound, warring on heaven and entombed in the earth by a god: Hesiod and Genesis are telling the same story from two sides of the Mediterranean.",
    source: "Hesiod, Theogony / Apollodorus, Bibliotheca I.6 / Pausanias",
    images: ["https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e1/Poseidon_Polybotes_Cdm_Paris_573.jpg/1280px-Poseidon_Polybotes_Cdm_Paris_573.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"]
  },
  {
    id: "archaeology-daityas-mahabali",
    name: "The Daityas & King Mahabali - Thrikkakara, Kerala, India",
    category: "Giants & Nephilim",
    type: "Point",
    coordinates: { lng: 76.33, lat: 10.03 },
    date: -1500,
    displayDate: "Mythic (Vedic / Puranic)",
    description: "The Daityas, giant sons of the goddess Diti, are the asuras who fought the gods for the three worlds in the Puranas. The greatest of them, Mahabali, ruled so justly that Vishnu had to descend as a dwarf to trick him into surrendering heaven and earth and push him into the underworld with one foot. Kerala still celebrates his annual return at Onam. A righteous giant king, banished below by a god who came in disguise, is a figure the authors of Enoch would have recognised.",
    source: "Bhagavata Purana VIII / Vamana Purana",
    images: ["https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9d/MET_DP367896.jpg/1280px-MET_DP367896.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"]
  },
  {
    id: "archaeology-kap-dwa",
    name: "Kap Dwa, the Two-Headed Patagonian Giant - Baltimore, Maryland",
    category: "Giants & Nephilim",
    type: "Point",
    coordinates: { lng: -76.61, lat: 39.29 },
    date: 1673,
    displayDate: "1673 (capture legend) / displayed to present",
    description: "A twelve-foot mummified body with two heads, said to have been captured by Spanish sailors in Patagonia in 1673 and killed after he slew four of them, passed through Victorian sideshows and the Blackpool waxworks before ending up in a Baltimore curiosity museum. Sceptics call him a gaff of papier-mâché; owners point to the apparently real skin and teeth. Either way, Kap Dwa is what the European imagination did with the Patagonian giants Magellan's crew swore they had seen.",
    source: "Bob's Side Show, Baltimore / Blackpool Waxworks Records / Patagonian Giant Accounts (Pigafetta, 1520)",
    images: ["https://thumb.wikimedia.org/wikipedia/commons/thumb/1/11/Urville-Patagonians3.jpg/500px-Urville-Patagonians3.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"]
  },
  {
    id: "archaeology-gogmagog",
    name: "Gogmagog & the Giants of Albion - Plymouth Hoe, England",
    category: "Giants & Nephilim",
    type: "Point",
    coordinates: { lng: -4.142, lat: 50.364 },
    date: -1100,
    displayDate: "Mythic (c. 1100 BCE in Geoffrey of Monmouth)",
    description: "When Brutus of Troy landed in Britain it was inhabited only by giants; their chief, Gogmagog, twelve cubits tall, was wrestled by Corineus and thrown from the cliff at Plymouth Hoe, where chalk figures of the pair were cut into the turf and maintained until the seventeenth century. Geoffrey of Monmouth's giants of Albion were the island's original owners, and his name for their king is Ezekiel's Gog and Magog fused into one. Britain's founding legend is a giant-killing.",
    source: "Geoffrey of Monmouth, Historia Regum Britanniae (c. 1136) / Plymouth Corporation Records",
    images: ["https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d5/Gogmagog_the_Giant_in_Guildhall_1859.png/500px-Gogmagog_the_Giant_in_Guildhall_1859.png?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"]
  },
  {
    id: "archaeology-antaeus-tangier",
    name: "Antaeus, Giant of Libya - Tangier, Morocco",
    category: "Giants & Nephilim",
    type: "Point",
    coordinates: { lng: -5.81, lat: 35.78 },
    date: -1000,
    displayDate: "Mythic (Greek / Roman)",
    description: "Son of Poseidon and the Earth, Antaeus forced every traveller through Libya to wrestle him and roofed his father's temple with their skulls; he could not be beaten while he touched the ground, so Heracles lifted him into the air and crushed him. Plutarch records that the Roman general Sertorius opened the giant's tomb at Tangier and found a body sixty cubits long. Tangier's own founding legend says the city was built by his widow. The Romans believed the skeleton; the question is what they actually dug up.",
    source: "Plutarch, Life of Sertorius 9 / Apollodorus II.5.11",
    images: ["https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e1/Herakles_Antaios_Louvre_G103.jpg/1280px-Herakles_Antaios_Louvre_G103.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"]
  },
  {
    id: "archaeology-daidarabotchi",
    name: "Daidarabotchi, the Mountain-Making Giant - Mount Fuji, Japan",
    category: "Giants & Nephilim",
    type: "Point",
    coordinates: { lng: 138.73, lat: 35.36 },
    date: 721,
    displayDate: "Folklore (recorded 721 CE)",
    description: "A giant so large that in the Hitachi Fudoki of 721 he is said to have eaten clams from a hilltop and left shell-mounds behind; later tales have him carrying Mount Fuji on his back and leaving footprint-lakes across the Kanto plain. Japan's primordial giant is a landscape-shaper, like the Fomorians and the Jentilak, remembered where his feet fell. Every nation that forgot its giants kept the holes they left.",
    source: "Hitachi no Kuni Fudoki (721 CE) / Japanese Folklore Archives",
    images: ["https://thumb.wikimedia.org/wikipedia/commons/thumb/6/61/Daidarabocchi_1.jpg/330px-Daidarabocchi_1.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"]
  },
  {
    id: "archaeology-santa-elena-giants",
    name: "The Giants of Santa Elena (Cieza de León) - Santa Elena Peninsula, Ecuador",
    category: "Giants & Nephilim",
    type: "Point",
    coordinates: { lng: -80.86, lat: -2.23 },
    date: 1553,
    displayDate: "1553 (chronicle) / pre-Inca legend",
    description: "The conquistador-chronicler Pedro Cieza de León recorded in 1553 the native tradition that giants had landed at Point Santa Elena in reed boats, dug wells through solid rock that still gave sweet water, consumed the country's food and abused its people until a fiery angel destroyed them. He reported seeing teeth 'three fingers broad' and bones of enormous size dug from the point. A giant race arriving by sea, devouring the land, wiped out by fire from heaven: the same ending the Watchers' children got.",
    source: "Pedro Cieza de León, Crónica del Perú (1553), ch. 52 / Agustín de Zárate",
    images: ["https://thumb.wikimedia.org/wikipedia/commons/thumb/1/12/The_travels_of_Pedro_de_Cieza_de_Le%C3%B3n%2C_A._D._1532-50_-_contained_in_the_first_part_of_his_Chronicle_of_Peru_%28IA_gri_000033125008673861%29.pdf/page1-500px-The_travels_of_Pedro_de_Cieza_de_Le%C3%B3n%2C_A._D._1532-50_-_contained_in_the_first_part_of_his_Chronicle_of_Peru_%28IA_gri_000033125008673861%29.pdf.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail"]
  },
  {
    id: "archaeology-jentilak-aralar",
    name: "The Jentilak, Basque Giants of the Dolmens - Aralar Range, Basque Country",
    category: "Giants & Nephilim",
    type: "Point",
    coordinates: { lng: -2.0, lat: 43.0 },
    date: -3000,
    displayDate: "Folklore (dolmen builders, c. 3000 BCE)",
    description: "Basque tradition names the builders of the Pyrenean dolmens and cromlechs as the jentilak, pagan giants who hurled rocks between mountaintops, taught men to forge iron and grow wheat, and retreated under the earth when a luminous cloud announced the birth of Christ, leaving only Olentzero behind. The oldest surviving people of Europe remember the megalith-builders as giants who knew the sky was changing. The dolmens are still there; the Basques never claimed to have built them.",
    source: "José Miguel de Barandiarán, Basque Mythology Collections",
    images: ["https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4d/Lamina2.jpg/1280px-Lamina2.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"]
  },
  {
    id: "archaeology-emim-moab",
    name: "The Emim & Zamzummim of Moab - Kiriathaim, Jordan",
    category: "Giants & Nephilim",
    type: "Point",
    coordinates: { lng: 35.7, lat: 31.6 },
    date: -2000,
    displayDate: "c. 2000 BCE (Genesis 14 / Deuteronomy 2)",
    description: "Deuteronomy 2 records, almost in passing, that the plains of Moab and Ammon were held before Lot's descendants by the Emim and the Zamzummim, 'a people great, and many, and tall, as the Anakims,' giants whom the Lord destroyed so that Moab could have the land, just as He would destroy the Anakim before Israel. Genesis 14 has Chedorlaomer's coalition smiting the Emim at Shaveh-Kiriathaim. The Transjordan was giant country from Bashan to the Dead Sea, and the Bible treats their removal as a pattern.",
    source: "Deuteronomy 2:10-11, 20-21 / Genesis 14:5",
    images: ["https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d2/Kingdoms_around_Israel_830_map.svg/1280px-Kingdoms_around_Israel_830_map.svg.png?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"]
  },
  {
    id: "archaeology-cyclopes-etna",
    name: "The Cyclopes & Polyphemus - Mount Etna, Sicily",
    category: "Giants & Nephilim",
    type: "Point",
    coordinates: { lng: 15.0, lat: 37.75 },
    date: -800,
    displayDate: "Mythic (Homer, c. 800 BCE)",
    description: "One-eyed giants of two kinds: the three elder Cyclopes who forged Zeus's thunderbolt under Etna, and the lawless shepherd-giants of Homer who kept no assemblies and ate men, among them Polyphemus, blinded by Odysseus in his cave. The Sicilians showed the giant's cave and the rocks he threw. Dwarf-elephant skulls found in Sicilian caves, with a single nasal cavity in the forehead, are the mainstream explanation; the Greeks who found them had no doubt what they were looking at.",
    source: "Homer, Odyssey IX / Hesiod, Theogony / Othenio Abel (1914)",
    images: ["https://thumb.wikimedia.org/wikipedia/commons/thumb/c/cb/Head_of_a_Cyclops_Colosseum.jpg/330px-Head_of_a_Cyclops_Colosseum.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"]
  }
];
