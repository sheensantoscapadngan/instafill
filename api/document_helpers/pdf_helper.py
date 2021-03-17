import json
import re
from google.cloud import vision
from google.cloud import storage
from pathlib import Path
import random
import string
import os
from api.json_helpers.func import extract_coords
from api.cloud_storage.cloud_storage_helper import delete_json_from_storage

BATCH_SIZE = 1


def save_pdf_and_master(pdf, master):
    parent_dir = 'api/cloud_storage/pdf_files/'
    string_length = 12
    filename = ''.join(random.choice(string.ascii_uppercase + string.digits)
                       for _ in range(string_length))
    pdf_filename = parent_dir + filename + "_pdf.pdf"
    master_filename = parent_dir + filename + "_master.txt"
    pdf_filepath = Path(pdf_filename)
    master_filepath = Path(master_filename)

    pdf_filepath.write_bytes(pdf)
    master_filepath.write_bytes(master)

    return pdf_filename, master_filename


def delete_pdf_and_master(pdf_filepath, master_document_filepath):
    os.remove(pdf_filepath)
    os.remove(master_document_filepath)


def read_text_from_document(gcs_source_uri, gcs_destination_uri="gs://instafill/result.json"):
    fields = {}
    mime_type = 'application/pdf'
    batch_size = BATCH_SIZE
    client = vision.ImageAnnotatorClient()

    feature = vision.Feature(
        type_=vision.Feature.Type.DOCUMENT_TEXT_DETECTION)

    gcs_source = vision.GcsSource(uri=gcs_source_uri)
    input_config = vision.InputConfig(
        gcs_source=gcs_source, mime_type=mime_type)

    gcs_destination = vision.GcsDestination(uri=gcs_destination_uri)
    output_config = vision.OutputConfig(
        gcs_destination=gcs_destination, batch_size=batch_size)

    async_request = vision.AsyncAnnotateFileRequest(
        features=[feature], input_config=input_config,
        output_config=output_config)

    operation = client.async_batch_annotate_files(
        requests=[async_request])

    print('Waiting for the operation to finish.')
    operation.result(timeout=420)
    storage_client = storage.Client()

    match = re.match(r'gs://([^/]+)/(.+)', gcs_destination_uri)
    bucket_name = match.group(1)
    prefix = match.group(2)

    bucket = storage_client.get_bucket(bucket_name)
    blob_list = list(bucket.list_blobs(prefix=prefix))

    for i, blob in enumerate(blob_list):
        output = blob
        json_string = output.download_as_string()
        response = json.loads(json_string)
        page_coords = extract_coords(response)
        fields[i+1] = page_coords
        delete_json_from_storage(blob.name)

    print("FINISHED VISION OPERATION")
    return fields
