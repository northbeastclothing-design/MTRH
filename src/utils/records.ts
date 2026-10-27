// Record normalisation helpers for incoming map data. Moved verbatim out of App.tsx.
import { isVideoUrl } from './media';

export const getSafeData = (data: any) => {
  if (Array.isArray(data)) return data;
  if (data && typeof data === 'object' && Array.isArray(data.default)) return data.default;
  return [];
};

export const isValidLngLat = (lng: any, lat: any) => {
  return (
    typeof lng === 'number' && !isNaN(lng) && lng >= -180 && lng <= 180 &&
    typeof lat === 'number' && !isNaN(lat) && lat >= -90 && lat <= 90
  );
};

export const normalizeCategoryName = (rawCategory: string, displayDescription: string = '', safeName: string = ''): string => {
  const lowerCat = rawCategory.toLowerCase();
  let normalizedCategory = rawCategory;
  if (lowerCat.includes('cave system') || lowerCat === 'cave systems') normalizedCategory = 'Cave Systems';
  else if (lowerCat.includes('alien sighting') || lowerCat.includes('alien sightings')) normalizedCategory = 'Alien Sightings';
  else if (lowerCat.includes('alien abduction') || lowerCat.includes('abduction')) normalizedCategory = 'Alien Abductions';
  else if (lowerCat.includes('cattle mutilation') || lowerCat.includes('livestock mutilation') || lowerCat.includes('mutilation')) normalizedCategory = 'Cattle Mutilations';
  else if (lowerCat.includes('enochian') || lowerCat.includes('watcher') || lowerCat.includes('angel') || lowerCat === 'enochian sites') normalizedCategory = 'Enochian Sites';
  else if (lowerCat.includes('bigfoot') || lowerCat.includes('sasquatch')) normalizedCategory = 'Bigfoot Sightings';
  else if (lowerCat.includes('giant') || lowerCat.includes('nephilim') || lowerCat.includes('giants')) normalizedCategory = 'Giants & Nephilim';
  else if (lowerCat.includes('brazilian') || lowerCat === 'brazilian ufo archives' || lowerCat.includes('brazillian')) normalizedCategory = 'UFOs - Brazillian Archives';
  else if (lowerCat.includes('war.gov') || lowerCat.includes('aaro') || lowerCat.includes('official release') || lowerCat.includes('declassified')) normalizedCategory = 'UFOs - War.gov';
  else if (lowerCat.includes('ufo') || lowerCat.includes('u.f.o') || lowerCat.includes('uap')) normalizedCategory = 'UFOs - Sightings';
  else if (lowerCat.includes('ley') || lowerCat.includes('ley-line') || lowerCat === 'ley lines') normalizedCategory = 'Ley Lines';
  else if (lowerCat.includes('cryptid')) normalizedCategory = 'Cryptid Sightings';
  else if (lowerCat.includes('cern') || lowerCat.includes('hadron') || lowerCat.includes('collider') || lowerCat.includes('accelerator')) normalizedCategory = 'Particle Accelerators';
  else if ((lowerCat.includes('stargate') || lowerCat.includes('portal')) && !lowerCat.includes('underworld') && !lowerCat.includes('entrance')) normalizedCategory = 'Portals / Stargates';
  else if (lowerCat.includes('entrance') || lowerCat.includes('underworld')) normalizedCategory = 'Underworld Entrances';
  else if (lowerCat.includes('ancient people') || lowerCat.includes('people group')) normalizedCategory = 'Ancient People Groups';
  else if (lowerCat.includes('ancient ruins')) normalizedCategory = 'Archaeological Finds';
  else if (lowerCat.includes('ancient') || lowerCat.includes('text')) normalizedCategory = 'Ancient Texts';
  else if (lowerCat.includes('burial') || lowerCat.includes('mound')) normalizedCategory = 'Burial Mounds';
  else if (lowerCat.includes('cave') || lowerCat.includes('drawing')) normalizedCategory = 'Rock Art & Cave Paintings';
  else if (lowerCat.includes('megaliths / dolmans / petroglyphs / geoglyphs')) {
    const descLower = displayDescription.toLowerCase();
    const nameLower = safeName.toLowerCase();
    if (descLower.includes('petroglyph') || descLower.includes('rock art') || nameLower.includes('rock art') || nameLower.includes('petroglyph') || descLower.includes('cave painting') || descLower.includes('cave art')) {
      normalizedCategory = 'Rock Art & Cave Paintings';
    } else {
      normalizedCategory = 'Megaliths / Structures';
    }
  }
  else if (lowerCat.includes('petroglyph') || lowerCat.includes('rock art')) normalizedCategory = 'Rock Art & Cave Paintings';
  else if (lowerCat.includes('geoglyph') || lowerCat.includes('earthwork')) normalizedCategory = 'Megaliths / Structures';
  else if (lowerCat.includes('crop') || lowerCat.includes('circle')) normalizedCategory = 'Crop Circles';
  else if (lowerCat.includes('megalith')) normalizedCategory = 'Megaliths / Structures';
  else if (lowerCat.includes('dumb') || lowerCat.includes('d.u.m.b')) normalizedCategory = "D.U.M.B.'s";
  else if (lowerCat.includes('ghost') || lowerCat.includes('haunt')) normalizedCategory = 'Ghosts & Hauntings';
  else if (lowerCat.includes('national park') || lowerCat.includes('reserve')) normalizedCategory = 'National Parks & Reserves';
  else if (lowerCat.includes('missing 411') || lowerCat === 'missing 411') normalizedCategory = 'Missing 411';
  else if (lowerCat.includes('blurred')) normalizedCategory = 'Blurred on Google Maps';
  else if (lowerCat.includes('meteor') || lowerCat.includes('crater') || lowerCat.includes('impact structure')) normalizedCategory = 'Meteor Impact Craters';
  else if (lowerCat.includes('archaeological') || lowerCat.includes('archaeology')) normalizedCategory = 'Archaeological Finds';
  else if (lowerCat.includes('biblical find') || lowerCat.includes('biblical discover') || lowerCat === 'biblical finds' || lowerCat === 'biblical discoveries') normalizedCategory = 'Biblical Discoveries';
  else if (lowerCat.includes('government program') || lowerCat.includes('secret government') || lowerCat.includes('classified program') || lowerCat.includes('government conspiracy') || lowerCat.includes('conspiracy')) normalizedCategory = 'Government Conspiracies';
  else if (lowerCat.includes('old world structure') || lowerCat.includes('castle') || lowerCat === 'old world structures') normalizedCategory = 'Old World Structures';
  else if (lowerCat.includes('alchemy') || lowerCat.includes('occult') || lowerCat.includes('hermeticism') || lowerCat.includes('thelema')) normalizedCategory = 'The Occult';

  return normalizedCategory;
};

export const processIncomingRecord = (item: any, index: number) => {
  const safeId = item.id || `rec-id-${index}-${Date.now()}`;
  
  let safeDate: number | null = null;
  if (item.date !== undefined && item.date !== null && item.date !== '') {
    const parsedYear = parseInt(item.date, 10);
    if (!isNaN(parsedYear)) safeDate = parsedYear;
  }

  let safeCoords: any = null;
  if (Array.isArray(item.coordinates)) {
    if (item.type === 'LineString') {
      safeCoords = item.coordinates.map((c: any) => {
        if (Array.isArray(c)) return [parseFloat(c[0]), parseFloat(c[1])];
        return [parseFloat(c.lng ?? c.lon), parseFloat(c.lat)];
      }).filter((c: any) => isValidLngLat(c[0], c[1]));
    } else if (item.coordinates.length === 2) {
      const lng = parseFloat(item.coordinates[0]);
      const lat = parseFloat(item.coordinates[1]);
      if (isValidLngLat(lng, lat)) safeCoords = [lng, lat];
    }
  } else if (item.coordinates && typeof item.coordinates === 'object') {
    const lng = parseFloat(item.coordinates.lng ?? item.coordinates.lon);
    const lat = parseFloat(item.coordinates.lat);
    if (isValidLngLat(lng, lat)) safeCoords = [lng, lat];
  }

  if (!safeCoords || (item.type === 'LineString' && safeCoords.length === 0)) return null; 

  const safeName = item.name ? String(item.name).trim() : "Unidentified Coordinate";
  const rawCategory = item.category ? String(item.category).trim() : "Uncategorized Anomalies";
  const safeDescription = item.description || item.comments || "";
  const safeSource = item.source ? String(item.source).trim() : null;
  
  const rawImages = Array.isArray(item.images) ? item.images : (item.image ? [item.image] : []);
  const filteredImages = rawImages.filter(Boolean); // Keep raw URLs in state
  let safeImages = [...filteredImages].sort((a, b) => {
    const aIsVideo = isVideoUrl(a);
    const bIsVideo = isVideoUrl(b);
    if (aIsVideo && !bIsVideo) return -1;
    if (!aIsVideo && bIsVideo) return 1;
    return 0;
  });

  const displayDescription = safeDescription.trim() || "No further diagnostic descriptive intelligence available in active log sheets.";
  const normalizedCategory = normalizeCategoryName(rawCategory, displayDescription, safeName);

  // Smart imagery injection for map points lacking media (megaliths, underworld entrances, national parks, mounds)
  // ONLY use high-quality location-specific historical/documentary assets for actual landmarks.
  // DO NOT use generic category-wide backgrounds/placers or fallbacks when no specific photo is matched.
  if (safeImages.length === 0) {
    const lowerName = safeName.toLowerCase();
    const lowerNormalizedCat = normalizedCategory.toLowerCase();
    
    if (lowerNormalizedCat === 'megaliths & ancient monuments') {
      if (lowerName.includes('pyramid of giza') || lowerName.includes('great pyramid')) {
        safeImages = ['https://www.wonders-of-the-world.net/Pyramids-of-Egypt/images/Description/Gizeh/Pyramides-de-Gizeh-7.jpg'];
      } else if (lowerName.includes('sphinx')) {
        safeImages = ['https://www.wonders-of-the-world.net/Pyramids-of-Egypt/images/Description/Sphinx/Sphinx-2.jpg'];
      } else if (lowerName.includes('göbekli') || lowerName.includes('gobekli')) {
        safeImages = ['https://ferrerysaret.com/wp-content/uploads/2026/01/GobekliTepe_turquia-2.jpg'];
      } else if (lowerName.includes('moai') || lowerName.includes('easter island')) {
        safeImages = ['https://www.wonders-of-the-world.net/Statues-of-Easter-island/images/Vignettes/Photos/Statues-de-l-ile-de-Paques-004-V.jpg'];
      } else if (lowerName.includes('evergreen')) {
        safeImages = ['https://www.montanamegaliths.com/uploads/6/9/2/9/69295147/evergreen-dolmen-tane-talalotu_orig.jpg'];
      } else if (lowerName.includes('tizer')) {
        safeImages = ['https://www.montanamegaliths.com/uploads/6/9/2/9/69295147/andrew-barker-tizer-best_orig.jpg'];
      } else if (lowerName.includes('dolman') || lowerName.includes('dolmen')) {
        safeImages = ['https://upload.wikimedia.org/wikipedia/commons/5/52/Poulnabrone_dolmen%2C_Ireland_-_Aug_2009.jpg'];
      }
    } else if (lowerNormalizedCat === 'geoglyphs & earthworks') {
      if (lowerName.includes('nazca')) {
        safeImages = [
          'https://youtu.be/t0vEngqpk84?si=TdyO-_NxCj9CqnFl',
          'https://www.machutravelperu.com/blog/wp-content/uploads/2018/03/how-were-nazca-lines-made.jpg'
        ];
      } else if (lowerName.includes('uffington')) {
        safeImages = ['https://upload.wikimedia.org/wikipedia/commons/4/48/Uffington-White-Horse-sat.jpg'];
      } else if (lowerName.includes('candelabro') || lowerName.includes('candelabra')) {
        safeImages = ['https://paracasbluetours.com/wp-content/uploads/2026/01/el-candelabro-paracas-noche-estrellas-misterio.webp'];
      } else if (lowerName.includes('blythe')) {
        safeImages = ['https://www.ancientartarchive.org/wp-content/uploads/ALV200217009325_Blythe_Geoglyph-scaled.jpg'];
      } else if (lowerName.includes('steppe')) {
        safeImages = ['https://i0.wp.com/beforeatlantis.com/wp-content/uploads/2020/08/ushtogaiskiisquareaerial-1.jpg?fit=1200%2C458&ssl=1'];
      }
    } else if (lowerNormalizedCat === 'rock art & cave paintings') {
      if (lowerName.includes('ferganchick')) {
        safeImages = ['https://www.historycolorado.org/sites/default/files/media/images/2018/5dt355.jpg'];
      }
    } else if (lowerNormalizedCat === 'underworld entrances') {
      if (lowerName.includes('darvaza') || lowerName.includes('door to hell')) {
        safeImages = ['https://upload.wikimedia.org/wikipedia/commons/9/91/Darvasa_gas_crater_panorama_crop.jpg'];
      } else if (lowerName.includes('hekla')) {
        safeImages = ['https://upload.wikimedia.org/wikipedia/commons/e/ec/Hekla_from_southWest_under_snow.jpg'];
      } else if (lowerName.includes('osore')) {
        safeImages = ['https://upload.wikimedia.org/wikipedia/commons/9/90/Mount_Osore_lake.jpg'];
      } else if (lowerName.includes('cave of hades') || lowerName.includes('gates of hades') || lowerName.includes('matapan') || lowerName.includes('tainaron')) {
        safeImages = ['https://upload.wikimedia.org/wikipedia/commons/0/07/The_cave_of_Hades_on_Cape_Matapan.jpg'];
      } else if (lowerName.includes('actun tunichil') || lowerName.includes('xibalba')) {
        safeImages = ['https://upload.wikimedia.org/wikipedia/commons/2/2e/Actun_Tunichil_Muknal_Entrance.jpg'];
      } else if (lowerName.includes('mitla') || lowerName.includes('mictlan')) {
        safeImages = ['https://upload.wikimedia.org/wikipedia/commons/4/42/Mitla_Tombs.jpg'];
      } else if (lowerName.includes('ghost city') || lowerName.includes('fengdu') || lowerName.includes('guimen')) {
        safeImages = ['https://upload.wikimedia.org/wikipedia/commons/5/5d/FengduGhostCityChina.jpg'];
      }
    } else if (lowerNormalizedCat === 'burial mounds') {
      if (lowerName.includes('serpent')) {
        safeImages = ['https://upload.wikimedia.org/wikipedia/commons/e/e0/Serpentmound_topview.jpg'];
      }
    } else if (lowerNormalizedCat === 'enochian sites') {
      if (lowerName.includes('hermon')) {
        safeImages = [
          'https://upload.wikimedia.org/wikipedia/commons/8/86/Paradise_Lost_1.jpg',
          'https://upload.wikimedia.org/wikipedia/commons/3/33/The_lake_of_Tiberias,_looking_towards_Hermon._David_Roberts._1855.jpg',
          'https://upload.wikimedia.org/wikipedia/commons/1/13/Mount_Hermon_View.jpg'
        ];
      } else if (lowerName.includes('dudael')) {
        safeImages = [
          'https://upload.wikimedia.org/wikipedia/commons/9/97/William_Holman_Hunt_-_The_Scapegoat.jpg',
          'https://upload.wikimedia.org/wikipedia/commons/b/bb/JudeanDesert.jpg'
        ];
      } else if (lowerName.includes('sheol') || lowerName.includes('hinnom') || lowerName.includes('gehenna')) {
        safeImages = [
          'https://upload.wikimedia.org/wikipedia/commons/f/f2/Thomas_Seddon_-_Jerusalem_and_the_Valley_of_Jehoshaphat_from_the_Hill_of_Evil_Counsel_-_Google_Art_Project.jpg',
          'https://upload.wikimedia.org/wikipedia/commons/9/91/Suburbs_of_Jerusalem_seen_from_the_Valley_of_Gehenna_-_Cootwijck_Johannes_Van_-_1619.jpg',
          'https://upload.wikimedia.org/wikipedia/commons/7/71/Jerusalem-Hinnom-Kidron-Old-City-323.jpg'
        ];
      } else if (lowerName.includes('bashan') || lowerName.includes('golan') || lowerName.includes('og')) {
        safeImages = [
          'https://upload.wikimedia.org/wikipedia/commons/c/c8/The_Sae_of_Tiberias%2C_looking_towards_Bashan._David_Roberts._1855.jpg',
          'https://upload.wikimedia.org/wikipedia/commons/a/ac/Golan_Heights_-_Gamla_view.jpg'
        ];
      }
    } else if (lowerNormalizedCat === 'crop circles') {
      safeImages = [
        'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/Aerial_View_of_the_Crop_Circle_in_Diessenhofen_15.07.2008_16-44-41.JPG/960px-Aerial_View_of_the_Crop_Circle_in_Diessenhofen_15.07.2008_16-44-41.JPG'
      ];
    }
  }

  const tagsSet = new Set<string>();
  if (Array.isArray(item.categories)) {
    item.categories.forEach((cat: string) => tagsSet.add(normalizeCategoryName(cat, displayDescription, safeName)));
  } else {
    tagsSet.add(normalizedCategory);
  }

  return {
    ...item,
    id: safeId,
    name: safeName,
    rawCategory: rawCategory,
    categories: Array.from(tagsSet),
    category: normalizedCategory,
    description: displayDescription,
    date: safeDate,
    coordinates: safeCoords,
    source: safeSource,
    images: safeImages,
    type: item.type === 'LineString' ? 'LineString' : 'Point'
  };
};

export const getWarGovReleaseInfo = (item: any) => {
  const src = (item.source || '').toLowerCase();
  const rawCat = (item.rawCategory || item.category || '').toLowerCase();
  const id = (item.id || '').toUpperCase();

  if (src.includes('release 6') || src.includes('release 06') || rawCat.includes('files 06') || rawCat.includes('release 6') || rawCat.includes('release 06') || id.startsWith('LLE-UAP')) {
    return { id: 6, title: 'Release 06', sub: 'Sep 18, 2026', key: 'rel-6' };
  }
  if (src.includes('release 5') || src.includes('release 05') || rawCat.includes('files 05') || rawCat.includes('release 5') || rawCat.includes('release 05') || id.includes('PR117') || id.includes('PR118') || id.includes('PR119') || id.includes('PR120') || id.includes('PR121') || id.includes('PR122') || id.includes('PR123') || id.includes('PR124') || id.includes('PR125') || id.includes('PR126') || id.includes('PR127') || id.includes('PR128') || id.includes('PR129') || id.includes('PR130') || id.includes('PR131')) {
    return { id: 5, title: 'Release 05', sub: 'Aug 07, 2026', key: 'rel-5' };
  }
  if (src.includes('release 4') || src.includes('release 04') || rawCat.includes('files 04') || rawCat.includes('release 4') || rawCat.includes('release 04')) {
    return { id: 4, title: 'Release 04', sub: 'Jul 24, 2026', key: 'rel-4' };
  }
  if (src.includes('release 3') || src.includes('release 03') || rawCat.includes('files 03') || rawCat.includes('release 3') || rawCat.includes('release 03')) {
    return { id: 3, title: 'Release 03', sub: 'Jun 19, 2026', key: 'rel-3' };
  }
  if (src.includes('release 2') || src.includes('release 02') || rawCat.includes('files 02') || rawCat.includes('release 2') || rawCat.includes('release 02')) {
    return { id: 2, title: 'Release 02', sub: 'May 29, 2026', key: 'rel-2' };
  }
  return { id: 1, title: 'Release 01', sub: 'May 08, 2026', key: 'rel-1' };
};

export const matchParkName = (featName: string, targetName: string) => {
  if (!featName || !targetName) return false;
  const cleanFeat = featName.toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .replace('nationalparkandpreserve', '')
    .replace('nationalparkreserve', '')
    .replace('nationalparksreserves', '')
    .replace('nationalpark', '')
    .replace('nationalreserve', '')
    .replace('nationalpreserve', '')
    .replace('nationalmonument', '');
  const cleanTarget = targetName.toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .replace('nationalparkandpreserve', '')
    .replace('nationalparkreserve', '')
    .replace('nationalparksreserves', '')
    .replace('nationalpark', '')
    .replace('nationalreserve', '')
    .replace('nationalpreserve', '')
    .replace('nationalmonument', '');
  return cleanFeat.includes(cleanTarget) || cleanTarget.includes(cleanFeat);
};

export const getMatchScore = (featName: string, targetName: string) => {
  if (!featName || !targetName) return 0;
  const cleanFeat = featName.toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .replace('nationalparkandpreserve', '')
    .replace('nationalparkreserve', '')
    .replace('nationalparksreserves', '')
    .replace('nationalpark', '')
    .replace('nationalreserve', '')
    .replace('nationalpreserve', '')
    .replace('nationalmonument', '');
  const cleanTarget = targetName.toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .replace('nationalparkandpreserve', '')
    .replace('nationalparkreserve', '')
    .replace('nationalparksreserves', '')
    .replace('nationalpark', '')
    .replace('nationalreserve', '')
    .replace('nationalpreserve', '')
    .replace('nationalmonument', '');

  if (cleanFeat === cleanTarget) {
    return 100;
  }

  const featHasWilderness = featName.toLowerCase().includes('wilderness');
  const targetHasWilderness = targetName.toLowerCase().includes('wilderness');
  if (featHasWilderness !== targetHasWilderness) {
    return 10;
  }

  if (cleanFeat.includes(cleanTarget) || cleanTarget.includes(cleanFeat)) {
    return 50;
  }

  return 0;
};
