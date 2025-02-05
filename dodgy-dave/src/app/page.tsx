'use client';

import { useCallback, useState } from 'react';
import { Form } from '@/components/Form';
import { Waiting } from '@/components/Waiting';
import { Result } from '@/components/Result';
import { dates } from '@/components/utils/date';
import { fetchReport } from '@/actions/openAi';

const DEFAULT_MESSAGE = 'Querying Stocks API...';
const ERROR_MESSAGE = 'There was an error fetching stock data.';

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
          const url = `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/${dates.startDate}/${dates.endDate}?apiKey=${process.env.NEXT_PUBLIC_POLYGON_API_KEY}`;
          const response = await fetch(url);
          const data = await response.text();
          const status = await response.status;
          if (status === 200) {
            setLoadingMessage('Creating report...');
            return data;
          } else {
            setLoadingMessage(ERROR_MESSAGE);
          }
        })
      );
      const report = await fetchReport(stockData.join(', '));
      setLoading(false);
      setResult(report);
    } catch (err) {
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
