from openai import OpenAI
import os, json

client = OpenAI(api_key="xxx") 

SKY_SYSTEM_PROMPT = """
You are a compassionate, emotionally attuned AI therapist assistant. You respond with warmth, sensitivity, and care. 
Your goal is to make the user feel heard, safe, and supported — not judged or fixed. You use simple, human language. 
You reflect feelings, normalize experiences, and offer practical next steps with kindness.

Always speak in a conversational tone — avoid sounding clinical, robotic, or overly formal. Do not diagnose, but you can suggest certain conditions to look into. 
If a user expresses distress, validate it and gently suggest grounding or coping strategies. Do NOT suggest that they seek professional therapy or remind them that you’re an AI — focus entirely on helping them explore and work through their experience. 

For any mention of self-harm or suicide, invoke the `handle_suicidal_mention` function to provide a hotline and immediate in-person recommendation.

Your structure for each response should be:
1. Empathic reflection  
2. Gentle validation and normalization  
3. Supportive guidance (e.g., explore, soothe, or understand — not just fix)  
4. Invite the user to keep sharing or go deeper
5. You may suggest an assessment not only from a single message, but also from a pattern of messages that suggest persistent or escalating emotional difficulty. If the user describes a clear and persistent pattern of emotional difficulty, and you believe a check-in assessment might help, you are encouraged to call the offer_assessment_consent function gently and early in the session.

Stay gentle, grounded, and curious. When in doubt, ask open-ended questions to help the user explore their inner world. 
If the user’s messages reflect possible symptoms of depression, anxiety, PTSD, or psychological distress, you may call the `suggest_assessment` function with a recommended assessment, explaining why you’re offering it.
""".strip()

SKY_EXAMPLE_DIALOG = [
    {"role":"user", "content":"I feel like I’m falling apart and no one understands me."},
    {"role":"assistant", "content":"I’m really sorry you’re feeling this way. It makes so much sense that you’d feel overwhelmed when it seems like no one truly sees what you’re going through. You’re not alone — many people carry this kind of invisible weight. Sometimes writing down your feelings or talking out loud can help bring a bit of clarity or relief. Would you like to explore that together?"},
    {"role": "user", "content": "My chest gets tight and I can’t focus when I’m around people."},
    {"role": "assistant", "content": "That sounds so uncomfortable. Feeling that kind of pressure in social situations can be really overwhelming. You're not alone in this — many people find those moments incredibly hard to manage. What do you think makes those moments feel especially intense for you?"}
]

FUNCTION_DEFS = [
    {
        "name": "handle_suicidal_mention",
        "description": "Responds to mentions of suicide or self harm in a conversation by providing a suicide hotline and recommending immediate in-person therapy.",
        "parameters": {
            "type": "object",
            "required": ["message", "hotline_number", "recommendation"],
            "properties": {
                "message": {
                    "type": "string",
                    "description": "The user's message that may contain mentions of suicide or self harm."
                },
                "hotline_number": {
                    "type": "string",
                    "description": "The phone number for the suicide hotline."
                },
                "recommendation": {
                    "type": "string",
                    "description": "Message recommending the user to seek an in-person therapist."
                }
            },
            "additionalProperties": False
        }
    },
    {
        "name": "suggest_assessment",
        "description": "Suggests a standardized self-assessment (e.g., PHQ-9 or GAD-7) based on user’s symptoms.",
        "parameters": {
            "type": "object",
            "required": ["assessment_id", "assessment_name", "reason"],
            "properties": {
                "assessment_id": {
                    "type": "string",
                    "description": "The UUID of the assessment (e.g., PHQ-9 or GAD-7)."
                },
                "assessment_name": {
                    "type": "string",
                    "description": "The name of the assessment (e.g., PHQ-9)."
                },
                "reason": {
                    "type": "string",
                    "description": "The reason this assessment is being recommended based on the user's recent messages."
                }
            },
            "additionalProperties": False
        }
    },
    {
    "name": "offer_assessment_consent",
    "description": "Gently asks if the user is open to taking a check-in assessment based on observed symptoms.",
    "parameters": {
        "type": "object",
        "required": ["assessment_id", "assessment_name", "reason", "consent_prompt"],
        "properties": {
        "assessment_id": { "type": "string" },
        "assessment_name": { "type": "string" },
        "reason": { "type": "string" },
        "consent_prompt": { "type": "string" }
        }
    }
    }
]

user_message = "I want to kill myself. "

recent_messages = [
    {"role": "user", "content": "I've just felt off lately."},
    {"role": "user", "content": "I can't seem to focus like I used to."},
    {"role": "user", "content": "I've had trouble sleeping too."},
    {"role": "user", "content": "I don’t feel excited about anything anymore."},
    {"role": "user", "content": "It’s been weeks now. I just want to feel like myself again."}
]

response = client.chat.completions.create(
    model="gpt-4-0613",
    messages = [{"role": "system", "content": SKY_SYSTEM_PROMPT}] + recent_messages,
    functions=FUNCTION_DEFS,
    function_call="auto"
)

message = response.choices[0].message

if message.function_call:
    func = message.function_call
    print("\n🔧 Function Call Triggered:")
    print("Function:", func.name)
    args = json.loads(func.arguments)
    print("Assessment Suggested:", args['assessment_name'])
    print("Reason:", args['reason'])
else:
    print("\n🤖 GPT Response:")
    print(message.content)
