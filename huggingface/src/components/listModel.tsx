'use client';
import { useEffect, useState, useCallback } from 'react';
import { listModels } from '@huggingface/hub';

const token = process.env.NEXT_PUBLIC_HF_API_KEY || '';

async function isModelInferenceEnabled(modelName) {
  const response = await fetch(
    `https://api-inference.huggingface.co/status/${modelName}`
  );
  const data = await response.json();
  return data.state == 'Loadable';
}

export function ListModel() {
  const [result, setResult] = useState<any[]>([]);

  const printModels = useCallback(async () => {
    const models = [];
    for await (const model of listModels({
      credentials: {
        accessToken: token,
      },
      search: {
        task: 'text-to-image',
      },
      limit: 100,
    })) {
      if (model.likes > 2000) {
        console.log(model);
        if (await isModelInferenceEnabled(model.id)) {
          models.push(model);
        }
      }
    }
    console.log(models);
    setResult(models);
  }, []);

  useEffect(() => {
    console.log('printModels');
    printModels();
  }, [printModels]);

  return (
    <div>
      {result && (
        <div>
          {result.map((model) => (
            <p key={model.id}>{model.id}</p>
          ))}
        </div>
      )}
    </div>
  );
}
