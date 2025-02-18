'use client';
import { useEffect, useState, useRef, useCallback } from 'react';
import {
  pipeline,
  ObjectDetectionPipelineOutput,ObjectDetectionPipeline
} from '@huggingface/transformers';
import Image from 'next/image';



export function TransformerJS() {
  const imageRef = useRef<HTMLImageElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const detectorRef = useRef<ObjectDetectionPipeline | null>(null);
  const [result, setResult] = useState<
    ObjectDetectionPipelineOutput | ObjectDetectionPipelineOutput[]
  >([
    {
      score: 0.9834084510803223,
      label: 'traffic light',
      box: {
        xmin: 213,
        ymin: 134,
        xmax: 227,
        ymax: 151,
      },
    },
    {
      score: 0.9135163426399231,
      label: 'traffic light',
      box: {
        xmin: 153,
        ymin: 140,
        xmax: 165,
        ymax: 154,
      },
    },
    {
      score: 0.9684017896652222,
      label: 'car',
      box: {
        xmin: 243,
        ymin: 222,
        xmax: 273,
        ymax: 238,
      },
    },
    {
      score: 0.9939953088760376,
      label: 'bus',
      box: {
        xmin: 89,
        ymin: 205,
        xmax: 211,
        ymax: 298,
      },
    },
    {
      score: 0.9781891703605652,
      label: 'traffic light',
      box: {
        xmin: 267,
        ymin: 161,
        xmax: 279,
        ymax: 175,
      },
    },
    {
      score: 0.9544496536254883,
      label: 'traffic light',
      box: {
        xmin: 268,
        ymin: 159,
        xmax: 280,
        ymax: 175,
      },
    },
    {
      score: 0.9369595050811768,
      label: 'traffic light',
      box: {
        xmin: 307,
        ymin: 164,
        xmax: 319,
        ymax: 177,
      },
    },
    {
      score: 0.9075704216957092,
      label: 'car',
      box: {
        xmin: 225,
        ymin: 223,
        xmax: 246,
        ymax: 232,
      },
    },
    {
      score: 0.9811447858810425,
      label: 'traffic light',
      box: {
        xmin: 153,
        ymin: 136,
        xmax: 165,
        ymax: 149,
      },
    },
    {
      score: 0.9941792488098145,
      label: 'traffic light',
      box: {
        xmin: 341,
        ymin: 162,
        xmax: 353,
        ymax: 178,
      },
    },
  ]);
  
  useEffect(() => {
    const detect = async () => {
      const detector = await pipeline('object-detection', 'Xenova/yolos-tiny');
      detectorRef.current = detector;
    };
    detect();
  }, []);

  useEffect(() => {
    if (imageContainerRef.current) {
      result.forEach((item) => {
        const div = document.createElement('div');
        div.innerHTML = `${item.label} ${item.score}`;
        Object.assign(div.style, {
          zIndex: 1000,
          position: 'absolute',
          left: item.box.xmin + '%',
          top: item.box.ymin + '%',
          width: item.box.xmax - item.box.xmin + '%',
          height: item.box.ymax - item.box.ymin + '%',
          border: '1px solid red',
        });
        if (imageContainerRef.current) {
          imageContainerRef.current.appendChild(div);
        }
      });
    }
  }, [result]);

  const handleDetect = useCallback(async () => {
    if (detectorRef.current && imageRef.current) {
      console.log('=============');
      try {
        const result = await detectorRef.current(imageRef.current.src);
        console.log('result', result);
        setResult(result);
      } catch (error) {
        console.error('Error detecting objects:', error);
      }
    }
  }, []);

  return (
    <div>
      <div ref={imageContainerRef} className="relative">
        <Image
          src="/road.jpeg"
          alt="Original Image"
          width={150}
          height={150}
          ref={imageRef}
        />
      </div>
      <button
        className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        onClick={handleDetect}
      >
        Detect
      </button>
    </div>
  );
}
