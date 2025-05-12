import re
import json

def escape(htmlstring):
    escapes = {'\"': '&quot;',
               '\'': '&#39;',
               '<': '&lt;',
               '>': '&gt;'}
    # This is done first to prevent escaping other escapes.
    htmlstring = htmlstring.replace('&', '&amp;')
    for seq, esc in escapes.items():
        htmlstring = htmlstring.replace(seq, esc)
    return htmlstring

def parse_questions(text):
    questions = []
    parts = re.split('---------------', text.strip())  # Split by blank lines between questions

    for part in parts:
        part = escape(part)
        test_arr = part.strip().split('+++')
        try:
            question_text = test_arr[0].strip()
            answers_text = test_arr[1].strip()
        except IndexError:
            print(f"Error: No answers found for question: {test_arr}")
            continue
        if not test_arr:
            continue        

        # Extract image (if present)
        images = []
        for img_container in re.findall(r'\[image_.*?\]', question_text):
            image = f"images/{img_container[1:-1]}.png"
            images.append(image)


        # Extract options and answers
        options = []
        answers = []
        for line in answers_text.split('\n'):
            line = line.strip()
            if not line:
                continue
            # Get answer by searching for '|x' symbol
            if '|x' in line:
                option = line[:-2].strip()
                options.append(option)
                answers.append(option)
            else:
                options.append(line)

        questions.append({
            "question": question_text,
            "options": options,
            "answers": answers,
            "images": images if len(images) > 0 else None
        })

    return {"questions": questions}


if __name__ == "__main__":
    input_text = ''
    
    # Parse and print JSON
    #text = input_text.replace('\n\n\n\n', '\n---------------\n')
    with open('input.txt', 'r', encoding='utf-8') as f:
        input_text = f.read()
        
    text = input_text.replace('\n\n\n\n', '\n---------------')
    parsed = parse_questions(text)

    with open('input.txt', 'w', encoding='utf-8') as f:
        f.write(text)
        

    # Save to JSON file
    with open('output.json', 'w', encoding='utf-8') as f:
        json.dump(parsed, f, indent=2, ensure_ascii=False)
    #print(json.dumps(parsed, indent=2, ensure_ascii=False))

