import json
import csv
import re
import html

UFO1_PATH = "src/ufoData-1.json"
UFO2_PATH = "src/ufoData-2.json"
RABBIT_PATH = "src/rabbitHoleData.json"
CSV_PATH = "scratch/ufo_sightings_raw.csv"

FAMOUS_SIGHTINGS = [
    # Group A: Updates for existing generic entries (handled by ID matching or city matching)
    {
        "key_city": "roswell",
        "name": "Roswell UFO Incident - Roswell, New Mexico (1947)",
        "coordinates": {"lng": -104.5281, "lat": 33.3872},
        "date": 1947,
        "description": "The recovery of balloon debris (which the military officially claimed was a Project Mogul balloon, but conspiracy theorists assert was a crashed flying saucer with extraterrestrial occupants) at a ranch near Roswell, New Mexico. The incident sparked decades of cover-up accusations and remains the cornerstone of modern UFO lore.",
        "source": "Wikipedia - Roswell incident",
        "images": [
            "https://upload.wikimedia.org/wikipedia/commons/0/04/Roswell_Daily_Record._July_8%2C_1947._RAAF_Captures_Flying_Saucer_On_Ranch_in_Roswell_Region._Top_of_front_page.jpg"
        ]
    },
    {
        "key_city": "phoenix",
        "name": "Phoenix Lights - Phoenix, Arizona (1997)",
        "coordinates": {"lng": -112.0740, "lat": 33.4484},
        "date": 1997,
        "description": "A series of widely sighted unidentified flying objects observed by thousands of residents in the skies over Arizona. The encounter consisted of two distinct phases: a massive, silent, V-shaped or triangular formation of lights that cruised over the state, and a series of stationary lights hovering over the city of Phoenix.",
        "source": "Wikipedia - Phoenix Lights",
        "images": [
            "https://www.youtube.com/watch?v=I51A6l4e8_k",
            "https://upload.wikimedia.org/wikipedia/en/3/3b/PhoenixLights1997model.jpg"
        ]
    },
    {
        "key_city": "lubbock",
        "name": "Lubbock Lights - Lubbock, Texas (1951)",
        "coordinates": {"lng": -101.8552, "lat": 33.5779},
        "date": 1951,
        "description": "A series of sightings of a V-shaped formation of 15 to 30 bluish-green lights flying at extreme speeds over Lubbock, Texas. Photographed by Carl Hart Jr. and investigated by the U.S. Air Force Project Blue Book, it remains one of the most famous early cases in UFO history.",
        "source": "Wikipedia - Lubbock Lights",
        "images": [
            "https://upload.wikimedia.org/wikipedia/en/7/78/Lubbock_Lights_Hart_photos.png"
        ]
    },
    {
        "key_city": "tehran",
        "name": "Tehran UFO Incident - Tehran, Iran (1976)",
        "coordinates": {"lng": 51.3890, "lat": 35.6892},
        "date": 1976,
        "description": "A bright light in the night sky prompted the Iranian Air Force to scramble two F-4 Phantom II fighter jets. As the pilots approached the object, their instrumentation and weapons control systems completely failed, returning to normal once they pulled away. The event was documented in a declassified U.S. Defense Intelligence Agency report.",
        "source": "Wikipedia - 1976 Tehran UFO incident",
        "images": [
            "https://www.youtube.com/watch?v=c1lWJUMK8-E"
        ]
    },
    {
        "key_city": "stephenville",
        "name": "Stephenville UFO Sightings - Stephenville, Texas (2008)",
        "coordinates": {"lng": -98.2023, "lat": 32.2207},
        "date": 2008,
        "description": "Dozens of local residents, including a businessman and a pilot, reported seeing a massive, silent, brightly lit craft moving at high speeds. Radar logs released under FOIA confirmed a large object moving toward President Bush's Crawford ranch, tracked by military jets.",
        "source": "Wikipedia - Stephenville, Texas",
        "images": [
            "https://www.youtube.com/watch?v=VAvohfD07PI"
        ]
    },
    # Group B: Brand new entries to add to rabbitHoleData.json
    {
        "key_city": "nimitz",
        "name": "USS Nimitz UFO Incident - Tic Tac (2004)",
        "coordinates": {"lng": -117.1611, "lat": 32.7157},
        "date": 2004,
        "description": "During training off San Diego, radar operators and Navy fighter pilots, including Commander David Fravor, encountered a highly agile, solid white Tic-Tac-shaped craft. The object performed physics-defying maneuvers and accelerated at extreme speeds, captured on cockpit FLIR camera.",
        "source": "Wikipedia - USS Nimitz UFO incident",
        "images": [
            "https://www.youtube.com/watch?v=rO_M0hLlJ-Q"
        ]
    },
    {
        "key_city": "belgian",
        "name": "Belgian UFO Wave (1989-1990)",
        "coordinates": {"lng": 4.3517, "lat": 50.8503},
        "date": 1989,
        "description": "A series of sightings of silent, low-flying, massive triangular craft with three bright white lights and a central red flashing light, monitored by thousands of citizens and tracked by Belgian Air Force F-16 interceptors on radar.",
        "source": "Wikipedia - Belgian UFO wave",
        "images": [
            "https://upload.wikimedia.org/wikipedia/en/c/c5/Patrick_Mar%C3%A9chal_UFO_photo_uncropped.jpg",
            "https://upload.wikimedia.org/wikipedia/commons/8/8c/Vaguebelge%28reconstitution%29.png"
        ]
    },
    {
        "key_city": "rendlesham",
        "name": "Rendlesham Forest Incident (1980)",
        "coordinates": {"lng": 1.4394, "lat": 52.0911},
        "date": 1980,
        "description": "A series of reported sightings of unexplained lights and the alleged landing of a metallic craft near RAF Woodbridge, witnessed by U.S. Air Force personnel including Deputy Base Commander Col. Charles Halt, who recorded audio tapes of the radioactive landing site.",
        "source": "Wikipedia - Rendlesham Forest incident",
        "images": [
            "https://upload.wikimedia.org/wikipedia/commons/3/3d/Supposed_UFO_landing_site_-_Rendlesham_Forest_-_geograph.org.uk_-_263104.jpg"
        ]
    },
    {
        "key_city": "kecksburg",
        "name": "Kecksburg UFO Incident - Kecksburg, Pennsylvania (1965)",
        "coordinates": {"lng": -79.4623, "lat": 40.1848},
        "date": 1965,
        "description": "A large, metallic, acorn-shaped object carrying hieroglyphic-like markings crashed in the woods near Kecksburg. Witnesses reported that the military quickly cordoned off the area and carted the object away on a flatbed truck.",
        "source": "Wikipedia - Kecksburg UFO incident",
        "images": [
            "https://upload.wikimedia.org/wikipedia/commons/9/9b/Kecksburg_UFO.JPG"
        ]
    },
    {
        "key_city": "gimbal",
        "name": "Gimbal & GoFast UFO Encounters (2015)",
        "coordinates": {"lng": -75.9779, "lat": 36.8508},
        "date": 2015,
        "description": "Declassified cockpit sensor videos captured by Navy F/A-18 fighter pilots showing unidentified anomalous objects moving at high speeds against the wind and rotating, prompting military announcements regarding UAP investigation programs.",
        "source": "Wikipedia - Pentagon UFO videos",
        "images": [
            "https://www.youtube.com/watch?v=wCT3HdHokaw"
        ]
    },
    {
        "key_city": "ohare",
        "name": "Chicago O'Hare UFO Sighting (2006)",
        "coordinates": {"lng": -87.9073, "lat": 41.9742},
        "date": 2006,
        "description": "A metallic, saucer-shaped craft hovered silently over Terminal C at Chicago O'Hare Airport before accelerating vertically at extreme speed, punching a clean circular hole in the thick cloud cover, witnessed by pilots and airline employees.",
        "source": "Wikipedia - 2006 Chicago O'Hare International Airport UFO sighting",
        "images": [
            "https://www.youtube.com/watch?v=tC9EEFb6ZL4"
        ]
    },
    {
        "key_city": "westall",
        "name": "Westall UFO Incident - Melbourne, Australia (1966)",
        "coordinates": {"lng": 145.1206, "lat": -37.9407},
        "date": 1966,
        "description": "An encounter witnessed by over 200 students and teachers at two Melbourne schools. A grey saucer-shaped craft was observed landing in a nearby paddock, rising, and flying away. Witnesses claim they were pressured by authorities to remain silent.",
        "source": "Wikipedia - Westall UFO incident",
        "images": [
            "https://www.youtube.com/watch?v=ZY-xj_b-c7c"
        ]
    },
    {
        "key_city": "ariel",
        "name": "Ariel School UFO Incident - Ruwa, Zimbabwe (1994)",
        "coordinates": {"lng": 31.2464, "lat": -17.8928},
        "date": 1994,
        "description": "Sixty-two students at the Ariel School in Ruwa reported seeing one or more silver craft land in a field near their school and witnessing humanoid beings emerge, who communicated telepathic messages regarding environmental preservation.",
        "source": "Wikipedia - Ariel School UFO incident",
        "images": [
            "https://www.youtube.com/watch?v=gRtp_jUCq0o"
        ]
    },
    {
        "key_city": "valensole",
        "name": "Valensole UFO Incident - Valensole, France (1965)",
        "coordinates": {"lng": 5.9839, "lat": 43.8378},
        "date": 1965,
        "description": "Lavender farmer Maurice Masse reported seeing an egg-shaped craft land in his field and observing two small humanoid figures. The landing left physical traces in the soil and caused Masse to experience temporary paralysis.",
        "source": "Wikipedia - UFO sightings in France",
        "images": [
            "https://upload.wikimedia.org/wikipedia/commons/8/8d/Valensole_humanoid.png"
        ]
    },
    {
        "key_city": "colares",
        "name": "Colares UFO Incident - Operation Saucer (1977)",
        "coordinates": {"lng": -48.2833, "lat": -0.9333},
        "date": 1977,
        "description": "A wave of UFO sightings in which residents of Colares, Brazil, reported being beamed with intense light rays causing burn marks, puncture wounds, and blood loss. The Brazilian Air Force investigated under the classified 'Operation Saucer'.",
        "source": "Wikipedia - Colares UFO incident",
        "images": [
            "https://upload.wikimedia.org/wikipedia/commons/1/17/Estrutura_Documental_da_Opera%C3%A7%C3%A3o_Prato.png"
        ]
    },
    {
        "key_city": "washington1952",
        "name": "Washington D.C. UFO Flap - Washington D.C. (1952)",
        "coordinates": {"lng": -77.0369, "lat": 38.9072},
        "date": 1952,
        "description": "A series of radar and visual sightings of unidentified flying objects hovering over the White House and Capitol, prompting jet interceptor scrambles and a massive press conference by Major General John Samford.",
        "source": "Wikipedia - 1952 Washington, D.C., UFO incident",
        "images": [
            "https://upload.wikimedia.org/wikipedia/commons/b/bd/Washington_National_%281944%29.jpg",
            "https://upload.wikimedia.org/wikipedia/commons/1/13/1952_UFO_Flap_-_Air_Force_frequency_graph_of_UFO_reports.png"
        ]
    }
]

def extract_year(date_str):
    if not date_str:
        return 2026
    date_part = date_str.split(' ')[0]
    parts = date_part.split('/')
    if len(parts) == 3:
        try:
            return int(parts[2])
        except ValueError:
            pass
    parts_dash = date_part.split('-')
    if len(parts_dash) == 3:
        try:
            return int(parts_dash[0])
        except ValueError:
            pass
    match = re.search(r'\b(19\d{2}|20\d{2})\b', date_str)
    if match:
        return int(match.group(1))
    return 2026

def main():
    print("Loading databases...")
    with open(UFO1_PATH, "r") as f:
        ufo1 = json.load(f)
    with open(UFO2_PATH, "r") as f:
        ufo2 = json.load(f)
    with open(RABBIT_PATH, "r") as f:
        rabbit = json.load(f)

    print("Loading and indexing raw CSV dataset...")
    csv_rows = []
    with open(CSV_PATH, "r", encoding="utf-8", errors="ignore") as f:
        reader = csv.DictReader(f)
        for row in reader:
            csv_rows.append(row)

    csv_index = {}
    for row in csv_rows:
        try:
            lat = round(float(row['latitude']), 3)
            lng = round(float(row['longitude']), 3)
            key = (lat, lng)
            if key not in csv_index:
                csv_index[key] = []
            csv_index[key].append(row)
        except ValueError:
            pass

    print(f"Indexed {len(csv_index)} coordinate locations from {len(csv_rows)} CSV rows.")

    # Match resolver helper
    def find_csv_match(u):
        u_lat = u['coordinates'][1]
        u_lng = u['coordinates'][0]
        key = (round(u_lat, 3), round(u_lng, 3))
        candidates = csv_index.get(key, [])
        if len(candidates) == 1:
            return candidates[0]
        elif len(candidates) > 1:
            u_name_lower = u['name'].lower()
            for cand in candidates:
                cand_city = cand['city_area'].lower()
                if any(part in u_name_lower for part in cand_city.split()):
                    return cand
            return candidates[0]
        return None

    # Step 1: Parse and restore dates/descriptions for ufoData-1 and ufoData-2
    print("\nProcessing and restoring dates/descriptions in ufoData files...")
    updated_datasets_count = 0

    for name, ufo_list in [("ufoData-1.json", ufo1), ("ufoData-2.json", ufo2)]:
        local_updated = 0
        local_failed = 0
        for item in ufo_list:
            # Special manual fix for Mescalero, New Mexico
            if item.get("id") == "ufo-real-kp9dpzs8i":
                item["date"] = 1974
                item["description"] = "A visual encounter was reported on May 22, 1974, at the Mescalero Indian Reservation, New Mexico. Witnesses observed a strange aerial anomaly over the reservation skies."
                local_updated += 1
                continue

            match = find_csv_match(item)
            if match:
                raw_date = match.get("date_time")
                year = extract_year(raw_date)
                raw_desc = match.get("description", "")
                clean_desc = html.unescape(raw_desc).strip()
                # Clean up multiple whitespaces
                clean_desc = re.sub(r'\s+', ' ', clean_desc)
                if clean_desc:
                    # Enforce sentence capitalization and basic format
                    if not clean_desc.endswith('.'):
                        clean_desc += '.'
                    item["description"] = clean_desc
                item["date"] = year
                local_updated += 1
            else:
                local_failed += 1
        
        print(f"  {name}: restored {local_updated} entries. Unmatched: {local_failed}")
        updated_datasets_count += local_updated

    # Step 2: Inject famous UFO sightings into the databases
    # Group A: Update in-place in ufoData files
    print("\nInjecting famous Group A sightings into ufoData files...")
    
    group_a_sightings = [s for s in FAMOUS_SIGHTINGS if s["key_city"] in ["roswell", "phoenix", "lubbock", "tehran", "stephenville"]]
    group_b_sightings = [s for s in FAMOUS_SIGHTINGS if s not in group_a_sightings]

    for fs in group_a_sightings:
        city = fs["key_city"]
        target_found = False

        # Try to find target entries in ufo1 and ufo2
        for dataset_name, ufo_list in [("ufoData-1.json", ufo1), ("ufoData-2.json", ufo2)]:
            for item in ufo_list:
                item_name_lower = item.get("name", "").lower()
                # Check for match (e.g. 'Roswell, New Mexico' or ID match)
                if city in item_name_lower:
                    item["name"] = fs["name"]
                    item["coordinates"] = [fs["coordinates"]["lng"], fs["coordinates"]["lat"]]
                    item["date"] = fs["date"]
                    item["description"] = fs["description"]
                    item["source"] = fs["source"]
                    item["images"] = fs["images"]
                    print(f"  -> In-place updated entry in {dataset_name} for famous sighting: '{fs['name']}' (ID: {item['id']})")
                    target_found = True
                    break
            if target_found:
                break
        
        if not target_found:
            # Fallback: append as new item in rabbitHoleData.json
            group_b_sightings.append(fs)

    # Group B: Add as new premium entries in rabbitHoleData.json
    print("\nInjecting famous Group B sightings into rabbitHoleData.json...")
    
    # Find highest ID in rabbitHoleData.json
    highest_idx = -1
    for item in rabbit:
        if item.get("category") == "UFOs - Sightings" or item.get("category") == "Bigfoot":
            # Just look at the suffix of the ID
            m = re.search(r'-(\d+)$', item.get("id", ""))
            if m:
                idx = int(m.group(1))
                if idx > highest_idx:
                    highest_idx = idx

    # If Bigfoot went up to 996, let's start after that
    next_idx = max(highest_idx + 1, 1000)
    print(f"Starting index for new premium items: {next_idx}")

    added_count = 0
    for fs in group_b_sightings:
        # Check if already added
        name = fs["name"]
        is_dup = False
        for item in rabbit:
            if item.get("name", "").lower() == name.lower():
                is_dup = True
                break
        
        if is_dup:
            print(f"  -> Sighting '{name}' already exists in rabbitHoleData.json. Updating in-place.")
            for item in rabbit:
                if item.get("name", "").lower() == name.lower():
                    item["date"] = fs["date"]
                    item["description"] = fs["description"]
                    item["source"] = fs["source"]
                    item["images"] = fs["images"]
                    item["coordinates"] = fs["coordinates"]
                    break
            continue

        item_id = f"anomaly-UFO-{next_idx}"
        new_item = {
            "id": item_id,
            "name": name,
            "category": "UFOs - Sightings",
            "type": "Point",
            "coordinates": fs["coordinates"],
            "date": fs["date"],
            "description": fs["description"],
            "source": fs["source"],
            "images": fs["images"]
        }
        rabbit.append(new_item)
        print(f"  -> Appended new sighting: '{name}' (ID: {item_id})")
        next_idx += 1
        added_count += 1

    # Save all modified files
    print("\nSaving updated databases...")
    with open(UFO1_PATH, "w") as f:
        json.dump(ufo1, f, indent=2)
    with open(UFO2_PATH, "w") as f:
        json.dump(ufo2, f, indent=2)
    with open(RABBIT_PATH, "w") as f:
        json.dump(rabbit, f, indent=2)

    print("\nAll database updates completed successfully!")

if __name__ == "__main__":
    main()
