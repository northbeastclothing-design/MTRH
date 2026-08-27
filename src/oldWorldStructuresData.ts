export interface OldWorldStructureCase {
  id: string;
  name: string;
  category: 'Old World Structures';
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

export const OLD_WORLD_STRUCTURES_DATA: OldWorldStructureCase[] = [
  {
    "id": "structure-neuschwanstein",
    "name": "Neuschwanstein Castle - Schwangau, Germany",
    "category": "Old World Structures",
    "type": "Point",
    "coordinates": {
      "lng": 10.7498,
      "lat": 47.5576
    },
    "date": 1869,
    "displayDate": "1869 CE",
    "description": "Commissioned by King Ludwig II of Bavaria as a personal retreat and homage to Richard Wagner, Neuschwanstein is a 19th-century Romanesque Revival palace set high above the village of Hohenschwangau. Featuring fairytale turrets, soaring towers, and opulent interior frescoes, it remains one of the world's most iconic romantic castle designs.",
    "source": "Bavarian Administration of State-Owned Palaces",
    "images": ["https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Schloss_Neuschwanstein_2013.jpg/500px-Schloss_Neuschwanstein_2013.jpg"]
  },
  {
    "id": "structure-edinburgh-castle",
    "name": "Edinburgh Castle - Edinburgh, Scotland",
    "category": "Old World Structures",
    "type": "Point",
    "coordinates": {
      "lng": -3.1999,
      "lat": 55.9486
    },
    "date": 1100,
    "displayDate": "1100 CE",
    "description": "A historic fortress dominating the skyline of Edinburgh from atop Castle Rock, an extinct volcanic crag. Human occupation on the rock dates back to the Iron Age, and the castle served as a royal residence from the 12th century until 1633. It endured numerous sieges over centuries of Anglo-Scottish conflicts.",
    "source": "Historic Environment Scotland",
    "images": ["https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/City_of_Edinburgh_-_Edinburgh_Castle_-_20140421004403.jpg/500px-City_of_Edinburgh_-_Edinburgh_Castle_-_20140421004403.jpg"]
  },
  {
    "id": "structure-mont-saint-michel",
    "name": "Mont-Saint-Michel Abbey & Citadel - Normandy, France",
    "category": "Old World Structures",
    "type": "Point",
    "coordinates": {
      "lng": -1.5115,
      "lat": 48.6361
    },
    "date": 966,
    "displayDate": "966 CE",
    "description": "A medieval island commune and fortified Benedictine abbey perched on a rocky islet off the Normandy coast. Surrounded by vast tidal flats with extreme tidal variations, Mont-Saint-Michel withstands sea swells and served as an impregnable defensive citadel during the Hundred Years' War.",
    "source": "Centre des Monuments Nationaux France",
    "images": ["https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Mont-Saint-Michel_vu_du_ciel.jpg/500px-Mont-Saint-Michel_vu_du_ciel.jpg"]
  },
  {
    "id": "structure-alcazar-segovia",
    "name": "Alcázar of Segovia - Segovia, Spain",
    "category": "Old World Structures",
    "type": "Point",
    "coordinates": {
      "lng": -4.1287,
      "lat": 40.9525
    },
    "date": 1120,
    "displayDate": "1120 CE",
    "description": "Rising atop a rocky crag above the confluence of the Eresma and Clamores rivers, the Alcázar of Segovia is a distinctive vessel-shaped castle with conical turrets. It was a favorite royal residence for the monarchs of Castile and played a key role in Spanish medieval history, including the crowning of Queen Isabella I.",
    "source": "Patronato del Alcázar de Segovia",
    "images": ["https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Panor%C3%A1mica_Oto%C3%B1o_Alc%C3%A1zar_de_Segovia.jpg/500px-Panor%C3%A1mica_Oto%C3%B1o_Alc%C3%A1zar_de_Segovia.jpg"]
  },
  {
    "id": "structure-himeji-castle",
    "name": "Himeji Castle (White Heron Castle) - Hyogo, Japan",
    "category": "Old World Structures",
    "type": "Point",
    "coordinates": {
      "lng": 134.6939,
      "lat": 34.8394
    },
    "date": 1333,
    "displayDate": "1333 CE",
    "description": "Considered the finest surviving example of prototypical Japanese castle architecture, Himeji Castle comprises a complex network of 83 rooms and defensive keep structures with brilliant white plaster walls resembling a bird taking flight. Built originally in 1333 and expanded by samurai warlords, it survived WWII bombing raids unscathed.",
    "source": "Himeji City Board of Education / UNESCO World Heritage",
    "images": ["https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Himeji_castle_in_may_2015.jpg/500px-Himeji_castle_in_may_2015.jpg"]
  },
  {
    "id": "structure-prague-castle",
    "name": "Prague Castle - Prague, Czech Republic",
    "category": "Old World Structures",
    "type": "Point",
    "coordinates": {
      "lng": 14.4016,
      "lat": 50.0910
    },
    "date": 870,
    "displayDate": "870 CE",
    "description": "Guinness World Records lists Prague Castle as the largest ancient castle complex in the world, spanning over 70,000 square meters. Founded in the 9th century by Prince Bořivoj, the vast citadel encompasses St. Vitus Cathedral, royal palaces, defensive towers, and centuries of Bohemian architectural styles.",
    "source": "Prague Castle Administration (Správa Pražského hradu)",
    "images": ["https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Karl%C5%AFv_most_Praha%2C_Star%C3%A9_M%C4%9Bsto_20170810_007.jpg/500px-Karl%C5%AFv_most_Praha%2C_Star%C3%A9_M%C4%9Bsto_20170810_007.jpg"]
  },
  {
    "id": "structure-windsor-castle",
    "name": "Windsor Castle - Berkshire, England",
    "category": "Old World Structures",
    "type": "Point",
    "coordinates": {
      "lng": -0.6044,
      "lat": 51.4839
    },
    "date": 1070,
    "displayDate": "1070 CE",
    "description": "Founded by William the Conqueror following the Norman Invasion of 1066, Windsor Castle is the oldest and largest continually inhabited castle in the world. It has served as an official home for 40 British monarchs across nearly a millennium of royal history.",
    "source": "Royal Collection Trust",
    "images": ["https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Windsor_Castle_at_Sunset_-_Nov_2006.jpg/500px-Windsor_Castle_at_Sunset_-_Nov_2006.jpg"]
  },
  {
    "id": "structure-castel-del-monte",
    "name": "Castel del Monte - Andria, Apulia, Italy",
    "category": "Old World Structures",
    "type": "Point",
    "coordinates": {
      "lng": 16.2709,
      "lat": 41.0847
    },
    "date": 1240,
    "displayDate": "1240 CE",
    "description": "Built in the 1240s by Holy Roman Emperor Frederick II, Castel del Monte is a unique octagonal castle perched on a hill in Apulia. Renowned for its mathematical precision, sacred geometry, eight octagonal towers, and astronomical alignments, it features no moat or drawbridge and served as a fortress-observatory.",
    "source": "Ministero della Cultura Italia",
    "images": ["https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Castel_del_Monte_-_Andria.jpg/500px-Castel_del_Monte_-_Andria.jpg"]
  },
  {
    "id": "structure-chambord",
    "name": "Château de Chambord - Loir-et-Cher, France",
    "category": "Old World Structures",
    "type": "Point",
    "coordinates": {
      "lng": 1.5172,
      "lat": 47.6161
    },
    "date": 1519,
    "displayDate": "1519 CE",
    "description": "Constructed by King Francis I as a hunting lodge showcasing French Renaissance grandeur, Chambord features elaborate rooflines with lanterns, chimneys, and towers. Its central architectural masterpiece is a monumental double-helix staircase attributed to Leonardo da Vinci, allowing two people to ascend and descend simultaneously without crossing paths.",
    "source": "Domaine National de Chambord",
    "images": ["https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Aerial_image_of_Ch%C3%A2teau_de_Chambord_%28view_from_the_southeast%29.jpg/500px-Aerial_image_of_Ch%C3%A2teau_de_Chambord_%28view_from_the_southeast%29.jpg"]
  },
  {
    "id": "structure-krak-des-chevaliers",
    "name": "Krak des Chevaliers - Homs Governorate, Syria",
    "category": "Old World Structures",
    "type": "Point",
    "coordinates": {
      "lng": 36.2944,
      "lat": 34.7569
    },
    "date": 1031,
    "displayDate": "1031 CE",
    "description": "Widely regarded as the premier example of medieval Crusader castle military architecture. Rebuilt by the Knights Hospitaller in the 12th century atop a 650-meter hill commanding the Homs Gap, its massive outer walls, concentric defenses, and subterranean storage halls allowed garrisons to withstand years of siege.",
    "source": "UNESCO World Heritage Centre / Syrian Directorate-General of Antiquities",
    "images": ["https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/KRAK_DES_CHEVALIERS_-_GAR_-_6-00.jpg/500px-KRAK_DES_CHEVALIERS_-_GAR_-_6-00.jpg"]
  },
  {
    "id": "structure-alhambra",
    "name": "The Alhambra Fortress & Palace - Granada, Spain",
    "category": "Old World Structures",
    "type": "Point",
    "coordinates": {
      "lng": -3.5900,
      "lat": 37.1773
    },
    "date": 1238,
    "displayDate": "1238 CE",
    "description": "Originally built as a small fortress on Roman ruins in 889 CE, the Alhambra was converted into a sprawling palace-citadel complex in the 13th century by Nasrid Emir Mohammed ben Al-Ahmar. Its reddish stone fortification walls enclose exquisite Moorish courtyards, carved stuccoes, and intricate geometric arabesques.",
    "source": "Patronato de la Alhambra y Generalife",
    "images": ["https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/%22Einer_der_bekanntsten_Aussichtspunkte_Granadas%22._03.jpg/500px-%22Einer_der_bekanntsten_Aussichtspunkte_Granadas%22._03.jpg"]
  },
  {
    "id": "structure-conwy-castle",
    "name": "Conwy Castle - North Wales, UK",
    "category": "Old World Structures",
    "type": "Point",
    "coordinates": {
      "lng": -3.8290,
      "lat": 53.2801
    },
    "date": 1283,
    "displayDate": "1283 CE",
    "description": "Constructed by King Edward I during his conquest of Wales between 1283 and 1289, Conwy Castle is a formidable coastal fortress featuring eight colossal round towers, two fortified barbicans, and an integrated walled town defense system along the River Conwy.",
    "source": "Cadw Welsh Historic Monuments",
    "images": ["https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Conwy_Castle%2C_water_view1.jpg/500px-Conwy_Castle%2C_water_view1.jpg"]
  },
  {
    "id": "structure-pena-palace",
    "name": "Pena National Palace - Sintra, Portugal",
    "category": "Old World Structures",
    "type": "Point",
    "coordinates": {
      "lng": -9.3906,
      "lat": 38.7876
    },
    "date": 1854,
    "displayDate": "1854 CE",
    "description": "Standing on a high crest in the Sintra Mountains above Lisbon, Pena Palace is a Romanticist castle built upon the ruins of a 15th-century Hieronymite monastery. Featuring vivid yellow and red battlements, Neo-Manueline stone carvings, and drawbridges, it served as a summer residence for the Portuguese royal family.",
    "source": "Parques de Sintra-Monte da Lua",
    "images": ["https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Sintra_Portugal_Pal%C3%A1cio_da_Pena-01.jpg/500px-Sintra_Portugal_Pal%C3%A1cio_da_Pena-01.jpg"]
  },
  {
    "id": "structure-malbork-castle",
    "name": "Malbork Castle (Castle of the Teutonic Order) - Malbork, Poland",
    "category": "Old World Structures",
    "type": "Point",
    "coordinates": {
      "lng": 19.0284,
      "lat": 54.0397
    },
    "date": 1274,
    "displayDate": "1274 CE",
    "description": "Measuring over 143,000 square meters, Malbork Castle is the largest castle in the world measured by land area. Constructed by the Teutonic Knights, a German Roman Catholic order of crusader knights, this massive red-brick fortified monastery housed thousands of knights and commanded Baltic trade routes along the Nogat River.",
    "source": "Malbork Castle Museum (Muzeum Zamkowe w Malborku)",
    "images": ["https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Zesp%C3%B3%C5%82_Zamku_Krzy%C5%BCackiego_MALBORK_01.jpg/500px-Zesp%C3%B3%C5%82_Zamku_Krzy%C5%BCackiego_MALBORK_01.jpg"]
  },
  {
    "id": "structure-spis-castle",
    "name": "Spiš Castle - Žehra, Slovakia",
    "category": "Old World Structures",
    "type": "Point",
    "coordinates": {
      "lng": 20.7681,
      "lat": 48.9997
    },
    "date": 1209,
    "displayDate": "1209 CE",
    "description": "One of the largest castle sites in Central Europe, covering more than 41,000 square meters. Standing high above the Spiš countryside, this stone fortress was built in the 12th century on the site of a pre-historic hillfort and successfully repelled the Mongol invasion of Hungary in 1241.",
    "source": "Slovak National Museum - Spiš Museum",
    "images": ["https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Spi%C5%A1_Castle%2C_Slovakia.jpg/500px-Spi%C5%A1_Castle%2C_Slovakia.jpg"]
  },
  {
    "id": "structure-carcassonne",
    "name": "Cité de Carcassonne - Occitanie, France",
    "category": "Old World Structures",
    "type": "Point",
    "coordinates": {
      "lng": 2.3639,
      "lat": 43.2070
    },
    "date": 1125,
    "displayDate": "1125 CE",
    "description": "A celebrated medieval fortified citadel boasting 3 kilometers of double concentric ramparts and 52 watchtowers. Inhabited since the Gallo-Roman period, Carcassonne was heavily fortified during the Cathar Crusade in the 13th century and restored in the 19th century by Eugène Viollet-le-Duc.",
    "source": "Centre des Monuments Nationaux France",
    "images": ["https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/1_carcassonne_aerial_2016.jpg/500px-1_carcassonne_aerial_2016.jpg"]
  },
  {
    "id": "structure-corvin-castle",
    "name": "Corvin Castle (Hunyadi Castle) - Hunedoara, Romania",
    "category": "Old World Structures",
    "type": "Point",
    "coordinates": {
      "lng": 22.8883,
      "lat": 45.7494
    },
    "date": 1446,
    "displayDate": "1446 CE",
    "description": "A magnificent Gothic-Renaissance fortress built by John Hunyadi on the site of an earlier fortification along the Zlaști River. Featuring high drawbridges, knight halls, colorful tiled roofs, and a deep courtyard well according to local legend dug by Ottoman prisoners, Vlad the Impaler was reportedly imprisoned here.",
    "source": "Corvin Castle Museum Council",
    "images": ["https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Hunedoara_castle.jpg/500px-Hunedoara_castle.jpg"]
  },
  {
    "id": "structure-bodiam-castle",
    "name": "Bodiam Castle - East Sussex, England",
    "category": "Old World Structures",
    "type": "Point",
    "coordinates": {
      "lng": 0.5435,
      "lat": 51.0022
    },
    "date": 1385,
    "displayDate": "1385 CE",
    "description": "Built in 1385 by Sir Edward Dalyngrigge, a former knight of Edward III, to defend the surrounding coast against French invasion during the Hundred Years' War. Featuring a dramatic flooded moat, square plan, circular corner towers, and stone portcullis entrances, Bodiam is a classic medieval moated castle.",
    "source": "The National Trust UK",
    "images": ["https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Bodiam-castle-10My8-1197.jpg/500px-Bodiam-castle-10My8-1197.jpg"]
  },
  {
    "id": "structure-hohenwerfen",
    "name": "Hohenwerfen Castle - Werfen, Austria",
    "category": "Old World Structures",
    "type": "Point",
    "coordinates": {
      "lng": 13.1879,
      "lat": 47.4829
    },
    "date": 1077,
    "displayDate": "1077 CE",
    "description": "Surrounded by the Berchtesgaden Alps and the Tennengebirge mountain range, Hohenwerfen Castle is an 11th-century rock castle perched 155 meters above the Salzach River valley. Built by the Archbishops of Salzburg during the Investiture Controversy, it served as a state prison and fortress stronghold.",
    "source": "Salzburg State Palaces and Castles Administration",
    "images": ["https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Hohenwerfen_castle.jpg/500px-Hohenwerfen_castle.jpg"]
  },
  {
    "id": "structure-eltz-castle",
    "name": "Eltz Castle (Burg Eltz) - Wierschem, Germany",
    "category": "Old World Structures",
    "type": "Point",
    "coordinates": {
      "lng": 7.3366,
      "lat": 50.2052
    },
    "date": 1157,
    "displayDate": "1157 CE",
    "description": "Nestled deep in the hills above the Moselle River in Rhineland-Palatinate, Burg Eltz is a medieval castle that has remained in the ownership of the same family (the Eltz family) for over 33 generations. Unscathed by war due to clever diplomacy, its eight towers reach up to eight stories high.",
    "source": "Graf von Eltz Castle Trust",
    "images": ["https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Le_ch%C3%A2teau_d%27Eltz_%28Burg_Eltz%29_en_allemagne_%28cropped%29.jpg/500px-Le_ch%C3%A2teau_d%27Eltz_%28Burg_Eltz%29_en_allemagne_%28cropped%29.jpg"]
  },
  {
    "id": "structure-bojnice-castle",
    "name": "Bojnice Castle - Bojnice, Slovakia",
    "category": "Old World Structures",
    "type": "Point",
    "coordinates": {
      "lng": 18.5776,
      "lat": 48.7797
    },
    "date": 1113,
    "displayDate": "1113 CE",
    "description": "First recorded in 1113 CE in the Zobor Abbey deeds, Bojnice Castle evolved from a wooden fort into a Gothic stone fortress, eventually remodeled in romantic French castle style by Count Ján František Pálfi in the late 19th century. Built over a natural travertine cave with subterranean thermal pools.",
    "source": "Slovak National Museum - Bojnice Castle Museum",
    "images": ["https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/Bojnice_%28Bojnitz%29_Castle_%28by_Pudelek%29.jpg/500px-Bojnice_%28Bojnitz%29_Castle_%28by_Pudelek%29.jpg"]
  },
  {
    "id": "structure-chillon-castle",
    "name": "Chillon Castle (Château de Chillon) - Veytaux, Switzerland",
    "category": "Old World Structures",
    "type": "Point",
    "coordinates": {
      "lng": 6.9275,
      "lat": 46.4142
    },
    "date": 1005,
    "displayDate": "1005 CE",
    "description": "An island castle located on a rock on the eastern shore of Lake Geneva. Controlling the strategic narrow pass between the Bernese Alps and Lake Geneva, Chillon was expanded by the Counts of Savoy in the 13th century. Made famous by Lord Byron's 1816 poem 'The Prisoner of Chillon'.",
    "source": "Fondation du Château de Chillon",
    "images": ["https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/001_Chateau_de_Chillon_and_Dents_du_Midi_Photo_by_Giles_Laurent.jpg/500px-001_Chateau_de_Chillon_and_Dents_du_Midi_Photo_by_Giles_Laurent.jpg"]
  },
  {
    "id": "structure-hohensalzburg",
    "name": "Hohensalzburg Fortress - Salzburg, Austria",
    "category": "Old World Structures",
    "type": "Point",
    "coordinates": {
      "lng": 13.0475,
      "lat": 47.7949
    },
    "date": 1077,
    "displayDate": "1077 CE",
    "description": "Perched atop the Festungsberg cliff in Salzburg, Hohensalzburg Fortress is one of the largest fully preserved medieval castles in Europe. Commissioned in 1077 by Archbishop Gebhard, it was continuously expanded with massive bastions, mechanical cable funiculars, and royal chambers.",
    "source": "Salzburg Museum & Castle Fortress Administration",
    "images": ["https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Salzburg_-_Festung_Hohensalzburg.JPG/500px-Salzburg_-_Festung_Hohensalzburg.JPG"]
  },
  {
    "id": "structure-bran-castle",
    "name": "Bran Castle (Dracula's Castle) - Bran, Romania",
    "category": "Old World Structures",
    "type": "Point",
    "coordinates": {
      "lng": 25.3672,
      "lat": 45.5152
    },
    "date": 1377,
    "displayDate": "1377 CE",
    "description": "Constructed by the Saxons of Kronstadt in 1377 under charter from King Louis I of Hungary, Bran Castle commands a dramatic cliffside pass between Transylvania and Wallachia. Infamous for its historical association with Vlad the Impaler and Bram Stoker's Dracula legend.",
    "source": "National Museum of Bran",
    "images": ["https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Castelul_Bran2.jpg/500px-Castelul_Bran2.jpg"]
  },
  {
    "id": "structure-bodiam-castle",
    "name": "Bodiam Castle - East Sussex, England",
    "category": "Old World Structures",
    "type": "Point",
    "coordinates": {
      "lng": 0.5435,
      "lat": 51.0023
    },
    "date": 1385,
    "displayDate": "1385 CE",
    "description": "Built in 1385 by Sir Edward Dalyngrigge with permission from Richard II to defend the area against French invasion during the Hundred Years' War. Featuring a complete moat, quadrangular plan, and massive corner towers, it is a quintessential medieval moated fortress.",
    "source": "National Trust UK",
    "images": ["https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Bodiam-castle-10My8-1197.jpg/500px-Bodiam-castle-10My8-1197.jpg"]
  },
  {
    "id": "structure-spis-castle",
    "name": "Spiš Castle (Spišský Hrad) - Spišské Podhradie, Slovakia",
    "category": "Old World Structures",
    "type": "Point",
    "coordinates": {
      "lng": 20.7681,
      "lat": 48.9995
    },
    "date": 1209,
    "displayDate": "1209 CE",
    "description": "One of the largest castle complexes in Central Europe covering over 4 hectares. Founded in the 12th century on a travertine cliff, Spiš Castle withstood the Mongol invasions of 1241 and served as the royal administrative hub of Spiš County.",
    "source": "Slovak National Museum",
    "images": ["https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Burg_Hohenzollern_10-2016.jpg/500px-Burg_Hohenzollern_10-2016.jpg"]
  },
  {
    "id": "structure-carcassonne",
    "name": "Citadel of Carcassonne - Carcassonne, France",
    "category": "Old World Structures",
    "type": "Point",
    "coordinates": {
      "lng": 2.3631,
      "lat": 43.2070
    },
    "date": 1247,
    "displayDate": "1247 CE",
    "description": "A fortified medieval citadel boasting 3 kilometers of double outer walls and 52 watchtowers. Restored by Eugène Viollet-le-Duc in the 19th century, Carcassonne played a central role during the Albigensian Crusade and the Cathar wars.",
    "source": "Centre des Monuments Nationaux",
    "images": ["https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/1_carcassonne_aerial_2016.jpg/500px-1_carcassonne_aerial_2016.jpg"]
  },
  {
    "id": "structure-conwy-castle",
    "name": "Conwy Castle - Conwy, Wales",
    "category": "Old World Structures",
    "type": "Point",
    "coordinates": {
      "lng": -3.8258,
      "lat": 53.2804
    },
    "date": 1283,
    "displayDate": "1283 CE",
    "description": "Built by Edward I during his conquest of Wales between 1283 and 1289. Designed by master architect James of St. George, Conwy features eight massive towers and complete curtain walls integrated into the town fortification.",
    "source": "Cadw Welsh Historic Monuments",
    "images": ["https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Conwy_Castle%2C_water_view1.jpg/500px-Conwy_Castle%2C_water_view1.jpg"]
  },
  {
    "id": "structure-eilean-donan",
    "name": "Eilean Donan Castle - Highland, Scotland",
    "category": "Old World Structures",
    "type": "Point",
    "coordinates": {
      "lng": -5.5161,
      "lat": 57.2739
    },
    "date": 1220,
    "displayDate": "1220 CE",
    "description": "Situated on a small tidal island where three sea lochs meet in the Western Highlands. Originally built in the 13th century as a defense against Viking incursions, it was destroyed during the 1719 Jacobite rising and meticulously reconstructed in the 20th century.",
    "source": "Conchra Charitable Trust",
    "images": ["https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Eilean_Donan_Castle%2C_Scotland_-_Jan_2011.jpg/500px-Eilean_Donan_Castle%2C_Scotland_-_Jan_2011.jpg"]
  },
  {
    "id": "structure-hohenzollern",
    "name": "Hohenzollern Castle - Bisingen, Germany",
    "category": "Old World Structures",
    "type": "Point",
    "coordinates": {
      "lng": 8.9675,
      "lat": 48.3249
    },
    "date": 1061,
    "displayDate": "1061 CE",
    "description": "The ancestral seat of the Imperial House of Hohenzollern, crowning Mount Hohenzollern at an elevation of 855 meters. The current Neo-Gothic fortress was rebuilt by King Frederick William IV of Prussia between 1850 and 1867.",
    "source": "Burg Hohenzollern Administration",
    "images": ["https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Burg_Hohenzollern_10-2016.jpg/500px-Burg_Hohenzollern_10-2016.jpg"]
  },
  {
    "id": "structure-osaka-castle",
    "name": "Osaka Castle - Osaka, Japan",
    "category": "Old World Structures",
    "type": "Point",
    "coordinates": {
      "lng": 135.5259,
      "lat": 34.6873
    },
    "date": 1583,
    "displayDate": "1583 CE",
    "description": "Construction started in 1583 by Toyotomi Hideyoshi as the centerpiece of his unified Japan. Surrounded by colossal stone ramparts, deep moats, and gold leaf decorations, Osaka Castle played a pivotal role in the Siege of Osaka (1614–1615).",
    "source": "Osaka Castle Museum",
    "images": ["https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Osaka_Castle_03bs3200.jpg/500px-Osaka_Castle_03bs3200.jpg"]
  },
  {
    "id": "structure-mehrangarh-fort",
    "name": "Mehrangarh Fort - Jodhpur, India",
    "category": "Old World Structures",
    "type": "Point",
    "coordinates": {
      "lng": 73.0185,
      "lat": 26.2978
    },
    "date": 1459,
    "displayDate": "1459 CE",
    "description": "Rising 122 meters above Jodhpur's blue city skyline, Mehrangarh was founded by Rao Jodha in 1459. Enclosed by imposing walls up to 36 meters high, the fort encompasses ornate palaces, courtyards, and ancient battle scarred gates.",
    "source": "Mehrangarh Museum Trust",
    "images": ["https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Mehrangarh_Fort_sanhita.jpg/500px-Mehrangarh_Fort_sanhita.jpg"]
  },
  {
    "id": "structure-cairo-citadel",
    "name": "Citadel of Saladin - Cairo, Egypt",
    "category": "Old World Structures",
    "type": "Point",
    "coordinates": {
      "lng": 31.2597,
      "lat": 30.0299
    },
    "date": 1176,
    "displayDate": "1176 CE",
    "description": "A medieval Islamic fortification constructed by Saladin on Mokattam Hill in 1176 to protect Cairo against Crusader forces. Served as the seat of government in Egypt for over 700 years until the late 19th century.",
    "source": "Egyptian Ministry of Tourism and Antiquities",
    "images": ["https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Flickr_-_HuTect_ShOts_-_Citadel_of_Salah_El.Din_and_Masjid_Muhammad_Ali_%D9%82%D9%84%D8%B9%D8%A9_%D8%B5%D9%84%D8%A7%D8%AD_%D8%A7%D9%84%D8%AF%D9%8A%D9%86_%D8%A7%D9%84%D8%A3%D9%8A%D9%88%D8%A8%D9%8A_%D9%88%D9%85%D8%B3%D8%AC%D8%AF_%D9%85%D8%AD%D9%85%D8%AF_%D8%B9%D9%84%D9%8A_-_Cairo_-_Egypt_-_17_04_2010_%284%29.jpg/500px-thumbnail.jpg"]
  }
];
