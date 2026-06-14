export interface CattleMutilationCase {
  id: string;
  name: string;
  category: 'Cattle Mutilations';
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

export const CATTLE_MUTILATION_DATA: CattleMutilationCase[] = [
  {
    "id": "mutilation-snippy-1967",
    "name": "Snippy the Horse - Alamosa, Colorado",
    "category": "Cattle Mutilations",
    "type": "Point",
    "coordinates": {
      "lng": -105.6200,
      "lat": 37.5664
    },
    "date": 1967,
    "displayDate": "09-07-1967",
    "description": "The landmark case that launched the modern livestock mutilation phenomenon. A 3-year-old Appaloosa mare named Lady (referred to in media as Snippy) was found dead near Hooper in the San Luis Valley. The animal's head and neck were completely stripped of flesh and skin. The cuts were described as highly precise and bloodless, accompanied by a strong chemical odor. A scientific study by the Condon Committee concluded it was a natural death, but the case remains a cornerstone of ufology lore.",
    "source": "Alamosa County Sheriff's Dept / Condon Committee Report",
    "images": []
  },
  {
    "id": "mutilation-greatplains-1973",
    "name": "Great Plains Mutilation Wave - Kansas & Nebraska",
    "category": "Cattle Mutilations",
    "type": "Point",
    "coordinates": {
      "lng": -97.6000,
      "lat": 39.5000
    },
    "date": 1973,
    "displayDate": "12-13-1973",
    "description": "A major wave of cattle mutilation cases swept through Kansas and Nebraska. Dozens of ranchers reported livestock found dead under mysterious circumstances, with eyes, ears, and reproductive organs surgically removed, and bodies drained of blood. The sudden outbreak of incidents led to widespread public alarm, mystery helicopter sightings, and eventually caught the attention of federal investigators.",
    "source": "FBI Project Animal Mutilation Archive / Kansas State Police",
    "images": ["https://upload.wikimedia.org/wikipedia/commons/d/d9/Cattle_Mutilations_by_county_in_Kansas_and_Nebraska_-_December_13_1973.png"]
  },
  {
    "id": "mutilation-gomez-1978",
    "name": "Gomez Ranch Mutilations - Dulce, New Mexico",
    "category": "Cattle Mutilations",
    "type": "Point",
    "coordinates": {
      "lng": -106.9903,
      "lat": 36.9395
    },
    "date": 1978,
    "displayDate": "04-24-1978",
    "description": "Rancher Manuel Gomez discovered one of his cows dead and mutilated, displaying the typical bloodless surgical incisions. New Mexico State Police Officer Gabe Valdez investigated the scene, noting high radiation levels, anomalous tracks, and a yellow substance left behind on the carcass. The repeat occurrences at the Gomez Ranch fueled conspiracy theories regarding underground bases in Dulce.",
    "source": "Gabe Valdez Investigation Files / New Mexico State Police",
    "images": []
  },
  {
    "id": "mutilation-silvies-2019",
    "name": "Silvies Valley Ranch Mutilations - Harney County, Oregon",
    "category": "Cattle Mutilations",
    "type": "Point",
    "coordinates": {
      "lng": -118.9706,
      "lat": 44.0665
    },
    "date": 2019,
    "displayDate": "07-30-2019",
    "description": "Five purebred Hereford bulls were found dead on the remote range of the Silvies Valley Ranch. The animals were completely drained of blood, with their tongues, eyes, and sex organs removed with surgical precision. Investigators found no signs of struggle, no tracks around the carcasses, and no scavenger activity, prompting a major investigation by the Harney County Sheriff's Office and the Oregon Cattlemen's Association.",
    "source": "Harney County Sheriff's Office / Oregon Cattlemen's Association",
    "images": []
  },
  {
    "id": "mutilation-madison-2023",
    "name": "OSR Cattle Mutilations - Madison County, Texas",
    "category": "Cattle Mutilations",
    "type": "Point",
    "coordinates": {
      "lng": -95.8902,
      "lat": 30.9599
    },
    "date": 2023,
    "displayDate": "04-18-2023",
    "description": "A series of six cow mutilations occurred across three counties in Texas (Madison, Brazos, and Robertson) along the Old San Antonio Road (OSR). Each cow was found on its side with its face sliced and tongue removed with a clean, straight cut. The scenes showed no signs of struggle, no blood spills, and no footprints, prompting a joint investigation by multiple county sheriffs' departments.",
    "source": "Madison County Sheriff's Office Press Release",
    "images": []
  },
  {
    "id": "mutilation-skinwalker-1996",
    "name": "Skinwalker Ranch Mutilation - Fort Duchesne, Utah",
    "category": "Cattle Mutilations",
    "type": "Point",
    "coordinates": {
      "lng": -109.8872,
      "lat": 40.2589
    },
    "date": 1996,
    "displayDate": "03-10-1996",
    "description": "Ranchers Terry and Gwen Sherman discovered a healthy cow dead in a pasture just hours after checking on it. The animal had a large, clean circular incision on its hide with its organs precisely removed and no blood found on the ground. A heavy snow cover was present, yet investigators found no footprints around the carcass, a case later studied extensively by NIDS (National Institute for Discovery Science).",
    "source": "NIDS Investigation Report / Colm Kelleher & George Knapp - Hunt for the Skinwalker",
    "images": []
  },
  {
    "id": "mutilation-redbluff-1975",
    "name": "Red Bluff Mutilation - Red Bluff, California",
    "category": "Cattle Mutilations",
    "type": "Point",
    "coordinates": {
      "lng": -122.2358,
      "lat": 40.1785
    },
    "date": 1975,
    "displayDate": "09-14-1975",
    "description": "A purebred Charolais bull was found dead in a remote pasture near Red Bluff. The animal had its ears, tongue, eyes, and genitals removed. The local veterinarian who conducted the necropsy confirmed that the cuts were made with a sharp instrument and that the animal was drained of blood, noting the lack of pooling or clotting in the carcass.",
    "source": "Tehama County Sheriff's Department / Dr. Donald Bailey",
    "images": []
  },
  {
    "id": "mutilation-elbert-1975",
    "name": "Elbert County Mutilations - Kiowa, Colorado",
    "category": "Cattle Mutilations",
    "type": "Point",
    "coordinates": {
      "lng": -104.4647,
      "lat": 39.3475
    },
    "date": 1975,
    "displayDate": "08-22-1975",
    "description": "Dozens of cattle mutilations were reported in Elbert County over a single summer. Local ranchers formed armed patrols after multiple carcasses were discovered with surgical incisions. Police reports noted sightings of unmarked black helicopters and mysterious lights in the sky preceding the mutilations. Colorado Senator Floyd Haskell requested FBI assistance, stating that the situation had caused extreme fear among the ranching community.",
    "source": "Colorado State Patrol / Senator Floyd Haskell Congressional Record",
    "images": []
  },
  {
    "id": "mutilation-logan-1975",
    "name": "Logan County Mutilation Wave - Peetz, Colorado",
    "category": "Cattle Mutilations",
    "type": "Point",
    "coordinates": {
      "lng": -103.2081,
      "lat": 40.6253
    },
    "date": 1975,
    "displayDate": "08-11-1975",
    "description": "A major peak in the 1975 Colorado wave. Sheriff's deputies investigated dozens of cattle mutilations in the northern portion of the county. In several cases, ranchers reported seeing low-flying, silent helicopters without navigation lights. Chemical analysis of soil samples around the carcasses revealed high concentrations of tranquilizing agents, leading to theories of clandestine drug-dart operations.",
    "source": "Logan County Sheriff's Department / AP News Archives",
    "images": []
  },
  {
    "id": "mutilation-valera-1998",
    "name": "Valera Livestock Mutilation - Valera, Venezuela",
    "category": "Cattle Mutilations",
    "type": "Point",
    "coordinates": {
      "lng": -70.6036,
      "lat": 9.3175
    },
    "date": 1998,
    "displayDate": "11-20-1998",
    "description": "A highly detailed forensic investigation conducted by veterinarian Dr. Jose Manuel Roman on a mutilated cow. The animal was found with circular incisions removing the jaw flesh, eye, ear, and reproductive organs. Roman's necropsy documented a complete absence of blood, perfect surgical cuts that cauterized the flesh, and the absolute absence of typical decomposition odors or insect infestation for 48 hours post-mortem.",
    "source": "Dr. Jose Manuel Roman Necropsy Report / Venezuelan UFO Network",
    "images": []
  }
];
