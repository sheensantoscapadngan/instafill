from google.cloud import storage
import os

'''
os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = "E:\PROJECTS\instafill_backend\instafill-6fe7e4e642d1.json"
client = storage.Client(project='instafill')
bucket = client.get_bucket('instafill')
'''


def upload_pdf_to_storage(source_file_name):
    blob_name = source_file_name.split('/')[-1]
    blob = bucket.blob(blob_name)
    blob.upload_from_filename(source_file_name)
    file_path = "gs://instafill/" + blob_name
    return file_path, blob_name


def delete_pdf_from_storage(blob_name):
    blob = bucket.blob(blob_name)
    blob.delete()
