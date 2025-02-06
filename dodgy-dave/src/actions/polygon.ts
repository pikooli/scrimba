'use server';

export const fetchPolygonData = async (
  ticker: string,
  dates: { startDate: string; endDate: string }
) => {
  'use server';
  try {
    const url = `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/${dates.startDate}/${dates.endDate}?apiKey=${process.env.POLYGON_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (err) {
    console.error('error: ', err);
    return null;
  }
};
