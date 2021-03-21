import cv2
import json

word_data = {"data": []}


def extract_merg_data(data):
    return data['responses'][0]['fullTextAnnotation']['text']


def extract_ext_data(data):
    content = ""
    blocks = data['responses'][0]['fullTextAnnotation']['pages'][0]['blocks']
    for block in blocks:
        for paragraph in block['paragraphs']:
            words = paragraph['words']
            for word in words:
                word_formed = ""
                vertices = word['boundingBox']['normalizedVertices']
                symbols = word['symbols']
                for symbol in symbols:
                    word_formed += symbol['text']
                vertices.reverse()
                content += word_formed+"|"
                for i, coord in enumerate(vertices):
                    content += str(coord['y']) + ',' + str(coord['x'])
                    if i < len(vertices) - 1:
                        content += ','
                content += '\n'
    return content


def extract_page_dims(data):
    width = data['responses'][0]['fullTextAnnotation']['pages'][0]['width']
    height = data['responses'][0]['fullTextAnnotation']['pages'][0]['height']
    return width, height


def onMouse(event, x, y, flags, param):
    if event == cv2.EVENT_LBUTTONDOWN:
        print('('+str(x)+','+str(y)+')')


def extract_coords(data):
    # Extract relevant json data to fin_data var
    fields = {}
    page_dims = extract_page_dims(data)
    merg_data = extract_merg_data(data)
    ext_data = extract_ext_data(data)

    n_split = merg_data.split('\n')
    word_list = []
    for line in ext_data.splitlines():
        word_list.append(line)

    ind = 0
    for complete_word in n_split:
        current_word = ""
        word_with_spaces = complete_word
        complete_word = complete_word.replace(" ", "")
        if ind >= len(word_list):
            continue

        pipe_split = word_list[ind].split('|')
        comma_split = pipe_split[1].split(',')
        word_value = pipe_split[0]
        top_left = (float(comma_split[7])*page_dims[0],
                    float(comma_split[6])*page_dims[1])
        bot_left = (float(comma_split[1])*page_dims[0],
                    float(comma_split[0])*page_dims[1])
        current_word += word_value
        ind += 1

        # repeat until it becomes equal
        while current_word != complete_word:
            if ind >= len(word_list):
                break
            pipe_split = word_list[ind].split('|')
            comma_split = pipe_split[1].split(',')
            word_value = pipe_split[0]
            current_word += word_value
            ind += 1

        top_right = (float(comma_split[5])*page_dims[0],
                     float(comma_split[4])*page_dims[1])
        bot_right = (float(comma_split[3])*page_dims[0],
                     float(comma_split[2])*page_dims[1])

        print("GROUP:", word_with_spaces)
        print("FORMED:", current_word)
        print(complete_word + "\n" + str(top_left) + " " + str(top_right) +
              "\n" + str(bot_left) + " " + str(bot_right))
        print("-----------------")

        fields[word_with_spaces] = {'top_left': top_left, 'top_right': top_right,
                                    'bot_left': bot_left, 'bot_right': bot_right}

    return fields
