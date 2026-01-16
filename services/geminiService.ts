
import { GoogleGenAI, Type } from "@google/genai";
import { ScholarshipAnalysis, StudentInfo } from "../types";

const SYSTEM_INSTRUCTION = `
You are the "Scholarship Navigator Pro," an expert consultant for Indian and International scholarships.

GOAL: Provide a definitive "Verdict" on scholarship eligibility and a "Technical Acceptance Probability" (especially for UP Scholarship and NSP).

TECHNICAL LOGIC FOR REJECTION PREDICTION:
Many students are rejected AFTER uploading documents. You must analyze the student's profile for these specific technical risks:
1. NPCI/DBT Risk: If the student doesn't mention their bank is linked to Aadhaar, mark it as a risk.
2. Data Mismatch: Potential mismatch between Marksheet name and Aadhaar name.
3. Certificate Validation: Income certificates not being updated or close to the ceiling (e.g., 2.5 LPA).
4. Attendance/Institute Verification: Risk of the institute not forwarding the application.

RESPONSE STRUCTURE:
1. Eligibility Verdict: Start with a clear "Yes, you are eligible for X" or "No, due to Y".
2. Acceptance Probability: A percentage based on technical hurdles (NPCI, PFMS, Database matching).
3. Rejection Prevention: Specific technical steps to take to avoid rejection after submission.
4. Scholarship Links: Official URLs for application.
`;

export const analyzeScholarship = async (studentInfo: StudentInfo): Promise<ScholarshipAnalysis> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const prompt = `
    Student Profile Analysis:
    - Name: ${studentInfo.name}
    - State: ${studentInfo.state}
    - Income: ${studentInfo.annualIncome}
    - Marks: ${studentInfo.percentage}%
    - Category: ${studentInfo.category}
    - Course: ${studentInfo.currentCourse}
    - Context: ${studentInfo.situationPrompt}

    TASK:
    1. Determine if they are ELIGIBLE.
    2. Predict the % chance of their application being APPROVED by the government (Probability of success).
    3. Identify why they might get REJECTED even after document upload (Hidden technical risks).
    4. Provide official LINKS for the best matches.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          eligibilityStatus: { type: Type.STRING },
          acceptanceProbability: { type: Type.INTEGER },
          riskFactors: { type: Type.ARRAY, items: { type: Type.STRING } },
          matchedScholarships: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                provider: { type: Type.STRING },
                url: { type: Type.STRING },
                amount: { type: Type.STRING }
              },
              required: ['name', 'provider', 'url']
            }
          },
          detailedReasoning: { type: Type.STRING },
          actionPlan: {
            type: Type.OBJECT,
            properties: {
              shouldApply: { type: Type.BOOLEAN },
              reason: { type: Type.STRING },
              essentialDocuments: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ['shouldApply', 'reason', 'essentialDocuments']
          },
          missingInformation: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ['eligibilityStatus', 'acceptanceProbability', 'riskFactors', 'matchedScholarships', 'detailedReasoning', 'actionPlan']
      }
    }
  });

  try {
    const text = response.text;
    if (!text) throw new Error("No response from AI");
    return JSON.parse(text.trim()) as ScholarshipAnalysis;
  } catch (error) {
    console.error("Failed to parse Gemini response:", error);
    throw new Error("Failed to analyze scholarship data. Please try again.");
  }
};
