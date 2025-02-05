'use client';
import Image from 'next/image';
import { useCallback, useState } from 'react';

const DEFAULT_MESSAGE =
  'Add up to 3 stock tickers below to get a super accurate stock predictions report👇';
const ERROR_MESSAGE =
  'You must add at least one ticker. A ticker is a 3 letter or more code for a stock. E.g TSLA for Tesla.';
const TICKER_ERROR_MESSAGE = 'Ticker must be at least 3 characters';
const TICKET_PLACE = 'Your tickers will appear here...';

export const Form = ({
  handleGenerateReport,
  tickers,
  setTickers,
}: {
  handleGenerateReport: () => void;
  tickers: string[];
  setTickers: React.Dispatch<React.SetStateAction<string[]>>;
}) => {
  const [error, setError] = useState<string>('');

  const handleAddTickets = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData(e.target as HTMLFormElement);
      const ticker = formData.get('ticker') as string;
      if (ticker.length < 3) {
        setError(TICKER_ERROR_MESSAGE);
        return;
      }
      setTickers((prev) => [...prev, ticker.toUpperCase()]);
      (e.target as HTMLFormElement).reset();
    },
    [setTickers]
  );

  return (
    <section className="mx-[2em] my-[1.5em] flex h-[350px] flex-col items-center justify-around">
      <form
        onSubmit={handleAddTickets}
        className="flex w-[360px] flex-col items-center"
      >
        <label
          htmlFor="ticker-input"
          className={`mb-[1em] block w-[80%] p-[.43em] text-center ${
            error ? 'text-red-500' : ''
          }`}
        >
          {error ? ERROR_MESSAGE : DEFAULT_MESSAGE}
        </label>
        <div className="flex flex-row items-center justify-center">
          <input
            type="text"
            name="ticker"
            placeholder="MSFT, TSLA, AAPL"
            className="border-2 border-r-0 border-black p-[1em]"
            onChange={(e) => console.log(e.target.value)}
          />
          <button type="submit" className="border-2 border-black p-[21px]">
            <Image src="/svgs/add.svg" width={14} height={14} alt="add" />
          </button>
        </div>
      </form>
      <p className="align-center flex h-[3em]">
        {tickers.length > 0
          ? tickers.map((ticker, idx) => (
              <span key={ticker}>
                {idx > 0 && ', '}
                {ticker}
              </span>
            ))
          : TICKET_PLACE}
      </p>
      <button
        className="border-2 border-black bg-[#46ff90] px-[1.5em] py-[1em] text-[105%] font-[500] uppercase tracking-[.09em] disabled:text-gray-500 sm:w-[300px]"
        type="button"
        disabled={!tickers.length}
        onClick={handleGenerateReport}
      >
        Generate Report
      </button>
      <p className="font-['Comic_Neue'] text-[14px] font-bold">
        Always correct 15% of the time!
      </p>
    </section>
  );
};
