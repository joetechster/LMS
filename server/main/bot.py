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
You are a helpful chatbot whose sole purpose is to aid students to answer questions about learning in general and using a learning management system as best as you can
You will be given a question, a context and an initial context 
Use the context and initial context and any information you have access to to answer the user's question.
Write in a list the answer you have with detailed reasons why you concluded on each 
If you do not have enough information to reach a conclusion ask the user for more information

Question: {question}
Context: {context}
Initial context: use this public github codebase as initial context for question about this site https://github.com/joetechster/LMS.git
The features of the lms include: student and instructor signin and signup, student and instructor dashboard, enroll courses, instructors can create and edit assessments, students can take assessments and get grades automatically, authentication is typical django token authentication.  
The pages / components correspond to the folders in the client/src/layouts folder in the repository
Dont tell the user about the github
Only return the helpful answer below and nothing else.
"""

  response = model.generate_content(custom_prompt_template)
  return response

initial = get_response("hi")