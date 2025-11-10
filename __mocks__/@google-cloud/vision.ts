class MockImageAnnotatorClient {
  async faceDetection(_image: Buffer) {
    return [
      {
        faceAnnotations: [
          {
            boundingPoly: {
              vertices: [
                { x: 0, y: 0 },
                { x: 50, y: 0 },
                { x: 50, y: 50 },
                { x: 0, y: 50 },
              ],
            },
            detectionConfidence: 0.95,
            joyLikelihood: 'VERY_LIKELY',
            sorrowLikelihood: 'VERY_UNLIKELY',
            angerLikelihood: 'VERY_UNLIKELY',
            surpriseLikelihood: 'UNLIKELY',
            landmarks: [],
          },
        ],
      },
    ];
  }

  async objectLocalization(_image: Buffer) {
    return [
      {
        localizedObjectAnnotations: [
          {
            name: 'object',
            score: 0.8,
            boundingPoly: {
              vertices: [
                { x: 10, y: 10 },
                { x: 40, y: 10 },
                { x: 40, y: 40 },
                { x: 10, y: 40 },
              ],
            },
          },
        ],
      },
    ];
  }

  async documentTextDetection(_image: Buffer) {
    return [
      {
        fullTextAnnotation: {
          text: 'Detected text',
          pages: [
            {
              blocks: [
                {
                  confidence: 0.9,
                  boundingBox: {},
                  paragraphs: [
                    {
                      words: [
                        {
                          symbols: [
                            { text: 'D', confidence: 0.9 },
                            { text: 'e', confidence: 0.9 },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        textAnnotations: [{ locale: 'en' }],
      },
    ];
  }

  async annotateImage(_request: any) {
    return [
      {
        labelAnnotations: [
          { description: 'label1', score: 0.8 },
          { description: 'label2', score: 0.6 },
        ],
        safeSearchAnnotation: {
          adult: 'VERY_UNLIKELY',
          violence: 'UNLIKELY',
          medical: 'UNKNOWN',
        },
        imagePropertiesAnnotation: {
          dominantColors: {
            colors: [
              {
                color: { red: 10, green: 20, blue: 30 },
                score: 0.5,
                pixelFraction: 0.5,
              },
            ],
          },
        },
        cropHintsAnnotation: {
          cropHints: [
            {
              boundingPoly: {},
              confidence: 0.7,
              importanceFraction: 0.5,
            },
          ],
        },
      },
    ];
  }
}

const vision = {
  ImageAnnotatorClient: MockImageAnnotatorClient,
};

export type ImageAnnotatorClient = MockImageAnnotatorClient;

export default vision;
