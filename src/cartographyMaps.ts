// Historical map registry for the Cartography page. Shared with server.ts so that
// share-preview (OGP) metadata for ?mapId= links always matches what the page renders.

export interface HistoricalMap {
  id: string;
  name: string;
  year: string;
  description: string;
  url: string;
  thumbnailUrl?: string;
  aspectRatio: number;
  pinColor?: string;
  era: string;
  disableResolutionUpgrade?: boolean;
  highResUrl?: string;
  highResWidth?: number;
}

// High-resolution digital archives and Wikimedia collections
export const HISTORICAL_MAPS: HistoricalMap[] = [
  // ANCIENT
  {
    id: 'catalhoyuk',
    name: "Çatalhöyük Mural",
    year: "c. 6200 BCE",
    description: "A famous Neolithic wall painting from Çatalhöyük, Turkey, depicting a closely packed town layout of box-like houses in plan view, flanked by an erupting two-peaked volcano.",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Museum_of_Anatolian_Civilizations_%C3%87atalh%C3%B6y%C3%BCk_mural_City_or_Leopard_skin_Detail_in_2011_07.jpg/1280px-Museum_of_Anatolian_Civilizations_%C3%87atalh%C3%B6y%C3%BCk_mural_City_or_Leopard_skin_Detail_in_2011_07.jpg",
    aspectRatio: 1.4553,
    pinColor: '#74F8F3',
    era: 'ancient'
  },
  {
    id: 'babylonian',
    name: "Babylonian Map of the World",
    year: "c. 600 BC",
    description: "The oldest known map of the world, carved onto a clay tablet. It places Babylon at the center of the Euphrates, encircled by a ring of bitter waters and triangular outer islands.",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Map_of_the_World_from_Sippar%2C_Iraq%2C_6th_century_BCE._British_Museum.jpg/1280px-Map_of_the_World_from_Sippar%2C_Iraq%2C_6th_century_BCE._British_Museum.jpg",
    aspectRatio: 0.9202,
    pinColor: '#FFF96A',
    era: 'ancient'
  },
  {
    id: 'eratosthenes',
    name: "Eratosthenes' World Map",
    year: "c. 194 BCE",
    description: "A modern cartographical reconstruction of the ecumene according to Eratosthenes, introducing the system of parallels and meridians to measure the spherical Earth.",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Mappa_di_Eratostene.jpg/1280px-Mappa_di_Eratostene.jpg",
    aspectRatio: 1.6424,
    pinColor: '#FF5E97',
    era: 'ancient'
  },
  {
    id: 'ptolemy',
    name: "Ptolemy’s Geography",
    year: "c. 150 AD",
    description: "A classical Renaissance restoration of Claudius Ptolemy's geographical coordinates, showing the known world of the Roman Empire extending from Hibernia (Ireland) to China.",
    url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/23/PtolemyWorldMap.jpg/1280px-PtolemyWorldMap.jpg",
    aspectRatio: 1.4612,
    pinColor: '#FF5C5C',
    era: 'ancient'
  },
  {
    id: 'peutinger',
    name: "Peutinger Table",
    year: "c. 4th Century",
    description: "An incredibly elongated map showing the cursus publicus (Roman road network) spanning from southern Britain all the way to India, optimized for traveler itinerary rather than shape accuracy.",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/TabulaPeutingeriana.jpg/3840px-TabulaPeutingeriana.jpg",
    thumbnailUrl: "/images/peutinger_thumb.jpg",
    aspectRatio: 13.0612,
    pinColor: '#FF5E97',
    era: 'ancient'
  },
  // EARLY MEDIEVAL
  {
    id: 'albi',
    name: "Albi Mappa Mundi",
    year: "c. 8th Century",
    description: "One of the oldest surviving non-T-O style medieval world maps, preserved in the Albi Cathedral library, showing a horseshoe-shaped Mediterranean basin and surrounding lands.",
    url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/1/18/Mappa_mundi_dAlbi.png/960px-Mappa_mundi_dAlbi.png",
    aspectRatio: 0.8128,
    pinColor: '#B297FF',
    era: 'early-medieval'
  },
  {
    id: 'cotton',
    name: "Cotton World Map",
    year: "c. 1025",
    description: "An Anglo-Saxon world map representing the East at the top, displaying unique early political geography, mountain ranges, and biblical events.",
    url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f0/Cotton_world_map.jpg/1280px-Cotton_world_map.jpg",
    aspectRatio: 0.8224,
    pinColor: '#FF9F63',
    era: 'early-medieval'
  },
  {
    id: 'tabula-rogeriana',
    name: "Tabula Rogeriana",
    year: "1154",
    description: "Drawn by the Arab scholar Al-Idrisi for King Roger II of Sicily. It represented the most advanced geographical synthesis of the medieval world, oriented with South at the top.",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/TabulaRogeriana.jpg/1280px-TabulaRogeriana.jpg",
    aspectRatio: 2.2069,
    pinColor: '#B297FF',
    era: 'early-medieval'
  },
  {
    id: 'ebstorf-map',
    name: "Ebstorf Map",
    year: "c. 1239",
    description: "A monumental medieval world map, found in a convent at Ebstorf, depicting the Earth with Christ's body containing the entire creation (head at top, hands at sides, feet at bottom).",
    url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c4/Ebstorfer_Weltkarte_2.jpg/3840px-Ebstorfer_Weltkarte_2.jpg",
    aspectRatio: 1.006,
    pinColor: '#FFF96A',
    era: 'early-medieval'
  },
  {
    id: 'psalter',
    name: "Psalter Mappa Mundi",
    year: "c. 1260",
    description: "A detailed medieval miniature map from a psalter. It depicts the world inside a circular frame with Christ presiding above, flanked by angels.",
    url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7a/Psalter_world_map.jpg/1280px-Psalter_world_map.jpg",
    aspectRatio: 0.7838,
    pinColor: '#C0F06E',
    era: 'early-medieval'
  },
  {
    id: 'hereford',
    name: "Hereford Mappa Mundi",
    year: "c. 1300",
    description: "The largest surviving medieval European world map, displaying theological, geographical, and historical narratives in a circular frame centered on Jerusalem.",
    url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/92/Hereford_Mappa_Mundi.jpg/3840px-Hereford_Mappa_Mundi.jpg",
    aspectRatio: 0.8421,
    pinColor: '#59DCB7',
    era: 'early-medieval'
  },
  {
    id: 'framauro1459',
    name: "Fra Mauro Mappa Mundi (1459 CE)",
    year: "1459 CE",
    description: "Created in 1459 CE by Venetian monk and cartographer Fra Mauro at the Monastery of St. Michael in Murano, Venice. Commissioned by King Afonso V of Portugal, this circular planisphere represents the absolute pinnacle of medieval cartography. Oriented with South at the top, it integrates Portuguese maritime discoveries, Arab trade logs, and Marco Polo's Asian itineraries without adhering to traditional religious geography.",
    url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/97/Fra_Mauro_Map_FactumArte.jpg/1280px-Fra_Mauro_Map_FactumArte.jpg",
    aspectRatio: 1.0,
    pinColor: '#59DCB7',
    era: 'early-medieval'
  },
  {
    id: 'enochian-firmament',
    name: "Flammarion Engraving (The Firmament & Cosmology)",
    year: "1888 CE (Ancient Cosmology Model)",
    description: "First published in French astronomer and author Camille Flammarion's 1888 book 'L'atmosphère: météorologie populaire'. Executed as a wood engraving by an unknown artist (possibly under Flammarion's supervision), it depicts a medieval traveler kneeling at the horizon where Earth meets the sky. Poking his head beyond the hemispherical firmament dome, he beholds the wheeling mechanical gears, divine light, and multi-layered celestial spheres of cosmic creation, reflecting ancient Enochian, Hebrew, and classical cosmological models.",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Flammarion.jpg/1280px-Flammarion.jpg",
    aspectRatio: 1.33,
    pinColor: '#F7E8C1',
    era: 'ancient'
  },
  {
    id: 'celestial-planisphaerium',
    name: "Cellarius Celestial Star Map",
    year: "1660",
    description: "Andreas Cellarius' famous star map and celestial planisphere from the Harmonia Macrocosmica atlas, illustrating the Ptolemaic, Copernican, and Tycho Brahe planetary systems.",
    url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d4/Harmonia_Macrocosmica_Star_Atlas%2C_Andreas_Cellarius%2C1660.jpg/1280px-Harmonia_Macrocosmica_Star_Atlas%2C_Andreas_Cellarius%2C1660.jpg",
    aspectRatio: 1.18,
    pinColor: '#BACEF4',
    era: 'early-modern'
  },
  // LATE MEDIEVAL
  {
    id: 'catalan',
    name: "Catalan Atlas",
    year: "c. 1375",
    description: "The pinnacle of medieval cartography from the Majorcan school, drawn by Abraham Cresques. It illustrates the Silk Road, West African empires, and Marco Polo's travels.",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/1375_Atlas_Catalan_Abraham_Cresques.jpg/1280px-1375_Atlas_Catalan_Abraham_Cresques.jpg",
    aspectRatio: 1.8396,
    pinColor: '#FF5C5C',
    era: 'late-medieval'
  },
  {
    id: 'kangnido',
    name: "Kangnido Map",
    year: "1402",
    description: "An early Joseon-dynasty Korean map detailing East Asia, the Silk Road, India, and Africa, representing the collision of Western Islamic and Far Eastern Chinese cartographical findings.",
    url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b8/%ED%98%BC%EC%9D%BC%EA%B0%95%EB%A6%AC%EC%97%AD%EB%8C%80%EA%B5%AD%EB%8F%84%EC%A7%80%EB%8F%84_%281%29.JPG/1280px-%ED%98%BC%EC%9D%BC%EA%B0%95%EB%A6%AC%EC%97%AD%EB%8C%80%EA%B5%AD%EB%8F%84%EC%A7%80%EB%8F%84_%281%29.JPG",
    aspectRatio: 1.7813,
    pinColor: '#FFF96A',
    era: 'late-medieval',
    disableResolutionUpgrade: true
  },
  {
    id: 'bianco',
    name: "Andrea Bianco Map",
    year: "1436",
    description: "Venetian cartographer Andrea Bianco's circular world map from his portolan atlas, depicting the Atlantic islands, sailing lines, and early compass wind roses.",
    url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/99/Biancomap.jpg/500px-Biancomap.jpg",
    aspectRatio: 1.3060,
    pinColor: '#FF5E97',
    era: 'late-medieval'
  },
  {
    id: 'borgia',
    name: "Borgia World Map",
    year: "c. 1430",
    description: "A highly complex, non-theocentric map engraved on a circular copper plate, showing Asia, Europe, and Africa with mythological illustrations and kingdoms.",
    url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/eb/Mapa_de_Borgia_XV.jpg/3840px-Mapa_de_Borgia_XV.jpg",
    aspectRatio: 1.0,
    pinColor: '#74F8F3',
    era: 'late-medieval',
    disableResolutionUpgrade: true
  },
  // RENAISSANCE
  {
    id: 'waldseemuller',
    name: "Waldseemüller World Map",
    year: "1507",
    description: "Martin Waldseemüller's monumental map, the first to use the name 'America' and represent the New World as a separate landmass between the Atlantic and Pacific.",
    url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c0/Waldseemuller_map_2.jpg/3840px-Waldseemuller_map_2.jpg",
    aspectRatio: 1.7513,
    pinColor: '#FF5E97',
    era: 'renaissance'
  },
  {
    id: 'pirireis',
    name: "Piri Reis Map",
    year: "1513",
    description: "The surviving fragment of a world map compiled by Ottoman admiral Piri Reis, showcasing highly accurate coastlines of Western Europe, North Africa, and Brazil.",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Piri_reis_world_map_01.jpg/1280px-Piri_reis_world_map_01.jpg",
    aspectRatio: 0.75,
    pinColor: '#FF9F63',
    era: 'renaissance'
  },
  {
    id: 'orontius',
    name: "Orontius Finaeus Map",
    year: "1531",
    description: "A famous heart-shaped cordiform projection created by French mathematician Oronce Fine, depicting a massive, detailed Antarctic landmass centuries before its official discovery.",
    url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c9/Oronce_Fine_1531.jpg/1280px-Oronce_Fine_1531.jpg",
    aspectRatio: 1.3474,
    pinColor: '#B297FF',
    era: 'renaissance'
  },
  {
    id: 'ortelius',
    name: "Ortelius World Map",
    year: "1570",
    description: "Abraham Ortelius's landmark 'Typus Orbis Terrarum' world map, published as the opening plate of the first modern atlas, mapping Tartaria, the Americas, and speculative polar coastlines.",
    url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e2/OrteliusWorldMap1570.jpg/3840px-OrteliusWorldMap1570.jpg",
    aspectRatio: 1.4683,
    pinColor: '#FF5C5C',
    era: 'renaissance'
  },
  {
    id: 'ortelius1575',
    name: "Abraham Ortelius Map (1575)",
    year: "1575",
    description: "The 1575 edition of Abraham Ortelius's monumental 'Typus Orbis Terrarum' with contemporary French commentary ('Description universelle de tout le monde'), published during Ortelius's appointment as Royal Geographer to Philip II of Spain. It highlights Tartaria, the Straits of Anian, and the expansive Terra Australis Incognita.",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/Typus_orbis_terrarum_%28en_haut%29._Description_universelle_de_tout_le_monde_%28en_bas%29_-_btv1b84914964.jpg/3840px-Typus_orbis_terrarum_%28en_haut%29._Description_universelle_de_tout_le_monde_%28en_bas%29_-_btv1b84914964.jpg",
    aspectRatio: 1.4932,
    pinColor: '#FF9F63',
    era: 'renaissance'
  },
  {
    id: 'islandia',
    name: "Islandia (Map of Iceland)",
    year: "1585",
    description: "Abraham Ortelius's legendary engraving of Iceland, renowned for its vivid depictions of Mount Hekla erupting, polar bears on icebergs, and a massive array of fantastical sea monsters.",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/1591_map_of_Iceland_by_Abraham_Ortelius.jpg/3840px-1591_map_of_Iceland_by_Abraham_Ortelius.jpg",
    aspectRatio: 1.3853,
    pinColor: '#FFF96A',
    era: 'renaissance'
  },
  {
    id: 'urbanomonti',
    name: "Urbano Monti Planisphere",
    year: "1587",
    description: "The largest early world map known, drawn by Urbano Monti in Milan. Centered on the North Pole, it uses an advanced azimuthal equidistant projection and displays mythological creatures.",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/1587_Planisphere_Urbano_Monti_%2816th_century_Milan%2C_Italy%29.jpg/3840px-1587_Planisphere_Urbano_Monti_%2816th_century_Milan%2C_Italy%29.jpg",
    aspectRatio: 0.9987,
    pinColor: '#F7E8C1',
    era: 'renaissance'
  },
  {
    id: 'palazzofarnese',
    name: "Palazzo Farnese World Map",
    year: "1574",
    description: "The monumental world map fresco gracing the Sala del Mappamondo at Villa Farnese in Caprarola, Italy, painted by Giovanni Antonio da Varese. Renowned among alternative cartography researchers for its detailed depiction of Terra Australis Incognita connecting to southern landmasses prior to officially recorded Antarctic exploration.",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/World_map_-_Room_of_Maps_-_Villa_Farnese_-_Caprarola%2C_Italy_-_DSC02398.jpg/3840px-World_map_-_Room_of_Maps_-_Villa_Farnese_-_Caprarola%2C_Italy_-_DSC02398.jpg",
    aspectRatio: 1.5,
    pinColor: '#FF9F63',
    era: 'renaissance'
  },
  {
    id: 'kunyuwanguo',
    name: "Kunyu Wanguo Quantu",
    year: "1602",
    description: "The legendary 'Impossible Black Tulip' of cartography created by Jesuit scholar Matteo Ricci alongside Chinese collaborators Li Zhizao and Zhang Wentao in Beijing. Centering China at the heart of the world, this vast six-panel woodblock map reveals the Americas, Arctic channels, and enigmatic southern polar terrains with extensive classical Chinese cosmological inscriptions.",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Kunyu_Wanguo_Quantu_%28%E5%9D%A4%E8%BC%BF%E8%90%AC%E5%9C%8B%E5%85%A8%E5%9C%96%29.jpg/3840px-Kunyu_Wanguo_Quantu_%28%E5%9D%A4%E8%BC%BF%E8%90%AC%E5%9C%8B%E5%85%A8%E5%9C%96%29.jpg",
    aspectRatio: 2.2267,
    pinColor: '#ECCE81',
    era: 'renaissance'
  },
  {
    id: 'tartaria',
    name: "Map of Tartaria",
    year: "1606",
    description: "Jodocus Hondius's seminal engraving of the Great Empire of Tartary, detailing geographical regions, rivers, and cities spanning across Northern Asia and Russia.",
    url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e7/Tartaria_by_Jodocus_Hondius.jpg/3840px-Tartaria_by_Jodocus_Hondius.jpg",
    aspectRatio: 1.3904,
    pinColor: '#FF5E97',
    era: 'renaissance'
  },
  // MODERN
  {
    id: 'buache1753',
    name: "Buache’s Physical Planisphere",
    year: "1753 AD",
    description: "Philippe Buache's revolutionary physical planisphere depicting a central ice-free Antarctic ocean basin, subterranean water channels, and mountain chains linking the continents under early speculative physical geology.",
    url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b3/Buache1753Map.jpg/1920px-Buache1753Map.jpg",
    aspectRatio: 1.4617,
    pinColor: '#59DCB7',
    era: '18th-19th'
  },
  {
    id: 'middleton1892',
    name: "Middleton’s Pioneer Map of the World",
    year: "c. 1892 AD",
    description: "A famous 19th-century flat-earth planar cartography chart by Christopher Middleton depicting the world as an immovable plane, featuring ancient post-Diluvian migrations, biblical firmament circles, and polar projection lines.",
    url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/1/14/Middletons_pioneer_map_of_the_world%2C_%28as_a%3F%29_plane_and_immoveable_%288347346144%29.jpg/500px-Middletons_pioneer_map_of_the_world%2C_%28as_a%3F%29_plane_and_immoveable_%288347346144%29.jpg",
    aspectRatio: 1.0582,
    pinColor: '#C0F06E',
    era: '18th-19th',
    disableResolutionUpgrade: true
  },
  {
    id: 'gleason',
    name: "Gleason's New Standard Map",
    year: "1892",
    description: "An azimuthal equidistant projection showing the world flattened as a disk, surrounded by an ice wall. Heavily cited in flat earth and esoteric cartography models.",
    url: "https://iiif.digitalcommonwealth.org/iiif/2/commonwealth:7h149v867/full/4000,/0/default.jpg",
    aspectRatio: 0.7025,
    pinColor: '#C0F06E',
    era: 'modern'
  },
  {
    id: 'ferguson-flat-earth',
    name: "Ferguson's Square and Stationary Earth Map",
    year: "1893",
    description: "Professor Orlando Ferguson's highly elaborate cosmology diagram asserting the Earth is a square, stationary basin with a central concave globe, citing numerous Biblical texts.",
    url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d3/Map_of_the_square_and_stationary_earth_-_four_hundred_passages_in_the_Bible_that_condemn_the_Globe_Theory%2C_or_the_Flying_Earth%2C_and_none_sustain_it_%3B_this_map_is_the_Bible_map_of_the_world_LOC_2011594831.jpg/3840px-thumbnail.jpg",
    aspectRatio: 1.4494,
    pinColor: '#b6a6ff',
    era: 'modern'
  },
  {
    id: 'winkeltripel',
    name: "Winkel Tripel Projection",
    year: "1921",
    description: "A low-distortion world map projection designed by Oswald Winkel, balancing size and conformal distortions. It was adopted as the standard world map of the National Geographic Society.",
    url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/91/Winkel_triple_projection_SW.jpg/1280px-Winkel_triple_projection_SW.jpg",
    aspectRatio: 1.6307,
    pinColor: '#FF5C5C',
    era: 'modern'
  },
  {
    id: 'goode',
    name: "Goode Homolosine Map",
    year: "1923",
    description: "An interrupted, equal-area pseudocylindrical projection designed by J. Paul Goode to minimize continental shape distortion by dividing ocean sections.",
    url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f2/Goode_homolosine_projection_SW.jpg/1280px-Goode_homolosine_projection_SW.jpg",
    aspectRatio: 2.2867,
    pinColor: '#FF5E97',
    era: 'modern'
  },
  {
    id: 'robinson',
    name: "Robinson Projection",
    year: "1963",
    description: "A compromise map projection developed by Arthur H. Robinson, designed to present a visually balanced representation of the entire world with mild distortions across all metrics.",
    url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/96/Robinson_projection_SW.jpg/1280px-Robinson_projection_SW.jpg",
    aspectRatio: 1.6288,
    pinColor: '#B297FF',
    era: 'modern'
  },
  {
    id: 'gallpeters',
    name: "Gall-Peters Projection",
    year: "1973",
    description: "An equal-area cylindrical projection map that presents landmasses in their correct relative proportions, reducing the high-latitude enlargement seen in Mercator maps.",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Gall%E2%80%93Peters_projection_SW.jpg/1280px-Gall%E2%80%93Peters_projection_SW.jpg",
    aspectRatio: 1.5662,
    pinColor: '#FF9F63',
    era: 'modern'
  },
  // SPECULATIVE
  {
    id: 'pangaea',
    name: "Pangea Politica Map",
    year: "Modern (335M BC)",
    description: "A detailed scientific and political reconstruction by Massimo Pietrobon mapping modern country borders onto the prehistoric supercontinent of Pangaea.",
    url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c3/Pangea_political.jpg/1280px-Pangea_political.jpg",
    aspectRatio: 1.0082,
    pinColor: '#FF5E97',
    era: 'speculative'
  },
  {
    id: 'rodinia',
    name: "Rodinia Reconstruction",
    year: "Modern (900M BC)",
    description: "A paleogeographic reconstruction of the prehistoric supercontinent Rodinia, which assembled prior to Pangaea during the Neoproterozoic era.",
    url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5a/Rodinia_900Ma.jpg/500px-Rodinia_900Ma.jpg",
    aspectRatio: 1.0000,
    pinColor: '#FFF96A',
    era: 'speculative'
  },
  {
    id: 'atlantis',
    name: "Kircher's Atlantis",
    year: "1669",
    description: "German scholar Athanasius Kircher's speculative map of the lost island continent of Atlantis, featured in 'Mundus Subterraneus' and oriented with South at the top.",
    url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/dd/Atlantis_Kircher_Mundus_subterraneus_1678.jpg/1280px-Atlantis_Kircher_Mundus_subterraneus_1678.jpg",
    aspectRatio: 1.5039,
    pinColor: '#74F8F3',
    era: 'speculative'
  },
  {
    id: 'hyperborea',
    name: "Mercator's Hyperborea",
    year: "1595",
    description: "Gerardus Mercator's Arctic projection map showcasing a speculative polar landmass divided by four massive channels, centered on a black rock magnetic mountain (Rupes Nigra).",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Gerardus_Mercator%2C_Septentrionalium_terrarum_descriptio_%28FL37810599_3148101%29.jpg/3840px-Gerardus_Mercator%2C_Septentrionalium_terrarum_descriptio_%28FL37810599_3148101%29.jpg",
    aspectRatio: 1.2084,
    pinColor: '#B297FF',
    era: 'speculative'
  },
  {
    id: 'chart-of-hell',
    name: "Chart of Hell (La Carte de l'Enfer)",
    year: "c. 1480",
    description: "Sandro Botticelli's detailed and terrifying depiction of the underworld, illustrating the nine concentric circles of Dante's Inferno, tapering to Lucifer at the center of the earth.",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Sandro_Botticelli_-_La_Carte_de_l%27Enfer.jpg/1280px-Sandro_Botticelli_-_La_Carte_de_l%27Enfer.jpg",
    aspectRatio: 1.4319,
    pinColor: '#D3C5FB',
    era: 'speculative'
  },
  {
    id: 'sigillum',
    name: "Sigillum Dei Æmeth (Seal of Truth)",
    year: "c. 1582",
    description: "John Dee's complex Enochian cosmology seal, representing the cosmic order, names of angels, and mystical dimensions of the universe revealed to him and Edward Kelley.",
    url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/dc/Sigillum_Dei_%C3%86meth.jpg/500px-Sigillum_Dei_%C3%86meth.jpg",
    aspectRatio: 1.5000,
    pinColor: '#FF9F63',
    era: 'speculative'
  },
  {
    id: 'hebrew-cosmology',
    name: "Early Hebrew Cosmology Diagram",
    year: "Modern Reconstruction",
    description: "A diagrammatic representation of ancient biblical cosmology, featuring the dome firmament, the waters above and below, the pillars of the earth, and the underworld of Sheol.",
    url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/ba/Early_Hebrew_Conception_of_the_Universe.png/500px-Early_Hebrew_Conception_of_the_Universe.png",
    aspectRatio: 1.0964,
    pinColor: '#90C2FF',
    era: 'speculative'
  },
  {
    id: 'nuremberg-1493',
    name: "Nuremberg Chronicle World Map",
    year: "1493",
    description: "Hartmann Schedel's world map from the Nuremberg Chronicle, printed a year after Columbus sailed, is held at its corners by Shem, Ham and Japheth, the sons of Noah who repopulated the earth. Down its left margin march the monstrous races: dog-headed men, one-footed sciapods, headless Blemmyes with faces in their chests. The last great world picture of the age before the Americas still drew the world as the Bible described it: three continents for three brothers, with the Nephilim's strange children pushed to the edges.",
    url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b5/1493_map_of_the_world_by_Hartmann_Schedel.jpg/3840px-1493_map_of_the_world_by_Hartmann_Schedel.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    aspectRatio: 1.3079,
    pinColor: '#FF9F63',
    era: 'late-medieval'
  },
  {
    id: 'kircher-flood-1675',
    name: "Kircher's World After the Flood (Arca Noë)",
    year: "1675",
    description: "From Athanasius Kircher's 'Arca Noë': a geographical map of the world as it stood when the Flood receded, with Atlantis still shown off the coast of the Americas and the mountains of Ararat at the centre of the new world. Kircher, a Jesuit who treated Genesis as a survey report, plotted the dispersion of Noah's sons across the continents. The map asks the question modern geology refuses to: what did the coastlines look like before the waters came?",
    url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/fc/Arca_Noe%2C_geography_of_world_after_flood%2C_by_A._Kircher._Wellcome_L0013366.jpg/1280px-Arca_Noe%2C_geography_of_world_after_flood%2C_by_A._Kircher._Wellcome_L0013366.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    aspectRatio: 1.3976,
    pinColor: '#59DCB7',
    era: 'renaissance'
  },
  {
    id: 'moon-flammarion-1887',
    name: "Flammarion-Gaudibert General Map of the Moon",
    year: "1887",
    description: "A monumental lunar chart compiled by Casimir Gaudibert from his own observations, drawn by Léon Fenet and published under Camille Flammarion, the astronomer who popularised the plurality of inhabited worlds. Every crater, ridge and 'sea' is named as the nineteenth century saw them, before any probe had flown. Flammarion believed the Moon had been alive once; his map is a portrait of a dead world made by men who thought it might not be.",
    url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c3/Carte_g%C3%A9n%C3%A9rale_de_la_lune_-_dress%C3%A9e_sous_la_direction_de_Camille_Flammarion_%3B_par_C.-M._Gaudibert_%3B_dessin%C3%A9e_par_L%C3%A9on_Fenet_-_btv1b52505506n.jpg/3840px-Carte_g%C3%A9n%C3%A9rale_de_la_lune_-_dress%C3%A9e_sous_la_direction_de_Camille_Flammarion_%3B_par_C.-M._Gaudibert_%3B_dessin%C3%A9e_par_L%C3%A9on_Fenet_-_btv1b52505506n.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    aspectRatio: 0.7753,
    pinColor: '#B297FF',
    era: 'modern'
  },
  {
    id: 'palestine-time-of-christ',
    name: "Palestine in the Time of Christ (Coleman Bible Atlas)",
    year: "c. 1854",
    description: "Lyman Coleman's atlas map of the Holy Land as it was under Herod's sons and Pilate: Galilee, Samaria, Judaea and the Decapolis, with Capernaum, Nazareth, Bethany, Jericho and the roads between them on which the Gospels unfold. This is the ground Jesus walked, drawn for the family Bibles of the nineteenth century so that readers could follow the ministry town by town. Use it with the Biblical Figures layer to trace the journeys.",
    url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/58/Lyman_Coleman%2C_Map_of_Palestine_in_the_time_of_Christ_%28FL35476936_3803117%29.jpg/3840px-Lyman_Coleman%2C_Map_of_Palestine_in_the_time_of_Christ_%28FL35476936_3803117%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    aspectRatio: 0.6908,
    pinColor: '#90C2FF',
    era: 'modern'
  },
  {
    id: 'exodus-sinai-1873',
    name: "The Exodus & the Sinai Wanderings",
    year: "1873",
    description: "An 1873 map of the Sinai Peninsula tracing the route of the Israelites out of Egypt: the crossing of the sea, the bitter waters of Marah, the giving of the Law at the mountain, Kadesh-Barnea and the forty years of wandering. Where exactly the sea parted and which peak is the true Sinai are still fought over, with Jebel al-Lawz in Arabia the modern contender. The Victorian surveyors who drew this map walked the wadis with the book open.",
    url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/8a/The_desert_of_the_Exodus_-_journeys_on_foot_in_the_wilderness_of_the_forty_years%27_wanderings_-_undertaken_in_connexion_with_the_ordnance_survey_of_Sinai_%28IA_desertofexodusjo02palmuoft%29.pdf/page1-500px-thumbnail.pdf.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    aspectRatio: 0.8338,
    pinColor: '#91FFC4',
    era: 'modern'
  },
  {
    id: 'dunhuang-star-chart',
    name: "Dunhuang Star Chart",
    year: "c. 700 CE",
    description: "The oldest complete star atlas in the world, found in 1907 among the sealed manuscripts of the Mogao Caves at Dunhuang and now in the British Library. Over 1,300 stars in 257 Chinese asterisms are drawn on a scroll in a projection Europe would not reinvent for nine centuries. The Tang astrologers who made it read the heavens as a court of celestial officials; the sky, to them, was a government.",
    url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/42/Dunhuang_star_map.jpg/1920px-Dunhuang_star_map.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    aspectRatio: 0.9963,
    pinColor: '#FFF96A',
    era: 'early-medieval'
  },
  {
    id: 'azimuthal-equidistant-flat',
    name: "Azimuthal Equidistant 'Flat Earth' Projection",
    year: "Modern (UN emblem basis)",
    description: "The north-polar azimuthal equidistant projection: the Arctic at the centre, the continents fanning outward, Antarctica stretched into an ice wall around the rim. It is the projection on the flag of the United Nations and the map favoured by every flat-earth model from Gleason's 1892 'New Standard Map' onward. Whether you read it as a convenient projection or as the true shape of the world, it is worth knowing that the UN chose it for the whole globe's emblem.",
    url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/ec/Azimuthal_equidistant_projection_SW.jpg/1920px-Azimuthal_equidistant_projection_SW.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    aspectRatio: 1.0,
    pinColor: '#FF5C5C',
    era: 'modern'
  },
  {
    id: 'carto-paul-journeys',
    name: "Travels of St. Paul in the Roman Empire",
    year: "1st century AD (map c. 1850)",
    description: "The three missionary journeys and the voyage to Rome from Acts 13-28, traced across the Roman roads and sea lanes of Asia Minor, Greece and Italy: Antioch, Cyprus, Galatia, Philippi, Thessalonica, Athens, Corinth, Ephesus, the shipwreck on Malta and the Appian Way into Rome. Every church that received an epistle is a pin on this map, and every one of them sits on a known Roman site. The apostle covered roughly 10,000 miles on foot and by ship.",
    url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/1/18/Biblica_Open_Bible_Map_16_17_Paul_missionary_journeys_map.png/1280px-Biblica_Open_Bible_Map_16_17_Paul_missionary_journeys_map.png?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    aspectRatio: 1.458,
    pinColor: '#F7E8C1',
    era: 'ancient'
  },
  {
    id: 'carto-twelve-tribes',
    name: "The Twelve Tribes of Israel - Allotment of Canaan",
    year: "c. 1400 BC (map 19th century)",
    description: "Joshua's division of the Promised Land by lot (Joshua 13-21): Judah and Simeon in the south, Ephraim and Manasseh in the hill country, Dan pushed up to the far north, Reuben, Gad and half of Manasseh across the Jordan, and Levi scattered among 48 cities. The boundaries matter for prophecy - Ezekiel 48 re-divides the land in parallel strips for the Millennium, and the ten northern tribes carried into Assyria in 722 BC are the 'lost tribes' that everyone from British Israelites to Mormons has claimed to be.",
    url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/99/Biblica_Open_Bible_Map_05_The_Twelve_Tribes_of_Israel.png/1280px-Biblica_Open_Bible_Map_05_The_Twelve_Tribes_of_Israel.png?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    aspectRatio: 0.67,
    pinColor: '#91FFC4',
    era: 'ancient'
  },
  {
    id: 'enochian-cosmos-map',
    name: "The Enochian Cosmos (Early Hebrew Conception of the Universe)",
    year: "c. 300 BCE (diagram 1908)",
    description: "The cosmos as the Torah, Job and 1 Enoch describe it, drawn out by the biblical scholars of the early 1900s: a flat earth on pillars over Sheol and the great deep, the solid firmament (raqia) with its windows and storehouses of snow, hail and wind, the waters above, the sun and moon running their courses beneath the dome and entering through its gates, and the heaven of heavens above all. Compare it with 1 Enoch 72-82 (the twelve portals), 2 Enoch's ten stacked heavens and 3 Enoch's seven palaces. Every ancient map on this page was drawn on this model; the Babylonian Map of the World is the same picture from above.",
    url: "https://upload.wikimedia.org/wikipedia/commons/b/ba/Early_Hebrew_Conception_of_the_Universe.png",
    aspectRatio: 1.0964,
    pinColor: '#C77DFF',
    era: 'speculative'
  }
];
