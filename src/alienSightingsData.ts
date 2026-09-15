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
  }
];


