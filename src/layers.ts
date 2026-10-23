// Layer registry: colours, icons, category blurbs and LiDAR overlays. Moved verbatim out of App.tsx.

export const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  'Enochian Sites': 'Geographical locations, portals of descent, and prisons of the fallen Watchers as detailed in the Book of Enoch.',
  'Giants & Nephilim': 'Newspaper articles about finding the bones of ancient biblical giants, horned humanoids, cyclops and more.',
  'Biblical Figures': 'Geographical tracking and historical sites associated with biblical patriarchs, prophets, and key lineage figures.',
  'Biblical Events': 'Key geographical milestones and historical events from biblical history, including the Exodus, the Fall of Jericho, and the Crucifixion.',
  'UFOs - Sightings': 'Reports of unidentified flying objects and UAP encounters across the globe.',
  'UFOs - War.gov': 'Official declassified records, sensor videos, and multimedia releases from government archives documenting unidentified aerial phenomena.',
  'UFOs - Brazillian Archives': 'Declassified Brazilian military documents, reports, and drawings detailing unexplained aerial phenomena and entity encounters compiled from official archives.',
  'D.U.M.B.\'s': 'Deep Underground Military Bases and mysterious subterranean government facilities.',
  'Cryptid Sightings': 'Encounters with legendary creatures whose existence has yet to be scientifically proven.',
  'Giants': 'Historical and archaeological accounts of unusually large skeletal remains.',
  'Megaliths / Structures': 'Colossal stone circles, dolmens, standing stones, and ancient temples of unknown origin.',

  'Rock Art & Cave Paintings': 'Ancient rock carvings, petroglyphs, and cave paintings depicting entities, celestial events, or forgotten symbols.',
  'Ancient Texts': 'Lost manuscripts, carvings, and inscriptions carrying forbidden or forgotten knowledge.',
  'Bigfoot Sightings': 'Tracking the elusive Sasquatch through forests and wilderness sightings.',
  'Blurred on Google Maps': 'Locations deliberately obscured or censored by satellite imaging providers.',
  'Burial Mounds': 'Ancient earthworks and ceremonial mounds marking the resting places of unknown civilizations.',
  'Dolmans': 'Mysterious single-chamber megalithic tombs consisting of massive upright stones.',
  'Underworld Entrances': 'Purported Entrances to the Underworld from lore, legends, and modern times.',
  'Portals / Stargates': 'Purported or speculative stargates, portals, and interdimensional gateways documented in ancient lore, modern whistleblower accounts, and anomalous zones.',
  'Particle Accelerators': 'A directory of high-energy particle accelerators designed to facilitate high-energy physics research and space-time anomaly studies.',
  'Ghosts & Hauntings': 'Areas reported to have high levels of paranormal activity and spectral apparitions.',
  'National Parks & Reserves': 'The intersection of vast wilderness and unexplained disappearances.',
  'Missing 411': 'Mysterious disappearances of people in national parks and wilderness areas documented by David Paulides.',
  'Cave Systems': 'USGS documented locations of caves, caverns, grottos, and sinkholes.',
  'Alien Abductions': 'Documentation of major reported extraterrestrial abduction cases and close encounters.',
  'Alien Sightings': 'Visual records, photographs, footage, and encounter evidence of extraterrestrial and anomalous entities, including analyzed and debunked cases.',
  'Cattle Mutilations': 'Reports of unexplained livestock deaths characterized by bloodless surgical-like tissue removal and a lack of tracks.',
  'Old World Structures': 'Famous castles, medieval strongholds, royal fortresses, and grand old-world architectural marvels across the globe.',
  'Crop Circles': 'Intricate patterns appearing in fields, often appearing overnight with no clear earthly explanation.',
  'Meteor Impact Craters': 'Confirmed impact structures on Earth created by ancient meteorite collisions, marking catastrophic cosmic encounters throughout geological history.',
  'Archaeological Finds': 'Remarkable historical excavations, lost citadels, and ancient artifacts rewriting human origin timelines.',
  'Biblical Discoveries': 'Archaeological discoveries, inscriptions, and sacred sanctuaries validating accounts from biblical history.',
  'Ancient People Groups': 'Ancient Mesoamerican civilizations, Native American tribes, and lost people groups of antiquity.',
  'Religion': 'Scriptural records, sacred sanctuaries, angelic hierarchies, canonical and apocryphal traditions.',
  'Masonic Lodges': 'Historic Masonic temples, esoteric lodges, secret societies, and fraternity headquarters across the world.',
  'Myths / Legends': 'Ancient pantheons, legendary sagas, mythical beasts, and hero epics from world civilizations.',
  'Ley Lines': 'Telluric energy currents, ancient alignments, sacred geometric axes, and planetary grid nodes.',
  'Government Conspiracies': 'Declassified military operations, black budget projects, covert intelligence programs, and hidden agendas.',
  'NASA / Space': 'Civilian aerospace achievements, space program launch sites, historical milestones, and lunar exploration missions.',
  'The Occult': 'Hermeticism, alchemy, esoteric rituals, grimoires, and hidden mystical traditions through the ages.',
  'Supernatural / Anomalies': 'Extraterrestrial encounters, cryptid sightings, localized hauntings, portal gateways, and cosmic space-time anomalies.'
};

export const LAYER_CONFIG: Record<string, { color: string; icon: string }> = {
  'UFOs - War.gov': { color: '#FF9BE1', icon: '/icons/icon-ufo-wargov.svg' },
  'UFOs - Brazillian Archives': { color: '#B297FF', icon: '/icons/icon-ufo-brazilian.svg' },
  'Enochian Sites': { color: '#FF9F63', icon: '/icons/icon-enochian-lore.svg' },
  'Giants & Nephilim': { color: '#ECCE81', icon: '/icons/icon-giants.svg' },
  'Biblical Figures': { color: '#90C2FF', icon: '/icons/icon-biblical-bloodlines.svg' },
  'Religion': { color: '#90C2FF', icon: '/icons/icon-religion.svg' },
  'Masonic Lodges': { color: '#ECCE81', icon: '/icons/icon-masonic-lodges.svg' },
  'Particle Accelerators': { color: '#90E9FF', icon: '/icons/icon-cern.svg' },
  'Myths / Legends': { color: '#FFF96A', icon: '/icons/icon-greek-mythology.svg' },
  'Biblical Events': { color: '#91FFC4', icon: '/icons/icon-biblical-bloodlines-1.svg' },
  'UFOs - Sightings': { color: '#C2FFBD', icon: '/icons/icon-ufo-sightings.svg' },
  'Bigfoot Sightings': { color: '#C6986D', icon: '/icons/icon-bigfoot-sightings.svg' },
  'Cryptid Sightings': { color: '#AFFFEC', icon: '/icons/icon-cryptid-sightings.svg' },
  'Underworld Entrances': { color: '#D3C5FB', icon: '/icons/icon-entrances-to-underworld.svg' },
  'Portals / Stargates': { color: '#F9B6DB', icon: '/icons/icon-portals.svg' },
  'Ancient Texts': { color: '#F7E8C1', icon: '/icons/icon-ancient-texts.svg' },
  'Burial Mounds': { color: '#B3C77B', icon: '/icons/icon-burial-mounds.svg' },
  'Cave Systems': { color: '#B9BDAD', icon: '/icons/icon-caves.svg' },
  'Alien Abductions': { color: '#C0F06E', icon: '/icons/icon-alien.svg' },
  'Alien Sightings': { color: '#90E9FF', icon: '/icons/icon-alien-sightings.svg' },
  'Cattle Mutilations': { color: '#D59CF1', icon: '/icons/icon-cow.svg' },
  'Crop Circles': { color: '#FFF96A', icon: '/icons/icon-crop-circles.svg' },
  'D.U.M.B.\'s': { color: '#BAEAF4', icon: '/icons/icon-dumbs.svg' },
  'Ghosts & Hauntings': { color: '#BDC4FF', icon: '/icons/icon-ghosts.svg' },
  'Megaliths / Structures': { color: '#FFFBA6', icon: '/icons/icon-megaliths.svg' },
  'Old World Structures': { color: '#B5CED5', icon: '/icons/icon-old-world-structures.svg' },
  'Vanished Ships / Aircraft': { color: '#E7EC5B', icon: '/icons/icon-vanished-ships-aircraft.svg' },

  'Rock Art & Cave Paintings': { color: '#FFABA6', icon: '/icons/icon-petroglyphs.svg' },
  'National Parks & Reserves': { color: '#9FF3BC', icon: '/icons/icon-national-parks-reserves.svg' },
  'Missing 411': { color: '#CBDF8E', icon: '/icons/icon-missing-411.svg' },
  'Blurred on Google Maps': { color: '#BDC4FF', icon: '/icons/icon-blurred-on-google.svg' },
  'Meteor Impact Craters': { color: '#FF9F63', icon: '/icons/icon-meteors.svg' },
  'Ley Lines': { color: '#FF5E97', icon: '/icons/icon-ley-lines.svg' },
  'Archaeological Finds': { color: '#74F8F3', icon: '/icons/icon-archaeological-finds.svg' },
  'Biblical Discoveries': { color: '#D49459', icon: '/icons/icon-biblical-discoveries.svg' },
  'Government Conspiracies': { color: '#FF5C5C', icon: '/icons/icon-government-conspiracies.svg' },
  'NASA / Space': { color: '#BACEF4', icon: '/icons/icon-nasa.svg' },
  'The Occult': { color: '#59DCB7', icon: '/icons/icon-alchemy-occult.svg' },
  'Ancient People Groups': { color: '#BCA7C7', icon: '/icons/icon-people-groups.svg' },
  'Data Centers': { color: '#90E9FF', icon: '/icons/icon-cern.svg' },
  'Default': { color: '#b6a6ff', icon: '/icons/icon-map-pin.svg' }
};

export interface ArchaeologicalLidarOverlay {
  id: string;
  name: string;
  url: string;
  coordinates: [number, number][];
}

// Registry for high-definition 1-meter archaeological LiDAR overlays with seamless feathered blending
export const ARCHAEOLOGICAL_LIDAR_OVERLAYS: ArchaeologicalLidarOverlay[] = [
  {
    id: 'alligator-mound-lidar',
    name: 'Alligator Mound - Granville, Ohio',
    url: '/images/alligator-mound-lidar.png',
    coordinates: [
      [-82.50400678013773, 40.072096397058615],
      [-82.4981450570968, 40.072172364734875],
      [-82.49804637763714, 40.06766906112823],
      [-82.50390771493355, 40.0675931054928]
    ]
  },
  {
    id: 'newark-great-circle-lidar',
    name: 'Newark Earthworks - Great Circle',
    url: '/images/newark-great-circle-lidar.png',
    coordinates: [
      [-82.43520691847219, 40.04366234648612],
      [-82.42770679611519, 40.043755021951064],
      [-82.42758654858949, 40.0379905829329],
      [-82.43508603978145, 40.037897926273494]
    ]
  },
  {
    id: 'newark-octagon-lidar',
    name: 'Newark Earthworks - Octagon & Observatory',
    url: '/images/newark-octagon-lidar.png',
    coordinates: [
      [-82.45508892990398, 40.05972100589692],
      [-82.43985082698647, 40.05991142146049],
      [-82.43960439281553, 40.04820249335739],
      [-82.45483988992332, 40.0480121562636]
    ]
  },
  {
    id: 'serpent-mound-lidar',
    name: 'Great Serpent Mound - Peebles, Ohio',
    url: '/images/serpent-mound-lidar.png',
    coordinates: [
      [-83.4326657882106, 39.027274653784055],
      [-83.42817421178938, 39.027274653784055],
      [-83.42817421178938, 39.02378530315617],
      [-83.4326657882106, 39.02378530315617]
    ]
  }
];
