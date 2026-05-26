import json
import urllib.request
import urllib.parse
import time
import ssl
import re

JSON_PATH = '/Users/jessehuffman/antigravity/MTRH-Interactive-Map/src/rabbitHoleData.json'

# Target Megaliths to add with their Wikipedia search query/title and conspiracy-themed descriptions
NEW_MEGALITHS = [
    {
        "wiki_title": "Stonehenge",
        "name": "Stonehenge",
        "description": "A prehistoric stone circle on Salisbury Plain. Conspiracy theorists suggest it was constructed using acoustic levitation by giants or pre-diluvian builders to act as a massive telluric energy harvester, planetary stabilizer, and astronomical computer."
    },
    {
        "wiki_title": "Carnac stones",
        "name": "Carnac Stones",
        "description": "An exceptionally dense collection of over 3,000 standing stones in Brittany, France. Believed by alternative theorists to be a massive ancient seismic monitoring system or a giant acoustic wave-guide array designed to map telluric energy lines."
    },
    {
        "wiki_title": "Puma Punku",
        "name": "Puma Punku",
        "description": "An ancient Tiwanaku site in Bolivia famous for its high-precision, interlocking H-shaped diorite blocks. Theorists highlight the advanced stone-cutting, straight edges, and perfect drill holes as evidence of pre-diluvian power tools or alien construction."
    },
    {
        "wiki_title": "Saksaywaman",
        "name": "Saksaywaman",
        "description": "A citadel on the northern outskirts of Cusco, Peru, featuring colossal walls built from perfectly fitted stones weighing up to 125 tons. The jigsaw precision has led to claims that the ancient builders used solar mirrors or plant-based chemical mixtures to soften and mold the stone."
    },
    {
        "wiki_title": "Baalbek",
        "name": "Baalbek Temple Complex",
        "description": "A Lebanese temple complex housing the largest cut stone blocks in antiquity, including the Trilithon blocks weighing 800 tons each. Theorists suggest this massive, flat stone platform predates Roman construction and was a launch pad or landing grid for ancient aerial vehicles."
    },
    {
        "wiki_title": "Newgrange",
        "name": "Newgrange",
        "description": "A 5,000-year-old passage tomb in Ireland. Theorists argue that the chamber's precise alignment with the winter solstice sunrise, combined with the famous triple-spiral carvings, indicates it functioned as an ancient initiatory chamber, calendar, or acoustic resonator."
    },
    {
        "wiki_title": "Avebury",
        "name": "Avebury Stone Circle",
        "description": "The largest megalithic stone circle in the world, enclosing an entire village in Wiltshire, England. Believed by theorists to be a massive electromagnetic capacitor, focusing telluric currents along the St. Michael's lay line grid."
    },
    {
        "wiki_title": "Gunung Padang",
        "name": "Gunung Padang",
        "description": "A massive terraced step pyramid in West Java, Indonesia, claimed by some geologists to date back over 20,000 years. Rumored to hide subterranean chambers, lost technology, and evidence of a pre-ice age global civilization."
    },
    {
        "wiki_title": "Yonaguni Monument",
        "name": "Yonaguni Monument",
        "description": "An underwater rock formation off the coast of Japan featuring flat parallel faces, sharp edges, and right angles. Believed by alternative historians to be a submerged pre-glacial monument from the lost continent of Mu."
    },
    {
        "wiki_title": "Callanish Stones",
        "name": "Callanish Stones",
        "description": "A cruciform standing stone alignment on the Isle of Lewis, Scotland. Believed to be an ancient celestial clock and energy portal, aligning with the moon's major standstill every 18.6 years to open inter-dimensional gateways."
    },
    {
        "wiki_title": "Mnajdra",
        "name": "Mnajdra Temples",
        "description": "A megalithic temple complex in Malta. Theorists suggest its astronomical alignments and 'oracle holes' were used to focus planetary consciousness, harness solar alignments, and perform acoustic sound healing."
    },
    {
        "wiki_title": "Hagar Qim",
        "name": "Hagar Qim Temple",
        "description": "An ancient temple in Malta featuring massive single-stone walls, including a slab weighing 20 tons. Local legends attribute the construction to a prehistoric race of giants who inhabited the island before the biblical flood."
    },
    {
        "wiki_title": "Nan Madol",
        "name": "Nan Madol",
        "description": "A ruined city built on coral reefs in Micronesia using massive basalt columns. Local legends say the stones were levitated into place using acoustic sorcery, while theorists link the ruins to the lost continent of Lemuria."
    },
    {
        "wiki_title": "Plain of Jars",
        "name": "Plain of Jars",
        "description": "Thousands of massive stone jars scattered across the valleys of Laos. Theorists suggest they were not for burials or wine storage, but acted as ancient energy cells, chemical distillation vats, or acoustic transmitters."
    },
    {
        "wiki_title": "Zorats Karer",
        "name": "Zorats Karer (Karahunj)",
        "description": "An Armenian stone circle featuring neat circular holes drilled through the tops of many stones. Theorists claim it is a 7,500-year-old astronomical observatory and stellar portal, predating Stonehenge by millennia."
    },
    {
        "wiki_title": "Masuda no Iwafune",
        "name": "Masuda no Iwafune (Rock Ship)",
        "description": "A colossal, 800-ton carved stone block in Japan with square holes cut into its top. Conspiracy theorists suggest it is an ancient machine base, a monument commemorating extraterrestrial 'rock ships', or an astronomical observation platform."
    },
    {
        "wiki_title": "Al Naslaa",
        "name": "Al Naslaa Rock Split",
        "description": "A sandstone formation in Saudi Arabia split perfectly down the middle with laser-like precision, sitting on tiny natural pedestals. Theorists claim the split was caused by ancient laser technology or precision beam cutting."
    },
    {
        "wiki_title": "Senegambian stone circles",
        "name": "Senegambian Stone Circles",
        "description": "Thousands of megalithic stone circles in West Africa. Theorists suggest they are situated on local magnetic vortices, acting as planetary acupuncture points to stabilize earth energies."
    },
    {
        "wiki_title": "Deer stone",
        "name": "Mongolian Deer Stones",
        "description": "Ancient standing stones in Mongolia carved with flying reindeer and weapons. Theorists suggest they depict ancient aerial travelers, spirit flight, or shamanic dimensional travel paths."
    },
    {
        "wiki_title": "Ring of Brodgar",
        "name": "Ring of Brodgar",
        "description": "A massive stone circle in Orkney, Scotland. Believed to be a focal point for lunar energies and a major node in the northern European lay line network."
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

    # Find highest index for category Megaliths / Dolmans / Petroglyphs / Geoglyphs
    cat_name = "Megaliths / Dolmans / Petroglyphs / Geoglyphs"
    existing_megaliths = [item for item in data if item.get('category') == cat_name]
    
    highest_idx = -1
    for item in existing_megaliths:
        # ID looks like: anomaly-Megaliths---Dolmans---Petroglyphs---Geoglyphs-X
        item_id = item.get('id', '')
        match = re.search(r'-(\d+)$', item_id)
        if match:
            idx = int(match.group(1))
            if idx > highest_idx:
                highest_idx = idx

    next_idx = highest_idx + 1
    print(f"Highest index for category: {highest_idx}. Next index: {next_idx}")

    added_count = 0
    
    for item in NEW_MEGALITHS:
        title = item['wiki_title']
        name = item['name']
        desc = item['description']
        
        # Check if already exists in database
        already_exists = any(i.get('name').lower() == name.lower() for i in data)
        if already_exists:
            print(f"Megalith '{name}' already exists in database. Skipping.")
            continue

        print(f"Querying Wikipedia for '{title}'...")
        details = fetch_wiki_details(title)
        
        if not details or not details.get('coords'):
            print(f"  -> Warning: Could not retrieve coordinates for '{title}'. Skipping.")
            continue
            
        coords = details['coords']
        img_url = details['image']
        
        # Construct ID slug
        id_slug = f"anomaly-Megaliths---Dolmans---Petroglyphs---Geoglyphs-{next_idx}"
        
        new_anomaly = {
            "id": id_slug,
            "name": name,
            "category": cat_name,
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
