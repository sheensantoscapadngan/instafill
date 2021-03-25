import json
import re
from google.cloud import vision
from google.cloud import storage
from pathlib import Path
import random
import string
import os
import io
import cv2
from api.json_helpers.func import extract_coords_from_img
from api.cloud_storage.cloud_storage_helper import delete_json_from_storage
from api.document_helpers.field_helper_image import convert_pdf_to_img
import shutil

BATCH_SIZE = 1


def save_pdf_and_master(pdf, master):
    parent_dir = 'api/cloud_storage/pdf_files/'
    string_length = 12
    filename = ''.join(random.choice(string.ascii_uppercase + string.digits)
                       for _ in range(string_length))

    pdf_filedir = parent_dir + 'pdf-img/' + filename
    Path(pdf_filedir).mkdir(parents=True, exist_ok=True)

    pages_img = convert_pdf_to_img(pdf, pdf_filedir)
    master_filename = parent_dir + 'master/' + filename + "_master.txt"
    master_filepath = Path(master_filename)
    master_filepath.write_bytes(master)

    return pdf_filedir, pages_img, master_filename


def delete_pdf_and_master(pdf_dir, master_document_filepath):
    shutil.rmtree(pdf_dir)
    os.remove(master_document_filepath)


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
