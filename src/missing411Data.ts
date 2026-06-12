export interface Missing411Case {
  id: string;
  name: string;
  category: 'Missing 411';
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

export const MISSING_411_DATA: Missing411Case[] = [
  {
    id: "missing411-dennis-martin",
    name: "Dennis Martin - Spence Field, GSMNP",
    category: "Missing 411",
    type: "Point",
    coordinates: { lng: -83.7239, lat: 35.5658 },
    date: 1969,
    displayDate: "June 14, 1969",
    description: "6-year-old Dennis Martin disappeared while playing hide-and-seek at Spence Field in the Great Smoky Mountains National Park. He went behind a bush to hide and vanished within minutes. Despite the largest search in park history involving 1,400 searchers and heavy military presence, no clue or trace was ever found.",
    source: "David Paulides - Missing 411 / Official NPS Records",
    images: []
  },
  {
    id: "missing411-jaryd-atadero",
    name: "Jaryd Atadero - Roosevelt National Forest",
    category: "Missing 411",
    type: "Point",
    coordinates: { lng: -105.8080, lat: 40.6270 },
    date: 1999,
    displayDate: "October 2, 1999",
    description: "3-year-old Jaryd Atadero ran ahead of a group on the Big South Trail in the Comanche Peak Wilderness. He vanished after speaking to two fishermen. In 2003, hikers found his intact clothing and skull fragment on a steep mountain face 550 feet above the trail, in an area previously searched multiple times.",
    source: "David Paulides - Missing 411 / Larimer County Sheriff",
    images: []
  },
  {
    id: "missing411-stacy-arras",
    name: "Stacy Arras - Sunrise Camp, Yosemite",
    category: "Missing 411",
    type: "Point",
    coordinates: { lng: -119.4303, lat: 37.8031 },
    date: 1981,
    displayDate: "July 17, 1981",
    description: "14-year-old Stacy Arras left her horse-packing group at Sunrise High Sierra Camp in Yosemite to photograph nearby lakes. An elderly companion stopped to rest while Stacy walked slightly ahead. She went behind a group of trees and was never seen again. Her camera lens cap was the only item recovered.",
    source: "David Paulides - Missing 411 / National Park Service",
    images: []
  },
  {
    id: "missing411-charles-mccullar",
    name: "Charles McCullar - Crater Lake National Park",
    category: "Missing 411",
    type: "Point",
    coordinates: { lng: -122.1800, lat: 42.8900 },
    date: 1975,
    displayDate: "January 1975",
    description: "19-year-old photographer Charles McCullar vanished during a winter visit to Crater Lake National Park. In October 1976, hikers found his remains in a remote area near Bybee Creek. His boots were found with socks inside, but the leg bones were missing, and his pants were unzipped, suggesting paradoxical undressing or bizarre circumstances.",
    source: "David Paulides - Missing 411 / NPS Search Files",
    images: []
  },
  {
    id: "missing411-danny-filippidis",
    name: "Danny Filippidis - Whiteface Mountain, NY",
    category: "Missing 411",
    type: "Point",
    coordinates: { lng: -73.8837, lat: 44.3658 },
    date: 2018,
    displayDate: "February 7, 2018",
    description: "Danny Filippidis, a firefighter on a ski trip at Whiteface Mountain, went to get his phone from his car and vanished. Six days later, he was found alive in Sacramento, California—nearly 3,000 miles away—still wearing his ski boots, helmet, and gear. He suffered from a head injury and amnesia with no memory of how he traveled across the country.",
    source: "David Paulides - Missing 411 / New York State Police",
    images: []
  },
  {
    id: "missing411-deorr-kunz",
    name: "DeOrr Kunz Jr. - Leadore, ID",
    category: "Missing 411",
    type: "Point",
    coordinates: { lng: -113.4000, lat: 44.6000 },
    date: 2015,
    displayDate: "July 10, 2015",
    description: "2-year-old DeOrr Kunz Jr. vanished in a brief four-minute window while left near his great-grandfather at the remote Timber Creek Campground. No traces of clothing, tracks, or biological evidence were ever found, and tracking dogs failed to establish any scent trail.",
    source: "David Paulides - Missing 411 / Lemhi County Sheriff",
    images: []
  },
  {
    id: "missing411-aaron-hedges",
    name: "Aaron Hedges - Crazy Mountains, MT",
    category: "Missing 411",
    type: "Point",
    coordinates: { lng: -110.4000, lat: 46.0100 },
    date: 2014,
    displayDate: "September 2014",
    description: "Hunter Aaron Hedges got separated from his companions in the Crazy Mountains. His boots and water bottle were found miles away in a cache, and his remains were discovered two years later on a ranch on the opposite side of the mountains, far from his last known location.",
    source: "David Paulides - Missing 411 / Gallatin County SAR",
    images: []
  },
  {
    id: "missing411-bobby-bizup",
    name: "Bobby Bizup - Camp St. Malo, CO",
    category: "Missing 411",
    type: "Point",
    coordinates: { lng: -105.5387, lat: 40.2462 },
    date: 1958,
    displayDate: "August 15, 1958",
    description: "10-year-old Bobby Bizup went missing from a Catholic camp near Mount Meeker. A sudden severe storm hit the mountain shortly after he disappeared. His partial remains and clothing were discovered high on a steep, rocky ridge a year later.",
    source: "David Paulides - Missing 411 / Boulder County Sheriff",
    images: []
  },
  {
    id: "missing411-keith-parkins",
    name: "Keith Parkins - Ritter, OR (Found Alive)",
    category: "Missing 411",
    type: "Point",
    coordinates: { lng: -119.1429, lat: 44.8916 },
    date: 1952,
    displayDate: "April 10, 1952",
    description: "2-year-old Keith Parkins wandered away from his family ranch in Ritter, Oregon. Despite freezing temperatures, he was found alive 19 hours later, lying face down on a frozen lake 8 miles away. To reach this location, the toddler would have had to cross a mountain range on foot—an impossible feat for a child his age.",
    source: "David Paulides - Missing 411 / Grant County Sheriff",
    images: []
  },
  {
    id: "missing411-geraldine-largay",
    name: "Geraldine Largay - Appalachian Trail, ME",
    category: "Missing 411",
    type: "Point",
    coordinates: { lng: -70.4503, lat: 45.0151 },
    date: 2013,
    displayDate: "July 22, 2013",
    description: "66-year-old Geraldine Largay wandered off the Appalachian Trail to relieve herself and became lost. She survived for 26 days in a makeshift campsite. Her remains were found two years later inside her tent in a dense forest area, only a mile from the trail and near a military training facility.",
    source: "David Paulides - Missing 411 / Maine Warden Service",
    images: []
  },
  {
    id: "missing411-alfred-beilhartz",
    name: "Alfred Beilhartz - Fall River, RMNP",
    category: "Missing 411",
    type: "Point",
    coordinates: { lng: -105.7480, lat: 40.4050 },
    date: 1938,
    displayDate: "July 2, 1938",
    description: "4-year-old Alfred Beilhartz was hiking with his family near Fall River in Rocky Mountain National Park. He ran ahead to join his father at the river and vanished. Scent dogs lost track at the river bank. Hikers reported seeing a child fitting his description on a high, inaccessible ridge miles away looking down, but he was never found.",
    source: "David Paulides - Missing 411 / Denver Post",
    images: []
  },
  {
    id: "missing411-trenny-gibson",
    name: "Trenny Gibson - Andrews Bald, GSMNP",
    category: "Missing 411",
    type: "Point",
    coordinates: { lng: -83.4980, lat: 35.5620 },
    date: 1976,
    displayDate: "October 8, 1976",
    description: "16-year-old student Trenny Gibson vanished while on a high school field trip to Clingmans Dome and Andrews Bald. She walked slightly ahead of her classmates around a bend in the trail. Despite her friends being only yards behind her, she was never seen again, and search dogs found no scent trail.",
    source: "David Paulides - Missing 411 / Tennessee State Police",
    images: []
  },
  {
    id: "missing411-laura-bradbury",
    name: "Laura Bradbury - Joshua Tree National Park",
    category: "Missing 411",
    type: "Point",
    coordinates: { lng: -116.1558, lat: 34.1200 },
    date: 1984,
    displayDate: "October 18, 1984",
    description: "3-year-old Laura Bradbury vanished from the Indian Cove Campground in Joshua Tree. She had walked to a portable toilet with her brother, who returned a moment before her. In that brief window, she disappeared. Years later, a tiny skull fragment was found in the area and confirmed to be hers via DNA testing.",
    source: "David Paulides - Missing 411 / San Bernardino Sheriff",
    images: []
  },
  {
    id: "missing411-mel-nadel",
    name: "Mel Nadel - Santa Fe National Forest",
    category: "Missing 411",
    type: "Point",
    coordinates: { lng: -105.5535, lat: 35.7672 },
    date: 2009,
    displayDate: "September 5, 2009",
    description: "Experienced hunter Mel Nadel stepped away from his companions on Elk Mountain in clear, mild weather. He stated he was taking a quick walk and vanished. Despite a massive search using thermal imaging and dogs, no sign of his clothing, gear, or remains was ever located.",
    source: "David Paulides - Missing 411 / New Mexico State Police",
    images: []
  },
  {
    id: "missing411-tom-messick",
    name: "Tom Messick - Lake George Wild Forest, NY",
    category: "Missing 411",
    type: "Point",
    coordinates: { lng: -73.7494, lat: 43.6764 },
    date: 2015,
    displayDate: "October 22, 2015",
    description: "82-year-old Tom Messick, an experienced hunter, was stationed at a watch post during a group drive. When the drivers arrived at his location, he was gone without a sound. Search dogs could not establish a scent, and a massive search turned up no traces of his rifle or gear.",
    source: "David Paulides - Missing 411 / Warren County Sheriff",
    images: []
  },
  {
    id: "missing411-samuel-boehlke",
    name: "Samuel Boehlke - Crater Lake National Park",
    category: "Missing 411",
    type: "Point",
    coordinates: { lng: -122.1000, lat: 42.9000 },
    date: 2006,
    displayDate: "October 14, 2006",
    description: "8-year-old Samuel Boehlke, who had mild autism, ran up a dirt slope away from his father in the late afternoon. He disappeared over the ridge into a yellow pumice field. A multi-day search involving dogs, helicopters, and ground crews yielded no trace of the boy.",
    source: "David Paulides - Missing 411 / NPS Search Reports",
    images: []
  },
  {
    id: "missing411-polly-melton",
    name: "Polly Melton - Deep Creek Trail, GSMNP",
    category: "Missing 411",
    type: "Point",
    coordinates: { lng: -83.4300, lat: 35.4600 },
    date: 1981,
    displayDate: "September 25, 1981",
    description: "58-year-old Polly Melton was hiking with two friends on the Deep Creek Trail in the Great Smoky Mountains. Walking slightly ahead of them on a familiar route, she rounded a bend and vanished. She had no physical impairments, and a massive search found no clues to her whereabouts.",
    source: "David Paulides - Missing 411 / National Park Service",
    images: []
  },
  {
    id: "missing411-james-mcgrogan",
    name: "James McGrogan - Vail, CO",
    category: "Missing 411",
    type: "Point",
    coordinates: { lng: -106.3520, lat: 39.6964 },
    date: 2014,
    displayDate: "March 14, 2014",
    description: "39-year-old doctor James McGrogan split from his backcountry skiing group near Eiseman Hut to check a trail route. He vanished. His remains were found weeks later at the bottom of a waterfall, in an area that search teams had already thoroughly scanned multiple times.",
    source: "David Paulides - Missing 411 / Eagle County Sheriff",
    images: []
  },
  {
    id: "missing411-bobby-carter",
    name: "Bobby Carter - Cheyenne, WY (Found Alive)",
    category: "Missing 411",
    type: "Point",
    coordinates: { lng: -104.8200, lat: 41.1400 },
    date: 1950,
    displayDate: "July 1950",
    description: "4-year-old Bobby Carter disappeared from his yard. After a three-day search, he was found alive and well in a remote canyon miles away. He had survived freezing nights and had traveled a distance that searchers deemed impossible for a toddler without assistance.",
    source: "David Paulides - Missing 411 Files",
    images: []
  },
  {
    id: "missing411-jeannie-hesselschwerdt",
    name: "Jeannie Hesselschwerdt - Yosemite",
    category: "Missing 411",
    type: "Point",
    coordinates: { lng: -119.5000, lat: 37.8000 },
    date: 1947,
    displayDate: "July 9, 1947",
    description: "37-year-old tourist Jeannie Hesselschwerdt wandered away from her husband near their campsite in Yosemite National Park. Her footprints were tracked into a nearby meadow, where they abruptly stopped with no signs of struggle, and she was never found.",
    source: "David Paulides - Missing 411 / Yosemite Archives",
    images: []
  },
  {
    id: "missing411-maurice-dametz",
    name: "Maurice Dametz - Pike National Forest",
    category: "Missing 411",
    type: "Point",
    coordinates: { lng: -105.1000, lat: 39.0500 },
    date: 1996,
    displayDate: "July 29, 1996",
    description: "84-year-old retired minister Maurice 'Doc' Dametz, who suffered from severe physical limitations and could only take small steps, was hunting for fossils with a friend. While the friend walked to their car to pack, Maurice vanished from the dig site in less than ten minutes.",
    source: "David Paulides - Missing 411 / Douglas County Sheriff",
    images: []
  },
  {
    id: "missing411-steven-kubacki",
    name: "Steven Kubacki - Saugatuck, MI (Found Alive)",
    category: "Missing 411",
    type: "Point",
    coordinates: { lng: -86.2023, lat: 42.6548 },
    date: 1978,
    displayDate: "February 1978",
    description: "23-year-old Steven Kubacki vanished while snowshoeing on frozen Lake Michigan near Saugatuck. Searchers found his footprints ending at the water's edge, his backpack, and snowshoes. 15 months later, he mysteriously woke up in a field in Pittsfield, Massachusetts, wearing unfamiliar clothes, with no memory of the elapsed time.",
    source: "David Paulides - Missing 411 Files",
    images: []
  },
  {
    id: "missing411-damian-mckenzie",
    name: "Damian McKenzie - Victoria, Australia",
    category: "Missing 411",
    type: "Point",
    coordinates: { lng: 145.1500, lat: -37.3667 },
    date: 1974,
    displayDate: "September 4, 1974",
    description: "4-year-old Damian McKenzie vanished during a school youth camp hike near Mount Disappointment in Victoria, Australia. Searchers tracked his footprints up a steep mountain slope, where they suddenly and completely stopped, suggesting he was lifted from the ground.",
    source: "David Paulides - Missing 411 (International) / Victoria Police",
    images: []
  },
  {
    id: "missing411-katherine-vanalst",
    name: "Katherine Van Alst - Devils Den, AR (Found Alive)",
    category: "Missing 411",
    type: "Point",
    coordinates: { lng: -94.2503, lat: 35.7801 },
    date: 1946,
    displayDate: "May 1946",
    description: "8-year-old Katherine Van Alst wandered away from her family camp wearing only a swimsuit. She survived for six days in the rugged valleys of Devils Den State Park. When found sitting in a cave, she was strangely calm and detached, describing sleeping in a warm 'nest' and having no fear.",
    source: "David Paulides - Missing 411 / Arkansas Gazette",
    images: []
  },
  {
    id: "missing411-carl-landers",
    name: "Carl Landers - Mount Shasta, CA",
    category: "Missing 411",
    type: "Point",
    coordinates: { lng: -122.2030, lat: 41.3850 },
    date: 1999,
    displayDate: "May 21, 1999",
    description: "69-year-old experienced climber Carl Landers disappeared near Helen Lake on Mt. Shasta. He went ahead of his climbing partners to warm up and was never seen again. Despite extensive helicopter and ground searches on the snowy slopes, no trace of his gear or clothing was found.",
    source: "David Paulides - Missing 411 / Siskiyou County Sheriff",
    images: []
  },
  {
    id: "missing411-bart-schleyer",
    name: "Bart Schleyer - Yukon Territory",
    category: "Missing 411",
    type: "Point",
    coordinates: { lng: -135.8972, lat: 63.5932 },
    date: 2004,
    displayDate: "September 2004",
    description: "Experienced wilderness photographer and bear researcher Bart Schleyer was dropped off by charter plane in the Yukon wilderness. He vanished, leaving his camp intact. His scattered bones and gear were later found, but investigators could not establish a definitive cause of death or sign of animal attack.",
    source: "David Paulides - Missing 411 (Canada) / Yukon RCMP",
    images: []
  },
  {
    id: "missing411-paul-fugate",
    name: "Paul Fugate - Chiricahua National Monument, AZ",
    category: "Missing 411",
    type: "Point",
    coordinates: { lng: -109.3403, lat: 32.0117 },
    date: 1980,
    displayDate: "January 13, 1980",
    description: "Park Ranger Paul Fugate walked out to patrol a trail at Chiricahua National Monument and vanished. Despite immediate searches by park rangers, search teams, and sheriff deputies, no trace of his uniform, equipment, or body has ever been discovered.",
    source: "David Paulides - Missing 411 / National Park Service",
    images: []
  },
  {
    id: "missing411-jared-negrete",
    name: "Jared Negrete - Mount San Gorgonio, CA",
    category: "Missing 411",
    type: "Point",
    coordinates: { lng: -116.8249, lat: 34.0992 },
    date: 1991,
    displayDate: "July 19, 1991",
    description: "12-year-old Boy Scout Jared Negrete fell behind his troop during a hike on Mount San Gorgonio. He vanished near the summit. The only clues found during a massive search were his camera (containing photos of himself taken in the dark) and shoe prints, but he was never found.",
    source: "David Paulides - Missing 411 / Riverside County Sheriff",
    images: []
  }
];
