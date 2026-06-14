export interface AlienAbductionCase {
  id: string;
  name: string;
  category: 'Alien Abductions';
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

export const ALIEN_ABDUCTION_DATA: AlienAbductionCase[] = [
  {
    "id": "abduction-hill-1961",
    "name": "Betty and Barney Hill Abduction - Lincoln, New Hampshire",
    "category": "Alien Abductions",
    "type": "Point",
    "coordinates": {
      "lng": -71.6841,
      "lat": 44.0855
    },
    "date": 1961,
    "displayDate": "09-19-1961",
    "description": "Widely regarded as the first well-documented and publicized alien abduction case in United States history. While driving home along US Route 3 through the White Mountains, the couple observed a bright flying object that descended towards their vehicle. They subsequently experienced two hours of missing time and, under hypnosis, recalled being examined by grey-skinned extraterrestrial entities on board the craft.",
    "source": "NH Division of Historical Resources / John G. Fuller - The Interrupted Journey",
    "images": ["https://upload.wikimedia.org/wikipedia/commons/6/69/BH_Star_map.png"]
  },
  {
    "id": "abduction-walton-1975",
    "name": "Travis Walton Incident - Sitgreaves National Forest, Arizona",
    "category": "Alien Abductions",
    "type": "Point",
    "coordinates": {
      "lng": -110.6430,
      "lat": 34.3023
    },
    "date": 1975,
    "displayDate": "11-05-1975",
    "description": "Forestry worker Travis Walton vanished from the Sitgreaves National Forest after his logging crew witnessed a metallic disc emitting a high-pitched buzz and a beam of light. Walton, who approached the craft, was struck by an energy beam and disappeared. He reappeared five days later in Heber, Arizona, recounting an experience of waking up in a metallic room surrounded by small grey-skinned beings and human-like entities.",
    "source": "Travis Walton - The Walton Experience / APRO",
    "images": [
      "https://upload.wikimedia.org/wikipedia/commons/e/ed/Travis_Walton_2019.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/f/ff/Walton%28reconstitution%29.png"
    ]
  },
  {
    "id": "abduction-pascagoula-1973",
    "name": "Pascagoula Abduction - Pascagoula, Mississippi",
    "category": "Alien Abductions",
    "type": "Point",
    "coordinates": {
      "lng": -88.5610,
      "lat": 30.3713
    },
    "date": 1973,
    "displayDate": "10-11-1973",
    "description": "Charles Hickson and Calvin Parker were fishing on the bank of the Pascagoula River when they heard a whirring sound and observed a blue-light-emitting oval craft. Three legless, wrinkled-skinned creatures with claw-like hands levitated them onto the craft. They underwent a brief examination by a mechanical 'eye' device before being returned. Under police interrogation, their accounts remained consistent, and a state historical marker now commemorates the site.",
    "source": "Pascagoula Historical Society / Calvin Parker - Pascagoula: The Story Continues",
    "images": []
  },
  {
    "id": "abduction-vilasboas-1957",
    "name": "Antônio Vilas-Boas Abduction - São Francisco de Sales, Brazil",
    "category": "Alien Abductions",
    "type": "Point",
    "coordinates": {
      "lng": -49.4314,
      "lat": -19.9861
    },
    "date": 1957,
    "displayDate": "10-16-1957",
    "description": "Brazilian farmer Antônio Vilas-Boas was plowing a field at night when he was cornered by an egg-shaped craft emitting red light. He was dragged aboard by several small beings wearing grey suits. Once inside, he was stripped, covered in a strange gel, and had blood samples taken, followed by an encounter with a female humanoid entity. This case is one of the earliest to describe physical examinations and close contact inside an alien craft.",
    "source": "Dr. Olavo Fontes / SBEDV (Sociedade Brasileira de Estudos de Discos Voadores)",
    "images": ["https://upload.wikimedia.org/wikipedia/commons/b/bd/Ant%C3%B4nio_Vilas_Boas.jpg"]
  },
  {
    "id": "abduction-taylor-1979",
    "name": "Dechmont Woods Encounter - Livingston, Scotland",
    "category": "Alien Abductions",
    "type": "Point",
    "coordinates": {
      "lng": -3.5200,
      "lat": 55.9236
    },
    "date": 1979,
    "displayDate": "11-09-1979",
    "description": "Forestry worker Robert Taylor was walking in Dechmont Woods when he discovered a large, dark dome-like object floating above the clearing. Two small, spiked spheres rolled out and dragged him towards the craft, causing him to lose consciousness. He woke up with torn clothes, bruises, and a headache, unable to speak or walk properly. Lothian and Borders Police investigated the incident as a criminal assault, making it the only UFO incident in the UK to be investigated as a crime.",
    "source": "Lothian and Borders Police Archive / Robert Taylor",
    "images": ["https://upload.wikimedia.org/wikipedia/commons/3/3d/Dechmont_Law.jpg"]
  },
  {
    "id": "abduction-emilcin-1978",
    "name": "Emilcin Abduction - Emilcin, Poland",
    "category": "Alien Abductions",
    "type": "Point",
    "coordinates": {
      "lng": 22.0386,
      "lat": 51.1341
    },
    "date": 1978,
    "displayDate": "05-10-1978",
    "description": "Farmer Jan Wolski was riding his cart through the woods when he was approached by two small, green-faced entities in black suits. They boarded his cart and directed him to a clearing where a small, humming craft was hovering. Wolski was invited inside and examined with black, rectangular devices. He was treated politely, offered food, and allowed to leave. A monument commemorating the event was erected at the site in 2005.",
    "source": "Janusz Nowicki / Polish UFO Research Group",
    "images": ["https://upload.wikimedia.org/wikipedia/commons/1/11/Emilcin-pomnik.jpg"]
  },
  {
    "id": "abduction-zanfretta-1978",
    "name": "Zanfretta Abduction - Torriglia, Italy",
    "category": "Alien Abductions",
    "type": "Point",
    "coordinates": {
      "lng": 9.1397,
      "lat": 44.5056
    },
    "date": 1978,
    "displayDate": "12-06-1978",
    "description": "Night watchman Pier Fortunato Zanfretta reported multiple close encounters and abductions over a four-year period, starting in Marzano. On the first night, he was found in a state of shock by colleagues, with his clothes warm despite freezing temperatures. He described being taken aboard a triangular craft by tall, green-skinned beings who subjected him to medical examinations. Carabinieri police investigations found large, unusual footprints at the site.",
    "source": "Carabinieri Police Report / Rino Di Stefano - The Zanfretta Case",
    "images": []
  },
  {
    "id": "abduction-ilkleymoor-1987",
    "name": "Ilkley Moor Abduction - Yorkshire, England",
    "category": "Alien Abductions",
    "type": "Point",
    "coordinates": {
      "lng": -1.8167,
      "lat": 53.9000
    },
    "date": 1987,
    "displayDate": "12-01-1987",
    "description": "Retired police officer Philip Spencer was crossing Ilkley Moor when he spotted and photographed a small green entity in the morning mist. The creature turned and fled, and Spencer followed it only to see a large dome-shaped craft rise from the moor and disappear into the clouds. Upon arriving at the nearest town, Spencer realized he had lost two hours of time, which he later recovered through regressive hypnosis as an abduction experience inside the craft.",
    "source": "BUFORA (British UFO Research Association) / Jenny Randles",
    "images": ["https://upload.wikimedia.org/wikipedia/commons/2/2d/Ilkley_Moor.jpg"]
  },
  {
    "id": "abduction-allagash-1976",
    "name": "Allagash Waterway Abduction - Eagle Lake, Maine",
    "category": "Alien Abductions",
    "type": "Point",
    "coordinates": {
      "lng": -69.3496,
      "lat": 46.4633
    },
    "date": 1976,
    "displayDate": "08-20-1976",
    "description": "Four artists (Jack and Jim Weiner, Chuck Rak, and Charlie Foltz) were night fishing on Eagle Lake when they saw a huge, glowing sphere hovering in the sky. Foltz signaled it with a flashlight, prompting the sphere to accelerate towards their canoe. They rowed frantically to shore but experienced a period of missing time. Under hypnosis, all four independently described being taken aboard the craft and subjected to physical examinations by tall, thin entities.",
    "source": "Raymond E. Fowler - The Allagash Abductions / MUFON",
    "images": []
  },
  {
    "id": "abduction-schirmer-1967",
    "name": "Herbert Schirmer Abduction - Ashland, Nebraska",
    "category": "Alien Abductions",
    "type": "Point",
    "coordinates": {
      "lng": -96.3670,
      "lat": 41.0392
    },
    "date": 1967,
    "displayDate": "12-03-1967",
    "description": "Police patrolman Herbert Schirmer noticed red lights on a craft at an intersection. Thinking it was a broken-down truck, he approached, but the craft rose into the air and flashed a beam. Schirmer went home but found himself with a headache, a red welt on his neck, and two hours of missing time. Under regressive hypnosis sponsored by the Condon Committee, he recalled being invited aboard the craft by humanoids wearing silver suits with winged-serpent emblems.",
    "source": "Condon Committee Report / Roy Craig",
    "images": []
  },
  {
    "id": "abduction-cahill-1993",
    "name": "Kelly Cahill Abduction - Belgrave, Victoria, Australia",
    "category": "Alien Abductions",
    "type": "Point",
    "coordinates": {
      "lng": 145.3524,
      "lat": -37.9126
    },
    "date": 1993,
    "displayDate": "08-08-1993",
    "description": "Kelly Cahill and her husband were driving home through the Dandenong Ranges when they saw a large, glowing craft hovering over the road. Further down, they encountered a series of tall, featureless black figures standing in a paddock. After a sudden flash of light, they found themselves driving further down the road with missing time. Kelly later recalled being taken onto the craft and seeing other abductees, a claim supported by independent witnesses in other cars that night.",
    "source": "Kelly Cahill - Cosmic Connections / John E. Mack",
    "images": []
  },
  {
    "id": "abduction-napolitano-1989",
    "name": "Manhattan Abduction - Manhattan, New York",
    "category": "Alien Abductions",
    "type": "Point",
    "coordinates": {
      "lng": -74.0060,
      "lat": 40.7128
    },
    "date": 1989,
    "displayDate": "11-30-1989",
    "description": "Linda Napolitano claimed she was floated out of her closed 12th-floor apartment window in a beam of light, accompanied by three small alien beings, and taken into a large craft hovering over the East River near the Brooklyn Bridge. The case is notable because investigator Budd Hopkins claimed to have found several independent witnesses, including two security guards protecting a high-ranking political diplomat who allegedly witnessed the abduction.",
    "source": "Budd Hopkins - Witnessed: The True Story of the Brooklyn Bridge UFO Abductions",
    "images": []
  },
  {
    "id": "abduction-buffledge-1968",
    "name": "Buff Ledge Abduction - Colchester, Vermont",
    "category": "Alien Abductions",
    "type": "Point",
    "coordinates": {
      "lng": -73.2272,
      "lat": 44.5439
    },
    "date": 1968,
    "displayDate": "08-07-1968",
    "description": "Two teenage camp counselors, Michael Lapp and Janet Cornell, were sitting on a dock at Lake Champlain when a bright, dome-shaped craft emerged from the sky. Janet was taken aboard in a beam of light, and Michael followed shortly after. Both recalled being placed on examination tables by small beings with large eyes. They did not remember the event until years later under regressive hypnosis, showing high consistency in their detailed testimonies.",
    "source": "Walter N. Webb - Encounter at Buff Ledge: A UFO Case History",
    "images": []
  },
  {
    "id": "abduction-andreasson-1967",
    "name": "Betty Andreasson Abduction - South Ashburnham, Massachusetts",
    "category": "Alien Abductions",
    "type": "Point",
    "coordinates": {
      "lng": -71.9567,
      "lat": 42.6368
    },
    "date": 1967,
    "displayDate": "01-25-1967",
    "description": "Betty Andreasson was in her kitchen when the lights flickered and a group of small, grey beings entered the house through the closed wooden door. They placed her family in a trance and led Betty to a hovering craft. She underwent a medical examination, including the removal of a small device from her nose. Her case, investigated extensively by Raymond Fowler and MUFON, is famed for its complex spiritual and symbolic elements.",
    "source": "Raymond E. Fowler - The Andreasson Affair",
    "images": []
  },
  {
    "id": "abduction-strieber-1985",
    "name": "Communion Encounter - Accord, New York",
    "category": "Alien Abductions",
    "type": "Point",
    "coordinates": {
      "lng": -74.2251,
      "lat": 41.7823
    },
    "date": 1985,
    "displayDate": "12-26-1985",
    "description": "Best-selling horror novelist Whitley Strieber woke up in his remote cabin to find a small, round-headed figure in his bedroom. He was floated out of his room and onto a craft where he was subjected to painful medical examinations by several distinct entities, including small robotic 'greys' and a high-status female figure. His subsequent non-fiction book 'Communion' became a major best-seller and popularized the modern image of the 'Grey' alien.",
    "source": "Whitley Strieber - Communion: A True Story",
    "images": []
  },
  {
    "id": "abduction-moody-1975",
    "name": "Charles Moody Abduction - Alamogordo, New Mexico",
    "category": "Alien Abductions",
    "type": "Point",
    "coordinates": {
      "lng": -105.9602,
      "lat": 32.8995
    },
    "date": 1975,
    "displayDate": "08-13-1975",
    "description": "Air Force sergeant Charles Moody was watching a meteor shower in the desert when a metallic disc descended and hovered near his car. The car engine died, and he felt a strange numbness. He then saw several small, grey-skinned humanoids with large heads approach. Moody panicked and drove away when the car restarted, but realized he had lost about 90 minutes. He later recalled being taken inside the disc, meeting a leader named Elder, and seeing the engine systems.",
    "source": "APRO / Coral & Jim Lorenzen - UFO Abductions",
    "images": []
  }
];
