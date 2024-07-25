import os
from dotenv import load_dotenv
import google.generativeai as genai

# Load environment variables from .env file
load_dotenv()
# Access the environment variables
gemini_api_key = os.getenv('GEMINI_API_KEY')
print(f"Secret Key: {gemini_api_key}")

genai.configure(api_key=gemini_api_key)
model = genai.GenerativeModel('gemini-1.5-flash')

def get_response(question, context=""):
  custom_prompt_template = f"""
You are a helpful chatbot whose sole purpose is to aid students using a learning management system as best as you can
You will be given a question, a context and an initial context 
Use the context and initial context to aid you in answering the user's question
Write in a list the answer you have with detailed reasons why you concluded on each 
If you do not have enough information to reach a conclusion ask the user for more information
Use any information you have access to to answer the user's question.
If you don't know the answer, just say that you don't know, don't try to make up an answer.
Apart from these don't do anything else

Context: {context}
Question: {question}

Only return the helpful answer below and nothing else.
Helpful answer:
"""

  response = model.generate_content(custom_prompt_template)
  return response

initial = get_response("hi")