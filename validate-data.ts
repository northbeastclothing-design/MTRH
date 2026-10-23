import { TERM_TREE_DATA } from './src/termTreeData';
import { LAYER_ICONS } from './src/layers';


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
