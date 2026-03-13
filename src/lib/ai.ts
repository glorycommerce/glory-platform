import { env } from "@/lib/env";

export function ensureGeminiKey() {
  if (!env.GEMINI_API_KEY) {
    throw new Error("Gemini API key is not configured.");
  }
  return env.GEMINI_API_KEY;
}

type GeminiInlineData = {
  mimeType: string;
  data: string;
};

type TryOnInput = {
  personImage: GeminiInlineData;
  garmentImage: GeminiInlineData;
  productName: string;
  productDescription?: string | null;
  variantLabel: string;
};

const GEMINI_IMAGE_MODEL = "gemini-2.5-flash-image";

export async function generateTryOnImage(input: TryOnInput) {
  const apiKey = ensureGeminiKey();
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_IMAGE_MODEL}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [
              {
                text: [
                  "Create a realistic fashion try-on preview.",
                  "Preserve the person's face, pose, body proportions, and background as much as possible.",
                  `Apply the selected garment faithfully: ${input.productName}.`,
                  `Variant details: ${input.variantLabel}.`,
                  input.productDescription
                    ? `Product description: ${input.productDescription}.`
                    : null,
                  "Do not add extra accessories or alter the scene unnecessarily.",
                  "Output a polished e-commerce try-on image.",
                ]
                  .filter(Boolean)
                  .join(" "),
              },
              {
                inlineData: input.personImage,
              },
              {
                inlineData: input.garmentImage,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.4,
          responseModalities: ["TEXT", "IMAGE"],
        },
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini try-on failed: ${errorText || response.statusText}`);
  }

  const payload = (await response.json()) as {
    candidates?: Array<{
      content?: {
        parts?: Array<{
          text?: string;
          inlineData?: GeminiInlineData;
        }>;
      };
    }>;
  };

  const parts = payload.candidates?.[0]?.content?.parts ?? [];
  const imagePart = parts.find((part) => part.inlineData?.data);
  const textPart = parts.find((part) => part.text);

  if (!imagePart?.inlineData) {
    throw new Error(textPart?.text || "Gemini did not return an image output.");
  }

  return {
    image: imagePart.inlineData,
    message: textPart?.text ?? "Try-on image generated successfully.",
  };
}
