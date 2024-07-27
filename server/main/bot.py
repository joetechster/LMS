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
  print(context)
  custom_prompt_template = f"""
You will be given a question and you may or may not be given a context which is just past questions  
try to answer the user question as best you can
make you answer detailed with all information

Question: {question}
Context: {context}
"""

  response = model.generate_content(custom_prompt_template)
  return response

initial = get_response("hi")