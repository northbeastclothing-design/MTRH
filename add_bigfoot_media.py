import json
import re

JSON_PATH = "src/rabbitHoleData.json"

NEW_SIGHTINGS = [
    {
        "name": "Patterson-Gimlin Film - Bluff Creek, California (1967)",
        "coordinates": {"lng": -123.7019, "lat": 41.4402},
        "date": 1967,
        "description": "Shot by Roger Patterson and Bob Gimlin, this is the most famous and heavily analyzed Bigfoot footage in history. The short film depicts a large, hairy, bipedal female creature (nicknamed 'Patty') walking along a gravel bar next to Bluff Creek and looking directly at the camera.",
        "source": "Wikipedia - Patterson-Gimlin film",
        "images": [
            "https://www.youtube.com/watch?v=Q60mSMmhTZU",
            "https://www.youtube.com/watch?v=6g1JNmXcpTM",
            "https://upload.wikimedia.org/wikipedia/commons/b/b2/Patterson_Gimlin_Bigfoot.jpg",
            "https://upload.wikimedia.org/wikipedia/commons/8/87/Patterson_Gimlin_Bigfoot_%28cropped%29.jpg"
        ]
    },
    {
        "name": "Paul Freeman Footage - Blue Mountains, Washington (1994)",
        "coordinates": {"lng": -117.9730, "lat": 46.0460},
        "date": 1994,
        "description": "Captured by former U.S. Forest Service patrolman Paul Freeman near Walla Walla, Washington, this video depicts a large, dark, shaggy figure walking through the dense forest brush. Freeman was a dedicated tracker who also collected numerous plaster casts of footprints.",
        "source": "Wikipedia - Raymond L. Wallace / Bigfoot",
        "images": [
            "https://www.youtube.com/watch?v=mtrbAu8yEAI"
        ]
    },
    {
        "name": "Marble Mountain Bigfoot - Marble Mountains, California (2001)",
        "coordinates": {"lng": -123.2100, "lat": 41.5600},
        "date": 2001,
        "description": "Captured by Jim Mills while leading a youth group hiking trip, this video is one of the longest continuous clips of an alleged Sasquatch. It shows a distant, massive, black silhouette walking steadily along a treeless mountain ridge.",
        "source": "Bigfoot Field Researchers Organization",
        "images": [
            "https://www.youtube.com/watch?v=eD8XSQbayXs"
        ]
    },
    {
        "name": "Provo Canyon Bigfoot - Provo Canyon, Utah (2012)",
        "coordinates": {"lng": -111.6030, "lat": 40.3541},
        "date": 2012,
        "description": "A group of hikers in Provo Canyon filmed a large, dark, hairy creature crouched in the brush on a steep hillside. When they approached closer, the creature stood up on two legs and moved away, prompting the hikers to run.",
        "source": "YouTube Encounter Documentation",
        "images": [
            "https://www.youtube.com/watch?v=Ss_Gm_N5C48"
        ]
    },
    {
        "name": "Independence Day Bigfoot - Carbon County, Utah (2013)",
        "coordinates": {"lng": -111.0000, "lat": 39.7000},
        "date": 2013,
        "description": "Recorded on July 4, 2013, in the mountains of Utah, this controversial footage shows a large bipedal figure walking on a hillside carrying an infant-sized creature, sparking widespread frame-by-frame analysis in the research community.",
        "source": "YouTube / ThinkerThunker analysis",
        "images": [
            "https://www.youtube.com/watch?v=jit4U1913FE"
        ]
    },
    {
        "name": "Silver Star Mountain Bigfoot - Silver Star Mountain, Washington (2005)",
        "coordinates": {"lng": -122.2460, "lat": 45.7480},
        "date": 2005,
        "description": "Two hikers on Silver Star Mountain in Skamania County, Washington, photographed a tall, dark figure walking along a snowy ridge, which was later investigated by the BFRO.",
        "source": "Wikimedia Commons / BFRO",
        "images": [
            "https://upload.wikimedia.org/wikipedia/commons/d/d7/Squatch2005small.jpg"
        ]
    },
    {
        "name": "Rick Jacobs Bigfoot Photos - Allegheny National Forest, Pennsylvania (2007)",
        "coordinates": {"lng": -78.7303, "lat": 41.4206},
        "date": 2007,
        "description": "A trail camera set up by hunter Rick Jacobs in the Allegheny National Forest captured photos of an unidentified creature. The subject is hunched over and has distinct primate-like features, which many researchers identify as a juvenile Bigfoot.",
        "source": "Wikimedia Commons / BFRO",
        "images": [
            "https://upload.wikimedia.org/wikipedia/commons/d/df/Jacobs_juvenile_Sasquatch.jpg"
        ]
    },
    {
        "name": "Bigfoot Trap - Siskiyou National Forest, Oregon (1974)",
        "coordinates": {"lng": -123.14566, "lat": 42.05394},
        "date": 1974,
        "description": "Built in 1974 by the North American Wildlife Research Team (NAWRT), this is the only physical Bigfoot trap in the world. It consists of a heavy wooden box with a metal trapdoor, located in the Rogue River-Siskiyou National Forest.",
        "source": "Wikipedia - Bigfoot trap",
        "images": [
            "https://upload.wikimedia.org/wikipedia/commons/d/de/Bigfoot_trap.jpg"
        ]
    },
    {
        "name": "Bigfoot Petroglyph - Painted Rock, Tulare County, California",
        "coordinates": {"lng": -118.7150, "lat": 36.0314},
        "date": None,
        "description": "A prehistoric Yokuts Native American rock art site featuring 'Mayak', a family of giant, hairy creatures described in local oral traditions as Bigfoot. This petroglyph is considered by researchers to be one of the oldest depictions of Sasquatch in North America.",
        "source": "Wikipedia - Painted Rock",
        "images": [
            "https://upload.wikimedia.org/wikipedia/commons/a/a2/Painted_Rock_Tulare_County.jpg"
        ]
    },
    {
        "name": "McConkie Ranch Bigfoot Petroglyph - Vernal, Utah",
        "coordinates": {"lng": -109.6305, "lat": 40.5287},
        "date": None,
        "description": "Ancient Fremont petroglyphs at McConkie Ranch depicting tall, clawed, humanoid figures resembling local Bigfoot/Giant legends.",
        "source": "Wikimedia Commons",
        "images": [
            "https://upload.wikimedia.org/wikipedia/commons/8/8e/Bigfoot_petroglyph_panel_McConkie_Ranch_Vernal_Utah.jpeg"
        ]
    },
    {
        "name": "Bigfoot Museum - Willow Creek, California",
        "coordinates": {"lng": -123.63139, "lat": 40.93944},
        "date": None,
        "description": "Located in Willow Creek, California—the 'Bigfoot Capital of the World'—this museum houses footprint plaster casts, historical newspaper clippings, and various other Bigfoot research artifacts.",
        "source": "Wikipedia - Willow Creek",
        "images": [
            "https://upload.wikimedia.org/wikipedia/commons/a/a5/Bigfoot_Museum_Willow_Creek.jpg"
        ]
    },
    {
        "name": "Minnesota Iceman Exhibition - Winona, Minnesota (1968)",
        "coordinates": {"lng": -91.6384, "lat": 44.0554},
        "date": 1968,
        "description": "A male hominid-like creature frozen in ice, exhibited at malls and carnivals in the late 1960s. Cryptozoologists Bernard Heuvelmans and Ivan T. Sanderson examined it and declared it a new species.",
        "source": "Wikipedia - Minnesota Iceman",
        "images": [
            "https://upload.wikimedia.org/wikipedia/commons/e/ec/Minnesota-Iceman-composite-in-ice-and-reconstruction-600-px-tiny-Dec-2016-Darren-Naish-Tetrapod-Zoology.jpg"
        ]
    },
    {
        "name": "Florida Skunk Ape - Myakka River State Park, Florida (2000)",
        "coordinates": {"lng": -82.3167, "lat": 27.2358},
        "date": 2000,
        "description": "Famous anonymous photographs sent to the Sarasota Sheriff's Department in 2000, showing a large, ape-like creature crouched behind palmetto leaves in a suburban backyard.",
        "source": "Wikipedia - Skunk ape",
        "images": [
            "https://upload.wikimedia.org/wikipedia/commons/a/ac/The_Florida_Skunk_Ape_-_panoramio.jpg"
        ]
    },
    {
        "name": "Ape Canyon Sighting - Mount St. Helens, Washington (1924)",
        "coordinates": {"lng": -122.1066, "lat": 46.2014},
        "date": 1924,
        "description": "A group of miners reported being attacked by multiple 'hairy ape-men' throwing rocks at their cabin in 1924, in a gorge now known as Ape Canyon.",
        "source": "Wikipedia - Ape Canyon",
        "images": [
            "https://upload.wikimedia.org/wikipedia/commons/1/15/ApeCanyon-highview-daylight.jpg"
        ]
    },
    {
        "name": "Mogollon Monster - Mogollon Rim, Arizona",
        "coordinates": {"lng": -110.9500, "lat": 34.3333},
        "date": None,
        "description": "Sightings of a Bigfoot-like creature along the Mogollon Rim in Arizona date back to the early 1900s. Witnesses describe a tall creature with red eyes and a strong, foul odor.",
        "source": "Wikipedia - Mogollon Monster",
        "images": [
            "https://upload.wikimedia.org/wikipedia/commons/7/72/Mogollon_Monster_Carving.jpg"
        ]
    },
    {
        "name": "Dewey Lake Monster - Dewey Lake, Michigan (1964)",
        "coordinates": {"lng": -86.1333, "lat": 42.0167},
        "date": 1964,
        "description": "A series of sightings of a 10-foot-tall hairy biped near Dewey Lake in Michigan during the summer of 1964, which led to local police investigations and search parties.",
        "source": "Wikipedia - Dewey Lake Monster",
        "images": [
            "https://upload.wikimedia.org/wikipedia/commons/b/bf/Dewey_Lake_Monster_%28Witness_Composite%29_3.jpg"
        ]
    }
]

def main():
    print("Loading database...")
    with open(JSON_PATH, "r") as f:
        data = json.load(f)

    # Find highest ID
    highest_idx = -1
    for item in data:
        if item.get("category") == "Bigfoot":
            item_id = item.get("id", "")
            match = re.search(r"anomaly-Bigfoot-(\d+)$", item_id)
            if match:
                idx = int(match.group(1))
                if idx > highest_idx:
                    highest_idx = idx

    next_idx = highest_idx + 1
    print(f"Current highest index: {highest_idx}. Starting index for new items: {next_idx}")

    added_count = 0
    for new_s in NEW_SIGHTINGS:
        name = new_s["name"]
        coords = new_s["coordinates"]

        # Deduplication check
        is_dup = False
        for item in data:
            if item.get("category") == "Bigfoot" and item.get("name", "").lower() == name.lower():
                is_dup = True
                break
            existing_coords = item.get("coordinates")
            if existing_coords and isinstance(existing_coords, dict):
                dist = ((existing_coords.get("lng", 0) - coords["lng"]) ** 2 + (existing_coords.get("lat", 0) - coords["lat"]) ** 2) ** 0.5
                if dist < 0.005:
                    is_dup = True
                    break
        if is_dup:
            print(f"Skipping duplicate: {name}")
            continue

        item_id = f"anomaly-Bigfoot-{next_idx}"
        new_item = {
            "id": item_id,
            "name": name,
            "category": "Bigfoot",
            "type": "Point",
            "coordinates": coords,
            "date": new_s["date"],
            "description": new_s["description"],
            "source": new_s["source"],
            "images": new_s["images"]
        }

        data.append(new_item)
        print(f"Added: {name} (ID: {item_id})")
        next_idx += 1
        added_count += 1

    if added_count > 0:
        print(f"Saving database with {added_count} new entries...")
        with open(JSON_PATH, "w") as f:
            json.dump(data, f, indent=2)
        print("Database updated successfully!")
    else:
        print("No new entries were added.")

if __name__ == "__main__":
    main()
