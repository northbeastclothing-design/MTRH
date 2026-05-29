import os
import re
import ssl
import json
import time
import urllib.request
import urllib.parse

JSON_PATH = "/Users/jessehuffman/antigravity/MTRH-Interactive-Map/src/rabbitHoleData.json"
ENV_PATH = "/Users/jessehuffman/antigravity/MTRH-Interactive-Map/.env"

ssl_context = ssl._create_unverified_context()

# Bigfoot IDs to migrate to Cryptid Sightings
CRYPTID_MIGRATION_IDS = [
    "anomaly-Bigfoot-494",  # Thunderbird in Montana
    "anomaly-Bigfoot-496",  # Thunderbird in Iowa
    "anomaly-Bigfoot-497",  # Thunderbird sighting
    "anomaly-Bigfoot-514",  # Possible Thunderbird Sighting
    "anomaly-Bigfoot-516",  # Thunderbird sighting
    "anomaly-Bigfoot-528",  # Fisherman photo of large bird
    "anomaly-Bigfoot-571",  # Thunderbird Stuck in Mud
    "anomaly-Bigfoot-578",  # Possible Thunderbird spotted
    "anomaly-Bigfoot-587",  # Large Unknown Bird
    "anomaly-Bigfoot-593",  # Possible Yowie track and hair sample
    "anomaly-Bigfoot-618",  # Thunderbird sighting
    "anomaly-Bigfoot-660",  # Thunderbird Sightings
    "anomaly-Bigfoot-722",  # Possible Thunderbird Sighting
    "anomaly-Bigfoot-763",  # Thunderbird Sighting
    "anomaly-Bigfoot-899",  # Possible Thunderbird Sighting
    "anomaly-Bigfoot-902",  # Canoers Thunderbird Sighting
    "anomaly-Bigfoot-914",  # Was it a Thunderbird?
    "anomaly-Bigfoot-993",  # Florida Skunk Ape
    "anomaly-Bigfoot-996",  # Dewey Lake Monster
    "anomaly-Bigfoot-705"   # Orange Eyed Monster
]

# Bigfoot IDs to migrate to U.F.O. Sightings
UFO_MIGRATION_IDS = [
    "anomaly-Bigfoot-826",  # Cylinder Shaped UFO (Newark)
    "anomaly-Bigfoot-967"   # Blue UFO (Jersey City)
]

# 45 Famous Cryptids (excluding Bigfoot)
NEW_CRYPTIDS = [
    {
        "wiki_title": "Loch Ness Monster",
        "name": "Loch Ness Monster Sighting",
        "fallback_coords": {"lng": -4.43, "lat": 57.25},
        "fallback_year": 1933,
        "location": "Loch Ness, Scotland",
        "source": "Wikipedia - Loch Ness Monster"
    },
    {
        "wiki_title": "Mothman",
        "name": "Point Pleasant Mothman Sighting",
        "fallback_coords": {"lng": -82.1375, "lat": 38.8447},
        "fallback_year": 1966,
        "location": "Point Pleasant, West Virginia",
        "source": "Wikipedia - Mothman"
    },
    {
        "wiki_title": "Chupacabra",
        "name": "Chupacabra Sighting",
        "fallback_coords": {"lng": -65.9011, "lat": 18.3794},
        "fallback_year": 1995,
        "location": "Canóvanas, Puerto Rico",
        "source": "Wikipedia - Chupacabra"
    },
    {
        "wiki_title": "Jersey Devil",
        "name": "Jersey Devil Sighting",
        "fallback_coords": {"lng": -74.65, "lat": 39.75},
        "fallback_year": 1909,
        "location": "Pine Barrens, New Jersey",
        "source": "Wikipedia - Jersey Devil"
    },
    {
        "wiki_title": "Flatwoods Monster",
        "name": "Flatwoods Monster Encounter",
        "fallback_coords": {"lng": -80.6539, "lat": 38.7236},
        "fallback_year": 1952,
        "location": "Flatwoods, West Virginia",
        "source": "Wikipedia - Flatwoods Monster"
    },
    {
        "wiki_title": "Yeti",
        "name": "Abominable Snowman (Yeti) Track Discovery",
        "fallback_coords": {"lng": 86.9250, "lat": 27.9878},
        "fallback_year": 1921,
        "location": "Mount Everest, Himalayas",
        "source": "Wikipedia - Yeti"
    },
    {
        "wiki_title": "Mongolian Death Worm",
        "name": "Mongolian Death Worm Sighting",
        "fallback_coords": {"lng": 104.0, "lat": 43.0},
        "fallback_year": 1926,
        "location": "Gobi Desert, Mongolia",
        "source": "Wikipedia - Mongolian Death Worm"
    },
    {
        "wiki_title": "Loveland frog",
        "name": "Loveland Frogman Encounter",
        "fallback_coords": {"lng": -84.2694, "lat": 39.2689},
        "fallback_year": 1972,
        "location": "Loveland, Ohio",
        "source": "Wikipedia - Loveland frog"
    },
    {
        "wiki_title": "Beast of Bray Road",
        "name": "Beast of Bray Road Sighting",
        "fallback_coords": {"lng": -88.5443, "lat": 42.6389},
        "fallback_year": 1989,
        "location": "Elkhorn, Wisconsin",
        "source": "Wikipedia - Beast of Bray Road"
    },
    {
        "wiki_title": "Mokele-mbembe",
        "name": "Mokele-Mbembe Expedition Sighting",
        "fallback_coords": {"lng": 17.02, "lat": 1.34},
        "fallback_year": 1913,
        "location": "Lake Tele, Republic of the Congo",
        "source": "Wikipedia - Mokele-mbembe"
    },
    {
        "wiki_title": "Champ (cryptid)",
        "name": "Champ (Lake Champlain Monster) Sighting",
        "fallback_coords": {"lng": -73.4079, "lat": 44.0456},
        "fallback_year": 1977,
        "location": "Lake Champlain, New York / Vermont",
        "source": "Wikipedia - Champ (cryptid)"
    },
    {
        "wiki_title": "Ogopogo",
        "name": "Ogopogo Sighting",
        "fallback_coords": {"lng": -119.5, "lat": 49.9},
        "fallback_year": 1926,
        "location": "Okanagan Lake, British Columbia, Canada",
        "source": "Wikipedia - Ogopogo"
    },
    {
        "wiki_title": "Bunyip",
        "name": "Bunyip Sighting",
        "fallback_coords": {"lng": 145.6, "lat": -38.2},
        "fallback_year": 1845,
        "location": "Great Swamp, Victoria, Australia",
        "source": "Wikipedia - Bunyip"
    },
    {
        "wiki_title": "Pope Lick Monster",
        "name": "Pope Lick Monster Sighting",
        "fallback_coords": {"lng": -85.49, "lat": 38.20},
        "fallback_year": 1966,
        "location": "Pope Lick Trestle, Louisville, Kentucky",
        "source": "Wikipedia - Pope Lick Monster"
    },
    {
        "wiki_title": "Fouke Monster",
        "name": "Fouke Monster Encounter",
        "fallback_coords": {"lng": -93.8863, "lat": 33.2604},
        "fallback_year": 1971,
        "location": "Fouke, Arkansas",
        "source": "Wikipedia - Fouke Monster"
    },
    {
        "wiki_title": "Ozark Howler",
        "name": "Ozark Howler Sighting",
        "fallback_coords": {"lng": -92.5, "lat": 37.5},
        "fallback_year": 1998,
        "location": "Ozark Mountains, Missouri",
        "source": "Wikipedia - Ozark Howler"
    },
    {
        "wiki_title": "Beast of Gévaudan",
        "name": "Beast of Gévaudan Sighting",
        "fallback_coords": {"lng": 3.3, "lat": 44.9},
        "fallback_year": 1764,
        "location": "Margeride Mountains, France",
        "source": "Wikipedia - Beast of Gévaudan"
    },
    {
        "wiki_title": "Mapinguari",
        "name": "Mapinguari Sighting",
        "fallback_coords": {"lng": -69.0, "lat": -9.0},
        "fallback_year": 1993,
        "location": "Amazon Rainforest, Brazil",
        "source": "Wikipedia - Mapinguari"
    },
    {
        "wiki_title": "Van Meter Visitor",
        "name": "Van Meter Visitor Encounter",
        "fallback_coords": {"lng": -93.9555, "lat": 41.5297},
        "fallback_year": 1903,
        "location": "Van Meter, Iowa",
        "source": "Wikipedia - Van Meter Visitor"
    },
    {
        "wiki_title": "Skinwalker Ranch",
        "name": "Skinwalker Ranch Anomalous Encounter",
        "fallback_coords": {"lng": -109.8893, "lat": 40.2586},
        "fallback_year": 1994,
        "location": "Skinwalker Ranch, Ballard, Utah",
        "source": "Wikipedia - Skinwalker Ranch"
    },
    {
        "wiki_title": "Altamaha-ha",
        "name": "Altamaha-ha Sighting",
        "fallback_coords": {"lng": -81.3684, "lat": 31.3696},
        "fallback_year": 1969,
        "location": "Altamaha River, Darien, Georgia",
        "source": "Wikipedia - Altamaha-ha"
    },
    {
        "wiki_title": "Bear Lake Monster",
        "name": "Bear Lake Monster Sighting",
        "fallback_coords": {"lng": -111.33, "lat": 41.95},
        "fallback_year": 1868,
        "location": "Bear Lake, Utah / Idaho",
        "source": "Wikipedia - Bear Lake Monster"
    },
    {
        "wiki_title": "Chessie (cryptid)",
        "name": "Chessie (Chesapeake Bay Monster) Sighting",
        "fallback_coords": {"lng": -76.25, "lat": 38.25},
        "fallback_year": 1982,
        "location": "Chesapeake Bay, Maryland",
        "source": "Wikipedia - Chessie (cryptid)"
    },
    {
        "wiki_title": "Kelly–Hopkinsville encounter",
        "name": "Kelly-Hopkinsville Goblin Sighting",
        "fallback_coords": {"lng": -87.4764, "lat": 36.9711},
        "fallback_year": 1955,
        "location": "Kelly, Kentucky",
        "source": "Wikipedia - Kelly–Hopkinsville encounter"
    },
    {
        "wiki_title": "Cadborosaurus",
        "name": "Caddy (Cadborosaurus) Sighting",
        "fallback_coords": {"lng": -123.2981, "lat": 48.4593},
        "fallback_year": 1933,
        "location": "Cadboro Bay, Victoria, BC, Canada",
        "source": "Wikipedia - Cadborosaurus"
    },
    {
        "wiki_title": "Snallygaster",
        "name": "Snallygaster Sighting",
        "fallback_coords": {"lng": -77.5386, "lat": 39.4447},
        "fallback_year": 1909,
        "location": "Middletown, Maryland",
        "source": "Wikipedia - Snallygaster"
    },
    {
        "wiki_title": "Bessie (lake monster)",
        "name": "Bessie (Lake Erie Monster) Sighting",
        "fallback_coords": {"lng": -82.55, "lat": 41.6},
        "fallback_year": 1990,
        "location": "Lake Erie, Ohio",
        "source": "Wikipedia - Bessie (lake monster)"
    },
    {
        "wiki_title": "Tatzelwurm",
        "name": "Tatzelwurm Encounter",
        "fallback_coords": {"lng": 8.25, "lat": 46.98},
        "fallback_year": 1934,
        "location": "Mount Pilatus, Switzerland",
        "source": "Wikipedia - Tatzelwurm"
    },
    {
        "wiki_title": "White River Monster",
        "name": "White River Monster Sighting",
        "fallback_coords": {"lng": -91.2721, "lat": 35.6065},
        "fallback_year": 1937,
        "location": "Newport, Arkansas",
        "source": "Wikipedia - White River Monster"
    },
    {
        "wiki_title": "Momo the Monster",
        "name": "Momo the Monster Encounter",
        "fallback_coords": {"lng": -91.0515, "lat": 39.4489},
        "fallback_year": 1972,
        "location": "Louisiana, Missouri",
        "source": "Wikipedia - Momo the Monster"
    },
    {
        "wiki_title": "Lake Worth Monster",
        "name": "Lake Worth Monster Sighting",
        "fallback_coords": {"lng": -97.45, "lat": 32.80},
        "fallback_year": 1969,
        "location": "Lake Worth, Texas",
        "source": "Wikipedia - Lake Worth Monster"
    },
    {
        "wiki_title": "Enfield Horror",
        "name": "Enfield Horror Encounter",
        "fallback_coords": {"lng": -88.3375, "lat": 38.0992},
        "fallback_year": 1973,
        "location": "Enfield, Illinois",
        "source": "Wikipedia - Enfield Horror"
    },
    {
        "wiki_title": "Gef",
        "name": "Gef the Talking Mongoose Encounter",
        "fallback_coords": {"lng": -4.71, "lat": 54.16},
        "fallback_year": 1931,
        "location": "Dalby, Isle of Man",
        "source": "Wikipedia - Gef"
    },
    {
        "wiki_title": "Thunderbird (mythology)",
        "name": "Tombstone Thunderbird Sighting",
        "fallback_coords": {"lng": -110.0673, "lat": 31.7129},
        "fallback_year": 1890,
        "location": "Tombstone, Arizona",
        "source": "Wikipedia - Thunderbird (mythology)"
    },
    {
        "wiki_title": "Minhocão (cryptid)",
        "name": "Minhocão Encounter",
        "fallback_coords": {"lng": -50.32, "lat": -27.81},
        "fallback_year": 1870,
        "location": "Lages, Santa Catarina, Brazil",
        "source": "Wikipedia - Minhocão (cryptid)"
    },
    {
        "wiki_title": "Beast of Exmoor",
        "name": "Beast of Exmoor Sighting",
        "fallback_coords": {"lng": -3.8, "lat": 51.1},
        "fallback_year": 1983,
        "location": "Exmoor, Devon, England",
        "source": "Wikipedia - Beast of Exmoor"
    },
    {
        "wiki_title": "Kushtaka",
        "name": "Kushtaka Sighting",
        "fallback_coords": {"lng": -132.8, "lat": 57.0},
        "fallback_year": 1900,
        "location": "Thomas Bay, Alaska",
        "source": "Wikipedia - Kushtaka"
    },
    {
        "wiki_title": "Bili Ape",
        "name": "Bili Forest Giant Ape Discovery",
        "fallback_coords": {"lng": 25.17, "lat": 4.15},
        "fallback_year": 1996,
        "location": "Bili Forest, Democratic Republic of the Congo",
        "source": "Wikipedia - Bili Ape"
    },
    {
        "wiki_title": "Ningen (folklore)",
        "name": "Ningen Sighting in Subantarctic Waters",
        "fallback_coords": {"lng": -60.0, "lat": -70.0},
        "fallback_year": 2002,
        "location": "Subantarctic Ocean, Antarctica",
        "source": "Wikipedia - Ningen (folklore)"
    },
    {
        "wiki_title": "Kraken",
        "name": "Kraken Sea Monster Account",
        "fallback_coords": {"lng": 5.0, "lat": 62.0},
        "fallback_year": 1752,
        "location": "North Sea, Norway",
        "source": "Wikipedia - Kraken"
    },
    {
        "wiki_title": "Dingonek",
        "name": "Dingonek River Beast Sighting",
        "fallback_coords": {"lng": 35.0, "lat": -1.0},
        "fallback_year": 1907,
        "location": "River Maggori, Kenya",
        "source": "Wikipedia - Dingonek"
    },
    {
        "wiki_title": "Gambo (sea monster)",
        "name": "Gambo Beached Sea Monster Sighting",
        "fallback_coords": {"lng": -16.68, "lat": 13.47},
        "fallback_year": 1983,
        "location": "Bungalow Beach, Gambia",
        "source": "Wikipedia - Gambo (sea monster)"
    },
    {
        "wiki_title": "Brosno dragon",
        "name": "Brosno Dragon Sighting",
        "fallback_coords": {"lng": 32.18, "lat": 56.88},
        "fallback_year": 1996,
        "location": "Lake Brosno, Tver Oblast, Russia",
        "source": "Wikipedia - Brosno dragon"
    },
    {
        "wiki_title": "Falkville Metal Man",
        "name": "Falkville Metal Man Sighting",
        "fallback_coords": {"lng": -86.90, "lat": 34.37},
        "fallback_year": 1973,
        "location": "Falkville, Alabama",
        "source": "Wikipedia - Falkville Metal Man"
    },
    {
        "wiki_title": "Queensland Tiger",
        "name": "Queensland Tiger Sighting",
        "fallback_coords": {"lng": 145.42, "lat": -17.26},
        "fallback_year": 1940,
        "location": "Atherton Tableland, Queensland, Australia",
        "source": "Wikipedia - Queensland Tiger"
    }
]

def load_gemini_key():
    try:
        with open(ENV_PATH, 'r') as f:
            for line in f:
                if line.startswith('GEMINI_API_KEY='):
                    return line.strip().split('=', 1)[1].replace('"', '').replace("'", "")
    except Exception as e:
        print(f"Could not load key from .env: {e}")
    return None

def fetch_wikipedia_details(wiki_title):
    # Retrieve coordinates and thumbnail image
    url = f"https://en.wikipedia.org/w/api.php?action=query&prop=coordinates|pageimages&titles={urllib.parse.quote(wiki_title)}&pithumbsize=1000&format=json&redirects=true"
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'MTRH-Bot/1.0 (jhuffman710@gmail.com)'})
        with urllib.request.urlopen(req, context=ssl_context, timeout=10) as response:
            res_data = json.loads(response.read().decode('utf-8'))
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
        print(f"Failed to fetch Wikipedia data for '{wiki_title}': {e}")
    return None

def generate_description_gemini(api_key, name, location, wiki_title):
    import urllib.error
    import random
    prompt = (
        "You are a conspiracy theorist and alternative historian for MTRH (Mapping the Rabbit Hole). "
        f"Rewrite details about the cryptid/legendary creature encounter '{name}' in '{location}' "
        "into an alternative-history-slanted, mysterious description. Focus on conspiracy-friendly angles "
        "(such as secret government containment programs, interdimensional portals, bio-weapons experiments, "
        "relict dinosaur populations, hollow earth inhabitants, or cover-ups by the Smithsonian/authorities). "
        "Keep the description engaging, eerie, and under 3 sentences. Do not use plain, boring language. "
        "Output ONLY the rewritten description and nothing else."
    )
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={api_key}"
    headers = {"Content-Type": "application/json"}
    payload = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {
            "temperature": 0.7,
            "maxOutputTokens": 180
        }
    }
    
    max_retries = 5
    backoff = 2.0
    for attempt in range(max_retries):
        try:
            data = json.dumps(payload).encode('utf-8')
            req = urllib.request.Request(url, data=data, headers=headers, method='POST')
            with urllib.request.urlopen(req, context=ssl_context, timeout=12) as response:
                res_json = json.loads(response.read().decode('utf-8'))
                text = res_json['candidates'][0]['content']['parts'][0]['text'].strip()
                text = re.sub(r'^```html\s*', '', text)
                text = re.sub(r'^```text\s*', '', text)
                text = re.sub(r'^```\s*', '', text)
                text = re.sub(r'\s*```$', '', text)
                text = text.strip('"\'')
                return text
        except urllib.error.HTTPError as e:
            if e.code in [429, 503]:
                sleep_time = backoff * (2.0 ** attempt) + random.uniform(0.5, 1.5)
                print(f"  -> HTTP Error {e.code}: Rate limited or service unavailable. Retrying in {sleep_time:.2f}s (Attempt {attempt+1}/{max_retries})...")
                time.sleep(sleep_time)
            else:
                print(f"Gemini API request failed for '{name}' with HTTP Error {e.code}: {e.reason}")
                break
        except Exception as e:
            print(f"Gemini API request failed for '{name}': {e}")
            break
    return None

def main():
    api_key = load_gemini_key()
    if not api_key:
        print("Error: Gemini API Key not found in .env! Sighting descriptions will use fallbacks.")

    print("Loading database...")
    with open(JSON_PATH, 'r') as f:
        data = json.load(f)

    # 1. Clean up Bigfoot Layer (Migrate specific cryptids and UFOs)
    migrated_cryptids_count = 0
    migrated_ufos_count = 0
    clean_data = []

    # Track items to migrate
    to_migrate_cryptids = []
    to_migrate_ufos = []

    for item in data:
        item_id = item.get('id')
        if item_id in CRYPTID_MIGRATION_IDS:
            to_migrate_cryptids.append(item)
        elif item_id in UFO_MIGRATION_IDS:
            to_migrate_ufos.append(item)
        else:
            clean_data.append(item)

    print(f"Loaded {len(data)} total entries.")
    print(f"Identified {len(to_migrate_cryptids)} cryptids to migrate from Bigfoot layer.")
    print(f"Identified {len(to_migrate_ufos)} UFOs to migrate from Bigfoot layer.")

    # Find highest existing indices for UFO category
    highest_ufo_idx = -1
    for item in clean_data:
        if item.get('category') == "U.F.O. Sightings":
            item_id = item.get('id', '')
            match = re.search(r'anomaly-UFO-(\d+)$', item_id)
            if match:
                idx = int(match.group(1))
                if idx > highest_ufo_idx:
                    highest_ufo_idx = idx

    print(f"Highest existing UFO index: {highest_ufo_idx}.")

    # Start new Cryptid Sightings IDs at index 0
    next_cryptid_idx = 0
    next_ufo_idx = highest_ufo_idx + 1

    # Perform migrations
    for item in to_migrate_cryptids:
        new_id = f"anomaly-Cryptid-Sightings-{next_cryptid_idx}"
        item['id'] = new_id
        item['category'] = "Cryptid Sightings"
        # Force title-case categories array for react app matching
        item['categories'] = ["Cryptid Sightings"]
        clean_data.append(item)
        print(f"Migrated cryptid '{item.get('name')}' as ID '{new_id}'")
        next_cryptid_idx += 1
        migrated_cryptids_count += 1

    for item in to_migrate_ufos:
        new_id = f"anomaly-UFO-{next_ufo_idx}"
        item['id'] = new_id
        item['category'] = "U.F.O. Sightings"
        item['categories'] = ["U.F.O. Sightings"]
        clean_data.append(item)
        print(f"Migrated UFO '{item.get('name')}' as ID '{new_id}'")
        next_ufo_idx += 1
        migrated_ufos_count += 1

    # 2. Scrape and generate new Cryptid Sightings
    added_new_count = 0
    for cryptid in NEW_CRYPTIDS:
        name = cryptid["name"]
        wiki_title = cryptid["wiki_title"]
        location = cryptid["location"]
        fallback_coords = cryptid["fallback_coords"]
        fallback_year = cryptid["fallback_year"]
        source = cryptid["source"]

        print(f"\nProcessing new cryptid: '{name}'...")
        details = fetch_wikipedia_details(wiki_title)
        
        coords = fallback_coords
        img_url = None
        if details:
            if details.get('coords'):
                coords = details['coords']
                print(f"  -> Found Wikipedia coordinates: {coords}")
            if details.get('image'):
                img_url = details['image']
                print(f"  -> Found Wikipedia image: {img_url}")
        else:
            print("  -> Wikipedia search failed/returned no data. Using fallbacks.")

        desc = None
        if api_key:
            desc = generate_description_gemini(api_key, name, location, wiki_title)
        
        if not desc:
            desc = f"Reports of a strange, unidentified entity matching descriptions of the legendary '{wiki_title}' sighted in '{location}'. Local authorities and mainstream institutions have historically downplayed or suppressed documentation of the encounter."
            print("  -> Using fallback description.")

        new_id = f"anomaly-Cryptid-Sightings-{next_cryptid_idx}"
        
        new_anomaly = {
            "id": new_id,
            "name": name,
            "category": "Cryptid Sightings",
            "type": "Point",
            "coordinates": coords,
            "date": fallback_year,
            "description": desc,
            "source": source,
            "images": [img_url] if img_url else []
        }

        clean_data.append(new_anomaly)
        print(f"  -> Added '{name}' as '{new_id}'")
        print(f"  -> Description: {desc}")
        
        next_cryptid_idx += 1
        added_new_count += 1
        time.sleep(0.3)  # Respect API limits

    print(f"\nSaving database with {len(clean_data)} entries...")
    with open(JSON_PATH, 'w') as f:
        json.dump(clean_data, f, indent=2)
    print("Database updated and saved successfully!")

    print(f"\nExecution Summary:")
    print(f"  Migrated Cryptids from Bigfoot layer: {migrated_cryptids_count}")
    print(f"  Migrated UFOs from Bigfoot layer:     {migrated_ufos_count}")
    print(f"  New Cryptids Scraped & Appended:      {added_new_count}")
    print(f"  Total Cryptid Sightings Layer Pins:   {migrated_cryptids_count + added_new_count}")

if __name__ == "__main__":
    main()
