import json
import urllib.request
import urllib.parse
import time
import ssl
import re

JSON_PATH = '/Users/jessehuffman/antigravity/MTRH-Interactive-Map/src/rabbitHoleData.json'
ENV_PATH = '/Users/jessehuffman/antigravity/MTRH-Interactive-Map/.env'

ssl_context = ssl._create_unverified_context()

def load_gemini_key():
    try:
        with open(ENV_PATH, 'r') as f:
            for line in f:
                if line.startswith('GEMINI_API_KEY='):
                    return line.strip().split('=', 1)[1].replace('"', '').replace("'", "")
    except Exception as e:
        print(f"Could not load key from .env: {e}")
    return None

def get_category_members(category_title):
    url = f"https://en.wikipedia.org/w/api.php?action=query&list=categorymembers&cmtitle={urllib.parse.quote(category_title)}&cmlimit=500&format=json"
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'MTRH-Bot/1.0 (jhuffman710@gmail.com)'})
        with urllib.request.urlopen(req, context=ssl_context, timeout=10) as response:
            res_data = json.loads(response.read().decode())
            members = res_data.get('query', {}).get('categorymembers', [])
            return members
    except Exception as e:
        print(f"Failed to fetch category members for '{category_title}': {e}")
    return []

# Recursively crawl categories to find article pages
visited_categories = set()
found_articles = set()

def crawl_category(cat_title, current_depth, max_depth=2):
    if cat_title in visited_categories or current_depth > max_depth:
        return
    visited_categories.add(cat_title)
    print(f"Crawling category (depth {current_depth}): {cat_title}...")
    members = get_category_members(cat_title)
    subcats = []
    
    for m in members:
        ns = m['ns']
        title = m['title']
        if ns == 0:  # Article
            found_articles.add(title)
        elif ns == 14:  # Subcategory
            lower = title.lower()
            # Crawl subcategories related to rock art, carvings, or petroglyphs
            if any(term in lower for term in ["museum", "organization", "researcher", "rock art sites in", "petroglyphs by", "rock art by"]):
                subcats.append(title)
            elif "rock art" in lower or "petroglyph" in lower or "carving" in lower:
                subcats.append(title)
                
    for subcat in subcats:
        crawl_category(subcat, current_depth + 1, max_depth)

# Fetch coordinates and thumbnails in batch from Wikipedia
def batch_fetch_details(titles, batch_size=50):
    details_map = {}
    for i in range(0, len(titles), batch_size):
        batch = titles[i:i+batch_size]
        titles_str = "|".join(urllib.parse.quote(t) for t in batch)
        url = f"https://en.wikipedia.org/w/api.php?action=query&prop=coordinates|pageimages|extracts&exintro=true&explaintext=true&titles={titles_str}&pithumbsize=1000&format=json&redirects=true"
        try:
            req = urllib.request.Request(url, headers={'User-Agent': 'MTRH-Bot/1.0 (jhuffman710@gmail.com)'})
            with urllib.request.urlopen(req, context=ssl_context, timeout=15) as response:
                res_data = json.loads(response.read().decode())
                pages = res_data.get('query', {}).get('pages', {})
                for page_id, info in pages.items():
                    if page_id == "-1":
                        continue
                    
                    title = info.get('title')
                    coords_list = info.get('coordinates', [])
                    coords = None
                    if coords_list:
                        coords = {
                            "lng": coords_list[0]['lon'],
                            "lat": coords_list[0]['lat']
                        }
                    
                    img_url = info.get('thumbnail', {}).get('source')
                    summary = info.get('extract', '')
                    
                    if coords:
                        details_map[title] = {
                            "coords": coords,
                            "image": img_url,
                            "summary": summary
                        }
            # Respect API limits and load politely
            time.sleep(0.2)
        except Exception as e:
            print(f"Batch fetch details error at index {i}: {e}")
    return details_map

def generate_description_gemini(api_key, name, wiki_summary):
    prompt = (
        "You are a conspiracy theorist and alternative historian for MTRH (Mapping the Rabbit Hole). "
        f"Rewrite the following Wikipedia summary of the rock art/petroglyph site '{name}' into an alternative-history-slanted, "
        "mysterious description. Focus on conspiracy-friendly angles (such as ancient astronaut theories, paleocontact, "
        "energy ley lines, astronomical stargates, or pre-diluvian giants). Keep the description engaging, eerie, "
        "and under 3 sentences. Output ONLY the rewritten description and nothing else.\n\n"
        f"Wikipedia Summary: {wiki_summary}"
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
    try:
        data = json.dumps(payload).encode('utf-8')
        req = urllib.request.Request(url, data=data, headers=headers, method='POST')
        with urllib.request.urlopen(req, context=ssl_context, timeout=12) as response:
            res_json = json.loads(response.read().decode('utf-8'))
            text = res_json['candidates'][0]['content']['parts'][0]['text'].strip()
            # Clean markdown codeblocks or quotes if returned
            text = re.sub(r'^```html\s*', '', text)
            text = re.sub(r'^```text\s*', '', text)
            text = re.sub(r'^```\s*', '', text)
            text = re.sub(r'\s*```$', '', text)
            text = text.strip('"\'')
            return text
    except Exception as e:
        print(f"Gemini API request failed for '{name}': {e}")
    return None

def is_duplicate(name, coords, existing_data):
    name_lower = name.lower()
    for item in existing_data:
        # Check name similarity
        if item.get('name', '').lower() == name_lower:
            return True
        
        # Check coordinate proximity
        existing_coords = item.get('coordinates')
        if existing_coords and coords:
            elng, elat = None, None
            # Handle LineString coordinates (list of lists)
            if item.get('type') == 'LineString' or (isinstance(existing_coords, list) and len(existing_coords) > 0 and isinstance(existing_coords[0], list)):
                if len(existing_coords[0]) >= 2:
                    elng, elat = existing_coords[0][0], existing_coords[0][1]
            elif isinstance(existing_coords, list):
                if len(existing_coords) >= 2:
                    elng, elat = existing_coords[0], existing_coords[1]
            elif isinstance(existing_coords, dict):
                elng, elat = existing_coords.get('lng'), existing_coords.get('lat')
                
            clng, clat = None, None
            if isinstance(coords, list):
                if len(coords) >= 2:
                    clng, clat = coords[0], coords[1]
            elif isinstance(coords, dict):
                clng, clat = coords.get('lng'), coords.get('lat')
                
            if elng is not None and elat is not None and clng is not None and clat is not None:
                dist = ((elng - clng) ** 2 + (elat - clat) ** 2) ** 0.5
                if dist < 0.05:  # Within ~5km proximity
                    return True
    return False

def main():
    api_key = load_gemini_key()
    if not api_key:
        print("Error: Gemini API Key not found! Cannot generate descriptions.")
        return

    print("Crawl Category Trees on Wikipedia...")
    crawl_category("Category:Petroglyphs", current_depth=0, max_depth=2)
    crawl_category("Category:Rock art", current_depth=0, max_depth=2)
    
    unique_articles = list(found_articles)
    print(f"\nDiscovered {len(unique_articles)} rock art article pages.")

    print("\nFetching metadata (coordinates, images, extracts)...")
    details_map = batch_fetch_details(unique_articles)
    print(f"Found coordinates for {len(details_map)} articles.")

    print("\nLoading database...")
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
    skipped_count = 0
    
    for title, details in details_map.items():
        coords = details["coords"]
        img_url = details["image"]
        summary = details["summary"]
        
        # Format name cleanly
        name = title.replace(" (cave art)", "").replace(" (archaeological site)", "")
        
        # Deduplication
        if is_duplicate(name, coords, data):
            # Print skipped
            skipped_count += 1
            continue

        print(f"\nProcessing '{name}'...")
        
        # Generate description using Gemini
        desc = None
        if summary:
            # Truncate summary if too long to save token cost
            truncated_summary = summary[:600]
            print(f"  -> Generating conspiracy description using Gemini...")
            desc = generate_description_gemini(api_key, name, truncated_summary)
            
        if not desc:
            # Fallback
            desc = f"An ancient rock art site containing mysterious markings and carvings. Theorists suspect the site sits along planetary magnetic lines, serving as a landmark of prehistoric cultures or early sky-god visitations."
            print(f"  -> Using fallback description.")
            
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
        print(f"  -> Description: \"{desc}\"")
        
        next_idx += 1
        added_count += 1
        
        # Respect limits and sleep
        time.sleep(0.4)

    if added_count > 0:
        print(f"\nSaving database with {added_count} new entries...")
        with open(JSON_PATH, 'w') as f:
            json.dump(data, f, indent=2)
        print("Database saved successfully!")
    else:
        print("\nNo new entries added to the database.")

    print(f"\nSummary:")
    print(f"  Discovered: {len(unique_articles)}")
    print(f"  Checked Coords: {len(details_map)}")
    print(f"  Skipped (Duplicates): {skipped_count}")
    print(f"  Added: {added_count}")

if __name__ == "__main__":
    main()
