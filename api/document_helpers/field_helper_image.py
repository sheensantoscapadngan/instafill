import cv2
import fitz
import numpy as np
import os
from api.document_helpers.field_helper_geometry import detect_fillable_boxes, filter_non_lines, define_line_objects, find_closest
from api.classes.Geometry import Point
import glob

def pix2np(pix):
    im = np.frombuffer(pix.samples, dtype=np.uint8).reshape(pix.h, pix.w, pix.n)
    im = np.ascontiguousarray(im[..., [2, 1, 0]])
    return im

def convert_pdf_to_img(file):
    pages_img = []
    doc = fitz.open(stream=file, filetype="pdf")
    for i in range(len(doc)):
        pix = doc.getPagePixmap(i,alpha=False)
        img = pix2np(pix)
        img = cv2.cvtColor(img,cv2.COLOR_BGR2GRAY)
        pages_img.append(img)
    return pages_img

def detect_lines(pages_img):
    pages_data = {}
    for i in range(len(pages_img)):
        img = pages_img[i]

        #blur = cv2.GaussianBlur(img, (5, 5), 0)
        thresh = cv2.threshold(
            img, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)[1]
        #thresh = cv2.Canny(thresh, 50, 80, apertureSize=3)

        vertical_kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (1, 15))
        horizontal_kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (15, 1))
        horizontal_connect_kernel = np.ones((1, 4), np.uint8)
        vertical_connect_kernel = np.ones((4, 1), np.uint8)

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
    filled_lines = set()
    fillable_lines = {}

    # identify field to line or box
    for page, fields in fields_dict.items():
        img = pages_img[page-1]
        horizontal_lines, boxes, line_to_box = pages_data[page]
        field_to_position = {}
        for field, field_position in fields.items():
            top_right = field_position['top_right']
            bot_right = field_position['bot_right']
            bot_left = field_position['bot_left']

            base_x = top_right[0]
            base_y = (top_right[1] + bot_right[1]) // 2

            img = cv2.circle(img, (base_x, base_y), radius=1,
                             color=(0, 0, 255), thickness=-1)

            base_point = Point((base_x, base_y))
            center_x = (bot_left[0]+bot_right[0]) // 2

            closest_line = find_closest(base_point, horizontal_lines)
            if closest_line is None:
                continue
            line = closest_line.retrieve_line_definition()

            # if line is part of a box or not
            if closest_line.retrieve_line_definition() not in line_to_box:
                closest_line_def = closest_line.retrieve_line_definition()
                img = cv2.line(
                    img, closest_line_def[0], closest_line_def[1], (128, 128, 128), 3)
                img = cv2.putText(
                    img, field, closest_line_def[0], cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 200, 0), 1)
                field_to_position[field] = {
                    'line': closest_line.retrieve_line_definition(),
                    'center_x': center_x}
                filled_lines.add(closest_line.retrieve_line_definition())
            else:
                box = boxes[line_to_box[closest_line.retrieve_line_definition()]]
                bottom_line = box.retrieve_bottom_line()
                closest_line_def = bottom_line.retrieve_line_definition()
                img = cv2.line(
                    img, closest_line_def[0], closest_line_def[1], (128, 128, 128), 3)
                img = cv2.putText(
                    img, field, closest_line_def[0], cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 200, 0), 1)
                field_to_position[field] = {
                    'line': bottom_line.retrieve_line_definition(),
                    'center_x': center_x}
                filled_lines.add(bottom_line.retrieve_line_definition())

        fields_to_position[page] = field_to_position

    return fields_to_position, pages_data


def extract_fillable_positions(pages_data, used_lines_dict):
    fillable_lines = {}
    for page, used_lines in used_lines_dict.items():
        horizontal_lines, _, _ = pages_data[page]
        page_fillables = []
        for line in horizontal_lines:
            if line.retrieve_line_definition() not in used_lines:
                page_fillables.append(line.retrieve_line_definition())
        fillable_lines[page] = page_fillables
    return fillable_lines


def show_fields(fields_list, pages_img):
    for page, fields in fields_list.items():
        img = pages_img[page-1]
        img = cv2.circle(img, (0, 0), radius=10,
                         color=(0, 0, 255), thickness=-1)
        for field, coords in fields.items():
            top_left = coords['top_left']
            top_right = coords['top_right']
            bot_left = coords['bot_left']
            bot_right = coords['bot_right']
            points = [top_left, top_right, bot_left, bot_right]
            for i, point in enumerate(points):
                modified_point = (int(point[0]), int(point[1]))
                if i == 0:
                    img = cv2.putText(img, field, modified_point,
                                      cv2.FONT_HERSHEY_SIMPLEX, 0.3, (0, 0, 255), 1)
                img = cv2.circle(img, modified_point, radius=4,
                                 color=(0, 0, 255), thickness=-1)

        cv2.imshow("img", img)
        cv2.setMouseCallback("img", onMouse)
        cv2.waitKey(0)


def extract_field_fill_positions(fields,pages_img):
    pages_data = detect_lines(pages_img)
    return match_fields_to_position(fields, pages_data, pages_img)
