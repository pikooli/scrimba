import { ChatCompletionTool } from 'openai/resources/chat/completions';
export async function getCurrentWeather({
  location,
  unit = 'fahrenheit',
}: {
  location: string;
  unit: string;
}) {
  console.log('location =========', location);
  console.log('unit =========', unit);
  const weather = {
    temperature: unit === 'fahrenheit' ? '72' : '22',
    unit: unit === 'fahrenheit' ? 'F' : 'C',
    forecast: location === 'New York City' ? 'sunny' : 'cloudy',
  };
  return JSON.stringify(weather);
}

export async function getLocation() {
  return 'New York City, NY';
}

export const tools: ChatCompletionTool[] = [
  {
    type: 'function',
    function: {
      name: 'getCurrentWeather',
      description: 'Get the current weather in a location',
      parameters: {
        type: 'object',
        properties: {
          location: {
            type: 'string',
            description: 'The location from where to get the weather',
          },
          unit: {
            type: 'string',
            enum: ['celcius', 'fahrenheit'],
          },
        },
        required: ['location'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'getLocation',
    },
  },
];
