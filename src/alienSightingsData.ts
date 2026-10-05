export interface AlienSightingCase {
  id: string;
  name: string;
  category: 'Alien Sightings';
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
  submitterName?: string;
  submitterLink?: string;
  socialLink?: string;
}

export const ALIEN_SIGHTINGS_DATA: AlienSightingCase[] = [
  {
    id: "alien-sighting-santilli-autopsy-1995",
    name: "Roswell Recovered Entities & 'Alien Autopsy' Film - Roswell, New Mexico",
    category: "Alien Sightings",
    type: "Point",
    coordinates: {
      lng: -104.5230,
      lat: 33.3943
    },
    date: 1947,
    displayDate: "07-08-1947 / 08-28-1995",
    description: "[HISTORIC CONTROVERSY / HOAX RECONSTRUCTION] Following the July 1947 crash retrieval near Corona by the 509th Bomb Group at Roswell Army Air Field, local mortician Glenn Dennis, Sheriff George Wilcox, and witnesses alleged that small non-human bodies with oversized hairless craniums and dark almond eyes were transported to the base hospital for medical examination before transfer to Wright Field. Decades later in 1995, British video entrepreneur Ray Santilli released sensational 16mm black-and-white film footage purporting to show a classified 1947 U.S. military medical autopsy on a recovered Roswell extraterrestrial, broadcast to millions worldwide on Fox. In 2006, director Spyros Melaris and sculptor John Humphreys confessed the footage was staged in a London flat using a latex dummy packed with animal organs, though Santilli maintained it was a reconstruction of damaged original 1947 reels.",
    source: "Roswell Army Air Field 509th Records / Glenn Dennis Testimony / Spyros Melaris & John Humphreys Confessions",
    images: [
      "https://www.youtube.com/watch?v=-kWZ3JPFjm4",
      "https://www.youtube.com/watch?v=GxZItnSe5gY",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Alien_Autopsy_Exhibit_at_UFO_Museum_-_Roswell%2C_New_Mexico.jpg/960px-Alien_Autopsy_Exhibit_at_UFO_Museum_-_Roswell%2C_New_Mexico.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Roswell_UFO_Museum_-_Alien_Autopsy_%286080682876%29.jpg/960px-Roswell_UFO_Museum_-_Alien_Autopsy_%286080682876%29.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Alien_Autopsy_room%2C_UFO_Museum_in_Roswell.jpg/960px-Alien_Autopsy_room%2C_UFO_Museum_in_Roswell.jpg"
    ]
  },
  {
    id: "alien-sighting-solway-spaceman-1964",
    name: "Solway Firth Spaceman Photograph - Burgh Marsh, Cumbria, UK",
    category: "Alien Sightings",
    type: "Point",
    coordinates: {
      lng: -3.0782,
      lat: 54.9126
    },
    date: 1964,
    displayDate: "05-23-1964",
    description: "[EXPLAINED / IDENTIFIED - ACCIDENTAL OVEREXPOSURE] Firefighter Jim Templeton took three photographs of his five-year-old daughter Elizabeth on Burgh Marsh overlooking the Solway Firth. When Kodak developed the film, the middle picture revealed an enigmatic figure resembling a tall astronaut or spaceman in a white suit with helmet and visor standing behind the child. Templeton swore no one else was present. Photographic analyses by Kodak and modern photojournalists revealed that the figure was Templeton's wife, Annie, who had accidentally stepped into the shot; the bright sunlight overexposed her pale blue dress into white, while her dark hair and angled posture mimicked a visor and backpack.",
    source: "Cumbria Police Archives / Kodak Analysis / BBC News",
    images: [
      "https://images.weserv.nl/?url=https://upload.wikimedia.org/wikipedia/en/6/65/SolwayfirthSpaceman.jpg"
    ]
  },
  {
    id: "alien-sighting-hopkinsville-1955",
    name: "Kelly-Hopkinsville Goblins - Christian County, Kentucky",
    category: "Alien Sightings",
    type: "Point",
    coordinates: {
      lng: -87.4886,
      lat: 36.9692
    },
    date: 1955,
    displayDate: "08-21-1955",
    description: "[UNEXPLAINED / AIR FORCE INVESTIGATED] The Sutton and Taylor families fled to the Hopkinsville police station in panic after a nearly four-hour gun battle with small otherworldly creatures besieging their rural farmhouse. Witnesses described 3.5-foot-tall humanoids with large glowing yellow eyes, talon-like claws, wide slit mouths, and oversized pointed bat-like ears wearing luminous silver metallic skin. Gunfire produced metallic clanging sounds, and when struck, the beings floated or flipped backward rather than falling. Skeptics like Joe Nickell suggested great horned owls defending a nest, but extensive Air Force Project Blue Book investigations and police interviews confirmed the terrified families genuinely believed they were under alien attack.",
    source: "Christian County Sheriff Logs / Project Blue Book Case Files / Isabel Davis & Ted Bloecher",
    images: [
      "https://images.weserv.nl/?url=https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Hopkinsville_goblin.png/500px-Hopkinsville_goblin.png",
      "https://images.weserv.nl/?url=https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Kelly-Hopkinsville%28reconstitution%29.png/500px-Kelly-Hopkinsville%28reconstitution%29.png"
    ]
  },
  {
    id: "alien-sighting-flatwoods-1952",
    name: "Flatwoods Monster / Braxton County Green Monster - Flatwoods, West Virginia",
    category: "Alien Sightings",
    type: "Point",
    coordinates: {
      lng: -80.6529,
      lat: 38.7215
    },
    date: 1952,
    displayDate: "09-12-1952",
    description: "[UNEXPLAINED / CONTROVERSIAL] Brothers Edward and Fred May, accompanied by Tommy Hyer, Kathleen May, and local youths, investigated a pulsing fiery object landing on a hillside. In the dark woods amidst a pungent sulfurous mist, their flashlight illuminated a towering 10-foot-tall entity with a dark spade-shaped cowl, glowing non-human eyes, a dark green pleated skirt-like body, and small claw-like appendages. The entity emitted a high-pitched hiss and glided smoothly toward the witnesses, causing them to drop their light and flee in sheer terror. Multiple witnesses suffered weeks of severe throat irritation and nausea, known locally as 'monster sickness.'",
    source: "Braxton County Historical Society / Gray Barker Records / Project Blue Book Status",
    images: [
      "https://images.weserv.nl/?url=https://i.redd.it/ke595k0tg6rf1.jpg",
      "https://images.weserv.nl/?url=https://i.redd.it/ndylmq0tg6rf1.jpg",
      "https://images.weserv.nl/?url=https://i.redd.it/5qknnp0tg6rf1.jpg",
      "https://images.weserv.nl/?url=https://i.redd.it/ryla2m0tg6rf1.jpg",
      "https://images.weserv.nl/?url=https://i.redd.it/2kdj5m0n98rf1.png",
      "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4b/Flatwoods_monster.png/330px-Flatwoods_monster.png",
      "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/bd/Flatwoods_monster.svg/330px-Flatwoods_monster.svg.png"
    ]
  },
  {
    id: "alien-sighting-atacama-ata-2003",
    name: "Atacama Skeleton ('Ata') - La Noria, Atacama Desert, Chile",
    category: "Alien Sightings",
    type: "Point",
    coordinates: {
      lng: -69.7942,
      lat: -21.4339
    },
    date: 2003,
    displayDate: "10-19-2003",
    description: "[EXPLAINED / DEBUNKED - HUMAN FETAL MUTATION] In 2003, treasure hunter Óscar Muñoz discovered a miniature 6-inch mummified humanoid skeleton wrapped in white cloth inside a leather pouch in the abandoned mining ghost town of La Noria. The specimen exhibited anomalous physical traits: 10 pairs of ribs instead of 12, severe cranial elongation (turricephaly), and advanced bone calcification suggesting an age of 6 to 8 years despite its tiny stature. UFO documentarians touted Ata as extraterrestrial evidence. However, comprehensive 2018 whole-genome DNA sequencing by Stanford University geneticist Garry Nolan proved Ata was a female human fetus of indigenous Chilean descent who possessed rare novel mutations in seven genes associated with dwarfism, scoliosis, and skeletal dysplasia.",
    source: "Stanford Genome Sequencing Study (Nolan et al., 2018) / Genome Research Journal",
    images: [
      "https://images.weserv.nl/?url=https://i.redd.it/2xb42zw23lfh1.jpeg"
    ]
  },
  {
    id: "alien-sighting-falkville-metal-man-1973",
    submitterName: "Alien Archivist",
    submitterLink: "https://alienarchivist.substack.com/p/metal-man",
    name: "Falkville Metal Man - Falkville, Alabama",
    category: "Alien Sightings",
    type: "Point",
    coordinates: {
      lng: -86.9056,
      lat: 34.3718
    },
    date: 1973,
    displayDate: "10-17-1973",
    description: "[PROVEN FALSE / HOAX - STAGED TIN-FOIL PRANK] Police Chief Jeff Greenhaw responded to an emergency call reporting a spaceship landing on a remote farm road. Encountering a figure standing in the road clad from head to toe in metallic, tin-foil-like material with an antenna on its helmet and robotic, jerky movements, Greenhaw grabbed his Polaroid camera and snapped four clear photographs through his cruiser windshield. When Greenhaw switched on his squad car light bar, the metallic figure sprinted into the darkness at speeds exceeding 35 mph, evading Greenhaw's car across muddy terrain. The photos were extensively published, but subsequent investigations by ufologists concluded the figure was almost certainly a staged local prankster wearing a tinfoil suit.",
    source: "Falkville Police Records / Jeff Greenhaw Testimony / International UFO Bureau",
    images: [
      "https://www.youtube.com/watch?v=cphe8d5xnPA",
      "https://images.weserv.nl/?url=https://images.squarespace-cdn.com/content/v1/628ac0bfe2be2849dcbf5996/050dcf76-064c-438f-bae3-c5690ca37f1a/falkville-metal-man.jpg"
    ]
  },
  {
    id: "alien-sighting-travis-walton-1975",
    name: "Travis Walton Alien Entities Encounter - Apache-Sitgreaves, Arizona",
    category: "Alien Sightings",
    type: "Point",
    coordinates: {
      lng: -110.6083,
      lat: 34.3056
    },
    date: 1975,
    displayDate: "11-05-1975",
    description: "[UNEXPLAINED / HIGHLY CORROBORATED] Six forestry crewmen watched in horror as 22-year-old logger Travis Walton was struck by a beam of bluish light from a hovering disk and thrown backward. Terrified, the crew fled, and Walton vanished for five days, prompting a massive police manhunt and murder investigation. Walton reappeared disoriented at a Heber gas station, describing waking inside a curved medical room where he was examined by three short, bald humanoid entities with large domed craniums and enormous dark eyes, followed by encounters with human-appearing entities in helmets. All crew members passed repeated polygraph examinations administered by state polygraph examiners.",
    source: "Navajo County Sheriff Department Records / Travis Walton Encounter Reconstitutions",
    images: [
      "https://images.weserv.nl/?url=https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Walton%28reconstitution%29.png/500px-Walton%28reconstitution%29.png",
      "https://images.weserv.nl/?url=https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a9/Travis_Walton_Hangar_view.jpg/330px-Travis_Walton_Hangar_view.jpg"
    ]
  },
  {
    id: "alien-sighting-varginha-1996",
    name: "Varginha Alien Entity Encounters - Minas Gerais, Brazil",
    category: "Alien Sightings",
    type: "Point",
    coordinates: {
      lng: -45.4308,
      lat: -21.5514
    },
    date: 1996,
    displayDate: "01-20-1996",
    description: "[UNEXPLAINED / HIGHLY CORROBORATED] Three young women (Liliane Silva, Valquíria Silva, and Kátia Xavier) were walking through an empty lot in Jardim Andere when they encountered a strange bipedal creature cowering by a wall. They described a 5-foot-tall, oily brown-skinned humanoid with large glowing red eyes, three cranial ridges, and extreme apparent distress, accompanied by a strong ammonia-like odor. Brazilian military police and fire departments cordoned off the area, with reports of two entities captured and transferred to regional hospitals and military bases. One responding military officer, Marco Eli Chereze, died mysteriously from severe generalized septic infection shortly after physically handling the creature.",
    source: "Brazilian Military Inquest Records / Ubirajara Rodrigues & Vitório Pacaccini Investigation",
    images: [
      "https://www.youtube.com/watch?v=ERhVhfrbRtw",
      "https://images.weserv.nl/?url=https%3A%2F%2Fexternal-preview.redd.it%2Falien-from-the-varginha-crash-v0-Ga3_lSL6NfBAzdRcK5t2guHbZEtIe_OcNWGtylVlmgQ.jpeg%3Fformat%3Dpjpg%26auto%3Dwebp%26s%3D5fa71df6a1ef57f7470f5e13dd2f1c4b70282777",
      "https://www.youtube.com/watch?v=jJJD5bwEcj0",
      "https://images.weserv.nl/?url=https%3A%2F%2Fexternal-preview.redd.it%2Fallegedly-video-of-varginha-1996-creature-v0-b240YWJteHA4OGRnMZqVeuxJa1u7FMhWdcmXSRCi88iaoBtKHC1Yqn76eDze.png%3Fwidth%3D1080%26crop%3Dsmart%26format%3Dpjpg%26auto%3Dwebp%26s%3D2cefef736e4b14fe1de2892e12a9803372339f81"
    ]
  },
  {
    id: "alien-sighting-kyshtym-alyoshenka-1996",
    name: "Kyshtym Dwarf ('Alyoshenka') - Kaolinovy, Chelyabinsk, Russia",
    category: "Alien Sightings",
    type: "Point",
    coordinates: {
      lng: 60.5500,
      lat: 55.7000
    },
    date: 1996,
    displayDate: "05-13-1996",
    description: "[EXPLAINED / DEBUNKED - PREMATURE HUMAN DEFORMITY] In May 1996, an elderly woman named Tamara Prosvirina discovered a living 10-inch creature with an onion-shaped head, large dark eyes, and no navel near the village of Kaolinovy. Prosvirina fed the creature and named it Alyoshenka. After Prosvirina was hospitalized, the creature died and dried into a mummified specimen. Local police investigator Vladimir Bendlin preserved the body and had it examined by local pathologists who suspected non-human origins. However, before definitive genetic sequencing was conducted, the corpse mysteriously vanished from Bendlin's care. Russian geneticists later concluded the specimen was a severely deformed premature human fetus damaged by radiation fallout from the 1957 Mayak nuclear disaster.",
    source: "Kyshtym Police Department Archives / Vladimir Bendlin Investigation / Russian Genetic Registry",
    images: [
      "https://images.weserv.nl/?url=https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/%D0%9F%D0%B0%D0%BC%D1%8F%D1%82%D0%BD%D0%B8%D0%BA_%D0%9A%D1%8B%D1%88%D1%82%D1%8B%D0%BC%D1%81%D0%BA%D0%BE%D0%BC%D1%83_%D0%BA%D0%B0%D1%80%D0%BB%D0%B8%D0%BA%D1%83.jpg/500px-%D0%9F%D0%B0%D0%BC%D1%8F%D1%82%D0%BD%D0%B8%D0%BA_%D0%9A%D1%8B%D1%88%D1%82%D1%8B%D0%BC%D1%81%D0%BA%D0%BE%D0%BC%D1%83_%D0%BA%D0%B0%D1%80%D0%BB%D0%B8%D0%BA%D1%83.jpg"
    ]
  },
  {
    id: "alien-sighting-zanfretta-1978",
    name: "Zanfretta Reptilian Entity Encounters - Torriglia, Genoa, Italy",
    category: "Alien Sightings",
    type: "Point",
    coordinates: {
      lng: 9.1578,
      lat: 44.5156
    },
    date: 1978,
    displayDate: "12-06-1978",
    description: "[UNEXPLAINED / POLICE INVESTIGATED] Italian private security guard Pier Fortunato Zanfretta experienced repeated terrifying encounters in the mountains of Genoa with massive 10-foot-tall reptilian humanoids. Describing green, undulating scaly skin, luminous yellow triangular eyes, spines protruding from their heads, and clawed three-fingered hands, Zanfretta fired five rounds from his service revolver at one creature before falling unconscious. Carabinieri military police arriving on scene discovered Zanfretta in deep shock, along with 9-foot-wide circular horseshoe scorch marks in the grass and large footprint impressions. Under sodium pentothal and regressive hypnosis overseen by doctor Cesare Musatti, Zanfretta recounted being transported inside a luminous craft by entities calling themselves the 'Dargos.'",
    source: "Carabinieri Official Reports / Dr. Cesare Musatti Regressive Hypnosis Records",
    images: [
      "https://images.weserv.nl/?url=https%3A%2F%2Fexternal-preview.redd.it%2Fitalian-night-watchman-pier-zanfretta-claimed-that-10-feet-v0-ZUUX1Q-JNgBXU4S-NnKkwST9maMdsYj3NFZWHhsISng.jpg%3Fauto%3Dwebp%26s%3D41f928ce78b66753c5f819f4d538fdf976ec0fe8"
    ]
  },
  {
    id: "alien-sighting-allagash-1976",
    name: "Allagash Waterway Alien Entity Sketches - Eagle Lake, Maine",
    category: "Alien Sightings",
    type: "Point",
    coordinates: {
      lng: -69.3142,
      lat: 46.4389
    },
    date: 1976,
    displayDate: "08-20-1976",
    description: "[UNEXPLAINED / CORROBORATED SKETCHES] During a night canoe trip on Eagle Lake in northern Maine, four art students (twin brothers Jim and Jack Weiner, Charles Foltz, and Charles Rak) signaled a glowing orb with a flashlight, which swiftly accelerated toward them. Following a blinding pulse of light, they found their campfire burned entirely to ashes with hours unaccounted for. Decades later under hypnotic regression, all four men independently drew identical, haunting sketches of slender 4-foot-tall beings with large bulbous heads, dark wrap-around almond eyes, metallic grey skin, and four-fingered hands performing physical examinations, providing some of the most celebrated independent witness drawings in UFO history.",
    source: "Ray Fowler 'The Allagash Abductions' / Dr. Anthony Neves Hypnosis Transcripts",
    images: [
      "https://images.weserv.nl/?url=https://i.redd.it/04r944tg5rsd1.jpg",
      "https://images.weserv.nl/?url=https://i.redd.it/dejtgbgg5rsd1.jpg",
      "https://images.weserv.nl/?url=https://i.redd.it/pwbiwxkn5rsd1.jpg"
    ]
  },
  {
    id: "alien-sighting-crowley-lam-1918",
    name: "The Entity 'Lam' (Occult Proto-Grey Portrait) - New York City",
    category: "Alien Sightings",
    type: "Point",
    coordinates: {
      lng: -73.9973,
      lat: 40.7336
    },
    date: 1918,
    displayDate: "03-01-1918",
    description: "[OCCULT / HISTORICAL PROTO-GREY] In 1918, British occultist Aleister Crowley conducted the Amalantrah Working in New York City, attempting to open multidimensional doorways using ceremonial magic. Crowley produced a portrait drawing of an interdimensional intelligence he claimed to have contacted, named 'Lam' (Tibetan for 'the Way' or 'Path'). The portrait depicts a being with a massive, bald cranium, slender tapered jaw, and slanted elongated eyes that bears an uncanny resemblance to the modern archetype of the Grey alien, drawn nearly four decades before the Betty and Barney Hill incident and the birth of modern ufology.",
    source: "The Equinox III:1 / Kenneth Grant 'The Magical Revival' (1972)",
    images: [
      "https://images.weserv.nl/?url=https://thumb.wikimedia.org/wikipedia/commons/thumb/3/31/Supposed_channeled_entity_by_occultist_crowley.jpg/330px-Supposed_channeled_entity_by_occultist_crowley.jpg"
    ]
  },
  {
    id: "alien-sighting-skinny-bob",
    name: "Skinny Bob (1942 Louisiana Disc Crash Retrieval)",
    category: "Alien Sightings",
    type: "Point",
    coordinates: {
      lng: -93.7502,
      lat: 32.5252
    },
    date: 1942,
    displayDate: "04-01-1942",
    description: "[UNEXPLAINED / HIGHLY DEBATED LEAK] Famous series of leaked film reels uploaded to YouTube in 2011 by anonymous user 'ivan0135,' purporting to show classified archival footage of a live Extraterrestrial Biological Entity (EBE) nicknamed 'Skinny Bob.' The archive features 'Tin Bird' (a flying saucer crash site in wooded terrain), 'Flying Twin' (aerial photo reconnaissance from an Army Air Forces F-2 / Beechcraft Model 18), EBE height measurements, and close-up footage of the grey alien wearing a turtleneck-like garment with expressive facial blinks. Archival and FOIA research links the footage lore to a 1942 crash retrieval in Louisiana, corroborated by FBI Director J. Edgar Hoover's handwritten July 1947 memo ('in the La. case, the Army grabbed it and would not let us have it for cursory information') and the Cantwell S-Aircraft memo. Forensic debates continue between digital video effects analysts identifying Boris FX 'Sapphire Film Damage' noise overlays and proponents arguing the underlying entity animation and vintage optical artifacts predate modern accessible CGI.",
    source: "ivan0135 Leaked Archive / FBI Hoover 'La. Case' Memo (1947) / Cantwell S-Aircraft Document / Area52 Forensics",
    images: [
      "https://www.youtube.com/watch?v=8H3oZwBQ9Bc",
      "https://images.weserv.nl/?url=https://skinnybob.info/media/youtube/thumbnails/3.jpg",
      "https://images.weserv.nl/?url=https://skinnybob.info/media/youtube/thumbnails/4.jpg",
      "https://images.weserv.nl/?url=https://skinnybob.info/media/youtube/thumbnails/1.jpg",
      "https://images.weserv.nl/?url=https://i.redd.it/pdvmopvvx3391.jpg",
      "https://images.weserv.nl/?url=https://i.redd.it/63bzsj0hx3391.jpg",
      "https://images.weserv.nl/?url=https://i.redd.it/7ools34pz3391.jpg",
      "https://images.weserv.nl/?url=https://i.redd.it/e7o4awsyz3391.jpg",
      "https://images.weserv.nl/?url=https://i.redd.it/3l145e7d04391.jpg",
      "https://images.weserv.nl/?url=https://i.redd.it/snj1aa8h34391.jpg"
    ]
  },
  {
    id: "alien-sighting-kumburgaz-2007",
    name: "Kumburgaz UFO Cockpit Entities Footage - Sea of Marmara, Turkey",
    category: "Alien Sightings",
    type: "Point",
    coordinates: {
      lng: 28.4680,
      lat: 41.0340
    },
    date: 2007,
    displayDate: "05-13-2007",
    description: "[UNEXPLAINED / SCIENTIFICALLY EXAMINED] Extensive series of 200–600x optical telephoto night-vision video footage captured between 2007 and 2009 by night watchman Yalcin Yalman along the coastline of Kumburgaz, Turkey, overlooking the Sea of Marmara. The stabilized telephoto footage reveals a metallic, elliptical disc-shaped craft hovering silently over the water, featuring a wide illuminated cockpit window inside of which the distinct heads and shoulders of two extraterrestrial humanoid entities are visible. The footage was extensively analyzed frame-by-frame by the SIRIUS UFO Space Sciences Research Center and the Scientific and Technological Research Council of Turkey (TÜBİTAK), which concluded the recordings were genuine physical objects in optical space rather than CGI, scale models, or double-exposure tricks.",
    source: "TÜBİTAK Forensic Analysis / SIRIUS UFO Space Sciences Research Center / Haktan Akdoğan",
    images: [
      "https://www.youtube.com/watch?v=0my1weBD67w"
    ]
  },
  {
    id: "alien-sighting-ariel-school-1994",
    name: "Ariel School Telepathic Humanoids Encounter - Ruwa, Zimbabwe",
    category: "Alien Sightings",
    type: "Point",
    coordinates: {
      lng: 31.2464,
      lat: -17.8928
    },
    date: 1994,
    displayDate: "09-16-1994",
    description: "[UNEXPLAINED / MASS EYEWITNESS CORROBORATION] During morning recess at the private Ariel School in Ruwa, sixty-two schoolchildren aged 6 to 12 witnessed a large silver disc and several smaller craft land in the rough grassland just beyond the schoolyard fence. One or two slender humanoid figures clad in shiny black one-piece suits, with long black hair, thin necks, and enormous almond-shaped black eyes, emerged from the craft and glided across the grass. The children experienced overwhelming telepathic communication warning of environmental catastrophe and technological devastation. Harvard University psychiatry department chair Dr. John E. Mack and BBC reporter Tim Leach interviewed the children extensively on site, concluding that the children displayed authentic trauma symptoms and were reporting genuine perceptual reality.",
    source: "Dr. John E. Mack (Harvard University) Field Interviews / Cynthia Hind African UFO Research",
    images: [
      "https://www.youtube.com/watch?v=gRtp_jUCq0o",
      "https://i.imgur.com/reGFXWp.png",
      "https://i.imgur.com/io3NHj4.png",
      "https://i.imgur.com/Q5k1Niu.png",
      "https://i.imgur.com/ppLEwj1.png",
      "https://i.imgur.com/s8HYxER.png",
      "https://i.imgur.com/dQtQwgU.png",
      "https://i.imgur.com/rC41mKU.png",
      "https://i.imgur.com/zyZ6kT6.png",
      "https://i.imgur.com/kdBAqeP.jpg",
      "https://i.imgur.com/boXuDKG.png",
      "https://i.imgur.com/Mp1sCyl.jpg",
      "https://i.imgur.com/TkDyyTQ.png",
      "https://i.imgur.com/U9aucbg.png",
      "https://i.imgur.com/OC1fOT5.png",
      "https://i.imgur.com/i2TAVMC.png",
      "https://i.imgur.com/ThKAQ1Z.png",
      "https://i.imgur.com/hMwCdI5.png",
      "https://i.imgur.com/6IohltX.png",
      "https://i.imgur.com/OClswJx.png",
      "https://i.imgur.com/jA3EJMG.png",
      "https://i.imgur.com/hD5IkA8.png",
      "https://i.imgur.com/QxMHBNr.png",
      "https://i.imgur.com/MxmxhS5.png",
      "https://i.imgur.com/pUnhO94.png",
      "https://i.imgur.com/qget8SM.png",
      "https://i.imgur.com/tHxWiuv.png",
      "https://i.imgur.com/jOzlbk4.png",
      "https://i.imgur.com/8MOgR64.png",
      "https://i.imgur.com/YmdpBNr.jpg",
      "https://i.imgur.com/S3KcZbe.png",
      "https://i.imgur.com/AdrWzCG.png",
      "https://i.imgur.com/vnvTF74.png",
      "https://i.imgur.com/LLyTVzY.jpg",
      "https://i.imgur.com/p7uNLDh.jpg",
      "https://i.imgur.com/JFlBP3P.jpg",
      "https://i.imgur.com/CzokMI5.png",
      "https://i.imgur.com/D8JqfFR.png",
      "https://i.imgur.com/Zmpir3j.png",
      "https://i.imgur.com/hE5CBI4.png",
      "https://i.imgur.com/DxIvQKk.png",
      "https://i.imgur.com/4SXbBDK.png",
      "https://i.imgur.com/T9aHb2P.png",
      "https://i.imgur.com/fvGAVge.png",
      "https://i.imgur.com/6uPPTa6.png",
      "https://i.imgur.com/ua4pm3v.png",
      "https://i.imgur.com/RLujrpU.png",
      "https://i.imgur.com/ZZavyMV.png",
      "https://i.imgur.com/faWUMmc.png",
      "https://i.imgur.com/Iw1AJ86.png",
      "https://i.imgur.com/jGbCHaN.png",
      "https://i.imgur.com/F7HlF9f.jpg",
      "https://i.imgur.com/FGCxoW6.png",
      "https://i.imgur.com/MNe8lQa.png",
      "https://i.imgur.com/DBmFXwp.png",
      "https://i.imgur.com/w7sJDLT.png",
      "https://i.imgur.com/q3jFMHB.png",
      "https://i.imgur.com/j0OkUuy.png",
      "https://i.imgur.com/g0zMHSR.png",
      "https://i.imgur.com/Yjx04bk.png",
      "https://i.imgur.com/CA5oeQv.png",
      "https://i.imgur.com/9TNHVLR.png",
      "https://i.imgur.com/4YX0McQ.png",
      "https://i.imgur.com/T1HYuFa.jpg",
      "https://i.imgur.com/lWBdtyK.png",
      "https://i.imgur.com/X6DkxhC.jpg",
      "https://i.imgur.com/739aDya.png",
      "https://i.imgur.com/Tijvlua.png",
      "https://i.imgur.com/tq307Ma.png",
      "https://i.imgur.com/pwfUJOd.jpg",
      "https://i.imgur.com/QebQ0XY.png",
      "https://i.imgur.com/lSMtS30.png",
      "https://i.imgur.com/gjQAkyZ.png",
      "https://i.imgur.com/AB6Uu3D.png",
      "https://i.imgur.com/eIZRNy2.png",
      "https://i.imgur.com/YIM3DN7.png",
      "https://i.imgur.com/n6wJUly.png",
      "https://i.imgur.com/zaDMGhv.png",
      "https://i.imgur.com/w9fFM6h.png",
      "https://i.imgur.com/2tpR7dC.jpg",
      "https://i.imgur.com/ksnEC9e.png",
      "https://i.imgur.com/8zXv9qp.jpg",
      "https://i.imgur.com/OheMVbP.jpg",
      "https://i.imgur.com/yZXFG0g.png",
      "https://i.imgur.com/FLKdYSV.png",
      "https://i.imgur.com/npachwz.jpg",
      "https://i.imgur.com/u08NXA5.png",
      "https://i.imgur.com/4oMnDO9.png",
      "https://i.imgur.com/HGNkXC0.png"
    ]
  },
  {
    id: "alien-sighting-valensole-1965",
    name: "Valensole Humanoid Encounter & Paralysis - Valensole, France",
    category: "Alien Sightings",
    type: "Point",
    coordinates: {
      lng: 5.9839,
      lat: 43.8378
    },
    date: 1965,
    displayDate: "07-01-1965",
    description: "[UNEXPLAINED / PHYSICAL TRACE CORROBORATION] Lavender farmer Maurice Masse walked into his field at dawn and discovered an egg-shaped metallic craft resting on six legs, alongside two small humanoid entities about 3.5 feet tall with oversized, hairless heads, slit mouths, and large slanted eyes. When Masse approached to within twenty feet, one of the entities aimed a small black tube at him, rendering Masse completely paralyzed while remaining fully conscious. The beings climbed inside through a sliding hatch and the craft departed silently at tremendous speed. French National Gendarmerie investigators found a damp central depression and hardened calcinated soil where lavender refused to grow for a decade, while Masse suffered from profound lethargy and sleeping sickness for months following the event.",
    source: "French National Gendarmerie Case File / GEPAN Archive / Aimé Michel Investigation",
    images: [
      "https://images.weserv.nl/?url=https://upload.wikimedia.org/wikipedia/commons/8/8d/Valensole_humanoid.png",
      "https://images.weserv.nl/?url=https://i.redd.it/u8ehgxwzcl5g1.jpg"
    ]
  },
  {
    id: "alien-sighting-socorro-1964",
    name: "Socorro Egg Craft & Occupant Encounter (Lonnie Zamora) - Socorro, New Mexico",
    category: "Alien Sightings",
    type: "Point",
    coordinates: {
      lng: -106.8978,
      lat: 34.0425
    },
    date: 1964,
    displayDate: "04-24-1964",
    description: "[UNEXPLAINED / PHYSICAL TRACE CORROBORATION] On April 24, 1964, while pursuing a speeding vehicle south of Socorro, Police Sergeant Lonnie Zamora heard an explosive roar and observed bluish-orange flame in the desert. Driving up an isolated gravel road toward an arroyo, Zamora discovered a smooth, shiny whitish-aluminum egg-shaped craft resting on four angled landing gear struts. Standing beside the vehicle were two small humanoid figures (approximate size of small adults or children) dressed in white coveralls. As Zamora approached on foot, he observed a prominent red crescent-and-arrow insignia emblazoned upon the fuselage. The two entities entered the craft, which ignited with a roar and upward blast of blue flame, levitated, and flew away silently at tremendous velocity over the desert hills. Immediate on-site investigation by New Mexico State Police Officer Ted Jordan, the FBI, and Air Force Project Blue Book scientific consultant Dr. J. Allen Hynek documented four deeply pressed wedge-shaped landing gear depressions forming an irregular trapezoid, burned greasewood brush, and scorched soil, making Socorro one of Project Blue Book's most famous and scientifically validated 'Unidentified' close encounter cases.",
    source: "Project Blue Book Official Archive / FBI Declassified Memo / Dr. J. Allen Hynek Case File",
    images: [
      "https://images.weserv.nl/?url=https://i.redd.it/9o0x5x80dl5g1.jpg",
      "https://thumb.wikimedia.org/wikipedia/commons/thumb/3/33/Lonnie_Zamora-tuig_van_24_April_1964_te_Secorro%2C_NM%2C_a.jpg/500px-Lonnie_Zamora-tuig_van_24_April_1964_te_Secorro%2C_NM%2C_a.jpg",
      "https://images.weserv.nl/?url=https://i.redd.it/u8ehgxwzcl5g1.jpg",
      "https://www.youtube.com/watch?v=4ZkRTFqoLqM"
    ]
  },
  {
    id: "alien-sighting-nazca-tridactyl-2017",
    name: "Nazca Tridactyl Mummies & Implants - Nazca & Palpa, Ica, Peru",
    category: "Alien Sightings",
    type: "Point",
    coordinates: {
      lng: -74.9328,
      lat: -14.8359
    },
    date: 2017,
    displayDate: "06-15-2017",
    description: "[CONTROVERSIAL / SCIENTIFICALLY DEBATED - ANOMALOUS BIOLOGICALS] Discovered in subterranean desert cave systems between Nazca and Palpa, Peru, the Nazca mummies represent a collection of desiccant-preserved, diatomaceous earth-coated humanoid and reptilian-like corpses possessing three elongated fingers and three toes (tridactyly), elongated craniums, and subdermal metal implants composed of silver, copper, and osmium alloys. The collection includes larger human-scale specimens (such as 'Maria', carbon-dated to ~240–400 CE) as well as distinct small 60 cm upright bipedal specimens ('Josefina', 'Alberto', 'Suyay', and 'Joy'), several of which show intact internal oviducts holding biological eggs on CT scans. Medical imaging (CT/fluoroscopy), 3D DICOM reconstructions, and paleo-DNA sequencing by independent forensic specialists, the San Luis Gonzaga National University of Ica (UNICA), and the Inkarri Cultural Institute have fueled global debate between claims of unprecedented non-human biological species and assertions of modified archaeological remains.",
    source: "Inkarri Cultural Institute / UNICA Forensic Investigation / Mexican Congressional Hearings (2023)",
    images: [
      "https://images.weserv.nl/?url=https://i.redd.it/bcrsqvb5yjkh1.jpg",
      "https://images.weserv.nl/?url=https://i.redd.it/a9x1h5c5yjkh1.jpg",
      "https://images.weserv.nl/?url=https://i.redd.it/th5vpxb5yjkh1.jpg",
      "https://images.weserv.nl/?url=https://i.redd.it/l60wy3c5yjkh1.jpg",
      "https://images.weserv.nl/?url=https%3A%2F%2Fexternal-preview.redd.it%2Fmedical-scans-of-the-new-tridactyl-v0-aTFuOTFmdWI2bGtoMcIryHGQ2P4g2Wm-zlKorDi-CphFyWQZp8v2C29LIhbZ.png%3Fwidth%3D1080%26crop%3Dsmart%26format%3Dpjpg%26auto%3Dwebp%26s%3Dea37bd380b1ef0d08696650b64078cf2d89ae94e",
      "https://images.weserv.nl/?url=https%3A%2F%2Fexternal-preview.redd.it%2Fdicom-files-of-suyay-are-now-available-for-research-v0-ZjY4b2w0bzZ6eW9oMQ4Q4xZWNaKp_MdPrYDgEttrBuNrDlhruo3kqu9ikVPJ.png%3Fwidth%3D1080%26crop%3Dsmart%26format%3Dpjpg%26auto%3Dwebp%26s%3D352c01b9e2ac1b5d8f2086f9efe98ee776f84d63",
      "https://images.weserv.nl/?url=https%3A%2F%2Fexternal-preview.redd.it%2Fdicom-files-for-the-insectoid-humanoid-specimen-known-as-v0-NjFxY2FtdWZpZW1oMe7zw4TS2YgoxPoOzn1I_46iDHCWlSYZVm2y7A2dmBit.png%3Fformat%3Dpjpg%26auto%3Dwebp%26s%3D9d5a29d612494de5a9d236856c186305ab0eb43f",
      "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/05/Wiki_JM.jpg/500px-Wiki_JM.jpg",
      "https://www.youtube.com/watch?v=SA4WOZH2cZg"
    ]
  },
  {
    id: "alien-sighting-beavercreek-1973",
    submitterName: "Alien Archivist",
    submitterLink: "https://alienarchivist.substack.com/p/beavercreek",
    name: "Beavercreek Humanoids Encounter - Xenia & Beavercreek, Ohio",
    category: "Alien Sightings",
    type: "Point",
    coordinates: {
      lng: -84.0633,
      lat: 39.7289
    },
    date: 1973,
    displayDate: "10-16-1973",
    description: "[CONTROVERSIAL / LOCAL FLAP & ALLEGED HOAX] On the night of October 16, 1973, amidst the massive October 1973 national UFO wave, multiple motorists along the U.S. 35 Xenia bypass reported three silver-clad humanoid figures lurking in the darkness with antenna-like cranial projections and flashing red lights. While local police and newspapers swiftly branded the encounter a pre-Halloween student prank, alternative researchers point out the extraordinary timing matching dozens of genuine Close Encounters of the Third Kind across Ohio and Mississippi during the exact same 48-hour window, suggesting military-intelligence damage control or diversionary cover stories.",
    source: "Dayton Daily News / CBS Evening News (Walter Cronkite) / NICAP Files / Alien Archivist",
    images: [
          "https://images.weserv.nl/?url=https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F0d5c0e40-445f-40f6-ba6c-e768f45fbf0f_808x517.png",
          "https://images.weserv.nl/?url=https%3A%2F%2Fsubstackcdn.com%2Fimage%2Ffetch%2F%24s_!tCYJ!%2Cw_1456%2Cc_limit%2Cf_auto%2Cq_auto%3Agood%2Cfl_progressive%3Asteep%2Fhttps%253A%252F%252Fsubstack-post-media.s3.amazonaws.com%252Fpublic%252Fimages%252F756bc140-116a-459d-893e-0ff802550089_556x831.png",
          "https://images.weserv.nl/?url=https%3A%2F%2Fsubstackcdn.com%2Fimage%2Ffetch%2F%24s_!iJxu!%2Cw_1456%2Cc_limit%2Cf_auto%2Cq_auto%3Agood%2Cfl_progressive%3Asteep%2Fhttps%253A%252F%252Fsubstack-post-media.s3.amazonaws.com%252Fpublic%252Fimages%252F19b9dc55-285f-4264-b5ba-7f3108bd5c73_598x288.png"
    ]
  },
  {
    id: "alien-sighting-merida-2005",
    submitterName: "Alien Archivist",
    submitterLink: "https://alienarchivist.substack.com/p/merida-alien",
    name: "Mérida Light Pole Alien Grab - Mérida, Yucatán, Mexico",
    category: "Alien Sightings",
    type: "Point",
    coordinates: {
      lng: -89.5926,
      lat: 20.9674
    },
    date: 2005,
    displayDate: "03-20-2005",
    description: "[CHILLING CLOSE ENCOUNTER / PHYSICAL INTERACTION VIDEO] At 2:00 a.m. in Fraccionamiento del Parque, Mérida, youth José Alonso Herrera was recording his friends playing street soccer when David Espada approached a light pole to retrieve the ball. A dark, non-human entity suddenly reached out from behind the pole and grabbed Espada with an intensely frigid, clawed hand. Herrera zoomed his cellphone camera directly onto the pole as a bulbous-headed, large-eyed entity peeked out. Broadcast across Latin America on Otro Rollo and investigated by Jaime Maussan and Santiago Yturria, the footage remains one of Mexico's most unsettling physical entity recordings.",
    source: "Otro Rollo (Televisa) / Jaime Maussan / Santiago Yturria / MUFON UFO Journal No. 454 / Alien Archivist",
    images: [
          "https://images.weserv.nl/?url=https%3A%2F%2Fsubstackcdn.com%2Fimage%2Ffetch%2F%24s_!5pmb!%2Cf_auto%2Cq_auto%3Agood%2Cfl_progressive%3Asteep%2Fhttps%253A%252F%252Fsubstack-post-media.s3.amazonaws.com%252Fpublic%252Fimages%252F85e9c773-5080-4c61-85b4-8a5fe0079234_1807x1324.png",
          "https://images.weserv.nl/?url=https%3A%2F%2Fsubstackcdn.com%2Fimage%2Ffetch%2F%24s_!m7H8!%2Cw_1456%2Cc_limit%2Cf_auto%2Cq_auto%3Agood%2Cfl_progressive%3Asteep%2Fhttps%253A%252F%252Fsubstack-post-media.s3.amazonaws.com%252Fpublic%252Fimages%252Fd7c360a7-0b31-450a-b021-2665f411a640_555x368.jpeg",
          "https://images.weserv.nl/?url=https%3A%2F%2Fsubstackcdn.com%2Fimage%2Ffetch%2F%24s_!mEpx!%2Cw_1456%2Cc_limit%2Cf_auto%2Cq_auto%3Agood%2Cfl_progressive%3Asteep%2Fhttps%253A%252F%252Fsubstack-post-media.s3.amazonaws.com%252Fpublic%252Fimages%252Fdd42f3e7-5436-4ca7-bd1f-27d2ed2a4670_1801x1312.png",
          "https://images.weserv.nl/?url=https%3A%2F%2Fsubstackcdn.com%2Fimage%2Ffetch%2F%24s_!5pmb!%2Cw_1456%2Cc_limit%2Cf_auto%2Cq_auto%3Agood%2Cfl_progressive%3Asteep%2Fhttps%253A%252F%252Fsubstack-post-media.s3.amazonaws.com%252Fpublic%252Fimages%252F85e9c773-5080-4c61-85b4-8a5fe0079234_1807x1324.png"
    ]
  },
  {
    id: "alien-sighting-ronnie-hill-1967",
    submitterName: "Alien Archivist",
    submitterLink: "https://alienarchivist.substack.com/p/ronnie-hill",
    name: "Ronnie Hill Silver-Suited Entity & Landed UFO - Oriental, North Carolina",
    category: "Alien Sightings",
    type: "Point",
    coordinates: {
      lng: -76.6908,
      lat: 35.0321
    },
    date: 1967,
    displayDate: "07-21-1967",
    description: "[HISTORIC CONTACTEE PHOTOGRAPH / PHYSICAL OCCUPANT] On July 21, 1967, 14-year-old Ronnie Hill captured an astonishing color photograph of a 3.5-foot humanoid entity wearing a seamless, reflective silver pressurized flight suit standing in a North Carolina field before a landed luminous disc. Hill's firsthand letter and technical flight diagrams submitted to UFO researchers described an intense ozone odor and a thirty-minute telepathic and observational standoff before the craft ascended vertically at hypersonic velocity.",
    source: "Ronnie Hill Firsthand Letter & Diagrams / Flying Saucers-UFO Reports / Alien Archivist",
    images: [
          "https://images.weserv.nl/?url=https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F1a5826eb-1d2e-4650-be39-5b1dd5ff1f1e_1402x997.png",
          "https://images.weserv.nl/?url=https%3A%2F%2Fsubstackcdn.com%2Fimage%2Ffetch%2F%24s_!Z5mC!%2Cw_1456%2Cc_limit%2Cf_auto%2Cq_auto%3Agood%2Cfl_progressive%3Asteep%2Fhttps%253A%252F%252Fsubstack-post-media.s3.amazonaws.com%252Fpublic%252Fimages%252F1a54d298-cca1-43ed-96c2-0434c6a7aba9_1600x1561.tif",
          "https://images.weserv.nl/?url=https%3A%2F%2Fsubstackcdn.com%2Fimage%2Ffetch%2F%24s_!RW_Q!%2Cw_1456%2Cc_limit%2Cf_auto%2Cq_auto%3Agood%2Cfl_progressive%3Asteep%2Fhttps%253A%252F%252Fsubstack-post-media.s3.amazonaws.com%252Fpublic%252Fimages%252F6a3ad461-5ec8-464e-8771-54ac42a841f6_1963x1240.png",
          "https://images.weserv.nl/?url=https%3A%2F%2Fsubstackcdn.com%2Fimage%2Ffetch%2F%24s_!64Zy!%2Cw_1456%2Cc_limit%2Cf_auto%2Cq_auto%3Agood%2Cfl_progressive%3Asteep%2Fhttps%253A%252F%252Fsubstack-post-media.s3.amazonaws.com%252Fpublic%252Fimages%252Fa6e28360-785c-4ad5-97ed-0043ae242302_1593x943.png"
    ]
  },
  {
    id: "alien-sighting-monte-verrugoli-1976",
    submitterName: "Alien Archivist",
    submitterLink: "https://alienarchivist.substack.com/p/monte-verrugoli",
    name: "Monte Verrugoli Humanoid Photograph - La Spezia, Liguria, Italy",
    category: "Alien Sightings",
    type: "Point",
    coordinates: {
      lng: 9.8,
      lat: 44.1333
    },
    date: 1976,
    displayDate: "10-24-1976",
    description: "[EUROPEAN PHYSICAL EVIDENCE / LIGURIAN FLAP] Captured on the forested ridges of Monte Verrugoli overlooking the naval port of La Spezia, this photograph reveals a bizarre, biomechanical humanoid entity lurking amidst Mediterranean brush. Investigated extensively by the Centro Ufologico Nazionale (CUN), the encounter coincided with high-frequency electromagnetic radar blackouts at nearby Italian military installations and multiple reports of luminous submerged transmedium craft navigating the Gulf of Genoa.",
    source: "Il Secolo XIX / Centro Ufologico Nazionale (CUN) / Alien Archivist",
    images: [
          "https://images.weserv.nl/?url=https%3A%2F%2Fsubstackcdn.com%2Fimage%2Ffetch%2F%24s_!8H5-!%2Cf_auto%2Cq_auto%3Agood%2Cfl_progressive%3Asteep%2Fhttps%253A%252F%252Fsubstack-post-media.s3.amazonaws.com%252Fpublic%252Fimages%252Fe725e429-5bbf-4e20-a229-a267ba4fa9fb_1073x869.webp",
          "https://images.weserv.nl/?url=https%3A%2F%2Fsubstackcdn.com%2Fimage%2Ffetch%2F%24s_!LnPg!%2Cw_1456%2Cc_limit%2Cf_auto%2Cq_auto%3Agood%2Cfl_progressive%3Asteep%2Fhttps%253A%252F%252Fsubstack-post-media.s3.amazonaws.com%252Fpublic%252Fimages%252F2eafeff3-425e-49f3-a845-d0bc671ed243_730x490.png",
          "https://images.weserv.nl/?url=https%3A%2F%2Fsubstackcdn.com%2Fimage%2Ffetch%2F%24s_!8H5-!%2Cw_1456%2Cc_limit%2Cf_auto%2Cq_auto%3Agood%2Cfl_progressive%3Asteep%2Fhttps%253A%252F%252Fsubstack-post-media.s3.amazonaws.com%252Fpublic%252Fimages%252Fe725e429-5bbf-4e20-a229-a267ba4fa9fb_1073x869.webp",
          "https://images.weserv.nl/?url=https%3A%2F%2Fsubstackcdn.com%2Fimage%2Ffetch%2F%24s_!GKzj!%2Cw_1456%2Cc_limit%2Cf_auto%2Cq_auto%3Agood%2Cfl_progressive%3Asteep%2Fhttps%253A%252F%252Fsubstack-post-media.s3.amazonaws.com%252Fpublic%252Fimages%252Fe55bc6b9-2b6e-4ca4-9e0c-d09645a60662_1090x766.png"
    ]
  },
  {
    id: "alien-sighting-martian-kings-1897",
    submitterName: "Alien Archivist",
    submitterLink: "https://alienarchivist.substack.com/p/martian-kings",
    name: "1897 Martian King Photographs - London, England",
    category: "Alien Sightings",
    type: "Point",
    coordinates: {
      lng: -0.1381,
      lat: 51.4613
    },
    date: 1897,
    displayDate: "1897",
    description: "[VICTORIAN ESOTERIC ANOMALY / EARLY CE3] Dating from the worldwide Great Airship wave of 1897, these obscure Victorian plate photographs by Charles West and J. Evans Starling capture bizarre elongated, crown-headed entities labeled 'Martian Kings'. Circulated within secretive London occult and Theosophical lodges, researchers argue whether the images document pre-cinematic optical trickery or early photographic evidence of interdimensional contactees operating decades before the modern saucer era.",
    source: "Charles West & J. Evans Starling Archives / Victorian Occult Society / Alien Archivist",
    images: [
          "https://images.weserv.nl/?url=https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F6f0ca577-db75-4867-bc60-2eeb1ae6501e_1690x1651.png",
          "https://images.weserv.nl/?url=https%3A%2F%2Fsubstackcdn.com%2Fimage%2Ffetch%2F%24s_!wD6Q!%2Cw_1456%2Cc_limit%2Cf_auto%2Cq_auto%3Agood%2Cfl_progressive%3Asteep%2Fhttps%253A%252F%252Fsubstack-post-media.s3.amazonaws.com%252Fpublic%252Fimages%252F2fea1c01-7918-48c2-9e73-1c89b355e4ab_959x1355.webp",
          "https://images.weserv.nl/?url=https%3A%2F%2Fsubstackcdn.com%2Fimage%2Ffetch%2F%24s_!Amx8!%2Cw_1456%2Cc_limit%2Cf_auto%2Cq_auto%3Agood%2Cfl_progressive%3Asteep%2Fhttps%253A%252F%252Fsubstack-post-media.s3.amazonaws.com%252Fpublic%252Fimages%252Fcd787570-3e77-4fb6-9399-7f6df0e2e2fa_859x302.webp",
          "https://images.weserv.nl/?url=https%3A%2F%2Fsubstackcdn.com%2Fimage%2Ffetch%2F%24s_!gK3T!%2Cw_1456%2Cc_limit%2Cf_auto%2Cq_auto%3Agood%2Cfl_progressive%3Asteep%2Fhttps%253A%252F%252Fsubstack-post-media.s3.amazonaws.com%252Fpublic%252Fimages%252F79913331-1ea0-4fbc-a2b4-33e64cdb6b82_588x1218.png"
    ]
  },
  {
    id: "alien-sighting-marcahuasi-1982",
    submitterName: "Alien Archivist",
    submitterLink: "https://alienarchivist.substack.com/p/marcahuasi",
    name: "Marcahuasi Plateau Alien Entity - Lima Region, Peru",
    category: "Alien Sightings",
    type: "Point",
    coordinates: {
      lng: -76.5667,
      lat: -11.7833
    },
    date: 1982,
    displayDate: "04-12-1982",
    description: "[INTERDIMENSIONAL STARGATE ENTITY] Located on the high-altitude, four-thousand-meter volcanic plateau of Marcahuasi—renowned for its cyclopean megalithic head carvings and energy vortexes—this photograph captures a luminous, elongated humanoid entity materializing among the stone formations. Investigated by esotericists and alternative archaeologists, Marcahuasi is revered as an ancient portal where extraterrestrial beings and pre-diluvian Masma culture initiates traverse dimensions.",
    source: "Dr. Daniel Ruzo Expedition Records / IPRI Peru / Alien Archivist",
    images: [
          "https://images.weserv.nl/?url=https%3A%2F%2Fsubstackcdn.com%2Fimage%2Ffetch%2F%24s_!Gk12!%2Cf_auto%2Cq_auto%3Agood%2Cfl_progressive%3Asteep%2Fhttps%253A%252F%252Fsubstack-post-media.s3.amazonaws.com%252Fpublic%252Fimages%252F50c5c424-90cf-4e3d-95ca-a0a7edef02ad_1263x871.png",
          "https://images.weserv.nl/?url=https%3A%2F%2Fsubstackcdn.com%2Fimage%2Ffetch%2F%24s_!8gGq!%2Cw_1456%2Cc_limit%2Cf_auto%2Cq_auto%3Agood%2Cfl_progressive%3Asteep%2Fhttps%253A%252F%252Fsubstack-post-media.s3.amazonaws.com%252Fpublic%252Fimages%252Fa3c994b2-cd2b-4be3-8d14-f85a3ae54f5a_300x431.jpeg",
          "https://images.weserv.nl/?url=https%3A%2F%2Fsubstackcdn.com%2Fimage%2Ffetch%2F%24s_!Gk12!%2Cw_1456%2Cc_limit%2Cf_auto%2Cq_auto%3Agood%2Cfl_progressive%3Asteep%2Fhttps%253A%252F%252Fsubstack-post-media.s3.amazonaws.com%252Fpublic%252Fimages%252F50c5c424-90cf-4e3d-95ca-a0a7edef02ad_1263x871.png",
          "https://images.weserv.nl/?url=https%3A%2F%2Fsubstackcdn.com%2Fimage%2Ffetch%2F%24s_!cMpp!%2Cw_1456%2Cc_limit%2Cf_auto%2Cq_auto%3Agood%2Cfl_progressive%3Asteep%2Fhttps%253A%252F%252Fsubstack-post-media.s3.amazonaws.com%252Fpublic%252Fimages%252F81a6bc0a-b2b4-4ceb-89d2-595ff36be45b_1293x1702.png"
    ]
  },
  {
    id: "alien-sighting-lake-travis-2007",
    submitterName: "Alien Archivist",
    submitterLink: "https://alienarchivist.substack.com/p/lake-travis",
    name: "Lake Travis Humanoid Sighting - Austin, Texas",
    category: "Alien Sightings",
    type: "Point",
    coordinates: {
      lng: -97.915,
      lat: 30.3958
    },
    date: 2007,
    displayDate: "06-15-2007",
    description: "[SUBMERGED BASES & AQUATIC HUMANOIDS] Witnesses along the limestone cliffs of Lake Travis near Austin captured photographic evidence of an anomalous, pale humanoid figure emerging from the secluded shoreline waters. The sighting fuels long-standing Texas folklore regarding subterranean cavern networks connecting subterranean aquifers, underwater UFO bases (USOs), and anomalous military research conducted beneath the Texas Hill Country.",
    source: "Texas UFO Network / MUFON Texas Reports / Alien Archivist",
    images: [
          "https://images.weserv.nl/?url=https%3A%2F%2Fsubstackcdn.com%2Fimage%2Ffetch%2F%24s_!ZBMq!%2Cf_auto%2Cq_auto%3Agood%2Cfl_progressive%3Asteep%2Fhttps%253A%252F%252Fsubstack-post-media.s3.amazonaws.com%252Fpublic%252Fimages%252F21613475-bb90-40b2-91f5-1a15f178e81d_792x488.jpeg",
          "https://images.weserv.nl/?url=https%3A%2F%2Fsubstackcdn.com%2Fimage%2Ffetch%2F%24s_!CBSs!%2Cw_1456%2Cc_limit%2Cf_auto%2Cq_auto%3Agood%2Cfl_progressive%3Asteep%2Fhttps%253A%252F%252Fsubstack-post-media.s3.amazonaws.com%252Fpublic%252Fimages%252F8342a7e6-0e47-420d-8bde-0ce274be7487_792x488.jpeg",
          "https://images.weserv.nl/?url=https%3A%2F%2Fsubstackcdn.com%2Fimage%2Ffetch%2F%24s_!u-Y7!%2Cw_1456%2Cc_limit%2Cf_auto%2Cq_auto%3Agood%2Cfl_progressive%3Asteep%2Fhttps%253A%252F%252Fsubstack-post-media.s3.amazonaws.com%252Fpublic%252Fimages%252F81b6b6eb-7445-47e9-903e-a392be49fadd_400x246.jpeg",
          "https://images.weserv.nl/?url=https%3A%2F%2Fsubstackcdn.com%2Fimage%2Ffetch%2F%24s_!ZBMq!%2Cw_1456%2Cc_limit%2Cf_auto%2Cq_auto%3Agood%2Cfl_progressive%3Asteep%2Fhttps%253A%252F%252Fsubstack-post-media.s3.amazonaws.com%252Fpublic%252Fimages%252F21613475-bb90-40b2-91f5-1a15f178e81d_792x488.jpeg"
    ]
  },
  {
    id: "alien-sighting-cedric-allingham-1954",
    submitterName: "Alien Archivist",
    submitterLink: "https://alienarchivist.substack.com/p/cedric-allingham",
    name: "Cedric Allingham Martian Contact & Saucer - Lossiemouth, Scotland",
    category: "Alien Sightings",
    type: "Point",
    coordinates: {
      lng: -3.2847,
      lat: 57.7174
    },
    date: 1954,
    displayDate: "02-18-1954",
    description: "[HISTORIC SCOTTISH CONTACTEE / SUSPECTED INTEL DISINFORMATION] In February 1954, author Cedric Allingham claimed to encounter a landed 50-foot saucer on the coastal sands near Lossiemouth, Scotland, photographing both the craft and its tall, humanoid pilot from Mars who communicated via telepathic hand gestures. Later revealed to have intricate ties to British astronomy and television personality Sir Patrick Moore, alternative researchers debate whether the Allingham affair was an elaborate satirical spoof or a MI6/MoD psychological inoculation test on the British populace.",
    source: "Flying Saucer from Mars (Allingham / Patrick Moore) / Alien Archivist",
    images: [
          "https://images.weserv.nl/?url=https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fc900a2b3-ee8d-4a53-964b-9cf4161d09b7_1939x984.png",
          "https://images.weserv.nl/?url=https%3A%2F%2Fsubstackcdn.com%2Fimage%2Ffetch%2F%24s_!O1SJ!%2Cw_1456%2Cc_limit%2Cf_auto%2Cq_auto%3Agood%2Cfl_progressive%3Asteep%2Fhttps%253A%252F%252Fsubstack-post-media.s3.amazonaws.com%252Fpublic%252Fimages%252F493bc07b-c66a-4b17-98f4-1bb4d690f2fa_933x955.png",
          "https://images.weserv.nl/?url=https%3A%2F%2Fsubstackcdn.com%2Fimage%2Ffetch%2F%24s_!YuGd!%2Cw_1456%2Cc_limit%2Cf_auto%2Cq_auto%3Agood%2Cfl_progressive%3Asteep%2Fhttps%253A%252F%252Fsubstack-post-media.s3.amazonaws.com%252Fpublic%252Fimages%252Fc8f9c560-c232-494c-8d14-582a84858f69_1071x1663.png",
          "https://images.weserv.nl/?url=https%3A%2F%2Fsubstackcdn.com%2Fimage%2Ffetch%2F%24s_!0bUv!%2Cw_1456%2Cc_limit%2Cf_auto%2Cq_auto%3Agood%2Cfl_progressive%3Asteep%2Fhttps%253A%252F%252Fsubstack-post-media.s3.amazonaws.com%252Fpublic%252Fimages%252Fb18af4b5-9fd9-4362-a8c4-6ba019c2612d_1060x1615.png"
    ]
  },
  {
    id: "alien-sighting-nicholson-1957",
    submitterName: "Alien Archivist",
    submitterLink: "https://alienarchivist.substack.com/p/nicholson-photos",
    name: "Ralph Nicholson UFO Fleet During Sputnik Observations - Paterson, New Jersey",
    category: "Alien Sightings",
    type: "Point",
    coordinates: {
      lng: -74.1718,
      lat: 40.9168
    },
    date: 1957,
    displayDate: "10-17-1957",
    description: "[COLD WAR ORBITAL CONVERGENCE] In October 1957, as the world watched the skies following the Soviet launch of Sputnik 1, amateur astronomer Ralph Nicholson of Paterson, New Jersey, photographed multiple luminous, formation-flying disc craft maneuvering in orbit. Heavily scrutinized and ultimately confiscated by Air Force Project Blue Book investigators, the images confirmed that extraterrestrial monitors were intensely observing mankind's entry into the space age.",
    source: "Paterson Morning Call / Project Blue Book Case Files / Alien Archivist",
    images: [
          "https://images.weserv.nl/?url=https%3A%2F%2Fsubstackcdn.com%2Fimage%2Ffetch%2F%24s_!3Si-!%2Cf_auto%2Cq_auto%3Agood%2Cfl_progressive%3Asteep%2Fhttps%253A%252F%252Fsubstack-post-media.s3.amazonaws.com%252Fpublic%252Fimages%252F32b2af7b-dbde-4614-8ea4-a2e94895c3fa_1402x1402.png",
          "https://images.weserv.nl/?url=https%3A%2F%2Fsubstackcdn.com%2Fimage%2Ffetch%2F%24s_!Ds_4!%2Cw_1456%2Cc_limit%2Cf_auto%2Cq_auto%3Agood%2Cfl_progressive%3Asteep%2Fhttps%253A%252F%252Fsubstack-post-media.s3.amazonaws.com%252Fpublic%252Fimages%252F2808590c-c321-4f09-83e0-ec631b9db7b7_1225x1756.png",
          "https://images.weserv.nl/?url=https%3A%2F%2Fsubstackcdn.com%2Fimage%2Ffetch%2F%24s_!7VS5!%2Cw_1456%2Cc_limit%2Cf_auto%2Cq_auto%3Agood%2Cfl_progressive%3Asteep%2Fhttps%253A%252F%252Fsubstack-post-media.s3.amazonaws.com%252Fpublic%252Fimages%252F62a7d61d-2f3a-4620-b4d1-633186a0d82a_718x145.png",
          "https://images.weserv.nl/?url=https%3A%2F%2Fsubstackcdn.com%2Fimage%2Ffetch%2F%24s_!3Si-!%2Cw_1456%2Cc_limit%2Cf_auto%2Cq_auto%3Agood%2Cfl_progressive%3Asteep%2Fhttps%253A%252F%252Fsubstack-post-media.s3.amazonaws.com%252Fpublic%252Fimages%252F32b2af7b-dbde-4614-8ea4-a2e94895c3fa_1402x1402.png"
    ]
  },
  {
    id: "alien-sighting-eucla-1955",
    submitterName: "Alien Archivist",
    submitterLink: "https://alienarchivist.substack.com/p/eucla",
    name: "Eucla Flying Saucer Pilot Photograph - Nullarbor Plain, Western Australia",
    category: "Alien Sightings",
    type: "Point",
    coordinates: {
      lng: 128.8833,
      lat: -31.6766
    },
    date: 1955,
    displayDate: "11-04-1955",
    description: "[DESERT OUTBACK OCCUPANT / PUSHBUTTON RADAR] Taken in the desolate Nullarbor Plain near the border town of Eucla, this historic Australian photograph captures what witnesses swore was the pilot of an extraterrestrial craft observing the remote transcontinental highway. Occurring directly within the flight path of British atomic bomb tests at Maralinga and the Woomera Rocket Range, researchers view the incident as part of a concentrated extraterrestrial reconnaissance of early nuclear weapons testing.",
    source: "The West Australian / Australian Flying Saucer Bureau / Alien Archivist",
    images: [
          "https://images.weserv.nl/?url=https%3A%2F%2Fsubstackcdn.com%2Fimage%2Ffetch%2F%24s_!JzAj!%2Cf_auto%2Cq_auto%3Agood%2Cfl_progressive%3Asteep%2Fhttps%253A%252F%252Fsubstack-post-media.s3.amazonaws.com%252Fpublic%252Fimages%252Fcee6e36f-9b04-419c-99f6-09d003552093_1086x1768.png",
          "https://images.weserv.nl/?url=https%3A%2F%2Fsubstackcdn.com%2Fimage%2Ffetch%2F%24s_!JzAj!%2Cw_1456%2Cc_limit%2Cf_auto%2Cq_auto%3Agood%2Cfl_progressive%3Asteep%2Fhttps%253A%252F%252Fsubstack-post-media.s3.amazonaws.com%252Fpublic%252Fimages%252Fcee6e36f-9b04-419c-99f6-09d003552093_1086x1768.png",
          "https://images.weserv.nl/?url=https%3A%2F%2Fsubstackcdn.com%2Fimage%2Ffetch%2F%24s_!Y-LI!%2Cw_1456%2Cc_limit%2Cf_auto%2Cq_auto%3Agood%2Cfl_progressive%3Asteep%2Fhttps%253A%252F%252Fsubstack-post-media.s3.amazonaws.com%252Fpublic%252Fimages%252Fe4b829f0-78b9-4a8c-a58a-5376f9b454d6_739x1066.png"
    ]
  },
  {
    id: "alien-sighting-sverdlovsk-1968",
    submitterName: "Alien Archivist",
    submitterLink: "https://alienarchivist.substack.com/p/operation-sverdlovsk",
    name: "KGB Sverdlovsk UFO Crash & Autopsy - Berezovsky / Sverdlovsk, USSR",
    category: "Alien Sightings",
    type: "Point",
    coordinates: {
      lng: 60.6057,
      lat: 56.8389
    },
    date: 1968,
    displayDate: "11-27-1968 / 03-24-1969",
    description: "[SOVIET CRASH RETRIEVAL & MEDICAL AUTOPSY] Declassified KGB film reels from the Ural military district document the November 1968 recovery of an embedded saucer-shaped disc in snow near Berezovsky, followed by a classified March 1969 medical autopsy of a recovered humanoid torso and head at the Semashko Medical Institute in Moscow. Featuring Soviet military convoys, Red Army officers, and prominent state anatomists, the footage remains the most significant leaked record of USSR extraterrestrial technology exploitation.",
    source: "Declassified KGB Special Operations Files / Semashko Medical Institute / Alien Archivist",
    images: [
          "https://images.weserv.nl/?url=https%3A%2F%2Fsubstackcdn.com%2Fimage%2Ffetch%2F%24s_!5coV!%2Cf_auto%2Cq_auto%3Agood%2Cfl_progressive%3Asteep%2Fhttps%253A%252F%252Fsubstack-post-media.s3.amazonaws.com%252Fpublic%252Fimages%252F454c1510-ddb7-46b8-8698-887ac6a3141b_3567x2345.png",
          "https://images.weserv.nl/?url=https%3A%2F%2Fsubstackcdn.com%2Fimage%2Ffetch%2F%24s_!eoGB!%2Cw_1456%2Cc_limit%2Cf_auto%2Cq_auto%3Agood%2Cfl_progressive%3Asteep%2Fhttps%253A%252F%252Fsubstack-post-media.s3.amazonaws.com%252Fpublic%252Fimages%252Fd3f34138-e95f-4009-b633-903293861759_2873x2101.png",
          "https://images.weserv.nl/?url=https%3A%2F%2Fsubstackcdn.com%2Fimage%2Ffetch%2F%24s_!cnOT!%2Cw_1456%2Cc_limit%2Cf_auto%2Cq_auto%3Agood%2Cfl_progressive%3Asteep%2Fhttps%253A%252F%252Fsubstack-post-media.s3.amazonaws.com%252Fpublic%252Fimages%252Fb3ac4141-e128-45c2-9195-d53095c4a707_3563x2346.png",
          "https://images.weserv.nl/?url=https%3A%2F%2Fsubstackcdn.com%2Fimage%2Ffetch%2F%24s_!5coV!%2Cw_1456%2Cc_limit%2Cf_auto%2Cq_auto%3Agood%2Cfl_progressive%3Asteep%2Fhttps%253A%252F%252Fsubstack-post-media.s3.amazonaws.com%252Fpublic%252Fimages%252F454c1510-ddb7-46b8-8698-887ac6a3141b_3567x2345.png"
    ]
  },
  {
    id: "alien-sighting-george-adamski-1952",
    submitterName: "Alien Archivist",
    submitterLink: "https://alienarchivist.substack.com/p/george-adamski",
    name: "George Adamski Scout Ship & Orthon Contact - Palomar Gardens, California",
    category: "Alien Sightings",
    type: "Point",
    coordinates: {
      lng: -116.8856,
      lat: 33.3444
    },
    date: 1952,
    displayDate: "11-20-1952",
    description: "[THE FOUNDING FATHER OF CONTACTEE LORE] On November 20, 1952, in the California desert near Desert Center, George Adamski and six witnesses observed a bell-shaped 'Venusian Scout Craft' land, from which emerged 'Orthon', a blond, Nordic humanoid who imparted warnings about nuclear proliferation and left plaster-cast footprints bearing esoteric symbols. Adamski's telescope photographs of bell craft with spherical underside landing gear and cigar-shaped motherships defined UFO culture, while FBI files reveal J. Edgar Hoover maintained deep surveillance on his international diplomatic tours.",
    source: "Flying Saucers Have Landed (Adamski & Leslie) / FBI Surveillance Records / Alien Archivist",
    images: [
          "https://images.weserv.nl/?url=https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F9ad5ed2e-f7f2-4987-a2c5-a1887d9e47aa_1644x1255.png",
          "https://images.weserv.nl/?url=https%3A%2F%2Fsubstackcdn.com%2Fimage%2Ffetch%2F%24s_!04lf!%2Cw_1456%2Cc_limit%2Cf_auto%2Cq_auto%3Agood%2Cfl_progressive%3Asteep%2Fhttps%253A%252F%252Fsubstack-post-media.s3.amazonaws.com%252Fpublic%252Fimages%252Fae75b2d9-306d-4347-b98b-ced160318a80_615x874.png",
          "https://images.weserv.nl/?url=https%3A%2F%2Fsubstackcdn.com%2Fimage%2Ffetch%2F%24s_!pDFn!%2Cw_1456%2Cc_limit%2Cf_auto%2Cq_auto%3Agood%2Cfl_progressive%3Asteep%2Fhttps%253A%252F%252Fsubstack-post-media.s3.amazonaws.com%252Fpublic%252Fimages%252F8bcf5f4c-30e9-48b2-b0cb-a6c0dfef096a_652x610.png",
          "https://images.weserv.nl/?url=https%3A%2F%2Fsubstackcdn.com%2Fimage%2Ffetch%2F%24s_!dbvR!%2Cw_1456%2Cc_limit%2Cf_auto%2Cq_auto%3Agood%2Cfl_progressive%3Asteep%2Fhttps%253A%252F%252Fsubstack-post-media.s3.amazonaws.com%252Fpublic%252Fimages%252F95b6c571-2b78-4b81-ab49-a54f484450dd_450x680.jpeg"
    ]
  },
  {
    id: "alien-sighting-mister-x-1950",
    submitterName: "Alien Archivist",
    submitterLink: "https://alienarchivist.substack.com/p/mister-x",
    name: "Mister X Wiesbaden U.S. Dept of War Alien Photo - Wiesbaden, Germany",
    category: "Alien Sightings",
    type: "Point",
    coordinates: {
      lng: 8.2398,
      lat: 50.0782
    },
    date: 1950,
    displayDate: "04-01-1950",
    description: "[DISINFORMATION EXPERIMENT / MILITARY PSYOPS] Published in post-war occupied Germany under the headline 'The Flying Saucer Pilot', this iconic photograph shows a 3-foot humanoid in a pressurized diving suit being escorted across a military airfield by a U.S. Army intelligence officer and German police. Widely cited in 2026 declassified Department of War dossier leaks, researchers continue to debate whether the staged 'April Fools' explanation was a hasty cover story designed to neutralize public hysteria following a genuine recovery of an occupant from a downed disc.",
    source: "Wiesbadener Tagblatt / U.S. European Command Intelligence / Alien Archivist",
    images: [
          "https://images.weserv.nl/?url=https%3A%2F%2Fsubstackcdn.com%2Fimage%2Ffetch%2F%24s_!-kYm!%2Cf_auto%2Cq_auto%3Agood%2Cfl_progressive%3Asteep%2Fhttps%253A%252F%252Fsubstack-post-media.s3.amazonaws.com%252Fpublic%252Fimages%252Ff69fb59f-49a0-41a2-a4a7-27ba5501b990_1203x1696.webp",
          "https://images.weserv.nl/?url=https%3A%2F%2Fsubstackcdn.com%2Fimage%2Ffetch%2F%24s_!UzTy!%2Cw_1456%2Cc_limit%2Cf_auto%2Cq_auto%3Agood%2Cfl_progressive%3Asteep%2Fhttps%253A%252F%252Fsubstack-post-media.s3.amazonaws.com%252Fpublic%252Fimages%252Fdbeae199-4e33-4aef-baf2-40caf6a85ddc_816x1144.png",
          "https://images.weserv.nl/?url=https%3A%2F%2Fsubstackcdn.com%2Fimage%2Ffetch%2F%24s_!XCh5!%2Cw_1456%2Cc_limit%2Cf_auto%2Cq_auto%3Agood%2Cfl_progressive%3Asteep%2Fhttps%253A%252F%252Fsubstack-post-media.s3.amazonaws.com%252Fpublic%252Fimages%252F14e7a8b9-5d0b-4448-9239-50bb6e9e49f9_2131x1401.png",
          "https://images.weserv.nl/?url=https%3A%2F%2Fsubstackcdn.com%2Fimage%2Ffetch%2F%24s_!-kYm!%2Cw_1456%2Cc_limit%2Cf_auto%2Cq_auto%3Agood%2Cfl_progressive%3Asteep%2Fhttps%253A%252F%252Fsubstack-post-media.s3.amazonaws.com%252Fpublic%252Fimages%252Ff69fb59f-49a0-41a2-a4a7-27ba5501b990_1203x1696.webp"
    ]
  },
  {
    id: "alien-sighting-rama-brazil-1984",
    submitterName: "Alien Archivist",
    submitterLink: "https://alienarchivist.substack.com/p/rama",
    name: "João Valério da Silva’s Rama Entity Photographs - Maringá, Paraná, Brazil",
    category: "Alien Sightings",
    type: "Point",
    coordinates: {
      lng: -51.9333,
      lat: -23.4205
    },
    date: 1984,
    displayDate: "02-12-1984",
    description: "[BRAZILIAN INTERIOR CLOSE ENCOUNTER] Photographed in the agricultural plains of Maringá, Paraná, by João Valério da Silva, these remarkable images capture an extraterrestrial humanoid dubbed the 'Rama' entity standing motionless in broad daylight. Evaluated by Brazilian military officers and private ufological organizations, the photographs provide vivid physical detail of a thin-limbed, helmeted extraterrestrial scout monitoring terrestrial agrarian infrastructure.",
    source: "Diário do Norte do Paraná / Centro de Investigações Ufológicas / Alien Archivist",
    images: [
          "https://images.weserv.nl/?url=https%3A%2F%2Fsubstackcdn.com%2Fimage%2Ffetch%2F%24s_!5wCO!%2Cf_auto%2Cq_auto%3Agood%2Cfl_progressive%3Asteep%2Fhttps%253A%252F%252Fsubstack-post-media.s3.amazonaws.com%252Fpublic%252Fimages%252Fae6a0205-fcd6-467c-a752-aaace662e638_1471x969.png",
          "https://images.weserv.nl/?url=https%3A%2F%2Fsubstackcdn.com%2Fimage%2Ffetch%2F%24s_!prV_!%2Cw_1456%2Cc_limit%2Cf_auto%2Cq_auto%3Agood%2Cfl_progressive%3Asteep%2Fhttps%253A%252F%252Fsubstack-post-media.s3.amazonaws.com%252Fpublic%252Fimages%252F6c5c0f7a-3e72-47ac-8c03-87665781b0fb_1821x2010.png",
          "https://images.weserv.nl/?url=https%3A%2F%2Fsubstackcdn.com%2Fimage%2Ffetch%2F%24s_!oiWZ!%2Cw_1456%2Cc_limit%2Cf_auto%2Cq_auto%3Agood%2Cfl_progressive%3Asteep%2Fhttps%253A%252F%252Fsubstack-post-media.s3.amazonaws.com%252Fpublic%252Fimages%252Fe59ea5fc-3951-4b45-96d3-19830402d665_1472x969.png",
          "https://images.weserv.nl/?url=https%3A%2F%2Fsubstackcdn.com%2Fimage%2Ffetch%2F%24s_!1su9!%2Cw_1456%2Cc_limit%2Cf_auto%2Cq_auto%3Agood%2Cfl_progressive%3Asteep%2Fhttps%253A%252F%252Fsubstack-post-media.s3.amazonaws.com%252Fpublic%252Fimages%252Ff11c9f49-89e4-4189-9644-49d10a45f2c4_1472x970.png"
    ]
  },
  {
    id: "alien-sighting-mars-man-1950",
    submitterName: "Alien Archivist",
    submitterLink: "https://alienarchivist.substack.com/p/mars-man",
    name: "The Mars Man Alien Image - Frankfurt / Wiesbaden, Germany",
    category: "Alien Sightings",
    type: "Point",
    coordinates: {
      lng: 8.6821,
      lat: 50.1109
    },
    date: 1950,
    displayDate: "03-28-1950",
    description: "[POST-WAR CRASH RETRIEVAL LEAK] Associated with early American intelligence operations in occupied Western Germany, the 'Mars Man' photograph displays an unearthly diminutive entity in metallic protective garment standing beside allied military personnel. Re-emerging in 2026 U.S. Department of War declassified archival releases, the image is viewed by disclosure advocates as photographic confirmation of covert recovery operations orchestrated by the Counter Intelligence Corps (CIC).",
    source: "U.S. Department of War Declassified Records / German Press Agency / Alien Archivist",
    images: [
          "https://images.weserv.nl/?url=https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F985d2f00-9b93-41fd-9a6d-71a59fba3188_467x223.png",
          "https://images.weserv.nl/?url=https%3A%2F%2Fsubstackcdn.com%2Fimage%2Ffetch%2F%24s_!Sbvg!%2Cw_1456%2Cc_limit%2Cf_auto%2Cq_auto%3Agood%2Cfl_progressive%3Asteep%2Fhttps%253A%252F%252Fsubstack-post-media.s3.amazonaws.com%252Fpublic%252Fimages%252Fb63333be-64e9-45c5-ad52-bd3bbbd4665b_2655x1026.png",
          "https://images.weserv.nl/?url=https%3A%2F%2Fsubstackcdn.com%2Fimage%2Ffetch%2F%24s_!ZYY6!%2Cw_1456%2Cc_limit%2Cf_auto%2Cq_auto%3Agood%2Cfl_progressive%3Asteep%2Fhttps%253A%252F%252Fsubstack-post-media.s3.amazonaws.com%252Fpublic%252Fimages%252F154cf366-2a93-4cbf-85c8-085bad16decd_2657x826.png",
          "https://images.weserv.nl/?url=https%3A%2F%2Fsubstackcdn.com%2Fimage%2Ffetch%2F%24s_!BSoy!%2Cw_1456%2Cc_limit%2Cf_auto%2Cq_auto%3Agood%2Cfl_progressive%3Asteep%2Fhttps%253A%252F%252Fsubstack-post-media.s3.amazonaws.com%252Fpublic%252Fimages%252Fa9d1386a-5ad0-4cae-99d4-fecb36de6165_1402x1158.png"
    ]
  },
  {
    id: "alien-sighting-rocca-pia-1956",
    submitterName: "Alien Archivist",
    submitterLink: "https://alienarchivist.substack.com/p/rocca-pia",
    name: "Rocca Pia & Amicizia W56 Alien Alliance - Rocca Pia, Abruzzo, Italy",
    category: "Alien Sightings",
    type: "Point",
    coordinates: {
      lng: 13.9833,
      lat: 41.9333
    },
    date: 1956,
    displayDate: "1956–1976",
    description: "[THE ILLUSTRIOUS 'AMICIZIA' / W56 CONTACT] Spanning two decades across central Italy, the Friendship Case documented ongoing contact between Italian diplomatic and scientific elites and a benevolent extraterrestrial faction known as the 'W56'. Operating from colossal subterranean bases carved under the Adriatic coastline and Abruzzo mountains, the entities allowed Italian witnesses (including Bruno Sammaciccia and diplomat Stefano Breccia) to photograph their interiors, control consoles, and humanoid pilots standing up to 10 feet tall, locked in a silent proxy conflict against hostile 'CTR' entities.",
    source: "Stefano Breccia (Contattismi di Massa) / Bruno Sammaciccia Testimony / Alien Archivist",
    images: [
          "https://images.weserv.nl/?url=https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F6e11dab1-c839-450f-86e7-30179d19cbe3_1200x643.png",
          "https://images.weserv.nl/?url=https%3A%2F%2Fsubstackcdn.com%2Fimage%2Ffetch%2F%24s_!iEQ0!%2Cw_1456%2Cc_limit%2Cf_auto%2Cq_auto%3Agood%2Cfl_progressive%3Asteep%2Fhttps%253A%252F%252Fsubstack-post-media.s3.amazonaws.com%252Fpublic%252Fimages%252Fac69ec90-c863-4491-9f58-22decb6f1702_868x600.jpeg",
          "https://images.weserv.nl/?url=https%3A%2F%2Fsubstackcdn.com%2Fimage%2Ffetch%2F%24s_!W_M1!%2Cw_1456%2Cc_limit%2Cf_auto%2Cq_auto%3Agood%2Cfl_progressive%3Asteep%2Fhttps%253A%252F%252Fsubstack-post-media.s3.amazonaws.com%252Fpublic%252Fimages%252F94f7c887-aafb-410d-889c-1e2375954b34_1326x1176.png",
          "https://images.weserv.nl/?url=https%3A%2F%2Fsubstackcdn.com%2Fimage%2Ffetch%2F%24s_!LgsU!%2Cw_1456%2Cc_limit%2Cf_auto%2Cq_auto%3Agood%2Cfl_progressive%3Asteep%2Fhttps%253A%252F%252Fsubstack-post-media.s3.amazonaws.com%252Fpublic%252Fimages%252F7e026049-f946-497d-9b6b-1daacb141683_1210x1279.png"
    ]
  },
  {
    id: "alien-sighting-brother-bocco-1954",
    submitterName: "Alien Archivist",
    submitterLink: "https://alienarchivist.substack.com/p/lee-crandall",
    name: "Lee Crandall & Brother Bocco the Venusian - Los Angeles, California",
    category: "Alien Sightings",
    type: "Point",
    coordinates: {
      lng: -118.2437,
      lat: 34.0522
    },
    date: 1954,
    displayDate: "06-18-1954",
    description: "[1950s HOLLYWOOD CONTACTEE / VENUSIAN MESSENGER] In the summer of 1954 in Los Angeles, electronics technician Lee Crandall photographed and interacted with 'Brother Bocco', a purported representative of the Venusian spiritual hierarchy. Transmitting messages of global disarmament, anti-gravitic engineering, and etheric science, Crandall's photographic dossier circulated heavily throughout Southern California occult societies and the Giant Rock Space Conventions.",
    source: "Understanding Magazine / Borderland Sciences Research / Alien Archivist",
    images: [
          "https://images.weserv.nl/?url=https%3A%2F%2Fsubstackcdn.com%2Fimage%2Ffetch%2F%24s_!n9Hm!%2Cf_auto%2Cq_auto%3Agood%2Cfl_progressive%3Asteep%2Fhttps%253A%252F%252Fsubstack-post-media.s3.amazonaws.com%252Fpublic%252Fimages%252F16022fce-d97f-4636-a3b1-e4be1b23377c_525x512.jpeg",
          "https://images.weserv.nl/?url=https%3A%2F%2Fsubstackcdn.com%2Fimage%2Ffetch%2F%24s_!jzen!%2Cw_1456%2Cc_limit%2Cf_auto%2Cq_auto%3Agood%2Cfl_progressive%3Asteep%2Fhttps%253A%252F%252Fsubstack-post-media.s3.amazonaws.com%252Fpublic%252Fimages%252F4d35a6bd-818f-4a75-98f7-2a5fbc41700a_615x1093.png",
          "https://images.weserv.nl/?url=https%3A%2F%2Fsubstackcdn.com%2Fimage%2Ffetch%2F%24s_!n9Hm!%2Cw_1456%2Cc_limit%2Cf_auto%2Cq_auto%3Agood%2Cfl_progressive%3Asteep%2Fhttps%253A%252F%252Fsubstack-post-media.s3.amazonaws.com%252Fpublic%252Fimages%252F16022fce-d97f-4636-a3b1-e4be1b23377c_525x512.jpeg",
          "https://images.weserv.nl/?url=https%3A%2F%2Fsubstackcdn.com%2Fimage%2Ffetch%2F%24s_!j1te!%2Cw_1456%2Cc_limit%2Cf_auto%2Cq_auto%3Agood%2Cfl_progressive%3Asteep%2Fhttps%253A%252F%252Fsubstack-post-media.s3.amazonaws.com%252Fpublic%252Fimages%252F9ca5a740-2188-4d67-8b6c-d407543d7dd8_152x314.jpeg"
    ]
  },
  {
    id: "alien-sighting-admiral-byrd-1929",
    submitterName: "Alien Archivist",
    submitterLink: "https://alienarchivist.substack.com/p/admiral-byrd",
    name: "Admiral Byrd Antarctic Flying Disc Photo - Little America, Antarctica",
    category: "Alien Sightings",
    type: "Point",
    coordinates: {
      lng: -163.8333,
      lat: -78.5
    },
    date: 1929,
    displayDate: "12-1929",
    description: "[EARLY POLAR ANOMALY / OPERATION HIGHJUMP PRECURSOR] Discovered by researcher Joe Fex in declassified photographic negative archives of Admiral Richard E. Byrd's 1928–1930 Antarctic expedition at Little America, this glass plate image captures a distinct aerodynamic disc craft hovering silently over the frozen Ross Ice Shelf. Decades before Operation Highjump and the modern saucer era, this photograph provides proof that non-human craft have maintained permanent surveillance over polar anomalies and subterranean inner earth apertures.",
    source: "Joe Fex Discovery / Byrd Antarctic Expedition Archives / Alien Archivist",
    images: [
          "https://images.weserv.nl/?url=https%3A%2F%2Fsubstackcdn.com%2Fimage%2Ffetch%2F%24s_!ORKR!%2Cf_auto%2Cq_auto%3Agood%2Cfl_progressive%3Asteep%2Fhttps%253A%252F%252Fsubstack-post-media.s3.amazonaws.com%252Fpublic%252Fimages%252F2d8ff8b6-394c-4975-aa7c-a2fa46215902_1772x1199.jpeg",
          "https://images.weserv.nl/?url=https%3A%2F%2Fsubstackcdn.com%2Fimage%2Ffetch%2F%24s_!uJDJ!%2Cw_1456%2Cc_limit%2Cf_auto%2Cq_auto%3Agood%2Cfl_progressive%3Asteep%2Fhttps%253A%252F%252Fsubstack-post-media.s3.amazonaws.com%252Fpublic%252Fimages%252F5f49ac41-f612-49f7-8e58-c4b54dc17b68_368x540.jpeg",
          "https://images.weserv.nl/?url=https%3A%2F%2Fsubstackcdn.com%2Fimage%2Ffetch%2F%24s_!SEOM!%2Cw_1456%2Cc_limit%2Cf_auto%2Cq_auto%3Agood%2Cfl_progressive%3Asteep%2Fhttps%253A%252F%252Fsubstack-post-media.s3.amazonaws.com%252Fpublic%252Fimages%252F526dda01-f57f-4686-850e-c7b184a984c8_932x1295.jpeg",
          "https://images.weserv.nl/?url=https%3A%2F%2Fsubstackcdn.com%2Fimage%2Ffetch%2F%24s_!FK8j!%2Cw_1456%2Cc_limit%2Cf_auto%2Cq_auto%3Agood%2Cfl_progressive%3Asteep%2Fhttps%253A%252F%252Fsubstack-post-media.s3.amazonaws.com%252Fpublic%252Fimages%252F35cd31c4-da5e-4c59-8268-76f352636e4b_1893x1444.png"
    ]
  },
  {
    id: "alien-sighting-chris-bledsoe-2007",
    submitterName: "Alien Archivist",
    submitterLink: "https://alienarchivist.substack.com/p/chris-bledsoe",
    name: "Chris Bledsoe Encounters: The Lady & Luminous Orbs - Fayetteville, North Carolina",
    category: "Alien Sightings",
    type: "Point",
    coordinates: {
      lng: -78.8784,
      lat: 35.0527
    },
    date: 2007,
    displayDate: "01-08-2007",
    description: "[MODERN INTELLIGENCE-VETTED INTERDIMENSIONAL CONTACT] On January 8, 2007, beside the Cape Fear River, contractor Chris Bledsoe experienced missing time and close-range encounters with glowing non-human entities. Bledsoe subsequently became a nexus for spontaneous luminous plasma orbs, multi-dimensional entities, and apparitions of 'The Lady' (a divine celestial feminine presence). Thoroughly investigated and validated by high-ranking CIA officers (Jim Semivan), NASA scientists, and intelligence interrogators, the Bledsoe case represents the premier modern convergence of military intelligence, phenomenology, and spiritual reality.",
    source: "UFO of God (Chris Bledsoe) / NASA & CIA Interrogations / MUFON Case #8043 / Alien Archivist",
    images: [
          "https://images.weserv.nl/?url=https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F066c664a-ddd4-492a-94db-6cb13c80e5ee_1672x941.png",
          "https://images.weserv.nl/?url=https%3A%2F%2Fsubstackcdn.com%2Fimage%2Ffetch%2F%24s_!vGRD!%2Cw_1456%2Cc_limit%2Cf_auto%2Cq_auto%3Agood%2Cfl_progressive%3Asteep%2Fhttps%253A%252F%252Fsubstack-post-media.s3.amazonaws.com%252Fpublic%252Fimages%252F26b479e3-d4b8-476a-b963-2895c6699073_600x900.jpeg",
          "https://images.weserv.nl/?url=https%3A%2F%2Fsubstackcdn.com%2Fimage%2Ffetch%2F%24s_!Pv0t!%2Cw_1456%2Cc_limit%2Cf_auto%2Cq_auto%3Agood%2Cfl_progressive%3Asteep%2Fhttps%253A%252F%252Fsubstack-post-media.s3.amazonaws.com%252Fpublic%252Fimages%252F15957680-6c15-4167-aeb2-678579b4f427_1152x2048.webp",
          "https://images.weserv.nl/?url=https%3A%2F%2Fsubstackcdn.com%2Fimage%2Ffetch%2F%24s_!x7vY!%2Cw_1456%2Cc_limit%2Cf_auto%2Cq_auto%3Agood%2Cfl_progressive%3Asteep%2Fhttps%253A%252F%252Fsubstack-post-media.s3.amazonaws.com%252Fpublic%252Fimages%252F256434cd-5fe7-4ea8-859d-fb8e080a6908_1110x1696.png"
    ]
  },
  {
    id: "alien-sighting-el-condesito-1974",
    submitterName: "Alien Archivist",
    submitterLink: "https://alienarchivist.substack.com/p/el-condesito",
    name: "Julio Marvizón El Condesito Humanoid & Disc - Huelva, Andalusia, Spain",
    category: "Alien Sightings",
    type: "Point",
    coordinates: {
      lng: -6.5975,
      lat: 37.3083
    },
    date: 1974,
    displayDate: "11-28-1974",
    description: "[IBERIAN ENTITY PHOTOGRAPH / AIR FORCE INVESTIGATION] Captured near Rociana del Condado in Huelva, Spain, by renowned Spanish meteorologist and investigator Julio Marvizón, this photograph reveals an illuminated saucer craft and an enigmatic humanoid occupant standing among Andalusian olive groves. The case triggered a classified investigation by the Spanish Air Force (Ejército del Aire), with declassified radar tracking confirming anomalous supersonic targets over the Gulf of Cádiz.",
    source: "Julio Marvizón Photographic Archive / Spanish Air Force Declassified Files / Alien Archivist",
    images: [
          "https://images.weserv.nl/?url=https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F13b12836-4a9b-4a21-ad14-0037ce8d9f20_1672x941.png"
    ]
  },
  {
    id: "alien-sighting-gina-jones-1989",
    submitterName: "Alien Archivist",
    submitterLink: "https://alienarchivist.substack.com/p/gina-jones",
    name: "Gina Jones Check-Mark Craft & Window Humanoid - Greenville, South Carolina",
    category: "Alien Sightings",
    type: "Point",
    coordinates: {
      lng: -82.394,
      lat: 34.8526
    },
    date: 1989,
    displayDate: "10-31-1989",
    description: "[HALLOWEEN FORMATION & COCKPIT OCCUPANT] On Halloween night 1989 in Greenville, South Carolina, Gina Jones captured dramatic VHS camcorder footage of a luminous check-mark / boomerang UFO formation. Upon stabilizing and zooming into the main craft's illuminated portal window, researchers observed the distinct head and shoulders of an alien humanoid observing the terrain below. The recording was extensively analyzed by optical physicists and featured in regional news broadcasts.",
    source: "Gina Jones Video Archive / MUFON South Carolina / Alien Archivist",
    images: [
          "https://images.weserv.nl/?url=https%3A%2F%2Fsubstackcdn.com%2Fimage%2Ffetch%2F%24s_!7Fla!%2Cf_auto%2Cq_auto%3Agood%2Cfl_progressive%3Asteep%2Fhttps%253A%252F%252Fsubstack-post-media.s3.amazonaws.com%252Fpublic%252Fimages%252F92fa0a6f-3943-432d-8cc9-85d8ef9469c9_2880x2158.png"
    ]
  },
  {
    id: "alien-sighting-the-guardian-1989",
    submitterName: "Alien Archivist",
    submitterLink: "https://alienarchivist.substack.com/p/the-guardian",
    name: "The Guardian Carp Landing & Alien Photos - Carp, Ontario, Canada",
    category: "Alien Sightings",
    type: "Point",
    coordinates: {
      lng: -76.0333,
      lat: 45.35
    },
    date: 1989,
    displayDate: "11-04-1989",
    description: "[CANADIAN SHADOW GOVERNMENT LEAK] In November 1989, an anonymous whistleblower known only as 'The Guardian' mailed VHS tapes, photocopied classified Canadian Department of National Defence documents, and photographs to UFO investigators. The footage shows a glowing disc landing in a farm field near Carp, Ontario, followed by close-up photographs of a gray-skinned extraterrestrial entity with large black eyes peering through the darkness. The incident is believed to be linked to secret subterranean facilities in the Ottawa Valley.",
    source: "Canadian Department of National Defence / CUFORN Archive / Graham Lightfoot / Alien Archivist",
    images: [
          "https://images.weserv.nl/?url=https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F94163ef6-467b-43cd-906b-b7b0b24d956b_2728x1534.png"
    ]
  }
];
