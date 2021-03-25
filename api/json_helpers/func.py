import cv2
import json
import math


def onMouse(event, x, y, flags, param):
    if event == cv2.EVENT_LBUTTONDOWN:
        print('('+str(x)+','+str(y)+')')


def format_field_name(word_with_spaces):
    word_with_spaces = ''.join(
        e for e in word_with_spaces if (e.isalnum() or e.isspace()))
    word_with_spaces = ' '.join(word_with_spaces.split())
    word_with_spaces = word_with_spaces.lower()
    word_with_spaces = word_with_spaces.strip()
    return word_with_spaces


def format_word(word):
    word = ''.join(
        e for e in word if (e.isalnum() or e.isspace()))
    word = word.lower()
    word = word.strip()
    return word


def extract_ext_details(ext):
    try:
        pipe_split = ext.split('|')
        comma_split = pipe_split[1].split(',')
        word_value = format_word(pipe_split[0])
        return word_value, comma_split
    except:
        return None, None


def is_connected(current_pos, candidate_pos):
    vertical_thresh = 5
    horizontal_thresh = 15

    # current pos
    bot_right = (float(current_pos[4]),
                 float(current_pos[5]))

    # candidate pos
    bot_left = (float(candidate_pos[6]),
                float(candidate_pos[7]))

    horizontal_diff = abs(bot_left[0]-bot_right[0])
    vertical_diff = abs(bot_left[1]-bot_right[1])

    if horizontal_diff < horizontal_thresh and vertical_diff < vertical_thresh:
        return True
    else:
        return False


def extract_words_and_positions(response):
    result = ""
    for text in response[1:]:
        field_name = text.description
        result += field_name + '|'
        for i, vertex in enumerate(text.bounding_poly.vertices):
            result += str(vertex.x) + ',' + str(vertex.y)
            if i != len(text.bounding_poly.vertices) - 1:
                result += ','
        result += '\n'
    return result


def get_final_pos(start_pos, end_pos):
    pos = {}
    pos['top_left'] = (int(start_pos[0]), int(start_pos[1]))
    pos['bot_left'] = (int(start_pos[6]), int(start_pos[7]))
    pos['top_right'] = (int(end_pos[2]), int(end_pos[3]))
    pos['bot_right'] = (int(end_pos[4]), int(end_pos[5]))
    return pos


def display_field_boxes(fields, img):
    for field, positions in fields.items():
        for label, position in positions.items():
            img = cv2.circle(img, position, radius=1,
                             color=(0, 0, 255), thickness=-1)
    cv2.imshow("res", img)
    cv2.waitKey(0)


def extract_coords_from_img(response, page):
    fields = {}
    words_and_positions = extract_words_and_positions(response)
    used_fields = set()
    repeat_count = 0

    ind = 0
    ext_data_list = words_and_positions.split('\n')
    while ind < len(ext_data_list):
        current_word, current_pos = extract_ext_details(ext_data_list[ind])
        start_pos = current_pos
        ind += 1
        while ind < len(ext_data_list):
            candidate_line = ext_data_list[ind]
            candidate_word, candidate_pos = extract_ext_details(candidate_line)

            if candidate_word is None:
                break

            if is_connected(current_pos, candidate_pos):
                current_word += ' ' + candidate_word
                current_pos = candidate_pos
                ind += 1
            else:
                break
        if current_word is None:
            continue
        if any(c for c in current_word if c.isalnum()):
            final_pos = get_final_pos(start_pos, current_pos)
            if current_word not in used_fields:
                fields[current_word] = final_pos
                used_fields.add(current_word)
            else:
                current_repeat_val = "*_" + str(repeat_count)
                repeat_count += 1
                fields[current_repeat_val] = final_pos
    return fields
