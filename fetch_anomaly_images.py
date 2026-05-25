import json
import urllib.request
import urllib.parse
import time
import os

import ssl

JSON_PATH = '/Users/jessehuffman/antigravity/MTRH-Interactive-Map/src/rabbitHoleData.json'

TARGET_CATEGORIES = [
    "National Parks & Reserves",
    "Portals / Stargates / Underworld / Hollow Earth Entrances",
    "D.U.M.B.s",
    "Burial Mounds"
]

ssl_context = ssl._create_unverified_context()

def fetch_wikipedia_thumbnail(query):
    # Step 1: Search Wikipedia for the closest title
    search_url = f"https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch={urllib.parse.quote(query)}&format=json&utf8=1"
    try:
        req = urllib.request.Request(search_url, headers={'User-Agent': 'MTRH-Bot/1.0 (jhuffman710@gmail.com)'})
        with urllib.request.urlopen(req, context=ssl_context, timeout=10) as response:
            res_data = json.loads(response.read().decode())
            search_results = res_data.get('query', {}).get('search', [])
            if not search_results:
                return None
            title = search_results[0]['title']
    except Exception as e:
        print(f"Search failed for '{query}': {e}")
        return None

    # Step 2: Get the main thumbnail image of the resolved page
    thumb_url = f"https://en.wikipedia.org/w/api.php?action=query&format=json&prop=pageimages&titles={urllib.parse.quote(title)}&pithumbsize=1000&redirects=true"
    try:
        req = urllib.request.Request(thumb_url, headers={'User-Agent': 'MTRH-Bot/1.0 (jhuffman710@gmail.com)'})
        with urllib.request.urlopen(req, context=ssl_context, timeout=10) as response:
            res_data = json.loads(response.read().decode())
            pages = res_data.get('query', {}).get('pages', {})
            for page_id, page_info in pages.items():
                thumbnail = page_info.get('thumbnail', {})
                img_source = thumbnail.get('source')
                if img_source and img_source.startswith('http'):
                    # We found a valid thumbnail URL
                    return img_source
    except Exception as e:
        print(f"Thumbnail fetch failed for '{title}': {e}")
    return None

def main():
    print("Loading database...")
    with open(JSON_PATH, 'r') as f:
        data = json.load(f)

    updated_count = 0
    skipped_count = 0
    not_found_count = 0

    print(f"Processing database entries. Total items: {len(data)}")
    
    for i, item in enumerate(data):
        category = item.get('category')
        if category not in TARGET_CATEGORIES:
            continue

        name = item.get('name')
        images = item.get('images', [])

        # Constraint 2: Skip if it already has images
        if images and len(images) > 0:
            skipped_count += 1
            continue

        print(f"[{i}] Querying Wikipedia for: '{name}' ({category})...")
        img_url = fetch_wikipedia_thumbnail(name)
        
        if img_url:
            print(f"  -> Found: {img_url}")
            item['images'] = [img_url]
            updated_count += 1
        else:
            print("  -> No image found.")
            not_found_count += 1

        # Politely rate-limit requests to Wikipedia API
        time.sleep(0.15)

    if updated_count > 0:
        print(f"Saving database with {updated_count} updated entries...")
        with open(JSON_PATH, 'w') as f:
            json.dump(data, f, indent=2)
        print("Database saved successfully!")
    else:
        print("No changes made to the database.")

    print("\nSummary:")
    print(f"  Updated:   {updated_count}")
    print(f"  Skipped:   {skipped_count} (already had images)")
    print(f"  Not Found: {not_found_count}")

if __name__ == "__main__":
    main()
