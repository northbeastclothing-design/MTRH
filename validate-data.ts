import { TERM_TREE_DATA } from './src/termTreeData';

const LAYER_ICONS: Record<string, string> = {
  'UFOs - War.gov': '/icons/icon-ufo-wargov.svg',
  'UFOs - Brazillian Archives': '/icons/icon-ufo-brazilian.svg',
  'Enochian Sites': '/icons/icon-enochian-lore.svg',
  'Giants & Nephilim': '/icons/icon-giants.svg',
  'Biblical Figures': '/icons/icon-biblical-bloodlines.svg',
  'Religion': '/icons/icon-religion.svg',
  'Masonic Lodges': '/icons/icon-alchemy-occult.svg',
  'Particle Accelerators': '/icons/icon-cern.svg',
  'Myths / Legends': '/icons/icon-greek-mythology.svg',
  'Biblical Events': '/icons/icon-biblical-bloodlines-1.svg',
  'UFOs - Sightings': '/icons/icon-ufo-sightings.svg',
  'Bigfoot Sightings': '/icons/icon-bigfoot-sightings.svg',
  'Cryptid Sightings': '/icons/icon-cryptid-sightings.svg',
  'Underworld Entrances': '/icons/icon-entrances-to-underworld.svg',
  'Portals / Stargates': '/icons/icon-portals.svg',
  'Ancient Texts': '/icons/icon-ancient-texts.svg',
  'Burial Mounds': '/icons/icon-burial-mounds.svg',
  'Cave Systems': '/icons/icon-caves.svg',
  'Alien Abductions': '/icons/icon-alien.svg',
  'Cattle Mutilations': '/icons/icon-cow.svg',
  'Crop Circles': '/icons/icon-crop-circles.svg',
  "D.U.M.B.'s": '/icons/icon-dumbs.svg',
  'Ghosts & Hauntings': '/icons/icon-ghosts.svg',
  'Megaliths / Structures': '/icons/icon-megaliths.svg',
  'Rock Art & Cave Paintings': '/icons/icon-petroglyphs.svg',
  'National Parks & Reserves': '/icons/icon-national-parks-reserves.svg',
  'Missing 411': '/icons/icon-missing-411.svg',
  'Blurred on Google Maps': '/icons/icon-blurred-on-google.svg',
  'Meteor Impact Craters': '/icons/icon-meteors.svg',
  'Ley Lines': '/icons/icon-ley-lines.svg',
  'Archaeological Finds': '/icons/icon-archaeological-finds.svg',
  'Biblical Discoveries': '/icons/icon-biblical-discoveries.svg',
  'Government Conspiracies': '/icons/icon-government-conspiracies.svg',
  'NASA / Space': '/icons/icon-nasa.svg',
  'The Occult': '/icons/icon-alchemy-occult.svg',
  'People Groups': '/icons/icon-people-groups.svg',
  'Ancient People Groups': '/icons/icon-people-groups.svg',
  'ancient-civilizations': '/icons/icon-people-groups.svg',
  'Default': '/icons/icon-map-pin.svg'
};

const nodes = TERM_TREE_DATA;

function getRootCategory(node: any) {
  let curr = node;
  while (curr.parentId) {
    const parent = nodes.find(n => n.id === curr.parentId);
    if (!parent) break;
    curr = parent;
  }
  return curr;
}

const getNodeIcon = (node: any): string => {
  if (node.id === 'biblical-apocryphal') return LAYER_ICONS['Biblical Figures'];
  if (node.id === 'myths-legends-root') return LAYER_ICONS['Myths / Legends'];
  if (node.id === 'megaliths-structures') return LAYER_ICONS['Megaliths / Structures'];
  if (node.id === 'supernatural-anomalies') return LAYER_ICONS['UFOs - Sightings'];
  if (node.id === 'government-conspiracies') return LAYER_ICONS['Government Conspiracies'];
  if (node.id === 'alchemy-occult') return LAYER_ICONS['The Occult'];
  if (node.id === 'people-groups') return LAYER_ICONS['People Groups'];
  if (node.id === 'nasa-root') return LAYER_ICONS['NASA / Space'];

  if (node.layer && LAYER_ICONS[node.layer]) {
    return LAYER_ICONS[node.layer];
  }
  let parentId = node.parentId;
  while (parentId) {
    if (parentId === 'biblical-apocryphal') return LAYER_ICONS['Biblical Figures'];
    if (parentId === 'myths-legends-root') return LAYER_ICONS['Myths / Legends'];
    if (parentId === 'megaliths-structures') return LAYER_ICONS['Megaliths / Structures'];
    if (parentId === 'supernatural-anomalies') return LAYER_ICONS['UFOs - Sightings'];
    if (parentId === 'government-conspiracies') return LAYER_ICONS['Government Conspiracies'];
    if (parentId === 'alchemy-occult') return LAYER_ICONS['The Occult'];
    if (parentId === 'people-groups') return LAYER_ICONS['People Groups'];
    if (parentId === 'nasa-root') return LAYER_ICONS['NASA / Space'];

    const parent = nodes.find(n => n.id === parentId);
    if (parent && parent.layer && LAYER_ICONS[parent.layer]) {
      return LAYER_ICONS[parent.layer];
    }
    parentId = parent?.parentId;
  }
  
  return LAYER_ICONS['Default'];
};

const map = new Map<string, Set<string>>();

for (const node of nodes) {
  const rootCat = getRootCategory(node);
  const rootIcon = getNodeIcon(rootCat);
  
  const key = `${rootCat.id} | ${rootCat.name} | ${rootIcon}`;
  if (!map.has(key)) {
    map.set(key, new Set());
  }
  map.get(key)!.add(node.id);
}

for (const [key, set] of map.entries()) {
  console.log(`Root Category Group: ${key}`);
  console.log(`  Count of nodes: ${set.size}`);
  console.log(`  Sample nodes: ${Array.from(set).slice(0, 5).join(', ')}`);
}
