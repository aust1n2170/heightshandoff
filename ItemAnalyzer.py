import os
import base64
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()
client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

def analyze_image(image_path):
    print(f"Using image path: {image_path}")
    
    try:
        with open(image_path, "rb") as image_file:
            base64_image = base64.b64encode(image_file.read()).decode('utf-8')
        
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": """Analyze this item for a college thrift marketplace. Provide:
                            1. Item name and category (furniture, electronics, clothing, books, kitchen, decor, other)
                            2. Condition (like new/good/fair/poor)
                            3. Brief description (1 sentence)
                            4. Suggested price ($X-$Y or FREE if low value)
                            
                            Return as JSON with keys: name, category, condition, description, price"""
                        },
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/jpeg;base64,{base64_image}"
                            }
                        }
                    ]
                }
            ],
            max_tokens=500
        )
        
        result = response.choices[0].message.content
        
        print(result)
        print(f"\nTokens used: {response.usage.total_tokens}")
        
    except Exception as e:
        print(f"Error: {str(e)}")

if __name__ == "__main__":
    image_path = input("Enter path to image file: ").strip()
    
    if not image_path:
        print("\nNo local image provided.")
    else:
        analyze_image(image_path)