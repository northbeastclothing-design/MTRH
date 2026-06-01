export interface ArchaeologicalFind {
  id: string;
  name: string;
  category: 'Archaeological Finds' | 'Biblical Finds';
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
    category: "Archaeological Finds",
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
    category: "Archaeological Finds",
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
    category: "Archaeological Finds",
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
    category: "Archaeological Finds",
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
    category: "Archaeological Finds",
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
    category: "Archaeological Finds",
    type: "Point",
    coordinates: { lng: 25.1631, lat: 35.2978 }, // Crete, Greece
    date: -1900,
    displayDate: "c. 1900 BC (Excavated 1900 AD)",
    description: "The monumental ruins of Knossos Palace represent the political and cultural heart of the Bronze Age Minoan civilization. Sir Arthur Evans' excavations uncovered columns, frescoes, and a sprawling layout that historical traditions connect to the mythic Labyrinth of King Minos and the Minotaur.",
    source: "Hellenic Ministry of Culture",
    images: ["https://upload.wikimedia.org/wikipedia/commons/5/5b/Palace_of_Knossos.jpg"]
  },

  // ==================== BIBLICAL FINDS ====================
  {
    id: "archaeology-shroud-of-turin",
    name: "The Shroud of Turin",
    category: "Biblical Finds",
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
    category: "Biblical Finds",
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
    category: "Biblical Finds",
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
    category: "Biblical Finds",
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
    category: "Biblical Finds",
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
    category: "Biblical Finds",
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
    category: "Biblical Finds",
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
    category: "Biblical Finds",
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
    category: "Biblical Finds",
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
    category: "Biblical Finds",
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
    category: "Biblical Finds",
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
    category: "Biblical Finds",
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
    category: "Biblical Finds",
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
    category: "Biblical Finds",
    type: "Point",
    coordinates: { lng: 35.5752, lat: 32.8812 }, // Capernaum, Israel
    date: 50,
    displayDate: "1st Century AD (Excavated 1968 AD)",
    description: "A first-century residential house in Capernaum, over which an early Christian octagonal church was later built in the 5th century. Early graffiti scratched into the plaster of the house walls mentions Jesus, Peter, and Christian symbols, supporting the historic tradition that this was the home of Simon Peter.",
    source: "Capernaum Archaeological Excavations",
    images: ["https://upload.wikimedia.org/wikipedia/commons/8/86/Capernaum%2C_Israel_10.jpg"]
  }
];
