import os
import re
import ssl
import json
import time
import urllib.request
import urllib.parse
from html.parser import HTMLParser

CONTENT_PATH = "/Users/jessehuffman/.gemini/antigravity/brain/42c6dd3c-79fa-44a2-b55c-d2fe1b50dc57/.system_generated/steps/36/content.md"
JSON_PATH = "/Users/jessehuffman/antigravity/MTRH-Interactive-Map/src/rabbitHoleData.json"
ENV_PATH = "/Users/jessehuffman/antigravity/MTRH-Interactive-Map/.env"

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

class WikiTableParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.in_table = False
        self.in_tr = False
        self.in_td = False
        self.in_th = False
        self.tables = []
        self.current_table = []
        self.current_row = []
        self.current_cell_data = []
        self.current_cell_attrs = {}
        self.current_cell_wiki_title = None
        
    def handle_starttag(self, tag, attrs):
        attrs_dict = dict(attrs)
        if tag == "table":
            if "wikitable" in attrs_dict.get("class", ""):
                self.in_table = True
                self.current_table = []
        elif tag == "tr" and self.in_table:
            self.in_tr = True
            self.current_row = []
        elif tag == "td" and self.in_tr:
            self.in_td = True
            self.current_cell_data = []
            self.current_cell_attrs = attrs_dict
            self.current_cell_wiki_title = None
        elif tag == "th" and self.in_tr:
            self.in_th = True
            self.current_cell_data = []
            self.current_cell_attrs = attrs_dict
        elif tag == "a" and (self.in_td or self.in_th):
            href = attrs_dict.get("href", "")
            if "geohack.php" in href:
                self.current_cell_data.append(f"__GEOHACK_LINK__:{href}")
            elif href.startswith("/wiki/") and not any(ns in href for ns in [":", "Main_Page"]):
                title_part = href.split("/wiki/")[1]
                self.current_cell_wiki_title = urllib.parse.unquote(title_part).replace("_", " ")

    def handle_endtag(self, tag):
        if tag == "table" and self.in_table:
            self.in_table = False
            self.tables.append(self.current_table)
        elif tag == "tr" and self.in_tr:
            self.in_tr = False
            self.current_table.append(self.current_row)
        elif tag == "td" and self.in_td:
            self.in_td = False
            cell_text = "".join(self.current_cell_data).strip()
            self.current_row.append({
                "text": cell_text,
                "rowspan": int(self.current_cell_attrs.get("rowspan", 1)),
                "colspan": int(self.current_cell_attrs.get("colspan", 1)),
                "wiki_title": self.current_cell_wiki_title
            })
        elif tag == "th" and self.in_th:
            self.in_th = False
            cell_text = "".join(self.current_cell_data).strip()
            self.current_row.append({
                "text": cell_text,
                "is_header": True
            })

    def handle_data(self, data):
        if self.in_td or self.in_th:
            self.current_cell_data.append(data)

def parse_geohack_params(params):
    match = re.search(r'params=([0-9.]+)_([NS])_([0-9.]+)_([EW])', params)
    if match:
        lat_val = float(match.group(1))
        lat_dir = match.group(2)
        lng_val = float(match.group(3))
        lng_dir = match.group(4)
        
        lat = lat_val if lat_dir == 'N' else -lat_val
        lng = lng_val if lng_dir == 'E' else -lng_val
        return {"lng": lng, "lat": lat}
    
    match = re.search(r'params=([0-9.-]+)[_;]([0-9.-]+)', params)
    if match:
        try:
            lat = float(match.group(1))
            lng = float(match.group(2))
            if -90 <= lat <= 90 and -180 <= lng <= 180:
                return {"lng": lng, "lat": lat}
        except ValueError:
            pass
            
    return None

def process_table_rows(table):
    processed_rows = []
    active_spans = {}
    
    for row_idx, row in enumerate(table):
        if any(cell.get("is_header") for cell in row):
            continue
            
        processed_row = [None] * 4
        col_idx = 0
        cell_ptr = 0
        
        while col_idx < 4:
            if col_idx in active_spans:
                cell_dict, remaining = active_spans[col_idx]
                processed_row[col_idx] = cell_dict
                if remaining - 1 > 0:
                    active_spans[col_idx] = (cell_dict, remaining - 1)
                else:
                    del active_spans[col_idx]
                col_idx += 1
            else:
                if cell_ptr < len(row):
                    cell = row[cell_ptr]
                    cell_ptr += 1
                    
                    rowspan = cell.get("rowspan", 1)
                    processed_row[col_idx] = {
                        "text": cell.get("text", ""),
                        "wiki_title": cell.get("wiki_title")
                    }
                    
                    if rowspan > 1:
                        active_spans[col_idx] = (processed_row[col_idx], rowspan - 1)
                        
                    col_idx += 1
                else:
                    break
        
        processed_rows.append(processed_row)
        
    return processed_rows

def batch_fetch_thumbnails(titles, batch_size=50):
    details_map = {}
    for i in range(0, len(titles), batch_size):
        batch = titles[i:i+batch_size]
        titles_str = "|".join(urllib.parse.quote(t) for t in batch)
        url = f"https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&pithumbsize=1000&titles={titles_str}&format=json&redirects=true"
        try:
            req = urllib.request.Request(url, headers={'User-Agent': 'MTRH-Bot/1.0 (jhuffman710@gmail.com)'})
            with urllib.request.urlopen(req, context=ssl_context, timeout=15) as response:
                res_data = json.loads(response.read().decode())
                pages = res_data.get('query', {}).get('pages', {})
                for page_id, info in pages.items():
                    if page_id == "-1":
                        continue
                    title = info.get('title')
                    img_url = info.get('thumbnail', {}).get('source')
                    if img_url:
                        details_map[title] = img_url
            time.sleep(0.2)
        except Exception as e:
            print(f"Batch fetch details error at index {i}: {e}")
    return details_map

def generate_description_gemini(api_key, name, details):
    prompt = (
        "You are a conspiracy theorist and alternative historian for MTRH (Mapping the Rabbit Hole). "
        f"Rewrite the following details about the location '{name}' (which is censored/blurred on Google Maps) "
        "into an alternative-history-slanted, mysterious description. Focus on conspiracy-friendly angles "
        "(such as black budget sites, secret military research, weather control, reverse-engineered technology, "
        "UFO bases, underground bunkers, or deep state cover-ups). Keep the description engaging, eerie, "
        "and under 3 sentences. Output ONLY the rewritten description and nothing else.\n\n"
        f"Location details: {details}"
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
            text = re.sub(r'^```html\s*', '', text)
            text = re.sub(r'^```text\s*', '', text)
            text = re.sub(r'^```\s*', '', text)
            text = re.sub(r'\s*```$', '', text)
            text = text.strip('"\'')
            return text
    except Exception as e:
        print(f"Gemini API request failed for '{name}': {e}")
    return None

def main():
    api_key = load_gemini_key()
    if not api_key:
        print("Error: Gemini API Key not found in .env! Cannot generate descriptions.")
        return

    print("Parsing Wikipedia page content...")
    with open(CONTENT_PATH, 'r', encoding='utf-8') as f:
        html_content = f.read()

    parser = WikiTableParser()
    parser.feed(html_content)

    print(f"Parsed {len(parser.tables)} tables.")
    all_locations = []
    
    for i, table in enumerate(parser.tables):
        rows = process_table_rows(table)
        for row in rows:
            if not row or len(row) < 4:
                continue
                
            loc_name_raw = row[0]["text"] if row[0] else ""
            wiki_title = row[0]["wiki_title"] if row[0] else None
            country_raw = row[1]["text"] if row[1] else ""
            details_raw = row[2]["text"] if row[2] else ""
            link_cell = row[3]["text"] if row[3] else ""
            
            if not loc_name_raw or not link_cell:
                continue
                
            # Clean name and details
            loc_name = re.sub(r'\[\d+\]', '', loc_name_raw).strip()
            loc_name = re.sub(r'\s+', ' ', loc_name)
            
            # If name is '—', fallback to wiki_title or details snippet
            if loc_name == '—' or not loc_name:
                if wiki_title:
                    loc_name = wiki_title
                else:
                    loc_name = f"Censored Site in {country_raw.strip()}"
            
            details = re.sub(r'\[\d+\]', '', details_raw).strip()
            details = re.sub(r'\s+', ' ', details)
            
            coords = None
            geohack_match = re.search(r'__GEOHACK_LINK__:([^\s]+)', link_cell)
            if geohack_match:
                coords = parse_geohack_params(geohack_match.group(1))
                
            if coords:
                all_locations.append({
                    "name": loc_name,
                    "wiki_title": wiki_title,
                    "country": country_raw.strip() if country_raw else "Unknown",
                    "details": details,
                    "coordinates": coords
                })

    print(f"Total parsed locations with coords: {len(all_locations)}")

    # Fetch Wikipedia thumbnails
    wiki_titles = [loc["wiki_title"] for loc in all_locations if loc["wiki_title"]]
    print(f"Fetching Wikipedia thumbnails for {len(wiki_titles)} pages...")
    thumbnails_map = batch_fetch_thumbnails(wiki_titles)
    print(f"Found thumbnails for {len(thumbnails_map)} locations.")

    # Load database
    print("Loading database...")
    with open(JSON_PATH, 'r') as f:
        data = json.load(f)

    # Find highest index for Blurred on Google Maps
    highest_idx = -1
    for item in data:
        if item.get('category') == "Blurred on Google Maps":
            item_id = item.get('id', '')
            match = re.search(r'anomaly-Blurred-on-Google-Maps-(\d+)$', item_id)
            if match:
                idx = int(match.group(1))
                if idx > highest_idx:
                    highest_idx = idx
    
    next_idx = highest_idx + 1
    print(f"Highest index: {highest_idx}. Next index: {next_idx}")

    # Process and append entries
    added_count = 0
    
    for loc in all_locations:
        name = loc["name"]
        coords = loc["coordinates"]
        country = loc["country"]
        original_details = loc["details"]
        wiki_title = loc["wiki_title"]
        
        # Deduplication
        is_dup = False
        for item in data:
            if item.get('category') == "Blurred on Google Maps" and item.get('name', '').lower() == name.lower():
                is_dup = True
                break
            existing_coords = item.get('coordinates')
            if existing_coords and isinstance(existing_coords, dict):
                dist = ((existing_coords.get('lng', 0) - coords['lng']) ** 2 + (existing_coords.get('lat', 0) - coords['lat']) ** 2) ** 0.5
                if dist < 0.01:
                    is_dup = True
                    break
        if is_dup:
            continue

        print(f"\nProcessing '{name}' ({country})...")
        
        # Let's generate a conspiracy description
        desc = generate_description_gemini(api_key, name, f"{original_details} located in {country}")
        if not desc:
            desc = f"A highly classified zone located in {country} that has been scrubbed from public mapping grids. Conspiracy theorists believe the area conceals sensitive underground military infrastructure or covert operations shielded from aerial view."
            print("  -> Using fallback description.")
        
        # Get image
        img_url = thumbnails_map.get(wiki_title) if wiki_title else None
        
        id_slug = f"anomaly-Blurred-on-Google-Maps-{next_idx}"
        
        new_anomaly = {
            "id": id_slug,
            "name": name,
            "category": "Blurred on Google Maps",
            "type": "Point",
            "coordinates": coords,
            "date": None,
            "description": desc,
            "source": f"Wikipedia - {wiki_title}" if wiki_title else "Wikipedia / Cartographic Censorship Records",
            "images": [img_url] if img_url else []
        }
        
        data.append(new_anomaly)
        print(f"  -> Added as '{id_slug}'")
        print(f"  -> Description: {desc}")
        next_idx += 1
        added_count += 1
        
        time.sleep(0.4) # Respect rate limits

    if added_count > 0:
        print(f"\nSaving database with {added_count} new entries...")
        with open(JSON_PATH, 'w') as f:
            json.dump(data, f, indent=2)
        print("Database updated successfully!")
    else:
        print("\nNo new entries were added.")

if __name__ == "__main__":
    main()
