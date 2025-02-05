'use client';
export const Result = ({ result }: { result: string }) => {
  return (
    <section className="relative mx-[2em] my-[2em] flex flex-col items-center justify-center px-[2em] py-[1em]">
      <h2 className="absolute top-0 z-50 -mt-[26px] bg-[#f6f6f6] px-[10px] text-center text-[18px]">
        Your Report 😜
      </h2>
      <div className="-mt-[26px] h-[350px] overflow-y-scroll border-2 border-black bg-[#f6f6f6] px-[10px] text-center text-[18px] font-bold">
        <p className="w-[400px] whitespace-pre-line p-[3em] text-[16px]">
          {result}
        </p>
      </div>
    </section>
  );
};
