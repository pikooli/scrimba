export async function getCurrentWeather({ location }: { location: string }) {
  console.log('location =========', location);
  const weather = {
    temperature: '72',
    unit: 'F',
    forecast: location === 'New York City' ? 'sunny' : 'cloudy',
  };
  return JSON.stringify(weather);
}

export async function getLocation() {
  return 'New York City, NY';
}

export const tools: any[] = [
  {
    type: 'function',
    function: {
      function: getCurrentWeather,
      parse: JSON.parse,
      parameters: {
        type: 'object',
        properties: {
          location: {
            type: 'string',
            description: 'The location from where to get the weather',
          },
        },
        required: ['location'],
      },
    },
  },
  {
    type: 'function',
    function: {
      function: getLocation,
      parse: JSON.parse,
      parameters: {
        type: 'object',
        properties: {},
        required: [],
      },
    },
  },
];
