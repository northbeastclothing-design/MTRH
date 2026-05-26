import json
import urllib.request
import urllib.parse
import time
import ssl
import re

JSON_PATH = '/Users/jessehuffman/antigravity/MTRH-Interactive-Map/src/rabbitHoleData.json'

NEW_PETROGLYPHS = [
    {
        "wiki_title": "Petroglyph National Monument",
        "name": "Petroglyph National Monument",
        "description": "Puebloan volcanic carvings featuring mysterious horned beings, geometric symbols, and star-headed guides. Theorists believe this massive site marks a highly active portal grid used to communicate with subterranean and sky guardians."
    },
    {
        "wiki_title": "Twyfelfontein",
        "name": "Twyfelfontein",
        "description": "Thousands of hunter-gatherer engravings depicting human-animal shape-shifting. Theorists claim these carvings depict literal accounts of inter-species genetic manipulation and early portal-based travel by non-human intelligence.",
        "fallback_coords": {"lat": -20.59056, "lng": 14.37222}
    },
    {
        "wiki_title": "Rock Drawings in Valcamonica",
        "name": "Valcamonica Petroglyphs",
        "description": "Over 140,000 prehistoric rock carvings spanning 8,000 years. Conspiracy circles point to the 'spacemen' figures wearing glowing, spherical helmets and wielding advanced electromagnetic tools as direct proof of paleocontact."
    },
    {
        "wiki_title": "Murujuga",
        "name": "Murujuga (Dampier Archipelago)",
        "description": "A collection of over one million petroglyphs dating back 40,000 years. Researchers suggest the deep rock engravings encode pre-glacial star maps, extinct megafauna, and ancestral star-beings who visited during the Dreamtime."
    },
    {
        "wiki_title": "Hawaii Volcanoes National Park",
        "name": "Puʻuloa Petroglyphs",
        "description": "The largest rock art field in Hawaii, containing over 23,000 carvings. Theorists propose the circles and cups carved into the volcanic basalt are telluric nodes connected to the deep magma-flow energy network of the Pacific.",
        "fallback_coords": {"lat": 19.2886, "lng": -155.1328}
    },
    {
        "wiki_title": "Rock Art of Alta",
        "name": "Alta Rock Art",
        "description": "Prehistoric carvings near the Arctic Circle depicting complex reindeer herds and boat patterns. Theorists argue these represent prehistoric sea-faring networks mapping solar paths and Earth's northern magnetic lines."
    },
    {
        "wiki_title": "Rock Shelters of Bhimbetka",
        "name": "Bhimbetka Rock Shelters",
        "description": "Ancient rock shelters displaying carvings and paintings spanning 30,000 years. Theorists suggest the complex astronomical symbols and giant hunter figures document a lost pre-flood empire built by giants."
    },
    {
        "wiki_title": "Gobustan National Park",
        "name": "Gobustan Rock Art",
        "description": "Carvings depicting reed boats, star groups, and large humans. Theorists claim these link the Caucasus directly to Thor Heyerdahl’s migration theories and represent ancient sea voyages in pre-glacial times."
    },
    {
        "wiki_title": "Tamgaly",
        "name": "Tamgaly Petroglyphs",
        "description": "Bronze Age carvings dominated by 'Sun-Head' deities with radiating halos. Theorists believe these represent alien visitations, high-frequency electromagnetic fields, or ancient energy channeling rituals."
    },
    {
        "wiki_title": "Rock Carvings in Tanum",
        "name": "Tanum Rock Carvings",
        "description": "Nordic Bronze Age carvings showing giant warriors, long boats, and sun wheels. Theorists suggest they record stellar wars and represent hyperborean star travelers visiting Northern Europe."
    },
    {
        "wiki_title": "Tassili n'Ajjer",
        "name": "Tassili n'Ajjer",
        "description": "Vast sandstone carvings showing massive humanoids and strange beings. Ancient astronaut theorists suggest these figures depict the 'Anunnaki' or other-worldly entities visiting the Sahara when it was a lush green valley."
    },
    {
        "wiki_title": "Dabous Giraffes",
        "name": "Dabous Giraffes",
        "description": "Life-sized, masterfully carved Saharan giraffes. Theorists highlight the exceptional artistic precision and remote location as evidence of a highly advanced green-Sahara civilization that possessed secret stone-softening tools."
    },
    {
        "wiki_title": "Saimaluu Tash",
        "name": "Saimaluu Tash",
        "description": "A high-altitude mountain pass containing over 10,000 carvings. Theorists speculate it was a high-frequency spiritual observatory where ancient initiates used rock carvings to map star alignments and communicate with sky entities."
    },
    {
        "wiki_title": "Pusharo",
        "name": "Pusharo Petroglyphs",
        "description": "Mysterious carvings deep in the Amazon jungle. Alternative theorists interpret the complex geometric patterns as a cartographic key to Paititi, the legendary lost golden city of the Andes.",
        "fallback_image": "https://upload.wikimedia.org/wikipedia/commons/e/ec/Petroglifos_de_Pusharo.jpg"
    },
    {
        "wiki_title": "Lake Onega",
        "name": "Onega Petroglyphs",
        "description": "Carvings on the shore of Lake Onega, including a famous 2-meter tall 'Demon' figure. Theorists suggest the site was built to interact with water vortexes and serve as a geomantic barrier against dark entities.",
        "fallback_coords": {"lat": 61.6736, "lng": 36.3150},
        "fallback_image": "https://upload.wikimedia.org/wikipedia/commons/e/e0/Cape_Besov_Nos_Onega_petroglyphs_1.JPG"
    },
    {
        "wiki_title": "Newspaper Rock State Historic Monument",
        "name": "Newspaper Rock",
        "description": "A dense panel of thousands of Native American rock carvings. Theorists claim the petroglyphs depict anomalous multi-toed footprints, horned titans, and star-maps of ancient travelers.",
        "fallback_coords": {"lat": 37.9883, "lng": -109.5185}
    },
    {
        "wiki_title": "Edakkal Caves",
        "name": "Edakkal Caves",
        "description": "Neolithic carvings showing strange humanoids with high-energy crowns. Conspiracy circles believe the high-precision engravings represent pre-flood survivors encoding ancient technological diagrams on cave walls."
    },
    {
        "wiki_title": "Writing-on-Stone Provincial Park",
        "name": "Writing-on-Stone / Áísínai’pi",
        "description": "An extensive sacred landscape featuring petroglyphs. Theorists suggest the carvings are records of historic aerial anomalies, battles with giants, and shamanic travels into the spirit realm."
    },
    {
        "wiki_title": "Miculla petroglyphs",
        "name": "Miculla Petroglyphs",
        "description": "Desert carvings showing stick figures with halos. Theorists interpret these as depictions of other-worldly beings manifesting along high-energy Ley Lines running from the Andes to the coast.",
        "fallback_image": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Tacna_-_Petroglifos_de_Miculla.JPG/1280px-Tacna_-_Petroglifos_de_Miculla.JPG"
    },
    {
        "wiki_title": "Angono Petroglyphs",
        "name": "Angono Petroglyphs",
        "description": "The oldest rock art in the Philippines, depicting human and animal shapes. Theorists suggest they depict small, non-human entities and were used in ancient shamanic rituals to open spiritual portals."
    }
]

ssl_context = ssl._create_unverified_context()

def fetch_wiki_details(title):
    url = f"https://en.wikipedia.org/w/api.php?action=query&prop=coordinates|pageimages&titles={urllib.parse.quote(title)}&pithumbsize=1000&format=json&redirects=true"
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'MTRH-Bot/1.0 (jhuffman710@gmail.com)'})
        with urllib.request.urlopen(req, context=ssl_context, timeout=10) as response:
            res_data = json.loads(response.read().decode())
            pages = res_data.get('query', {}).get('pages', {})
            for page_id, info in pages.items():
                if page_id == "-1":
                    return None
                
                coords_list = info.get('coordinates', [])
                coords = None
                if coords_list:
                    coords = {
                        "lng": coords_list[0]['lon'],
                        "lat": coords_list[0]['lat']
                    }
                
                img_url = info.get('thumbnail', {}).get('source')
                return {
                    "coords": coords,
                    "image": img_url
                }
    except Exception as e:
        print(f"Failed to fetch data for '{title}': {e}")
    return None

def main():
    print("Loading database...")
    with open(JSON_PATH, 'r') as f:
        data = json.load(f)

    # Find highest index for category Petroglyphs with ID anomaly-Petroglyphs-X
    highest_idx = -1
    for item in data:
        if item.get('category') == "Petroglyphs":
            item_id = item.get('id', '')
            match = re.search(r'anomaly-Petroglyphs-(\d+)$', item_id)
            if match:
                idx = int(match.group(1))
                if idx > highest_idx:
                    highest_idx = idx

    next_idx = highest_idx + 1
    print(f"Highest index for Petroglyphs: {highest_idx}. Next index: {next_idx}")

    added_count = 0
    
    for item in NEW_PETROGLYPHS:
        title = item['wiki_title']
        name = item['name']
        desc = item['description']
        
        # Check if already exists in database
        already_exists = any(i.get('name').lower() == name.lower() for i in data)
        if already_exists:
            print(f"Petroglyph '{name}' already exists in database. Skipping.")
            continue

        print(f"Querying Wikipedia for '{title}'...")
        details = fetch_wiki_details(title)
        
        # Determine coordinates (check API, then check fallback)
        coords = None
        if details and details.get('coords'):
            coords = details['coords']
        elif 'fallback_coords' in item:
            coords = item['fallback_coords']
            print(f"  -> Coordinates missing from Wikipedia. Using fallback: {coords}")
            
        if not coords:
            print(f"  -> Warning: Could not retrieve coordinates for '{title}'. Skipping.")
            continue
            
        # Determine image (check API, then check fallback)
        img_url = None
        if details and details.get('image'):
            img_url = details['image']
        elif 'fallback_image' in item:
            img_url = item['fallback_image']
            print(f"  -> Image missing from Wikipedia. Using fallback: {img_url}")
            
        # Construct ID slug
        id_slug = f"anomaly-Petroglyphs-{next_idx}"
        
        new_anomaly = {
            "id": id_slug,
            "name": name,
            "category": "Petroglyphs",
            "type": "Point",
            "coordinates": coords,
            "date": None,
            "description": desc,
            "source": "Wikipedia / Historical Mystery Records",
            "images": [img_url] if img_url else []
        }
        
        data.append(new_anomaly)
        print(f"  -> Added '{name}' at {coords} with ID '{id_slug}'")
        
        next_idx += 1
        added_count += 1
        
        # Politely sleep between API calls
        time.sleep(0.15)

    if added_count > 0:
        print(f"\nSaving database with {added_count} new entries...")
        with open(JSON_PATH, 'w') as f:
            json.dump(data, f, indent=2)
        print("Database saved successfully!")
    else:
        print("\nNo new entries added to the database.")

    print(f"\nSummary:")
    print(f"  Added: {added_count}")

if __name__ == "__main__":
    main()
