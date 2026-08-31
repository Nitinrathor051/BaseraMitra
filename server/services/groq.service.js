
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});


// ======================================================
// SAFE JSON PARSER
// ======================================================

const parseAIResponse = (content) => {

  try {

    const parsed = JSON.parse(content);

    return {

      message:
        typeof parsed.message === "string"
          ? parsed.message.trim()
          : "How can I help you find a property?",

      actions:
        Array.isArray(parsed.actions)
          ? parsed.actions
          : [],

    };

  } catch (error) {

    console.error(
      "JSON Parse Error:",
      error.message
    );

    return {

      message:
        content?.trim() ||
        "How can I help you find a property.",

      actions: [],

    };

  }

};


// ======================================================
// GENERATE AI RESPONSE
// ======================================================

export const generateAIResponse = async (
  userMessage,
  systemPrompt
) => {

  try {

    const completion =
      await groq.chat.completions.create({

        // Current Groq model
        model: "openai/gpt-oss-20b",

        messages: [

          {
            role: "system",
            content: systemPrompt,
          },

          {
            role: "user",
            content: userMessage,
          },

        ],

        // GPT-OSS reasoning control
        reasoning_effort: "low",

        // Do not include reasoning in response
        include_reasoning: false,

        // Low randomness for predictable chatbot behavior
        temperature: 0.2,

        top_p: 0.9,

        // Enough completion space
        max_completion_tokens: 512,

        // Strict structured JSON
        response_format: {

          type: "json_schema",

          json_schema: {

            name: "basera_mitra_response",

            strict: true,

            schema: {

              type: "object",

              properties: {

                message: {
                  type: "string",
                },

                actions: {

                  type: "array",

                  items: {

                    anyOf: [

                      // ==================================
                      // NAVIGATE ACTION
                      // ==================================

                      {
                        type: "object",

                        properties: {

                          type: {
                            type: "string",

                            enum: [
                              "NAVIGATE"
                            ],
                          },

                          path: {
                            type: "string",
                          },

                          label: {
                            type: "string",
                          },

                        },

                        required: [
                          "type",
                          "path",
                          "label",
                        ],

                        additionalProperties: false,

                      },


                      // ==================================
                      // PROPERTY ACTIONS
                      // ==================================

                      {
                        type: "object",

                        properties: {

                          type: {
                            type: "string",

                            enum: [
                              "PROPERTY_DETAIL",
                              "SEND_ENQUIRY",
                              "ADD_FAVORITE",
                              "REMOVE_FAVORITE",
                            ],
                          },

                          propertyId: {
                            type: "string",
                          },

                          label: {
                            type: "string",
                          },

                        },

                        required: [
                          "type",
                          "propertyId",
                          "label",
                        ],

                        additionalProperties: false,

                      },

                    ],

                  },

                },

              },

              required: [
                "message",
                "actions",
              ],

              additionalProperties: false,

            },

          },

        },

      });


    const content =
      completion
        ?.choices?.[0]
        ?.message
        ?.content || "";


    if (!content) {

      console.error(
        "Groq returned empty content."
      );

      return {

        message:
          "Sorry, I could not process your request.",

        actions: [],

      };

    }


    const parsed =
      parseAIResponse(content);


    return {

      message:
        parsed.message,

      actions:
        parsed.actions.filter(
          (action) =>
            action &&
            typeof action === "object" &&
            typeof action.type === "string"
        ),

    };

  }

  catch (error) {

    console.error(
      "Groq Service Error:",
      error.message
    );

    return {

      message:
        "Sorry, I'm having a technical issue right now.",

      actions: [],

    };

  }

};

