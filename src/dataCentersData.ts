export interface DataCenterCase {
  id: string;
  name: string;
  category: 'Data Centers';
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

export const DATA_CENTERS_DATA: DataCenterCase[] = [
  {
    id: 'dc-loudoun-county-va',
    name: 'Loudoun County Data Center Alley - Ashburn, Virginia, USA',
    category: 'Data Centers',
    type: 'Point',
    coordinates: { lng: -77.4875, lat: 39.0437 },
    date: 2024,
    displayDate: 'Modern Operational Hub',
    description: 'Known as the Data Center Capital of the World, Loudoun County processes an estimated 70% of global internet traffic. Hosting over 25 million square feet of hyperscale data centers operated by AWS, Equinix, Digital Realty, and Google, it forms the nervous system of modern cloud computing and AI infrastructure.',
    source: 'Loudoun County Department of Economic Development',
    images: ['https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Eqiadwmf_9069.jpg/500px-Eqiadwmf_9069.jpg']
  },
  {
    id: 'dc-quincy-washington',
    name: 'Quincy Hyperscale Cluster - Quincy, Washington, USA',
    category: 'Data Centers',
    type: 'Point',
    coordinates: { lng: -119.8525, lat: 47.2343 },
    date: 2024,
    displayDate: 'Modern Operational Hub',
    description: 'Powered by cheap, renewable hydroelectric power from the Grand Coulee Dam on the Columbia River, Quincy hosts massive hyperscale AI campuses for Microsoft, Yahoo, Sabey, and Vantage Data Centers.',
    source: 'Grant County Public Utility District',
    images: ['https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Grand_Coulee_Dam.jpg/500px-Grand_Coulee_Dam.jpg']
  },
  {
    id: 'dc-prineville-oregon',
    name: 'Meta Prineville Data Center - Prineville, Oregon, USA',
    category: 'Data Centers',
    type: 'Point',
    coordinates: { lng: -120.8465, lat: 44.2997 },
    date: 2011,
    displayDate: '2011 - Present',
    description: 'Meta\'s flagship custom-designed energy-efficient data center campus in Central Oregon spanning over 4.5 million square feet. Driven by climate-adapted evaporative cooling and regional hydroelectricity.',
    source: 'Meta Infrastructure Engineering',
    images: ['https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Outside_Facebook_Data_Center.jpg/500px-Outside_Facebook_Data_Center.jpg']
  },
  {
    id: 'dc-council-bluffs-iowa',
    name: 'Google Council Bluffs Campus - Council Bluffs, Iowa, USA',
    category: 'Data Centers',
    type: 'Point',
    coordinates: { lng: -95.8608, lat: 41.2619 },
    date: 2007,
    displayDate: '2007 - Present',
    description: 'Google\'s massive Midwestern AI computing center supporting search, cloud services, and machine learning model training powered by regional wind energy farms.',
    source: 'Google Data Center Infrastructure',
    images: ['https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Google_Data_Center%2C_Council_Bluffs_Iowa_%2849062863796%29.jpg/500px-Google_Data_Center%2C_Council_Bluffs_Iowa_%2849062863796%29.jpg']
  },
  {
    id: 'dc-dublin-ireland',
    name: 'Grange Castle & West Dublin Cluster - Dublin, Ireland',
    category: 'Data Centers',
    type: 'Point',
    coordinates: { lng: -6.4411, lat: 53.3158 },
    date: 2024,
    displayDate: 'European Hyperscale Hub',
    description: 'Ireland hosts over 80 operational data centers operated by AWS, Microsoft, and Google, consuming approximately 18% of Ireland\'s total grid electricity due to favorable tax structures and undersea transatlantic cable links.',
    source: 'Host in Ireland & EirGrid Reports',
    images: ['https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Dublin_skyline_-_geograph.org.uk_-_1470764.jpg/500px-Dublin_skyline_-_geograph.org.uk_-_1470764.jpg']
  },
  {
    id: 'dc-frankfurt-germany',
    name: 'Frankfurt DE-CIX Hub - Frankfurt, Germany',
    category: 'Data Centers',
    type: 'Point',
    coordinates: { lng: 8.6821, lat: 50.1109 },
    date: 2024,
    displayDate: 'FLAP Continental Hub',
    description: 'Home to DE-CIX, the largest internet exchange point in the world by data throughput, Frankfurt serves as Continental Europe\'s central data node with over 60 colocation facilities.',
    source: 'DE-CIX Management AG',
    images: ['https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Skyline_Frankfurt_am_Main.jpg/500px-Skyline_Frankfurt_am_Main.jpg']
  },
  {
    id: 'dc-singapore-jurong',
    name: 'Jurong Data Center Park - Jurong West, Singapore',
    category: 'Data Centers',
    type: 'Point',
    coordinates: { lng: 103.7064, lat: 1.3329 },
    date: 2024,
    displayDate: 'Southeast Asia Gateway',
    description: 'Singapore is the primary data center and subsea network interconnect hub for Southeast Asia, hosting tropical high-efficiency hyperscale nodes for Equinix, Google, and Singtel.',
    source: 'Infocomm Media Development Authority (IMDA)',
    images: ['https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Flower_Dome_and_Cloud_Forest_Singapore_%2836712606096%29.jpg/500px-Flower_Dome_and_Cloud_Forest_Singapore_%2836712606096%29.jpg']
  }
];
