import cv2
import fitz
import numpy as np
import os
from api.document_helpers.field_helper_geometry import detect_fillable_boxes, filter_non_lines, define_line_objects, find_closest
from api.classes.Geometry import Point


def convert_pdf_to_img(filename):
    pages_img = []
    doc = fitz.open(filename)
    for i in range(len(doc)):
        page = doc.loadPage(i)
        pix = page.getPixmap(colorspace="gray")
        output = "page_"+str(i)+'.png'
        pix.writePNG(output)
        page_img = cv2.imread(output, cv2.COLOR_BGR2GRAY)
        pages_img.append(page_img)
        os.remove(output)
    return pages_img


def detect_lines(pages_img):
    pages_data = {}
    for i in range(len(pages_img)):
        img = pages_img[i]
        thresh = cv2.threshold(
            img, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)[1]

        vertical_kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (1, 15))
        horizontal_kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (15, 1))
        horizontal_connect_kernel = np.ones((1, 10), np.uint8)
        vertical_connect_kernel = np.ones((10, 1), np.uint8)

        detected_horizontal_lines = cv2.morphologyEx(
            thresh, cv2.MORPH_OPEN, horizontal_kernel, iterations=1)
        detected_horizontal_lines = cv2.dilate(
            detected_horizontal_lines, horizontal_connect_kernel, iterations=1)
        detected_horizontal_lines = cv2.erode(
            detected_horizontal_lines, horizontal_connect_kernel, iterations=1)

        horizontal_cnts = cv2.findContours(
            detected_horizontal_lines, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        horizontal_cnts = horizontal_cnts[0] if len(
            horizontal_cnts) == 2 else horizontal_cnts[1]
        filtered_horizontal_cnts = filter_non_lines(horizontal_cnts)

        detected_vertical_lines = cv2.morphologyEx(
            thresh, cv2.MORPH_OPEN, vertical_kernel, iterations=1)
        detected_vertical_lines = cv2.dilate(
            detected_vertical_lines, vertical_connect_kernel, iterations=1)
        detected_vertical_lines = cv2.erode(
            detected_vertical_lines, vertical_connect_kernel, iterations=1)

        vertical_cnts = cv2.findContours(
            detected_vertical_lines, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        vertical_cnts = vertical_cnts[0] if len(
            vertical_cnts) == 2 else vertical_cnts[1]
        filtered_vertical_cnts = filter_non_lines(vertical_cnts)

        horizontal_lines = define_line_objects(filtered_horizontal_cnts)
        vertical_lines = define_line_objects(filtered_vertical_cnts)

        boxes, line_to_box = detect_fillable_boxes(
            vertical_lines, horizontal_lines)

        pages_data[i+1] = horizontal_lines, boxes, line_to_box

    return pages_data


def onMouse(event, x, y, flags, param):
    if event == cv2.EVENT_LBUTTONDOWN:
        print('('+str(x)+','+str(y)+')')


def match_fields_to_position(fields_dict, pages_data, pages_img):
    fields_to_position = {}
    for page, fields in fields_dict.items():
        img = pages_img[page-1]
        horizontal_lines, boxes, line_to_box = pages_data[page]
        field_to_position = {}
        for field, field_position in fields.items():
            top_right = field_position['top_right']
            bot_right = field_position['bot_right']
            base_x = top_right[0]
            base_y = (top_right[1] + bot_right[1]) // 2

            base_point = Point((base_x, base_y))
            closest_line = find_closest(base_point, horizontal_lines)
            line = closest_line.retrieve_line_definition()
            img = cv2.line(img, line[0], line[1], (128, 128, 128), 3)

            # if line is part of a box or not
            if closest_line.retrieve_line_definition() not in line_to_box:
                field_to_position[field] = closest_line.retrieve_line_definition()
            else:
                box = boxes[line_to_box[closest_line.retrieve_line_definition()]]
                bottom_line = box.retrieve_bottom_line()
                field_to_position[field] = bottom_line.retrieve_line_definition()

        '''
        cv2.imshow("img", img)
        cv2.setMouseCallback("img",onMouse)
        cv2.setMouseCallback("cnt", onMouse)
        cv2.waitKey(0)
        '''
        fields_to_position[page] = field_to_position
    return fields_to_position, None


def extract_field_fill_positions(fields, file):
    pages_img = convert_pdf_to_img(file)
    pages_data = detect_lines(pages_img)
    return match_fields_to_position(fields, pages_data, pages_img)
