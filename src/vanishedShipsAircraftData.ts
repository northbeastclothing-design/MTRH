export interface VanishedCase {
  id: string;
  name: string;
  category: 'Vanished Ships / Aircraft';
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

export const VANISHED_SHIPS_AIRCRAFT_DATA: VanishedCase[] = [
  {
    id: "flight-19",
    name: "Flight 19 (TBF Avenger Disappearance)",
    category: "Vanished Ships / Aircraft",
    type: "Point",
    coordinates: {
      lng: -76.0,
      lat: 26.3
    },
    date: 1945,
    displayDate: "12-05-1945",
    description: "A squadron of five US Navy TBF Avenger torpedo bombers that vanished without a trace over the Bermuda Triangle during a routine training flight, along with all 14 airmen. A PBM Mariner rescue patrol plane sent to search for them also disappeared.",
    source: "US Navy Official Records / Naval History and Heritage Command",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Grumman_TBF-1_Avengers_of_VGS-29_in_flight_over_Norfolk%2C_Virginia_%28USA%29%2C_on_1_September_1942_%2880-G-427475%29.jpg/500px-Grumman_TBF-1_Avengers_of_VGS-29_in_flight_over_Norfolk%2C_Virginia_%28USA%29%2C_on_1_September_1942_%2880-G-427475%29.jpg"
    ]
  },
  {
    id: "mh370",
    name: "Malaysia Airlines Flight MH370",
    category: "Vanished Ships / Aircraft",
    type: "Point",
    coordinates: {
      lng: 93.0,
      lat: -34.3
    },
    date: 2014,
    displayDate: "03-08-2014",
    description: "A Boeing 777-200ER passenger jet that disappeared from radar while flying from Kuala Lumpur to Beijing. Despite an extensive multi-national search in the southern Indian Ocean, only minor debris has been recovered, and the main wreckage remains unfound.",
    source: "JACC MH370 Safety Investigation Report",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/MAS_plane.jpg/500px-MAS_plane.jpg",
      "https://www.youtube.com/watch?v=IQEtBFz4vPc"
    ]
  },
  {
    id: "amelia-earhart",
    name: "Amelia Earhart Disappearance - Howland Island",
    category: "Vanished Ships / Aircraft",
    type: "Point",
    coordinates: {
      lng: -176.618,
      lat: 0.807
    },
    date: 1937,
    displayDate: "07-02-1937",
    description: "Aviation pioneer Amelia Earhart and navigator Fred Noonan vanished over the central Pacific Ocean near Howland Island during her circumnavigation attempt in a Lockheed Model 10-E Electra, sparking numerous theories.",
    source: "Purdue University Amelia Earhart Papers Archive",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Amelia_Earhart_standing_under_nose_of_her_Lockheed_Model_10-E_Electra%2C_small_%28cropped%29.jpg/500px-Amelia_Earhart_standing_under_nose_of_her_Lockheed_Model_10-E_Electra%2C_small_%28cropped%29.jpg"
    ]
  },
  {
    id: "uss-cyclops",
    name: "USS Cyclops Disappearance",
    category: "Vanished Ships / Aircraft",
    type: "Point",
    coordinates: {
      lng: -70.0,
      lat: 20.0
    },
    date: 1918,
    displayDate: "03-04-1918",
    description: "A US Navy Proteus-class collier ship carrying manganese ore that vanished without a trace in the Bermuda Triangle region with 306 crew members and passengers on board. It remains the single largest non-combat loss of life in US Navy history.",
    source: "US Navy Historical Center Records",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/USS_Cyclops_in_Hudson_River_19111003.jpg/500px-USS_Cyclops_in_Hudson_River_19111003.jpg"
    ]
  },
  {
    id: "ss-cotopaxi",
    name: "SS Cotopaxi Disappearance",
    category: "Vanished Ships / Aircraft",
    type: "Point",
    coordinates: {
      lng: -81.31,
      lat: 29.89
    },
    date: 1925,
    displayDate: "12-01-1925",
    description: "A tramp steamer that vanished in December 1925 after departing Charleston for Havana. In 2020, marine archaeologists identified its wreck off the coast of St. Augustine, Florida, solving a major Bermuda Triangle mystery.",
    source: "NOAA Wreck Database / Marine Archeology Studies",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/American_steamship_SS_Cotopaxi_%28built_1918%29.png/500px-American_steamship_SS_Cotopaxi_%28built_1918%29.png"
    ]
  },
  {
    id: "mary-celeste",
    name: "Mary Celeste Ghost Ship Finding",
    category: "Vanished Ships / Aircraft",
    type: "Point",
    coordinates: {
      lng: -25.8,
      lat: 38.3
    },
    date: 1872,
    displayDate: "12-05-1872",
    description: "An American merchant brigantine found sailing crewless and abandoned in the Atlantic Ocean near the Azores. The ship was intact, with its cargo and provisions untouched, but the crew was never seen again.",
    source: "Gibraltar Admiralty Court Records",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Mary_Celeste_as_Amazon_in_1861_%28cropped%29.jpg/500px-Mary_Celeste_as_Amazon_in_1861_%28cropped%29.jpg"
    ]
  },
  {
    id: "carroll-a-deering",
    name: "Carroll A. Deering Ghost Ship Finding",
    category: "Vanished Ships / Aircraft",
    type: "Point",
    coordinates: {
      lng: -75.52,
      lat: 35.26
    },
    date: 1921,
    displayDate: "01-31-1921",
    description: "A five-masted commercial schooner found run aground on Diamond Shoals, North Carolina. When rescue crews arrived, the ship was completely abandoned with its navigation equipment, logbooks, and crew missing.",
    source: "FBI Disappearance Investigation Archives (1921)",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Deering2.jpg/250px-Deering2.jpg"
    ]
  },
  {
    id: "ss-waratah",
    name: "SS Waratah Disappearance",
    category: "Vanished Ships / Aircraft",
    type: "Point",
    coordinates: {
      lng: 29.0,
      lat: -32.0
    },
    date: 1909,
    displayDate: "07-27-1909",
    description: "An English passenger steamship traveling from Durban to Cape Town that vanished off the wild coast of South Africa with 211 passengers and crew, leaving no trace or wreckage.",
    source: "British Board of Trade Inquiry Report",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/SS_Waratah_FL601368.jpg/500px-SS_Waratah_FL601368.jpg"
    ]
  },
  {
    id: "uss-scorpion",
    name: "USS Scorpion (SSN-589) Sinking",
    category: "Vanished Ships / Aircraft",
    type: "Point",
    coordinates: {
      lng: -29.16,
      lat: 32.92
    },
    date: 1968,
    displayDate: "05-22-1968",
    description: "A Skipjack-class nuclear-powered submarine that vanished in the Atlantic Ocean southwest of the Azores with 99 crew members on board. Its wreckage was later located in 11,000 feet of water.",
    source: "US Navy Court of Inquiry Records",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/NH_97214_USS_Scorpion_%28SSN-589%29_%28cropped%29.tif/lossy-page1-500px-NH_97214_USS_Scorpion_%28SSN-589%29_%28cropped%29.tif.jpg"
    ]
  },
  {
    id: "franklin-expedition",
    name: "Franklin's Lost Expedition (HMS Erebus & HMS Terror)",
    category: "Vanished Ships / Aircraft",
    type: "Point",
    coordinates: {
      lng: -98.75,
      lat: 68.25
    },
    date: 1845,
    displayDate: "05-19-1845",
    description: "A British voyage of Arctic exploration led by Sir John Franklin that vanished while attempting to traverse the Northwest Passage. The shipwrecks of HMS Erebus and HMS Terror were located in 2014 and 2016.",
    source: "Parks Canada Undersea Archaeology Surveys",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Franklin%27s-Lost-Expedition.png/500px-Franklin%27s-Lost-Expedition.png"
    ]
  },
  {
    id: "flying-tiger-739",
    name: "Flying Tiger Line Flight 739 Disappearance",
    category: "Vanished Ships / Aircraft",
    type: "Point",
    coordinates: {
      lng: 144.0,
      lat: 13.5
    },
    date: 1962,
    displayDate: "03-15-1962",
    description: "A chartered Lockheed L-1049 Super Constellation airliner carrying 93 US soldiers and 3 South Vietnamese military personnel that vanished over the Mariana Trench in the western Pacific Ocean under clear conditions.",
    source: "Civil Aeronautics Board Disappearance Report",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Lockheed_L-1049H_N6918C_FTL_LGW_29.08.64.jpg/500px-Lockheed_L-1049H_N6918C_FTL_LGW_29.08.64.jpg"
    ]
  }
];
