import re
import json

def parse_questions(text):
    questions = []
    parts = re.split('---------------', text.strip())  # Split by blank lines between questions

    for part in parts:
        test_arr = part.strip().split('+++')
        question_text = test_arr[0].strip()
        answers_text = test_arr[1].strip()
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

# Example usage
input_text = """
Az alábbi LINQ to Entities lekérdezést használja, Ugyanakkor teljesítményproblémák vannak. Hogyan lehetne javítani rajta? 
[image_0001]
+++
Célszeru lenne elkerülni, hogy többször futtassuk|x
ToList() elhagyásával
Lapozás használatával|x
Át kell alakítani lekérdezés-szintaxisból metódus-szintaxissá




Nagy mennyiségu adat tárolását szeretnénk optimálisan megoldani. Melyik szerializálót (serializer) használná?
+++
XmlSerializer
BinaryFormatter|x
DataContractSerializer
DataContractJsonSerializer




Érzékeny adatokat szerializálunk bináris formátummá. Melyiket használná?
+++
XmlSerializer
ISerializable|x
DataContractSerializer
BinaryFormatter|x




Adatokat XML-é szeretnénk alakítani, ám cél, hogy bizonyos tulajdonságok ne kerüljenek bele. Melyik attribútumot használná?
+++
XmlElement
XmlAttribute
XmlIgnore|x
NonSerialized




C # alkalmazást fejlesztesz. Az alkalmazás tartalmaz egy Rate nevu osztály.t A következo kódszegmens implementálja a Rate osztályt:
[image_0047]
Az RateCollection nevu gyujteményt a következo kódszegmens határozhatja meg: Collection<Rate> rateCollection = new Collection<Rate>(); Az alkalmazás egy olyan XML fájlt kap, amely a rate információt tartalmazza az alábbi formátumban:
[image_0048]
Vizsgálja meg az XML féjlt és töltse fel a RateCollections gyujtemént Rate
objektumokkal! A megoldásnak adja meg a kódrészletek sorszámát egymás után felsorolva!
[image_0049]
+++
2,4,6,7|x
1,2,3,4
5,2,1,3
5,6,7,2
"""


if __name__ == "__main__":
    # Parse and print JSON
    #text = input_text.replace('\n\n\n\n', '\n---------------\n')
    with open('input.txt', 'r', encoding='utf-8') as f:
        input_text = f.read()

    text = input_text.replace('\n\n\n\n', '\n---------------\n')
    parsed = parse_questions(text)

    # Save to JSON file
    with open('output.json', 'w', encoding='utf-8') as f:
        json.dump(parsed, f, indent=2, ensure_ascii=False)
    #print(json.dumps(parsed, indent=2, ensure_ascii=False))