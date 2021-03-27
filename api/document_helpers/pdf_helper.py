from google.cloud import vision
import cv2
from api.json_helpers.func import extract_coords_from_img
import os

os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = "E:\PROJECTS\instafill_backend\instafill-6fe7e4e642d1.json"

def read_text_from_img(pages_img):
    client = vision.ImageAnnotatorClient()
    fields = {}
    for page_number in range(len(pages_img)):
        page = pages_img[page_number]

        # convert img to bytes
        is_success, im_buf_arr = cv2.imencode(".jpg", page)
        byte_im = im_buf_arr.tobytes()

        image = vision.Image(content=byte_im)
        response = client.text_detection(image=image)
        texts = response.text_annotations

        page_coords = extract_coords_from_img(texts, page)
        fields[page_number+1] = page_coords
    return fields
