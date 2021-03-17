import cv2
import json

word_data = { "data":[]}

def fill_word(word_cont, y_botleft, x_botleft, y_botright, x_botright, y_topright, x_topright, y_topleft, x_topleft):
    word = {}
    word["word"]=word_cont
    word["y_botleft"]=y_botleft
    word["x_botleft"]=x_botleft
    word["y_botright"]=y_botright
    word["x_botright"]=x_botright
    word["y_topright"]=y_topright
    word["x_topright"]=x_topright
    word["y_topleft"]=y_topleft
    word["x_topleft"]=x_topleft
    add_word(word)

def add_word(word):
    word_data["data"].append(word)

def extract_merg_data(data):
    return data['responses'][0]['fullTextAnnotation']['text']

def extract_ext_data(data):
    content = ""
    blocks = data['responses'][0]['fullTextAnnotation']['pages'][0]['blocks']
    for block in blocks:
        #words = block['paragraphs'][0]['words']
        for paragraph in block['paragraphs']:
            words = paragraph['words']
            for word in words:
                word_formed = ""
                vertices = word['boundingBox']['normalizedVertices']
                symbols = word['symbols']
                for symbol in symbols:
                    word_formed += symbol['text']
                if not any(c.isalnum() for c in word_formed): continue
                vertices.reverse()
                content += word_formed+"|";
                for i,coord in enumerate(vertices):
                    content += str(coord['y']) + ',' + str(coord['x'])
                    if i < len(vertices)- 1: content += ','
                content += '\n'
    return content

def extract_page_dims(data):
    width = data['responses'][0]['fullTextAnnotation']['pages'][0]['width']
    height = data['responses'][0]['fullTextAnnotation']['pages'][0]['height']
    return width,height


def onMouse(event, x, y, flags, param):
    if event == cv2.EVENT_LBUTTONDOWN:
       print('('+str(x)+','+str(y)+')')

def extract_coords(data):
    # Extract relevant json data to fin_data var
    fields = {}
    page_dims = extract_page_dims(data)
    merg_data = extract_merg_data(data)
    ext_data = extract_ext_data(data)

    '''
    print("EXT_DATA:",ext_data)
    print('-----------------------')
    print("MERG_DATA:",merg_data)
    '''

    n_split = merg_data.split('\n')
    word_list = []
    for line in ext_data.splitlines():
        word_list.append(line)

    lower = 0
    upper = 0

    '''
    img = cv2.imread(r'E:\PROJECTS\instafill_backend\api\page_0.png',cv2.IMREAD_GRAYSCALE)
    for line in word_list:

        pipe_split = line.split('|')
        comma_split = pipe_split[1].split(',')

        bot_left = (float(comma_split[1]) * page_dims[0], float(comma_split[0])*page_dims[1])
        bot_right = (float(comma_split[3]) * page_dims[0], float(comma_split[2]) * page_dims[1])
        top_right = (float(comma_split[5]) * page_dims[0], float(comma_split[4]) * page_dims[1])
        top_left = (float(comma_split[7]) * page_dims[0], float(comma_split[6]) * page_dims[1])

        points = [bot_left,bot_right,top_right,top_left]
        for point in points:
            img = cv2.circle(img,(int(point[0]),int(point[1])), radius=4, color=(0, 0, 255), thickness=-1)

        #fields[pipe_split[0]] = {'top_left':top_left,'top_right':top_right,'bot_left':bot_left,'bot_right':bot_right}
    cv2.imshow("img",img)
    cv2.setMouseCallback("img",onMouse)
    '''

    for group in n_split:
        indiv_split = group.split()
        size = len(indiv_split)
        if lower == 0:
            upper += size-1
        else:
            upper += size

        # lower
        low_line = word_list[lower]
        pipe_split = low_line.split("|")
        comma_split = pipe_split[1].split(",")
        top_left = (float(comma_split[7])*page_dims[0], float(comma_split[6])*page_dims[1])
        bot_left = (float(comma_split[1])*page_dims[0], float(comma_split[0])*page_dims[1])

        # upper
        up_line = word_list[upper]
        pipe_split = up_line.split("|")
        comma_split = pipe_split[1].split(",")
        top_right = (float(comma_split[5])*page_dims[0], float(comma_split[4])*page_dims[1])
        bot_right = (float(comma_split[3])*page_dims[0], float(comma_split[2])*page_dims[1])

        '''
        print("GROUP:",group)
        print("LOW:",low_line)
        print("UP:",up_line)
        print(group + "\n" + str(top_left) + " " + str(top_right) + "\n" + str(bot_left) + " " + str(bot_right))
        print("-----------------")
        '''

        fields[group] = {'top_left':top_left,'top_right':top_right,'bot_left':bot_left,'bot_right':bot_right}
        lower = upper+1

    #cv2.waitKey(0)
    return fields


'''
with open('E:\PROJECTS\instafill_backend\output-1-to-1.json', 'r') as input:
    data = json.load(input)
extract_coords(data)
'''