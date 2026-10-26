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
    "description": "[FOUNDATIONAL ABDUCTION ARCHETYPE] Widely regarded as the first well-documented and publicized alien abduction case in modern history. While driving south on US Route 3 through the White Mountains, Betty and Barney Hill observed a bright, pancake-shaped craft with glowing rim lights descending toward their car. Through binoculars, Barney observed humanoid crew members in shiny dark uniforms looking down from a curved bank of windows. The couple experienced two hours of missing time and 35 miles of unremembered travel, accompanied by anomalous rhythmic buzzing sounds on the car's trunk lid. Simultaneous radar detection from Pease Air Force Base in Portsmouth, NH confirmed an unidentified anomalous target in the vicinity. Under separate regressive hypnosis conducted by Boston psychiatrist Dr. Benjamin Simon, both recounted being taken aboard the craft, separated, and examined by grey-skinned extraterrestrial humanoids with oversized hairless heads and large slanted eyes. Betty Hill produced an astronomical drawing of a holographic star map shown to her by the entity leader, which amateur astronomer Marjorie Fish later matched to the Zeta Reticuli binary star system, establishing the worldwide archetype of the Grey alien abduction phenomenon.",
    "source": "NH Division of Historical Resources / John G. Fuller - 'The Interrupted Journey' / Dr. Benjamin Simon Medical Transcripts / Marjorie Fish Astronomical Analysis",
    "images": [
      "https://images.weserv.nl/?url=https://upload.wikimedia.org/wikipedia/en/2/26/Barney_Hill_hypnosis_sketch_Feb_22%2C_1962_-_cropped_downrezed.png",
      "https://images.weserv.nl/?url=https://thumb.wikimedia.org/wikipedia/commons/thumb/6/69/BH_Star_map.png/500px-BH_Star_map.png",
      "https://images.weserv.nl/?url=https://upload.wikimedia.org/wikipedia/en/1/1d/Barney_Hill%2C_Betty_Hill_and_dog%2C_Desley.jpg"
    ]
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
  },
  {
    "id": "abduction-carl-higdon-1974",
    "name": "Carl Higdon Hunting-Trip Abduction - Medicine Bow National Forest, Wyoming (1974)",
    "category": "Alien Abductions",
    "type": "Point",
    "coordinates": {
      "lng": -106.3,
      "lat": 41.33
    },
    "date": 1974,
    "displayDate": "10-25-1974",
    "description": "[CLASSIC CASE] On 25 October 1974 oil driller Carl Higdon fired at an elk in the Medicine Bow forest and watched the bullet float out of the barrel and drop to the ground. A tall being in a black jumpsuit, 'Ausso,' offered him pills and took him in a transparent cubicle to a world with a blinding sun, then returned him; searchers found Higdon's truck miles from any road. His later medical exams showed old tuberculosis scars gone. The case is a textbook example of the 'healed by the visitors' motif.",
    "source": "Dr. Leo Sprinkle (University of Wyoming) Hypnotic Regression Records / Carbon County Sheriff Report",
    "images": [
      "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/45/Esterbrook_Medicine_Bow_NF.jpg/1280px-Esterbrook_Medicine_Bow_NF.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
    ]
  },
  {
    "id": "abduction-plymouth-michigan-2015",
    "name": "The Plymouth Abduction Photographs (MUFON 73270) - Plymouth, Michigan",
    "category": "Alien Abductions",
    "type": "Point",
    "coordinates": {
      "lng": -83.4702,
      "lat": 42.3714
    },
    "date": 2015,
    "displayDate": "9 Oct 2015",
    "description": "[UNVERIFIED PHOTOS] About 5 a.m. on 9 October 2015 a Plymouth, Michigan woman, after years of odd activity in the house and an argument with her boyfriend, remembered lighting a cigarette in the kitchen and then waking on the bathroom floor. Days later she found roughly forty photographs on her phone that neither of them had taken: close, dark, flash-lit frames of something with a large head and thin limbs. She filed MUFON Case 73270 with ten of them. Phone cameras do not take forty pictures by themselves; either someone in that house did, or something did. The missing time is the part that matches the older cases exactly.",
    "source": "Alien Archivist - The Plymouth Alien Abduction Photographs (https://alienarchivist.substack.com/p/plymouth-alien) / MUFON Case No. 73270",
    "images": [
      "https://substack-post-media.s3.amazonaws.com/public/images/312b8dbf-aab6-4679-8b86-db787b1e8bfa_1200x685.png",
      "https://substack-post-media.s3.amazonaws.com/public/images/9bba13e6-b938-427a-b711-d9f19cd9ff50_960x1280.jpeg",
      "https://substack-post-media.s3.amazonaws.com/public/images/eee512a2-cc18-46fd-b958-ceeb3d51ecd8_960x1280.jpeg"
    ]
  },
  {
    "id": "abduction-lac-beauport-quebec-2014",
    "name": "The 2014 Quebec Alien Photographs (MUFON) - Lac-Beauport, Quebec",
    "category": "Alien Abductions",
    "type": "Point",
    "coordinates": {
      "lng": -71.2833,
      "lat": 46.9667
    },
    "date": 2014,
    "displayDate": "31 Jan 2014",
    "description": "[UNVERIFIED PHOTOS] At 7 p.m. on 31 January 2014, alone at home in Lac-Beauport with her husband away, a woman saw two flashes light the clear winter sky, then a shadow cross her living room; she called her husband's name to an empty house. She lost time, and afterwards found photographs on her phone of a short entity inside the house. A second Quebec report from the same year, also filed to MUFON, supplied a similar image. Two Quebec households, the same winter, the same missing hours and the same unasked-for pictures. Compare the 1992 L'Annonciation body: the province keeps producing cases in which the camera sees what the witness cannot remember.",
    "source": "Alien Archivist - The 2014 Quebec Alien Photographs (https://alienarchivist.substack.com/p/2014-quebec-aliens) / MUFON case files",
    "images": [
      "https://substack-post-media.s3.amazonaws.com/public/images/aa4b5abf-f03a-4b58-8501-6197a934bc09_1360x768.png",
      "https://substack-post-media.s3.amazonaws.com/public/images/9097bf3b-a4a8-4d94-990b-9424e7010f8e_1360x768.png"
    ]
  },
  {
    "id": "abduction-vallgorguina-xavier-clares-1985",
    "name": "Xavier Clares' 'Jinn' Abduction at the Pedra Gentil Dolmen - Vallgorguina, Spain",
    "category": "Alien Abductions",
    "type": "Point",
    "coordinates": {
      "lng": 2.5106,
      "lat": 41.6447
    },
    "date": 1985,
    "displayDate": "21 Jul 1985",
    "description": "[UNVERIFIED PHOTOS] At 8 a.m. on Sunday 21 July 1985 Xavier Clares, a 23-year-old Barcelona photographer, drove alone to the Pedra Gentil, a Neolithic dolmen above Vallgorguina long associated with witches' sabbaths, to photograph the stone. He came back with hours missing and a roll of film that, developed, showed a small dark figure beside the dolmen and bars of light he had not seen. Under regression he described being taken by beings he later called jinn. Flying Saucer Review printed his full name with permission; Spanish writers hid it for decades. His older brother Jose Maria had photographed an 'astral being' on a Barcelona-Ibiza ferry in 1978. A megalith with a witch tradition, a family that attracts entities, and a camera: the pieces of this site in one case.",
    "source": "Alien Archivist - Xavier Clares 'Jinn' Abduction Photographs (https://alienarchivist.substack.com/p/jinn-abduction) / Flying Saucer Review",
    "images": [
      "https://substack-post-media.s3.amazonaws.com/public/images/bb0478f5-8e76-4aa1-b50d-0e2d2250c48a_842x382.jpeg",
      "https://substack-post-media.s3.amazonaws.com/public/images/752f73ad-c6be-4c41-9321-c056ba812734_1074x1549.png",
      "https://substack-post-media.s3.amazonaws.com/public/images/1e7652df-ad6f-4bb7-b4f2-b24aa1f7c627_600x861.png"
    ]
  },
  {
    "id": "abduction-key-west-mufon-142206-2021",
    "name": "MUFON Case 142206: Video From Inside a UFO - Key West, Florida",
    "category": "Alien Abductions",
    "type": "Point",
    "coordinates": {
      "lng": -81.78,
      "lat": 24.5551
    },
    "date": 2021,
    "displayDate": "12 Jun 2021",
    "description": "[UNVERIFIED FOOTAGE] At 1:15 a.m. on 12 June 2021 a Key West man in severe hip pain, which he believes kept him from being fully sedated, recorded 42 seconds of video he has no memory of taking. He found it in his phone six months later. The frames show a dim room with several figures the MUFON investigator classed as a tall Grey, two short 'frog-like' beings and a reptilian, and through what looks like a window a cell tower whose obstruction lights flash thirty times a minute, the FAA-mandated rate. He later underwent regression. Either it is the first video shot from inside an abduction, or a bedroom with a tower outside. The frog-like entities are the detail no hoaxer would invent.",
    "source": "Alien Archivist - MUFON Case No. 142206, Video Taken From Inside a UFO (https://alienarchivist.substack.com/p/mufon-case-no-142206)",
    "images": [
      "https://substackcdn.com/image/fetch/$s_!quSD!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F60b4749c-0649-48a3-a5ea-3884e1530421_738x812.jpeg",
      "https://substack-post-media.s3.amazonaws.com/public/images/60b4749c-0649-48a3-a5ea-3884e1530421_738x812.jpeg",
      "https://substack-post-media.s3.amazonaws.com/public/images/82d0844d-5dc8-46cc-95f7-7fef422f22d8_503x584.jpeg"
    ]
  }
];
