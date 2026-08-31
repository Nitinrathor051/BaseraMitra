import {
  generateAIResponse
} from "../services/groq.service.js";

import {
  getGuestContext,
  getCustomerContext,
  getOwnerContext
} from "../services/chatbotContext.service.js";

import {
  guestPrompt,
  customerPrompt,
  ownerPrompt
} from "../prompts/chatbotPrompt.js";


// ======================================================
// CHAT WITH BASERAMITRA AI
// ======================================================

export const chatWithAI = async (req, res) => {

  try {

    const {
      message
    } = req.body;


    if (
      !message ||
      !message.trim()
    ) {

      return res.status(400).json({

        success: false,

        message:
          "Message is required",

      });

    }


    const userMessage =
      message.trim();


    let prompt;

    let context;


    // ==================================================
    // GUEST
    // ==================================================

    if (!req.user) {

      prompt =
        guestPrompt;

      context =
        await getGuestContext();

    }


    // ==================================================
    // CUSTOMER
    // ==================================================

    else if (
      req.user.role === "customer"
    ) {

      prompt =
        customerPrompt;

      context =
        await getCustomerContext(
          req.user._id
        );

    }


    // ==================================================
    // OWNER
    // ==================================================

    else if (
      req.user.role === "owner"
    ) {

      prompt =
        ownerPrompt;

      context =
        await getOwnerContext(
          req.user._id
        );

    }


    // ==================================================
    // UNKNOWN ROLE
    // ==================================================

    else {

      prompt =
        guestPrompt;

      context =
        await getGuestContext();

    }


    // ==================================================
    // FINAL PROMPT
    // ==================================================

    const finalPrompt = `

${prompt}

==================================
CURRENT USER CONTEXT
==================================

${JSON.stringify(
  context,
  null,
  2
)}

==================================
CURRENT USER MESSAGE
==================================

${userMessage}

==================================
FINAL OUTPUT REQUIREMENTS
==================================

Return ONLY valid JSON.

Required structure:

{
  "message": "short one-line response",
  "actions": []
}

IMPORTANT:

- Message must be exactly ONE line.
- Prefer 8 to 15 words.
- Maximum 20 words whenever possible.
- Default language is English.
- Adapt to the user's latest language.
- Respect the user's role.
- Follow BaseraMitra website flow.
- Never invent property IDs.
- Never invent property information.
- Never invent routes.
- Use frontend navigation for normal property discovery.
- Do not fetch properties for normal property search.
- Always complete the JSON.
- Never return markdown.
- Never return explanations outside JSON.

`;


    const aiResponse =
      await generateAIResponse(
        userMessage,
        finalPrompt
      );


    return res.status(200).json({

      success: true,

      response:
        aiResponse,

    });

  }


  catch (error) {

    console.error(
      "Chatbot Controller Error:",
      error
    );


    return res.status(500).json({

      success: false,

      message:
        "AI service is temporarily unavailable.",

    });

  }

};