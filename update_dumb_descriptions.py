import json

JSON_PATH = '/Users/jessehuffman/antigravity/MTRH-Interactive-Map/src/rabbitHoleData.json'

BASE_DESCRIPTIONS = {
    "The White House": "An underground presidential command bunker (PEOC) extending deep into the earth. Purported to house cryogenic chambers, classified executive archives, and secret underground transit tunnels linking to Mount Weather and Raven Rock.",
    "Brooks Range": "A covert subterranean facility hidden beneath the remote Alaskan permafrost. Rumored to monitor high-frequency atmospheric activities (linked to HAARP) and study anomalous energy pockets deep within the earth.",
    "Delta Junction": "A high-security underground computing hub in Alaska, serving as a primary command-and-control node for northern missile defense arrays and advanced electronic warfare research.",
    "Fort Greely": "Known for ground-based missile interceptors, but conspiracy theorists claim it hides a multi-level subterranean facility housing quantum computing laboratories and experimental aerospace technologies.",
    "Fort Huachuca": "A massive subterranean NSA and military intelligence signals collection hub. Purported to host electronic surveillance arrays, underground communications routing, and classified remote viewing operations.",
    "Luke Air Force Base": "Rumored to feature a vast underground hangar and laboratory network, connected by tunnel systems to Area 51, dedicated to reverse-engineering exotic and classified aerospace technologies.",
    "Page": "A critical western logistics node near Lake Powell, linking Area 51 to the eastern network. Rumored to utilize massive amounts of hydroelectric power from Glen Canyon Dam for classified experiments.",
    "Wikieup": "A highly secure underground switching station and communications relay in the Arizona desert, routing high-speed subterranean maglev trains between Area 51, Phoenix, and Tucson.",
    "Yucca": "Located near the Yucca Mountain nuclear repository, this deep geological vault is rumored to serve as a cover for a classified storage base housing exotic materials, recovered debris, and advanced propulsion prototypes.",
    "Fort Stockton": "A subterranean border logistics and supply depot in West Texas, connecting southern military monitoring systems with the larger nationwide underground maglev network.",
    "Carlsbad": "Rumored to utilize the massive natural Carlsbad cavern system as a cover for a deep-underground archiving vault, storing classified national security documents and biological seed repositories.",
    "Chihuahua": "A joint-operation subterranean monitoring base located under the desert, rumored to monitor tectonic activities and test electronic border surveillance networks.",
    "Los Alamos": "The historical birthplace of atomic weapons. Purported to house a massive subterranean physics lab extending miles deep, researching advanced thermodynamics, genetics, and dimensional doorway phenomena.",
    "Las Vegas": "Purported to house a major underground control center beneath Nellis AFB, managing black-budget financial routing systems, drone-fleet operations, and VIP evacuation bunkers.",
    "Irvine": "A deep underground tactical command post beneath the Orange County hills, serving as a high-tech communications hub and a terminal for the high-speed shuttle line running to Death Valley.",
    "Vandenberg Space Force Base": "A primary underground launch control facility, housing secret space-defense systems and silos for classified orbital vehicles, connected to Edwards AFB via the subterranean 'Line 59'.",
    "Shasta": "Legend-shrouded subterranean city beneath Mount Shasta. Supposedly a highly advanced joint-habitation facility housing high-tech research, cloaked energy grids, and geothermal power systems.",
    "Salt Lake City": "A vast underground network under the temple lot and downtown SLC. Rumored to house extensive genetic databases, continuity archives, and act as a major junction in the national military maglev network.",
    "Riverton": "A mid-country subterranean logistics depot in Wyoming, rumored to store massive strategic reserves of food, water, and medical equipment for continuity-of-government scenarios.",
    "Kinsley": "Situated at the geographic center of the United States. Rumored to be a primary routing and switching junction for the transcontinental subterranean maglev system, linking the east and west coast networks.",
    "Hutchinson": "Sits above the massive salt mines, which conspiracy theorists claim serve as a cover for a vast underground storage facility holding millions of classified paper documents, corporate archives, and national treasures.",
    "Tulsa": "A deep-underground communications and radar station in Oklahoma, acting as a major junction point for maglev lines passing through the midwest.",
    "Palms": "A desert node near Twentynine Palms, rumored to be a subterranean training facility and testing ground for experimental infantry equipment and robotic combat units.",
    "Fort Irwin": "Home to the National Training Center, it is rumored to sit atop a massive subterranean training base where simulated underground warfare, combat simulation, and tunnel navigation are researched.",
    "Benicia": "A historical military site rumored to house an active underground terminal and naval facility, linking northern California's bay area installations to the deep network.",
    "Twentynine Palms": "A massive subterranean installation beneath the Marine Corps base, housing advanced geological warfare labs, electromagnetic railgun research, and deep desert shelters.",
    "Chocolate Mountains": "Sits beneath the military bombing range in California, rumored to be a highly secure underground testing facility for experimental energy weapons, stealth aircraft storage, and exotic propulsion devices.",
    "Helendale": "Sits under the radar cross-section facility, rumored to hide a subterranean assembly plant for stealth aircraft, reverse-engineered drones, and electromagnetic cloaking fields.",
    "Death Valley": "A deep subterranean research outpost, operating at extreme depths beneath the desert heat, focusing on geothermal power generation and testing advanced survival systems."
}

def find_closest_name(coords, points):
    best_dist = float('inf')
    best_name = "Unknown Base"
    for pt in points:
        pt_coords = pt.get('coordinates', {})
        dist = (pt_coords.get('lng', 0) - coords[0])**2 + (pt_coords.get('lat', 0) - coords[1])**2
        if dist < best_dist:
            best_dist = dist
            best_name = pt.get('name')
    return best_name

def main():
    print("Loading database...")
    with open(JSON_PATH, 'r') as f:
        data = json.load(f)

    # Separate points and lines for distance calculations
    dumbs_points = [item for item in data if item.get('category') == 'D.U.M.B.s' and item.get('type') == 'Point']
    
    updated_count = 0
    skipped_count = 0

    print("Updating D.U.M.B.s descriptions...")
    for item in data:
        if item.get('category') != 'D.U.M.B.s':
            continue

        name = item.get('name')
        desc = item.get('description', '')
        item_type = item.get('type')

        # Check if it needs an update
        needs_update = not desc or desc.startswith('date:') or desc.startswith('description:') or len(desc) < 30

        if not needs_update:
            skipped_count += 1
            continue

        if item_type == 'Point':
            # Point base - look up in dictionary
            new_desc = BASE_DESCRIPTIONS.get(name)
            if new_desc:
                item['description'] = new_desc
                print(f"  -> Updated Point Base: '{name}'")
                updated_count += 1
            else:
                print(f"  -> Warning: No description defined for point base '{name}'")
        
        elif item_type == 'LineString':
            # LineString tunnel - map dynamically
            coords = item.get('coordinates', [])
            if coords:
                origin = find_closest_name(coords[0], dumbs_points)
                dest = find_closest_name(coords[-1], dumbs_points)
                
                # Check for line name type
                if "Line" in name:
                    new_desc = f"A designated high-speed subterranean maglev shuttle line ({name}) in the sub-global military transit network, routing directly between the {origin} node and the {dest} node."
                else:
                    new_desc = f"A purported subterranean high-speed maglev tunnel corridor connecting the {origin} node directly to the {dest} node, allowing rapid and covert transport of military cargo and personnel."
                
                item['description'] = new_desc
                print(f"  -> Updated Tunnel Route: '{name}' ({origin} -> {dest})")
                updated_count += 1
            else:
                print(f"  -> Warning: No coordinates found for LineString '{name}'")

    if updated_count > 0:
        print(f"\nSaving database with {updated_count} updated entries...")
        with open(JSON_PATH, 'w') as f:
            json.dump(data, f, indent=2)
        print("Database saved successfully!")
    else:
        print("\nNo changes made to the database.")

    print(f"\nSummary:")
    print(f"  Updated: {updated_count}")
    print(f"  Skipped: {skipped_count} (already had descriptions)")

if __name__ == "__main__":
    main()
