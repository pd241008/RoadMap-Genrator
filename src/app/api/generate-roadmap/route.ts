import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * Access the API key from the environment variables.
 * In a Next.js API route, environment variables are accessed directly.
 */
const API_KEY = process.env.GEMINI_API_KEY;

// Check if the API key is defined to prevent errors
if (!API_KEY) {
  throw new Error(
    "Missing Gemini API key. Please set the GEMINI_API_KEY environment variable."
  );
}

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(API_KEY);

/**
 * Handles the POST request to generate a roadmap.
 * It takes a topic from the request body, sends it to the Gemini API,
 * and returns the generated roadmap as a JSON response.
 */
export async function POST(req: NextRequest) {
  try {
    // Get the request body and parse the JSON
    const { topic } = await req.json();

    // Ensure a topic was provided
    if (!topic) {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 });
    }

    // Get the generative model
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

    // Create a comprehensive prompt for the model
    const prompt = `
      You are an expert career and learning roadmap generator.
      Your task is to create a detailed, step-by-step roadmap for a topic.
      The roadmap should be structured as a JSON object with a single key 'roadmap' containing a string.
      The content of the 'roadmap' string should be a well-formatted, detailed, and clear learning path.
      make usre the json foramat is correct and according to the given constraints
      
      Topic: ${topic}
      
      Example JSON format:
      {[
  {
    "title": "Step 1: Foundation",
    "content": ["Sub-step 1.1"]
               ["Sub-step 1.2"]
  },
  {
    "title": "Intermediate Concepts",
    "content": ["Sub-step 2.1"]
               ["Sub-step 2.2"]
  }
]
      
      Please generate ONLY the JSON response for the topic: "${topic}"
    `;

    // Make the API call to generate content
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    // Find the first occurrence of '{' and the last occurrence of '}' to extract the JSON object
    const jsonStart = text.indexOf("{");
    const jsonEnd = text.lastIndexOf("}") + 1;

    // Check if a valid JSON object was found
    if (jsonStart === -1 || jsonEnd === -1) {
      throw new Error(
        "Could not find a valid JSON object in the model response."
      );
    }

    // Extract the JSON string
    const jsonString = text.substring(jsonStart, jsonEnd);

    // Parse the extracted JSON string
    const parsedResult = JSON.parse(jsonString);

    // Return the generated roadmap in a valid JSON response
    return NextResponse.json({ result: parsedResult.roadmap });
  } catch (error) {
    console.error("API Error:", error);
    // Return a 500 status code with a proper JSON error message
    return NextResponse.json(
      { error: "Failed to generate roadmap" },
      { status: 500 }
    );
  }
}


