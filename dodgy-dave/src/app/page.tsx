'use client';

import { useCallback, useState } from 'react';
import openai from 'openai';
import { Form } from '@/components/Form';
import { Waiting } from '@/components/Waiting';
import { Result } from '@/components/Result';
import { dates } from '@/components/utils/date';
import { fetchReport } from '@/actions/openAi';
import { fetchPolygonData } from '@/actions/polygon';

const useServerAction = true;

const DEFAULT_MESSAGE = 'Querying Stocks API...';
const ERROR_MESSAGE = 'There was an error fetching stock data.';
const CLOUDFLARE_WORKER_URL_OPENAI =
  'https://openai-api-worker.panamepoul.workers.dev';
const CLOUDFLARE_WORKER_URL_POLYGON =
  'https://polygon-api-worker.panamepoul.workers.dev';

const systemPrompt: openai.ChatCompletionMessageParam = {
  role: 'system',
  content: `You are a trading guru. Given data on share prices over the past 3 days, write a report of no more than 150 words describing the stocks performance and recommending whether to buy, hold or sell., 
     use the examples between ### to help you`,
};

const examplesTexts = `
    ###
    OK baby, hold on tight! You are going to haate this! Over the past three days, Tesla (TSLA) shares have plummetted. The stock opened at $223.98 and closed at $202.11 on the third day, with some jumping around in the meantime. This is a great time to buy, baby! But not a great time to sell! But I'm not done! Apple (AAPL) stocks have gone stratospheric! This is a seriously hot stock right now. They opened at $166.38 and closed at $182.89 on day three. So all in all, I would hold on to Tesla shares tight if you already have them - they might bounce right back up and head to the stars! They are volatile stock, so expect the unexpected. For APPL stock, how much do you need the money? Sell now and take the profits or hang on and wait for more! If it were me, I would hang on because this stock is on fire right now!!! Apple are throwing a Wall Street party and y'all invited!
    ###
    ###
    Apple (AAPL) is the supernova in the stock sky – it shot up from $150.22 to a jaw-dropping $175.36 by the close of day three. We’re talking about a stock that’s hotter than a pepper sprout in a chilli cook-off, and it’s showing no signs of cooling down! If you’re sitting on AAPL stock, you might as well be sitting on the throne of Midas. Hold on to it, ride that rocket, and watch the fireworks, because this baby is just getting warmed up! Then there’s Meta (META), the heartthrob with a penchant for drama. It winked at us with an opening of $142.50, but by the end of the thrill ride, it was at $135.90, leaving us a little lovesick. It’s the wild horse of the stock corral, bucking and kicking, ready for a comeback. META is not for the weak-kneed So, sugar, what’s it going to be? For AAPL, my advice is to stay on that gravy train. As for META, keep your spurs on and be ready for the rally.
    ###
    `;

const fetchReportByMode = async (
  stockData: string[],
  useServerAction: boolean
) => {
  if (useServerAction) {
    return fetchReport(stockData.join(', '));
  }
  const report = await fetch(CLOUDFLARE_WORKER_URL_OPENAI, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify([
      systemPrompt,
      { role: 'user', content: `${stockData} ${examplesTexts}` },
    ]),
  }).then((res) => res.json());

  if (report.error) {
    throw new Error(report.error);
  }
  return report.content;
};
// https://polygon-api-worker.panamepoul.workers.dev/?ticker=TSLA&startDate=2025-02-03&endDate=2025-02-05
const fetchPolygonDataByMode = async (
  ticker: string,
  dates: { startDate: string; endDate: string },
  useServerAction: boolean
) => {
  if (useServerAction) {
    return fetchPolygonData(ticker, dates);
  }
  const data = await fetch(
    `${CLOUDFLARE_WORKER_URL_POLYGON}?ticker=${ticker}&startDate=${dates.startDate}&endDate=${dates.endDate}`,
    {
      method: 'GET',
    }
  ).then((res) => res.json());
  if (data.error) {
    throw new Error(data.error);
  }
  return data;
};

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [tickers, setTickers] = useState<string[]>([]);
  const [loadingMessage, setLoadingMessage] = useState<string>(DEFAULT_MESSAGE);
  const [result, setResult] = useState<string>('');

  const handleGenerateReport = useCallback(async () => {
    setLoading(true);
    try {
      const stockData = await Promise.all(
        tickers.map(async (ticker) => {
          const data = await fetchPolygonDataByMode(
            ticker,
            dates,
            useServerAction
          );
          if (data) {
            return data;
          } else {
            throw new Error('No data found');
          }
        })
      );

      setLoadingMessage('Creating report...');
      if (stockData.length === 0) {
        throw new Error('No data found');
      }
      const report = await fetchReportByMode(stockData, useServerAction);
      setLoading(false);
      setResult(report);
    } catch (err) {
      setLoading(false);
      setLoadingMessage(ERROR_MESSAGE);
      console.error('error: ', err);
    }
  }, [tickers]);

  if (result) {
    return <Result result={result} />;
  }
  if (loading) {
    return <Waiting loadingMessage={loadingMessage} />;
  }

  return (
    <Form
      handleGenerateReport={handleGenerateReport}
      tickers={tickers}
      setTickers={setTickers}
    />
  );
}
